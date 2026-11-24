#!/usr/bin/env node
/*
  Create or reset an admin login from the command line (on the server).

    npm run admin:user -- --username admin --password "NewStrongPass1"

  - Creates the user if it doesn't exist, otherwise sets its password.
  - Signs that user out of every browser.
  - Uses the same database as the app: $DATA_DIR/cms.sqlite (default ./data).

  Normally you don't need this: the app seeds the first admin automatically
  (ADMIN_USERNAME / ADMIN_PASSWORD, default admin / Admin@12345) and the
  password is changed from /admin/account. Use it if the password is lost.
*/
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const username = arg("username")?.trim();
const password = arg("password");
const mustChange = args.includes("--must-change");

if (!username || !password) {
  console.error('Usage: npm run admin:user -- --username <name> --password "<password>" [--must-change]');
  process.exit(1);
}
if (!/^[A-Za-z0-9._-]{3,32}$/.test(username)) {
  console.error("Username must be 3-32 characters: letters, numbers, dot, dash or underscore.");
  process.exit(1);
}
if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
  console.error("Password must be at least 8 characters with at least one letter and one number.");
  process.exit(1);
}

const dataDir = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "cms.sqlite"));
db.exec("PRAGMA busy_timeout = 5000");
db.exec("PRAGMA foreign_keys = ON");
// Same definitions as migration 1 in src/lib/db/index.ts (the app finishes the rest).
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    username              TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password_hash         TEXT    NOT NULL,
    must_change_password  INTEGER NOT NULL DEFAULT 0,
    created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at            TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash  TEXT    PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at  INTEGER NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
const stored = ["scrypt", 16384, 8, 1, salt.toString("base64"), hash.toString("base64")].join("$");

const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
if (existing) {
  db.prepare(
    "UPDATE users SET password_hash = ?, must_change_password = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(stored, mustChange ? 1 : 0, existing.id);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(existing.id);
  console.log(`Password updated for "${username}" (all sessions signed out).`);
} else {
  db.prepare(
    "INSERT INTO users (username, password_hash, must_change_password) VALUES (?, ?, ?)",
  ).run(username, stored, mustChange ? 1 : 0);
  console.log(`Admin user "${username}" created.`);
}
db.close();
