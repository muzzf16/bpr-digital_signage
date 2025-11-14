// frontend/src/utils/api.js
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-cache',
    });

    // Handle unauthorized access (401)
    if (response.status === 401) {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      // Return response so calling code can handle the 401 appropriately
      return response;
    }

    // Handle other error responses (4xx, 5xx)
    if (!response.ok) {
      // Don't redirect for other error codes, just return the response
      // so the calling code can handle the error appropriately
      console.warn(`API request failed: ${response.status} ${response.statusText} for URL: ${url}`);
    }

    return response;
  } catch (error) {
    // Handle network errors or other fetch failures
    console.error(`Network error when fetching ${url}:`, error);

    // In case of network errors, we don't want to redirect to login,
    // as this might be a temporary connectivity issue
    throw error;
  }
};