import express from 'express';
import assetService from '../../services/assetService.js';

const router = express.Router();

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await assetService.getAllAssets();
    res.json({ success: true, assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get an asset by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await assetService.getAssetById(id);
    if (asset) {
      res.json({ success: true, asset });
    } else {
      res.status(404).json({ success: false, message: 'Asset not found' });
    }
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update an asset by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAsset = req.body;
    const asset = await assetService.updateAsset(id, updatedAsset);
    if (asset) {
      res.json({ success: true, asset });
    } else {
      res.status(404).json({ success: false, message: 'Asset not found' });
    }
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete an asset by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await assetService.deleteAsset(id);
    if (asset) {
      res.json({ success: true, message: 'Asset deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Asset not found' });
    }
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;