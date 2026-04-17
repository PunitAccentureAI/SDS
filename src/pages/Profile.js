import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SideNav from '../components/layout/SideNav';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './Profile.css';

const userValues = {
  firstName: 'Kim',
  lastName: 'Smith',
  email: 'kim.smith@samsung.com',
  industry: 'Finance',
  userType: 'Admin',
};

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidenavOpen, setSidenavOpen] = useState(false);

  const userInfo = [
    { title: t('profile.firstName'), value: userValues.firstName },
    { title: t('profile.lastName'), value: userValues.lastName },
    { title: t('profile.email'), value: userValues.email },
    { title: t('profile.industry'), value: userValues.industry },
    { title: t('profile.userType'), value: userValues.userType },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="profile-layout">
      {sidenavOpen && (
        <SideNav
          activeItem="profile"
          collapsed={false}
          onToggleCollapse={() => setSidenavOpen(false)}
          onProfileClick={() => navigate('/profile')}
          onSettingsClick={() => navigate('/settings')}
          onNavigate={(id) => {
            if (id === 'home') navigate('/testhome');
            if (id === 'enterprise-search') navigate('/internal-enterprise-search');
          }}
        />
      )}

      <div className="profile-page">
        <div className="profile-sidebar-toggle-area">
          {!sidenavOpen && (
            <button
              className="profile-sidebar-toggle"
              aria-label="Toggle sidebar"
              onClick={() => setSidenavOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="3" stroke="#09121F" strokeWidth="1.5" fill="none" />
                <line x1="7" y1="1" x2="7" y2="19" stroke="#09121F" strokeWidth="1.5" />
              </svg>
            </button>
          )}
          <LanguageSwitcher />
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <h1 className="profile-title">{t('profile.title')}</h1>
            <button type="button" className="profile-logout" onClick={handleLogout}>
              {t('common.logout')}
            </button>
          </div>
          <div className="profile-header-divider" />

          <div className="profile-body">
            <div className="profile-body-left">
              <h2 className="profile-section-title">{t('profile.basicInfo')}</h2>
            </div>

            <div className="profile-body-right">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path
                      d="M24 24c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zm0 4c-5.34 0-16 2.68-16 8v4h32v-4c0-5.32-10.66-8-16-8z"
                      fill="#757575"
                    />
                  </svg>
                </div>
              </div>

              <div className="profile-info-list">
                {userInfo.map((item) => (
                  <div key={item.title} className="profile-info-item">
                    <div className="profile-info-divider" />
                    <div className="profile-info-content">
                      <span className="profile-info-title">{item.title}</span>
                      <span className="profile-info-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
