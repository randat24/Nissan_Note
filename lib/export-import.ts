import { db } from './db';

/**
 * Exports all database tables as a single JSON file and triggers a download in the browser.
 */
export async function exportData() {
  const [vehicles, templates, records, partLinks, fuelRecords, expenses, recurring] =
    await Promise.all([
      db.vehicles.toArray(),
      db.templates.toArray(),
      db.records.toArray(),
      db.partLinks.toArray(),
      db.fuelRecords.toArray(),
      db.expenses.toArray(),
      db.recurring.toArray(),
    ]);
  const data = {
    vehicles,
    templates,
    records,
    partLinks,
    fuelRecords,
    expenses,
    recurring,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'note-data-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Imports data from a JSON file and replaces the current database contents.
 */
export async function importData(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  await db.transaction('rw', db.vehicles, db.templates, db.records, db.partLinks, db.fuelRecords, db.expenses, db.recurring, async () => {
    if (data.templates) {
      await db.templates.clear();
      await db.templates.bulkAdd(data.templates);
    }
    if (data.vehicles) {
      await db.vehicles.clear();
      await db.vehicles.bulkAdd(data.vehicles);
    }
    if (data.records) {
      await db.records.clear();
      await db.records.bulkAdd(data.records);
    }
    if (data.partLinks) {
      await db.partLinks.clear();
      await db.partLinks.bulkAdd(data.partLinks);
    }
    if (data.fuelRecords) {
      await db.fuelRecords.clear();
      await db.fuelRecords.bulkAdd(data.fuelRecords);
    }
    if (data.expenses) {
      await db.expenses.clear();
      await db.expenses.bulkAdd(data.expenses);
    }
    if (data.recurring) {
      await db.recurring.clear();
      await db.recurring.bulkAdd(data.recurring);
    }
  });
}