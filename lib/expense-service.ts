import { db } from './db';
import type { FuelRecord, ExpenseSummary, YearlyReport } from '../types/expenses';

/**
 * Helper to convert a Date or ISO string to ISO date (yyyy-mm-dd).
 */
function toISO(d: string | Date): string {
  return (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
}

/**
 * Adds a fuel record to the database. Automatically calculates totalPrice and consumption if possible.
 */
export async function addFuelRecord(input: Omit<FuelRecord, 'id' | 'consumption'>): Promise<string> {
  let previousMileage = input.previousMileage;
  if (input.fullTank && previousMileage == null) {
    const fulls = await db.fuelRecords
      .where({ vehicleId: input.vehicleId, fullTank: 1 as any })
      .reverse()
      .sortBy('date');
    const candidate = fulls.find((r) => r.fullTank);
    if (candidate) previousMileage = candidate.mileage;
  }
  let consumption: number | undefined;
  if (input.fullTank && previousMileage != null && input.mileage > previousMileage) {
    const dist = input.mileage - previousMileage;
    consumption = parseFloat(((input.liters / dist) * 100).toFixed(2));
  }
  const totalPrice = input.totalPrice ?? parseFloat((input.liters * input.pricePerLiter).toFixed(2));
  const record: FuelRecord = {
    id: crypto.randomUUID(),
    ...input,
    previousMileage,
    totalPrice,
    consumption,
  };
  await db.fuelRecords.add(record);
  return record.id;
}

/**
 * Computes statistics for fuel consumption and spending for a given vehicle.
 */
export async function getFuelStatistics(vehicleId: string) {
  const rows = await db.fuelRecords
    .where('vehicleId')
    .equals(vehicleId)
    .reverse()
    .sortBy('date');
  const list = rows.reverse();
  const consumptions = list
    .map((r) => r.consumption)
    .filter((x): x is number => typeof x === 'number' && isFinite(x));
  const totalLiters = list.reduce((s, r) => s + (r.liters || 0), 0);
  const totalCost = list.reduce((s, r) => s + (r.totalPrice || 0), 0);
  const avgPrice = totalLiters > 0 ? totalCost / totalLiters : 0;
  const mileages = list
    .map((r) => r.mileage)
    .filter((n) => typeof n === 'number')
    .sort((a, b) => a - b);
  const totalMileage = mileages.length >= 2 ? mileages[mileages.length - 1] - mileages[0] : 0;
  const costPerKm = totalMileage > 0 ? totalCost / totalMileage : 0;
  const stationCount = new Map<string, number>();
  for (const r of list) {
    if (!r.station) continue;
    stationCount.set(r.station, (stationCount.get(r.station) || 0) + 1);
  }
  let favoriteStation: string | null = null;
  let best = 0;
  stationCount.forEach((cnt, st) => {
    if (cnt > best) {
      best = cnt;
      favoriteStation = st;
    }
  });
  return {
    count: list.length,
    avgConsumption: consumptions.length
      ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length
      : 0,
    bestConsumption: consumptions.length ? Math.min(...consumptions) : 0,
    worstConsumption: consumptions.length ? Math.max(...consumptions) : 0,
    totalLiters,
    totalCost,
    avgPrice,
    costPerKm,
    favoriteStation,
  };
}

/**
 * Aggregates expenses by category within a date range, returning totals and percentages.
 */
export async function getExpenseSummary(
  vehicleId: string,
  startISO: string,
  endISO: string,
  label = 'Период'
): Promise<ExpenseSummary> {
  const items = await db.expenses
    .where('vehicleId')
    .equals(vehicleId)
    .filter((e) => e.date >= startISO && e.date <= endISO)
    .toArray();
  const totalAmount = items.reduce((s, e) => s + e.amount, 0);
  const byMap = new Map<string, number>();
  for (const e of items) {
    byMap.set(e.category, (byMap.get(e.category) || 0) + e.amount);
  }
  const byCategory = Array.from(byMap.entries()).map(([category, amount]) => {
    return {
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    };
  }).sort((a, b) => b.amount - a.amount);
  return { label, totalAmount, byCategory };
}

/**
 * Generates a yearly report summarising expenses and fuel by month, plus cost per kilometre and top categories.
 */
export async function getYearlyReport(
  vehicleId: string,
  year: number
): Promise<YearlyReport> {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const exp = await db.expenses
    .where('vehicleId')
    .equals(vehicleId)
    .filter((e) => e.date >= start && e.date <= end)
    .toArray();
  const byMonthExp = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0, maintenance: 0, other: 0 }));
  for (const e of exp) {
    const m = new Date(e.date).getMonth();
    byMonthExp[m].total += e.amount;
    if (e.category.toLowerCase().includes('maint') || e.category.toLowerCase().includes('то')) {
      byMonthExp[m].maintenance += e.amount;
    } else {
      byMonthExp[m].other += e.amount;
    }
  }
  const fuels = await db.fuelRecords
    .where('vehicleId')
    .equals(vehicleId)
    .filter((r) => r.date >= start && r.date <= end)
    .toArray();
  const byMonthFuel = Array.from({ length: 12 }, () => 0);
  for (const f of fuels) {
    const m = new Date(f.date).getMonth();
    byMonthFuel[m] += f.totalPrice || f.liters * f.pricePerLiter;
  }
  const yearMileages = fuels
    .map((r) => r.mileage)
    .filter((n) => typeof n === 'number')
    .sort((a, b) => a - b);
  const totalMileage = yearMileages.length >= 2 ? yearMileages[yearMileages.length - 1] - yearMileages[0] : 0;
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    expenses: byMonthExp[i].total,
    fuel: byMonthFuel[i],
    maintenance: byMonthExp[i].maintenance,
    other: byMonthExp[i].other,
  }));
  const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses + m.fuel, 0);
  const costPerKm = totalMileage > 0 ? totalExpenses / totalMileage : 0;
  const mapAll = new Map<string, number>();
  for (const e of exp) {
    mapAll.set(e.category, (mapAll.get(e.category) || 0) + e.amount);
  }
  const topExpenses = Array.from(mapAll.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  return {
    year,
    totalExpenses,
    totalMileage,
    costPerKm,
    monthlyData,
    topExpenses,
  };
}

/**
 * Retrieves recurring expenses that fall within the next 60 days.
 */
export async function getUpcomingRecurring(vehicleId: string) {
  const now = new Date();
  const in60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const list = await db.recurring
    .where('vehicleId')
    .equals(vehicleId)
    .toArray();
  return list
    .filter(
      (i) =>
        i.nextDate >= toISO(now) && i.nextDate <= toISO(in60)
    )
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate));
}