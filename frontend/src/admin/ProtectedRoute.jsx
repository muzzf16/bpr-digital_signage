import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If children are provided, render them; otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
