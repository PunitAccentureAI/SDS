import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateProposalDrawer from '../components/ui/CreateProposalDrawer';
import SideNav from '../components/layout/SideNav';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './Welcome.css';

const sdsLogo = 'https://www.figma.com/api/mcp/asset/22a2d86d-58e6-445b-b9b2-7540015eb78c';
const thumbDoc = 'https://www.figma.com/api/mcp/asset/258c3536-14d7-4346-b2a8-6ca4f9cf4249';

const recentProposals = [
  {
    id: 1,
    name: 'Wooribank Proposal',
    client: 'Wooribank',
    updated: 'Updated yesterday',
    thumb: thumbDoc,
  },
];

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
            <img src={sdsLogo} alt="Samsung SDS" className="welcome-logo" />
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

          {recentProposals.length > 0 && (
            <section className="welcome-recents">
              <h2 className="welcome-recents-title">{t('welcome.recents')}</h2>

              <div className="welcome-recents-grid">
                {recentProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="welcome-card"
                    onClick={() => navigate(`/proposal/${proposal.id}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="welcome-card-thumb">
                      {proposal.thumb ? (
                        <img src={proposal.thumb} alt={proposal.name} />
                      ) : (
                        <div className="welcome-card-thumb-empty" />
                      )}
                    </div>
                    <div className="welcome-card-info">
                      <h3 className="welcome-card-name">{proposal.name}</h3>
                      <p className="welcome-card-client">{proposal.client}</p>
                      <p className="welcome-card-updated">{proposal.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <CreateProposalDrawer
          show={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
}
