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
