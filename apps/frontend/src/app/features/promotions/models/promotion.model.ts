export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  /** ISO date (yyyy-MM-dd). */
  startDate: string;
  endDate: string;
  /** Derivado por el backend a partir de vigencia y bandera de activación. */
  status: string;
  conditions: string | null;
  minimumAmount: number;
  productIds: string[];
  productNames: string[];
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionRequest {
  name: string;
  description?: string | null;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  active?: boolean;
  conditions?: string | null;
  minimumAmount?: number;
  productIds?: string[];
}

export const PROMOTION_TYPES = ['Porcentaje', 'Monto fijo', '2x1', 'Combo'] as const;

export type PromotionType = (typeof PROMOTION_TYPES)[number];
