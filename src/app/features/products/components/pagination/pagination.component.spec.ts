import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let componentRef: ComponentRef<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el conteo de resultados', () => {
    componentRef.setInput('filteredCount', 8);
    fixture.detectChanges();

    const count = fixture.nativeElement.querySelector('.pagination__count');
    expect(count.textContent).toContain('8 Resultados');
  });

  it('debe renderizar las opciones de tamaño de página', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[0].value).toBe('5');
    expect(options[1].value).toBe('10');
    expect(options[2].value).toBe('20');
  });

  it('debe emitir pageSizeChange al cambiar el select', () => {
    const emitSpy = jest.spyOn(component.pageSizeChange, 'emit');

    const select = fixture.nativeElement.querySelector('select');
    select.value = '10';
    select.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(10);
  });

  it('debe reflejar el pageSize actual', () => {
    componentRef.setInput('pageSize', 20);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.value).toBe('20');
  });
});