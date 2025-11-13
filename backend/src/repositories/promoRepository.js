// backend/src/repositories/promoRepository.js
import { query, get, all } from '../db/index.js';

const promoRepository = {
  async create(promoData) {
    const {
      title,
      subtitle,
      body,
      image_asset_id,
      start_at,
      end_at,
      published,
    } = promoData;

    const sql = `
      INSERT INTO promos (title, subtitle, body, image_asset_id, start_at, end_at, published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [title, subtitle, body, image_asset_id, start_at, end_at, published];
    const result = query(sql, values);
    return this.findById(result.lastInsertRowid);
  },

  async findById(id) {
    const sql = 'SELECT * FROM promos WHERE id = ? AND published = 1';
    return get(sql, [id]);
  },

  async findAll() {
    const sql = `SELECT * FROM promos 
                 WHERE published = 1 
                 AND (start_at IS NULL OR start_at <= datetime('now')) 
                 AND (end_at IS NULL OR end_at >= datetime('now'))
                 ORDER BY created_at DESC`;
    return all(sql);
  },

  async update(id, promoData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(promoData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE promos SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.findById(id);
  },

  async remove(id) {
    const sql = 'DELETE FROM promos WHERE id = ?';
    const promo = await this.findById(id);
    query(sql, [id]);
    return promo;
  },
};

export default promoRepository;
