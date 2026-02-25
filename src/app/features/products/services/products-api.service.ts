import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FinancialProduct } from '../models/product.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getAll(): Observable<FinancialProduct[]> {
    return this.http
      .get<{ data: FinancialProduct[] }>(`${this.baseUrl}/products`)
      .pipe(map(res => res.data));
  }

  getById(id: string): Observable<FinancialProduct> {
    return this.http.get<FinancialProduct>(`${this.baseUrl}/products/${id}`);
  }

  create(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http
      .post<{ data: FinancialProduct }>(`${this.baseUrl}/products`, product)
      .pipe(map(res => res.data));
  }

  update(id: string, product: FinancialProduct): Observable<FinancialProduct> {
    return this.http
      .put<{ data: FinancialProduct }>(`${this.baseUrl}/products/${id}`, product)
      .pipe(map(res => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/products/verification/${id}`
    );
  }
}