import Dexie, { Table } from 'dexie';
import type { Vehicle, MaintenanceTemplate, ServiceRecord, PartLink } from './types';
import type { FuelRecord, Expense, RecurringExpense } from '../types/expenses';
import templates from './seed';

/**
 * Central Dexie database definition. Combines maintenance data with fuel and expense tracking.
 */
export class AppDB extends Dexie {
  vehicles!: Table<Vehicle, string>;
  templates!: Table<MaintenanceTemplate, string>;
  records!: Table<ServiceRecord, number>;
  partLinks!: Table<PartLink, string>;
  fuelRecords!: Table<FuelRecord, string>;
  expenses!: Table<Expense, string>;
  recurring!: Table<RecurringExpense, string>;

  constructor() {
    super('note_db');
    this.version(1).stores({
      vehicles: 'id',
      templates: 'id',
      records: '++id, vehicleId, templateId, date, mileage',
      partLinks: 'id, templateId, status',
      fuelRecords: 'id, vehicleId, date, mileage',
      expenses: 'id, vehicleId, date, category',
      recurring: 'id, vehicleId, nextDate',
    });
  }
}

export const db = new AppDB();

/**
 * Ensures that the database is populated with default templates and a default vehicle.
 * This is executed at module import time.
 */
async function ensureSeed() {
  const count = await db.templates.count();
  if (count === 0) {
    await db.templates.bulkAdd(templates as any);
  }
  const vehiclesCount = await db.vehicles.count();
  if (vehiclesCount === 0) {
    await db.vehicles.add({
      id: 'note-01',
      make: 'Nissan',
      model: 'Note',
      year: 2012,
      engine: 'HR15',
      transmission: 'CVT',
      unitDistance: 'km',
      currentMileage: 128450,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }
}

// Kick off seeding when the module is loaded
ensureSeed().catch((err) => {
  console.error('Error seeding database:', err);
});