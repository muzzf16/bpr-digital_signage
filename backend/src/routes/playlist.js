import express from 'express';
import playlistService from '../services/playlistService.js';
import deviceService from '../services/deviceService.js';
import productService from '../services/productService.js';
import promoService from '../services/promoService.js';
import announcementService from '../services/announcementService.js';

const router = express.Router();

// Get playlist for a specific device
router.get('/:deviceId/playlist', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Get device information
    const device = await deviceService.getDeviceById(deviceId);
    
    // If device doesn't exist, create a default one for demo purposes
    if (!device) {
      // Create a default device with a default playlist for demo purposes
      const defaultPlaylist = {
        id: "default-playlist",
        items: [
          { type: "image", url: "/assets/demo.jpg", duration: 12, title: "Promo Tabungan" },
          { type: "rate", productId: "tabungan-simapanas", duration: 10 },
          { type: "economic", duration: 15 },
          { type: "news", duration: 12 }
        ]
      };
      
      res.json({ success: true, playlist: defaultPlaylist });
      return;
    }
    
    // Update last seen timestamp
    await deviceService.updateDeviceLastSeen(deviceId);
    
    // Get playlist ID for the device
    const playlistId = device.playlist_id;
    if (!playlistId) {
      // Return a default playlist if no playlist is assigned
      const defaultPlaylist = {
        id: "default-playlist",
        items: [
          { type: "image", url: "/assets/demo.jpg", duration: 12, title: "Promo Tabungan" },
          { type: "rate", productId: "tabungan-simapanas", duration: 10 },
          { type: "economic", duration: 15 },
          { type: "news", duration: 12 }
        ]
      };
      
      res.json({ success: true, playlist: defaultPlaylist });
      return;
    }
    
    // Get playlist with items
    const playlist = await playlistService.getPlaylistWithItems(playlistId);
    if (!playlist) {
      // Return default playlist if specific playlist not found
      const defaultPlaylist = {
        id: "default-playlist",
        items: [
          { type: "image", url: "/assets/demo.jpg", duration: 12, title: "Promo Tabungan" },
          { type: "rate", productId: "tabungan-simapanas", duration: 10 },
          { type: "economic", duration: 15 },
          { type: "news", duration: 12 }
        ]
      };
      
      res.json({ success: true, playlist: defaultPlaylist });
      return;
    }
    
    // Resolve items by fetching additional data as needed
    const resolvedItems = [];
    for (const item of playlist.items) {
      const baseItem = {
        id: item.id,
        type: item.item_type,
        duration: item.duration_sec,
        metadata: item.metadata || {}
      };
      
      // For items that reference other entities, resolve them
      if (item.item_type === 'product' && item.item_ref) {
        const product = await productService.getProductById(item.item_ref);
        if (product) {
          baseItem.productId = product.id;
        }
      } else if (item.item_type === 'promo' && item.item_ref) {
        const promo = await promoService.getPromoById(item.item_ref);
        if (promo) {
          baseItem.promoId = promo.id;
        }
      } else if (item.item_type === 'image' || item.item_type === 'video') {
        // For image/video items, use URL from metadata
        // Parse metadata from JSON string if needed
        let parsedMetadata = item.metadata;
        if (typeof item.metadata === 'string') {
          try {
            parsedMetadata = JSON.parse(item.metadata);
          } catch (e) {
            parsedMetadata = {};
          }
        }
        baseItem.url = parsedMetadata?.url || parsedMetadata?.asset_url || `/public/uploads/${item.item_ref}`;
      }
      
      resolvedItems.push(baseItem);
    }
    
    // Get active announcements for the device
    const announcements = await announcementService.getActiveAnnouncements();
    
    // Return the resolved playlist
    res.json({ 
      success: true, 
      playlist: { 
        id: playlist.id, 
        name: playlist.name,
        items: resolvedItems 
      },
      device: {
        id: device.id,
        name: device.name,
        location: device.location
      },
      announcements: announcements
    });
    
  } catch (err) {
    console.error('Error fetching device playlist:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
