import assetRepository from '../repositories/assetRepository.js';

// Asset service functions
const assetService = {
  // Create a new asset record
  async createAsset(assetData) {
    return assetRepository.create(assetData);
  },

  // Get asset by ID
  async getAssetById(id) {
    return assetRepository.findById(id);
  },

  // Get all assets
  async getAllAssets() {
    return assetRepository.findAll();
  },

  // Update asset
  async updateAsset(id, assetData) {
    return assetRepository.update(id, assetData);
  },

  // Delete asset
  async deleteAsset(id) {
    return assetRepository.remove(id);
  },
};

export default assetService;