// backend/src/repositories/deviceRepository.js
import { query, get, all } from '../db/index.js';

const deviceRepository = {
  async create(deviceData) {
    const {
      id,
      name,
      playlist_id,
      location,
      status,
    } = deviceData;

    const sql = `
      INSERT INTO devices (id, name, playlist_id, location, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [id, name, playlist_id, location, JSON.stringify(status)];
    query(sql, values);
    return this.findById(id);
  },

  async findById(id) {
    const sql = 'SELECT * FROM devices WHERE id = ?';
    return get(sql, [id]);
  },

  async findAll() {
    const sql = 'SELECT * FROM devices ORDER BY created_at DESC';
    return all(sql);
  },

  async update(id, deviceData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(deviceData)) {
      if (key === 'status') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE devices SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.findById(id);
  },

  async remove(id) {
    const sql = 'DELETE FROM devices WHERE id = ?';
    const device = await this.findById(id);
    query(sql, [id]);
    return device;
  },
};

export default deviceRepository;
