import { Component } from '@angular/core';
import { BrandMarkComponent } from '../../components/brand-mark/brand-mark.component';
import { IconComponent } from '../../components/icon/icon.component';

interface Highlight {
  icon: string;
  title: string;
  desc: string;
}

const highlights: Highlight[] = [
  {
    icon: 'shield-check',
    title: 'Acceso seguro por roles',
    desc: 'Administrador, Gerente, Supervisor y Vendedor con permisos segmentados.',
  },
  {
    icon: 'bar-chart-3',
    title: 'Operación en tiempo real',
    desc: 'Inventario, ventas y comisiones sincronizados en un solo lugar.',
  },
  {
    icon: 'zap',
    title: 'Diseñado para productividad',
    desc: 'Flujos rápidos pensados para equipos comerciales de alto volumen.',
  },
];

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [BrandMarkComponent, IconComponent],
  template: `
    <main class="flex min-h-svh w-full bg-background">
      <aside class="auth-panel relative hidden w-[46%] max-w-[640px] shrink-0 overflow-hidden bg-primary lg:block">
        <div class="relative flex h-full flex-col justify-between p-12">
          <app-brand-mark [invert]="true" />
          <div class="max-w-md">
            <h1 class="text-3xl font-semibold leading-tight tracking-tight text-primary-foreground text-balance">
              La plataforma comercial que impulsa tu operación retail.
            </h1>
            <p class="mt-4 text-sm leading-relaxed text-primary-foreground/75 text-pretty">
              Centraliza clientes, inventario y ventas en un ERP moderno, seguro y hecho
              para equipos que se mueven rápido.
            </p>
            <ul class="mt-10 flex flex-col gap-5">
              @for (item of highlights; track item.title) {
                <li class="flex gap-3.5">
                  <span
                    class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/12"
                    aria-hidden="true"
                  >
                    <app-icon [name]="item.icon" [size]="18" class="text-primary-foreground" />
                  </span>
                  <div>
                    <p class="text-sm font-medium text-primary-foreground">{{ item.title }}</p>
                    <p class="text-[13px] leading-relaxed text-primary-foreground/70">{{ item.desc }}</p>
                  </div>
                </li>
              }
            </ul>
          </div>
          <p class="text-xs text-primary-foreground/60">
            © {{ year }} CREADOR SOFTWARE S.A.S. Todos los derechos reservados.
          </p>
        </div>
      </aside>

      <div class="flex flex-1 flex-col">
        <header class="flex items-center justify-between p-5 lg:hidden">
          <app-brand-mark />
        </header>
        <div class="flex flex-1 items-center justify-center px-5 pb-12 pt-2 sm:px-8">
          <div class="w-full max-w-[420px]">
            <ng-content />
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      .auth-panel::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.14) 0, transparent 32%),
          radial-gradient(circle at 88% 82%, rgba(255, 255, 255, 0.1) 0, transparent 38%),
          radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.08) 0, transparent 26%);
        pointer-events: none;
      }
    `,
  ],
})
export class AuthShellComponent {
  readonly highlights = highlights;
  readonly year = new Date().getFullYear();
}
