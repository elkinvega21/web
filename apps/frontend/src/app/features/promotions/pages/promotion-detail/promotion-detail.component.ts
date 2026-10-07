import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { getPromocion, formatCurrency } from '../../../../core/data/promociones-data';
import type { Promocion } from '../../../../core/data/promociones-data';

@Component({
  selector: 'app-promotion-detail',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (promotion; as p) {
      <div class="mb-6 flex items-center gap-4">
        <button type="button" (click)="goBack()" aria-label="Volver"
          class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <app-icon name="arrow-left" [size]="20" />
        </button>
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ p.nombre }}</h1>
            <span [class]="estadoBadgeClass(p.estado)">{{ p.estado }}</span>
            @if (estaPorVencer) {
              <span
                class="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-[11px] font-medium text-warning">
                <app-icon name="triangle-alert" [size]="12" /> Vence en {{ diff }} {{ diasLabel }}
              </span>
            }
          </div>
          <p class="mt-1 text-sm text-muted-foreground">{{ p.id }} · Creado {{ p.creado }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" (click)="goEdit()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <app-icon name="square-pen" [size]="16" /> Editar
          </button>
          <button type="button" (click)="goDuplicar()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <app-icon name="copy" [size]="16" /> Duplicar
          </button>
        </div>
      </div>

      @if (estaPorVencer) {
        <div class="mb-6 flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
          <app-icon name="clock" [size]="16" class="shrink-0" />
          <span>Esta promoción vence el <strong>{{ p.fechaFin }}</strong> ({{ diff }} {{ diasLabel }}). Considera extenderla o crear una nueva.</span>
        </div>
      }

      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="flex items-center gap-1 text-[11px] text-muted-foreground"><app-icon name="percent" [size]="12" /> Tipo</p>
          <span class="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            [style.background-color]="tipoBg(p.tipo)" [style.color]="tipoFg(p.tipo)">{{ p.tipo }}</span>
        </div>
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="flex items-center gap-1 text-[11px] text-muted-foreground"><app-icon name="tag" [size]="12" /> Descuento</p>
          <p class="mt-1 font-mono text-lg font-semibold text-card-foreground">{{ descuentoLabel(p) }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="flex items-center gap-1 text-[11px] text-muted-foreground"><app-icon name="calendar" [size]="12" /> Vigencia</p>
          <p class="mt-1 text-sm font-medium text-card-foreground">{{ p.fechaInicio }} → {{ p.fechaFin }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="flex items-center gap-1 text-[11px] text-muted-foreground"><app-icon name="shopping-bag" [size]="12" /> Productos</p>
          <p class="mt-1 text-sm font-medium text-card-foreground">{{ p.productoNombres.length > 0 ? p.productoNombres.length + ' productos' : 'Todos los productos' }}</p>
        </div>
      </div>

      <div class="mb-6 grid gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h3 class="mb-3 text-sm font-semibold text-card-foreground">Descripción</h3>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ p.descripcion || 'Sin descripción' }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h3 class="mb-3 text-sm font-semibold text-card-foreground">Condiciones</h3>
          @if (p.condiciones) {
            <p class="text-sm leading-relaxed text-muted-foreground">{{ p.condiciones }}</p>
          } @else {
            <p class="text-sm text-muted-foreground">Sin condiciones especiales</p>
          }
          @if (p.aplicaMinimo > 0) {
            <div class="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">
              <span class="text-muted-foreground">Compra mínima: </span>
              <span class="font-mono font-medium text-card-foreground">{{ formatCurrency(p.aplicaMinimo) }}</span>
            </div>
          }
        </div>
      </div>

      @if (p.productoNombres.length > 0) {
        <div class="mb-6 rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <app-icon name="shopping-bag" [size]="16" class="text-primary" /> Productos asociados
          </h3>
          <div class="flex flex-wrap gap-2">
            @for (nombre of p.productoNombres; track nombre) {
              <span class="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">{{ nombre }}</span>
            }
          </div>
        </div>
      }

      <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <app-icon name="clock" [size]="16" class="text-primary" /> Historial
        </h3>
        @if (p.historial.length === 0) {
          <p class="text-sm text-muted-foreground">Sin historial registrado</p>
        } @else {
          <div class="space-y-2">
            @for (h of p.historial; track h.id) {
              <div class="flex items-start gap-3 py-1.5">
                <span class="mt-0.5 size-2 shrink-0 rounded-full bg-primary/40"></span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-card-foreground">
                    <span class="font-medium">{{ h.accion }}</span>
                    @if (h.detalle) {
                      <span class="text-muted-foreground"> — {{ h.detalle }}</span>
                    }
                  </p>
                  <p class="text-xs text-muted-foreground">{{ h.fecha }} · {{ h.usuario }}</p>
                </div>
              </div>
            }
          </div>
        }
      </div>
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
        <p class="mt-3 text-sm font-medium text-foreground">Promoción no encontrada</p>
        <p class="mt-1 text-xs text-muted-foreground">La promoción que buscas no existe o fue eliminada.</p>
        <button type="button" (click)="goBack()"
          class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Volver a promociones
        </button>
      </div>
    }
  `,
})
export class PromotionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly formatCurrency = formatCurrency;

  readonly promotionId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly promotion: Promocion | undefined = getPromocion(this.promotionId);

  readonly diff = this.promotion ? this.diasHasta(this.promotion.fechaFin) : null;
  readonly estaPorVencer =
    !!this.promotion &&
    this.promotion.estado === 'Activa' &&
    this.diff !== null &&
    this.diff >= 0 &&
    this.diff <= 7;
  readonly diasLabel = this.diff !== null && this.diff === 1 ? 'día' : 'días';

  goBack(): void {
    this.router.navigate(['/promociones']);
  }

  goEdit(): void {
    if (this.promotion) {
      this.router.navigate(['/promociones', this.promotion.id, 'editar']);
    }
  }

  goDuplicar(): void {
    if (!this.promotion) {
      return;
    }
    this.router.navigate(['/promociones/nuevo'], {
      queryParams: { duplicar: this.promotion.id, nombre: `${this.promotion.nombre} (copia)` },
    });
  }

  private diasHasta(fechaFin: string): number {
    const [dd, mm, yyyy] = fechaFin.split('/').map(Number);
    const fin = new Date(yyyy, mm - 1, dd);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
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
}
