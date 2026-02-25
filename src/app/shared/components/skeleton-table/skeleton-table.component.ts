import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bp-skeleton-table',
  standalone: true,
  templateUrl: './skeleton-table.component.html',
  styleUrl: './skeleton-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonTableComponent {
  rows = input(5);
  columns = input(5);

  rowsArray = computed(() => Array(this.rows()).fill(0));
  columnsArray = computed(() => Array(this.columns()).fill(0));
}