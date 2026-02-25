import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { httpErrorInterceptor } from './http-error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('httpErrorInterceptor', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    const notificationServiceMock = {
      error: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [{ provide: NotificationService, useValue: notificationServiceMock }]
    });

    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    const interceptor = (req: any, next: any) =>
      TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));

    expect(interceptor).toBeTruthy();
  });

  it('should call notificationService.error for HttpErrorResponse', (done) => {
    const mockError = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found'
    });

    const next = jest.fn().mockReturnValue(throwError(() => mockError));
    const req = {} as any;

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(req, next).subscribe({
        error: (err) => {
          expect(err).toBe(mockError);
          expect(notificationService.error).toHaveBeenCalledWith('El recurso solicitado no fue encontrado.');
          done();
        }
      });
    });
  });

  it('should handle ErrorEvent', (done) => {
    const mockError = new HttpErrorResponse({
      error: new ErrorEvent('NetworkError', { message: 'Network down' }),
      status: 0
    });

    const next = jest.fn().mockReturnValue(throwError(() => mockError));
    const req = {} as any;

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(req, next).subscribe({
        error: (err) => {
          expect(err).toBe(mockError);
          expect(notificationService.error).toHaveBeenCalledWith('Error: Network down');
          done();
        }
      });
    });
  });
});