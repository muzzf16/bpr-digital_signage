import axios from 'axios';
import xml2js from 'xml2js';
import * as cheerio from 'cheerio';
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
    if (process.env.GOAPI_API_KEY) {
      try {
        const response = await axios.get('https://api.goapi.io/stock/idx/indices', { 
          headers: { 'X-API-KEY': process.env.GOAPI_API_KEY } 
        });
        
        if (response.status === 200) {
          const indices = response.data.data;
          const ihsg = indices.find(index => index.symbol === 'COMPOSITE');

          if (ihsg) {
            return { 
              symbol: ihsg.symbol, 
              name: ihsg.name, 
              price: ihsg.last, 
              change: ihsg.change_percentage, 
              fetchedAt: new Date().toISOString(), 
              source: 'goapi.io' 
            };
          }
        }
      } catch (error) {
        console.warn('GOAPI.IO error:', error.message);
      }
    }
    
    return { 
      symbol: '^JKSE', 
      name: 'IHSG', 
      price: 7115.23, 
      change: '+0.34%', 
      fetchedAt: new Date().toISOString(), 
      source: 'mock' 
    };
  });
}

export { getCurrencyRates, getGoldPrice, getStockIndex };