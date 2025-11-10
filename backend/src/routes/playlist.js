import express from 'express';
import strapiService from '../services/strapiService.js';
import mock from '../data/mock.js';

const router = express.Router();

// Get playlist for a specific device
router.get('/:deviceId/playlist', async (req, res) => {
  const { deviceId } = req.params;
  
  try {
    // Try to fetch from Strapi first
    const playlist = await strapiService.getPlaylistByDeviceId(deviceId);

    if (playlist) {
      res.json({ 
        success: true, 
        playlist 
      });
    } else {
      // Fallback to mock data if Strapi fails or returns nothing
      console.warn(`[Playlist] Could not find playlist for device '${deviceId}' in Strapi. Falling back to mock data.`);
      res.json({ 
        success: true, 
        playlist: mock.playlist 
      });
    }
  } catch (error) {
    console.error('[Playlist] Error fetching playlist:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching playlist' 
    });
  }
});

export default router;