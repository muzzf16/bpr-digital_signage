import playlistRepository from '../repositories/playlistRepository.js';

// Playlist service functions
const playlistService = {
  // Create a new playlist
  async createPlaylist(playlistData) {
    return playlistRepository.create(playlistData);
  },

  // Get playlist by ID
  async getPlaylistById(id) {
    return playlistRepository.findById(id);
  },

  // Get playlist with items
  async getPlaylistWithItems(id) {
    return playlistRepository.findByIdWithItems(id);
  },

  // Get all playlists
  async getAllPlaylists() {
    return playlistRepository.findAll();
  },

  // Update playlist
  async updatePlaylist(id, playlistData) {
    return playlistRepository.update(id, playlistData);
  },

  // Delete playlist
  async deletePlaylist(id) {
    return playlistRepository.remove(id);
  },
};

export default playlistService;