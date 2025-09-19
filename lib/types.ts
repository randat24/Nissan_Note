export type UnitDistance = 'km' | 'mi';
export type HealthStatus = 'ok' | 'soon' | 'overdue';

export interface Vehicle {
  id: string;
  make: 'Nissan';
  model: 'Note';
  year?: number;
  engine?: string;
  transmission?: 'MT' | 'AT' | 'CVT';
  unitDistance: UnitDistance;
  currentMileage: number;
  createdAt: string;
}

export interface MaintenanceTemplate {
  id: string;
  title: string;
  intervalDistance?: number;
  intervalMonths?: number;
  notes?: string;
  sourceUrl?: string;
  unitDistance: UnitDistance;
}

export interface ServiceRecord {
  id?: number;
  vehicleId: string;
  templateId: string;
  date: string;
  mileage: number;
  cost?: number;
  location?: string;
  note?: string;
  receiptUrl?: string;
  addedAt: string;
}

export type PartStatus = 'need' | 'in_cart' | 'bought' | 'installed';

export interface PartLink {
  id: string;
  templateId: string;
  title: string;
  spec?: string;
  url: string;
  price?: number;
  currency?: 'UAH' | 'USD' | 'EUR';
  status?: PartStatus;
}