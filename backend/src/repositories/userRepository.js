// backend/src/repositories/userRepository.js
import { query, get, all } from '../db/index.js';

const userRepository = {
  async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    return get(sql, [username]);
  },

  async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return get(sql, [id]);
  },

  async createUser(userData) {
    const { username, email, password_hash, role } = userData;
    const sql = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    const result = query(sql, [username, email, password_hash, role]);
    return this.findById(result.lastInsertRowid);
  },

  async update(id, userData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.findById(id);
  },
};

export default userRepository;
