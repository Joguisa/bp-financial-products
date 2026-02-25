import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { ProductFormFieldsComponent } from '@features/products/components/product-form-fields/product-form-fields.component';
import { FinancialProduct } from '@features/products/models/product.model';
import { ProductsStore } from '@features/products/services/products-store.service';
import { map } from 'rxjs';

@Component({
  selector: 'bp-product-form',
  standalone: true,
  imports: [ProductFormFieldsComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(ProductsStore);
  private readonly notifications = inject(NotificationService);

  private readonly routeId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );

  readonly productId = computed(() => this.routeId());
  readonly isEditMode = computed(() => this.productId() !== null);

  readonly product = computed<FinancialProduct | null>(() => {
    const id = this.productId();
    if (!id) return null;

    return this.store.getProductById(id) ?? null;
  });

  readonly title = computed(() =>
    this.isEditMode() ? 'Editar Producto' : 'Nuevo Producto'
  );

  constructor() {
    effect(() => {
      if (this.isEditMode() && !this.product()) {
        this.notifications.error('Producto no encontrado');
        this.router.navigate(['/']);
      }
    });

  }

  onFormSubmit(product: FinancialProduct): void {

    if (this.isEditMode()) {
      this.store.updateProduct(this.productId()!, product)
        .subscribe(() => {
          this.notifications.success('Producto actualizado exitosamente');
          this.router.navigate(['/']);
        });
    } else {
      this.store.createProduct(product)
        .subscribe(() => {
          this.notifications.success('Producto creado exitosamente');
          this.router.navigate(['/']);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}