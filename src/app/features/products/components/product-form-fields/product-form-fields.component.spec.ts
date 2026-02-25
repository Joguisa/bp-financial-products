import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { delay, of } from 'rxjs';
import { ProductFormFieldsComponent } from './product-form-fields.component';
import { ProductsApiService } from '../../services/products-api.service';
import { FinancialProduct } from '../../models/product.model';

describe('ProductFormFieldsComponent', () => {
  let component: ProductFormFieldsComponent;
  let fixture: ComponentFixture<ProductFormFieldsComponent>;
  let componentRef: ComponentRef<ProductFormFieldsComponent>;
  let apiMock: Partial<ProductsApiService>;

  const mockProduct: FinancialProduct = {
    id: 'prod-001',
    name: 'Tarjeta de Crédito',
    description: 'Visa Gold con beneficios premium',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: '2026-06-15',
    date_revision: '2027-06-15'
  };

  beforeEach(async () => {
    apiMock = {
      verifyId: jest.fn().mockReturnValue(of(false))
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormFieldsComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductsApiService, useValue: apiMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormFieldsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario vacío', () => {
    expect(component.form).toBeTruthy();
    expect(component.control('id').value).toBe('');
    expect(component.control('name').value).toBe('');
  });

  describe('validaciones', () => {
    it('debe marcar el formulario como inválido si está vacío', () => {
      expect(component.form.valid).toBe(false);
    });

    it('debe validar campo requerido', () => {
      const nameCtrl = component.control('name');
      nameCtrl.markAsTouched();

      expect(nameCtrl.hasError('required')).toBe(true);
    });

    it('debe validar longitud mínima del nombre', () => {
      const nameCtrl = component.control('name');
      nameCtrl.setValue('AB');
      nameCtrl.markAsTouched();

      expect(nameCtrl.hasError('minLengthTrimmed')).toBe(true);
    });

    it('debe validar longitud máxima del ID', () => {
      const idCtrl = component.control('id');
      idCtrl.setValue('12345678901');
      idCtrl.markAsTouched();

      expect(idCtrl.hasError('maxLengthTrimmed')).toBe(true);
    });

    it('debe validar longitud mínima de la descripción', () => {
      const descCtrl = component.control('description');
      descCtrl.setValue('Corta');
      descCtrl.markAsTouched();

      expect(descCtrl.hasError('minLengthTrimmed')).toBe(true);
    });

    it('debe validar que la fecha no sea pasada', () => {
      const releaseCtrl = component.control('date_release');
      releaseCtrl.setValue('2020-01-01');
      releaseCtrl.markAsTouched();

      expect(releaseCtrl.hasError('dateInPast')).toBe(true);
    });

    it('debe aceptar formulario válido', fakeAsync(() => {
      component.form.patchValue({
        id: 'new-001',
        name: 'Producto Nuevo',
        description: 'Descripción del producto nuevo',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2027-01-15'
      });
      component.control('id').markAsTouched();

      tick(400);
      fixture.detectChanges();

      expect(component.form.valid).toBe(true);
    }));

    it('debe mostrar error si el ID ya existe', fakeAsync(() => {
      (apiMock.verifyId as jest.Mock).mockReturnValue(of(true));

      const idCtrl = component.control('id');
      idCtrl.setValue('existing');
      idCtrl.markAsTouched();

      tick(400);
      fixture.detectChanges();

      expect(idCtrl.hasError('idExists')).toBe(true);
    }));
  });

  describe('auto-cálculo de fecha de revisión', () => {
    it('debe calcular fecha de revisión al cambiar fecha de liberación', () => {
      component.control('date_release').setValue('2026-03-15');
      fixture.detectChanges();

      expect(component.control('date_revision').value).toBe('2027-03-15');
    });

    it('debe limpiar fecha de revisión si se limpia liberación', () => {
      component.control('date_release').setValue('2026-03-15');
      fixture.detectChanges();

      component.control('date_release').setValue('');
      fixture.detectChanges();

      expect(component.control('date_revision').value).toBe('');
    });
  });

  describe('modo edición', () => {
    it('debe rellenar el formulario con datos del producto', () => {
      componentRef.setInput('isEditMode', true);
      componentRef.setInput('product', mockProduct);
      fixture.detectChanges();

      expect(component.control('name').value).toBe('Tarjeta de Crédito');
      expect(component.control('description').value).toBe('Visa Gold con beneficios premium');
      expect(component.control('logo').value).toBe('https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg');
    });

    it('debe deshabilitar el campo ID en modo edición', () => {
      componentRef.setInput('isEditMode', true);
      componentRef.setInput('product', mockProduct);
      fixture.detectChanges();

      expect(component.control('id').disabled).toBe(true);
    });

    it('debe eliminar validadores async del ID en modo edición', () => {
      componentRef.setInput('isEditMode', true);
      componentRef.setInput('product', mockProduct);
      fixture.detectChanges();

      expect(component.control('id').asyncValidator).toBeNull();
    });
  });

  describe('submit', () => {
    it('no debe emitir si el formulario es inválido', () => {
      const emitSpy = jest.spyOn(component.formSubmit, 'emit');

      component.onSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('debe emitir el producto al hacer submit válido', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.formSubmit, 'emit');

      component.form.patchValue({
        id: 'new-001',
        name: 'Producto Nuevo',
        description: 'Descripción del producto nuevo',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2027-01-15'
      });

      tick(400);
      fixture.detectChanges();

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'new-001',
          name: 'Producto Nuevo',
          date_revision: '2028-01-15'
        })
      );
    }));
  });

  describe('reset', () => {
    it('debe limpiar el formulario en modo creación', () => {
      component.control('name').setValue('Test');
      component.onReset();

      expect(component.control('name').value).toBe('');
    });

    it('debe restaurar valores originales en modo edición', () => {
      componentRef.setInput('isEditMode', true);
      componentRef.setInput('product', mockProduct);
      fixture.detectChanges();

      component.control('name').setValue('Modificado');
      component.onReset();

      expect(component.control('name').value).toBe('Tarjeta de Crédito');
    });
  });
});