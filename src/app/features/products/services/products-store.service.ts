import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FinancialProduct, LoadingState } from '../models/product.model';
import { ProductsApiService } from './products-api.service';

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly api = inject(ProductsApiService);

  private readonly _products = signal<FinancialProduct[]>([]);
  private readonly _loading = signal<LoadingState>('idle');
  private readonly _search = signal('');
  private readonly _pageSize = signal(5);

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly search = this._search.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  readonly filteredProducts = computed(() => {
    const query = this._search().toLowerCase().trim();
    const all = this._products();

    const filtered = query
      ? all.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
      )
      : all;

    return filtered.slice(0, this._pageSize());
  });

  readonly filteredCount = computed(() => {
    const query = this._search().toLowerCase().trim();
    const all = this._products();

    if (!query) return all.length;

    return all.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    ).length;
  });

  readonly displayCount = computed(() => this.filteredProducts().length);

  loadProducts(): void {
    this._loading.set('loading');

    this.api.getAll().subscribe({
      next: (products) => {
        this._products.set(products);
        this._loading.set('success');
      },
      error: () => {
        this._loading.set('error');
      }
    });
  }

  createProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.api.create(product).pipe(
      tap(created => {
        this._products.update(list => [...list, created]);
      })
    );
  }

  updateProduct(id: string, product: FinancialProduct): Observable<FinancialProduct> {
    return this.api.update(id, product).pipe(
      tap(updated => {
        this._products.update(list =>
          list.map(p => (p.id === id ? updated : p))
        );
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete(id).pipe(
      tap(() => {
        this._products.update(list => list.filter(p => p.id !== id));
      })
    );
  }

  getProductById(id: string): FinancialProduct | undefined {
    return this._products().find(p => p.id === id);
  }

  setSearch(query: string): void {
    this._search.set(query);
  }

  setPageSize(size: number): void {
    this._pageSize.set(size);
  }
}