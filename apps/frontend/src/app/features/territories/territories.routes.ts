import { Routes } from '@angular/router';

export const territoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/territory-list/territory-list.component').then((m) => m.TerritoryListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/territory-detail/territory-detail.component').then((m) => m.TerritoryDetailComponent),
  },
];
