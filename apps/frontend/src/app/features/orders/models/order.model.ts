export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  salespersonId: string | null;
  salespersonName: string | null;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  customerId: string;
  salespersonId?: string | null;
  items: OrderItemRequest[];
}

/** Estados que maneja el backend (ver Order.STATUS_* en el dominio). */
export const ORDER_STATUSES = [
  'Pendiente',
  'Confirmado',
  'Enviado',
  'Entregado',
  'Cancelado',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
