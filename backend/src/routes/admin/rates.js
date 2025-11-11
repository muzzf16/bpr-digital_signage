import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve(process.cwd(), 'src', 'data', 'rates.json');

// Get all rates
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const rates = JSON.parse(data);
    res.json({ success: true, rates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new rate
router.post('/', async (req, res) => {
  try {
    const newRate = req.body;
    const data = await fs.readFile(dataPath, 'utf-8');
    const rates = JSON.parse(data);
    rates.push(newRate);
    await fs.writeFile(dataPath, JSON.stringify(rates, null, 2));
    res.json({ success: true, rate: newRate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a rate by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    const rates = JSON.parse(data);
    const rate = rates.find(r => r.id === id);
    if (rate) {
      res.json({ success: true, rate });
    } else {
      res.status(404).json({ success: false, message: 'Rate not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a rate by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRate = req.body;
    const data = await fs.readFile(dataPath, 'utf-8');
    let rates = JSON.parse(data);
    rates = rates.map(r => (r.id === id ? updatedRate : r));
    await fs.writeFile(dataPath, JSON.stringify(rates, null, 2));
    res.json({ success: true, rate: updatedRate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a rate by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    let rates = JSON.parse(data);
    rates = rates.filter(r => r.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(rates, null, 2));
    res.json({ success: true, message: 'Rate deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
