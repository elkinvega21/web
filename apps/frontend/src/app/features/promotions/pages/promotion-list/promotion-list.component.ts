import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { promociones, formatCurrency, getPromosVencimiento } from '../../../../core/data/promociones-data';
import type { Promocion } from '../../../../core/data/promociones-data';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [IconComponent, AppConfirmDialog],
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Promociones</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ filtered().length }} registros</p>
      </div>
      <button type="button" (click)="goNuevo()"
        class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        <app-icon name="plus" [size]="16" /> Nueva promoción
      </button>
    </div>

    @if (porVencer() > 0) {
      <div class="mb-4 flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
        <app-icon name="alert-triangle" [size]="16" class="shrink-0" />
        <span><strong>{{ porVencer() }} promociones</strong> están por vencer en los próximos 7 días. Revisa las fechas de finalización.</span>
      </div>
    }

    <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="tag" [size]="12" /> Total</p>
        <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ total() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="check" [size]="12" /> Activas</p>
        <p class="mt-0.5 text-lg font-semibold text-success">{{ activas() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="calendar" [size]="12" /> Programadas</p>
        <p class="mt-0.5 text-lg font-semibold text-primary">{{ programadas() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="x" [size]="12" /> Vencidas</p>
        <p class="mt-0.5 text-lg font-semibold text-muted-foreground">{{ vencidas() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="toggle-left" [size]="12" /> Desactivadas</p>
        <p class="mt-0.5 text-lg font-semibold text-destructive">{{ desactivadas() }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative max-w-md flex-1">
        <app-icon name="search" [size]="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="search" [value]="search()" (input)="onSearchInput($event)" placeholder="Buscar promoción…"
          aria-label="Buscar promociones"
          class="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25" />
        @if (search()) {
          <button type="button" (click)="clearSearch()"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Limpiar búsqueda">
            <app-icon name="x" [size]="16" />
          </button>
        }
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center rounded-lg border border-input bg-card p-0.5">
          <button type="button" (click)="setView('table')" [class]="viewBtnClass('table')" aria-label="Vista tabla">
            <app-icon name="list" [size]="16" />
          </button>
          <button type="button" (click)="setView('calendar')" [class]="viewBtnClass('calendar')" aria-label="Vista calendario">
            <app-icon name="calendar" [size]="16" />
          </button>
        </div>
        <button type="button" (click)="toggleFilters()" [class]="filtersBtnClass()">
          <app-icon name="sliders-horizontal" [size]="16" /> Filtros
          @if (activeFilterCount() > 0) {
            <span class="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">{{ activeFilterCount() }}</span>
          }
        </button>
        @if (activeFilterCount() > 0 || search()) {
          <button type="button" (click)="clearFiltersAndSearch()"
            class="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <app-icon name="x" [size]="12" /> Limpiar
          </button>
        }
      </div>
    </div>

    @if (showFilters()) {
      <div class="mt-3 flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <label class="block text-xs font-medium text-muted-foreground" for="filter-estado">Estado</label>
          <select id="filter-estado" [value]="filtroEstado()" (change)="onFilterEstado($event)"
            class="mt-1 h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
            <option value="">Todos</option>
            @for (e of estados; track e) {
              <option [value]="e">{{ e }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-muted-foreground" for="filter-tipo">Tipo</label>
          <select id="filter-tipo" [value]="filtroTipo()" (change)="onFilterTipo($event)"
            class="mt-1 h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
            <option value="">Todos</option>
            @for (t of tipos; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
      </div>
    }

    @if (viewMode() === 'table') {
      <div class="mt-4 overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
        @if (paged().length === 0) {
          <div class="flex flex-col items-center px-4 py-16 text-center">
            <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="search" [size]="24" />
            </span>
            <p class="mt-3 text-sm font-medium text-card-foreground">No se encontraron promociones</p>
            <p class="mt-1 text-xs text-muted-foreground">Intenta con otros criterios de búsqueda</p>
            @if (search() || activeFilterCount() > 0) {
              <button type="button" (click)="clearFiltersAndSearch()"
                class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Limpiar búsqueda
              </button>
            }
          </div>
        } @else {
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/30">
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Promoción</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Tipo</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Descuento</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Inicio</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Fin</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Estado</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Productos</th>
                <th scope="col" class="w-36 px-4 py-3 text-center text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (p of paged(); track p.id) {
                <tr class="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/30" (click)="goDetail(p.id)">
                  <td class="px-4 py-3">
                    <div>
                      <p class="font-medium text-card-foreground">{{ p.nombre }}</p>
                      <p class="max-w-[240px] truncate text-xs text-muted-foreground">{{ p.descripcion }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                      [style.background-color]="tipoBg(p.tipo)" [style.color]="tipoFg(p.tipo)">{{ p.tipo }}</span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-right font-mono font-medium text-card-foreground">{{ descuentoLabel(p) }}</td>
                  <td class="whitespace-nowrap px-4 py-3 text-center text-[11px] text-muted-foreground">{{ p.fechaInicio }}</td>
                  <td class="whitespace-nowrap px-4 py-3 text-center">
                    <span [class]="finCellClass(p)">{{ p.fechaFin }}{{ diasSufijo(p) }}</span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-center">
                    <span [class]="estadoBadgeClass(p.estado)">{{ p.estado }}</span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">
                    {{ p.productoNombres.length > 0 ? p.productoNombres.length + ' productos' : '—' }}
                  </td>
                  <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                    <div class="flex items-center justify-center gap-0.5">
                      <button type="button" (click)="goDetail(p.id)" aria-label="Ver"
                        class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <app-icon name="eye" [size]="16" />
                      </button>
                      <button type="button" (click)="goEdit(p.id)" aria-label="Editar"
                        class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <app-icon name="square-pen" [size]="16" />
                      </button>
                      <button type="button" (click)="goDuplicar(p)" aria-label="Duplicar"
                        class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <app-icon name="copy" [size]="16" />
                      </button>
                      @if (p.estado === 'Activa') {
                        <button type="button" (click)="handleDeactivate()" aria-label="Desactivar"
                          class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <app-icon name="toggle-left" [size]="16" />
                        </button>
                      }
                      <button type="button" (click)="openDelete(p)" aria-label="Eliminar"
                        class="rounded-md p-1.5 text-destructive/60 transition-colors hover:bg-destructive/10 hover:text-destructive">
                        <app-icon name="trash-2" [size]="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    } @else {
      <div class="mt-4 rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
        <h3 class="mb-1 text-sm font-semibold capitalize text-card-foreground">{{ mesActual() }}</h3>
        <p class="mb-4 text-xs text-muted-foreground">Vista calendario de promociones activas</p>
        <div class="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-border">
          @for (d of diaSemanaNombres; track d) {
            <div class="bg-muted/30 px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground">{{ d }}</div>
          }
          @for (week of calendarWeeks(); track week[0].getTime()) {
            @for (date of week; track date.getTime()) {
              <div [class]="calCellClass(date)">
                <span [class]="calDayClass(date)">{{ date.getDate() }}</span>
                <div class="space-y-0.5">
                  @for (promo of promosDelDia(date); track promo.id) {
                    @if ($index < 2) {
                      <button type="button" (click)="goDetail(promo.id)"
                        class="block w-full truncate rounded px-1 py-0.5 text-left text-[9px] font-medium leading-tight text-white transition-opacity hover:opacity-80"
                        [style.background-color]="promoEstadoColor(promo.estado)">{{ promo.nombre }}</button>
                    }
                  }
                  @if (promosDelDia(date).length > 2) {
                    <p class="text-[9px] text-muted-foreground">+{{ promosDelDia(date).length - 2 }} más</p>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    }

    @if (viewMode() === 'table' && filtered().length > perPage) {
      <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p class="text-xs text-muted-foreground">Mostrando {{ rangeStart() }}–{{ rangeEnd() }} de {{ filtered().length }}</p>
        <nav class="flex items-center gap-1" aria-label="Paginación">
          <button type="button" (click)="firstPage()" [disabled]="page() === 1" aria-label="Primera página"
            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30">
            <app-icon name="chevrons-left" [size]="16" />
          </button>
          <button type="button" (click)="prevPage()" [disabled]="page() === 1" aria-label="Página anterior"
            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30">
            <app-icon name="chevron-left" [size]="16" />
          </button>
          @for (num of pageNumbers(); track num) {
            <button type="button" (click)="goToPage(num)" [attr.aria-current]="page() === num ? 'page' : null"
              [class]="pageBtnClass(num)">{{ num }}</button>
          }
          <button type="button" (click)="nextPage()" [disabled]="page() === totalPages()" aria-label="Página siguiente"
            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30">
            <app-icon name="chevron-right" [size]="16" />
          </button>
          <button type="button" (click)="lastPage()" [disabled]="page() === totalPages()" aria-label="Última página"
            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30">
            <app-icon name="chevrons-right" [size]="16" />
          </button>
        </nav>
      </div>
    }

    <app-confirm-dialog [(open)]="deleteOpen" icon="circle-alert" title="¿Eliminar promoción?"
      [description]="'Esta acción no se puede deshacer. La promoción se eliminará permanentemente.'"
      confirmLabel="Eliminar" (confirm)="confirmDelete()" />
  `,
})
export class PromotionListComponent {
  private readonly router = inject(Router);

  readonly estados = ['Activa', 'Programada', 'Vencida', 'Desactivada'];
  readonly tipos = ['Porcentaje', 'Monto fijo', '2x1', 'Combo'];
  readonly perPage = 10;

  readonly search = signal('');
  readonly filtroEstado = signal('');
  readonly filtroTipo = signal('');
  readonly showFilters = signal(false);
  readonly viewMode = signal<'table' | 'calendar'>('table');
  readonly page = signal(1);
  readonly deleteOpen = signal(false);
  readonly deleteTarget = signal<Promocion | null>(null);

  readonly hoy = new Date();
  readonly diaSemanaNombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  readonly total = computed(() => promociones.length);
  readonly activas = computed(() => promociones.filter((p) => p.estado === 'Activa').length);
  readonly programadas = computed(() => promociones.filter((p) => p.estado === 'Programada').length);
  readonly vencidas = computed(() => promociones.filter((p) => p.estado === 'Vencida').length);
  readonly desactivadas = computed(() => promociones.filter((p) => p.estado === 'Desactivada').length);
  readonly porVencer = computed(() => getPromosVencimiento().length);

  readonly activeFilterCount = computed(
    () => (this.filtroEstado() ? 1 : 0) + (this.filtroTipo() ? 1 : 0),
  );

  readonly filtered = computed(() => {
    let result = [...promociones];
    const q = this.search().trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q),
      );
    }
    if (this.filtroEstado()) {
      result = result.filter((p) => p.estado === this.filtroEstado());
    }
    if (this.filtroTipo()) {
      result = result.filter((p) => p.tipo === this.filtroTipo());
    }
    result.sort((a, b) => b.creado.localeCompare(a.creado));
    return result;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.perPage)));

  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.perPage;
    return this.filtered().slice(start, start + this.perPage);
  });

  readonly rangeStart = computed(() => Math.min((this.page() - 1) * this.perPage + 1, this.filtered().length));
  readonly rangeEnd = computed(() => Math.min(this.page() * this.perPage, this.filtered().length));

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const start = Math.max(1, Math.min(current - 2, total - 4));
    const end = Math.min(total, start + 4);
    const nums: number[] = [];
    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  });

  readonly mesActual = computed(() => {
    const m = this.hoy.toLocaleString('es-CO', { month: 'long', year: 'numeric' });
    return m.charAt(0).toUpperCase() + m.slice(1);
  });

  readonly calendarWeeks = computed(() => {
    const first = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  goNuevo(): void {
    this.router.navigate(['/promociones/nuevo']);
  }

  goDetail(id: string): void {
    this.router.navigate(['/promociones', id]);
  }

  goEdit(id: string): void {
    this.router.navigate(['/promociones', id, 'editar']);
  }

  goDuplicar(p: Promocion): void {
    this.router.navigate(['/promociones/nuevo'], {
      queryParams: { duplicar: p.id, nombre: `${p.nombre} (copia)` },
    });
  }

  handleDeactivate(): void {}

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  onFilterEstado(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  onFilterTipo(event: Event): void {
    this.filtroTipo.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  clearFiltersAndSearch(): void {
    this.filtroEstado.set('');
    this.filtroTipo.set('');
    this.search.set('');
    this.page.set(1);
  }

  setView(mode: 'table' | 'calendar'): void {
    this.viewMode.set(mode);
  }

  firstPage(): void {
    this.page.set(1);
  }

  prevPage(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.page.update((p) => Math.min(this.totalPages(), p + 1));
  }

  lastPage(): void {
    this.page.set(this.totalPages());
  }

  goToPage(num: number): void {
    this.page.set(num);
  }

  openDelete(p: Promocion): void {
    this.deleteTarget.set(p);
    this.deleteOpen.set(true);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    const index = promociones.findIndex((p) => p.id === target.id);
    if (index !== -1) {
      promociones.splice(index, 1);
    }
    this.deleteOpen.set(false);
    this.deleteTarget.set(null);
    const total = this.totalPages();
    if (this.page() > total) {
      this.page.set(total || 1);
    }
  }

  diasRestantes(fechaFin: string): number | null {
    const [dd, mm, yyyy] = fechaFin.split('/').map(Number);
    const fin = new Date(yyyy, mm - 1, dd);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diff = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  }

  diasSufijo(p: Promocion): string {
    if (p.estado !== 'Activa') {
      return '';
    }
    const d = this.diasRestantes(p.fechaFin);
    return d !== null ? ` (${d}d)` : '';
  }

  finCellClass(p: Promocion): string {
    const d = this.diasRestantes(p.fechaFin);
    const urgente = d !== null && d <= 3 && p.estado === 'Activa';
    return 'text-[11px] ' + (urgente ? 'font-medium text-destructive' : 'text-muted-foreground');
  }

  descuentoLabel(p: Promocion): string {
    if (p.tipo === 'Porcentaje') {
      return `${p.valor}%`;
    }
    if (p.tipo === 'Monto fijo') {
      return formatCurrency(p.valor);
    }
    if (p.tipo === '2x1') {
      return '2x1';
    }
    return `-${p.valor}%`;
  }

  estadoBadgeClass(estado: string): string {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ';
    switch (estado) {
      case 'Activa':
        return base + 'bg-success/10 text-success';
      case 'Programada':
        return base + 'bg-primary/10 text-primary';
      case 'Vencida':
        return base + 'bg-muted text-muted-foreground';
      default:
        return base + 'bg-destructive/10 text-destructive';
    }
  }

  tipoBg(tipo: string): string {
    switch (tipo) {
      case 'Porcentaje':
        return 'rgba(59,130,246,0.1)';
      case 'Monto fijo':
        return 'rgba(245,158,11,0.1)';
      case '2x1':
        return 'rgba(16,185,129,0.1)';
      case 'Combo':
        return 'rgba(168,85,247,0.1)';
      default:
        return 'hsl(var(--muted))';
    }
  }

  tipoFg(tipo: string): string {
    switch (tipo) {
      case 'Porcentaje':
        return '#3b82f6';
      case 'Monto fijo':
        return '#f59e0b';
      case '2x1':
        return '#10b981';
      case 'Combo':
        return '#a855f7';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  }

  promoEstadoColor(estado: string): string {
    return estado === 'Activa' ? '#22c55e' : estado === 'Programada' ? '#6366f1' : '#a1a1aa';
  }

  promosDelDia(date: Date): Promocion[] {
    return promociones.filter((p) => {
      const [di, mi, yi] = p.fechaInicio.split('/').map(Number);
      const [df, mf, yf] = p.fechaFin.split('/').map(Number);
      const inicio = new Date(yi, mi - 1, di);
      const fin = new Date(yf, mf - 1, df);
      return date >= inicio && date <= fin;
    });
  }

  isHoy(date: Date): boolean {
    return date.toDateString() === this.hoy.toDateString();
  }

  esDelMes(date: Date): boolean {
    return date.getMonth() === this.hoy.getMonth();
  }

  calCellClass(date: Date): string {
    return (
      'min-h-20 bg-card p-1.5 transition-colors ' +
      (this.esDelMes(date) ? 'hover:bg-muted/30' : 'hover:bg-muted/10') +
      (this.isHoy(date) ? ' ring-1 ring-primary/30' : '')
    );
  }

  calDayClass(date: Date): string {
    return (
      'mb-1 text-[11px] font-medium ' +
      (this.isHoy(date) ? 'text-primary' : 'text-muted-foreground')
    );
  }

  viewBtnClass(mode: 'table' | 'calendar'): string {
    return (
      'rounded-md p-1.5 text-muted-foreground transition-colors ' +
      (this.viewMode() === mode ? 'bg-accent text-accent-foreground' : 'hover:text-foreground')
    );
  }

  filtersBtnClass(): string {
    return (
      'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ' +
      (this.activeFilterCount() > 0
        ? 'border-primary/30 bg-primary/5 text-primary'
        : 'border-border bg-background text-foreground hover:bg-muted')
    );
  }

  pageBtnClass(num: number): string {
    return (
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ' +
      (this.page() === num ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')
    );
  }
}
