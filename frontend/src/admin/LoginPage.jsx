import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { username, password: '***' }); // Log attempt
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', res.status); // Log response status
      const responseText = await res.text(); // Read response as text
      console.log('Login raw response text:', responseText); // Log raw response text
      const data = JSON.parse(responseText); // Manually parse JSON
      console.log('Login response data:', data); // Log the full response
      console.log('Login response data.token:', data.token); // Log the token specifically

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if token exists in response
      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('Server did not return a token');
      }

      console.log('Token received, storing in localStorage');
      localStorage.setItem('token', data.token);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));

      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err); // Log the error
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          {error && <p key="error-message" className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 font-bold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
