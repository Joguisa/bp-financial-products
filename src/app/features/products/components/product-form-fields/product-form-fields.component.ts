import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FinancialProduct } from '@features/products/models/product.model';
import { ProductsApiService } from '@features/products/services/products-api.service';
import { calculateRevisionDate } from '@shared/utils/date.utils';
import { minLengthTrimmed, maxLengthTrimmed, uniqueId, dateNotInPast } from '@shared/validators/custom-validators';
import { startWith } from 'rxjs';

@Component({
  selector: 'bp-product-form-fields',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form-fields.component.html',
  styleUrl: './product-form-fields.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormFieldsComponent {
  isEditMode = input(false);
  product = input<FinancialProduct | null>(null);
  formSubmit = output<FinancialProduct>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProductsApiService);

  readonly form = this.buildForm();

  private readonly releaseSignal = toSignal(
    this.form.controls.date_release.valueChanges.pipe(
      startWith(this.form.controls.date_release.value)
    ),
    { initialValue: this.form.controls.date_release.value }
  );

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.patchForm(product);
      }
    });

    effect(() => {
      const release = this.releaseSignal();
      if (!release) {
        this.form.controls.date_revision.setValue('', { emitEvent: false });
        return;
      }
      this.form.controls.date_revision.setValue(
        calculateRevisionDate(release),
        { emitEvent: false }
      );
    });
  }

  private buildForm() {
    return this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(
        '',
        {
          validators: [Validators.required, minLengthTrimmed(3), maxLengthTrimmed(10)],
          asyncValidators: [uniqueId(id => this.api.verifyId(id))]
        }
      ),
      name: this.fb.nonNullable.control('', [
        Validators.required, minLengthTrimmed(5), maxLengthTrimmed(100)
      ]),
      description: this.fb.nonNullable.control('', [
        Validators.required, minLengthTrimmed(10), maxLengthTrimmed(200)
      ]),
      logo: this.fb.nonNullable.control('', [Validators.required]),
      date_release: this.fb.nonNullable.control('', [Validators.required, dateNotInPast]),
      date_revision: this.fb.nonNullable.control({ value: '', disabled: true })
    });
  }

  private patchForm(product: FinancialProduct): void {
    this.form.reset(product);

    if (this.isEditMode()) {
      const idControl = this.form.controls.id;
      idControl.disable();
      idControl.clearAsyncValidators();
      idControl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.pending) return;
    this.formSubmit.emit(this.form.getRawValue());
  }

  onReset(): void {
    if (this.isEditMode()) {
      const product = this.product();
      if (product) {
        this.patchForm(product);
      }
    } else {
      this.form.reset();
    }
  }
  control<K extends keyof typeof this.form.controls>(name: K) {
    return this.form.controls[name];
  }
}