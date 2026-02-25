import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductsStore } from '../../services/products-store.service';
import { ProductsApiService } from '../../services/products-api.service';
import { NotificationService } from '@core/services/notification.service';
import { FinancialProduct } from '../../models/product.model';
import { convertToParamMap } from '@angular/router';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let storeMock: Partial<ProductsStore>;
  let routerMock: Partial<Router>;
  let notificationsMock: Partial<NotificationService>;
  let apiMock: Partial<ProductsApiService>;

  const mockProduct: FinancialProduct = {
    id: 'prod-001',
    name: 'Tarjeta de Crédito',
    description: 'Visa Gold con beneficios premium',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: '2026-06-15',
    date_revision: '2027-06-15'
  };

  function setup(routeId: string | null = null, productExists = true) {
    const paramMapSubject = new Subject();

    storeMock = {
      getProductById: jest.fn().mockReturnValue(productExists ? mockProduct : undefined),
      createProduct: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
      loading: signal('success' as const).asReadonly(),
      filteredProducts: signal<FinancialProduct[]>([]).asReadonly(),
      filteredCount: signal(0).asReadonly(),
      pageSize: signal(5).asReadonly()
    };

    routerMock = { navigate: jest.fn() };
    notificationsMock = { success: jest.fn(), error: jest.fn() };
    apiMock = { verifyId: jest.fn().mockReturnValue(of(false)) };

    TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        { provide: ProductsStore, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: NotificationService, useValue: notificationsMock },
        { provide: ProductsApiService, useValue: apiMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap(routeId ? { id: routeId } : {}))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('modo creación', () => {
    beforeEach(() => setup(null));

    it('debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe detectar modo creación', () => {
      expect(component.isEditMode()).toBe(false);
      expect(component.title()).toBe('Formulario de Registro');
    });

    it('debe tener producto null', () => {
      expect(component.product()).toBeNull();
    });

    it('debe crear producto al hacer submit', () => {
      const newProduct: FinancialProduct = {
        id: 'new-001',
        name: 'Producto Nuevo',
        description: 'Descripción nueva del producto',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2027-01-15',
        date_revision: '2028-01-15'
      };

      component.onFormSubmit(newProduct);

      expect(storeMock.createProduct).toHaveBeenCalledWith(newProduct);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(notificationsMock.success).toHaveBeenCalledWith('Producto creado exitosamente');
    });
  });

  describe('modo edición', () => {
    beforeEach(() => setup('prod-001', true));

    it('debe detectar modo edición', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.title()).toBe('Editar Producto');
    });

    it('debe cargar el producto existente', () => {
      expect(storeMock.getProductById).toHaveBeenCalledWith('prod-001');
      expect(component.product()).toEqual(mockProduct);
    });

    it('debe actualizar producto al hacer submit', () => {
      const updated = { ...mockProduct, name: 'Modificado' };

      component.onFormSubmit(updated);

      expect(storeMock.updateProduct).toHaveBeenCalledWith('prod-001', updated);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(notificationsMock.success).toHaveBeenCalledWith('Producto actualizado exitosamente');
    });
  });

  describe('producto inexistente', () => {
    beforeEach(() => setup('no-existe', false));

    it('debe redirigir y mostrar error si el producto no existe', () => {
      expect(notificationsMock.error).toHaveBeenCalledWith('Producto no encontrado');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('navegación', () => {
    beforeEach(() => setup(null));

    it('debe navegar al inicio con goBack', () => {
      component.goBack();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});