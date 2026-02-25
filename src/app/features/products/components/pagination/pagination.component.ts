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

  pageSizeChange = output<number>();

  readonly pageSizeOptions = [5, 10, 20];

  onPageSizeChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(value);
  }
}