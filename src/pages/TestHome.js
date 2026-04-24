import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateProposalDrawer from '../components/ui/CreateProposalDrawer';
import SideNav from '../components/layout/SideNav';
import FilterPanel, { filterGroups } from '../components/ui/FilterPanel';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import sdsLogo from '../assets/images/SamsungSDS_Logo.svg';
import './TestHome.css';

const thumbDoc = 'https://www.figma.com/api/mcp/asset/258c3536-14d7-4346-b2a8-6ca4f9cf4249';
const thumbDeck = 'https://www.figma.com/api/mcp/asset/e0b3eb01-461a-4d4e-9598-707dffcf35b6';

const sampleProposals = [
  { id: 1, name: 'Wooribank Proposal', client: 'Wooribank', updated: 'Updated yesterday', thumb: thumbDoc },
  { id: 2, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: null },
  { id: 3, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: thumbDeck },
  { id: 4, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: thumbDeck },
  { id: 5, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: thumbDeck },
  { id: 6, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: thumbDeck },
  { id: 7, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: thumbDeck },
  { id: 8, name: 'Proposal Name', client: 'Client 1', updated: 'Updated yesterday', thumb: thumbDeck },
];

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'goodMorning';
  if (hour < 17) return 'goodAfternoon';
  return 'goodEvening';
}

function ProposalCard({ proposal, onClick }) {
  return (
    <div className="proposal-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="proposal-card-thumb">
        {proposal.thumb ? (
          <img src={proposal.thumb} alt={proposal.name} />
        ) : (
          <div className="proposal-card-thumb-empty" />
        )}
      </div>
      <div className="proposal-card-info">
        <h3 className="proposal-card-name">{proposal.name}</h3>
        <p className="proposal-card-client">{proposal.client}</p>
        <p className="proposal-card-updated">{proposal.updated}</p>
      </div>
    </div>
  );
}

export default function TestHome() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [proposals] = useState(sampleProposals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSelected, setFilterSelected] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('updated');
  const navigate = useNavigate();
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilterGroup = (option) => {
    for (const group of filterGroups) {
      if (group.options.includes(option)) return group.label;
    }
    return '';
  };

  const removeFilter = (option) => {
    setFilterSelected(filterSelected.filter((s) => s !== option));
  };

  const sortOptions = [
    { value: 'updated', label: 'Last updated' },
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'az', label: 'Name A–Z' },
    { value: 'za', label: 'Name Z–A' },
  ];

  const handleSortSelect = (value) => {
    setSortBy(value);
    setSortOpen(false);
  };

  const filteredProposals = proposals.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasProposals = proposals.length > 0;

  return (
    <div className="testhome-layout">
      {sidenavOpen && (
        <SideNav
          activeItem="home"
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

      <div className="testhome-page">
        {!hasProposals && <div className="testhome-bg-gradient" />}

        <header className="testhome-header">
          <div className="testhome-header-left">
            {!sidenavOpen && (
              <button
                className="testhome-sidebar-toggle"
                aria-label="Toggle sidebar"
                onClick={() => setSidenavOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="1" y="1" width="18" height="18" rx="3" stroke="#09121F" strokeWidth="1.5" fill="none" />
                  <line x1="7" y1="1" x2="7" y2="19" stroke="#09121F" strokeWidth="1.5" />
                </svg>
              </button>
            )}
            <img src={sdsLogo} alt="Samsung SDS" className="testhome-logo" />
          </div>

          <div className="testhome-header-right">
            <LanguageSwitcher />
          </div>
        </header>

        {hasProposals ? (
          <main className="testhome-main proposals-view">
            <h1 className="proposals-title">{t('home.proposals')}</h1>

            <div className="proposals-toolbar">
              <div className="proposals-search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="proposals-search-icon">
                  <circle cx="11" cy="11" r="7" stroke="#09121F" strokeWidth="2" />
                  <path d="M16 16l4 4" stroke="#09121F" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  className="proposals-search-input"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="proposals-actions">
                <div className="proposals-sort-wrapper" ref={sortRef}>
                  <button
                    type="button"
                    className={`proposals-action-btn sort-btn ${sortOpen ? 'active' : ''}`}
                    onClick={() => setSortOpen(!sortOpen)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t('home.sort')}</span>
                  </button>
                  {sortOpen && (
                    <div className="sort-dropdown">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`sort-dropdown-item ${sortBy === opt.value ? 'selected' : ''}`}
                          onClick={() => handleSortSelect(opt.value)}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && (
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                              <path d="M4 10.5l4 4 8-9" stroke="#2189FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="proposals-filter-wrapper">
                  <button
                    type="button"
                    className={`proposals-action-btn filter-btn ${filterOpen ? 'active' : ''}`}
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M2 4h16M5 10h10M8 16h4" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{t('home.filter')}</span>
                    {filterSelected.length > 0 && (
                      <span className="filter-badge">{filterSelected.length}</span>
                    )}
                  </button>
                  <FilterPanel
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    selected={filterSelected}
                    onSelectionChange={setFilterSelected}
                  />
                </div>
              </div>
            </div>

            {filterSelected.length > 0 && (
              <div className="filter-tags-row">
                {filterSelected.map((item) => (
                  <span key={item} className="filter-tag">
                    <span className="filter-tag-text">{getFilterGroup(item)}: {item}</span>
                    <button
                      type="button"
                      className="filter-tag-remove"
                      onClick={() => removeFilter(item)}
                      aria-label={`Remove ${item}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#9FA8B8" />
                        <path d="M7 7l6 6M13 7l-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="filter-clear-all"
                  onClick={() => setFilterSelected([])}
                >
                  {t('home.clearAll')}
                </button>
              </div>
            )}

            <p className="proposals-result-count">
              {t('home.results', { count: filteredProposals.length })}
            </p>

            <div className="proposals-grid">
              {filteredProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onClick={() => navigate(`/proposal/${proposal.id}`)}
                />
              ))}
            </div>
          </main>
        ) : (
          <main className="testhome-main">
            <h1 className="testhome-greeting">{t('home.greeting', { greeting: t('home.' + getGreetingKey()), name: 'Kim' })}</h1>

            <button className="testhome-create-btn" onClick={() => setDrawerOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{t('home.createNew')}</span>
            </button>

            <div className="testhome-empty-card">
              <div className="testhome-empty-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <path
                    d="M40 15h25l20 20v70a5 5 0 01-5 5H40a5 5 0 01-5-5V20a5 5 0 015-5z"
                    stroke="#ccc"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                  <path
                    d="M65 15v15a5 5 0 005 5h15"
                    stroke="#ccc"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                </svg>
              </div>
              <p className="testhome-empty-text">{t('home.noProposals')}</p>
            </div>
          </main>
        )}

        <CreateProposalDrawer
          show={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
}
