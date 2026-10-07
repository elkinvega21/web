export interface Territory {
  id: string;
  name: string;
  region: string | null;
  active: boolean;
}

export interface TerritoryRequest {
  name: string;
  region?: string | null;
  active?: boolean;
}
