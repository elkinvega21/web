import { Routes } from '@angular/router';

export const promotionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/promotion-list/promotion-list.component').then((m) => m.PromotionListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/promotion-form/promotion-form.component').then((m) => m.PromotionFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/promotion-detail/promotion-detail.component').then((m) => m.PromotionDetailComponent),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/promotion-form/promotion-form.component').then((m) => m.PromotionFormComponent),
  },
];
