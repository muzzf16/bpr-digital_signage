import db, { query, get, all } from '../db/index.js';

// Asset service functions
const assetService = {
  // Create a new asset record
  async createAsset(assetData) {
    const {
      filename,
      url,
      mime,
      width,
      height,
      size_bytes,
      uploaded_by,
      cdn_url // Optional CDN URL
    } = assetData;

    const sql = `
      INSERT INTO assets (filename, url, mime, width, height, size_bytes, uploaded_by, cdn_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = query(sql, [filename, url, mime, width, height, size_bytes, uploaded_by, cdn_url || null]);
    return this.getAssetById(result.lastInsertRowid);
  },

  // Get asset by ID
  async getAssetById(id) {
    const sql = 'SELECT * FROM assets WHERE id = ?';
    return get(sql, [id]);
  },

  // Get all assets
  async getAllAssets() {
    const sql = 'SELECT * FROM assets ORDER BY created_at DESC';
    return all(sql);
  },

  // Update asset
  async updateAsset(id, assetData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(assetData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE assets SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getAssetById(id);
  },

  // Delete asset
  async deleteAsset(id) {
    const sql = 'DELETE FROM assets WHERE id = ?';
    const asset = await this.getAssetById(id);
    query(sql, [id]);
    return asset;
  }
};

export default assetService;