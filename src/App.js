import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Testing from './pages/Testing';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import PublicLayout from './components/layout/PublicLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthenticatedLayout />}>
          <Route path="/testhome" element={<TestHome />} />
          <Route path="/internal-enterprise-search" element={<InternalEnterpriseSearch />} />
          <Route path="/internal-enterprise-search/:id" element={<InternalEnterpriseSearch />} />
          <Route path="/proposal/new" element={<ProposalCreation />} />
          <Route path="/proposal/new/:sessionId" element={<ProposalCreation />} />
          <Route path="/proposal/:id" element={<ProposalBuilder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/users" element={<ManageUsers />} />
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route path="/loading" element={<Loader />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/" element={<Welcome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
