export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  price: number;
  cost: number;
  stock: number;
  stockMin: number;
  status: string;
  lowStock: boolean;
  createdAt: string;
}

export interface ProductRequest {
  sku?: string;
  name: string;
  category?: string | null;
  price: number;
  cost?: number;
  stock?: number;
  stockMin?: number;
  status?: string;
}
