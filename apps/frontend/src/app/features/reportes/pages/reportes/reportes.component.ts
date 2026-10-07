import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ReportKpiComponent } from '../../components/report-kpi/report-kpi.component';
import { ReportLineComponent } from '../../components/report-line/report-line.component';
import { ReportBarsComponent, REPORT_CHART_COLORS } from '../../components/report-bars/report-bars.component';
import { ReportHbarsComponent } from '../../components/report-hbars/report-hbars.component';
import { ReportDonutComponent } from '../../components/report-donut/report-donut.component';
import {
  getReporteGeneral,
  getVentasPorDia,
  getVentasMensuales,
  getClientesPorTerritorio,
  getTopProductos,
  getPedidosPorEstado,
  getVentasPorVendedor,
  getCumplimientoMetas,
  getVentasPorTerritorio,
  getStockPorCategoria,
  getCrecimientoClientes,
  formatCurrency,
} from '../../../../core/data/reportes-data';
import { territorios } from '../../../../core/data/territorios-data';
import { ReportService } from '../../services/report.service';
import { toReportView } from '../../services/report.mapper';
import { DemoDataNoticeComponent } from '../../../../shared/components/demo-data-notice/demo-data-notice.component';
import type { ReportBarItem } from '../../components/report-bars/report-bars.component';
import type { ReportLineItem } from '../../components/report-line/report-line.component';
import type { ReportHbarItem } from '../../components/report-hbars/report-hbars.component';
import type { ReportDonutItem } from '../../components/report-donut/report-donut.component';

