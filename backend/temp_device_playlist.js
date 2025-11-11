// Get playlist for a specific device
router.get('/:deviceId/playlist', async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Get device information from cache
    const device = await cached(
      `device:${deviceId}`,
      300, // 5 minutes cache
      () => deviceService.getDeviceById(deviceId)
    );
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Update last seen timestamp
    await deviceService.updateDeviceLastSeen(deviceId);

    // Get playlist ID for the device
    const playlistId = device.playlist_id;
    if (!playlistId) {
      return res.status(404).json({
        success: false,
        message: 'No playlist assigned to device'
      });
    }

    // Get playlist with items from cache
    const playlist = await cached(
      `playlist:${playlistId}`,
      600, // 10 minutes cache
      () => playlistService.getPlaylistWithItems(playlistId)
    );
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
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

      // Resolve item-specific data
      if (item.item_type === 'product' && item.item_ref) {
        const product = await cached(
          `product:${item.item_ref}`,
          600, // 10 minutes cache
          () => productService.getProductById(item.item_ref)
        );
        
        if (product) {
          baseItem.product = {
            id: product.id,
            name: product.name,
            interestRate: product.interest_rate,
            currency: product.currency,
            terms: product.terms
          };
        }
      } else if (item.item_type === 'promo' && item.item_ref) {
        const promo = await cached(
          `promo:${item.item_ref}`,
          600, // 10 minutes cache
          () => promoService.getPromoById(item.item_ref)
        );
        
        if (promo) {
          baseItem.promo = {
            id: promo.id,
            title: promo.title,
            subtitle: promo.subtitle,
            body: promo.body
          };
        }
      } else if (item.item_type === 'image' || item.item_type === 'video') {
        // For image/video items, use URL from metadata or construct one
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

      // Add to resolved items
      resolvedItems.push(baseItem);
    }

    // Get active announcements for the device (cached separately)
    const announcements = await cached(
      'announcements:active',
      300, // 5 minutes cache
      () => announcementService.getActiveAnnouncements()
    );

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
      announcements: announcements,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error fetching device playlist:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});