import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppInput } from '../../../../shared/components/input/input.component';
import { AppConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { clientes, formatCurrency } from '../../../../core/data/clientes-data';
import type { Cliente } from '../../../../core/data/clientes-data';

type SortKey =
  | 'nombre'
  | 'identificacion'
  | 'territorio'
  | 'vendedorAsignado'
  | 'categoria'
  | 'estado'
  | 'totalPedidos'
  | 'totalGastado';

interface CustomerFilters {
  territorio?: string;
  estado?: string;
  categoria?: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [IconComponent, AppButton, AppInput, AppConfirmDialog],
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Clientes</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ filtered().length }} registros</p>
      </div>
      <div class="flex items-center gap-2">
        <button appButton variant="outline" type="button" (click)="openImport()">
          <app-icon name="upload" [size]="16" /> Importar
        </button>
        <button appButton variant="outline" type="button" (click)="openExport()">
          <app-icon name="download" [size]="16" /> Exportar
        </button>
        <button appButton type="button" (click)="goNuevo()">
          <app-icon name="plus" [size]="16" /> Nuevo cliente
        </button>
      </div>
    </div>

    <div class="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-border bg-card p-4">
        <p class="text-xs font-medium text-muted-foreground">Total clientes</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-foreground">{{ kpiTotal() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-4">
        <p class="text-xs font-medium text-muted-foreground">Activos</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-foreground">{{ kpiActivos() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-4">
        <p class="text-xs font-medium text-muted-foreground">Categoría A</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-foreground">{{ kpiCategoriaA() }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-4">
        <p class="text-xs font-medium text-muted-foreground">Total vendido</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-foreground">{{ formatCurrency(kpiVentas()) }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative max-w-md flex-1">
        <app-icon name="search" [size]="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input appInput type="search" [value]="search()" (input)="onSearchInput($event)" (keydown)="onSearchKeydown($event)"
          placeholder="Buscar por nombre, NIT, email, teléfono…" aria-label="Buscar clientes"
          [className]="'pl-10 pr-10'" />
        @if (search()) {
          <button type="button" (click)="clearSearch()"
            class="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/25"
            aria-label="Limpiar búsqueda">
            <app-icon name="x" [size]="14" />
          </button>
        }
      </div>
      <div class="flex items-center gap-2">
        <button type="button" (click)="toggleFilters()" [class]="filtersBtnClass()">
          <app-icon name="sliders-horizontal" [size]="16" /> Filtros
          @if (activeFilterCount() > 0) {
            <span class="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">{{ activeFilterCount() }}</span>
          }
        </button>
        @if (activeFilterCount() > 0 || search()) {
          <button appButton variant="ghost" size="sm" type="button" (click)="clearFiltersAndSearch()">
            <app-icon name="x" [size]="12" /> Limpiar
          </button>
        }
      </div>
    </div>

    @if (showFilters()) {
      <div class="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <label class="block text-xs font-medium text-muted-foreground" for="filter-territorio">Territorio</label>
          <select id="filter-territorio" [value]="filters().territorio ?? ''" (change)="onFilterTerritorio($event)"
            [class]="selectClass">
            <option value="">Todos</option>
            @for (t of filterTerritories(); track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-muted-foreground" for="filter-estado">Estado</label>
          <select id="filter-estado" [value]="filters().estado ?? ''" (change)="onFilterEstado($event)"
            [class]="selectClass">
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-muted-foreground" for="filter-categoria">Categoría</label>
          <select id="filter-categoria" [value]="filters().categoria ?? ''" (change)="onFilterCategoria($event)"
            [class]="selectClass">
            <option value="">Todas</option>
            <option value="A">A — Premium</option>
            <option value="B">B — Estándar</option>
            <option value="C">C — Básico</option>
          </select>
        </div>
      </div>
    }

    <div class="mt-4 overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
      @if (loading()) {
        <div class="p-4">
          @for (row of skeletonRows; track row) {
            <div class="mb-4 flex items-center gap-4">
              <div class="size-8 shrink-0 animate-pulse rounded-full bg-muted"></div>
              <div class="h-4 w-40 animate-pulse rounded bg-muted"></div>
              <div class="h-4 w-28 animate-pulse rounded bg-muted"></div>
              <div class="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div class="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div class="ml-auto h-4 w-16 animate-pulse rounded bg-muted"></div>
            </div>
          }
        </div>
      } @else if (paged().length === 0) {
        <div class="flex flex-col items-center justify-center px-4 py-16 text-center">
          <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <app-icon name="search" [size]="24" />
          </span>
          <p class="mt-3 text-sm font-medium text-foreground">No se encontraron clientes</p>
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
              <th scope="col" class="w-10 px-4 py-3">
                <input type="checkbox" [checked]="allSelected()" (change)="toggleAll()" aria-label="Seleccionar todos"
                  class="rounded border-border text-primary focus-visible:ring-primary" />
              </th>
              <th scope="col" (click)="toggleSort('nombre')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Cliente
              </th>
              <th scope="col" (click)="toggleSort('identificacion')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Identificación
              </th>
              <th scope="col" (click)="toggleSort('territorio')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Territorio
              </th>
              <th scope="col" (click)="toggleSort('vendedorAsignado')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Vendedor
              </th>
              <th scope="col" (click)="toggleSort('categoria')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Categoría
              </th>
              <th scope="col" (click)="toggleSort('estado')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Estado
              </th>
              <th scope="col" (click)="toggleSort('totalPedidos')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Pedidos
              </th>
              <th scope="col" (click)="toggleSort('totalGastado')"
                class="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Total gastado
              </th>
              <th scope="col" class="w-24 px-4 py-3 text-center text-xs font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (cliente of paged(); track cliente.id) {
              <tr class="border-b border-border transition-colors hover:bg-muted/30">
                <td class="px-4 py-3">
                  <input type="checkbox" [checked]="isSelected(cliente.id)" (change)="toggleOne(cliente.id)"
                    [attr.aria-label]="'Seleccionar ' + cliente.nombre"
                    class="rounded border-border text-primary focus-visible:ring-primary" />
                </td>
                <td class="px-4 py-3">
                  <button type="button" (click)="goDetail(cliente.id)" class="flex items-center gap-2.5 text-left">
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">{{ cliente.initials }}</span>
                    <span class="font-medium text-foreground transition-colors hover:text-primary">{{ cliente.nombre }}</span>
                  </button>
                </td>
                <td class="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{{ cliente.identificacion }}</td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span class="inline-flex items-center rounded-full bg-accent/50 px-2 py-0.5 text-xs text-accent-foreground">{{ cliente.territorio }}</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-muted-foreground">{{ cliente.vendedorAsignado }}</td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span [class]="categoriaClass(cliente.categoria)">{{ cliente.categoria }}</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span [class]="estadoClass(cliente.estado)">{{ cliente.estado }}</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-foreground">{{ cliente.totalPedidos }}</td>
                <td class="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-foreground">{{ formatCurrency(cliente.totalGastado) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-1">
                    <button type="button" (click)="goDetail(cliente.id)" [attr.aria-label]="'Ver ' + cliente.nombre"
                      class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <app-icon name="eye" [size]="16" />
                    </button>
                    <button type="button" (click)="goEdit(cliente.id)" [attr.aria-label]="'Editar ' + cliente.nombre"
                      class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <app-icon name="square-pen" [size]="16" />
                    </button>
                    <button type="button" (click)="openDelete(cliente)" [attr.aria-label]="'Eliminar ' + cliente.nombre"
                      class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
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

    @if (filtered().length > 0) {
      <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p class="text-xs text-muted-foreground">Mostrando {{ rangeStart() }}–{{ rangeEnd() }} de {{ filtered().length }}</p>
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground">Filas por pág.</span>
          <select [value]="perPage()" (change)="onPerPageChange($event)" aria-label="Filas por página"
            class="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
            @for (n of perPageOptions; track n) {
              <option [value]="n">{{ n }}</option>
            }
          </select>
        </div>
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

    @if (exportOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" (click)="closeExport()" aria-hidden="true"></div>
        <div role="dialog" aria-modal="true" aria-labelledby="export-title"
          class="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 id="export-title" class="text-base font-semibold text-foreground">Exportar clientes</h2>
            <button type="button" (click)="closeExport()" class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted" aria-label="Cerrar">
              <app-icon name="x" [size]="16" />
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <p class="text-sm text-muted-foreground">Selecciona el formato y el alcance de la exportación.</p>
            <div class="flex gap-3">
              <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/30">
                <input type="radio" name="export-format" checked class="text-primary focus-visible:ring-primary" /> CSV
              </label>
              <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/30">
                <input type="radio" name="export-format" class="text-primary focus-visible:ring-primary" /> Excel
              </label>
              <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/30">
                <input type="radio" name="export-format" class="text-primary focus-visible:ring-primary" /> PDF
              </label>
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm">
                <input type="radio" name="export-scope" checked class="text-primary focus-visible:ring-primary" /> Todos los registros ({{ filtered().length }})
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="radio" name="export-scope" [disabled]="selected().size === 0" class="text-primary focus-visible:ring-primary" /> Solo seleccionados ({{ selected().size }})
              </label>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" (click)="closeExport()"
                class="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancelar</button>
              <button type="button" (click)="closeExport()"
                class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <app-icon name="download" [size]="16" /> Exportar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    @if (importOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" (click)="closeImport()" aria-hidden="true"></div>
        <div role="dialog" aria-modal="true" aria-labelledby="import-title"
          class="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 id="import-title" class="text-base font-semibold text-foreground">Importar clientes</h2>
            <button type="button" (click)="closeImport()" class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted" aria-label="Cerrar">
              <app-icon name="x" [size]="16" />
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center">
              <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <app-icon name="file-spreadsheet" [size]="24" />
              </span>
              <p class="mt-3 text-sm font-medium text-foreground">Arrastra tu archivo CSV aquí</p>
              <p class="mt-1 text-xs text-muted-foreground">o</p>
              <button type="button"
                class="mt-1 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <app-icon name="upload" [size]="16" /> Seleccionar archivo
              </button>
            </div>
            <p class="text-xs text-muted-foreground">El archivo debe contener las columnas: nombre, identificacion, email, telefono, territorio, vendedor_asignado, categoria.</p>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" (click)="closeImport()"
                class="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancelar</button>
              <button type="button" disabled
                class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground opacity-50 transition-colors">
                <app-icon name="upload" [size]="16" /> Importar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-confirm-dialog [(open)]="deleteOpen" icon="circle-alert" title="Eliminar cliente"
      [description]="deleteDescription()" confirmLabel="Eliminar cliente" [loading]="deleting()"
      (confirm)="confirmDelete()" />
  `,
})
export class CustomerListComponent implements OnDestroy {
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly search = signal('');
  readonly showFilters = signal(false);
  readonly filters = signal<CustomerFilters>({});
  readonly sortKey = signal<SortKey>('nombre');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly page = signal(1);
  readonly perPage = signal(10);
  readonly selected = signal<Set<string>>(new Set());
  readonly deleteOpen = signal(false);
  readonly exportOpen = signal(false);
  readonly importOpen = signal(false);
  readonly deleteTarget = signal<Cliente | null>(null);
  readonly deleting = signal(false);
  readonly perPageOptions = [10, 25, 50];
  readonly skeletonRows = [0, 1, 2, 3, 4, 5];

  private timer?: number;

  constructor() {
    this.timer = window.setTimeout(() => this.loading.set(false), 700);
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
    }
  }

  readonly kpiTotal = computed(() => clientes.length);
  readonly kpiActivos = computed(() => clientes.filter((c) => c.estado === 'Activo').length);
  readonly kpiCategoriaA = computed(() => clientes.filter((c) => c.categoria === 'A').length);
  readonly kpiVentas = computed(() => clientes.reduce((sum, c) => sum + c.totalGastado, 0));

  readonly filterTerritories = computed(() => [...new Set(clientes.map((c) => c.territorio))].sort());

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    return (f.territorio ? 1 : 0) + (f.estado ? 1 : 0) + (f.categoria ? 1 : 0);
  });

  readonly filtered = computed(() => {
    let result = [...clientes];
    const q = this.search().trim().toLowerCase();
    if (q) {
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.identificacion.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.telefono.toLowerCase().includes(q),
      );
    }
    const f = this.filters();
    if (f.territorio) {
      result = result.filter((c) => c.territorio === f.territorio);
    }
    if (f.estado) {
      result = result.filter((c) => c.estado === f.estado);
    }
    if (f.categoria) {
      result = result.filter((c) => c.categoria === f.categoria);
    }
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const key = this.sortKey();
    result.sort((a, b) => {
      if (key === 'totalPedidos' || key === 'totalGastado') {
        return (a[key] - b[key]) * dir;
      }
      return a[key].localeCompare(b[key]) * dir;
    });
    return result;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.perPage())));

  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.perPage();
    return this.filtered().slice(start, start + this.perPage());
  });

  readonly rangeStart = computed(() => Math.min((this.page() - 1) * this.perPage() + 1, this.filtered().length));
  readonly rangeEnd = computed(() => Math.min(this.page() * this.perPage(), this.filtered().length));

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

  readonly allSelected = computed(() => {
    const list = this.paged();
    return list.length > 0 && list.every((c) => this.selected().has(c.id));
  });

  readonly deleteDescription = computed(() => {
    const target = this.deleteTarget();
    return target
      ? `Esta acción no se puede deshacer. Se eliminará permanentemente el cliente ${target.nombre} (${target.identificacion}) y todos sus datos asociados.`
      : '';
  });

  goNuevo(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  goDetail(id: string): void {
    this.router.navigate(['/clientes', id]);
  }

  goEdit(id: string): void {
    this.router.navigate(['/clientes', id, 'editar']);
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  onFilterTerritorio(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update((f) => ({ ...f, territorio: value || undefined }));
    this.page.set(1);
  }

  onFilterEstado(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update((f) => ({ ...f, estado: value || undefined }));
    this.page.set(1);
  }

  onFilterCategoria(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update((f) => ({ ...f, categoria: value || undefined }));
    this.page.set(1);
  }

  clearFiltersAndSearch(): void {
    this.filters.set({});
    this.search.set('');
    this.page.set(1);
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
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

  onPerPageChange(event: Event): void {
    this.perPage.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
  }

  isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  toggleOne(id: string): void {
    this.selected.update((s) => {
      const next = new Set(s);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  toggleAll(): void {
    if (this.allSelected()) {
      const ids = new Set(this.paged().map((c) => c.id));
      this.selected.update((s) => {
        const next = new Set(s);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      this.selected.update((s) => new Set([...s, ...this.paged().map((c) => c.id)]));
    }
  }

  openDelete(cliente: Cliente): void {
    this.deleteTarget.set(cliente);
    this.deleteOpen.set(true);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    this.deleting.set(true);
    window.setTimeout(() => {
      const index = clientes.findIndex((c) => c.id === target.id);
      if (index !== -1) {
        clientes.splice(index, 1);
      }
      this.selected.update((s) => {
        const next = new Set(s);
        next.delete(target.id);
        return next;
      });
      this.deleteOpen.set(false);
      this.deleting.set(false);
      this.deleteTarget.set(null);
      const total = this.totalPages();
      if (this.page() > total) {
        this.page.set(total || 1);
      }
    }, 900);
  }

  openExport(): void {
    this.exportOpen.set(true);
  }

  closeExport(): void {
    this.exportOpen.set(false);
  }

  openImport(): void {
    this.importOpen.set(true);
  }

  closeImport(): void {
    this.importOpen.set(false);
  }

  /** Mismos gestos que el botón del sistema; el estado activo lo distingue. */
  filtersBtnClass(): string {
    return (
      'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-all ' +
      'outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring/25 ' +
      (this.activeFilterCount() > 0
        ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
        : 'border-border bg-background text-foreground hover:bg-muted')
    );
  }

  /** Los tres filtros compartían una cadena idéntica repetida a mano. */
  get selectClass(): string {
    return (
      'mt-1 h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground ' +
      'transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25'
    );
  }

  pageBtnClass(num: number): string {
    return (
      'inline-flex size-8 items-center justify-center rounded-md text-xs font-medium transition-colors ' +
      'outline-none focus-visible:ring-2 focus-visible:ring-ring/25 ' +
      (this.page() === num
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground')
    );
  }

  estadoClass(estado: string): string {
    return estado === 'Activo'
      ? 'inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600'
      : 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground';
  }

  categoriaClass(categoria: string): string {
    return categoria === 'A'
      ? 'inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'
      : 'inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground';
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}
