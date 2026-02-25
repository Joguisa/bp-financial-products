import { FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { dateNotInPast, minLengthTrimmed, maxLengthTrimmed, uniqueId } from './custom-validators';

describe('custom-validators', () => {
    describe('dateNotInPast', () => {
        it('debe retornar null si no hay valor', () => {
            const control = new FormControl('');
            expect(dateNotInPast(control)).toBeNull();
        });

        it('debe retornar null para fecha de hoy', () => {
            const today = new Date();
            const value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const control = new FormControl(value);
            expect(dateNotInPast(control)).toBeNull();
        });

        it('debe retornar null para fecha futura', () => {
            const control = new FormControl('2099-01-01');
            expect(dateNotInPast(control)).toBeNull();
        });

        it('debe retornar error para fecha pasada', () => {
            const control = new FormControl('2020-01-01');
            expect(dateNotInPast(control)).toEqual({ dateInPast: true });
        });
    });

    describe('minLengthTrimmed', () => {
        const validator = minLengthTrimmed(3);

        it('debe retornar null si no hay valor', () => {
            expect(validator(new FormControl(''))).toBeNull();
        });

        it('debe retornar null si cumple mínimo', () => {
            expect(validator(new FormControl('abc'))).toBeNull();
        });

        it('debe retornar error si no cumple mínimo', () => {
            expect(validator(new FormControl('ab'))).toEqual({
                minLengthTrimmed: { required: 3, actual: 2 }
            });
        });

        it('debe contar sin espacios', () => {
            expect(validator(new FormControl('  ab  '))).toEqual({
                minLengthTrimmed: { required: 3, actual: 2 }
            });
        });
    });

    describe('maxLengthTrimmed', () => {
        const validator = maxLengthTrimmed(5);

        it('debe retornar null si no hay valor', () => {
            expect(validator(new FormControl(''))).toBeNull();
        });

        it('debe retornar null si cumple máximo', () => {
            expect(validator(new FormControl('abcde'))).toBeNull();
        });

        it('debe retornar error si excede máximo', () => {
            expect(validator(new FormControl('abcdef'))).toEqual({
                maxLengthTrimmed: { required: 5, actual: 6 }
            });
        });

        it('debe contar sin espacios', () => {
            expect(validator(new FormControl('  abc  '))).toBeNull();
        });
    });

    describe('uniqueId', () => {
        it('debe retornar null si no hay valor', async () => {
            const verifyFn = jest.fn();
            const validator = uniqueId(verifyFn);

            const result = await firstValueFrom(validator(new FormControl('')) as Observable<ValidationErrors | null>);
            expect(result).toBeNull();
            expect(verifyFn).not.toHaveBeenCalled();
        });

        it('debe retornar null si el valor tiene menos de 3 caracteres', async () => {
            const verifyFn = jest.fn();
            const validator = uniqueId(verifyFn);

            const result = await firstValueFrom(validator(new FormControl('ab')) as Observable<ValidationErrors | null>);
            expect(result).toBeNull();
        });

        it('debe retornar idExists si el id ya existe', async () => {
            const verifyFn = jest.fn().mockReturnValue(of(true));
            const validator = uniqueId(verifyFn);

            const result = await firstValueFrom(validator(new FormControl('existing-id')) as Observable<ValidationErrors | null>);
            expect(result).toEqual({ idExists: true });
        });

        it('debe retornar null si el id no existe', async () => {
            const verifyFn = jest.fn().mockReturnValue(of(false));
            const validator = uniqueId(verifyFn);

            const result = await firstValueFrom(validator(new FormControl('new-id')) as Observable<ValidationErrors | null>);
            expect(result).toBeNull();
        });

        it('debe retornar null si el servicio falla', async () => {
            const verifyFn = jest.fn().mockReturnValue(throwError(() => new Error('API error')));
            const validator = uniqueId(verifyFn);

            const result = await firstValueFrom(validator(new FormControl('some-id')) as Observable<ValidationErrors | null>);
            expect(result).toBeNull();
        });
    });
});