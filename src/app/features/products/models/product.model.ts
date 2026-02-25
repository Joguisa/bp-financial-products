export interface FinancialProduct {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';