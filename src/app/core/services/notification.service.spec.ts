import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe agregar una notificación con el tipo de información predeterminado', () => {
    service.show('Mensaje info');

    const notifications = service.notifications();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('info');
    expect(service.hasNotifications()).toBe(true);
  });

  it('debe usar una duración personalizada si se proporciona', () => {
    service.show('Custom duration', 'success', 1234);

    const notification = service.notifications()[0];
    expect(notification.duration).toBe(1234);
  });

  it('debe auto descartar cuando la duración es mayor a 0', () => {
    service.show('Auto dismiss', 'success', 1000);

    expect(service.notifications().length).toBe(1);

    jest.advanceTimersByTime(1000);

    expect(service.notifications().length).toBe(0);
  });

  it('debe NO auto descartar cuando la duración es 0', () => {
    service.show('No auto dismiss', 'success', 0);

    expect(service.notifications().length).toBe(1);

    jest.advanceTimersByTime(5000);

    expect(service.notifications().length).toBe(1);
  });

  it('debe descartar manualmente', () => {
    service.show('Dismiss me');
    const id = service.notifications()[0].id;

    service.dismiss(id);

    expect(service.notifications().length).toBe(0);
  });

  it('debe descartar todas las notificaciones', () => {
    service.success('Uno');
    service.error('Dos');

    expect(service.notifications().length).toBe(2);

    service.dismissAll();

    expect(service.notifications().length).toBe(0);
  });

  it('debe llamar a los helpers de tipo correctos', () => {
    service.success('ok');
    service.error('error');
    service.warning('warn');
    service.info('info');

    const types = service.notifications().map(n => n.type);

    expect(types).toEqual(['success', 'error', 'warning', 'info']);
  });
});