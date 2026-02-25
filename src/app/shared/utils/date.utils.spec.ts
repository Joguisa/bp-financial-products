import { formatDateToApi, parseApiDate, addOneYear, isDateTodayOrFuture, calculateRevisionDate } from "./date.utils";

describe('date.utils', () => {
    describe('formatDateToApi', () => {
        it('debe formatear fecha a YYYY-MM-DD', () => {
            const date = new Date(2025, 0, 15);
            expect(formatDateToApi(date)).toBe('2025-01-15');
        });

        it('debe agregar padding a mes y día', () => {
            const date = new Date(2025, 2, 5);
            expect(formatDateToApi(date)).toBe('2025-03-05');
        });
    });

    describe('parseApiDate', () => {
        it('debe parsear string YYYY-MM-DD a Date', () => {
            const date = parseApiDate('2025-06-20');
            expect(date.getFullYear()).toBe(2025);
            expect(date.getMonth()).toBe(5);
            expect(date.getDate()).toBe(20);
        });
    });

    describe('addOneYear', () => {
        it('debe sumar un año', () => {
            const date = new Date(2025, 0, 1);
            const result = addOneYear(date);
            expect(result.getFullYear()).toBe(2026);
        });

        it('no debe mutar la fecha original', () => {
            const date = new Date(2025, 0, 1);
            addOneYear(date);
            expect(date.getFullYear()).toBe(2025);
        });
    });

    describe('isDateTodayOrFuture', () => {
        it('debe retornar true para hoy', () => {
            expect(isDateTodayOrFuture(new Date())).toBe(true);
        });

        it('debe retornar true para fecha futura', () => {
            const future = new Date();
            future.setFullYear(future.getFullYear() + 1);
            expect(isDateTodayOrFuture(future)).toBe(true);
        });

        it('debe retornar false para fecha pasada', () => {
            const past = new Date(2020, 0, 1);
            expect(isDateTodayOrFuture(past)).toBe(false);
        });
    });

    describe('calculateRevisionDate', () => {
        it('debe calcular fecha + 1 año', () => {
            expect(calculateRevisionDate('2025-03-10')).toBe('2026-03-10');
        });

        it('debe manejar fin de año', () => {
            expect(calculateRevisionDate('2025-12-31')).toBe('2026-12-31');
        });
    });
});