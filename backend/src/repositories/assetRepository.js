// backend/src/repositories/assetRepository.js
import { query, get, all } from '../db/index.js';

const assetRepository = {
  async create(assetData) {
    const {
      filename,
      url,
      mime,
      width,
      height,
      size_bytes,
      uploaded_by,
      cdn_url,
    } = assetData;

    const sql = `
      INSERT INTO assets (filename, url, mime, width, height, size_bytes, uploaded_by, cdn_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = query(sql, [filename, url, mime, width, height, size_bytes, uploaded_by, cdn_url || null]);
    return this.findById(result.lastInsertRowid);
  },

  async findById(id) {
    const sql = 'SELECT * FROM assets WHERE id = ?';
    return get(sql, [id]);
  },

  async findAll() {
    const sql = 'SELECT * FROM assets ORDER BY created_at DESC';
    return all(sql);
  },

  async update(id, assetData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(assetData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE assets SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.findById(id);
  },

  async remove(id) {
    const sql = 'DELETE FROM assets WHERE id = ?';
    const asset = await this.findById(id);
    query(sql, [id]);
    return asset;
  },
};

export default assetRepository;
