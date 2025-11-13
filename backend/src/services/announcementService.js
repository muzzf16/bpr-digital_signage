import announcementRepository from '../repositories/announcementRepository.js';

// Announcement service functions
const announcementService = {
  // Create a new announcement
  async createAnnouncement(announcementData) {
    return announcementRepository.create(announcementData);
  },

  // Get active announcements by priority (active now and ordered by priority)
  async getActiveAnnouncements() {
    return announcementRepository.findActive();
  },

  // Get announcement by ID
  async getAnnouncementById(id) {
    return announcementRepository.findById(id);
  },

  // Get all announcements
  async getAllAnnouncements() {
    return announcementRepository.findAll();
  },

  // Update announcement
  async updateAnnouncement(id, announcementData) {
    return announcementRepository.update(id, announcementData);
  },

  // Delete announcement
  async deleteAnnouncement(id) {
    return announcementRepository.remove(id);
  },
};

export default announcementService;