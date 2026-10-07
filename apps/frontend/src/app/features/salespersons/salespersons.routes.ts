import { Routes } from '@angular/router';

export const salespersonRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/salesperson-list/salesperson-list.component').then((m) => m.SalespersonListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/salesperson-detail/salesperson-detail.component').then((m) => m.SalespersonDetailComponent),
  },
];
