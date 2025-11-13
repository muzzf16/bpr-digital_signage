import promoRepository from '../repositories/promoRepository.js';

// Promo service functions
const promoService = {
  // Create a new promo
  async createPromo(promoData) {
    return promoRepository.create(promoData);
  },

  // Get promo by ID
  async getPromoById(id) {
    return promoRepository.findById(id);
  },

  // Get all published promos
  async getAllPromos() {
    return promoRepository.findAll();
  },

  // Update promo
  async updatePromo(id, promoData) {
    return promoRepository.update(id, promoData);
  },

  // Delete promo
  async deletePromo(id) {
    return promoRepository.remove(id);
  },
};

export default promoService;