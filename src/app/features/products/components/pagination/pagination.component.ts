import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'bp-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  filteredCount = input(0);
  pageSize = input(5);
  currentPage = input(0);

  pageSizeChange = output<number>();

  readonly pageSizeOptions = [5, 10, 20];

  get displayedCount(): number {
    const startIndex = this.currentPage() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return Math.min(this.pageSize(), Math.max(0, this.filteredCount() - startIndex));
  }

  onPageSizeChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(value);
  }
}