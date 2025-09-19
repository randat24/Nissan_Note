import { differenceInCalendarDays, addMonths as dfAddMonths } from 'date-fns';
import type { HealthStatus } from './types';

/**
 * Adds a number of months to an ISO date and returns the resulting ISO date (yyyy-mm-dd).
 */
export function addMonths(dateISO: string, months: number): string {
  const date = new Date(dateISO);
  const next = dfAddMonths(date, months);
  return next.toISOString().slice(0, 10);
}

/**
 * Returns the number of full calendar days between two ISO dates.
 */
export function daysDiff(aISO: string, bISO: string): number {
  return differenceInCalendarDays(new Date(bISO), new Date(aISO));
}

/**
 * Computes the next due date and/or mileage based on the last service date/mileage
 * and the interval in months or distance. Either parameter may be undefined.
 */
export function computeNextDue(
  lastDate?: string,
  lastMileage?: number,
  intervalMonths?: number,
  intervalDistance?: number
): { nextServiceDate?: string; nextServiceMileage?: number } {
  const nextServiceDate = lastDate && intervalMonths
    ? addMonths(lastDate, intervalMonths)
    : undefined;
  const nextServiceMileage =
    typeof lastMileage === 'number' && intervalDistance
      ? lastMileage + intervalDistance
      : undefined;
  return { nextServiceDate, nextServiceMileage };
}

/**
 * Computes the status (ok, soon, overdue) based on current date/mileage and the next due date/mileage.
 * soonDays and soonDistance define thresholds for the 'soon' status.
 */
export function computeStatus(
  todayISO: string,
  currentMileage: number,
  nextDate?: string,
  nextMileage?: number,
  soonDays = 30,
  soonDistance = 500
): HealthStatus {
  const overdueByDate = nextDate ? new Date(todayISO) > new Date(nextDate) : false;
  const overdueByDist = typeof nextMileage === 'number' ? currentMileage > nextMileage : false;
  if (overdueByDate || overdueByDist) return 'overdue';
  const soonByDate = nextDate ? daysDiff(todayISO, nextDate) <= soonDays : false;
  const soonByDist = typeof nextMileage === 'number' ? (nextMileage - currentMileage) <= soonDistance : false;
  if (soonByDate || soonByDist) return 'soon';
  return 'ok';
}