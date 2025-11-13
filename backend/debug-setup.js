// Debug version of setup script
import userService from './src/services/userService.js';
import db from './src/db/index.js';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
console.log('Database path:', DB_PATH);

async function setupAdminUser() {
  try {
    console.log('Checking for admin user...');
    let adminUser = await userService.findByUsername('admin');
    
    if (adminUser) {
      console.log('Admin user already exists:', adminUser);
      const adminPassword = process.env.ADMIN_PASSWORD || 'supersecretpassword';
      const password_hash = await bcrypt.hash(adminPassword, 10); // 10 is the saltRounds
      await userService.update(adminUser.id, { password_hash });
      console.log('Admin user password updated successfully.');
    } else {
      console.log('Admin user does not exist, creating...');
      const adminPassword = process.env.ADMIN_PASSWORD || 'supersecretpassword';
      console.log('Creating admin user with password:', adminPassword);
      await userService.createUser({
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully.');
    }
    
    // Check if admin user exists now
    adminUser = await userService.findByUsername('admin');
    console.log('Admin user after creation/update:', adminUser);
  } catch (error) {
    console.error('Error setting up admin user:', error.message, error.stack);
  } finally {
    db.close();
  }
}

setupAdminUser();