export interface Customer {
  id: string;
  code: string;
  name: string;
  documentType: string;
  documentNumber: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  territoryId: string | null;
  status: string;
  totalPurchased: number;
  createdAt: string;
}

export interface CustomerRequest {
  code?: string;
  name: string;
  documentType: string;
  documentNumber: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  territoryId?: string | null;
  status?: string;
}
