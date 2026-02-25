import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component')
        .then(m => m.ProductListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/product-form/product-form.component')
        .then(m => m.ProductFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/product-form/product-form.component')
        .then(m => m.ProductFormComponent)
  }
];