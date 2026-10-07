import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { categorias, formatCurrency, getCategoria, productos } from '../../../../core/data/productos-data';
import type { Producto } from '../../../../core/data/productos-data';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Inventario</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ filtered().length }} productos en el catálogo</p>
      </div>
      <button type="button" (click)="goNuevo()"
        class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        <app-icon name="plus" [size]="16" /> Nuevo producto
      </button>
    </div>

    <div class="mb-6 flex gap-1 border-b border-border">
      <a routerLink="/productos" [class]="tabBtnClass('/productos')"
        [attr.aria-current]="isTabActive('/productos') ? 'page' : null">Productos</a>
      <a routerLink="/productos/inventario" [class]="tabBtnClass('/productos/inventario')"
        [attr.aria-current]="isTabActive('/productos/inventario') ? 'page' : null">Inventario</a>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="package" [size]="12" /> Productos</p>
        <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ stats().totalProductos }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="box" [size]="12" /> Unidades</p>
        <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ stats().totalUnidades }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="triangle-alert" [size]="12" /> Stock bajo</p>
        <p class="mt-0.5 text-lg font-semibold text-warning">{{ stats().stockBajo }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="triangle-alert" [size]="12" /> Stock crítico</p>
        <p class="mt-0.5 text-lg font-semibold text-destructive">{{ stats().stockCritico }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
        <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"><app-icon name="dollar-sign" [size]="12" /> Valor inventario</p>
        <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(stats().valorInventario) }}</p>
      </div>
    </div>

    @if (stats().stockCritico > 0) {
      <div class="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <app-icon name="triangle-alert" [size]="16" class="shrink-0" />
        <span>{{ stats().stockCritico }} producto(s) con stock crítico o sin stock. Revisa la tabla.</span>
      </div>
    }

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative max-w-md flex-1">
        <app-icon name="search" [size]="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="search" [value]="search()" (input)="onSearchInput($event)" placeholder="Buscar por nombre, SKU…"
          aria-label="Buscar en inventario"
          class="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25" />
        @if (search()) {
          <button type="button" (click)="clearSearch()"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Limpiar búsqueda">
            <app-icon name="x" [size]="16" />
          </button>
        }
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <select [value]="filtroCategoria()" (change)="onFilterCategoria($event)" aria-label="Filtrar por categoría"
          class="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
          <option value="">Todas las categorías</option>
          @for (c of categorias; track c.id) {
            <option [value]="c.id">{{ c.nombre }}</option>
          }
        </select>
        <select [value]="filtroStock()" (change)="onFilterStock($event)" aria-label="Filtrar por nivel de stock"
          class="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
          <option value="">Todos los niveles</option>
          <option value="ok">Normal</option>
          <option value="bajo">Bajo</option>
          <option value="critico">Crítico / Sin stock</option>
        </select>
        @if (activeFilterCount() > 0 || search()) {
          <button type="button" (click)="clearFiltersAndSearch()"
            class="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <app-icon name="x" [size]="12" /> Limpiar
          </button>
        }
      </div>
    </div>

    <div class="mt-4 overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
      @if (paged().length === 0) {
        <div class="flex flex-col items-center px-4 py-16 text-center">
          <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <app-icon name="search" [size]="24" />
          </span>
          <p class="mt-3 text-sm font-medium text-card-foreground">No se encontraron productos</p>
          <p class="mt-1 text-xs text-muted-foreground">Intenta con otros criterios de búsqueda</p>
        </div>
      } @else {
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/30">
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Producto</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Categoría</th>
              <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Stock</th>
              <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Mínimo</th>
              <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Nivel</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Valor inventario</th>
              <th scope="col" class="w-20 px-4 py-3 text-center text-xs font-medium text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody>
            @for (p of paged(); track p.id) {
              <tr class="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/30" (click)="goDetail(p.id)">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm">{{ categoriaIcono(p.categoriaId) }}</span>
                    <div>
                      <p class="font-medium text-card-foreground">{{ p.nombre }}</p>
                      <p class="font-mono text-xs text-muted-foreground">{{ p.sku }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-muted-foreground">{{ categoriaNombre(p.categoriaId) }}</td>
                <td class="px-4 py-3 text-center">
                  <p [class]="'font-mono tabular-nums font-medium ' + stockColor(p)">{{ p.stock }} {{ p.unidad }}</p>
                </td>
                <td class="px-4 py-3 text-center font-mono tabular-nums text-muted-foreground">{{ p.stockMinimo }}</td>
                <td class="px-4 py-3 text-center">
                  <span [class]="nivelBadgeClass(p)">{{ nivelLabel(p) }}</span>
                </td>
                <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(p.costo * p.stock) }}</td>
                <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                  <button type="button" (click)="goDetail(p.id)" aria-label="Ver producto"
                    class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
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
  `,
})
export class InventoryComponent {
  private readonly router = inject(Router);

  readonly formatCurrency = formatCurrency;
  readonly categorias = categorias;

  readonly perPage = 15;

  readonly search = signal('');
  readonly filtroCategoria = signal('');
  readonly filtroStock = signal('');
  readonly page = signal(1);

  readonly stats = computed(() => {
    const totalUnidades = productos.reduce((acc, p) => acc + p.stock, 0);
    const stockBajo = productos.filter((p) => this.esStockBajo(p)).length;
    const stockCritico = productos.filter((p) => this.esStockCritico(p)).length;
    const valorInventario = productos.reduce((acc, p) => acc + p.costo * p.stock, 0);
    return { totalProductos: productos.length, totalUnidades, stockBajo, stockCritico, valorInventario };
  });

  readonly activeFilterCount = computed(() => (this.filtroCategoria() ? 1 : 0) + (this.filtroStock() ? 1 : 0));

  readonly filtered = computed(() => {
    let result = [...productos];
    const q = this.search().trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) => p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }
    if (this.filtroCategoria()) {
      result = result.filter((p) => p.categoriaId === this.filtroCategoria());
    }
    if (this.filtroStock() === 'bajo') {
      result = result.filter((p) => this.esStockBajo(p));
    }
    if (this.filtroStock() === 'critico') {
      result = result.filter((p) => this.esStockCritico(p));
    }
    if (this.filtroStock() === 'ok') {
      result = result.filter((p) => p.stockMinimo === 0 || p.stock > p.stockMinimo);
    }
    result.sort((a, b) => {
      const sa = this.stockRank(a);
      const sb = this.stockRank(b);
      if (sa !== sb) {
        return sa - sb;
      }
      return a.nombre.localeCompare(b.nombre);
    });
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

  esStockBajo(p: Producto): boolean {
    return p.stockMinimo > 0 && p.stock > 0 && p.stock <= p.stockMinimo && p.stock >= p.stockMinimo * 0.5;
  }

  esStockCritico(p: Producto): boolean {
    return p.stock === 0 || (p.stockMinimo > 0 && p.stock < p.stockMinimo * 0.5);
  }

  stockRank(p: Producto): number {
    if (p.stock === 0) {
      return 0;
    }
    if (p.stockMinimo > 0 && p.stock < p.stockMinimo * 0.5) {
      return 1;
    }
    if (p.stock <= p.stockMinimo) {
      return 2;
    }
    return 3;
  }

  stockColor(p: Producto): string {
    if (p.stock === 0) {
      return 'text-destructive';
    }
    if (p.stockMinimo > 0 && p.stock < p.stockMinimo * 0.5) {
      return 'text-destructive';
    }
    if (p.stock <= p.stockMinimo) {
      return 'text-warning';
    }
    return 'text-success';
  }

  nivelLabel(p: Producto): string {
    if (p.stock === 0) {
      return 'Sin stock';
    }
    if (p.stockMinimo > 0 && p.stock < p.stockMinimo * 0.5) {
      return 'Crítico';
    }
    if (p.stock <= p.stockMinimo) {
      return 'Bajo';
    }
    return 'Normal';
  }

  nivelBadgeClass(p: Producto): string {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ';
    if (p.stock === 0) {
      return base + 'bg-destructive/10 text-destructive';
    }
    if (p.stockMinimo > 0 && p.stock < p.stockMinimo * 0.5) {
      return base + 'bg-destructive/10 text-destructive';
    }
    if (p.stock <= p.stockMinimo) {
      return base + 'bg-warning/10 text-warning';
    }
    return base + 'bg-success/10 text-success';
  }

  categoriaNombre(id: string): string {
    return getCategoria(id)?.nombre ?? id;
  }

  categoriaIcono(id: string): string {
    return getCategoria(id)?.icono ?? '📦';
  }

  isTabActive(href: string): boolean {
    if (href === '/productos/inventario') {
      return this.router.url.startsWith('/productos/inventario');
    }
    return this.router.url.startsWith('/productos') && !this.router.url.startsWith('/productos/inventario');
  }

  tabBtnClass(href: string): string {
    return (
      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ' +
      (this.isTabActive(href)
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground')
    );
  }

  pageBtnClass(num: number): string {
    return (
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ' +
      (this.page() === num ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')
    );
  }

  goNuevo(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  goDetail(id: string): void {
    this.router.navigate(['/productos', id]);
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
  }

  onFilterCategoria(event: Event): void {
    this.filtroCategoria.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  onFilterStock(event: Event): void {
    this.filtroStock.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
  }

  clearFiltersAndSearch(): void {
    this.filtroCategoria.set('');
    this.filtroStock.set('');
    this.search.set('');
    this.page.set(1);
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
}
