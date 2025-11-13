// backend/src/routes/admin/dashboard.js
import express from 'express';
import dashboardService from '../../services/dashboardService.js';

const router = express.Router();

router.get('/dashboard-stats', async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
