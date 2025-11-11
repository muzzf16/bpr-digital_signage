import axios from 'axios';
import xml2js from 'xml2js';
import * as cheerio from 'cheerio';
import { cached } from './cacheService.js';
import mockData from '../data/mock.js';

// Constants
const DEFAULT_CURRENCY_REFRESH_SECONDS = 3600; // 1 hour
const DEFAULT_GOLD_REFRESH_SECONDS = 1800;     // 30 minutes
const DEFAULT_STOCK_REFRESH_SECONDS = 1800;    // 30 minutes

/**
 * Call Bank Indonesia SOAP service
 * @param {string} dateStr - Date string in format YYYY-MM-DD
 * @returns {object} Currency rates from BI
 */
async function callBiSoap(dateStr) {
  if (!process.env.BI_WS_URL || !process.env.BI_SOAP_ACTION || !process.env.BI_SOAP_BODY_TEMPLATE) {
    throw new Error('BI SOAP config not provided');
  }
  
  const soapBody = process.env.BI_SOAP_BODY_TEMPLATE.replace(/\{DATE\}/g, dateStr);
  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': process.env.BI_SOAP_ACTION
  };
  
  const res = await axios.post(process.env.BI_WS_URL, soapBody, { headers });
  if (res.status !== 200) throw new Error(`BI SOAP returned ${res.status}`);
  
  const text = res.data;
  const parsed = await xml2js.parseStringPromise(text, { explicitArray: false, ignoreAttrs: true });
  
  // NOTE: Actual parsing logic is needed here based on the SOAP response structure
  // This is a placeholder as the original code also had a "not auto-configured" error.
  if (parsed && parsed['soap:Envelope'] && parsed['soap:Envelope']['soap:Body']) {
      // A mock parsing based on a potential structure. This will likely need adjustment.
      const result = parsed['soap:Envelope']['soap:Body']['GetKursOnDateResponse']['GetKursOnDateResult'];
      if (result && result.Rate && result.Rate.USD) {
          return {
              USD: parseFloat(result.Rate.USD.Jual),
              source: 'BI SOAP',
              fetchedAt: new Date().toISOString()
          };
      }
  }
  throw new Error('BI SOAP response parsing failed. Response structure might have changed.');
}

/**
 * Fetch from Bank Indonesia
 * @returns {object|null} Currency rates or null if not available
 */
async function fetchFromBI() {
  if (!process.env.BI_WS_URL) return null;
  const date = new Date().toISOString().slice(0, 10);
  return await callBiSoap(date);
}

/**
 * Fetch from BCA
 * @returns {object|null} Currency rates or null if not available
 */
async function fetchFromBCA() {
  if (!process.env.BCA_RATES_URL) return null;
  
  try {
    const response = await axios.get(process.env.BCA_RATES_URL);
    if (response.status !== 200) {
      console.warn(`BCA service returned ${response.status}`);
      return null;
    }
    
    const html = response.data;
    const $ = cheerio.load(html);
    const rates = {};

    $('table.m-table-kurs tbody tr').each((i, el) => {
      const currency = $(el).find('td:nth-child(1)').text().trim();
      const eRateJual = $(el).find('td:nth-child(2)').text().trim();
      const eRateBeli = $(el).find('td:nth-child(3)').text().trim();

      if (currency && eRateJual && eRateBeli) {
        rates[currency] = {
          jual: parseFloat(eRateJual.replace(/\./g, '').replace(',', '.')),
          beli: parseFloat(eRateBeli.replace(/\./g, '').replace(',', '.'))
        };
      }
    });
    
    if (rates.USD) {
      return { 
        USD: rates.USD.jual, 
        SGD: rates.SGD?.jual || null, 
        JPY: rates.JPY?.jual || null, 
        source: 'BCA', 
        fetchedAt: new Date().toISOString() 
      };
    }
  } catch (error) {
    console.warn('BCA API error:', error.message);
  }
  
  return null;
}

/**
 * Fetch from custom exchange API
 * @returns {object|null} Currency rates or null if not available
 */
async function fetchFromExchangeAPI() {
  if (!process.env.EXCHANGE_API_URL) return null;
  
  try {
    const response = await axios.get(process.env.EXCHANGE_API_URL);
    if (response.status === 200) {
      const rates = response.data;
      return { ...rates, source: 'custom-exchange', fetchedAt: new Date().toISOString() };
    }
  } catch (error) {
    console.warn('Custom exchange API error:', error.message);
  }
  
  return null;
}

/**
 * Fetch from ExchangeRate.host
 * @returns {object} Currency rates
 */
