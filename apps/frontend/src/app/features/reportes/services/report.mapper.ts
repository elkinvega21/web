/**
 * Traduce GET /api/reports a las formas que ya consumen las gráficas de la
 * pantalla de reportes, incluida la cifra agregada `ReporteGeneral`.
 */
import type { ReporteGeneral } from '../../../core/data/reportes-data';
import type { ReportBarItem } from '../components/report-bars/report-bars.component';
import type { ReportDonutItem } from '../components/report-donut/report-donut.component';
import type { ReportHbarItem } from '../components/report-hbars/report-hbars.component';
import type { ReportLineItem } from '../components/report-line/report-line.component';
import { NamedValue, Report, ReportSummary, SeriesPoint } from '../models/report.model';

/**
 * El dominio no tiene estado "Facturado": el flujo es
 * Pendiente → Confirmado → Enviado → Entregado → Cancelado. Se mapea
 * `Completado` a Entregado y `Facturado` a Confirmado, que son los
 * equivalentes más cercanos.
 */
export function toReporteGeneral(summary: ReportSummary): ReporteGeneral {
  return {
    ventasTotales: summary.totalSales,
    ventasMes: summary.monthSales,
    ventasPeriodoAnterior: summary.previousPeriodSales,
    crecimiento: Math.round(summary.growth),
    totalPedidos: summary.totalOrders,
    pedidosPendientes: summary.pendingOrders,
    pedidosCompletados: summary.deliveredOrders,
    pedidosFacturados: summary.confirmedOrders,
    totalClientes: summary.totalCustomers,
    clientesActivos: summary.activeCustomers,
    totalProductos: summary.totalProducts,
    productosActivos: summary.activeProducts,
    stockBajo: summary.lowStock,
    valorInventario: summary.inventoryValue,
    totalVendedores: summary.totalSalespersons,
    vendedoresActivos: summary.activeSalespersons,
    comisionesTotales: summary.totalCommissions,
    ticketPromedio: summary.averageTicket,
  };
}

const toBars = (values: NamedValue[]): ReportBarItem[] =>
  values.map((item) => ({ label: item.name, value: item.value }));

const toHbars = (values: NamedValue[]): ReportHbarItem[] =>
  values.map((item) => ({ nombre: item.name, valor: item.value, label: item.label ?? undefined }));

const toDonut = (values: NamedValue[]): ReportDonutItem[] =>
  values.map((item) => ({ nombre: item.name, valor: item.value }));

const seriesToBars = (points: SeriesPoint[]): ReportBarItem[] =>
  points.map((point) => ({
    label: point.label,
    value: point.value,
    secondary: point.comparison ?? undefined,
  }));

const seriesToLine = (points: SeriesPoint[]): ReportLineItem[] =>
  points.map((point) => ({ label: point.label, value: point.value }));

export interface ReportView {
  general: ReporteGeneral;
  territoriosCount: number;
  ventasPorDiaLine: ReportLineItem[];
  ventasMensualesBars: ReportBarItem[];
  clientesPorTerritorioBars: ReportBarItem[];
  topProductosHbars: ReportHbarItem[];
  pedidosPorEstadoDonut: ReportDonutItem[];
  ventasPorVendedorHbars: ReportHbarItem[];
  cumplimientoMetasHbars: ReportHbarItem[];
  ventasPorTerritorioBars: ReportBarItem[];
  participacionTerritoriosDonut: ReportDonutItem[];
  stockPorCategoriaBars: ReportBarItem[];
  crecimientoClientesLine: ReportLineItem[];
  valorPromedioLine: ReportLineItem[];
}

export function toReportView(report: Report): ReportView {
  const totalTerritorySales = report.salesByTerritory.reduce((sum, item) => sum + item.value, 0);

  return {
    general: toReporteGeneral(report.summary),
    territoriosCount: report.customersByTerritory.length,
    ventasPorDiaLine: report.dailySales.map((day) => ({ label: day.day, value: day.sales })),
    ventasMensualesBars: seriesToBars(report.monthlySales),
    clientesPorTerritorioBars: toBars(report.customersByTerritory),
    topProductosHbars: toHbars(report.topProducts),
    pedidosPorEstadoDonut: toDonut(report.ordersByStatus),
    ventasPorVendedorHbars: toHbars(report.salesBySalesperson),
    cumplimientoMetasHbars: toHbars(report.goalCompletion),
    ventasPorTerritorioBars: toBars(report.salesByTerritory),
    participacionTerritoriosDonut: report.salesByTerritory.map((item) => ({
      nombre: item.name,
      valor: totalTerritorySales > 0 ? Math.round((item.value / totalTerritorySales) * 100) : 0,
    })),
    stockPorCategoriaBars: toBars(report.stockByCategory),
    crecimientoClientesLine: seriesToLine(report.customerGrowth),
    valorPromedioLine: seriesToLine(report.monthlySales),
  };
}
