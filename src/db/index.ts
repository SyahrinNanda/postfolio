import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import * as relations from "./relations";

const isExport = process.env.NEXT_EXPORT === "true";

const sqlite = new Database("sqlite.db", {
  readonly: isExport,
  fileMustExist: true,
});

if (!isExport) {
  sqlite.pragma("foreign_keys = ON");
}

export const db = drizzle({
  client: sqlite,
  schema: { ...schema, ...relations },
});

export type Database = typeof db;

