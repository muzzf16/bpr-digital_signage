// Test device service functionality
import deviceService from './src/services/deviceService.js';

async function testDeviceService() {
  console.log('Testing device service...');
  
  try {
    // First, make sure the demo device exists
    await import('./setup-demo.js');
    
    // Get the demo device
    const device = await deviceService.getDeviceById('demo-tv-01');
    console.log('✓ Retrieved demo device:', device.name);
    
    // Update last seen
    const updatedDevice = await deviceService.updateDeviceLastSeen('demo-tv-01');
    console.log('✓ Updated last seen:', updatedDevice.last_seen);
    
    console.log('\n✓ Device service test completed successfully!');
  } catch (error) {
    console.error('✗ Device service test failed:', error.message);
  }
}

testDeviceService();