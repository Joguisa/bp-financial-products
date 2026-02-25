import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { NotificationService } from '@core/services/notification.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe mostrar toasts cuando no hay notificaciones', () => {
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(0);
  });

  it('debe mostrar toast cuando hay una notificación', () => {
    notificationService.success('Operación exitosa', 0);
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toContain('Operación exitosa');
  });

  it('debe aplicar la clase CSS según el tipo', () => {
    notificationService.error('Error', 0);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList).toContain('toast--error');
  });

  it('debe eliminar toast al hacer click en cerrar', () => {
    notificationService.info('Info', 0);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.toast__close');
    closeBtn.click();
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(0);
  });
});