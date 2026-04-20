import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TestHome from './pages/TestHome';
import ProposalBuilder from './pages/ProposalBuilder';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ManageUsers from './pages/ManageUsers';
import NotFound from './pages/NotFound';
import SessionExpired from './pages/SessionExpired';
import Loader from './pages/Loader';
import RequestAccess from './pages/RequestAccess';
import Welcome from './pages/Welcome';
import ProposalCreation from './pages/ProposalCreation';
import InternalEnterpriseSearch from './pages/InternalEnterpriseSearch';
import { getAccessToken, getStoredUser } from './services/authService';

function RequireAuth({ children }) {
  const hasSession = Boolean(getAccessToken() && getStoredUser());

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/testhome" element={<RequireAuth><TestHome /></RequireAuth>} />
        <Route path="/internal-enterprise-search" element={<RequireAuth><InternalEnterpriseSearch /></RequireAuth>} />
        <Route path="/internal-enterprise-search/:id" element={<RequireAuth><InternalEnterpriseSearch /></RequireAuth>} />
        <Route path="/proposal/new" element={<RequireAuth><ProposalCreation /></RequireAuth>} />
        <Route path="/proposal/new/:sessionId" element={<RequireAuth><ProposalCreation /></RequireAuth>} />
        <Route path="/proposal/:id" element={<RequireAuth><ProposalBuilder /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/settings/users" element={<RequireAuth><ManageUsers /></RequireAuth>} />
        <Route path="/session-expired" element={<RequireAuth><SessionExpired /></RequireAuth>} />
        <Route path="/loading" element={<RequireAuth><Loader /></RequireAuth>} />
        <Route path="/" element={<RequireAuth><Welcome /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
