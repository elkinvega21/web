import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'inventario',
    loadComponent: () =>
      import('./pages/inventory/inventory.component').then((m) => m.InventoryComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
];
