// backend/src/repositories/productRepository.js
import { query, get, all } from '../db/index.js';

const productRepository = {
  async create(productData) {
    const {
      id,
      name,
      interest_rate,
      currency,
      effective_date,
      display_until,
      terms,
      thumbnail_asset_id,
      published,
    } = productData;

    const sql = `
      INSERT INTO products (id, name, interest_rate, currency, effective_date, display_until, terms, thumbnail_asset_id, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [id, name, interest_rate, currency, effective_date, display_until, terms, thumbnail_asset_id, published];
    query(sql, values);
    return this.findById(id);
  },

  async findById(id) {
    const sql = 'SELECT * FROM products WHERE id = ? AND published = 1';
    return get(sql, [id]);
  },

  async findAll() {
    const sql = 'SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC';
    return all(sql);
  },

  async update(id, productData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(productData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.findById(id);
  },

  async remove(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    const product = await this.findById(id);
    query(sql, [id]);
    return product;
  },
};

export default productRepository;
