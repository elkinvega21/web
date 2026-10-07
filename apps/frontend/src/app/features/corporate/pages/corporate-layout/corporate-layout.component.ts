import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface CorporateNavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-corporate-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, IconComponent],
  template: `
    <div class="flex min-h-svh flex-col bg-background">
      <header [class]="headerClass">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a routerLink="/" class="flex items-center gap-2.5">
            <span class="flex size-8 items-center justify-center rounded-lg bg-primary">
              <app-icon name="code-xml" [size]="18" class="text-primary-foreground" />
            </span>
            <span class="text-sm font-bold tracking-tight text-foreground">CREADOR <span class="text-primary">SOFTWARE</span></span>
          </a>

          <nav class="hidden lg:flex items-center gap-1" aria-label="Principal">
            @for (link of navLinks; track link.href) {
              <a [routerLink]="link.href" [class]="navLinkClass(link)">
                {{ link.label }}
              </a>
            }
          </nav>

          <div class="hidden lg:flex items-center gap-3">
            <a routerLink="/login" class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Iniciar sesión <app-icon name="arrow-right" [size]="14" />
            </a>
          </div>

          <button type="button" (click)="setMenuOpen(true)" class="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden" aria-label="Abrir menú">
            <app-icon name="menu" [size]="20" />
          </button>
        </div>
      </header>

      @if (menuOpen()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-foreground/40 backdrop-blur-sm" (click)="setMenuOpen(false)"></div>
          <div class="absolute inset-y-0 right-0 w-72 max-w-[85vw] bg-background border-l border-border shadow-2xl">
            <div class="flex h-16 items-center justify-between px-4 border-b border-border">
              <span class="text-sm font-bold tracking-tight">CREADOR SOFTWARE</span>
              <button type="button" (click)="setMenuOpen(false)" class="rounded-md p-1.5 text-muted-foreground hover:text-foreground" aria-label="Cerrar menú">
                <app-icon name="x" [size]="20" />
              </button>
            </div>
            <nav class="flex flex-col p-4 gap-1" aria-label="Menú móvil">
              @for (link of navLinks; track link.href) {
                <a [routerLink]="link.href" [class]="mobileNavClass(link)">
                  {{ link.label }}
                  <app-icon name="chevron-right" [size]="16" class="text-muted-foreground" />
                </a>
              }
              <hr class="my-3 border-border" />
              <a routerLink="/login" class="mt-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Iniciar sesión <app-icon name="arrow-right" [size]="14" />
              </a>
            </nav>
          </div>
        </div>
      }

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-border bg-card">
        <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div class="sm:col-span-2 lg:col-span-1">
              <a routerLink="/" class="flex items-center gap-2.5 mb-4">
                <span class="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <app-icon name="code-xml" [size]="18" class="text-primary-foreground" />
                </span>
                <span class="text-sm font-bold tracking-tight text-foreground">CREADOR <span class="text-primary">SOFTWARE</span></span>
              </a>
              <p class="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Soluciones de software para empresas que quieren crecer. Desarrollamos tecnología moderna, escalable y segura.
              </p>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Empresa</h4>
              <ul class="space-y-2">
                @for (link of footerEmpresa; track link.label) {
                  <li>
                    <a [routerLink]="link.href" class="text-sm text-foreground/70 hover:text-foreground transition-colors">{{ link.label }}</a>
                  </li>
                }
              </ul>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Servicios</h4>
              <ul class="space-y-2">
                @for (link of footerServicios; track link.label) {
                  <li>
                    <a [routerLink]="link.href" class="text-sm text-foreground/70 hover:text-foreground transition-colors">{{ link.label }}</a>
                  </li>
                }
              </ul>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contacto</h4>
              <ul class="space-y-3">
                <li><a href="mailto:contacto&#64;creadorsoftware.com" class="text-sm text-foreground/70 hover:text-foreground transition-colors">contacto&#64;creadorsoftware.com</a></li>
                <li><a href="tel:+573001234567" class="text-sm text-foreground/70 hover:text-foreground transition-colors">+57 300 123 4567</a></li>
                <li><p class="text-sm text-foreground/70">Bogotá, Colombia</p></li>
              </ul>
              <div class="flex items-center gap-2 mt-4">
                @for (social of socials; track social) {
                  <span class="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-[10px] font-medium cursor-default transition-colors">{{ social.slice(0, 2) }}</span>
                }
              </div>
            </div>
          </div>
          <div class="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-xs text-muted-foreground">© {{ year }} CREADOR SOFTWARE. Todos los derechos reservados.</p>
            <div class="flex items-center gap-4">
              <a routerLink="/login" class="text-xs text-muted-foreground hover:text-foreground transition-colors">Plataforma</a>
              <span class="text-xs text-muted-foreground">·</span>
              <a routerLink="/contacto" class="text-xs text-muted-foreground hover:text-foreground transition-colors">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class CorporateLayoutComponent {
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly year = new Date().getFullYear();

  readonly navLinks: CorporateNavLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Tecnologías', href: '/tecnologias' },
    { label: 'Soluciones', href: '/soluciones' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Adventure', href: '/adventure' },
  ];

  readonly footerEmpresa: CorporateNavLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Tecnologías', href: '/tecnologias' },
  ];

  readonly footerServicios: CorporateNavLink[] = [
    { label: 'Desarrollo de software', href: '/servicios' },
    { label: 'Desarrollo Full Stack', href: '/servicios' },
    { label: 'UX/UI Design', href: '/servicios' },
    { label: 'DevOps & Cloud', href: '/servicios' },
  ];

  readonly socials = ['GitHub', 'LinkedIn', 'Twitter'];

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setMenuOpen(false);
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  get headerClass(): string {
    return this.scrolled()
      ? 'fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
      : 'fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-transparent';
  }

  setMenuOpen(open: boolean): void {
    this.menuOpen.set(open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  isActive(href: string): boolean {
    const url = this.router.url;
    return url === href || (href !== '/' && url.startsWith(href));
  }

  navLinkClass(link: CorporateNavLink): string {
    const base = 'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors';
    return this.isActive(link.href)
      ? `${base} text-primary bg-primary/5`
      : `${base} text-muted-foreground hover:text-foreground hover:bg-muted`;
  }

  mobileNavClass(link: CorporateNavLink): string {
    const base = 'flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-medium transition-colors';
    return this.isActive(link.href)
      ? `${base} text-primary bg-primary/5`
      : `${base} text-foreground hover:bg-muted`;
  }
}
