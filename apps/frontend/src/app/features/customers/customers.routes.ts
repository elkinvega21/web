import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/customer-list/customer-list.component').then((m) => m.CustomerListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/customer-form/customer-form.component').then((m) => m.CustomerFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/customer-detail/customer-detail.component').then((m) => m.CustomerDetailComponent),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/customer-form/customer-form.component').then((m) => m.CustomerFormComponent),
  },
];
