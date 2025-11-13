// backend/src/repositories/dashboardRepository.js
import { get } from '../db/index.js';

const dashboardRepository = {
  async getStats() {
    const totalPlaylists = get('SELECT COUNT(*) as count FROM playlists').count;
    const activeDevices = get("SELECT COUNT(*) as count FROM devices WHERE status LIKE '%\"online\":true%' ").count;
    const totalRates = get('SELECT COUNT(*) as count FROM products').count;

    return {
      totalPlaylists,
      activeDevices,
      totalRates,
    };
  },
};

export default dashboardRepository;
