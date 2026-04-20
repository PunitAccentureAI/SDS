import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken, getStoredUser } from '../../services/authService';

const publicPaths = new Set(['/login', '/request-access']);

export default function PublicLayout() {
  const location = useLocation();
  const hasSession = Boolean(getAccessToken() && getStoredUser());

  if (hasSession && publicPaths.has(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
