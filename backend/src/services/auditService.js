import auditRepository from '../repositories/auditRepository.js';
import logger from './loggerService.js';

// Audit service functions
const auditService = {
  // Create a new audit log entry
  async createAuditLog(userId, entity, entityId, action, payload = null) {
    try {
      const result = await auditRepository.create({ userId, entity, entityId, action, payload });
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
      return auditRepository.find(filters);
    } catch (error) {
      console.error('Error getting audit logs:', error);
      logger.error('Error getting audit logs:', error);
      throw error;
    }
  },

  // Get audit log by ID
  async getAuditLogById(id) {
    try {
      return auditRepository.findById(id);
    } catch (error) {
      console.error('Error getting audit log by ID:', error);
      logger.error('Error getting audit log by ID:', error);
      throw error;
    }
  },
};

export default auditService;