import express from 'express';
import productService from '../../services/productService.js';
import auditService from '../../services/auditService.js';

const router = express.Router();

// Get all products (rates)
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new product (rate)
router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    // Ensure the ID is set for products
    if (!newProduct.id) {
      newProduct.id = `product_${Date.now()}`;
    }
    const product = await productService.createProduct(newProduct);
    
    // Log the creation
    await auditService.createAuditLog(
      req.user?.id || 'system', 
      'product', 
      product.id, 
      'CREATE', 
      { product: newProduct }
    );
    
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    const product = await productService.updateProduct(id, updatedProduct);
    if (product) {
      // Log the update
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'product', 
        product.id, 
        'UPDATE', 
        { updates: updatedProduct }
      );
      
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.deleteProduct(id);
    if (product) {
      // Log the deletion
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'product', 
        product.id, 
        'DELETE', 
        { deletedProduct: product }
      );
      
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;