import { useState, useEffect } from 'react';

export default function useAuth() {
  const initialToken = localStorage.getItem('token');
  console.log('useAuth: Initial token from localStorage:', initialToken ? 'present' : 'absent');
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    console.log('useAuth: useEffect triggered. Current token state:', token ? 'present' : 'absent');

    // Listen for changes to localStorage from other tabs
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        const newToken = event.newValue;
        console.log('useAuth: storage event detected. New token from localStorage:', newToken ? 'present' : 'absent');
        setToken(newToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    console.log('useAuth: Token state changed to:', token ? 'present' : 'absent');
  }, [token]);

  // Function to update token state and localStorage
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const logout = () => {
    console.log('useAuth: Logging out. Removing token from localStorage.');
    updateToken(null);
    window.location.href = '/login';
  };

  return { token, logout, updateToken };
}