async function fetchFromExchangeRateHost() {
  try {
    const response = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=IDR,SGD,JPY,EUR');
    if (response.status !== 200) throw new Error('exchangerate.host failed');
    
    const json = response.data;
    return {
      USD: json.rates?.IDR ? Math.round(json.rates.IDR) : null,
      SGD: json.rates?.SGD ? Math.round(1 / json.rates.SGD * json.rates.IDR) : null,
      JPY: json.rates?.JPY ? Number((1 / json.rates.JPY * json.rates.IDR).toFixed(4)) : null,
      EUR: json.rates?.EUR ? Math.round(1 / json.rates.EUR * json.rates.IDR) : null,
      source: 'exchangerate.host', 
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('ExchangeRate.host error:', error.message);
    throw error;
  }
}

/**
 * Fetch currency rates from providers in order of preference
 * @returns {object} Currency rates
 */
async function _fetchCurrencyRates() {
  const providers = [
    fetchFromBI,
    fetchFromBCA,
    fetchFromExchangeAPI,
    fetchFromExchangeRateHost,
  ];

  for (const provider of providers) {
    try {
      const rates = await provider();
      if (rates && rates.USD) {
        console.log(`[Currency Provider] Success: ${provider.name}`);
        return rates;
      }
    } catch (error) {
      console.warn(`[Currency Provider] ${provider.name} failed: ${error.message}`);
    }
  }

  console.warn('[Currency Provider] All providers failed. Returning mock data.');
  return { 
    USD: mockData.economic.currencyRates.USD, 
    SGD: mockData.economic.currencyRates.SGD, 
    JPY: mockData.economic.currencyRates.JPY, 
    EUR: mockData.economic.currencyRates.EUR, 
    source: 'mock', 
    fetchedAt: new Date().toISOString() 
  };
}

/**
 * Get cached currency rates
 * @returns {object} Currency rates
 */
async function getCurrencyRates() {
  const refreshSeconds = Number(process.env.REFRESH_CURRENCY_SECONDS || DEFAULT_CURRENCY_REFRESH_SECONDS);
  return cached('currencyRates', refreshSeconds, _fetchCurrencyRates);
}

/**
 * Get cached gold price
 * @returns {object} Gold price
 */
async function getGoldPrice() {
  const refreshSeconds = Number(process.env.REFRESH_GOLD_SECONDS || DEFAULT_GOLD_REFRESH_SECONDS);
  return cached('goldPrice', refreshSeconds, async () => {
    // Try API-based approach first
    try {
      if (process.env.GOLD_API_KEY) {
        const headers = {
          'x-access-token': process.env.GOLD_API_KEY,
          'Content-Type': 'application/json'
        };
        const response = await axios.get('https://www.goldapi.io/api/XAU/IDR', { headers });
        if (response.status === 200 && response.data && response.data.price_gram) {
          return {
            gram: response.data.price_gram,
            ounce: response.data.price_ounce,
            fetchedAt: new Date().toISOString(),
            source: 'goldapi.io'
          };
        }
      }
    } catch (error) {
      console.warn('GoldAPI service error:', error.message);
    }

    // Fallback to web scraping
    try {
      const response = await axios.get('https://emasantam.id/harga-emas-antam-harian/');
      const html = response.data;

      const regex1Gram = /Harga Emas 1 gram.*?Rp\.\s*([\d\.]+)/;
      const regexPrevious = /Harga Sebelumnya.*?Rp\.\s*([\d\.]+)/;

      const match1Gram = html.match(regex1Gram);
      const matchPrevious = html.match(regexPrevious);

      let gramPrice = null;
      let previousPrice = null;

      if (match1Gram && match1Gram[1]) {
        gramPrice = parseFloat(match1Gram[1].replace(/\./g, ''));
      }

      if (matchPrevious && matchPrevious[1]) {
        previousPrice = parseFloat(matchPrevious[1].replace(/\./g, ''));
      }

      if (gramPrice) {
        return { 
          gram: gramPrice, 
          ounce: gramPrice * 31.1034768, // Approximate conversion
          previous: previousPrice,
          fetchedAt: new Date().toISOString(), 
          source: 'emasantam.id' 
        };
      }
    } catch (error) {
      console.warn('EmasAntam scraping error:', error.message);
    }

    return { 
      gram: mockData.economic.goldPrice.gram, 
      ounce: mockData.economic.goldPrice.ounce, 
      source: 'mock', 
      fetchedAt: new Date().toISOString() 
    };
  });
}

/**
 * Get cached stock index
 * @returns {object} Stock index data
 */
async function getStockIndex() {
  const refreshSeconds = Number(process.env.REFRESH_STOCK_SECONDS || DEFAULT_STOCK_REFRESH_SECONDS);
  return cached('stockIndex', refreshSeconds, async () => {
    // Try API-based approach first
    try {
      if (process.env.YAHOO_FINANCE_API_URL) {
        const response = await axios.get(`${process.env.YAHOO_FINANCE_API_URL}/v6/finance/quote?symbols=JKSE.JK`);
        if (response.status === 200 && response.data && response.data.quoteResponse?.result?.length > 0) {
          const result = response.data.quoteResponse.result[0];
          return {
            symbol: result.symbol,
            name: 'IHSG',
            price: result.regularMarketPrice,
            change: result.regularMarketChange,
            changePercent: result.regularMarketChangePercent,
            fetchedAt: new Date().toISOString(),
            source: 'yahoo.finance'
          };
        }
      }
    } catch (error) {
      console.warn('Yahoo Finance API error:', error.message);
    }

    // Alternative API approach
    try {
      const response = await axios.get('https://api.stockdata.org/v1/data/quote?symbols=JKSE.JK&api_token=' + (process.env.STOCKDATA_API_TOKEN || ''));
      if (response.status === 200 && response.data && response.data.data?.length > 0) {
        const result = response.data.data[0];
        return {
          symbol: result.symbol,
          name: 'IHSG',
          price: result.price,
          change: result.change,
          changePercent: result.change_percent,
          fetchedAt: new Date().toISOString(),
          source: 'stockdata.org'
        };
      }
    } catch (error) {
      console.warn('StockData.org API error:', error.message);
    }
    
    // Fallback to web scraping - improved selectors
    try {
      const response = await axios.get('https://www.google.com/finance/quote/COMPOSITE:IDX');
      const html = response.data;
      const $ = cheerio.load(html);

      // Try multiple selector patterns for price
      const selectors = [
        'div[data-entity-id="COMPOSITE:IDX"] div[data-source="COMPOSITE (IDX)"]:first',
        'div[data-entity-id="COMPOSITE:IDX"] div[data-source="COMPOSITE (IDX)"] > span',
        'div[data-entity-id="COMPOSITE:IDX"] > div > div > div > span',
        'div[data-entity-id="COMPOSITE:IDX"] .YMlKec.fxKbKc',
        '[data-entity-id="COMPOSITE:IDX"] .IsqQVc.NprOob.XWZjwc',
        '[data-entity-id="COMPOSITE:IDX"] .IsqQVc span'
      ];
      
      let price = '';
      for (const selector of selectors) {
        price = $(selector).first().text().trim();
        if (price) break;
      }

      // Try multiple selector patterns for change
      const changeSelectors = [
        'div[data-entity-id="COMPOSITE:IDX"] .P2LhUc span[data-is-arrow]',
        'div[data-entity-id="COMPOSITE:IDX"] .P2LhUy span.JwB6zf',
        'div[data-entity-id="COMPOSITE:IDX"] .P2LhUy span',
        '[data-entity-id="COMPOSITE:IDX"] .gNCpzf span'
      ];
      
      let change = '';
      for (const selector of changeSelectors) {
        change = $(selector).first().text().trim();
        if (change) break;
      }

      if (price && change) {
        return {
          symbol: 'COMPOSITE',
          name: 'IHSG',
          price: parseFloat(price.replace(/,/g, '').replace(/[^\d.-]/g, '')),
          change: change,
          fetchedAt: new Date().toISOString(),
          source: 'google.com/finance'
        };
      }
    } catch (error) {
      console.warn('Google Finance scraping error:', error.message);
    }

    // Another fallback - using Yahoo Finance directly
    try {
      const response = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/^JKSE?interval=1d');
      if (response.status === 200 && response.data?.chart?.result?.length > 0) {
        const result = response.data.chart.result[0];
        const price = result.meta.regularMarketPrice;
        const previousClose = result.meta.previousClose;
        const change = price - previousClose;
        const changePercent = (change / previousClose) * 100;

        return {
          symbol: '^JKSE',
          name: 'IHSG',
          price: price,
          change: change.toFixed(2),
          changePercent: changePercent.toFixed(2) + '%',
          fetchedAt: new Date().toISOString(),
          source: 'yahoo.finance.chart'
        };
      }
    } catch (error) {
      console.warn('Yahoo Finance chart API error:', error.message);
    }

    return {
      symbol: '^JKSE',
      name: 'IHSG',
      price: mockData.economic.stockIndex.IHSG,
      change: mockData.economic.stockIndex.Change,
      fetchedAt: new Date().toISOString(),
      source: 'mock'
    };
  });
}

export { getCurrencyRates, getGoldPrice, getStockIndex };