import express from 'express';
import strapiService from '../services/strapiService.js';
import mock from '../data/mock.js';
import logger from '../services/loggerService.js';

const router = express.Router();

// Get all active rates
router.get('/active', async (req, res) => {
  try {
    const rates = await strapiService.getActiveRates();

    if (rates && rates.length > 0) {
      res.json({ success: true, rates });
    } else {
      logger.warn('[Rates] Could not fetch active rates from Strapi. Falling back to mock data.');
      res.json({ success: true, rates: mock.rates });
    }
  } catch (error) {
    logger.error('[Rates] Error fetching active rates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching active rates' 
    });
  }
});

// Get rate by product ID
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  
  try {
    let rate = await strapiService.getRateByProductId(productId);

    // If not found in Strapi data, try the mock data as a fallback
    if (!rate) {
      const mockRate = mock.rates.find(r => r.id === productId);
      if (mockRate) {
        logger.warn(`[Rates] Could not find rate for product '${productId}' in Strapi. Falling back to mock data.`);
        rate = mockRate;
      }
    }

    if (!rate) {
      return res.status(404).json({ 
        success: false, 
        message: `Rate for product '${productId}' not found` 
      });
    }

    res.json({ success: true, rate });
  } catch (error) {
    logger.error(`[Rates] Error fetching rate for product '${productId}':`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching rate' 
    });
  }
});

export default router;