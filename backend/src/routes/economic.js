import express from "express";
import * as marketDataService from "../services/marketDataService.js";
import * as newsService from "../services/newsService.js";

const router = express.Router();

// Get all economic data
router.get("/", async (req, res) => {
  try {
    const results = await Promise.allSettled([
      marketDataService.getCurrencyRates(),
      marketDataService.getGoldPrice(),
      marketDataService.getStockIndex(),
      newsService.getNews()
    ]);

    const [currencyRates, goldPrice, stockIndex, news] = results.map(r => r.status === 'fulfilled' ? r.value : null);

    // Check if all services failed
    const allFailed = results.every(r => r.status === 'rejected');
    if (allFailed) {
      console.error("All economic data services failed");
      return res.status(500).json({ 
        success: false, 
        message: "All economic data services are unavailable" 
      });
    }

    res.json({
      success: true,
      data: {
        currencyRates,
        goldPrice,
        stockIndex,
        news,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error("Economic route critical error", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch economic data due to a critical error." 
    });
  }
});

export default router;