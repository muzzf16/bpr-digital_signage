import NodeCache from 'node-cache';

// Initialize cache with default TTL
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour default TTL

/**
 * Cached function wrapper
 * @param {string} key - Cache key
 * @param {number} ttlSeconds - Time to live in seconds
 * @param {Function} fn - Function to execute and cache the result
 * @returns {*} Cached or fresh result
 */
async function cached(key, ttlSeconds, fn) {
  // Try to get from cache first
  const cachedValue = cache.get(key);
  if (cachedValue !== undefined) {
    console.log(`[Cache] HIT: ${key}`);
    return cachedValue;
  }
  
  console.log(`[Cache] MISS: ${key}`);
  
  try {
    const result = await fn();
    cache.set(key, result, ttlSeconds);
    return result;
  } catch (error) {
    console.error(`[Cache] Error executing function for key '${key}':`, error);
    throw error;
  }
}

export {
  cache,
  cached,
};