import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve(process.cwd(), 'src', 'data', 'playlists.json');

// Get all playlists
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const playlists = JSON.parse(data);
    res.json({ success: true, playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new playlist
router.post('/', async (req, res) => {
  try {
    const newPlaylist = req.body;
    const data = await fs.readFile(dataPath, 'utf-8');
    const playlists = JSON.parse(data);
    playlists.push(newPlaylist);
    await fs.writeFile(dataPath, JSON.stringify(playlists, null, 2));
    res.json({ success: true, playlist: newPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a playlist by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    const playlists = JSON.parse(data);
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      res.json({ success: true, playlist });
    } else {
      res.status(404).json({ success: false, message: 'Playlist not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a playlist by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlaylist = req.body;
    const data = await fs.readFile(dataPath, 'utf-8');
    let playlists = JSON.parse(data);
    playlists = playlists.map(p => (p.id === id ? updatedPlaylist : p));
    await fs.writeFile(dataPath, JSON.stringify(playlists, null, 2));
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a playlist by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    let playlists = JSON.parse(data);
    playlists = playlists.filter(p => p.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(playlists, null, 2));
    res.json({ success: true, message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
