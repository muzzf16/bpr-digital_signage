// backend/src/repositories/auditRepository.js
import { query, get, all } from '../db/index.js';

const auditRepository = {
  async create(auditData) {
    const { userId, entity, entityId, action, payload } = auditData;
    const sql = `
      INSERT INTO audit_logs (user_id, entity, entity_id, action, payload)
      VALUES (?, ?, ?, ?, ?)
    `;

    const payloadStr = payload ? JSON.stringify(payload) : null;
    const result = query(sql, [userId, entity, entityId, action, payloadStr]);
    return this.findById(result.lastInsertRowid);
  },

  async findById(id) {
    const sql = 'SELECT * FROM audit_logs WHERE id = ?';
    return get(sql, [id]);
  },

  async find(filters = {}) {
    let sql = 'SELECT * FROM audit_logs';
    const params = [];

    const conditions = [];
    if (filters.userId) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.entity) {
      conditions.push('entity = ?');
      params.push(filters.entity);
    }

    if (filters.entityId) {
      conditions.push('entity_id = ?');
      params.push(filters.entityId);
    }

    if (filters.action) {
      conditions.push('action = ?');
      params.push(filters.action);
    }

    if (filters.startDate) {
      conditions.push('created_at >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('created_at <= ?');
      params.push(filters.endDate);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    return all(sql, params);
  },
};

export default auditRepository;
