import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SideNav.css';

const navItemDefs = [
  {
    id: 'home',
    tKey: 'home.home',
    fallbackLabel: 'Home',
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M3 8.5l7-6 7 6V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 17V11h4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'proposals',
    tKey: 'home.proposals',
    fallbackLabel: 'Proposals',
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'enterprise-search',
    tKey: 'proposal.enterpriseSearch',
    fallbackLabel: 'Enterprise Search',
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 2v16M13 2v16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const recentItems = [
  'Wooribank Proposal',
  'Proposal 1',
  'Proposal 2',
];

export default function SideNav({ activeItem = 'home', onNavigate, collapsed, onToggleCollapse, onProfileClick, onSettingsClick }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(activeItem);

  const getLabel = (item) => item.tKey ? t(item.tKey) : item.fallbackLabel;

  const handleNav = (id) => {
    setActive(id);
    if (onNavigate) onNavigate(id);
  };

  return (
    <div className={`sidenav ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidenav-header">
        {!collapsed && <span className="sidenav-title">{t('brand.proposalBuilder')}</span>}
        <button
          type="button"
          className="sidenav-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {collapsed ? (
              <path d="M6 4l5 5-5 5" stroke="#3a3a49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M12 4L7 9l5 5" stroke="#3a3a49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      <nav className="sidenav-main">
        {navItemDefs.map((item) => (
          (() => {
            const isDisabled = item.id !== 'home';
            return (
          <button
            key={item.id}
            type="button"
            className={`sidenav-item ${active === item.id ? 'active' : ''}${isDisabled ? ' disabled' : ''}`}
            onClick={() => {
              if (isDisabled) return;
              handleNav(item.id);
            }}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            title={collapsed ? getLabel(item) : undefined}
          >
            <span className="sidenav-item-icon">{item.icon}</span>
            {!collapsed && <span className="sidenav-item-label">{getLabel(item)}</span>}
          </button>
            );
          })()
        ))}
      </nav>

      <div className="sidenav-divider" />

      {!collapsed && (
        <div className="sidenav-recents">
          <div className="sidenav-recents-label">{t('nav.recents')}</div>
          {recentItems.map((item) => (
            <button key={item} type="button" className="sidenav-recent-item disabled" disabled aria-disabled="true">
              {item}
            </button>
          ))}
          <button type="button" className="sidenav-see-all disabled" disabled aria-disabled="true">
            <span>{t('nav.seeAll')}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 5l5 5-5 5" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="sidenav-footer">
        <div className="sidenav-footer-border" />
        <div className="sidenav-footer-icons">
          <button type="button" className="sidenav-footer-btn disabled" aria-label="Settings" disabled aria-disabled="true" onClick={onSettingsClick}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke="#3a3a49" strokeWidth="1.5" />
              <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.93 3.93l1.41 1.41M14.66 14.66l1.41 1.41M3.93 16.07l1.41-1.41M14.66 5.34l1.41-1.41" stroke="#3a3a49" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="sidenav-footer-btn disabled" aria-label="Help" disabled aria-disabled="true">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#3a3a49" strokeWidth="1.5" />
              <path d="M7.5 7.5a2.5 2.5 0 014.5 1.5c0 1.5-2 2-2 3.5" stroke="#3a3a49" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="15" r="0.5" fill="#3a3a49" />
            </svg>
          </button>
          <button
            type="button"
            className="sidenav-avatar"
            onClick={onProfileClick}
            aria-label="Profile"
          >
            <span>KS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
