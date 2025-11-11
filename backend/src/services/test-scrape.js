import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeGoldPrice() {
  try {
    const response = await axios.get('https://www.logammulia.com/id/harga-emas-hari-ini', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const price = $('.price').first().text().trim();
    console.log('price', price);
  } catch (error) {
    console.error('Error scraping gold price:', error.message);
  }
}

scrapeGoldPrice();
