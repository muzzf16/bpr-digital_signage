import express from 'express';
import displaySettingsService from '../../services/displaySettingsService.js';

const router = express.Router();

// GET /api/admin/display-settings - Get all display settings
router.get('/', (req, res) => {
  try {
    const settings = displaySettingsService.getAllSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch display settings' });
  }
});

// PUT /api/admin/display-settings - Update display settings
router.put('/', (req, res) => {
  try {
    const updatedSettings = displaySettingsService.updateSettings(req.body);
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update display settings' });
  }
});

export default router;
