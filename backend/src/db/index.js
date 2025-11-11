import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

// Create directory if it doesn't exist
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Create tables if they don't exist
function initializeTables() {
  // Create companies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      short_name TEXT,
      tagline TEXT,
      logo_url TEXT,
      primary_color VARCHAR(7),
      accent_color VARCHAR(7),
      timezone VARCHAR(64) DEFAULT 'Asia/Jakarta',
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    )
  `);

  // Create assets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      mime TEXT,
      width INTEGER,
      height INTEGER,
      size_bytes INTEGER,
      uploaded_by TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    )
  `);

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      interest_rate REAL,
      currency VARCHAR(8) DEFAULT 'IDR',
      effective_date DATETIME,
      display_until DATETIME,
      terms TEXT,
      thumbnail_asset_id INTEGER,
      published BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (thumbnail_asset_id) REFERENCES assets(id) ON DELETE SET NULL
    )
  `);

  // Create promos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS promos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      body TEXT,
      image_asset_id INTEGER,
      start_at DATETIME,
      end_at DATETIME,
      published BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (image_asset_id) REFERENCES assets(id) ON DELETE SET NULL
    )
  `);

  // Create playlists table
  db.exec(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      company_id INTEGER,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
    )
  `);

  // Create playlist_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS playlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playlist_id INTEGER NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      item_type TEXT NOT NULL,
      item_ref TEXT,
      metadata TEXT,
      duration_sec INTEGER DEFAULT 12,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
    )
  `);

  // Create devices table
  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT,
      playlist_id INTEGER,
      location TEXT,
      last_seen DATETIME,
      status TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
    )
  `);

  // Create announcements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      start_at DATETIME,
      end_at DATETIME,
      priority INTEGER DEFAULT 10,
      created_by TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    )
  `);

  // Create audit_logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      entity TEXT,
      entity_id TEXT,
      action TEXT,
      payload TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    )
  `);
}

// Initialize tables
initializeTables();

// Create triggers to update the 'updated_at' field
function createTriggers() {
  // Companies trigger
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_companies_updated_at 
    AFTER UPDATE ON companies
    BEGIN
      UPDATE companies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  // Products trigger
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_products_updated_at 
    AFTER UPDATE ON products
    BEGIN
      UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  // Promos trigger
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_promos_updated_at 
    AFTER UPDATE ON promos
    BEGIN
      UPDATE promos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  // Playlists trigger
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_playlists_updated_at 
    AFTER UPDATE ON playlists
    BEGIN
      UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);
}

createTriggers();

// Function to run queries
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(params);
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(params);
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(params);
}

// Export database instance and helper functions
export default db;
export { query, get, all };