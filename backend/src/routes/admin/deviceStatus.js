import express from 'express';
import deviceService from '../../services/deviceService.js';

const router = express.Router();

// SSE endpoint for real-time device status updates
router.get('/status-stream', async (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Send initial data
  const devices = await deviceService.getAllDevices();
  res.write(`data: ${JSON.stringify({ type: 'INITIAL', devices })}\n\n`);

  // Store interval ID to clear later
  const intervalId = setInterval(async () => {
    try {
      // Get latest device data
      const updatedDevices = await deviceService.getAllDevices();
      res.write(`data: ${JSON.stringify({ type: 'UPDATE', devices: updatedDevices })}\n\n`);
    } catch (error) {
      console.error('Error sending device status update:', error);
    }
  }, 30000); // Update every 30 seconds

  // Clear interval when connection closes
  req.on('close', () => {
    clearInterval(intervalId);
  });

  // Send updates for any device changes
  // Note: In a production environment, you'd want to use a pub/sub pattern to send updates only when needed
  // For now, this will send updates every 30 seconds
});

export default router;