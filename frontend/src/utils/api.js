// API utility functions
const API_BASE = '/api';
const API_KEY = 'secret_dev_key'; // In production, this should be loaded from environment variables

const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  
  // Check if the response is ok (status 200-299)
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `API request failed with status ${response.status}`);
  }
  
  return response.json();
};

// Specific API methods
const apiClient = {
  get: (endpoint, options = {}) => makeRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => makeRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data, options = {}) => makeRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint, options = {}) => makeRequest(endpoint, { ...options, method: 'DELETE' })
};

export default apiClient;