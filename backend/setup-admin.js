// backend/setup-admin.js
import userService from './src/services/userService.js';
import db from './src/db/index.js';
import bcrypt from 'bcrypt';

async function setupAdminUser() {
  try {
    console.log('Checking for admin user...');
    let adminUser = await userService.findByUsername('admin');
    const adminPassword = process.env.ADMIN_PASSWORD || 'supersecretpassword';

    if (adminUser) {
      console.log('Admin user already exists. Updating password...');
      const password_hash = await bcrypt.hash(adminPassword, 10); // 10 is the saltRounds
      await userService.update(adminUser.id, { password_hash });
      console.log('Admin user password updated successfully.');
    } else {
      console.log('Creating admin user...');
      await userService.createUser({
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error.message);
  } finally {
    db.close();
  }
}

setupAdminUser();
