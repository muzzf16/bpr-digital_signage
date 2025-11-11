import express from 'express';
import deviceService from '../../services/deviceService.js';
import auditService from '../../services/auditService.js';

const router = express.Router();

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.json({ success: true, devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new device
router.post('/', async (req, res) => {
  try {
    const newDevice = req.body;
    const device = await deviceService.createDevice(newDevice);
    
    // Log the creation
    await auditService.createAuditLog(
      req.user?.id || 'system', 
      'device', 
      device.id, 
      'CREATE', 
      { device: newDevice }
    );
    
    res.status(201).json({ success: true, device });
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a device by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceService.getDeviceById(id);
    if (device) {
      res.json({ success: true, device });
    } else {
      res.status(404).json({ success: false, message: 'Device not found' });
    }
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a device by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDevice = req.body;
    const device = await deviceService.updateDevice(id, updatedDevice);
    if (device) {
      // Log the update
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'device', 
        device.id, 
        'UPDATE', 
        { updates: updatedDevice }
      );
      
      res.json({ success: true, device });
    } else {
      res.status(404).json({ success: false, message: 'Device not found' });
    }
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a device by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceService.deleteDevice(id);
    if (device) {
      // Log the deletion
      await auditService.createAuditLog(
        req.user?.id || 'system', 
        'device', 
        device.id, 
        'DELETE', 
        { deletedDevice: device }
      );
      
      res.json({ success: true, message: 'Device deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Device not found' });
    }
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;