import axios from 'axios';

// Constants
const DEFAULT_STRAPI_URL = 'http://localhost:1337';

// Create axios instance for Strapi API
const strapi = axios.create({
  baseURL: process.env.STRAPI_API_URL || DEFAULT_STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
  },
  timeout: 10000 // 10 second timeout
});

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
      console.warn('getPlaylistByDeviceId: deviceId is required');
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
      console.error(`Strapi API error fetching playlist for device ${deviceId}:`, error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error(`Network error fetching playlist for device ${deviceId}:`, error.message);
    } else {
      // Something else happened
      console.error(`Unexpected error fetching playlist for device ${deviceId}:`, error.message);
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
      console.error('Strapi API error fetching rates:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error fetching rates:', error.message);
    } else {
      // Something else happened
      console.error('Unexpected error fetching rates:', error.message);
    }
    
    return []; // Return empty array on error
  }
}

export default {
  getPlaylistByDeviceId,
  getActiveRates,
};