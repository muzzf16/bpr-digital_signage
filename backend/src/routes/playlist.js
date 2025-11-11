import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve(process.cwd(), 'src', 'data', 'playlists.json');

// Get playlist by device ID
router.get('/:deviceId/playlist', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    const playlists = JSON.parse(data);
    const playlist = playlists.find(p => p.deviceId === deviceId);
    if (playlist) {
      res.json({ success: true, playlist });
    } else {
      res.status(404).json({ success: false, message: 'Playlist not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