interface ResumenItem {
  modulo: string;
  metricas: string;
  variacion: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    DemoDataNoticeComponent,
    IconComponent,
    ReportKpiComponent,
    ReportLineComponent,
    ReportBarsComponent,
    ReportHbarsComponent,
    ReportDonutComponent,
  ],
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Reportes</h1>
        <p class="text-sm text-muted-foreground">Dashboard analítico del sistema</p>
        @if (usingDemoData()) {
          <app-demo-data-notice class="mt-2 block" />
        }
      </div>
      <div class="flex items-center gap-2">
        <select [value]="periodo()" (change)="onPeriodo($event)" aria-label="Período"
          class="h-9 rounded-lg border border-input bg-card px-3 text-xs text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
          @for (p of periodos; track p.value) {
            <option [value]="p.value">{{ p.label }}</option>
          }
        </select>
        <div class="relative">
          <button type="button" (click)="toggleExport()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted">
            <app-icon name="download" [size]="14" /> Exportar
          </button>
          @if (showExport()) {
            <div class="fixed inset-0 z-30" (click)="toggleExport()" aria-hidden="true"></div>
            <div class="absolute right-0 top-full z-40 mt-1 w-40 rounded-xl border border-border bg-card p-1.5 shadow-lg">
              <button type="button" (click)="toggleExport()"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                <app-icon name="file-text" [size]="14" /> Exportar PDF
              </button>
              <button type="button" (click)="toggleExport()"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                <app-icon name="file-text" [size]="14" /> Exportar Excel
              </button>
            </div>
          }
        </div>
        <button type="button" (click)="showSchedule.set(true)"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <app-icon name="clock" [size]="14" /> Programar
        </button>
      </div>
    </div>

    <div class="mb-6 flex gap-1 overflow-x-auto border-b border-border">
      @for (t of tabs; track t) {
        <button type="button" (click)="tab.set(t)" [class]="tabBtnClass(t)">{{ t }}</button>
      }
    </div>

    @switch (tab()) {
      @case ('General') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <app-report-kpi label="Ventas totales" [value]="formatCurrency(general().ventasTotales)" icon="dollar-sign" />
            <app-report-kpi label="Pedidos" [value]="str(general().totalPedidos)" icon="shopping-cart" />
            <app-report-kpi label="Clientes activos" [value]="str(general().clientesActivos)" icon="users" />
            <app-report-kpi label="Vendedores" [value]="str(general().vendedoresActivos)" icon="award" />
            <app-report-kpi label="Ticket promedio" [value]="formatCurrency(general().ticketPromedio)" icon="target" />
            <app-report-kpi label="Crecimiento" [value]="crecimientoLabel()"
              [icon]="general().crecimiento >= 0 ? 'trending-up' : 'trending-down'"
              [color]="general().crecimiento >= 0 ? 'text-success' : 'text-destructive'" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Ventas por día (esta semana)</h3>
              <app-report-line [items]="ventasPorDiaLine()" color="#6366f1" [formatTick]="tickMoneyM1" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Distribución</h3>
              <p class="mb-4 text-xs text-muted-foreground">Ventas por módulo</p>
              <app-report-donut [items]="donutDistribucion" [colors]="donutDistribucionColors"
                [labelFormat]="donutPctLabel" />
            </div>
          </div>
          <div class="overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border bg-muted/30">
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Módulo</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Métricas clave</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Variación</th>
                </tr>
              </thead>
              <tbody>
                @for (item of resumenItems(); track item.modulo) {
                  <tr class="border-b border-border last:border-0">
                    <td class="px-4 py-3 font-medium text-card-foreground">{{ item.modulo }}</td>
                    <td class="px-4 py-3 text-xs text-muted-foreground">{{ item.metricas }}</td>
                    <td [class]="variacionClass(item.variacion)">{{ item.variacion }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @case ('Ventas') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <app-report-kpi label="Ventas del mes" [value]="formatCurrency(general().ventasMes)" icon="dollar-sign" />
            <app-report-kpi label="Vs período anterior" [value]="vsPeriodoAnterior()" icon="trending-up" />
            <app-report-kpi label="Crecimiento" [value]="crecimientoLabel()"
              [icon]="general().crecimiento >= 0 ? 'trending-up' : 'trending-down'"
              [color]="general().crecimiento >= 0 ? 'text-success' : 'text-destructive'" />
            <app-report-kpi label="Ticket promedio" [value]="formatCurrency(general().ticketPromedio)" icon="target" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Ventas mensuales</h3>
              <p class="mb-4 text-xs text-muted-foreground">Últimos 6 meses vs período anterior</p>
              <app-report-bars [items]="ventasMensualesBars()" primaryColor="#6366f1" [showLegend]="true"
                [formatTick]="tickMoneyM0" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Ventas por vendedor</h3>
              <p class="mb-4 text-xs text-muted-foreground">Top vendedores del período</p>
              <app-report-hbars [items]="ventasPorVendedorHbars()" [formatTick]="tickMoneyM1" />
            </div>
          </div>
        </div>
      }

      @case ('Clientes') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <app-report-kpi label="Total clientes" [value]="str(general().totalClientes)" icon="users" />
            <app-report-kpi label="Activos" [value]="str(general().clientesActivos)" icon="users" color="text-success" />
            <app-report-kpi label="Nuevos (mes)" value="8" icon="users" />
            <app-report-kpi label="Tasa retención" value="94%" icon="target" color="text-success" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Clientes por territorio</h3>
              <app-report-bars [items]="clientesPorTerritorioBars()" [formatTick]="tickInt" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Crecimiento de clientes</h3>
              <p class="mb-4 text-xs text-muted-foreground">Nuevos clientes por mes</p>
              <app-report-line [items]="crecimientoClientesLine()" color="#10b981" [formatTick]="tickInt" />
            </div>
          </div>
        </div>
      }

      @case ('Pedidos') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <app-report-kpi label="Total pedidos" [value]="str(general().totalPedidos)" icon="shopping-cart" />
            <app-report-kpi label="Completados" [value]="str(general().pedidosCompletados)" icon="shopping-cart" color="text-success" />
            <app-report-kpi label="Pendientes" [value]="str(general().pedidosPendientes)" icon="shopping-cart" color="text-warning" />
            <app-report-kpi label="Facturados" [value]="str(general().pedidosFacturados)" icon="shopping-cart" color="text-primary" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Pedidos por estado</h3>
              <app-report-donut [items]="pedidosPorEstadoDonut()" [colors]="pedidosColors" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Valor promedio por pedido</h3>
              <p class="mb-4 text-xs text-muted-foreground">Tendencia mensual</p>
              <app-report-line [items]="valorPromedioLine()" color="#6366f1" [gradient]="false" [formatTick]="tickMoneyM1" />
            </div>
          </div>
        </div>
      }

      @case ('Productos') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <app-report-kpi label="Total productos" [value]="str(general().totalProductos)" icon="package" />
            <app-report-kpi label="Activos" [value]="str(general().productosActivos)" icon="package" color="text-success" />
            <app-report-kpi label="Stock bajo" [value]="str(general().stockBajo)" icon="package" color="text-warning" />
            <app-report-kpi label="Valor inventario" [value]="formatCurrency(general().valorInventario)" icon="dollar-sign" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Top productos por valor inventario</h3>
              <app-report-hbars [items]="topProductosHbars()" [nameWidth]="130" [formatTick]="tickMoneyM0" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Stock por categoría</h3>
              <app-report-bars [items]="stockPorCategoriaBars()" [formatTick]="tickInt" />
            </div>
          </div>
        </div>
      }

      @case ('Territorios') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <app-report-kpi label="Territorios" [value]="str(territoriosCount())" icon="map" />
            <app-report-kpi label="Ventas totales" [value]="formatCurrency(general().ventasTotales)" icon="dollar-sign" />
            <app-report-kpi label="Clientes totales" [value]="str(general().totalClientes)" icon="users" />
            <app-report-kpi label="Vendedores" [value]="str(general().vendedoresActivos)" icon="award" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Ventas por territorio</h3>
              <app-report-bars [items]="ventasPorTerritorioBars()" [formatTick]="tickMoneyM1" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Participación por territorio</h3>
              <app-report-donut [items]="participacionTerritoriosDonut()" [labelFormat]="donutPctLabel" />
            </div>
          </div>
        </div>
      }

      @case ('Vendedores') {
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <app-report-kpi label="Vendedores" [value]="str(general().totalVendedores)" icon="users" />
            <app-report-kpi label="Activos" [value]="str(general().vendedoresActivos)" icon="award" color="text-success" />
            <app-report-kpi label="Ventas totales" [value]="formatCurrency(general().ventasTotales)" icon="dollar-sign" />
            <app-report-kpi label="Comisiones" [value]="formatCurrency(general().comisionesTotales)" icon="target" />
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Top vendedores</h3>
              <p class="mb-4 text-xs text-muted-foreground">Ventas del mes</p>
              <app-report-hbars [items]="ventasPorVendedorHbars()" [formatTick]="tickMoneyM1" />
            </div>
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-1 text-sm font-semibold text-card-foreground">Cumplimiento de metas</h3>
              <p class="mb-4 text-xs text-muted-foreground">Porcentaje vs meta mensual</p>
              <app-report-hbars [items]="cumplimientoMetasHbars()" [domain]="120" [colorOf]="metaColor"
                [formatTick]="tickPct" />
            </div>
          </div>
        </div>
      }
    }

    @if (showSchedule()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-[2px]"
        (click)="showSchedule.set(false)">
        <div role="dialog" aria-modal="true" aria-labelledby="schedule-title"
          class="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg" (click)="$event.stopPropagation()">
          <h3 id="schedule-title" class="text-base font-semibold text-card-foreground">Programar reporte</h3>
          <p class="mt-1 text-sm text-muted-foreground">Configura el envío automático de este reporte por correo.</p>
          <div class="mt-4 space-y-3">
            <div>
              <label class="block text-xs font-medium text-muted-foreground" for="schedule-freq">Frecuencia</label>
              <select id="schedule-freq"
                class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
                <option>Diario</option>
                <option>Semanal</option>
                <option>Mensual</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-muted-foreground" for="schedule-email">Destinatarios</label>
              <input id="schedule-email" type="text" placeholder="correo@ejemplo.com"
                class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25" />
            </div>
            <div>
              <label class="block text-xs font-medium text-muted-foreground" for="schedule-format">Formato</label>
              <select id="schedule-format"
                class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25">
                <option>PDF</option>
                <option>Excel</option>
              </select>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" (click)="showSchedule.set(false)"
              class="inline-flex h-9 items-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancelar</button>
            <button type="button" (click)="showSchedule.set(false)"
              class="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Programar</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ReportesComponent implements OnDestroy {
  private readonly reportService = inject(ReportService);
  private readonly subscription: Subscription;

  readonly formatCurrency = formatCurrency;
  readonly territorios = territorios;

  readonly tabs = ['General', 'Ventas', 'Clientes', 'Pedidos', 'Productos', 'Territorios', 'Vendedores'];

  readonly periodos = [
    { value: 'mes', label: 'Este mes' },
    { value: 'trimestre', label: 'Este trimestre' },
    { value: 'anio', label: 'Este año' },
    { value: 'personalizado', label: 'Personalizado' },
  ];

  readonly periodo = signal('mes');
  readonly tab = signal('General');
  readonly showExport = signal(false);
  readonly showSchedule = signal(false);

  /**
   * Series servidas por el API. Arrancan con los valores de prueba para que la
   * pantalla siga siendo navegable si el backend no está levantado; en ese caso
   * `usingDemoData` deja constancia visible de que no son cifras reales.
   *
   * Arranca en false y solo se activa si la petición falla: mientras carga
   * todavía no se sabe si habrá API, y anunciarlo antes de tiempo haría
   * parpadear el aviso en cada visita.
   */
  readonly usingDemoData = signal(false);
  readonly general = signal(getReporteGeneral());
  readonly territoriosCount = signal(territorios.length);

  readonly donutDistribucionColors = REPORT_CHART_COLORS.slice(0, 5);
  readonly pedidosColors = ['#10b981', '#f59e0b', '#6366f1', '#ef4444'];

  readonly ventasPorDiaLine = signal<ReportLineItem[]>(
    getVentasPorDia().map((d) => ({ label: d.dia, value: d.ventas })),
  );
  readonly ventasMensualesBars = signal<ReportBarItem[]>(
    getVentasMensuales().map((m) => ({ label: m.mes, value: m.valor, secondary: m.anterior })),
  );
  readonly clientesPorTerritorioBars = signal<ReportBarItem[]>(
    getClientesPorTerritorio().map((t) => ({ label: t.nombre, value: t.valor })),
  );
  readonly topProductosHbars = signal<ReportHbarItem[]>(
    getTopProductos().map((p) => ({ nombre: p.nombre, valor: p.valor, label: p.label })),
  );
  readonly pedidosPorEstadoDonut = signal<ReportDonutItem[]>(
    getPedidosPorEstado().map((e) => ({ nombre: e.nombre, valor: e.valor })),
  );
  readonly ventasPorVendedorHbars = signal<ReportHbarItem[]>(
    getVentasPorVendedor().map((v) => ({ nombre: v.nombre, valor: v.valor, label: v.label })),
  );
  readonly cumplimientoMetasHbars = signal<ReportHbarItem[]>(
    getCumplimientoMetas().map((v) => ({ nombre: v.nombre, valor: v.valor })),
  );
  readonly ventasPorTerritorioBars = signal<ReportBarItem[]>(
    getVentasPorTerritorio().map((t) => ({ label: t.nombre, value: t.valor })),
  );
  readonly participacionTerritoriosDonut = signal<ReportDonutItem[]>(
    getVentasPorTerritorio().map((t) => ({ nombre: t.nombre, valor: parseInt(t.label || '0', 10) })),
  );
  readonly stockPorCategoriaBars = signal<ReportBarItem[]>(
    getStockPorCategoria().map((c) => ({ label: c.nombre, value: c.valor })),
  );
  readonly crecimientoClientesLine = signal<ReportLineItem[]>(
    getCrecimientoClientes().map((c) => ({ label: c.mes, value: c.valor })),
  );
  readonly valorPromedioLine = signal<ReportLineItem[]>(
    getVentasMensuales().map((m) => ({ label: m.mes, value: m.valor })),
  );

  /** Reparto ilustrativo de módulos: no corresponde a ninguna métrica del API. */
  readonly donutDistribucion: ReportDonutItem[] = [
    { nombre: 'Pedidos', valor: 40 },
    { nombre: 'Productos', valor: 25 },
    { nombre: 'Clientes', valor: 15 },
    { nombre: 'Vendedores', valor: 12 },
    { nombre: 'Territorios', valor: 8 },
  ];

  constructor() {
    this.subscription = this.reportService.load().subscribe({
      next: (report) => {
        const view = toReportView(report);
        this.general.set(view.general);
        this.territoriosCount.set(view.territoriosCount);
        this.ventasPorDiaLine.set(view.ventasPorDiaLine);
        this.ventasMensualesBars.set(view.ventasMensualesBars);
        this.clientesPorTerritorioBars.set(view.clientesPorTerritorioBars);
        this.topProductosHbars.set(view.topProductosHbars);
        this.pedidosPorEstadoDonut.set(view.pedidosPorEstadoDonut);
        this.ventasPorVendedorHbars.set(view.ventasPorVendedorHbars);
        this.cumplimientoMetasHbars.set(view.cumplimientoMetasHbars);
        this.ventasPorTerritorioBars.set(view.ventasPorTerritorioBars);
        this.participacionTerritoriosDonut.set(view.participacionTerritoriosDonut);
        this.stockPorCategoriaBars.set(view.stockPorCategoriaBars);
        this.crecimientoClientesLine.set(view.crecimientoClientesLine);
        this.valorPromedioLine.set(view.valorPromedioLine);
      },
      // Se conservan los datos de prueba, pero el aviso queda visible.
      error: () => this.usingDemoData.set(true),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPeriodo(event: Event): void {
    this.periodo.set((event.target as HTMLSelectElement).value);
  }

  toggleExport(): void {
    this.showExport.update((v) => !v);
  }

  tabBtnClass(t: string): string {
    return (
      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ' +
      (this.tab() === t
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground')
    );
  }

  crecimientoLabel(): string {
    const crecimiento = this.general().crecimiento;
    return `${crecimiento >= 0 ? '+' : ''}${crecimiento}%`;
  }

  str(v: number): string {
    return String(v);
  }

  vsPeriodoAnterior(): string {
    return formatCurrency(Math.round(this.general().ventasPeriodoAnterior / 6));
  }

  resumenItems(): ResumenItem[] {
    const m1 = (v: number): string => `$${(v / 1000000).toFixed(1)}M`;
    const g = this.general();
    return [
      {
        modulo: 'Ventas',
        metricas: `${m1(g.ventasTotales)} totales · ${m1(g.ventasMes)} mes`,
        variacion: `${g.crecimiento >= 0 ? '+' : ''}${g.crecimiento}%`,
      },
      {
        modulo: 'Clientes',
        metricas: `${g.clientesActivos} activos de ${g.totalClientes} totales`,
        variacion: '+8%',
      },
      {
        modulo: 'Pedidos',
        metricas: `${g.totalPedidos} totales · ${g.pedidosCompletados} completados · ${g.pedidosPendientes} pendientes`,
        variacion: '+12%',
      },
      {
        modulo: 'Productos',
        metricas: `${g.productosActivos} activos · ${g.stockBajo} con stock bajo`,
        variacion: '-3%',
      },
      {
        modulo: 'Territorios',
        metricas: `${this.territoriosCount()} territorios`,
        variacion: '+5%',
      },
      {
        modulo: 'Vendedores',
        metricas: `${g.vendedoresActivos} activos de ${g.totalVendedores} totales · ${m1(g.comisionesTotales)} comisiones`,
        variacion: '+10%',
      },
    ];
  }

  variacionClass(variacion: string): string {
    return (
      'whitespace-nowrap px-4 py-3 text-right font-mono font-medium ' +
      (variacion.startsWith('+') ? 'text-success' : 'text-destructive')
    );
  }

  donutPctLabel(nombre: string, valor: number): string {
    return `${nombre} ${valor}%`;
  }

  metaColor(item: ReportHbarItem): string {
    return item.valor >= 100 ? '#22c55e' : item.valor >= 85 ? '#f59e0b' : '#ef4444';
  }

  tickMoneyM1(v: number): string {
    return `$${(v / 1000000).toFixed(1)}M`;
  }

  tickMoneyM0(v: number): string {
    return `$${Math.round(v / 1000000)}M`;
  }

  tickInt(v: number): string {
    return String(Math.round(v));
  }

  tickPct(v: number): string {
    return `${Math.round(v)}%`;
  }
}
