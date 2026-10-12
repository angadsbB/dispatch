import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { seed } from "./seed";

const globalForDb = globalThis as unknown as {
  dispatchDb?: Database.Database;
};

function migrate(db: Database.Database) {
  db.pragma(process.env.VERCEL ? "journal_mode = DELETE" : "journal_mode = WAL");
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      industry TEXT NOT NULL,
      hqAddress TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      employeeCount INTEGER NOT NULL,
      mrrBand TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS funding_events (
      id INTEGER PRIMARY KEY,
      companyId INTEGER NOT NULL REFERENCES companies(id),
      round TEXT NOT NULL,
      amountUsd INTEGER NOT NULL,
      announcedOn TEXT NOT NULL,
      leadInvestor TEXT NOT NULL,
      sourceUrl TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      companyId INTEGER NOT NULL REFERENCES companies(id),
      fullName TEXT NOT NULL,
      title TEXT NOT NULL,
      linkedinUrl TEXT NOT NULL,
      email TEXT NOT NULL,
      isDecisionMaker INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gift_options (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      costUsd INTEGER NOT NULL,
      description TEXT NOT NULL,
      leadTimeDays INTEGER NOT NULL,
      emoji TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gift_sends (
      id INTEGER PRIMARY KEY,
      contactId INTEGER NOT NULL REFERENCES contacts(id),
      companyId INTEGER NOT NULL REFERENCES companies(id),
      giftOptionId INTEGER NOT NULL REFERENCES gift_options(id),
      fundingEventId INTEGER NOT NULL REFERENCES funding_events(id),
      status TEXT NOT NULL,
      note TEXT NOT NULL,
      requestedBy TEXT NOT NULL,
      requestedAt TEXT NOT NULL,
      decidedBy TEXT,
      decidedAt TEXT,
      rejectionReason TEXT,
      trackingNumber TEXT,
      shippedAt TEXT,
      deliveredAt TEXT,
      shippingAddress TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS outcomes (
      id INTEGER PRIMARY KEY,
      giftSendId INTEGER NOT NULL UNIQUE REFERENCES gift_sends(id),
      replied INTEGER NOT NULL DEFAULT 0,
      repliedAt TEXT,
      meetingBooked INTEGER NOT NULL DEFAULT 0,
      meetingDate TEXT,
      opportunityValueUsd INTEGER,
      stage TEXT NOT NULL DEFAULT 'none'
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY,
      month TEXT NOT NULL UNIQUE,
      allocatedUsd INTEGER NOT NULL
    );
  `);
}

function dbFile(): string {
  // Vercel lambdas can only write under /tmp. Local keeps the file in data/.
  if (process.env.VERCEL) {
    return path.join("/tmp", "dispatch.db");
  }
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "dispatch.db");
}

export function getDb(): Database.Database {
  if (globalForDb.dispatchDb) return globalForDb.dispatchDb;

  const file = dbFile();
  const db = new Database(file);
  migrate(db);

  const companyCount = db.prepare("SELECT COUNT(*) AS c FROM companies").get() as { c: number };
  if (companyCount.c === 0) {
    seed(db);
  }

  globalForDb.dispatchDb = db;
  return db;
}
