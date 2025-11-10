import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import playlistRouter from './routes/playlist.js';
import ratesRouter from './routes/rates.js';
import economicRouter from './routes/economic.js';

// Constants
const PORT = process.env.PORT || 4000;
const ASSETS_PATH = 'assets';
const API_KEY = process.env.API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API key middleware
app.use((req, res, next) => {
  const key = req.headers['x-api-key'] || req.query.api_key;
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
});

// Static assets
app.use(`/${ASSETS_PATH}`, express.static(path.join(__dirname, '..', ASSETS_PATH)));

// Routes
app.use('/api/devices', playlistRouter);
app.use('/api/rates', ratesRouter);
app.use('/api/economic', economicRouter);

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BPR Signage Backend API',
    version: '1.0.0',
    endpoints: ['/api/devices', '/api/rates', '/api/economic']
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