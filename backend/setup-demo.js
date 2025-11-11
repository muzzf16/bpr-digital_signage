import db from './src/db/index.js';
import deviceService from './src/services/deviceService.js';

async function setupDemoData() {
  try {
    console.log('Setting up demo data...');
    
    // Create a default playlist if it doesn't exist
    const playlistExists = db.prepare('SELECT * FROM playlists WHERE id = ?').get([1]);
    if (!playlistExists) {
      db.prepare('INSERT INTO playlists (id, name) VALUES (?, ?)').run([1, 'Default Demo Playlist']);
      console.log('Created default playlist');
    }
    
    // Create a default device for demo purposes
    const demoDevice = {
      id: 'demo-tv-01',
      name: 'Demo TV Display',
      location: 'Main Lobby',
      playlist_id: 1,  // Default playlist ID
      status: JSON.stringify({ online: true, version: '1.0.0' })
    };
    
    // Check if the device already exists
    const existingDevice = await deviceService.getDeviceById('demo-tv-01');
    if (existingDevice) {
      console.log('Demo device already exists');
    } else {
      // Create the demo device
      await deviceService.createDevice(demoDevice);
      console.log('Created demo device: demo-tv-01');
    }
    
    // Create demo playlist items if they don't exist
    const itemsExist = db.prepare('SELECT COUNT(*) as count FROM playlist_items WHERE playlist_id = ?').get([1]);
    if (itemsExist.count === 0) {
      // Insert sample playlist items
      const items = [
        { playlist_id: 1, position: 1, item_type: 'image', item_ref: 'demo.jpg', metadata: JSON.stringify({ url: '/assets/demo.jpg' }), duration_sec: 12, active: 1 },
        { playlist_id: 1, position: 2, item_type: 'product', item_ref: 'tabungan-simapanas', duration_sec: 10, active: 1 },
        { playlist_id: 1, position: 3, item_type: 'promos', item_ref: '1', duration_sec: 15, active: 1 },
        { playlist_id: 1, position: 4, item_type: 'economic', duration_sec: 20, active: 1 }
      ];
      
      for (const item of items) {
        db.prepare(`
          INSERT INTO playlist_items (playlist_id, position, item_type, item_ref, metadata, duration_sec, active)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run([
          item.playlist_id,
          item.position,
          item.item_type,
          item.item_ref,
          item.metadata || null,
          item.duration_sec,
          item.active
        ]);
      }
      console.log('Created demo playlist items');
    }
    
    // Create a demo product if it doesn't exist
    const productExists = db.prepare('SELECT * FROM products WHERE id = ?').get(['tabungan-simapanas']);
    if (!productExists) {
      db.prepare(`
        INSERT INTO products (id, name, interest_rate, currency, published) 
        VALUES (?, ?, ?, ?, ?)
      `).run(['tabungan-simapanas', 'Tabungan Simapanas', 4.25, 'IDR', 1]);
      console.log('Created demo product');
    }
    
    console.log('Demo data setup complete!');
  } catch (error) {
    console.error('Error setting up demo data:', error.message);
  } finally {
    db.close();
  }
}

setupDemoData();