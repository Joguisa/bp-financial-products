import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { SkeletonTableComponent } from '@shared/components/skeleton-table/skeleton-table.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NotificationService } from '@core/services/notification.service';
import { FinancialProduct } from '@features/products/models/product.model';
import { ProductsStore } from '@features/products/services/products-store.service';
import { PaginationComponent } from '@features/products/components/pagination/pagination.component';
import { ProductTableComponent } from '@features/products/components/product-table/product-table.component';

@Component({
  selector: 'bp-product-list',
  standalone: true,
  imports: [
    SearchBarComponent,
    SkeletonTableComponent,
    ModalComponent,
    ProductTableComponent,
    PaginationComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private readonly store = inject(ProductsStore);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly loading = this.store.loading;
  readonly products = this.store.filteredProducts;
  readonly filteredCount = this.store.filteredCount;
  readonly pageSize = this.store.pageSize;

  showDeleteModal = signal(false);
  productToDelete = signal<FinancialProduct | null>(null);

  ngOnInit(): void {
    this.store.loadProducts();
  }

  onSearch(query: string): void {
    this.store.setSearch(query);
  }

  onPageSizeChange(size: number): void {
    this.store.setPageSize(size);
  }

  navigateToAdd(): void {
    this.router.navigate(['/add']);
  }

  onEdit(product: FinancialProduct): void {
    this.router.navigate(['/edit', product.id]);
  }

  onDelete(product: FinancialProduct): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.store.deleteProduct(product.id).subscribe({
      next: () => {
        this.notifications.success(`Producto "${product.name}" eliminado exitosamente`);
        this.closeDeleteModal();
      },
      error: () => {
        this.closeDeleteModal();
      }
    });
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }
}