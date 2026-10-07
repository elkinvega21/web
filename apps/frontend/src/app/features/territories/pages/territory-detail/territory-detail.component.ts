import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { formatCurrency, getTerritorio, territorios } from '../../../../core/data/territorios-data';
import type { Territorio } from '../../../../core/data/territorios-data';

type Tab = 'general' | 'vendedores' | 'clientes';

const CAT_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#06b6d4'];

@Component({
  selector: 'app-territory-detail',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (t; as territorio) {
      <div>
        <div class="mb-6 flex items-center gap-4">
          <button type="button" (click)="goBack()"
            class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Volver">
            <app-icon name="arrow-left" [size]="20" />
          </button>
          <span class="size-4 shrink-0 rounded-full" [style.background-color]="territorio.color"></span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ territorio.nombre }}</h1>
              <span class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{{ territorio.region }}</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ territorio.vendedoresActivos }} vendedores · {{ territorio.clientesActivos }} clientes activos</p>
          </div>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">Ventas mes</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(territorio.ventasMes) }}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">vs periodo ant.</p>
            <p [class]="crecimientoClass(territorio.crecimiento)">
              {{ crecimientoPrefix(territorio.crecimiento) }}{{ territorio.crecimiento }}%
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">Participación</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ territorio.participacion }}%</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">Meta</p>
            <p [class]="cumplimientoKpiClass(territorio.metaCumplimiento)">{{ territorio.metaCumplimiento }}%</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">Clientes</p>
            <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ territorio.clientesActivos }}/{{ territorio.clientes }}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">Ticket prom.</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(territorio.ticketPromedio) }}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="text-[11px] text-muted-foreground">Top producto</p>
            <p class="mt-0.5 truncate text-sm font-semibold text-card-foreground">{{ territorio.topProducto }}</p>
          </div>
        </div>

        <div class="mb-6 grid gap-4 lg:grid-cols-2">
          <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <h3 class="mb-1 text-sm font-semibold text-card-foreground">Ventas mensuales</h3>
            <p class="mb-4 text-xs text-muted-foreground">Evolución últimos 6 meses</p>
            <div class="flex h-40 items-end gap-2">
              @for (vm of territorio.ventasMensuales; track vm.mes) {
                <div class="flex flex-1 flex-col items-center gap-1">
                  <div class="relative flex w-full flex-col items-center" [style.height.px]="140">
                    <div class="absolute bottom-0 w-5/6 rounded-t-sm bg-muted" [style.height.px]="barHeightPx(vm.meta)" title="Meta: {{ formatCurrency(vm.meta) }}"></div>
                    <div class="absolute bottom-0 w-3/4 rounded-t-sm" [style.height.px]="barHeightPx(vm.ventas)" [style.background-color]="territorio.color" title="Ventas: {{ formatCurrency(vm.ventas) }}"></div>
                  </div>
                  <span class="text-[11px] text-muted-foreground">{{ vm.mes }}</span>
                </div>
              }
            </div>
          </div>
          <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <h3 class="mb-1 text-sm font-semibold text-card-foreground">Distribución por categoría</h3>
            <p class="mb-4 text-xs text-muted-foreground">Preferencias de producto en el territorio</p>
            <div class="space-y-3">
              @for (c of territorio.distribucionCategorias; track c.categoria; let i = $index) {
                <div>
                  <div class="mb-1 flex items-center justify-between text-xs">
                    <span class="font-medium text-card-foreground">{{ c.categoria }}</span>
                    <span class="font-mono text-muted-foreground">{{ formatCurrency(c.ventas) }} · {{ c.porcentaje }}%</span>
                  </div>
                  <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div class="h-full rounded-full transition-all" [style.width.%]="barWidth(c.porcentaje)" [style.background-color]="catColor(i)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="mb-6 flex gap-1 border-b border-border">
          <button type="button" (click)="setTab('general')" [class]="tabClass('general')">General</button>
          <button type="button" (click)="setTab('vendedores')" [class]="tabClass('vendedores')">Vendedores</button>
          <button type="button" (click)="setTab('clientes')" [class]="tabClass('clientes')">Clientes</button>
        </div>

        @switch (activeTab()) {
          @case ('general') {
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                  <app-icon name="bar-chart-3" [size]="16" class="text-primary" /> Comparativa vs otros territorios
                </h3>
                <div class="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span class="flex items-center gap-1.5">
                    <span class="size-2.5 rounded-full" [style.background-color]="territorio.color"></span>{{ territorio.nombre }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <span class="size-2.5 rounded-full bg-muted"></span>Otro territorio
                  </span>
                </div>
                <div class="space-y-3">
                  @for (c of comparativa; track c.name) {
                    <div>
                      <div class="mb-1 flex items-center justify-between text-xs">
                        <span class="text-muted-foreground">{{ c.name }}</span>
                        <span class="font-medium text-card-foreground">{{ c.este }}% vs {{ c.otro }}%</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div class="h-full rounded-full" [style.width.%]="comparativaBarWidth(c.este)" [style.background-color]="territorio.color"></div>
                        </div>
                        <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div class="h-full rounded-full bg-muted" [style.width.%]="comparativaBarWidth(c.otro)"></div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                  <app-icon name="activity" [size]="16" class="text-primary" /> Indicadores clave
                </h3>
                <div class="space-y-3">
                  @for (item of indicadores; track item.label) {
                    <div class="flex items-center justify-between py-1.5">
                      <span class="text-xs text-muted-foreground">{{ item.label }}</span>
                      <span [class]="'font-mono text-sm font-semibold ' + item.cls">{{ item.value }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
          @case ('vendedores') {
            <div class="rounded-xl border border-border bg-card ring-1 ring-foreground/5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border bg-muted/30">
                    <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Vendedor</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ventas</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Clientes</th>
                  </tr>
                </thead>
                <tbody>
                  @for (v of territorio.topVendedores; track v.nombre) {
                    <tr class="border-b border-border">
                      <td class="px-4 py-3 font-medium text-card-foreground">{{ v.nombre }}</td>
                      <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(v.ventas) }}</td>
                      <td class="px-4 py-3 text-right tabular-nums text-card-foreground">{{ v.clientes }}</td>
                    </tr>
                  }
                  @if (territorio.topVendedores.length === 0) {
                    <tr>
                      <td colspan="3" class="px-4 py-8 text-center text-sm text-muted-foreground">Sin vendedores asignados</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @case ('clientes') {
            <div class="rounded-xl border border-border bg-card ring-1 ring-foreground/5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border bg-muted/30">
                    <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total comprado</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Última compra</th>
                  </tr>
                </thead>
                <tbody>
                  @for (c of territorio.topClientes; track c.nombre) {
                    <tr class="border-b border-border">
                      <td class="px-4 py-3 font-medium text-card-foreground">{{ c.nombre }}</td>
                      <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(c.ventas) }}</td>
                      <td class="px-4 py-3 text-center text-muted-foreground">{{ c.ultimaCompra }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-16 text-center">
        <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <app-icon name="circle-alert" [size]="24" />
        </span>
        <p class="mt-3 text-sm font-medium text-foreground">Territorio no encontrado</p>
        <p class="mt-1 text-xs text-muted-foreground">El territorio que buscas no existe.</p>
        <button type="button" (click)="goBack()"
          class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Volver a territorios</button>
      </div>
    }
  `,
})
export class TerritoryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly territorioId = this.route.snapshot.paramMap.get('id');
  readonly t: Territorio | undefined = this.territorioId ? getTerritorio(this.territorioId) : undefined;

  readonly allOthers: Territorio[] = (() => {
    const t = this.t;
    return t ? territorios.filter((x) => x.id !== t.id) : [];
  })();

  readonly comparativa: { name: string; este: number; otro: number }[] = this.t
    ? this.allOthers
        .map((x) => ({
          name: x.nombre,
          este: this.t && this.t.ventasTotales > 0 ? Math.round((this.t.ventasMes / this.t.ventasTotales) * 100) : 0,
          otro: x.ventasTotales > 0 ? Math.round((x.ventasMes / x.ventasTotales) * 100) : 0,
        }))
        .slice(0, 4)
    : [];

  readonly comparativaMax = Math.max(0, ...this.comparativa.map((c) => Math.max(c.este, c.otro)));

  readonly ventasMax: number = this.t ? Math.max(...this.t.ventasMensuales.map((m) => m.ventas)) : 0;

  readonly indicadores: { label: string; value: string; cls: string }[] = this.t
    ? [
        {
          label: 'Crecimiento vs periodo anterior',
          value: `${this.t.crecimiento}%`,
          cls: this.t.crecimiento >= 0 ? 'text-success' : 'text-destructive',
        },
        {
          label: 'Clientes nuevos este mes',
          value: `${this.t.clientesNuevos}`,
          cls: this.t.clientesNuevos > 0 ? 'text-success' : 'text-muted-foreground',
        },
        { label: 'Ticket promedio', value: formatCurrency(this.t.ticketPromedio), cls: 'text-card-foreground' },
        { label: 'Visitas del mes', value: `${this.t.visitasMes}`, cls: 'text-card-foreground' },
      ]
    : [];

  readonly activeTab = signal<Tab>('general');

  goBack(): void {
    this.router.navigate(['/territorios']);
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  tabClass(tab: Tab): string {
    return (
      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ' +
      (this.activeTab() === tab
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground')
    );
  }

  crecimientoClass(c: number): string {
    return 'mt-0.5 font-mono text-lg font-semibold ' + (c >= 0 ? 'text-success' : 'text-destructive');
  }

  crecimientoPrefix(c: number): string {
    return c >= 0 ? '+' : '';
  }

  cumplimientoKpiClass(pct: number): string {
    return (
      'mt-0.5 font-mono text-lg font-semibold ' +
      (pct >= 100 ? 'text-success' : pct >= 85 ? 'text-warning' : 'text-destructive')
    );
  }

  catColor(i: number): string {
    return CAT_COLORS[i % CAT_COLORS.length];
  }

  barWidth(pct: number): number {
    return Math.min(100, pct);
  }

  barHeightPx(value: number): number {
    return this.ventasMax > 0 ? Math.max(8, (value / this.ventasMax) * 140) : 0;
  }

  comparativaBarWidth(value: number): number {
    return this.comparativaMax > 0 ? Math.min(100, Math.round((value / this.comparativaMax) * 100)) : 0;
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}
