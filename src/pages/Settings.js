import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SideNav from '../components/layout/SideNav';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './Settings.css';

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidenavOpen, setSidenavOpen] = useState(false);

  return (
    <div className="settings-layout">
      {sidenavOpen && (
        <SideNav
          activeItem="settings"
          collapsed={false}
          onToggleCollapse={() => setSidenavOpen(false)}
          onProfileClick={() => navigate('/profile')}
          onNavigate={(id) => {
            if (id === 'home') navigate('/testhome');
            if (id === 'enterprise-search') navigate('/internal-enterprise-search');
          }}
        />
      )}

      <div className="settings-page">
        <div className="settings-sidebar-toggle-area">
          {!sidenavOpen && (
            <button
              className="settings-sidebar-toggle"
              aria-label="Toggle sidebar"
              onClick={() => setSidenavOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="3" stroke="#09121F" strokeWidth="1.5" fill="none" />
                <line x1="7" y1="1" x2="7" y2="19" stroke="#09121F" strokeWidth="1.5" />
              </svg>
            </button>
          )}
        </div>
        <div className="settings-header-right">
          <LanguageSwitcher />
        </div>

        <div className="settings-content">
          <div className="settings-header">
            <h1 className="settings-title">{t('settings.title')}</h1>
          </div>
          <div className="settings-header-divider" />

          <div className="settings-body">
            <div className="settings-section">
              <h2 className="settings-section-title">{t('settings.platform')}</h2>

              <div className="settings-cards">
                <button type="button" className="settings-card" onClick={() => navigate('/settings/users')}>
                  <div className="settings-card-text">
                    <span className="settings-card-title">{t('settings.manageUsers')}</span>
                    <span className="settings-card-desc">{t('settings.manageUsersDesc')}</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="settings-card-arrow">
                    <path d="M4 10h12" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 5l5 5-5 5" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="settings-section-divider" />
          </div>
        </div>
      </div>
    </div>
  );
}
