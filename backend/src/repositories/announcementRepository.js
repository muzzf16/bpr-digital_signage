// backend/src/repositories/announcementRepository.js
import { query, get, all } from '../db/index.js';

const announcementRepository = {
  async create(announcementData) {
    const {
      message,
      start_at,
      end_at,
      priority,
      created_by,
    } = announcementData;

    const sql = `
      INSERT INTO announcements (message, start_at, end_at, priority, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [message, start_at, end_at, priority, created_by];
    const result = query(sql, values);
    return this.findById(result.lastInsertRowid);
  },

  async findById(id) {
    const sql = 'SELECT * FROM announcements WHERE id = ?';
    return get(sql, [id]);
  },

  async findActive() {
    const sql = `SELECT * FROM announcements 
                 WHERE (start_at IS NULL OR start_at <= CURRENT_TIMESTAMP) 
                 AND (end_at IS NULL OR end_at >= CURRENT_TIMESTAMP)
                 ORDER BY priority DESC, created_at DESC`;
    return all(sql);
  },

  async findAll() {
    const sql = 'SELECT * FROM announcements ORDER BY created_at DESC';
    return all(sql);
  },

  async update(id, announcementData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(announcementData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE announcements SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.findById(id);
  },

  async remove(id) {
    const sql = 'DELETE FROM announcements WHERE id = ?';
    const announcement = await this.findById(id);
    query(sql, [id]);
    return announcement;
  },
};

export default announcementRepository;
