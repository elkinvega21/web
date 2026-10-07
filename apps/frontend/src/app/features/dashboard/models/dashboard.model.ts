/** Contratos de GET /api/dashboard. Reflejan los DTOs de application.analytics. */

export type KpiFormat = 'currency' | 'number';

export interface Kpi {
  key: string;
  label: string;
  /** Valor crudo: el formato lo decide el cliente según `format`. */
  value: number;
  format: KpiFormat;
  /** Variación porcentual respecto al periodo de comparación. */
  delta: number;
  deltaLabel: string;
  icon: string;
  spark: number[];
}

export interface SeriesPoint {
  label: string;
  value: number;
  /** Serie de contraste (meta o periodo anterior). Nulo si no aplica. */
  comparison: number | null;
}

export interface NamedValue {
  name: string;
  value: number;
  /** Anotación opcional: porcentaje, unidades, % de meta. */
  label: string | null;
}

export interface Alert {
  id: string;
  title: string;
  detail: string;
  level: 'critical' | 'warning' | 'info';
}

export interface Activity {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  /** ISO instant. */
  time: string;
  tone: 'default' | 'success' | 'warning';
}

export interface Dashboard {
  kpis: Kpi[];
  monthlySales: SeriesPoint[];
  salesByTerritory: NamedValue[];
  topProducts: NamedValue[];
  salespersonGoals: NamedValue[];
  alerts: Alert[];
  activity: Activity[];
}
