import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { DEMO_USER } from '../../../core/data/auth-config';
import { notifications as defaultNotifications } from '../../../core/data/dashboard-data';
import { BrandMarkComponent } from '../../components/brand-mark/brand-mark.component';
import { IconComponent } from '../../components/icon/icon.component';
import { AppConfirmDialog } from '../../components/confirm-dialog/confirm-dialog.component';
import { AppInput } from '../../components/input/input.component';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

const navMain: NavItem[] = [
  { label: 'Panel', icon: 'layout-dashboard', href: '/dashboard' },
  { label: 'Pedidos', icon: 'shopping-cart', href: '/pedidos' },
  { label: 'Productos', icon: 'package', href: '/productos' },
  { label: 'Inventario', icon: 'trending-up', href: '/productos/inventario' },
  { label: 'Vendedores', icon: 'users', href: '/vendedores' },
  { label: 'Clientes', icon: 'user-check', href: '/clientes' },
  { label: 'Territorios', icon: 'map', href: '/territorios' },
  { label: 'Promociones', icon: 'tag', href: '/promociones' },
  { label: 'Reportes', icon: 'bar-chart-3', href: '/reportes' },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    BrandMarkComponent,
    IconComponent,
    AppConfirmDialog,
    AppInput,
  ],
  template: `
    <div class="flex min-h-svh bg-background">
      <!-- Sidebar -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-[2px] lg:hidden"
          (click)="sidebarOpen.set(false)"
          aria-hidden="true"
        ></div>
      }
      <aside
        class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 lg:translate-x-0"
        [class]="asideClass"
      >
        <div class="flex h-16 items-center border-b border-sidebar-border px-4">
          @if (collapsed()) {
            <div class="mx-auto">
              <app-brand-mark [showText]="false" />
            </div>
          } @else {
            <app-brand-mark />
            <div class="flex-1"></div>
          }
          <button
            type="button"
            (click)="sidebarOpen.set(false)"
            class="inline-flex size-8 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring/25 lg:hidden"
            [class.hidden]="collapsed()"
            aria-label="Cerrar menú"
          >
            <app-icon name="x" [size]="20" />
          </button>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Principal">
          @if (!collapsed()) {
            <p class="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
              Operación
            </p>
          }
          @for (item of navMain; track item.href) {
            <a
              [routerLink]="item.href"
              [attr.aria-current]="isActive(item) ? 'page' : null"
              [title]="collapsed() ? item.label : null"
              [class]="itemLinkClass(item)"
            >
              <app-icon [name]="item.icon" [size]="18" class="shrink-0" />
              @if (!collapsed()) {
                <span class="flex-1 truncate">{{ item.label }}</span>
                @if (item.badge) {
                  <span class="inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {{ item.badge }}
                  </span>
                }
              }
            </a>
          }
        </nav>

        <div class="border-t border-sidebar-border p-3">
          @if (user(); as u) {
            <div
              class="flex items-center rounded-lg border border-sidebar-border"
              [class]="collapsed() ? 'justify-center p-1.5' : 'gap-3 px-3 py-2.5'"
              [title]="collapsed() ? u.name + ' · ' + u.role : null"
            >
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {{ u.initials }}
              </span>
              @if (!collapsed()) {
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-sidebar-foreground">{{ u.name }}</p>
                  <p class="truncate text-xs text-sidebar-foreground/70">{{ u.role }}</p>
                </div>
              }
            </div>
          }
          <button
            type="button"
            (click)="toggleCollapse()"
            class="mt-2 flex w-full items-center gap-2 rounded-lg py-2 text-xs text-sidebar-foreground/70 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring/25"
            [class]="collapsed() ? 'justify-center' : 'px-3'"
            [attr.aria-label]="collapsed() ? 'Expandir menú lateral' : 'Colapsar menú lateral'"
            [attr.aria-expanded]="!collapsed()"
          >
            <app-icon
              name="chevron-left"
              [size]="14"
              class="transition-transform"
              [class.rotate-180]="collapsed()"
            />
            @if (!collapsed()) {
              <span>Colapsar</span>
            }
          </button>
        </div>
      </aside>

      <!-- Content column -->
      <div
        class="flex flex-1 flex-col transition-all duration-200"
        [class.lg:pl-16]="collapsed()"
        [class.lg:pl-64]="!collapsed()"
      >
        <header class="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur">
          <div class="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              (click)="sidebarOpen.set(true)"
              [class]="iconButtonClass + ' lg:hidden'"
              aria-label="Abrir menú"
            >
              <app-icon name="menu" [size]="20" />
            </button>

            <!-- El buscador ocupa el espacio libre: antes vivía a la derecha y
                 dejaba media cabecera vacía en escritorio. -->
            <div class="relative hidden max-w-md flex-1 sm:block">
              <app-icon
                name="search"
                [size]="16"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                appInput
                type="search"
                placeholder="Buscar en el sistema…"
                [className]="'h-9 pl-9'"
                aria-label="Buscar en el sistema"
              />
            </div>

            <div class="flex flex-1 items-center justify-end gap-1">
              <div class="relative">
                <button
                  type="button"
                  (click)="toggleNotif()"
                  [class]="iconButtonClass + ' relative'"
                  [attr.aria-label]="notifAriaLabel()"
                  aria-haspopup="true"
                  [attr.aria-expanded]="notifOpen()"
                >
                  <app-icon name="bell" [size]="20" />
                  @if (hasUnread()) {
                    <span class="absolute right-1.5 top-1 size-2 rounded-full bg-destructive ring-2 ring-background" aria-hidden="true"></span>
                  }
                </button>
                @if (notifOpen()) {
                  <div class="fixed inset-0 z-30" (click)="notifOpen.set(false)" aria-hidden="true"></div>
                  <div class="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-border bg-popover shadow-lg">
                    <div class="flex items-center justify-between border-b border-border px-4 py-3">
                      <h4 class="text-sm font-medium text-popover-foreground">Notificaciones</h4>
                      @if (unreadCount() > 0) {
                        <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {{ unreadCount() }} sin leer
                        </span>
                      }
                    </div>
                    <div class="max-h-80 overflow-y-auto p-1.5">
                      @for (n of defaultNotifications; track n.id) {
                        <div class="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-muted">
                          <span
                            class="mt-1 size-1.5 shrink-0 rounded-full"
                            [class.bg-primary]="n.unread"
                            [class.bg-transparent]="!n.unread"
                            aria-hidden="true"
                          ></span>
                          <div class="min-w-0">
                            <p
                              class="leading-snug"
                              [class.font-medium]="n.unread"
                              [class.text-popover-foreground]="n.unread"
                              [class.text-muted-foreground]="!n.unread"
                            >{{ n.title }}</p>
                            <p class="mt-0.5 text-muted-foreground">{{ n.time }}</p>
                          </div>
                        </div>
                      } @empty {
                        <p class="px-2.5 py-6 text-center text-xs text-muted-foreground">
                          No tienes notificaciones.
                        </p>
                      }
                    </div>
                  </div>
                }
              </div>

              <div class="relative hidden sm:block">
                <button
                  type="button"
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 rounded-lg p-1 pl-2 transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/25"
                  aria-label="Menú de usuario"
                  aria-haspopup="true"
                  [attr.aria-expanded]="userMenuOpen()"
                >
                  @if (user(); as u) {
                    <div class="hidden text-right lg:block">
                      <p class="text-sm font-medium leading-tight text-foreground">{{ u.name }}</p>
                      <p class="text-xs leading-tight text-muted-foreground">{{ u.role }}</p>
                    </div>
                    <span class="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" aria-hidden="true">
                      {{ u.initials }}
                    </span>
                  }
                  <app-icon
                    name="chevron-down"
                    [size]="14"
                    class="text-muted-foreground transition-transform"
                    [class.rotate-180]="userMenuOpen()"
                  />
                </button>
                @if (userMenuOpen()) {
                  <div class="fixed inset-0 z-30" (click)="userMenuOpen.set(false)" aria-hidden="true"></div>
                  <div class="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg" role="menu">
                    @if (user(); as u) {
                      <div class="border-b border-border px-3 py-2.5">
                        <p class="truncate text-sm font-medium text-popover-foreground">{{ u.name }}</p>
                        <p class="truncate text-xs text-muted-foreground">{{ u.email }}</p>
                      </div>
                    }
                    <div class="p-1.5">
                      <a
                        routerLink="/perfil"
                        (click)="userMenuOpen.set(false)"
                        role="menuitem"
                        class="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-popover-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/25"
                      >
                        <app-icon name="user" [size]="16" class="text-muted-foreground" />
                        Mi perfil
                      </a>
                      <button
                        type="button"
                        (click)="openLogout()"
                        role="menuitem"
                        class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-destructive transition-colors outline-none hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring/25"
                      >
                        <app-icon name="log-out" [size]="16" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </header>

        <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <router-outlet />
        </main>
      </div>

      <app-confirm-dialog
        [(open)]="confirmOpen"
        icon="log-out"
        [title]="'¿Cerrar sesión?'"
        description="Se cerrará tu sesión actual y volverás a la pantalla de acceso."
        [confirmLabel]="loggingOut() ? 'Cerrando…' : 'Cerrar sesión'"
        [loading]="loggingOut()"
        (confirm)="handleLogout()"
      />
    </div>
  `,
})
export class AppShellComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly navMain = navMain;
  readonly defaultNotifications = defaultNotifications;

  readonly sidebarOpen = signal(false);
  readonly collapsed = signal(false);
  readonly notifOpen = signal(false);
  readonly userMenuOpen = signal(false);
  readonly confirmOpen = signal(false);
  readonly loggingOut = signal(false);
  readonly user = signal<{ name: string; initials: string; role: string; email: string } | null>(
    null,
  );

  constructor() {
    const stored = localStorage.getItem('adventure-sidebar-collapsed');
    this.collapsed.set(stored === '1');

    effect(() => {
      if (!this.sidebarOpen()) {
        return () => {};
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.sidebarOpen.set(false);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    });
  }

  ngOnInit(): void {
    this.authService
      .me()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (u) => {
          const name = u.name || DEMO_USER.user.name;
          this.user.set({
            name,
            initials: this.initials(name),
            role: u.roles?.[0] ?? DEMO_USER.user.role,
            email: u.email || DEMO_USER.user.email,
          });
        },
        error: () => {
          this.user.set({
            name: DEMO_USER.user.name,
            initials: DEMO_USER.user.initials,
            role: DEMO_USER.user.role,
            email: DEMO_USER.user.email,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(item: NavItem): boolean {
    if (item.href === '/dashboard') {
      return this.router.url === '/dashboard';
    }
    return this.router.url.startsWith(item.href);
  }

  toggleNotif(): void {
    this.notifOpen.update((v) => !v);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
    this.notifOpen.set(false);
  }

  /** Los desplegables se cerraban solo con clic; con teclado quedaban atrapados. */
  @HostListener('document:keydown.escape')
  closeMenus(): void {
    this.notifOpen.set(false);
    this.userMenuOpen.set(false);
    this.sidebarOpen.set(false);
  }

  /** Estilo común de los botones de icono de la cabecera. */
  get iconButtonClass(): string {
    return 'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/25';
  }

  unreadCount(): number {
    return this.defaultNotifications.filter((n) => n.unread).length;
  }

  notifAriaLabel(): string {
    const unread = this.unreadCount();
    return unread > 0 ? `Notificaciones, ${unread} sin leer` : 'Notificaciones';
  }

  itemLinkClass(item: NavItem): string {
    // Colapsado el carril mide 64px: con `px-3` el icono quedaba descentrado,
    // así que en ese estado se centra y se quita el relleno lateral.
    const layout = this.collapsed()
      ? 'flex items-center justify-center rounded-lg py-2'
      : 'flex items-center gap-3 rounded-lg px-3 py-2';
    const tone = this.isActive(item)
      ? 'bg-primary/10 text-primary'
      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';
    return `${layout} text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/25 ${tone}`;
  }

  hasUnread(): boolean {
    return this.defaultNotifications.some((n) => n.unread);
  }

  get asideClass(): string {
    const cls = [
      this.collapsed() ? 'w-16' : 'w-64',
      this.sidebarOpen() ? 'translate-x-0' : '-translate-x-full',
    ].join(' ');
    return cls;
  }

  toggleCollapse(): void {
    this.collapsed.update((c) => !c);
    localStorage.setItem('adventure-sidebar-collapsed', this.collapsed() ? '1' : '0');
  }

  openLogout(): void {
    this.userMenuOpen.set(false);
    this.confirmOpen.set(true);
  }

  handleLogout(): void {
    this.loggingOut.set(true);
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    }, 700);
  }

  private initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }
}
