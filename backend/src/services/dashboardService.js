// backend/src/services/dashboardService.js
import dashboardRepository from '../repositories/dashboardRepository.js';

const dashboardService = {
  async getDashboardStats() {
    const stats = await dashboardRepository.getStats();
    // You can add more logic here to calculate changes if needed
    return {
      ...stats,
      pendingUpdates: 0, // Placeholder
      playlistChange: 0, // Placeholder
      deviceChange: 0, // Placeholder
      rateChange: 0, // Placeholder
    };
  },
};

export default dashboardService;
