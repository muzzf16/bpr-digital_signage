import db, { query, get, all } from '../db/index.js';

// Product service functions
const productService = {
  // Create a new product
  async createProduct(productData) {
    const { 
      id,
      name, 
      interest_rate, 
      currency, 
      effective_date, 
      display_until, 
      terms,
      thumbnail_asset_id,
      published
    } = productData;
    
    const sql = `
      INSERT INTO products (id, name, interest_rate, currency, effective_date, display_until, terms, thumbnail_asset_id, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [id, name, interest_rate, currency, effective_date, display_until, terms, thumbnail_asset_id, published];
    const result = query(sql, values);
    return this.getProductById(id);
  },

  // Get product by ID
  async getProductById(id) {
    const sql = 'SELECT * FROM products WHERE id = ? AND published = 1';
    return get(sql, [id]);
  },

  // Get all published products
  async getAllProducts() {
    const sql = 'SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC';
    return all(sql);
  },

  // Update product
  async updateProduct(id, productData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(productData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getProductById(id);
  },

  // Delete product
  async deleteProduct(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    const product = await this.getProductById(id);
    query(sql, [id]);
    return product;
  }
};

export default productService;