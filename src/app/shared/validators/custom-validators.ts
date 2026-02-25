import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';

export function dateNotInPast(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const [year, month, day] = control.value.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today ? null : { dateInPast: true };
}

export function minLengthTrimmed(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const len = control.value.trim().length;
        return len >= min ? null : { minLengthTrimmed: { required: min, actual: len } };
    };
}

export function maxLengthTrimmed(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const len = control.value.trim().length;
        return len <= max ? null : { maxLengthTrimmed: { required: max, actual: len } };
    };
}

export function uniqueId(
    verifyFn: (id: string) => Observable<boolean>
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value || control.value.trim().length < 3) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(300),
            switchMap(id => verifyFn(id)),
            map(exists => (exists ? { idExists: true } : null)),
            catchError(() => of(null)),
            first()
        );
    };
}