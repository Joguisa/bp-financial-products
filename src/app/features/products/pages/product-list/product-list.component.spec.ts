import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { NotificationService } from '@core/services/notification.service';
import { LoadingState, FinancialProduct } from '@features/products/models/product.model';
import { ProductsStore } from '@features/products/services/products-store.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let storeMock: Partial<ProductsStore>;
  let routerMock: Partial<Router>;
  let notificationsMock: Partial<NotificationService>;

  let loadingSignal: WritableSignal<LoadingState>;
  let productsSignal: WritableSignal<FinancialProduct[]>;
  let filteredCountSignal: WritableSignal<number>;
  let pageSizeSignal: WritableSignal<number>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'prod-001',
      name: 'Tarjeta de Crédito',
      description: 'Visa Gold',
      logo: 'https://example.com/visa.png',
      date_release: '2026-01-15',
      date_revision: '2027-01-15'
    }
  ];

  beforeEach(async () => {
    loadingSignal = signal<LoadingState>('idle');
    productsSignal = signal<FinancialProduct[]>([]);
    filteredCountSignal = signal(0);
    pageSizeSignal = signal(5);

    storeMock = {
      loading: loadingSignal.asReadonly(),
      filteredProducts: productsSignal.asReadonly(),
      filteredCount: filteredCountSignal.asReadonly(),
      pageSize: pageSizeSignal.asReadonly(),
      loadProducts: jest.fn(),
      setSearch: jest.fn(),
      setPageSize: jest.fn(),
      deleteProduct: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    notificationsMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductsStore, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: NotificationService, useValue: notificationsMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe llamar loadProducts en OnInit', () => {
    fixture.detectChanges();
    expect(storeMock.loadProducts).toHaveBeenCalled();
  });

  it('debe mostrar skeleton mientras carga', () => {
    loadingSignal.set('loading');
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('bp-skeleton-table');
    expect(skeleton).toBeTruthy();
  });

  it('debe mostrar la tabla cuando termina de cargar', () => {
    loadingSignal.set('success');
    productsSignal.set(mockProducts);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('bp-product-table');
    expect(table).toBeTruthy();
  });

  it('debe navegar a /add al hacer click en Agregar', () => {
    fixture.detectChanges();

    component.navigateToAdd();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add']);
  });

  it('debe navegar a /edit/:id al editar', () => {
    fixture.detectChanges();

    component.onEdit(mockProducts[0]);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/edit', 'prod-001']);
  });

  it('debe llamar setSearch al buscar', () => {
    fixture.detectChanges();

    component.onSearch('tarjeta');
    expect(storeMock.setSearch).toHaveBeenCalledWith('tarjeta');
  });

  it('debe llamar setPageSize al cambiar paginación', () => {
    fixture.detectChanges();

    component.onPageSizeChange(10);
    expect(storeMock.setPageSize).toHaveBeenCalledWith(10);
  });

  describe('eliminación', () => {
    it('debe abrir modal de eliminación', () => {
      fixture.detectChanges();

      component.onDelete(mockProducts[0]);

      expect(component.showDeleteModal()).toBe(true);
      expect(component.productToDelete()?.id).toBe('prod-001');
    });

    it('debe eliminar producto al confirmar', () => {
      (storeMock.deleteProduct as jest.Mock).mockReturnValue(of(void 0));
      fixture.detectChanges();

      component.onDelete(mockProducts[0]);
      component.confirmDelete();

      expect(storeMock.deleteProduct).toHaveBeenCalledWith('prod-001');
      expect(notificationsMock.success).toHaveBeenCalled();
      expect(component.showDeleteModal()).toBe(false);
    });

    it('debe cerrar modal al cancelar', () => {
      fixture.detectChanges();

      component.onDelete(mockProducts[0]);
      component.closeDeleteModal();

      expect(component.showDeleteModal()).toBe(false);
      expect(component.productToDelete()).toBeNull();
    });

    it('no debe hacer nada si no hay producto seleccionado', () => {
      fixture.detectChanges();

      component.confirmDelete();

      expect(storeMock.deleteProduct).not.toHaveBeenCalled();
    });
    it('debe cerrar modal si ocurre error al eliminar', () => {
      (storeMock.deleteProduct as jest.Mock).mockReturnValue(
        throwError(() => new Error('Error eliminando'))
      );

      fixture.detectChanges();

      component.onDelete(mockProducts[0]);
      component.confirmDelete();

      expect(storeMock.deleteProduct).toHaveBeenCalledWith('prod-001');
      expect(component.showDeleteModal()).toBe(false);
    });
  });
});