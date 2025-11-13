import { get, all, query } from '../db/index.js';

const newsRepository = {
  findAll: () => {
    return all('SELECT * FROM news ORDER BY publish_date DESC');
  },

  findById: (id) => {
    return get('SELECT * FROM news WHERE id = ?', [id]);
  },

  create: (newsItem) => {
    const { title, source, link, category, is_breaking, publish_date } = newsItem;
    const sql = `
      INSERT INTO news (title, source, link, category, is_breaking, publish_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = query(sql, [title, source, link, category, is_breaking, publish_date]);
    return { id: result.lastInsertRowid, ...newsItem };
  },

  update: (id, newsItem) => {
    const { title, source, link, category, is_breaking, publish_date } = newsItem;
    const sql = `
      UPDATE news
      SET title = ?, source = ?, link = ?, category = ?, is_breaking = ?, publish_date = ?
      WHERE id = ?
    `;
    query(sql, [title, source, link, category, is_breaking, publish_date, id]);
    return { id, ...newsItem };
  },

  delete: (id) => {
    return query('DELETE FROM news WHERE id = ?', [id]);
  },
};

export default newsRepository;
