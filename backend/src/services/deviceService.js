import deviceRepository from '../repositories/deviceRepository.js';

// Device service functions
const deviceService = {
  // Create a new device
  async createDevice(deviceData) {
    return deviceRepository.create(deviceData);
  },

  // Get device by ID
  async getDeviceById(id) {
    return deviceRepository.findById(id);
  },

  // Get all devices
  async getAllDevices() {
    return deviceRepository.findAll();
  },

  // Update device
  async updateDevice(id, deviceData) {
    return deviceRepository.update(id, deviceData);
  },

  // Update device last seen
  async updateDeviceLastSeen(id) {
    return deviceRepository.update(id, { last_seen: new Date().toISOString() });
  },

  // Delete device
  async deleteDevice(id) {
    return deviceRepository.remove(id);
  },

  // Assign playlist to device
  async assignPlaylistToDevice(deviceId, playlistId) {
    const result = await deviceRepository.update(deviceId, { playlist_id: playlistId });
    return result;
  },
};

export default deviceService;