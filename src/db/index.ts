import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import * as relations from "./relations";

const sqlite = new Database("sqlite.db");

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
// Enable foreign key enforcement
sqlite.pragma("foreign_keys = ON");

export const db = drizzle({
  client: sqlite,
  schema: { ...schema, ...relations },
});

export type Database = typeof db;

