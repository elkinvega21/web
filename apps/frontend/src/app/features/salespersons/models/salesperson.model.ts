export interface Salesperson {
  id: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  territoryId: string | null;
  status: string;
  salesTotal: number;
  salesMonth: number;
  commissionRate: number;
  monthlyGoal: number;
  /** Porcentaje de la meta mensual alcanzado. 0 si no hay meta definida. */
  goalCompletion: number;
  createdAt: string;
}

export interface SalespersonRequest {
  code?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  territoryId?: string | null;
  commissionRate?: number;
  monthlyGoal?: number;
  status?: string;
}
