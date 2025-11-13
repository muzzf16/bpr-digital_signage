<<<<<<< HEAD
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
=======
// frontend/src/utils/api.js
export const fetchWithAuth = async (url, options = {}) => {
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

  if (response.status === 401) {
    // Handle unauthorized access, e.g., redirect to login
    window.location.href = '/admin/login';
  }

  return response;
};
>>>>>>> d380804943724c4d81a2d29c361fce4f05b8aa12
