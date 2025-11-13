import displaySettingsRepository from '../repositories/displaySettingsRepository.js';

const displaySettingsService = {
  getAllSettings: () => {
    const settings = displaySettingsRepository.findAll();
    // Convert array of objects to a single object
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  },

  getSetting: (key) => {
    return displaySettingsRepository.findByKey(key);
  },

  updateSettings: (settings) => {
    for (const key in settings) {
      displaySettingsRepository.upsert(key, settings[key]);
    }
    return displaySettingsService.getAllSettings();
  },
};

export default displaySettingsService;
