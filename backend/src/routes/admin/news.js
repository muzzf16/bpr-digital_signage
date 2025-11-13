import express from 'express';
import newsService from '../../services/newsService.js';

const router = express.Router();

// GET /api/admin/news - Get all news items
router.get('/', (req, res) => {
  try {
    const newsItems = newsService.getAllNews();
    res.json({ success: true, news: newsItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch news items' });
  }
});

// GET /api/admin/news/:id - Get a single news item by ID
router.get('/:id', (req, res) => {
  try {
    const newsItem = newsService.getNewsById(req.params.id);
    if (newsItem) {
      res.json({ success: true, news: newsItem });
    } else {
      res.status(404).json({ success: false, message: 'News item not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch news item' });
  }
});

// POST /api/admin/news - Create a new news item
router.post('/', (req, res) => {
  try {
    const newNewsItem = newsService.createNews(req.body);
    res.status(201).json({ success: true, news: newNewsItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create news item' });
  }
});

// PUT /api/admin/news/:id - Update a news item
router.put('/:id', (req, res) => {
  try {
    const updatedNewsItem = newsService.updateNews(req.params.id, req.body);
    res.json({ success: true, news: updatedNewsItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update news item' });
  }
});

// DELETE /api/admin/news/:id - Delete a news item
router.delete('/:id', (req, res) => {
  try {
    newsService.deleteNews(req.params.id);
    res.json({ success: true, message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete news item' });
  }
});

export default router;
