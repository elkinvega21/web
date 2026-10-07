import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { formatCurrency, territorios } from '../../../../core/data/territorios-data';
import type { Territorio } from '../../../../core/data/territorios-data';

type Periodo = 'mes' | 'anio';

type TendenciaMonth = {
  mes: string;
  total: number;
  segmentos: { nombre: string; color: string; pct: number }[];
};

@Component({
  selector: 'app-territory-list',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div>
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Territorios</h1>
          <p class="text-sm text-muted-foreground">Dashboard territorial de ventas</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" (click)="setPeriodo('mes')" [class]="periodoButtonClass('mes')">Este mes</button>
          <button type="button" (click)="setPeriodo('anio')" [class]="periodoButtonClass('anio')">Acumulado año</button>
        </div>
      </div>

      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="dollar-sign" [size]="12" /> Ventas {{ periodo() === 'mes' ? 'del mes' : 'totales' }}
          </p>
          <p class="mt-1 font-mono text-xl font-semibold text-card-foreground">{{ formatCurrency(globalKPI().totalVentas) }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="users" [size]="12" /> Clientes
          </p>
          <p class="mt-1 text-xl font-semibold text-card-foreground">{{ globalKPI().totalClientes }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="award" [size]="12" /> Vendedores
          </p>
          <p class="mt-1 text-xl font-semibold text-card-foreground">{{ globalKPI().totalVendedores }}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="trending-up" [size]="12" /> Crecimiento
          </p>
          <p [class]="crecimientoClass(globalKPI().crecimiento)">
            {{ crecimientoPrefix(globalKPI().crecimiento) }}{{ globalKPI().crecimiento }}%
            @if (globalKPI().crecimiento >= 0) {
              <app-icon name="trending-up" [size]="16" class="ml-1 inline" />
            } @else {
              <app-icon name="trending-down" [size]="16" class="ml-1 inline" />
            }
          </p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <p class="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <app-icon name="target" [size]="12" /> Top territorio
          </p>
          <p class="mt-1 text-xl font-semibold text-card-foreground">{{ topTerritorioNombre() }}</p>
        </div>
      </div>

      <div class="mb-6 grid gap-4 lg:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 lg:col-span-2">
          <div class="mb-1 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-card-foreground">Ventas por territorio</h3>
            <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span class="flex items-center gap-1"><span class="size-2.5 rounded-full bg-primary"></span>Ventas</span>
              <span class="flex items-center gap-1"><span class="size-2.5 rounded-full bg-primary/30"></span>Meta</span>
            </div>
          </div>
          <p class="mb-4 text-xs text-muted-foreground">Comparativa de ventas y meta por territorio</p>
          <div class="space-y-3">
            @for (row of chartData(); track row.name) {
              <div>
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="font-medium text-card-foreground">{{ row.name }}</span>
                  <span class="font-mono text-muted-foreground">{{ formatCurrency(row.ventas) }}</span>
                </div>
                <div class="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div class="absolute inset-y-0 left-0 rounded-full" [style.width.%]="barScale(row.meta)" [style.background-color]="row.color" [style.opacity]="0.3"></div>
                  <div class="absolute inset-y-0 left-0 rounded-full" [style.width.%]="barScale(row.ventas)" [style.background-color]="row.color"></div>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h3 class="mb-1 text-sm font-semibold text-card-foreground">Participación</h3>
          <p class="mb-4 text-xs text-muted-foreground">Distribución de ventas por territorio</p>
          <div class="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            @for (p of pieData; track p.name) {
              <div [style.width.%]="p.value" [style.background-color]="p.color"></div>
            }
          </div>
          <div class="mt-3 space-y-2">
            @for (p of pieData; track p.name) {
              <div class="flex items-center justify-between text-xs">
                <span class="flex items-center gap-2 text-muted-foreground">
                  <span class="size-3 rounded-full" [style.background-color]="p.color"></span>{{ p.name }}
                </span>
                <span class="font-medium text-card-foreground">{{ p.value }}%</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <app-icon name="globe" [size]="16" class="text-primary" /> Mapa territorial
        </h3>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          @for (t of territorios; track t.id) {
            <div (click)="openDetail(t)"
              class="cursor-pointer rounded-xl border bg-card p-4 ring-1 ring-foreground/5 transition-all hover:ring-2 hover:ring-primary/30"
              [style.border-top]="'3px solid ' + t.color">
              <div class="mb-2 flex items-center justify-between">
                <p class="text-sm font-semibold text-card-foreground">{{ t.nombre }}</p>
                <span class="text-[11px] text-muted-foreground">{{ t.region }}</span>
              </div>
              <p class="font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(ventasDe(t)) }}</p>
              <div class="mt-2 flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Meta: {{ metaPctTerritorio(t) }}%</span>
                <span [class]="metaEstadoClass(metaPctTerritorio(t))">{{ metaEstadoLabel(metaPctTerritorio(t)) }}</span>
              </div>
              <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div class="h-full rounded-full transition-all" [style.width.%]="barWidth(metaPctTerritorio(t))" [style.background-color]="t.color"></div>
              </div>
              <div class="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{{ t.vendedoresActivos }} vendedores</span>
                <span>{{ t.clientesActivos }} clientes</span>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="mb-6 grid gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h3 class="mb-1 text-sm font-semibold text-card-foreground">Tendencia mensual</h3>
          <p class="mb-4 text-xs text-muted-foreground">Evolución de ventas por territorio</p>
          <div class="h-40">
            <div class="flex h-40 items-end gap-2">
              @for (m of tendenciaData; track m.mes) {
                <div class="flex flex-1 flex-col items-center gap-1">
                  <div class="flex w-full flex-col justify-end overflow-hidden rounded-t-sm" [style.height.px]="tendenciaColHeightPx(m)">
                    @for (seg of m.segmentos; track seg.nombre) {
                      <div class="w-full" [style.height.%]="seg.pct" [style.background-color]="seg.color"></div>
                    }
                  </div>
                  <span class="text-[11px] text-muted-foreground">{{ m.mes }}</span>
                </div>
              }
            </div>
            <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
              @for (t of territorios; track t.id) {
                <span class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span class="size-2.5 rounded-full" [style.background-color]="t.color"></span>{{ t.nombre }}
                </span>
              }
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h3 class="mb-1 text-sm font-semibold text-card-foreground">Cumplimiento de metas</h3>
          <p class="mb-4 text-xs text-muted-foreground">Porcentaje de cumplimiento por territorio</p>
          <div class="h-64 space-y-4 overflow-y-auto pr-1">
            @for (row of chartData(); track row.name) {
              <div>
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="font-medium text-card-foreground">{{ row.name }}</span>
                  <span [class]="cumplimientoPctClass(row.cumplimiento)">{{ row.cumplimiento }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div [class]="cumplimientoBarClass(row.cumplimiento)" [style.width.%]="metaWidth(row.cumplimiento)"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/30">
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Territorio</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ventas {{ periodo() === 'mes' ? 'mes' : 'promedio' }}</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Participación</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Crecimiento</th>
              <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Meta</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Clientes</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Vendedores</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Top vendedor</th>
              <th scope="col" class="w-16 px-4 py-3 text-center text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            @for (t of territoriosSorted(); track t.id) {
              <tr class="cursor-pointer border-b border-border transition-colors hover:bg-muted/30" (click)="openDetail(t)">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="size-3 shrink-0 rounded-full" [style.background-color]="t.color"></span>
                    <span class="font-medium text-card-foreground">{{ t.nombre }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(ventasDe(t)) }}</td>
                <td class="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">{{ t.participacion }}%</td>
                <td class="px-4 py-3 text-right">
                  <span [class]="crecimientoTableClass(t.crecimiento)">{{ crecimientoPrefix(t.crecimiento) }}{{ t.crecimiento }}%</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span [class]="metaEstadoClass(t.metaCumplimiento)">{{ t.metaCumplimiento }}%</span>
                </td>
                <td class="px-4 py-3 text-right tabular-nums text-card-foreground">{{ t.clientes }}</td>
                <td class="px-4 py-3 text-right tabular-nums text-card-foreground">{{ t.vendedores }}</td>
                <td class="px-4 py-3 text-muted-foreground">{{ t.topVendedor }}</td>
                <td class="px-4 py-3 text-center">
                  <button type="button" (click)="openDetail(t); $event.stopPropagation()"
                    class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Ver territorio">
                    <app-icon name="eye" [size]="16" />
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class TerritoryListComponent {
  private readonly router = inject(Router);

  readonly territorios = territorios;
  readonly territoriosSorted = computed(() => [...territorios].sort((a, b) => this.ventasDe(b) - this.ventasDe(a)));
  readonly periodo = signal<Periodo>('mes');

  readonly globalKPI = computed(() => {
    const mes = this.periodo() === 'mes';
    const totalVentas = territorios.reduce((s, t) => s + (mes ? t.ventasMes : t.ventasTotales), 0);
    const totalClientes = territorios.reduce((s, t) => s + t.clientes, 0);
    const totalVendedores = territorios.reduce((s, t) => s + t.vendedores, 0);
    const totalAnterior = territorios.reduce(
      (s, t) => s + (mes ? t.ventasPeriodoAnterior / 6 : t.ventasPeriodoAnterior),
      0,
    );
    const crecimiento = totalAnterior > 0 ? Math.round(((totalVentas - totalAnterior) / totalAnterior) * 100) : 0;
    const top = [...territorios].sort(
      (a, b) => (mes ? b.ventasMes : b.ventasTotales) - (mes ? a.ventasMes : a.ventasTotales),
    )[0];
    return { totalVentas, totalClientes, totalVendedores, crecimiento, top };
  });

  readonly chartData = computed(() =>
    territorios
      .map((t) => ({
        name: t.nombre,
        ventas: this.periodo() === 'mes' ? t.ventasMes : Math.round(t.ventasTotales / 6),
        meta:
          this.periodo() === 'mes'
            ? Math.round(t.ventasMes * 0.92)
            : Math.round((t.ventasTotales / 6) * 0.92),
        cumplimiento: t.metaCumplimiento,
        color: t.color,
      }))
      .sort((a, b) => b.ventas - a.ventas),
  );

  readonly chartMax = computed(() => this.chartData().reduce((s, r) => Math.max(s, r.ventas), 0));

  readonly pieData = territorios.map((t) => ({ name: t.nombre, value: t.participacion, color: t.color }));

  readonly tendenciaData: TendenciaMonth[] = territorios[0].ventasMensuales.map((m, i) => {
    const total = territorios.reduce((s, t) => s + t.ventasMensuales[i].ventas, 0);
    return {
      mes: m.mes,
      total,
      segmentos: territorios.map((t) => ({
        nombre: t.nombre,
        color: t.color,
        pct: total > 0 ? Math.round((t.ventasMensuales[i].ventas / total) * 100) : 0,
      })),
    };
  });
  readonly tendenciaMax = this.tendenciaData.reduce((s, m) => Math.max(s, m.total), 0);

  setPeriodo(p: Periodo): void {
    this.periodo.set(p);
  }

  periodoButtonClass(p: Periodo): string {
    return (
      'inline-flex h-8 items-center rounded-lg border px-3 text-xs font-medium transition-colors ' +
      (this.periodo() === p
        ? 'border-primary/30 bg-primary/5 text-primary'
        : 'border-input bg-background text-muted-foreground hover:text-foreground')
    );
  }

  topTerritorioNombre(): string {
    return this.globalKPI().top?.nombre ?? '—';
  }

  crecimientoClass(c: number): string {
    return 'mt-1 font-mono text-xl font-semibold ' + (c >= 0 ? 'text-success' : 'text-destructive');
  }

  crecimientoTableClass(c: number): string {
    return 'font-mono tabular-nums ' + (c >= 0 ? 'text-success' : 'text-destructive');
  }

  crecimientoPrefix(c: number): string {
    return c >= 0 ? '+' : '';
  }

  ventasDe(t: Territorio): number {
    return this.periodo() === 'mes' ? t.ventasMes : Math.round(t.ventasTotales / 6);
  }

  metaDe(t: Territorio): number {
    return this.periodo() === 'mes' ? Math.round(t.ventasMes * 0.92) : Math.round((t.ventasTotales / 6) * 0.92);
  }

  metaPctTerritorio(t: Territorio): number {
    const meta = this.metaDe(t);
    return meta > 0 ? Math.round((this.ventasDe(t) / meta) * 100) : 0;
  }

  barWidth(pct: number): number {
    return Math.min(100, pct);
  }

  metaEstadoLabel(pct: number): string {
    return pct >= 100 ? '✓ Cumplida' : pct >= 85 ? '⚠ Parcial' : '✗ Bajo';
  }

  metaEstadoClass(pct: number): string {
    return 'font-medium ' + (pct >= 100 ? 'text-success' : pct >= 85 ? 'text-warning' : 'text-destructive');
  }

  barScale(value: number): number {
    const max = this.chartMax();
    return max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  }

  cumplimientoBarClass(pct: number): string {
    return (
      'h-full rounded-full transition-all ' + (pct >= 100 ? 'bg-success' : pct >= 85 ? 'bg-warning' : 'bg-destructive')
    );
  }

  cumplimientoPctClass(pct: number): string {
    return 'font-medium ' + (pct >= 100 ? 'text-success' : pct >= 85 ? 'text-warning' : 'text-destructive');
  }

  metaWidth(pct: number): number {
    return Math.min(100, (pct / 120) * 100);
  }

  tendenciaColHeightPx(m: TendenciaMonth): number {
    return this.tendenciaMax > 0 ? Math.max(8, Math.round((m.total / this.tendenciaMax) * 140)) : 0;
  }

  openDetail(t: Territorio): void {
    this.router.navigate(['/territorios', t.id]);
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}
