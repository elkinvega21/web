import { NamedValue, SeriesPoint } from '../../dashboard/models/dashboard.model';

export type { NamedValue, SeriesPoint };

/** Contratos de GET /api/reports. Reflejan los DTOs de application.analytics. */

export interface ReportSummary {
  totalSales: number;
  monthSales: number;
  previousPeriodSales: number;
  /** Variación porcentual del mes en curso frente al anterior. */
  growth: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  activeCustomers: number;
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  inventoryValue: number;
  totalSalespersons: number;
  activeSalespersons: number;
  totalCommissions: number;
  averageTicket: number;
}

export interface DailySales {
  /** ISO date (yyyy-MM-dd). */
  date: string;
  /** Etiqueta corta del día: Lun, Mar, Mié… */
  day: string;
  sales: number;
  orders: number;
}

export interface Report {
  summary: ReportSummary;
  dailySales: DailySales[];
  monthlySales: SeriesPoint[];
  customerGrowth: SeriesPoint[];
  customersByTerritory: NamedValue[];
  salesByTerritory: NamedValue[];
  topProducts: NamedValue[];
  ordersByStatus: NamedValue[];
  salesBySalesperson: NamedValue[];
  goalCompletion: NamedValue[];
  stockByCategory: NamedValue[];
}
