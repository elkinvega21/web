import { Routes } from '@angular/router';
import { AppShellComponent } from './shared/layout/app-shell/app-shell.component';
import { CorporateLayoutComponent } from './features/corporate/pages/corporate-layout/corporate-layout.component';
import { AdventureLayoutComponent } from './features/adventure/pages/adventure-layout/adventure-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: CorporateLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/corporate/pages/landing/landing.component').then((m) => m.CorporateLandingComponent),
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./features/corporate/pages/nosotros/nosotros.component').then((m) => m.CorporateNosotrosComponent),
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/corporate/pages/servicios/servicios.component').then((m) => m.CorporateServiciosComponent),
      },
      {
        path: 'tecnologias',
        loadComponent: () =>
          import('./features/corporate/pages/tecnologias/tecnologias.component').then((m) => m.CorporateTecnologiasComponent),
      },
      {
        path: 'soluciones',
        loadComponent: () =>
          import('./features/corporate/pages/soluciones/soluciones.component').then((m) => m.CorporateSolucionesComponent),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/corporate/pages/contacto/contacto.component').then((m) => m.CorporateContactoComponent),
      },
    ],
  },
  {
    path: 'adventure',
    component: AdventureLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/adventure/pages/home/home.component').then((m) => m.AdventureHomeComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/adventure/pages/login/login.component').then((m) => m.AdventureLoginComponent),
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./features/adventure/pages/nosotros/nosotros.component').then((m) => m.AdventureNosotrosComponent),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/adventure/pages/productos/productos.component').then((m) => m.AdventureProductosComponent),
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/adventure/pages/servicios/servicios.component').then((m) => m.AdventureServiciosComponent),
      },
      {
        path: 'operacion',
        loadComponent: () =>
          import('./features/adventure/pages/operacion/operacion.component').then((m) => m.AdventureOperacionComponent),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/adventure/pages/contacto/contacto.component').then((m) => m.AdventureContactoComponent),
      },
    ],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () =>
      import('./features/auth/pages/recuperar-contrasena/recuperar-contrasena.component').then((m) => m.RecuperarContrasenaComponent),
  },
  {
    path: 'restablecer-contrasena',
    loadComponent: () =>
      import('./features/auth/pages/restablecer-contrasena/restablecer-contrasena.component').then((m) => m.RestablecerContrasenaComponent),
  },
  {
    path: 'verificar-correo',
    loadComponent: () =>
      import('./features/auth/pages/verificar-correo/verificar-correo.component').then((m) => m.VerificarCorreoComponent),
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () =>
      import('./features/auth/pages/cambiar-contrasena/cambiar-contrasena.component').then((m) => m.CambiarContrasenaComponent),
  },

  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/pages/perfil/perfil.component').then((m) => m.PerfilComponent),
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./features/customers/customers.routes').then((m) => m.customerRoutes),
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.orderRoutes),
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.productRoutes),
      },
      {
        path: 'vendedores',
        loadChildren: () =>
          import('./features/salespersons/salespersons.routes').then((m) => m.salespersonRoutes),
      },
      {
        path: 'territorios',
        loadChildren: () =>
          import('./features/territories/territories.routes').then((m) => m.territoryRoutes),
      },
      {
        path: 'promociones',
        loadChildren: () =>
          import('./features/promotions/promotions.routes').then((m) => m.promotionRoutes),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./features/reportes/reportes.routes').then((m) => m.reportRoutes),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },

  { path: '**', redirectTo: '/dashboard' },
];
