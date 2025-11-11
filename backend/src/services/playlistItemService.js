import db, { query, get, all } from '../db/index.js';

// Playlist Items service functions
const playlistItemService = {
  // Create a new playlist item
  async createPlaylistItem(itemData) {
    const { 
      playlist_id,
      position, 
      item_type, 
      item_ref,
      metadata,
      duration_sec,
      active
    } = itemData;
    
    const sql = `
      INSERT INTO playlist_items (playlist_id, position, item_type, item_ref, metadata, duration_sec, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [playlist_id, position, item_type, item_ref, JSON.stringify(metadata), duration_sec, active];
    const result = query(sql, values);
    return this.getPlaylistItemById(result.lastInsertRowid);
  },

  // Get playlist item by ID
  async getPlaylistItemById(id) {
    const sql = 'SELECT * FROM playlist_items WHERE id = ?';
    return get(sql, [id]);
  },

  // Get all items for a specific playlist
  async getPlaylistItemsByPlaylistId(playlistId) {
    const sql = 'SELECT * FROM playlist_items WHERE playlist_id = ? AND active = 1 ORDER BY position';
    return all(sql, [playlistId]);
  },

  // Update playlist item
  async updatePlaylistItem(id, itemData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(itemData)) {
      if (key === 'metadata') {
        // Special handling for metadata JSON field
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE playlist_items SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getPlaylistItemById(id);
  },

  // Update playlist item position
  async updateItemPosition(id, position) {
    const sql = 'UPDATE playlist_items SET position = ? WHERE id = ?';
    query(sql, [position, id]);
    return this.getPlaylistItemById(id);
  },

  // Reorder playlist items
  async reorderPlaylistItems(playlistId, itemOrders) {
    for (const { id, position } of itemOrders) {
      await this.updateItemPosition(id, position);
    }
    return { success: true };
  },

  // Delete playlist item
  async deletePlaylistItem(id) {
    const sql = 'DELETE FROM playlist_items WHERE id = ?';
    const item = await this.getPlaylistItemById(id);
    query(sql, [id]);
    return item;
  }
};

export default playlistItemService;