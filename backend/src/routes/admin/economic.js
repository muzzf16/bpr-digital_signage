import express from 'express';
import economicDataService from '../../services/economicDataService.js';

const router = express.Router();

// GET /api/admin/economic - Get all economic data items
router.get('/', (req, res) => {
  try {
    const dataItems = economicDataService.getAllEconomicData();
    res.json({ success: true, economicData: dataItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch economic data items' });
  }
});

// GET /api/admin/economic/:id - Get a single economic data item by ID
router.get('/:id', (req, res) => {
  try {
    const dataItem = economicDataService.getEconomicDataById(req.params.id);
    if (dataItem) {
      res.json({ success: true, economicData: dataItem });
    } else {
      res.status(404).json({ success: false, message: 'Economic data item not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch economic data item' });
  }
});

// POST /api/admin/economic - Create a new economic data item
router.post('/', (req, res) => {
  try {
    const newDataItem = economicDataService.createEconomicData(req.body);
    res.status(201).json({ success: true, economicData: newDataItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create economic data item' });
  }
});

// PUT /api/admin/economic/:id - Update an economic data item
router.put('/:id', (req, res) => {
  try {
    const updatedDataItem = economicDataService.updateEconomicData(req.params.id, req.body);
    res.json({ success: true, economicData: updatedDataItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update economic data item' });
  }
});

// DELETE /api/admin/economic/:id - Delete an economic data item
router.delete('/:id', (req, res) => {
  try {
    economicDataService.deleteEconomicData(req.params.id);
    res.json({ success: true, message: 'Economic data item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete economic data item' });
  }
});

export default router;
