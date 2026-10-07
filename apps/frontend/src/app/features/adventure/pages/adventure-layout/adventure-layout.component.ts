import { Component, inject, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-adventure-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, AppButton, IconComponent],
  template: `
    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0F1F1A]/95 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a routerLink="/adventure" class="group flex items-center gap-2.5">
          <span
            class="flex size-9 items-center justify-center rounded-lg bg-emerald-700 transition-colors group-hover:bg-emerald-600"
          >
            <app-icon name="mountain" [size]="20" class="text-white" />
          </span>
          <span>
            <span class="block text-sm font-bold tracking-tight text-white">ADVENTURE</span>
            <span class="block text-[10px] font-medium tracking-[0.15em] uppercase text-emerald-400">Retail</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1 md:flex">
          @for (item of navItems; track item.href) {
            <a [routerLink]="item.href" [class]="desktopNavClass(item.href)">{{ item.label }}</a>
          }
        </nav>

        <div class="flex items-center gap-3">
          <a
            appButton
            routerLink="/adventure/login"
            variant="secondary"
            className="hidden h-9 bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 border-0 hover:bg-emerald-500 md:inline-flex"
          >
            <app-icon name="log-in" [size]="16" class="mr-1.5" />
            Iniciar sesión
          </a>
          <button
            type="button"
            (click)="open.set(!open())"
            [attr.aria-label]="open() ? 'Cerrar menú' : 'Abrir menú'"
            class="flex size-9 items-center justify-center rounded-lg text-emerald-100/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            @if (open()) {
              <app-icon name="x" [size]="20" />
            } @else {
              <app-icon name="menu" [size]="20" />
            }
          </button>
        </div>
      </div>

      @if (open()) {
        <div class="border-t border-white/10 bg-[#0F1F1A] md:hidden">
          <nav class="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
            @for (item of navItems; track item.href) {
              <a [routerLink]="item.href" [class]="mobileNavClass(item.href)">
                <span>{{ item.label }}</span>
                <app-icon name="chevron-right" [size]="16" class="text-emerald-500" />
              </a>
            }
            <div class="mt-3 px-3">
              <a
                appButton
                routerLink="/adventure/login"
                variant="secondary"
                className="h-10 w-full bg-emerald-600 text-white shadow-lg border-0 hover:bg-emerald-500"
              >
                <app-icon name="log-in" [size]="16" class="mr-1.5" />
                Iniciar sesión
              </a>
            </div>
          </nav>
        </div>
      }
    </header>

    <div class="min-h-svh bg-background">
      <router-outlet />
    </div>

    <footer class="border-t border-white/10 bg-[#0F1F1A]">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div class="mb-4 flex items-center gap-2.5">
              <span class="flex size-8 items-center justify-center rounded-lg bg-emerald-700">
                <app-icon name="mountain" [size]="18" class="text-white" />
              </span>
              <span>
                <span class="block text-xs font-bold tracking-tight text-white">ADVENTURE</span>
                <span class="block text-[8px] font-medium tracking-[0.15em] uppercase text-emerald-400">Retail</span>
              </span>
            </div>
            <p class="max-w-xs text-sm leading-relaxed text-emerald-100/60">
              Productos y soluciones para quienes convierten cada camino en una nueva experiencia.
            </p>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-semibold text-white">Navegación</h3>
            <ul class="space-y-2">
              @for (item of navItems; track item.href) {
                <li>
                  <a [routerLink]="item.href" class="text-sm text-emerald-100/60 transition-colors hover:text-emerald-400">
                    {{ item.label }}
                  </a>
                </li>
              }
              <li>
                <a
                  routerLink="/adventure/login"
                  class="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Portal de colaboradores
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-semibold text-white">Contacto</h3>
            <ul class="space-y-2 text-sm text-emerald-100/60">
              <li>contacto&#64;adventureretail.com</li>
              <li>+1 (555) 123-4567</li>
              <li>
                Av. Aventura 1234,<br />
                Santiago, Chile
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-semibold text-white">Síguenos</h3>
            <div class="flex gap-3">
              @for (s of socials; track s) {
                <span
                  class="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-emerald-100/60 transition-colors hover:border-emerald-600 hover:text-emerald-400"
                >
                  {{ s }}
                </span>
              }
            </div>
          </div>
        </div>

        <div
          class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row"
        >
          <p class="text-xs text-emerald-100/40">© 2026 Adventure Retail. Todos los derechos reservados.</p>
          <p class="text-[11px] text-emerald-100/30">
            Plataforma desarrollada por
            <a
              href="https://creadorsoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-emerald-500 underline-offset-2 hover:text-emerald-400 hover:underline"
            >
              CREADOR SOFTWARE
            </a>
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class AdventureLayoutComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly navSub: Subscription = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => this.open.set(false));

  readonly open = signal(false);

  readonly navItems = [
    { href: '/adventure', label: 'Inicio' },
    { href: '/adventure/nosotros', label: 'Nosotros' },
    { href: '/adventure/productos', label: 'Productos' },
    { href: '/adventure/servicios', label: 'Servicios' },
    { href: '/adventure/operacion', label: 'Nuestra operación' },
    { href: '/adventure/contacto', label: 'Contacto' },
  ];

  readonly socials = ['FB', 'IG', 'TW', 'LI'];

  ngOnDestroy(): void {
    this.navSub.unsubscribe();
  }

  isActive(href: string): boolean {
    return this.router.url === href;
  }

  desktopNavClass(href: string): string {
    const base = 'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200';
    return this.isActive(href)
      ? `${base} text-white bg-white/10`
      : `${base} text-emerald-100/70 hover:text-white hover:bg-white/10`;
  }

  mobileNavClass(href: string): string {
    const base = 'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all';
    return this.isActive(href)
      ? `${base} text-white bg-white/10`
      : `${base} text-emerald-100/70 hover:text-white hover:bg-white/10`;
  }
}
