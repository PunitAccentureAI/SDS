import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateProposalDrawer from '../components/ui/CreateProposalDrawer';
import SideNav from '../components/layout/SideNav';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './Welcome.css';

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'goodMorning';
  if (hour < 17) return 'goodAfternoon';
  return 'goodEvening';
}

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const proposals = [];

  return (
    <div className="welcome-layout">
      {sidenavOpen && (
        <SideNav
          activeItem="home"
          collapsed={false}
          onToggleCollapse={() => setSidenavOpen(false)}
          onProfileClick={() => navigate('/profile')}
          onSettingsClick={() => navigate('/settings')}
          onNavigate={(id) => {
            if (id === 'home') navigate('/');
            if (id === 'proposals') navigate('/testhome');
            if (id === 'enterprise-search') navigate('/internal-enterprise-search');
          }}
        />
      )}

      <div className="welcome-page">
        <div className="welcome-bg-gradient" />
        <div className="welcome-bg-fade" />

        <header className="welcome-header">
          <div className="welcome-header-left">
            {!sidenavOpen && (
              <button
                className="welcome-sidebar-toggle"
                aria-label="Toggle sidebar"
                onClick={() => setSidenavOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="1" y="1" width="18" height="18" rx="3" stroke="#09121F" strokeWidth="1.5" fill="none" />
                  <line x1="7" y1="1" x2="7" y2="19" stroke="#09121F" strokeWidth="1.5" />
                </svg>
              </button>
            )}
            <span className="welcome-logo">{t('brand.samsungSds')}</span>
          </div>

          <div className="welcome-header-right">
            <LanguageSwitcher />
          </div>
        </header>

        <main className="welcome-main">
          <h1 className="welcome-greeting">
            {t('home.greeting', {
              greeting: t('home.' + getGreetingKey()),
              name: 'Kim',
            })}
          </h1>

          <button
            className="welcome-create-btn"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{t('home.createNew')}</span>
          </button>

          {proposals.length === 0 ? (
            <section className="welcome-empty-state" aria-live="polite">
              <div className="welcome-empty-card">
                <div className="welcome-empty-icon" aria-hidden="true">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <path d="M10 6h16l8 8v24H10V6z" stroke="#B7BCC7" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="3 3" />
                    <path d="M26 6v8h8" stroke="#B7BCC7" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="3 3" />
                  </svg>
                </div>
                <p className="welcome-empty-title">{t('home.noProposals')}</p>
              </div>
            </section>
          ) : null}

        </main>

        <CreateProposalDrawer
          show={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
}
