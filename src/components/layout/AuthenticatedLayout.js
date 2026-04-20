import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, getStoredUser } from '../../services/authService';

export default function AuthenticatedLayout() {
  const hasSession = Boolean(getAccessToken() && getStoredUser());

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
