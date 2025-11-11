import express from 'express';
import db, { query, get, all } from '../../db/index.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM companies ORDER BY created_at DESC';
    const companies = all(sql);
    res.json({ success: true, companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new company
router.post('/', async (req, res) => {
  try {
    const {
      name,
      short_name,
      tagline,
      logo_url,
      primary_color,
      accent_color,
      timezone
    } = req.body;

    const sql = `
      INSERT INTO companies (name, short_name, tagline, logo_url, primary_color, accent_color, timezone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [name, short_name, tagline, logo_url, primary_color, accent_color, timezone];
    const result = query(sql, values);
    
    const newCompany = get('SELECT * FROM companies WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, company: newCompany });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a company by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM companies WHERE id = ?';
    const company = get(sql, [id]);
    
    if (company) {
      res.json({ success: true, company });
    } else {
      res.status(404).json({ success: false, message: 'Company not found' });
    }
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a company by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      short_name,
      tagline,
      logo_url,
      primary_color,
      accent_color,
      timezone
    } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (short_name !== undefined) {
      fields.push('short_name = ?');
      values.push(short_name);
    }
    if (tagline !== undefined) {
      fields.push('tagline = ?');
      values.push(tagline);
    }
    if (logo_url !== undefined) {
      fields.push('logo_url = ?');
      values.push(logo_url);
    }
    if (primary_color !== undefined) {
      fields.push('primary_color = ?');
      values.push(primary_color);
    }
    if (accent_color !== undefined) {
      fields.push('accent_color = ?');
      values.push(accent_color);
    }
    if (timezone !== undefined) {
      fields.push('timezone = ?');
      values.push(timezone);
    }

    values.push(id); // For WHERE clause

    if (fields.length > 0) {
      const sql = `UPDATE companies SET ${fields.join(', ')} WHERE id = ?`;
      query(sql, values);
    }

    const updatedCompany = get('SELECT * FROM companies WHERE id = ?', [id]);
    if (updatedCompany) {
      res.json({ success: true, company: updatedCompany });
    } else {
      res.status(404).json({ success: false, message: 'Company not found' });
    }
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a company by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM companies WHERE id = ?';
    const company = get('SELECT * FROM companies WHERE id = ?', [id]);
    
    if (company) {
      query(sql, [id]);
      res.json({ success: true, message: 'Company deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Company not found' });
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;