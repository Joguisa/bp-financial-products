import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductsApiService } from './products-api.service';
import { FinancialProduct } from '../models/product.model';

describe('ProductsApiService', () => {
  let service: ProductsApiService;
  let httpMock: HttpTestingController;

  const mockProduct: FinancialProduct = {
    id: 'test-001',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta Visa Gold',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: '2026-01-15',
    date_revision: '2027-01-15'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('debe obtener la lista de productos', () => {
      const mockProducts = [mockProduct];

      service.getAll().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(1);
      });

      const req = httpMock.expectOne('/bp/products');
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts });
    });

    it('debe retornar lista vacía cuando no hay productos', () => {
      service.getAll().subscribe(products => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne('/bp/products');
      req.flush({ data: [] });
    });
  });

  describe('getById', () => {
    it('debe obtener un producto por ID', () => {
      service.getById('test-001').subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne('/bp/products/test-001');
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('create', () => {
    it('debe crear un producto', () => {
      service.create(mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne('/bp/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct });
    });
  });

  describe('update', () => {
    it('debe actualizar un producto', () => {
      const updated = { ...mockProduct, name: 'Tarjeta Platinum' };

      service.update('test-001', updated).subscribe(product => {
        expect(product.name).toBe('Tarjeta Platinum');
      });

      const req = httpMock.expectOne('/bp/products/test-001');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updated);
      req.flush({ data: updated });
    });
  });

  describe('delete', () => {
    it('debe eliminar un producto', () => {
      service.delete('test-001').subscribe();

      const req = httpMock.expectOne('/bp/products/test-001');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('verifyId', () => {
    it('debe retornar true si el ID existe', () => {
      service.verifyId('test-001').subscribe(exists => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne('/bp/products/verification/test-001');
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('debe retornar false si el ID no existe', () => {
      service.verifyId('new-id').subscribe(exists => {
        expect(exists).toBe(false);
      });

      const req = httpMock.expectOne('/bp/products/verification/new-id');
      req.flush(false);
    });
  });
});