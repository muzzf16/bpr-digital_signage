// Test script to verify all modules can be imported without errors (without starting the server)
import './src/db/index.js';
import './src/services/assetService.js';
import './src/services/productService.js';
import './src/services/promoService.js';
import './src/services/playlistService.js';
import './src/services/playlistItemService.js';
import './src/services/deviceService.js';
import './src/services/announcementService.js';
import './src/routes/uploads.js';
import './src/routes/devices.js';
import './src/routes/auth.js';
import './src/utils/auth.js';

console.log('All modules imported successfully with SQLite implementation!');