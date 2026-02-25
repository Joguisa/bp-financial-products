import { Component, ChangeDetectionStrategy, HostListener, input, output, signal } from '@angular/core';
import { FinancialProduct } from '@features/products/models/product.model';


@Component({
  selector: 'bp-product-table',
  standalone: true,
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent {
  products = input<FinancialProduct[]>([]);

  edit = output<FinancialProduct>();
  delete = output<FinancialProduct>();

  openMenuId = signal<string | null>(null);

  readonly defaultLogo = 'assets/icons/visa-signature-400x225.webp';

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

  toggleMenu(event: Event, productId: string): void {
    event.stopPropagation();
    this.openMenuId.update(current =>
      current === productId ? null : productId
    );
  }

  onEdit(event: Event, product: FinancialProduct): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.edit.emit(product);
  }

  onDelete(event: Event, product: FinancialProduct): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.delete.emit(product);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultLogo;
  }
}