import db, { query, get, all } from '../db/index.js';

// Playlist service functions
const playlistService = {
  // Create a new playlist
  async createPlaylist(playlistData) {
    const { name, company_id } = playlistData;
    
    const sql = `
      INSERT INTO playlists (name, company_id)
      VALUES (?, ?)
    `;
    
    const values = [name, company_id];
    const result = query(sql, values);
    return this.getPlaylistById(result.lastInsertRowid);
  },

  // Get playlist by ID
  async getPlaylistById(id) {
    const sql = 'SELECT * FROM playlists WHERE id = ?';
    return get(sql, [id]);
  },

  // Get playlist with items
  async getPlaylistWithItems(id) {
    const playlist = await this.getPlaylistById(id);
    if (!playlist) return null;
    
    const itemsSql = `
      SELECT pi.*, p.name as product_name, p.interest_rate, p.published as product_published
      FROM playlist_items pi
      LEFT JOIN products p ON (pi.item_type='product' AND pi.item_ref = p.id)
      WHERE pi.playlist_id=? AND pi.active=1 
      ORDER BY pi.position
    `;
    
    const items = all(itemsSql, [id]);
    playlist.items = items;
    
    return playlist;
  },

  // Get all playlists
  async getAllPlaylists() {
    const sql = 'SELECT * FROM playlists ORDER BY created_at DESC';
    return all(sql);
  },

  // Update playlist
  async updatePlaylist(id, playlistData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(playlistData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE playlists SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getPlaylistById(id);
  },

  // Delete playlist
  async deletePlaylist(id) {
    const sql = 'DELETE FROM playlists WHERE id = ?';
    const playlist = await this.getPlaylistById(id);
    query(sql, [id]);
    return playlist;
  }
};

export default playlistService;