import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ProductTableComponent } from './product-table.component';
import { FinancialProduct } from '@features/products/models/product.model';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;
  let componentRef: ComponentRef<ProductTableComponent>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'prod-001',
      name: 'Tarjeta de Crédito',
      description: 'Visa Gold',
      logo: 'https://example.com/visa.png',
      date_release: '2026-01-15',
      date_revision: '2027-01-15'
    },
    {
      id: 'prod-002',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta preferencial',
      logo: 'https://example.com/savings.png',
      date_release: '2026-03-01',
      date_revision: '2027-03-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('debe crear el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe mostrar mensaje cuando no hay productos', () => {
    componentRef.setInput('products', []);
    fixture.detectChanges();

    const emptyCell = fixture.nativeElement.querySelector('.cell-empty');
    expect(emptyCell.textContent).toContain('No se encontraron productos');
  });

  it('debe renderizar filas por cada producto', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los datos del producto', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const firstRow = fixture.nativeElement.querySelector('tbody tr');
    expect(firstRow.textContent).toContain('Tarjeta de Crédito');
    expect(firstRow.textContent).toContain('Visa Gold');
  });

  it('debe abrir el menú contextual al hacer click', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    trigger.click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.dropdown__menu');
    expect(menu).toBeTruthy();
  });

  it('debe cerrar el menú al hacer click en el documento', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    // Abrir menú
    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dropdown__menu')).toBeTruthy();

    // Click en documento
    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dropdown__menu')).toBeFalsy();
  });

  it('debe emitir edit al seleccionar Editar', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.edit, 'emit');

    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    trigger.click();
    fixture.detectChanges();

    const editBtn = fixture.nativeElement.querySelector('.dropdown__item');
    editBtn.click();

    expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('debe emitir delete al seleccionar Eliminar', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.delete, 'emit');

    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    trigger.click();
    fixture.detectChanges();

    const deleteBtn = fixture.nativeElement.querySelector('.dropdown__item--danger');
    deleteBtn.click();

    expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('debe aplicar fallback de imagen en error', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('.product-logo');
    img.dispatchEvent(new Event('error'));

    expect(img.src).toContain('visa-signature-400x225.webp');
  });

  it('debe evitar loop infinito si el fallback también falla', () => {
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('.product-logo');

    img.dispatchEvent(new Event('error'));
    expect(img.src).toContain('visa-signature-400x225.webp');

    img.dispatchEvent(new Event('error'));
    expect(img.getAttribute('src')).toBeNull();
  });
});