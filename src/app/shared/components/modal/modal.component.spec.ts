import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let componentRef: ComponentRef<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe mostrar el modal cuando isOpen es false', () => {
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(overlay).toBeFalsy();
  });

  it('debe mostrar el modal cuando isOpen es true', () => {
    componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
  });

  it('debe mostrar el título', () => {
    componentRef.setInput('isOpen', true);
    componentRef.setInput('title', '¿Eliminar producto?');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('¿Eliminar producto?');
  });

  it('debe mostrar textos personalizados en botones', () => {
    componentRef.setInput('isOpen', true);
    componentRef.setInput('confirmText', 'Sí');
    componentRef.setInput('cancelText', 'No');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent.trim()).toBe('No');
    expect(buttons[1].textContent.trim()).toBe('Sí');
  });

  it('debe emitir confirm al hacer click en confirmar', () => {
    componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.confirm, 'emit');
    const confirmBtn = fixture.nativeElement.querySelectorAll('button')[1];
    confirmBtn.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe emitir cancel al hacer click en cancelar', () => {
    componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.cancel, 'emit');
    const cancelBtn = fixture.nativeElement.querySelectorAll('button')[0];
    cancelBtn.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe emitir cancel al hacer click en el overlay', () => {
    componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.cancel, 'emit');
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    overlay.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('no debe emitir cancel al hacer click dentro del contenido', () => {
    componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.cancel, 'emit');
    const content = fixture.nativeElement.querySelector('.modal-content');
    content.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});