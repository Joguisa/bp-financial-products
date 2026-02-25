import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductsStore } from './products-store.service';
import { ProductsApiService } from './products-api.service';
import { FinancialProduct } from '../models/product.model';

describe('ProductsStore', () => {
  let store: ProductsStore;
  let apiMock: jest.Mocked<ProductsApiService>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'prod-001',
      name: 'Tarjeta de Crédito',
      description: 'Visa Gold con beneficios',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2026-01-15',
      date_revision: '2027-01-15'
    },
    {
      id: 'prod-002',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta con interés preferencial',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2026-03-01',
      date_revision: '2027-03-01'
    },
    {
      id: 'prod-003',
      name: 'Crédito Hipotecario',
      description: 'Préstamo para vivienda',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2026-06-01',
      date_revision: '2027-06-01'
    }
  ];

  beforeEach(() => {
    apiMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      verifyId: jest.fn()
    } as unknown as jest.Mocked<ProductsApiService>;

    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        { provide: ProductsApiService, useValue: apiMock }
      ]
    });

    store = TestBed.inject(ProductsStore);
  });

  describe('estado inicial', () => {
    it('debe iniciar con lista vacía', () => {
      expect(store.products()).toEqual([]);
    });

    it('debe iniciar con loading en idle', () => {
      expect(store.loading()).toBe('idle');
    });

    it('debe iniciar con búsqueda vacía', () => {
      expect(store.search()).toBe('');
    });

    it('debe iniciar con pageSize en 5', () => {
      expect(store.pageSize()).toBe(5);
    });
  });

  describe('loadProducts', () => {
    it('debe cargar productos y actualizar estado a success', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));

      store.loadProducts();

      expect(store.loading()).toBe('success');
      expect(store.products()).toEqual(mockProducts);
      expect(store.products().length).toBe(3);
    });

    it('debe establecer loading mientras carga', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));

      expect(store.loading()).toBe('idle');

      store.loadProducts();
      expect(store.loading()).toBe('success');
    });

    it('debe cambiar a error si falla la petición', () => {
      apiMock.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      store.loadProducts();

      expect(store.loading()).toBe('error');
      expect(store.products()).toEqual([]);
    });
  });

  describe('createProduct', () => {
    it('debe agregar el producto creado a la lista', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      const newProduct: FinancialProduct = {
        id: 'prod-004',
        name: 'Seguro de Vida',
        description: 'Cobertura completa',
        logo: 'https://example.com/insurance.png',
        date_release: '2026-07-01',
        date_revision: '2027-07-01'
      };
      apiMock.create.mockReturnValue(of(newProduct));

      store.createProduct(newProduct).subscribe(result => {
        expect(result).toEqual(newProduct);
      });

      expect(store.products().length).toBe(4);
      expect(store.products()[3].id).toBe('prod-004');
    });

    it('no debe modificar la lista si create falla', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      apiMock.create.mockReturnValue(throwError(() => new Error('Network error')));

      store.createProduct({
        id: 'fail-001',
        name: 'Fallido',
        description: 'No se crea',
        logo: '',
        date_release: '2026-01-01',
        date_revision: '2027-01-01'
      }).subscribe({
        error: () => { }
      });

      expect(store.products().length).toBe(3);
    });
  });

  describe('updateProduct', () => {
    it('debe actualizar el producto en la lista', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      const updated = { ...mockProducts[0], name: 'Tarjeta Platinum' };
      apiMock.update.mockReturnValue(of(updated));

      store.updateProduct('prod-001', updated).subscribe(result => {
        expect(result.name).toBe('Tarjeta Platinum');
      });

      expect(store.products()[0].name).toBe('Tarjeta Platinum');
    });

    it('no debe modificar otros productos', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      const updated = { ...mockProducts[0], name: 'Modificado' };
      apiMock.update.mockReturnValue(of(updated));

      store.updateProduct('prod-001', updated).subscribe();

      expect(store.products()[1].name).toBe('Cuenta de Ahorros');
      expect(store.products()[2].name).toBe('Crédito Hipotecario');
    });

    it('no debe modificar la lista si update falla', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      apiMock.update.mockReturnValue(throwError(() => new Error('Network error')));

      store.updateProduct('prod-001', { ...mockProducts[0], name: 'Fallido' }).subscribe({
        error: () => { }
      });

      expect(store.products()[0].name).toBe('Tarjeta de Crédito');
    });
  });

  describe('deleteProduct', () => {
    it('debe eliminar el producto de la lista', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      apiMock.delete.mockReturnValue(of(void 0));

      store.deleteProduct('prod-001').subscribe();

      expect(store.products().length).toBe(2);
      expect(store.products().find(p => p.id === 'prod-001')).toBeUndefined();
    });

    it('no debe eliminar si delete falla', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      apiMock.delete.mockReturnValue(throwError(() => new Error('Network error')));

      store.deleteProduct('prod-001').subscribe({
        error: () => { }
      });

      expect(store.products().length).toBe(3);
    });
  });

  describe('getProductById', () => {
    it('debe retornar el producto si existe', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      const product = store.getProductById('prod-002');
      expect(product?.name).toBe('Cuenta de Ahorros');
    });

    it('debe retornar undefined si no existe', () => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();

      expect(store.getProductById('inexistente')).toBeUndefined();
    });
  });

  describe('búsqueda y filtrado', () => {
    beforeEach(() => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();
      store.setPageSize(20);
    });

    it('debe filtrar por nombre (case-insensitive)', () => {
      store.setSearch('tarjeta');

      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].id).toBe('prod-001');
    });

    it('debe filtrar por descripción', () => {
      store.setSearch('vivienda');

      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].id).toBe('prod-003');
    });

    it('debe filtrar por ID', () => {
      store.setSearch('prod-002');

      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].name).toBe('Cuenta de Ahorros');
    });

    it('debe retornar todos si la búsqueda está vacía', () => {
      store.setSearch('');

      expect(store.filteredProducts().length).toBe(3);
    });

    it('debe retornar lista vacía si no hay coincidencias', () => {
      store.setSearch('inexistente');

      expect(store.filteredProducts().length).toBe(0);
      expect(store.filteredCount()).toBe(0);
    });

    it('debe ignorar espacios en la búsqueda', () => {
      store.setSearch('  tarjeta  ');

      expect(store.filteredProducts().length).toBe(1);
    });
  });

  describe('paginación', () => {
    beforeEach(() => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();
    });

    it('debe limitar resultados según pageSize', () => {
      store.setPageSize(2);

      expect(store.filteredProducts().length).toBe(2);
      expect(store.filteredCount()).toBe(3);
    });

    it('debe mostrar todos si pageSize es mayor que el total', () => {
      store.setPageSize(10);

      expect(store.filteredProducts().length).toBe(3);
      expect(store.displayCount()).toBe(3);
    });

    it('displayCount debe reflejar la cantidad visible', () => {
      store.setPageSize(1);

      expect(store.displayCount()).toBe(1);
      expect(store.filteredCount()).toBe(3);
    });
  });

  describe('filtrado + paginación combinados', () => {
    beforeEach(() => {
      apiMock.getAll.mockReturnValue(of(mockProducts));
      store.loadProducts();
    });

    it('debe aplicar filtro antes de paginar', () => {
      store.setSearch('créd'); // "Tarjeta de Crédito" + "Crédito Hipotecario"
      store.setPageSize(1);

      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredCount()).toBe(2);
    });
  });
});