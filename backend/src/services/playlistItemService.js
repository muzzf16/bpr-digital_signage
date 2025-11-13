import playlistItemRepository from '../repositories/playlistItemRepository.js';

// Playlist Items service functions
const playlistItemService = {
  // Create a new playlist item
  async createPlaylistItem(itemData) {
    return playlistItemRepository.create(itemData);
  },

  // Get playlist item by ID
  async getPlaylistItemById(id) {
    return playlistItemRepository.findById(id);
  },

  // Get all items for a specific playlist
  async getPlaylistItemsByPlaylistId(playlistId) {
    return playlistItemRepository.findByPlaylistId(playlistId);
  },

  // Update playlist item
  async updatePlaylistItem(id, itemData) {
    return playlistItemRepository.update(id, itemData);
  },

  // Update playlist item position
  async updateItemPosition(id, position) {
    return playlistItemRepository.update(id, { position });
  },

  // Reorder playlist items
  async reorderPlaylistItems(playlistId, itemOrders) {
    for (const { id, position } of itemOrders) {
      await this.updateItemPosition(id, position);
    }
    return { success: true };
  },

  // Delete playlist item
  async deletePlaylistItem(id) {
    return playlistItemRepository.remove(id);
  },
};

export default playlistItemService;