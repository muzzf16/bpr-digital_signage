import express from 'express';
import db, { query, get, all } from '../../db/index.js';

const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM announcements ORDER BY created_at DESC';
    const announcements = all(sql);
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new announcement
router.post('/', async (req, res) => {
  try {
    const {
      message,
      start_at,
      end_at,
      priority,
      created_by
    } = req.body;

    const sql = `
      INSERT INTO announcements (message, start_at, end_at, priority, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [message, start_at, end_at, priority || 10, created_by];
    const result = query(sql, values);
    
    const newAnnouncement = get('SELECT * FROM announcements WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get an announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM announcements WHERE id = ?';
    const announcement = get(sql, [id]);
    
    if (announcement) {
      res.json({ success: true, announcement });
    } else {
      res.status(404).json({ success: false, message: 'Announcement not found' });
    }
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update an announcement by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      message,
      start_at,
      end_at,
      priority,
      created_by
    } = req.body;

    const fields = [];
    const values = [];

    if (message !== undefined) {
      fields.push('message = ?');
      values.push(message);
    }
    if (start_at !== undefined) {
      fields.push('start_at = ?');
      values.push(start_at);
    }
    if (end_at !== undefined) {
      fields.push('end_at = ?');
      values.push(end_at);
    }
    if (priority !== undefined) {
      fields.push('priority = ?');
      values.push(priority);
    }
    if (created_by !== undefined) {
      fields.push('created_by = ?');
      values.push(created_by);
    }

    values.push(id); // For WHERE clause

    if (fields.length > 0) {
      const sql = `UPDATE announcements SET ${fields.join(', ')} WHERE id = ?`;
      query(sql, values);
    }

    const updatedAnnouncement = get('SELECT * FROM announcements WHERE id = ?', [id]);
    if (updatedAnnouncement) {
      res.json({ success: true, announcement: updatedAnnouncement });
    } else {
      res.status(404).json({ success: false, message: 'Announcement not found' });
    }
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete an announcement by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM announcements WHERE id = ?';
    const announcement = get('SELECT * FROM announcements WHERE id = ?', [id]);
    
    if (announcement) {
      query(sql, [id]);
      res.json({ success: true, message: 'Announcement deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Announcement not found' });
    }
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;