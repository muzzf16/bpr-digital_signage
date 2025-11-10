import fetch from 'node-fetch';
import xml2js from 'xml2js';
import { cached } from './cacheService.js';

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
  
  const res = await fetch(process.env.BI_WS_URL, { method: 'POST', body: soapBody, headers });
  if (!res.ok) throw new Error(`BI SOAP returned ${res.status}`);
  
  const text = await res.text();
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
    const response = await fetch(process.env.BCA_RATES_URL);
    if (!response.ok) {
      console.warn(`BCA service returned ${response.status}`);
      return null;
    }
    
    const json = await response.json();
    const rows = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
    const rates = {};
    
    for (const row of rows) {
      const code = (row.currency || row.code || '').toUpperCase();
      if (!code) continue;
      const val = (row.eRate && row.eRate.sell) || (row.eRate && row.eRate.buy) || null;
      if (val) rates[code] = Number(String(val).replace(/[, ]/g, ''));
    }
    
    if (rates.USD) {
      return { 
        USD: rates.USD, 
        SGD: rates.SGD || null, 
        JPY: rates.JPY || null, 
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
    const response = await fetch(process.env.EXCHANGE_API_URL);
    if (response.ok) {
      const rates = await response.json();
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
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=IDR,SGD,JPY,EUR');
    if (!response.ok) throw new Error('exchangerate.host failed');
    
    const json = await response.json();
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
    USD: 15600, 
    SGD: 11600, 
    JPY: 105.3, 
    EUR: 17000, 
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
    if (process.env.GOLD_API_KEY) {
      try {
        const response = await fetch('https://www.goldapi.io/api/XAU/IDR', { 
          headers: { 'x-access-token': process.env.GOLD_API_KEY } 
        });
        
        if (response.ok) {
          const json = await response.json();
          const ouncePrice = Number(json.price || json.value || 0);
          const gramPrice = ouncePrice ? Math.round(ouncePrice / 31.1034768) : null;
          return { 
            gram: gramPrice, 
            ounce: ouncePrice, 
            fetchedAt: new Date().toISOString(), 
            source: 'goldapi.io' 
          };
        }
      } catch (error) {
        console.warn('GoldAPI error:', error.message);
      }
    }
    
    return { 
      gram: 1200000, 
      ounce: 37200000, 
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
    try {
      const url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EJKSE';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Yahoo failed');
      
      const json = await response.json();
      const quote = json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result[0];
      if (!quote) throw new Error('No result');
      
      return { 
        symbol: quote.symbol, 
        name: quote.shortName || 'IHSG', 
        price: quote.regularMarketPrice, 
        change: quote.regularMarketChangePercent ? `${quote.regularMarketChangePercent.toFixed(2)}%` : null, 
        fetchedAt: new Date().toISOString(), 
        source: 'yahoo' 
      };
    } catch (error) {
      console.warn('Yahoo fetch failed:', error.message);
      return { 
        symbol: '^JKSE', 
        name: 'IHSG', 
        price: 7115.23, 
        change: '+0.34%', 
        fetchedAt: new Date().toISOString(), 
        source: 'mock' 
      };
    }
  });
}

export { getCurrencyRates, getGoldPrice, getStockIndex };