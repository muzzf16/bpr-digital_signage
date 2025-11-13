import { get, all, query } from '../db/index.js';

const displaySettingsRepository = {
  findAll: () => {
    return all('SELECT * FROM display_settings');
  },

  findByKey: (key) => {
    return get('SELECT * FROM display_settings WHERE key = ?', [key]);
  },

  create: (setting) => {
    const { key, value } = setting;
    const sql = `
      INSERT INTO display_settings (key, value)
      VALUES (?, ?)
    `;
    const result = query(sql, [key, value]);
    return { id: result.lastInsertRowid, ...setting };
  },

  update: (key, value) => {
    const sql = `
      UPDATE display_settings
      SET value = ?
      WHERE key = ?
    `;
    query(sql, [value, key]);
    return { key, value };
  },

  upsert: (key, value) => {
    const existing = get('SELECT * FROM display_settings WHERE key = ?', [key]);
    if (existing) {
      return displaySettingsRepository.update(key, value);
    } else {
      return displaySettingsRepository.create({ key, value });
    }
  },

  delete: (key) => {
    return query('DELETE FROM display_settings WHERE key = ?', [key]);
  },
};

export default displaySettingsRepository;
