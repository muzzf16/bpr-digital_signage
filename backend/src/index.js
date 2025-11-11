import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import economicRouter from './routes/economic.js';
import adminAnnouncementsRouter from './routes/admin/announcements.js';
import adminAssetsRouter from './routes/admin/assets.js';
import adminAuditRouter from './routes/admin/audit.js';
import adminCompaniesRouter from './routes/admin/companies.js';
import adminDevicesRouter from './routes/admin/devices.js';
import adminDeviceStatusRouter from './routes/admin/deviceStatus.js';
import adminPlaylistsRouter from './routes/admin/playlists.js';
import adminPromosRouter from './routes/admin/promos.js';
import adminRatesRouter from './routes/admin/rates.js';
import playlistRouter from './routes/playlist.js';
import uploadsRouter from './routes/uploads.js';
import devicesRouter from './routes/devices.js';
import authRouter from './routes/auth.js';
import { authenticateJWT } from './utils/auth.js';

// Constants
const PORT = process.env.PORT || 4000;
const ASSETS_PATH = 'assets';
const API_KEY = process.env.API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API key middleware
app.use((req, res, next) => {
  const key = req.headers['x-api-key'] || req.query.api_key;
  
  // Check if this is an admin route that requires JWT
  const isAdminRoute = req.path.startsWith('/api/admin');
  
  if (isAdminRoute) {
    // For admin routes, use the JWT middleware
    authenticateJWT(req, res, next);
  } else {
    // Device routes require API key
    if (!key || key !== API_KEY) {
      // Allow access to root and assets without API key
      if (req.path === '/' || req.path.startsWith(`/${ASSETS_PATH}`)) {
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing or invalid API key'
      });
    }
    next();
  }
});

// Static assets
app.use(`/${ASSETS_PATH}`, express.static(path.join(__dirname, '..', ASSETS_PATH)));
app.use('/public/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api/auth', authRouter); // Authentication routes
app.use('/api/devices', devicesRouter); // Updated to use new devices router
app.use('/api/uploads', uploadsRouter); // New uploads route
app.use('/api/admin/announcements', adminAnnouncementsRouter);
app.use('/api/admin/assets', adminAssetsRouter);
app.use('/api/admin/audit', adminAuditRouter);
app.use('/api/admin/companies', adminCompaniesRouter);
app.use('/api/admin/devices', adminDevicesRouter);
app.use('/api/admin/device-status', adminDeviceStatusRouter);
app.use('/api/admin/playlists', adminPlaylistsRouter);
app.use('/api/admin/promos', adminPromosRouter);
app.use('/api/admin/rates', adminRatesRouter);
app.use('/api/economic', economicRouter);
app.use('/api/playlist', playlistRouter); // Keep existing route for compatibility
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BPR Signage Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/devices/:deviceId/playlist',
      '/api/economic',
      '/api/uploads',
      '/api/admin/*'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`BPR Signage Backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

export default app;