import db, { query, get, all } from '../db/index.js';

// Device service functions
const deviceService = {
  // Create a new device
  async createDevice(deviceData) {
    const { 
      id,
      name, 
      playlist_id, 
      location,
      status
    } = deviceData;
    
    const sql = `
      INSERT INTO devices (id, name, playlist_id, location, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [id, name, playlist_id, location, JSON.stringify(status)];
    const result = query(sql, values);
    return this.getDeviceById(id);
  },

  // Get device by ID
  async getDeviceById(id) {
    const sql = 'SELECT * FROM devices WHERE id = ?';
    return get(sql, [id]);
  },

  // Get all devices
  async getAllDevices() {
    const sql = 'SELECT * FROM devices ORDER BY created_at DESC';
    return all(sql);
  },

  // Update device
  async updateDevice(id, deviceData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(deviceData)) {
      if (key === 'status') {
        // Special handling for status JSON field
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id); // For WHERE clause

    const sql = `UPDATE devices SET ${fields.join(', ')} WHERE id = ?`;
    query(sql, values);
    return this.getDeviceById(id);
  },

  // Update device last seen
  async updateDeviceLastSeen(id) {
    const sql = `UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?`;
    query(sql, [id]);
    return this.getDeviceById(id);
  },

  // Delete device
  async deleteDevice(id) {
    const sql = 'DELETE FROM devices WHERE id = ?';
    const device = await this.getDeviceById(id);
    query(sql, [id]);
    return device;
  },

  // Assign playlist to device
  async assignPlaylistToDevice(deviceId, playlistId) {
    const sql = `UPDATE devices SET playlist_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = query(sql, [playlistId, deviceId]);
    
    if (result.changes > 0) {
      return this.getDeviceById(deviceId);
    }
    return null;
  }
};

export default deviceService;