import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { SkeletonTableComponent } from './skeleton-table.component';

describe('SkeletonTableComponent', () => {
  let component: SkeletonTableComponent;
  let fixture: ComponentFixture<SkeletonTableComponent>;
  let componentRef: ComponentRef<SkeletonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar 5 filas por defecto', () => {
    const rows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(rows.length).toBe(5);
  });

  it('debe renderizar 5 columnas por defecto', () => {
    const headerCells = fixture.nativeElement.querySelectorAll('.skeleton-header .skeleton-cell');
    expect(headerCells.length).toBe(5);
  });

  it('debe respetar inputs personalizados', () => {
    componentRef.setInput('rows', 3);
    componentRef.setInput('columns', 4);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    const headerCells = fixture.nativeElement.querySelectorAll('.skeleton-header .skeleton-cell');
    expect(rows.length).toBe(3);
    expect(headerCells.length).toBe(4);
  });

  it('debe aplicar clase logo a la primera columna', () => {
    const firstCell = fixture.nativeElement.querySelector('.skeleton-row .skeleton-cell');
    expect(firstCell.classList).toContain('skeleton-cell--logo');
  });
});