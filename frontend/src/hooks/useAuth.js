import { useState, useEffect } from 'react';

export default function useAuth() {
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    // You might want to force a re-render here if needed,
    // for example by using a state update or redirecting.
    window.location.href = '/login';
  };

  return { token, logout };
}
