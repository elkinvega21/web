import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type { Pedido } from '../../../../core/data/pedidos-data';
import { estadosPedido, formatCurrency, pedidos } from '../../../../core/data/pedidos-data';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div>
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Pedidos</h1>
          <p class="text-sm text-muted-foreground">{{ filtered().length }} registros</p>
        </div>
        <button
          type="button"
          (click)="nuevoPedido()"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <app-icon name="plus" [size]="16" /> Nuevo pedido
        </button>
      </div>

      <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="shopping-cart" [size]="12" /> Total
          </p>
          <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ indicadores().total }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="triangle-alert" [size]="12" /> Pendientes
          </p>
          <p class="mt-0.5 text-lg font-semibold text-warning">{{ indicadores().pendientes }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="check" [size]="12" /> Completados
          </p>
          <p class="mt-0.5 text-lg font-semibold text-success">{{ indicadores().completados }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="file-text" [size]="12" /> Facturados
          </p>
          <p class="mt-0.5 text-lg font-semibold text-primary">{{ indicadores().facturados }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="ban" [size]="12" /> Cancelados
          </p>
          <p class="mt-0.5 text-lg font-semibold text-destructive">{{ indicadores().cancelados }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative max-w-md flex-1">
          <app-icon name="search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="busqueda"
            placeholder="Buscar por ID, cliente, vendedor…"
            [ngModel]="search()"
            (ngModelChange)="onSearchChange($event)"
            class="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
          />
          @if (search()) {
            <button
              type="button"
              (click)="onClearSearch()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <app-icon name="x" [size]="16" />
            </button>
          }
        </div>
        <button
          type="button"
          (click)="toggleFilters()"
          [class]="filtrosClass()"
        >
          <app-icon name="sliders-horizontal" [size]="16" /> Filtros
          @if (activeFilterCount() > 0) {
            <span class="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">{{ activeFilterCount() }}</span>
          }
        </button>
        @if (activeFilterCount() > 0 || search()) {
          <button
            type="button"
            (click)="clearFilters()"
            class="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <app-icon name="x" [size]="12" /> Limpiar
          </button>
        }
      </div>

      @if (showFilters()) {
        <div class="mt-3 flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label class="text-xs font-medium text-muted-foreground">Estado</label>
            <select
              name="filtro-estado"
              [ngModel]="filtroEstado()"
              (ngModelChange)="onEstadoChange($event)"
              class="mt-1 h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground"
            >
              <option value="">Todos</option>
              @for (e of estados; track e) {
                <option [value]="e">{{ e }}</option>
              }
            </select>
          </div>
        </div>
      }

      <div class="mt-4 overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
        @if (paged().length === 0) {
          <div class="flex flex-col items-center py-16 text-center">
            <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="search" [size]="24" />
            </span>
            <p class="mt-3 text-sm font-medium text-card-foreground">No se encontraron pedidos</p>
            <p class="text-xs text-muted-foreground">Intenta con otros criterios de búsqueda</p>
            @if (search() || filtroEstado()) {
              <button
                type="button"
                (click)="clearFilters()"
                class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Limpiar búsqueda
              </button>
            }
          </div>
        } @else {
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/30">
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Estado</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Vendedor</th>
                <th scope="col" class="w-24 px-4 py-3 text-center text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (p of paged(); track p.id; let last = $last) {
                <tr
                  class="cursor-pointer border-border transition-colors hover:bg-muted/30"
                  [class.border-b]="!last"
                  (click)="irPedido(p)"
                >
                  <td class="px-4 py-3 font-medium text-primary">{{ p.id }}</td>
                  <td class="px-4 py-3 text-card-foreground">{{ p.cliente }}</td>
                  <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(p.total) }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" [class]="estadoBadgeClass(p.estado)">{{ p.estado }}</span>
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">{{ p.fecha }}</td>
                  <td class="px-4 py-3 text-muted-foreground">{{ p.vendedor }}</td>
                  <td class="w-24 px-4 py-3">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        (click)="verPedido($event, p)"
                        class="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Ver"
                      >
                        <app-icon name="eye" [size]="16" />
                      </button>
                      <button
                        type="button"
                        (click)="editarPedido($event, p)"
                        class="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Editar"
                      >
                        <app-icon name="square-pen" [size]="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      @if (filtered().length > perPage) {
        <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p class="text-xs text-muted-foreground">Mostrando {{ mostrandoDesde() }}–{{ mostrandoHasta() }} de {{ filtered().length }}</p>
          <nav class="flex items-center gap-1" aria-label="Paginación">
            <button
              type="button"
              (click)="setPage(1)"
              [disabled]="page() === 1"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            >
              <app-icon name="chevrons-left" [size]="16" />
            </button>
            <button
              type="button"
              (click)="prevPage()"
              [disabled]="page() === 1"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            >
              <app-icon name="chevron-left" [size]="16" />
            </button>
            @for (num of paginaNumeros(); track num) {
              <button
                type="button"
                (click)="setPage(num)"
                [attr.aria-current]="page() === num ? 'page' : null"
                [class]="paginaClass(num)"
              >
                {{ num }}
              </button>
            }
            <button
              type="button"
              (click)="nextPage()"
              [disabled]="page() === totalPages()"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            >
              <app-icon name="chevron-right" [size]="16" />
            </button>
            <button
              type="button"
              (click)="setPage(totalPages())"
              [disabled]="page() === totalPages()"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            >
              <app-icon name="chevrons-right" [size]="16" />
            </button>
          </nav>
        </div>
      }
    </div>
  `,
})
export class OrderListComponent {
  private readonly router = inject(Router);

  readonly estados = estadosPedido;
  readonly formatCurrency = formatCurrency;
  readonly perPage = 10;

  readonly search = signal('');
  readonly filtroEstado = signal('');
  readonly page = signal(1);
  readonly showFilters = signal(false);

  readonly indicadores = computed(() => ({
    total: pedidos.length,
    pendientes: pedidos.filter((p) => p.estado === 'Pendiente').length,
    completados: pedidos.filter((p) => p.estado === 'Completado').length,
    cancelados: pedidos.filter((p) => p.estado === 'Cancelado').length,
    facturados: pedidos.filter((p) => p.estado === 'Facturado').length,
  }));

  readonly filtered = computed(() => {
    let r = [...pedidos];
    const q = this.search().trim().toLowerCase();
    if (q) {
      r = r.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.cliente.toLowerCase().includes(q) ||
          p.vendedor.toLowerCase().includes(q),
      );
    }
    if (this.filtroEstado()) {
      r = r.filter((p) => p.estado === this.filtroEstado());
    }
    r.sort((a, b) => b.fecha.localeCompare(a.fecha));
    return r;
  });

  readonly totalPages = computed(() => Math.ceil(this.filtered().length / this.perPage));
  readonly paged = computed(() =>
    this.filtered().slice((this.page() - 1) * this.perPage, this.page() * this.perPage),
  );
  readonly activeFilterCount = computed(() => (this.filtroEstado() ? 1 : 0));
  readonly mostrandoDesde = computed(() => (this.page() - 1) * this.perPage + 1);
  readonly mostrandoHasta = computed(() => Math.min(this.page() * this.perPage, this.filtered().length));
  readonly paginaNumeros = computed(() => {
    const nums: number[] = [];
    const count = Math.min(5, this.totalPages());
    const start = Math.max(1, Math.min(this.page() - 2, this.totalPages() - 4));
    for (let i = 0; i < count; i++) {
      const num = start + i;
      if (num > this.totalPages()) {
        break;
      }
      nums.push(num);
    }
    return nums;
  });

  readonly filtrosClass = computed(() =>
    this.activeFilterCount() > 0
      ? 'inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 text-sm font-medium text-primary transition-colors'
      : 'inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted',
  );

  onSearchChange(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  onClearSearch(): void {
    this.search.set('');
    this.page.set(1);
  }

  onEstadoChange(value: string): void {
    this.filtroEstado.set(value);
    this.page.set(1);
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  clearFilters(): void {
    this.filtroEstado.set('');
    this.search.set('');
    this.page.set(1);
  }

  nuevoPedido(): void {
    this.router.navigate(['/pedidos', 'nuevo']);
  }

  irPedido(p: Pedido): void {
    this.router.navigate(['/pedidos', p.id]);
  }

  verPedido(event: Event, p: Pedido): void {
    event.stopPropagation();
    this.router.navigate(['/pedidos', p.id]);
  }

  editarPedido(event: Event, p: Pedido): void {
    event.stopPropagation();
    this.router.navigate(['/pedidos', p.id, 'editar']);
  }

  setPage(n: number): void {
    this.page.set(n);
  }

  prevPage(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.page.update((p) => Math.min(this.totalPages(), p + 1));
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: 'bg-warning/10 text-warning',
      Completado: 'bg-success/10 text-success',
      Cancelado: 'bg-destructive/10 text-destructive',
      Facturado: 'bg-primary/10 text-primary',
    };
    return map[estado] ?? '';
  }

  paginaClass(num: number): string {
    return this.page() === num
      ? 'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium bg-primary text-primary-foreground'
      : 'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium text-muted-foreground hover:bg-muted';
  }
}
