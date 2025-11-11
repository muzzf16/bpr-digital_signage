import db, { query, get, all } from '../db/index.js';
import logger from './loggerService.js';

// Audit service functions
const auditService = {
  // Create a new audit log entry
  async createAuditLog(userId, entity, entityId, action, payload = null) {
    try {
      const sql = `
        INSERT INTO audit_logs (user_id, entity, entity_id, action, payload)
        VALUES (?, ?, ?, ?, ?)
      `;

      const payloadStr = payload ? JSON.stringify(payload) : null;
      const result = query(sql, [userId, entity, entityId, action, payloadStr]);
      
      // Log to application logs as well
      logger.info(`Audit log created: ${action} on ${entity} ${entityId} by user ${userId}`);
      
      return result;
    } catch (error) {
      console.error('Error creating audit log:', error);
      logger.error('Error creating audit log:', error);
      throw error;
    }
  },

  // Get audit logs with optional filters
  async getAuditLogs(filters = {}) {
    try {
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
    } catch (error) {
      console.error('Error getting audit logs:', error);
      logger.error('Error getting audit logs:', error);
      throw error;
    }
  },

  // Get audit log by ID
  async getAuditLogById(id) {
    try {
      const sql = 'SELECT * FROM audit_logs WHERE id = ?';
      return get(sql, [id]);
    } catch (error) {
      console.error('Error getting audit log by ID:', error);
      logger.error('Error getting audit log by ID:', error);
      throw error;
    }
  }
};

export default auditService;