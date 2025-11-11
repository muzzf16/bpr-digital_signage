import express from 'express';
import promoService from '../../services/promoService.js';
import auditService from '../../services/auditService.js';

const router = express.Router();

// Get all promos
router.get('/', async (req, res) => {
  try {
    const promos = await promoService.getAllPromos();
    res.json({ success: true, promos });
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new promo
router.post('/', async (req, res) => {
  try {
    const newPromo = req.body;
    const promo = await promoService.createPromo(newPromo);
    
    // Log the creation
    await auditService.createAuditLog(
      req.user?.id || 'system', 
      'promo', 
      promo.id, 
      'CREATE', 
      { promo: newPromo }
    );
    
    res.status(201).json({ success: true, promo });
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a promo by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await promoService.getPromoById(id);
    if (promo) {
      res.json({ success: true, promo });
    } else {
      res.status(404).json({ success: false, message: 'Promo not found' });
    }
  } catch (error) {
    console.error('Error fetching promo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a promo by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPromo = req.body;
    const promo = await promoService.updatePromo(id, updatedPromo);
    if (promo) {
      // Log the update
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'promo', 
        promo.id, 
        'UPDATE', 
        { updates: updatedPromo }
      );
      
      res.json({ success: true, promo });
    } else {
      res.status(404).json({ success: false, message: 'Promo not found' });
    }
  } catch (error) {
    console.error('Error updating promo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a promo by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await promoService.deletePromo(id);
    if (promo) {
      // Log the deletion
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'promo', 
        promo.id, 
        'DELETE', 
        { deletedPromo: promo }
      );
      
      res.json({ success: true, message: 'Promo deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Promo not found' });
    }
  } catch (error) {
    console.error('Error deleting promo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;