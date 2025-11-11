import express from 'express';
import playlistService from '../../services/playlistService.js';
import playlistItemService from '../../services/playlistItemService.js';
import auditService from '../../services/auditService.js';

const router = express.Router();

// Get all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await playlistService.getAllPlaylists();
    res.json({ success: true, playlists });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new playlist
router.post('/', async (req, res) => {
  try {
    const newPlaylist = req.body;
    const playlist = await playlistService.createPlaylist(newPlaylist);
    
    // Log the creation
    await auditService.createAuditLog(
      req.user?.id || 'system', 
      'playlist', 
      playlist.id, 
      'CREATE', 
      { playlist: newPlaylist }
    );
    
    res.status(201).json({ success: true, playlist });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a playlist by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await playlistService.getPlaylistWithItems(id);
    if (playlist) {
      res.json({ success: true, playlist });
    } else {
      res.status(404).json({ success: false, message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a playlist by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlaylist = req.body;
    const playlist = await playlistService.updatePlaylist(id, updatedPlaylist);
    if (playlist) {
      // Log the update
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'playlist', 
        playlist.id, 
        'UPDATE', 
        { updates: updatedPlaylist }
      );
      
      res.json({ success: true, playlist });
    } else {
      res.status(404).json({ success: false, message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a playlist by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await playlistService.deletePlaylist(id);
    if (playlist) {
      // Log the deletion
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'playlist', 
        playlist.id, 
        'DELETE', 
        { deletedPlaylist: playlist }
      );
      
      res.json({ success: true, message: 'Playlist deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Routes for playlist items
// Get all items in a playlist
router.get('/:playlistId/items', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const items = await playlistItemService.getPlaylistItemsByPlaylistId(playlistId);
    res.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add an item to a playlist
router.post('/:playlistId/items', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const newItem = { ...req.body, playlist_id: playlistId };
    const item = await playlistItemService.createPlaylistItem(newItem);
    
    // Log the creation of playlist item
    await auditService.createAuditLog(
      req.user?.id || 'system', 
      'playlist_item', 
      item.id, 
      'CREATE', 
      { playlistId, item: newItem }
    );
    
    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error('Error adding item to playlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a playlist item
router.put('/:playlistId/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedItem = req.body;
    const item = await playlistItemService.updatePlaylistItem(itemId, updatedItem);
    if (item) {
      // Log the update of playlist item
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'playlist_item', 
        item.id, 
        'UPDATE', 
        { updates: updatedItem }
      );
      
      res.json({ success: true, item });
    } else {
      res.status(404).json({ success: false, message: 'Playlist item not found' });
    }
  } catch (error) {
    console.error('Error updating playlist item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a playlist item
router.delete('/:playlistId/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await playlistItemService.deletePlaylistItem(itemId);
    if (item) {
      // Log the deletion of playlist item
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'playlist_item', 
        item.id, 
        'DELETE', 
        { deletedItem: item }
      );
      
      res.json({ success: true, message: 'Playlist item deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Playlist item not found' });
    }
  } catch (error) {
    console.error('Error deleting playlist item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;