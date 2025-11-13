import economicDataRepository from '../repositories/economicDataRepository.js';

const economicDataService = {
  getAllEconomicData: () => {
    return economicDataRepository.findAll();
  },

  getEconomicDataById: (id) => {
    return economicDataRepository.findById(id);
  },

  createEconomicData: (dataItem) => {
    return economicDataRepository.create(dataItem);
  },

  updateEconomicData: (id, dataItem) => {
    return economicDataRepository.update(id, dataItem);
  },

  deleteEconomicData: (id) => {
    return economicDataRepository.delete(id);
  },
};

export default economicDataService;
