import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = "./sqlite.db";

let _db: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");

    // Run custom schema
    const schemaPath = path.join(process.cwd(), "lib", "db-schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");
    _db.exec(schema);
  }
  return _db;
}

// Helper to generate IDs
export function generateId() {
  return crypto.randomUUID();
}
