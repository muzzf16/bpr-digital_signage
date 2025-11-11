import axios from 'axios';
import logger from './loggerService.js';

// Constants
const strapi = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
  },
  timeout: 10000 // 10 second timeout
});

if (!process.env.STRAPI_API_URL) {
  throw new Error('STRAPI_API_URL environment variable is not set.');
}

/**
 * Flattens the Strapi API response to make it easier to work with.
 * @param {object|Array} data - The data object from the Strapi response.
 * @returns {object|Array|null} - The flattened data.
 */
function flattenStrapiResponse(data) {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map(item => flattenStrapiResponse(item));
  }

  const flattened = { id: data.id };

  if (data.attributes) {
    for (const key in data.attributes) {
      const attribute = data.attributes[key];
      if (typeof attribute === 'object' && attribute !== null && 'data' in attribute) {
        // Handle relations (single or multiple)
        flattened[key] = flattenStrapiResponse(attribute.data);
      } else {
        flattened[key] = attribute;
      }
    }
  }

  return flattened;
}

/**
 * Fetches the playlist for a given device ID from Strapi.
 * @param {string} deviceId - The ID of the device.
 * @returns {Promise<object|null>} - The playlist data or null if not found.
 */
async function getPlaylistByDeviceId(deviceId) {
  try {
    if (!deviceId) {
      logger.warn('getPlaylistByDeviceId: deviceId is required');
      return null;
    }

    // Strapi query to filter by deviceId. Note the `filters` syntax.
    // We also use `populate=deep` to get all related data.
    const response = await strapi.get('/api/playlists', {
      params: {
        'filters[deviceId][$eq]': deviceId,
        'populate[items][populate]': ['rate_product', 'promo_image'],
      }
    });

    if (response.data?.data && response.data.data.length > 0) {
      // Return the first playlist found and flatten it.
      return flattenStrapiResponse(response.data.data[0]);
    }
    return null;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      logger.error(`Strapi API error fetching playlist for device ${deviceId}:`, { status: error.response.status, data: error.response.data });
    } else if (error.request) {
      // Request was made but no response received
      logger.error(`Network error fetching playlist for device ${deviceId}:`, { message: error.message });
    } else {
      // Something else happened
      logger.error(`Unexpected error fetching playlist for device ${deviceId}:`, { message: error.message });
    }
    
    // Don't throw error, just return null so the app can potentially fall back.
    return null;
  }
}

/**
 * Fetches all active rates from Strapi.
 * @returns {Promise<Array>} - An array of rate objects.
 */
async function getActiveRates() {
  try {
    const response = await strapi.get('/api/rates', {
      params: {
        // Assuming you might have a filter for 'active' rates in the future
        // For now, it fetches all rates.
        'populate': '*',
      }
    });
    
    const flattenedData = flattenStrapiResponse(response.data?.data);
    return Array.isArray(flattenedData) ? flattenedData : [];
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      logger.error('Strapi API error fetching rates:', { status: error.response.status, data: error.response.data });
    } else if (error.request) {
      // Request was made but no response received
      logger.error('Network error fetching rates:', { message: error.message });
    } else {
      // Something else happened
      logger.error('Unexpected error fetching rates:', { message: error.message });
    }
    
    return []; // Return empty array on error
  }
}

async function getRateByProductId(productId) {
  try {
    if (!productId) {
      logger.warn('getRateByProductId: productId is required');
      return null;
    }

    const response = await strapi.get('/api/rates', {
      params: {
        'filters[productId][$eq]': productId,
        'populate': '*',
      }
    });

    if (response.data?.data && response.data.data.length > 0) {
      return flattenStrapiResponse(response.data.data[0]);
    }
    return null;
  } catch (error) {
    if (error.response) {
      logger.error(`Strapi API error fetching rate for product ${productId}:`, { status: error.response.status, data: error.response.data });
    } else if (error.request) {
      logger.error(`Network error fetching rate for product ${productId}:`, { message: error.message });
    } else {
      logger.error(`Unexpected error fetching rate for product ${productId}:`, { message: error.message });
    }
    return null;
  }
}

export default {
  getPlaylistByDeviceId,
  getActiveRates,
  getRateByProductId,
};