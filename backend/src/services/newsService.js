import RSSParser from 'rss-parser';
import { cached } from './cacheService.js';

// Constants
const DEFAULT_NEWS_REFRESH_SECONDS = 900; // 15 minutes
const DEFAULT_NEWS_FEED_URL = 'https://www.cnbcindonesia.com/market/rss/';
const MAX_NEWS_ITEMS_PER_FEED = 8;
const MAX_TOTAL_NEWS_ITEMS = 12;

const parser = new RSSParser();

/**
 * Get cached news
 * @returns {array} Array of news items
 */
async function getNews() {
  const refreshSeconds = Number(process.env.REFRESH_NEWS_SECONDS || DEFAULT_NEWS_REFRESH_SECONDS);
  return cached('newsFeed', refreshSeconds, async () => {
    const feedUrls = (process.env.NEWS_FEEDS || DEFAULT_NEWS_FEED_URL)
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    const items = [];
    
    for (const feedUrl of feedUrls) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const source = feed.title || feedUrl;
        
        // Take only the most recent items from each feed to avoid one feed dominating
        const feedItems = feed.items
          .slice(0, MAX_NEWS_ITEMS_PER_FEED)
          .map(item => ({
            title: item.title,
            link: item.link,
            source,
            pubDate: item.pubDate
          }));
        
        items.push(...feedItems);
      } catch (error) {
        console.warn('RSS fetch failed for URL:', feedUrl, 'Error:', error.message);
      }
    }
    
    // Sort by publication date (newest first)
    items.sort((a, b) => {
      const dateA = new Date(b.pubDate || 0).getTime();
      const dateB = new Date(a.pubDate || 0).getTime();
      return dateA - dateB;
    });
    
    // Return only the most recent items
    return items.slice(0, MAX_TOTAL_NEWS_ITEMS);
  });
}

export { getNews };