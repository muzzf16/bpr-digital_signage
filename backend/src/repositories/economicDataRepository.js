import { get, all, query } from '../db/index.js';

const economicDataRepository = {
  findAll: () => {
    return all('SELECT * FROM economic_data ORDER BY date DESC');
  },

  findById: (id) => {
    return get('SELECT * FROM economic_data WHERE id = ?', [id]);
  },

  create: (dataItem) => {
    const { type, key, value, date, notes } = dataItem;
    const sql = `
      INSERT INTO economic_data (type, key, value, date, notes)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = query(sql, [type, key, value, date, notes]);
    return { id: result.lastInsertRowid, ...dataItem };
  },

  update: (id, dataItem) => {
    const { type, key, value, date, notes } = dataItem;
    const sql = `
      UPDATE economic_data
      SET type = ?, key = ?, value = ?, date = ?, notes = ?
      WHERE id = ?
    `;
    query(sql, [type, key, value, date, notes, id]);
    return { id, ...dataItem };
  },

  delete: (id) => {
    return query('DELETE FROM economic_data WHERE id = ?', [id]);
  },
};

export default economicDataRepository;
