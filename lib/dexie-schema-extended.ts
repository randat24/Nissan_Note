// Re-export the central database instance from our Dexie definition.
// This file exists to maintain compatibility with pages that import
// `@/lib/dexie-schema-extended`. It simply re-exports the `db`
// instance from the main database module.

export { db } from './db';