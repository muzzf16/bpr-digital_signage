import db, { query, get, all } from '../db/index.js';

// Promo service functions
const promoService = {
  // Create a new promo
  async createPromo(promoData) {
    const { 
      title, 
      subtitle, 
      body,
      image_asset_id,
      start_at,
      end_at,
      published
    } = promoData;
    
    const sql = `
      INSERT INTO promos (title, subtitle, body, image_asset_id, start_at, end_at, published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [title, subtitle, body, image_asset_id, start_at, end_at, published];
    const result = query(sql, values);
    return this.getPromoById(result.lastInsertRowid);
  },

  // Get promo by ID
  async getPromoById(id) {
    const sql = 'SELECT * FROM promos WHERE id = ? AND published = 1';
    return get(sql, [id]);
  },

  // Get all published promos
  async getAllPromos() {
    const sql = `SELECT * FROM promos 
                 WHERE published = 1 
                 AND (start_at IS NULL OR start_at <= datetime('now')) 
                 AND (end_at IS NULL OR end_at >= datetime('now'))
                 ORDER BY created_at DESC`;
    return all(sql);
  },

  // Update promo
  async updatePromo(id, promoData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(promoData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE promos SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getPromoById(id);
  },

  // Delete promo
  async deletePromo(id) {
    const sql = 'DELETE FROM promos WHERE id = ?';
    const promo = await this.getPromoById(id);
    query(sql, [id]);
    return promo;
  }
};

export default promoService;