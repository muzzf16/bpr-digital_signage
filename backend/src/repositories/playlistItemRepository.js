// backend/src/repositories/playlistItemRepository.js
import { query, get, all } from '../db/index.js';

const playlistItemRepository = {
  async create(itemData) {
    const {
      playlist_id,
      position,
      item_type,
      item_ref,
      metadata,
      duration_sec,
      active,
    } = itemData;

    const sql = `
      INSERT INTO playlist_items (playlist_id, position, item_type, item_ref, metadata, duration_sec, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [playlist_id, position, item_type, item_ref, JSON.stringify(metadata), duration_sec, active];
    const result = query(sql, values);
    return this.findById(result.lastInsertRowid);
  },

  async findById(id) {
    const sql = 'SELECT * FROM playlist_items WHERE id = ?';
    return get(sql, [id]);
  },

  async findByPlaylistId(playlistId) {
    const sql = 'SELECT * FROM playlist_items WHERE playlist_id = ? AND active = 1 ORDER BY position';
    return all(sql, [playlistId]);
  },

  async update(id, itemData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(itemData)) {
      if (key === 'metadata') {
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
    return this.findById(id);
  },

  async remove(id) {
    const sql = 'DELETE FROM playlist_items WHERE id = ?';
    const item = await this.findById(id);
    query(sql, [id]);
    return item;
  },
};

export default playlistItemRepository;
