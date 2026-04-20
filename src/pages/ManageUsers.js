import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserDetailDrawer from '../components/ui/UserDetailDrawer';
import PageTopControls from '../components/layout/PageTopControls';
import './ManageUsers.css';

const users = [
  { id: 1, initial: 'J', name: 'Jenny Lee', email: 'jenny.lee@samsung.com', type: 'User', industry: 'National Defence/Finance/Logistics/Medical Care', status: 'Pending' },
  { id: 2, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'User', industry: 'Finance/Logistics', status: 'Pending' },
  { id: 3, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'User', industry: 'Logistics', status: 'Active' },
  { id: 4, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'User', industry: 'Logistics/Medical Care', status: 'Active' },
  { id: 5, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'User', industry: 'Logistics', status: 'Active' },
  { id: 6, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'User', industry: 'Medical Care', status: 'Active' },
  { id: 7, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'Admin', industry: 'Medical Care', status: 'Active' },
  { id: 8, initial: 'K', name: 'Kim Smith', email: 'kim.smith@samsung.com', type: 'User', industry: 'Finance', status: 'Inactive' },
];

function StatusBadge({ status, t }) {
  const cls = status.toLowerCase();
  return <span className={`mu-status-badge mu-status-${cls}`}>{t('statuses.' + cls)}</span>;
}

export default function ManageUsers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = searchQuery
    ? users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className="mu-page">
      <PageTopControls
        showLeftButton
        onLeftButtonClick={() => navigate('/settings')}
        leftButtonAriaLabel="Back to settings"
      />

      <div className="mu-content">
        <button type="button" className="mu-back-btn" onClick={() => navigate('/settings')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t('common.back')}</span>
        </button>

        <div className="mu-header">
          <h1 className="mu-title">{t('manageUsers.title')}</h1>
          <button
            type="button"
            className="mu-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#1D1D1F" strokeWidth="2" />
              <path d="M16 16l4 4" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {searchOpen && (
          <div className="mu-search-bar">
            <input
              type="text"
              className="mu-search-input"
              placeholder={t('manageUsers.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="mu-divider" />

        <div className="mu-table">
          <div className="mu-table-header">
            <span className="mu-th mu-col-name">{t('manageUsers.name')}</span>
            <span className="mu-th mu-col-email">{t('manageUsers.email')}</span>
            <span className="mu-th mu-col-type">{t('manageUsers.userType')}</span>
            <span className="mu-th mu-col-industry">{t('manageUsers.industry')}</span>
            <span className="mu-th mu-col-status">{t('manageUsers.status')}</span>
            <span className="mu-th mu-col-actions" />
          </div>

          {filtered.map((user) => (
            <div
              key={user.id}
              className="mu-table-row"
              onClick={() => setSelectedUser(user)}
              style={{ cursor: 'pointer' }}
            >
              <div className="mu-col-name mu-cell">
                <div className="mu-avatar">
                  <span>{user.initial}</span>
                </div>
                <span className="mu-user-name">{user.name}</span>
              </div>
              <span className="mu-col-email mu-cell mu-cell-text">{user.email}</span>
              <span className="mu-col-type mu-cell mu-cell-text">{user.type}</span>
              <span className="mu-col-industry mu-cell mu-cell-text">{user.industry}</span>
              <div className="mu-col-status mu-cell">
                <StatusBadge status={user.status} t={t} />
              </div>
              <div className="mu-col-actions mu-cell">
                <button
                  type="button"
                  className="mu-more-btn"
                  aria-label="More actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="3" r="1.5" fill="#1D1D1F" />
                    <circle cx="8" cy="8" r="1.5" fill="#1D1D1F" />
                    <circle cx="8" cy="13" r="1.5" fill="#1D1D1F" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <UserDetailDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
