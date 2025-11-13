// Access database the same way as main app
import db from './src/db/index.js';

// Query to check if admin user exists
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
console.log('Admin user found:', adminUser);

db.close();