export type FuelType = 'A92' | 'A95' | 'A95+' | 'Diesel' | 'Gas';

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;            // ISO yyyy-mm-dd
  mileage: number;          // текущий пробег
  previousMileage?: number; // пробег предыдущей полной заправки
  liters: number;
  pricePerLiter: number;
  totalPrice: number;
  station: string;
  fuelType: FuelType;
  fullTank: boolean;
  consumption?: number;     // л/100mi (если есть previousMileage + fullTank)
  note?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  date: string;            // ISO
  amount: number;
  category: string;        // произвольные категории
  description?: string;
  recurringId?: string;
}

export interface RecurringExpense {
  id: string;
  vehicleId: string;
  description: string;
  amount: number;
  cadence: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  nextDate: string;       // ISO — следующее списание
}

export interface MonthlyData {
  month: number;          // 1..12
  expenses: number;       // всё (без топлива)
  fuel: number;           // только топливо
  maintenance: number;    // часть expenses
  other: number;
}

export interface YearlyReport {
  year: number;
  totalExpenses: number;  // fuel + expenses
  totalMileage: number;
  costPerKm: number;
  monthlyData: MonthlyData[];
  topExpenses: { category: string; amount: number }[];
}

export interface ExpenseSummary {
  label: string;
  totalAmount: number;
  byCategory: { category: string; amount: number; percentage: number }[];
}