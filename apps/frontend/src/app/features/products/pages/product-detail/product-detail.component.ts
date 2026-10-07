import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { formatCurrency, getCategoria, getProducto, getProductosRelacionados } from '../../../../core/data/productos-data';
import { promociones } from '../../../../core/data/promociones-data';
import type { Producto } from '../../../../core/data/productos-data';
import type { Promocion } from '../../../../core/data/promociones-data';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (producto; as p) {
      <div class="mb-6 flex items-center gap-4">
        <button type="button" (click)="goBack()" aria-label="Volver"
          class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <app-icon name="arrow-left" [size]="20" />
        </button>
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-xl bg-accent text-xl">{{ categoriaIcono(p.categoriaId) }}</span>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ p.nombre }}</h1>
                @if (p.promocion; as promo) {
                  @if (promo.activa) {
                    <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      <app-icon name="percent" [size]="12" /> -{{ promo.descuento }}%
                    </span>
                  }
                }
                <span [class]="categoriaBadgeClass(p.categoriaId)">{{ categoriaNombre(p.categoriaId) }}</span>
                <span [class]="estadoBadgeClass(p.estado)">{{ p.estado }}</span>
              </div>
              <p class="font-mono text-sm text-muted-foreground">{{ p.sku }}</p>
            </div>
          </div>
        </div>
        <button type="button" (click)="goEdit()"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <app-icon name="square-pen" [size]="16" /> Editar
        </button>
      </div>

      <div class="mb-6 flex flex-wrap gap-4">
        <div class="min-w-[200px] flex-1 rounded-xl border border-border bg-card p-4">
          <p class="text-[11px] font-medium text-muted-foreground">Precio venta</p>
          <p class="mt-1 font-mono text-xl font-semibold text-card-foreground">{{ formatCurrency(p.precio) }}</p>
        </div>
        <div class="min-w-[200px] flex-1 rounded-xl border border-border bg-card p-4">
          <p class="text-[11px] font-medium text-muted-foreground">Costo</p>
          <p class="mt-1 font-mono text-xl font-semibold text-card-foreground">{{ formatCurrency(p.costo) }}</p>
        </div>
        <div class="min-w-[200px] flex-1 rounded-xl border border-border bg-card p-4">
          <p class="text-[11px] font-medium text-muted-foreground">Margen</p>
          <p [class]="'mt-1 font-mono text-xl font-semibold ' + margenClase(p)">{{ p.margen }}%</p>
        </div>
        <div class="min-w-[200px] flex-1 rounded-xl border border-border bg-card p-4">
          <p class="text-[11px] font-medium text-muted-foreground">Stock actual</p>
          <p [class]="'mt-1 font-mono text-xl font-semibold ' + stockActualClase(p)">{{ p.stock }} {{ p.unidad }}</p>
        </div>
      </div>

      @if (stockCritical) {
        <div class="mb-6 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <app-icon name="triangle-alert" [size]="16" class="shrink-0" />
          <span>Stock crítico — Quedan {{ p.stock }} {{ p.unidad }}. Mínimo sugerido: {{ p.stockMinimo }}.</span>
        </div>
      }
      @if (stockAlert && !stockCritical) {
        <div class="mb-6 flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
          <app-icon name="triangle-alert" [size]="16" class="shrink-0" />
          <span>Stock bajo — Quedan {{ p.stock }} {{ p.unidad }}. Mínimo sugerido: {{ p.stockMinimo }}.</span>
        </div>
      }

      <div class="mb-6 flex gap-1 border-b border-border">
        @for (t of tabs; track t) {
          <button type="button" (click)="tab.set(t)" [class]="tabBtnClass(t)">{{ t }}</button>
        }
      </div>

      @if (tab() === 'General') {
        <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          <h3 class="mb-2 text-sm font-medium text-card-foreground">Descripción</h3>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ p.descripcion }}</p>
          <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p class="text-xs text-muted-foreground">Categoría</p>
              <p class="text-sm font-medium text-card-foreground">{{ categoriaNombre(p.categoriaId) }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Estado</p>
              <p class="text-sm font-medium text-card-foreground">{{ p.estado }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Unidad</p>
              <p class="text-sm font-medium capitalize text-card-foreground">{{ p.unidad }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Creado</p>
              <p class="text-sm font-medium text-card-foreground">{{ p.creado }}</p>
            </div>
          </div>
        </div>
      }

      @if (tab() === 'Stock') {
        <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p class="text-xs text-muted-foreground">Stock actual</p>
              <p [class]="'mt-1 font-mono text-2xl font-semibold ' + stockActualClase(p)">{{ p.stock }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Stock mínimo</p>
              <p class="mt-1 font-mono text-2xl font-semibold text-card-foreground">{{ p.stockMinimo }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Unidad</p>
              <p class="mt-1 text-2xl font-semibold capitalize text-card-foreground">{{ p.unidad }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Diferencia</p>
              <p [class]="'mt-1 font-mono text-2xl font-semibold ' + diferenciaClase(p)">{{ diferenciaLabel(p) }}</p>
            </div>
          </div>
          <div class="mt-6">
            <p class="mb-2 text-xs text-muted-foreground">Nivel de stock respecto al mínimo</p>
            <div class="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div [class]="'h-full rounded-full transition-all ' + nivelBarColor()" [style.width.%]="nivelBarWidth()"></div>
            </div>
          </div>
        </div>
      }

      @if (tab() === 'Promociones') {
        <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          @if (p.promocion; as promo) {
            <div>
              <div class="flex items-center gap-2">
                <span [class]="promoEstadoBadge(promo.activa)">{{ promo.activa ? 'Activa' : 'Inactiva' }}</span>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p class="text-xs text-muted-foreground">Descuento</p>
                  <p class="mt-1 text-2xl font-semibold text-card-foreground">-{{ promo.descuento }}%</p>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground">Inicio</p>
                  <p class="mt-1 text-sm font-medium text-card-foreground">{{ promo.vigenciaInicio }}</p>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground">Fin</p>
                  <p class="mt-1 text-sm font-medium text-card-foreground">{{ promo.vigenciaFin }}</p>
                </div>
              </div>
              <div class="mt-4 rounded-lg bg-primary/5 p-3">
                <p class="text-sm font-medium text-primary">
                  Precio con descuento: <span class="font-mono">{{ formatCurrency(p.precio * (1 - promo.descuento / 100)) }}</span>
                </p>
              </div>
            </div>
          } @else {
            <div class="flex flex-col items-center py-8 text-center">
              <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <app-icon name="tag" [size]="24" />
              </span>
              <p class="mt-3 text-sm font-medium text-card-foreground">Sin promociones activas</p>
              <p class="text-xs text-muted-foreground">Este producto no tiene ninguna promoción asociada.</p>
            </div>
          }

          @if (promosAplicables.length > 0) {
            <div class="mt-6 border-t border-border pt-6">
              <h3 class="mb-3 text-sm font-semibold text-card-foreground">Promociones aplicables</h3>
              <div class="grid gap-3 sm:grid-cols-2">
                @for (pr of promosAplicables; track pr.id) {
                  <div class="rounded-xl border border-border bg-card p-4">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-medium text-card-foreground">{{ pr.nombre }}</p>
                      <span [class]="promoEstadoBadgeGlobal(pr.estado)">{{ pr.estado }}</span>
                    </div>
                    <p class="mt-1 text-xs text-muted-foreground">{{ promoResumen(pr) }}</p>
                    <p class="mt-2 text-xs text-muted-foreground">{{ pr.fechaInicio }} → {{ pr.fechaFin }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      @if (tab() === 'Relacionados') {
        @if (relacionados.length === 0) {
          <div class="flex flex-col items-center rounded-xl border border-border bg-card px-4 py-8 text-center">
            <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="package-open" [size]="24" />
            </span>
            <p class="mt-3 text-sm font-medium text-card-foreground">Sin productos relacionados</p>
            <p class="text-xs text-muted-foreground">No hay productos relacionados configurados.</p>
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (r of relacionados; track r.id) {
              <div (click)="goDetail(r.id)"
                class="cursor-pointer rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 transition-all hover:ring-primary/20">
                <div class="flex items-center gap-3">
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm">{{ categoriaIcono(r.categoriaId) }}</span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-card-foreground">{{ r.nombre }}</p>
                    <p class="font-mono text-xs text-muted-foreground">{{ r.sku }}</p>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="font-mono text-sm font-semibold text-card-foreground">{{ formatCurrency(r.precio) }}</span>
                  <span [class]="'text-xs font-medium ' + (r.stock <= r.stockMinimo ? 'text-destructive' : 'text-success')">{{ r.stock }} uds</span>
                </div>
              </div>
            }
          </div>
        }
      }
    } @else {
      <div class="mb-6 flex items-center gap-4">
        <button type="button" (click)="goBack()" aria-label="Volver"
          class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <app-icon name="arrow-left" [size]="20" />
        </button>
      </div>
      <div class="flex flex-col items-center justify-center px-4 py-24 text-center">
        <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <app-icon name="search" [size]="24" />
        </span>
        <p class="mt-3 text-sm font-medium text-foreground">Producto no encontrado</p>
        <p class="mt-1 text-xs text-muted-foreground">El producto que buscas no existe o fue eliminado.</p>
        <button type="button" (click)="goBack()"
          class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Volver a productos
        </button>
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly formatCurrency = formatCurrency;

  readonly productId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly producto: Producto | undefined = getProducto(this.productId);

  readonly tabs = ['General', 'Stock', 'Promociones', 'Relacionados'];
  readonly tab = signal('General');

  readonly cat = this.producto ? getCategoria(this.producto.categoriaId) : undefined;
  readonly relacionados = this.producto ? getProductosRelacionados(this.producto.relacionados) : [];
  readonly promosAplicables: Promocion[] = this.producto
    ? promociones.filter((pr) => pr.productos.includes((this.producto as Producto).id))
    : [];

  readonly stockAlert =
    this.producto !== undefined && this.producto.stockMinimo > 0 && this.producto.stock <= this.producto.stockMinimo;
  readonly stockCritical =
    this.producto !== undefined &&
    this.producto.stockMinimo > 0 &&
    (this.producto.stock === 0 || this.producto.stock < this.producto.stockMinimo * 0.5);

  goBack(): void {
    this.router.navigate(['/productos']);
  }

  goEdit(): void {
    this.router.navigate(['/productos', this.productId, 'editar']);
  }

  goDetail(id: string): void {
    this.router.navigate(['/productos', id]);
  }

  tabBtnClass(t: string): string {
    return (
      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ' +
      (this.tab() === t
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground')
    );
  }

  categoriaNombre(id: string): string {
    return getCategoria(id)?.nombre ?? id;
  }

  categoriaIcono(id: string): string {
    return getCategoria(id)?.icono ?? '📦';
  }

  categoriaBadgeClass(id: string): string {
    return 'inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground';
  }

  estadoBadgeClass(estado: string): string {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ';
    switch (estado) {
      case 'Activo':
        return base + 'bg-success/10 text-success';
      case 'Inactivo':
        return base + 'bg-warning/10 text-warning';
      default:
        return base + 'bg-destructive/10 text-destructive';
    }
  }

  margenClase(p: Producto): string {
    if (p.margen >= 40) {
      return 'text-success';
    }
    if (p.margen >= 20) {
      return 'text-warning';
    }
    return 'text-destructive';
  }

  stockActualClase(p: Producto): string {
    if (this.stockCritical) {
      return 'text-destructive';
    }
    if (this.stockAlert) {
      return 'text-warning';
    }
    return 'text-success';
  }

  diferenciaClase(p: Producto): string {
    return p.stock - p.stockMinimo >= 0 ? 'text-success' : 'text-destructive';
  }

  diferenciaLabel(p: Producto): string {
    const dif = p.stock - p.stockMinimo;
    return dif >= 0 ? `+${dif}` : `${dif}`;
  }

  nivelBarColor(): string {
    if (this.stockCritical) {
      return 'bg-destructive';
    }
    if (this.stockAlert) {
      return 'bg-warning';
    }
    return 'bg-success';
  }

  nivelBarWidth(): number {
    if (!this.producto) {
      return 0;
    }
    return this.producto.stockMinimo > 0
      ? Math.min(100, (this.producto.stock / this.producto.stockMinimo) * 100)
      : 100;
  }

  promoEstadoBadge(activa: boolean): string {
    const base = 'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ';
    return activa ? base + 'bg-primary/10 text-primary' : base + 'bg-muted text-muted-foreground';
  }

  promoEstadoBadgeGlobal(estado: string): string {
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

  promoResumen(pr: Promocion): string {
    switch (pr.tipo) {
      case 'Porcentaje':
        return `${pr.tipo} · ${pr.valor}% de descuento`;
      case 'Monto fijo':
        return `${pr.tipo} · ${formatCurrency(pr.valor)}`;
      case '2x1':
        return `2x1 · ${pr.valor}%`;
      default:
        return `Combo · ${pr.valor}% de descuento`;
    }
  }
}
