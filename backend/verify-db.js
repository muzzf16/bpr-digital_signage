// Verify admin user in database
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
console.log('Looking for database at:', dbPath);

const db = new Database(dbPath);

// Query to check if admin user exists
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
console.log('Admin user found:', adminUser);

db.close();