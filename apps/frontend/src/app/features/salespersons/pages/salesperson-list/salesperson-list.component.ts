import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { formatCurrency, getRanking, territorios } from '../../../../core/data/vendedores-data';
import type { Vendedor } from '../../../../core/data/vendedores-data';

type SortBy = 'ranking' | 'ventas' | 'nombre';

@Component({
  selector: 'app-salesperson-list',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div>
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Vendedores</h1>
          <p class="text-sm text-muted-foreground">{{ filtered().length }} registros</p>
        </div>
      </div>

      <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-xl border border-border bg-card p-3">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="users" [size]="12" /> Total
          </p>
          <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ indicadores().total }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="award" [size]="12" /> Activos
          </p>
          <p class="mt-0.5 text-lg font-semibold text-success">{{ indicadores().activos }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="trending-up" [size]="12" /> Ventas totales
          </p>
          <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(indicadores().ventasTotales) }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-3">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="dollar-sign" [size]="12" /> Comisiones
          </p>
          <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(indicadores().comisionesTotal) }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative max-w-md flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <app-icon name="search" [size]="16" />
          </span>
          <input type="search" [value]="search()" (input)="onSearchInput($event)"
            placeholder="Buscar por nombre, email, territorio…"
            class="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25" />
          @if (search()) {
            <button type="button" (click)="onClearSearch()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Limpiar búsqueda">
              <app-icon name="x" [size]="16" />
            </button>
          }
        </div>
        <div class="flex items-center gap-2">
          <button type="button" (click)="toggleFilters()" [class]="filtrosButtonClass()">
            <app-icon name="sliders-horizontal" [size]="16" /> Filtros
            @if (activeFilterCount() > 0) {
              <span class="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">{{ activeFilterCount() }}</span>
            }
          </button>
          <select [value]="sortBy()" (change)="onSortChange($event)"
            class="h-9 rounded-lg border border-input bg-card px-3 text-xs text-foreground">
            <option value="ranking">Ranking</option>
            <option value="ventas">Ventas del mes</option>
            <option value="nombre">Nombre</option>
          </select>
          @if (activeFilterCount() > 0) {
            <button type="button" (click)="limpiarFiltros()"
              class="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              <app-icon name="x" [size]="12" /> Limpiar
            </button>
          }
        </div>
      </div>

      @if (showFilters()) {
        <div class="mt-3 flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label class="text-xs font-medium text-muted-foreground">Territorio</label>
            <select [value]="filtroTerritorio()" (change)="onTerritorioChange($event)"
              class="mt-1 h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground">
              <option value="">Todos</option>
              @for (t of territoriosOptions; track t) {
                <option [value]="t">{{ t }}</option>
              }
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-muted-foreground">Estado</label>
            <select [value]="filtroEstado()" (change)="onEstadoChange($event)"
              class="mt-1 h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground">
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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
            <p class="mt-3 text-sm font-medium text-card-foreground">No se encontraron vendedores</p>
            <p class="text-xs text-muted-foreground">Intenta con otros criterios de búsqueda</p>
            @if (activeFilterCount() > 0) {
              <button type="button" (click)="limpiarFiltros()"
                class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">Limpiar búsqueda</button>
            }
          </div>
        } @else {
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/30">
                <th scope="col" class="w-12 px-4 py-3 text-center text-xs font-medium text-muted-foreground">#</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Vendedor</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Territorio</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ventas mes</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Meta</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Clientes</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Comisiones</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Estado</th>
                <th scope="col" class="w-16 px-4 py-3 text-center text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              @for (v of paged(); track v.id) {
                <tr class="cursor-pointer border-b border-border transition-colors hover:bg-muted/30" (click)="openDetail(v)">
                  <td class="px-4 py-3 text-center">
                    <span [class]="rankBadgeClass(v.ranking)">{{ v.ranking }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">{{ v.iniciales }}</span>
                      <div>
                        <p class="font-medium text-card-foreground">{{ v.nombre }}</p>
                        <p class="text-xs text-muted-foreground">{{ v.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">{{ v.territorio }}</td>
                  <td class="px-4 py-3 text-right font-mono font-medium tabular-nums text-card-foreground">{{ formatCurrency(v.ventasMes) }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                      <div class="h-2 w-full max-w-20 overflow-hidden rounded-full bg-muted">
                        <div [class]="cumplimientoBarClass(v.cumplimientoMeta)" [style.width.%]="barWidth(v.cumplimientoMeta)"></div>
                      </div>
                      <span [class]="cumplimientoTextClass(v.cumplimientoMeta)">{{ v.cumplimientoMeta }}%</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center text-card-foreground">{{ v.clientesAsignados }}</td>
                  <td class="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">{{ formatCurrency(v.comisionTotal) }}</td>
                  <td class="px-4 py-3 text-center">
                    <span [class]="estadoBadgeClass(v.estado)">{{ v.estado }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button type="button" (click)="openDetail(v); $event.stopPropagation()"
                      class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Ver perfil">
                      <app-icon name="eye" [size]="16" />
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      @if (filtered().length > perPage) {
        <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p class="text-xs text-muted-foreground">Mostrando {{ shownFrom() }}–{{ shownTo() }} de {{ filtered().length }}</p>
          <nav class="flex items-center gap-1" aria-label="Paginación">
            <button type="button" (click)="goFirst()" [disabled]="page() === 1"
              class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30" aria-label="Primera página">
              <app-icon name="chevrons-left" [size]="16" />
            </button>
            <button type="button" (click)="prevPage()" [disabled]="page() === 1"
              class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30" aria-label="Página anterior">
              <app-icon name="chevron-left" [size]="16" />
            </button>
            @for (num of pageNumbers(); track num) {
              @if (num <= totalPages()) {
                <button type="button" (click)="goToPage(num)" [attr.aria-current]="page() === num ? 'page' : null" [class]="pageButtonClass(num)">{{ num }}</button>
              }
            }
            <button type="button" (click)="nextPage()" [disabled]="page() === totalPages()"
              class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30" aria-label="Página siguiente">
              <app-icon name="chevron-right" [size]="16" />
            </button>
            <button type="button" (click)="goLast()" [disabled]="page() === totalPages()"
              class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30" aria-label="Última página">
              <app-icon name="chevrons-right" [size]="16" />
            </button>
          </nav>
        </div>
      }
    </div>
  `,
})
export class SalespersonListComponent {
  private readonly router = inject(Router);
  private readonly all: Vendedor[] = getRanking();

  readonly territoriosOptions = territorios;
  readonly perPage = 10;

  readonly search = signal('');
  readonly filtroTerritorio = signal('');
  readonly filtroEstado = signal('');
  readonly sortBy = signal<SortBy>('ranking');
  readonly page = signal(1);
  readonly showFilters = signal(false);

  readonly activeFilterCount = computed(() => [this.filtroTerritorio(), this.filtroEstado()].filter(Boolean).length);

  readonly indicadores = computed(() => ({
    total: this.all.length,
    activos: this.all.filter((v) => v.estado === 'Activo').length,
    ventasTotales: this.all.reduce((s, v) => s + v.ventasTotales, 0),
    comisionesTotal: this.all.reduce((s, v) => s + v.comisionTotal, 0),
  }));

  readonly filtered = computed(() => {
    let r = [...this.all];
    const q = this.search().trim().toLowerCase();
    if (q) {
      r = r.filter(
        (v) =>
          v.nombre.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.territorio.toLowerCase().includes(q),
      );
    }
    const ft = this.filtroTerritorio();
    if (ft) {
      r = r.filter((v) => v.territorio === ft);
    }
    const fe = this.filtroEstado();
    if (fe) {
      r = r.filter((v) => v.estado === fe);
    }
    if (this.sortBy() === 'ranking') {
      r.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
    } else if (this.sortBy() === 'ventas') {
      r.sort((a, b) => b.ventasMes - a.ventasMes);
    } else {
      r.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return r;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.perPage)));

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const start = Math.max(1, Math.min(this.page() - 2, total - 4));
    const count = Math.min(5, total);
    return Array.from({ length: count }, (_, i) => start + i);
  });

  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.perPage;
    return this.filtered().slice(start, start + this.perPage);
  });

  readonly shownFrom = computed(() => {
    const len = this.filtered().length;
    return len === 0 ? 0 : (this.page() - 1) * this.perPage + 1;
  });

  readonly shownTo = computed(() => Math.min(this.page() * this.perPage, this.filtered().length));

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  onClearSearch(): void {
    this.search.set('');
    this.page.set(1);
  }

  onTerritorioChange(event: Event): void {
    this.filtroTerritorio.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  onEstadoChange(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortBy);
    this.page.set(1);
  }

  toggleFilters(): void {
    this.showFilters.update((f) => !f);
  }

  limpiarFiltros(): void {
    this.filtroTerritorio.set('');
    this.filtroEstado.set('');
    this.search.set('');
    this.page.set(1);
  }

  goToPage(p: number): void {
    this.page.set(Math.max(1, Math.min(this.totalPages(), p)));
  }

  prevPage(): void {
    this.goToPage(this.page() - 1);
  }

  nextPage(): void {
    this.goToPage(this.page() + 1);
  }

  goFirst(): void {
    this.page.set(1);
  }

  goLast(): void {
    this.page.set(this.totalPages());
  }

  openDetail(v: Vendedor): void {
    this.router.navigate(['/vendedores', v.id]);
  }

  rankBadgeClass(ranking: number): string {
    return (
      'inline-flex size-6 items-center justify-center rounded-md text-[11px] font-bold ' +
      (ranking <= 3 ? 'bg-primary/10 text-primary' : 'text-muted-foreground')
    );
  }

  cumplimientoBarClass(pct: number): string {
    return 'h-full rounded-full transition-all ' + (pct >= 100 ? 'bg-success' : pct >= 80 ? 'bg-warning' : 'bg-destructive');
  }

  cumplimientoTextClass(pct: number): string {
    return (
      'whitespace-nowrap text-[11px] font-medium ' +
      (pct >= 100 ? 'text-success' : pct >= 80 ? 'text-warning' : 'text-destructive')
    );
  }

  barWidth(pct: number): number {
    return Math.min(100, pct);
  }

  estadoBadgeClass(estado: string): string {
    return (
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ' +
      (estado === 'Activo' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')
    );
  }

  filtrosButtonClass(): string {
    return (
      'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ' +
      (this.activeFilterCount() > 0
        ? 'border-primary/30 bg-primary/5 text-primary'
        : 'border-border bg-background text-foreground hover:bg-muted')
    );
  }

  pageButtonClass(p: number): string {
    return (
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium ' +
      (this.page() === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')
    );
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}
