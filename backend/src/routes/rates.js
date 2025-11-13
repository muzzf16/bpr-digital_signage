import express from 'express';
import productService from '../services/productService.js';

const router = express.Router();

// GET /api/rates/:id - Get a single product/rate by ID
router.get('/:id', (req, res) => {
  try {
    const product = productService.getProductById(req.params.id);
    if (product) {
      res.json({ success: true, rate: product.interest_rate });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

export default router;
