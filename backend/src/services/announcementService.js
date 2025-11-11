import db, { query, get, all } from '../db/index.js';

// Announcement service functions
const announcementService = {
  // Create a new announcement
  async createAnnouncement(announcementData) {
    const { 
      message,
      start_at,
      end_at,
      priority,
      created_by
    } = announcementData;
    
    const sql = `
      INSERT INTO announcements (message, start_at, end_at, priority, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [message, start_at, end_at, priority, created_by];
    const result = query(sql, values);
    return this.getAnnouncementById(result.lastInsertRowid);
  },

  // Get active announcements by priority (active now and ordered by priority)
  async getActiveAnnouncements() {
    const sql = `SELECT * FROM announcements 
                 WHERE (start_at IS NULL OR start_at <= CURRENT_TIMESTAMP) 
                 AND (end_at IS NULL OR end_at >= CURRENT_TIMESTAMP)
                 ORDER BY priority DESC, created_at DESC`;
    return all(sql);
  },

  // Get announcement by ID
  async getAnnouncementById(id) {
    const sql = 'SELECT * FROM announcements WHERE id = ?';
    return get(sql, [id]);
  },

  // Get all announcements
  async getAllAnnouncements() {
    const sql = 'SELECT * FROM announcements ORDER BY created_at DESC';
    return all(sql);
  },

  // Update announcement
  async updateAnnouncement(id, announcementData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(announcementData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE announcements SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getAnnouncementById(id);
  },

  // Delete announcement
  async deleteAnnouncement(id) {
    const sql = 'DELETE FROM announcements WHERE id = ?';
    const announcement = await this.getAnnouncementById(id);
    query(sql, [id]);
    return announcement;
  }
};

export default announcementService;