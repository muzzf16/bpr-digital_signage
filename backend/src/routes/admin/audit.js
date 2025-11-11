import express from 'express';
import auditService from '../../services/auditService.js';

const router = express.Router();

// Get audit logs with optional filters
router.get('/', async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      entity: req.query.entity,
      entityId: req.query.entityId,
      action: req.query.action,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };

    const logs = await auditService.getAuditLogs(filters);
    res.json({ success: true, logs, count: logs.length });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get audit log by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const log = await auditService.getAuditLogById(id);
    if (log) {
      res.json({ success: true, log });
    } else {
      res.status(404).json({ success: false, message: 'Audit log not found' });
    }
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;