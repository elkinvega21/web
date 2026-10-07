/**
 * Traduce la respuesta del API a las formas que ya consumen los componentes de
 * gráficas. Mantener la traducción aquí evita tocar cada componente y deja un
 * único punto donde se ve qué campo del backend alimenta qué gráfica.
 */
import type {
  Activity as ViewActivity,
  Alert as ViewAlert,
  Kpi as ViewKpi,
} from '../../../core/data/dashboard-data';
import { Activity, Alert, Dashboard, Kpi, NamedValue, SeriesPoint } from '../models/dashboard.model';

/** Paleta de la hoja de estilos; se cicla si hay más territorios que colores. */
const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

export function formatKpiValue(kpi: Kpi): string {
  return kpi.format === 'currency'
    ? currencyFormatter.format(kpi.value)
    : numberFormatter.format(kpi.value);
}

export function toKpiCards(kpis: Kpi[]): ViewKpi[] {
  return kpis.map((kpi) => ({
    key: kpi.key,
    label: kpi.label,
    value: formatKpiValue(kpi),
    delta: kpi.delta,
    deltaLabel: kpi.deltaLabel,
    icon: kpi.icon,
    spark: kpi.spark,
  }));
}

export function toMonthlySales(points: SeriesPoint[]): { month: string; ventas: number; meta: number }[] {
  return points.map((point) => ({
    month: point.label,
    ventas: point.value,
    meta: point.comparison ?? 0,
  }));
}

/** La dona se dibuja con porcentajes, así que la participación se calcula aquí. */
export function toTerritoryShare(values: NamedValue[]): { name: string; value: number; fill: string }[] {
  const total = values.reduce((sum, item) => sum + item.value, 0);
  return values.map((item, index) => ({
    name: item.name,
    value: total > 0 ? Math.round((item.value / total) * 100) : 0,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
}

export function toTopProducts(values: NamedValue[]): { product: string; unidades: number }[] {
  return values.map((item) => ({ product: item.name, unidades: item.value }));
}

export function toSellers(values: NamedValue[]): { name: string; cumplimiento: number }[] {
  return values.map((item) => ({ name: item.name, cumplimiento: item.value }));
}

export function toAlerts(alerts: Alert[]): ViewAlert[] {
  return alerts.map((alert) => ({
    id: alert.id,
    title: alert.title,
    detail: alert.detail,
    level: alert.level,
  }));
}

export function toActivity(items: Activity[], now: Date = new Date()): ViewActivity[] {
  return items.map((item) => ({
    id: item.id,
    actor: item.actor,
    initials: item.initials,
    action: item.action,
    target: item.target,
    time: relativeTime(item.time, now),
    tone: item.tone,
  }));
}

/** "Hace 8 min", "Hace 2 h", "Hace 3 d". */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const elapsedMs = now.getTime() - new Date(iso).getTime();
  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 1) {
    return 'Hace un momento';
  }
  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hace ${hours} h`;
  }
  return `Hace ${Math.floor(hours / 24)} d`;
}

export interface DashboardView {
  kpis: ViewKpi[];
  monthlySales: { month: string; ventas: number; meta: number }[];
  territories: { name: string; value: number; fill: string }[];
  topProducts: { product: string; unidades: number }[];
  sellers: { name: string; cumplimiento: number }[];
  activity: ViewActivity[];
  alerts: ViewAlert[];
}

export function toDashboardView(dashboard: Dashboard, now: Date = new Date()): DashboardView {
  return {
    kpis: toKpiCards(dashboard.kpis),
    monthlySales: toMonthlySales(dashboard.monthlySales),
    territories: toTerritoryShare(dashboard.salesByTerritory),
    topProducts: toTopProducts(dashboard.topProducts),
    sellers: toSellers(dashboard.salespersonGoals),
    activity: toActivity(dashboard.activity, now),
    alerts: toAlerts(dashboard.alerts),
  };
}
