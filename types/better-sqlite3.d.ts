// Optional migration-time dependency. Declared loosely so the migration utility typechecks without
// the native module installed; it is installed with `npm i --no-save better-sqlite3` when a real
// Prisma/SQLite database is migrated.
declare module "better-sqlite3" {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const Database: any;
  export default Database;
}
