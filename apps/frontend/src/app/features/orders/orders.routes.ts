import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/order-list/order-list.component').then((m) => m.OrderListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/order-form/order-form.component').then((m) => m.OrderFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/order-form/order-form.component').then((m) => m.OrderFormComponent),
  },
  {
    path: ':id/seguimiento',
    loadComponent: () =>
      import('./pages/order-tracking/order-tracking.component').then((m) => m.OrderTrackingComponent),
  },
];
