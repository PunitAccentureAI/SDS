import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { enterpriseSearchResults, openProposalTargets } from '../data/enterpriseSearchData';
import FilterPanel, { filterGroups } from '../components/ui/FilterPanel';
import SideNav from '../components/layout/SideNav';
import './InternalEnterpriseSearch.css';

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5.75" stroke="#09121F" strokeWidth="1.5" />
      <path d="M13.2 13.3L17 17.1" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 4v12M6 4L3.5 6.5M6 4l2.5 2.5M14 16V4m0 12l-2.5-2.5M14 16l2.5-2.5" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 4h14l-5.5 6.3v4.8l-3 1.6v-6.4L3 4z" stroke="#09121F" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12 5l-5 5 5 5" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="4" r="1.5" fill="#1D1D1F" />
      <circle cx="10" cy="10" r="1.5" fill="#1D1D1F" />
      <circle cx="10" cy="16" r="1.5" fill="#1D1D1F" />
    </svg>
  );
}

function FileTypeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="1" width="14" height="18" rx="2" fill="#fff" stroke="#DDD" />
      <text x="10" y="14" textAnchor="middle" fill="#E53935" fontSize="6" fontWeight="700">PDF</text>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2.5 5.5a1.5 1.5 0 011.5-1.5h3.1l1.4 1.7H16a1.5 1.5 0 011.5 1.5v7.3A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5V5.5z" stroke="#09121F" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function RadioCheckedIcon() {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
      <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M1.5 10s3.1-5 8.5-5 8.5 5 8.5 5-3.1 5-8.5 5-8.5-5-8.5-5z" stroke="#09121F" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.5" stroke="#09121F" strokeWidth="1.5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3v8m0 0l-3-3m3 3l3-3M4 13.5V15a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0016 15v-1.5" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.5L5 9l4.5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3l6 6M9 3L3 9" stroke="#313131" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DrawerCloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const sortOptions = [
  { id: 'updated', label: 'Last updated' },
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'az', label: 'Name A-Z' },
  { id: 'za', label: 'Name Z-A' },
];

function parseDateValue(label) {
  const date = new Date(label);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function InternalEnterpriseSearch({
  embedded = false,
  proposalState = null,
  onCloseDrawer,
  onReferenceSelect,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [searchText, setSearchText] = useState('');
  const [sortValue, setSortValue] = useState('updated');
  const [manualSelectedFilters, setManualSelectedFilters] = useState(null);
  const [selectedProposalId, setSelectedProposalId] = useState(openProposalTargets[0].id);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openFileMenuId, setOpenFileMenuId] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [embeddedDetailId, setEmbeddedDetailId] = useState(id || null);
  const sortMenuRef = useRef(null);
  const filterMenuRef = useRef(null);
  const fileMenuRef = useRef(null);

  const drawerProposalState = proposalState || location.state?.proposalState || null;
  const activeDetailId = embedded ? embeddedDetailId : id;
  const detailItem = enterpriseSearchResults.find((item) => item.id === activeDetailId) || null;

  const normalizedSearchText = searchText.trim().toLowerCase();

  const searchMatchedResults = useMemo(() => {
    let items = [...enterpriseSearchResults];

    if (normalizedSearchText) {
      items = items.filter((item) => {
        const haystack = [item.title, item.summary, item.client, ...item.tags].join(' ').toLowerCase();
        return haystack.includes(normalizedSearchText);
      });
    }

    return items;
  }, [normalizedSearchText]);

  const autoSelectedFilters = useMemo(() => {
    if (!normalizedSearchText) return [];

    const knownFilterOptions = filterGroups.flatMap((group) => group.options);

    return knownFilterOptions.filter((option) => {
      const normalizedOption = option.toLowerCase();
      const matchesSearch =
        normalizedOption.includes(normalizedSearchText) ||
        normalizedSearchText.includes(normalizedOption);

      if (!matchesSearch) return false;

      return searchMatchedResults.some((item) => item.tags.includes(option));
    });
  }, [normalizedSearchText, searchMatchedResults]);

  const selectedFilters = manualSelectedFilters ?? autoSelectedFilters;

  useEffect(() => {
    if (!embedded) return;
    setEmbeddedDetailId(id || null);
  }, [embedded, id]);

  useEffect(() => {
    if (!showAddModal || !detailItem?.files?.length) return;

    const defaultSelectedFiles = detailItem.files.slice(-2).map((file) => file.id);
    setSelectedFileIds(defaultSelectedFiles);
  }, [detailItem, showAddModal]);

  useEffect(() => {
    if (!embedded) return undefined;

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [embedded]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;

    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [showAddModal]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (showSortMenu && sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }

      if (showFilterPanel && filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterPanel(false);
      }

      if (openFileMenuId && fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setOpenFileMenuId(null);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [openFileMenuId, showFilterPanel, showSortMenu]);

  const visibleResults = useMemo(() => {
    let items = [...searchMatchedResults];

    if (selectedFilters.length > 0) {
      items = items.filter((item) => selectedFilters.every((filter) => item.tags.includes(filter)));
    }

    if (sortValue === 'az') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'za') {
      items.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortValue === 'oldest') {
      items.sort((a, b) => parseDateValue(a.dateLabel) - parseDateValue(b.dateLabel));
    } else if (sortValue === 'newest' || sortValue === 'updated') {
      items.sort((a, b) => parseDateValue(b.dateLabel) - parseDateValue(a.dateLabel));
    } else {
      items.sort((a, b) => Number(b.relevance.replace('%', '')) - Number(a.relevance.replace('%', '')));
    }

    return items;
  }, [searchMatchedResults, selectedFilters, sortValue]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const openDetail = (item) => {
    if (embedded) {
      setEmbeddedDetailId(item.id);
      return;
    }

    navigate(`/internal-enterprise-search/${item.id}`, {
      state: location.state,
    });
  };

  const handleBack = () => {
    if (embedded) {
      setEmbeddedDetailId(null);
      return;
    }

    if (detailItem) {
      navigate('/internal-enterprise-search', { state: location.state });
      return;
    }
    navigate(-1);
  };

  const handleUseInProposal = () => {
    setShowAddModal(true);
  };

  const handleToggleSelectedFile = (fileId) => {
    setSelectedFileIds((prev) => (
      prev.includes(fileId)
        ? prev.filter((currentId) => currentId !== fileId)
        : [...prev, fileId]
    ));
  };

  const handleAddToProposal = () => {
    if (!detailItem) return;

    const selectedFiles = detailItem.files?.filter((file) => selectedFileIds.includes(file.id)) || [];

    if (embedded && onReferenceSelect) {
      onReferenceSelect({
        ...detailItem,
        files: selectedFiles,
        enterpriseTargetProposalId: selectedProposalId,
      });
      setShowAddModal(false);
      setEmbeddedDetailId(null);
      if (onCloseDrawer) onCloseDrawer();
      return;
    }

    navigate('/proposal/new', {
      state: {
        ...(drawerProposalState || {}),
        enterpriseReference: {
          ...detailItem,
          files: selectedFiles,
        },
        enterpriseTargetProposalId: selectedProposalId,
      },
    });
  };

  const handleRemoveSelectedFilter = (filterToRemove) => {
    setManualSelectedFilters(selectedFilters.filter((filter) => filter !== filterToRemove));
  };

  const filterCount = selectedFilters.length;

  return (
    <div className={`ies-page${detailItem ? ' ies-page--detail' : ''}${embedded ? ' ies-page--embedded' : ''}`}>
      {embedded && (
        <div className="ies-embedded-topbar">
          <span>{t('enterpriseSearch.title')}</span>
          <button type="button" className="ies-embedded-close" onClick={onCloseDrawer}>
            <DrawerCloseIcon />
          </button>
        </div>
      )}
      {sidenavOpen && !embedded && (
        <SideNav
          activeItem="enterprise-search"
          collapsed={false}
          onToggleCollapse={() => setSidenavOpen(false)}
          onProfileClick={() => navigate('/profile')}
          onSettingsClick={() => navigate('/settings')}
          onNavigate={(navId) => {
            if (navId === 'home') navigate('/');
            if (navId === 'proposals') navigate('/');
            if (navId === 'enterprise-search') navigate('/internal-enterprise-search');
          }}
        />
      )}

      {!sidenavOpen && !embedded && (
        <div className="ies-sidebar-toggle-area">
          <button
            className="ies-sidebar-toggle"
            aria-label="Toggle sidebar"
            onClick={() => setSidenavOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="18" height="18" rx="3" stroke="#09121F" strokeWidth="1.5" fill="none" />
              <line x1="7" y1="1" x2="7" y2="19" stroke="#09121F" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      )}

      {!detailItem ? (
        <div className="ies-shell">
          <h1 className="ies-title">{t('enterpriseSearch.title')}</h1>

          <div className="ies-toolbar">
            <form className="ies-search" onSubmit={handleSearchSubmit}>
              <SearchIcon />
              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setManualSelectedFilters(null);
                }}
                placeholder={t('enterpriseSearch.searchPlaceholder')}
              />
            </form>

            <div className="ies-actions">
              <div className="ies-menu-anchor" ref={sortMenuRef}>
                <button
                  type="button"
                  className="ies-action-btn"
                  onClick={() => {
                    setShowSortMenu((prev) => !prev);
                    setShowFilterPanel(false);
                  }}
                >
                  <SortIcon />
                  <span>{t('home.sort')}</span>
                </button>
                {showSortMenu && (
                  <div className="ies-sort-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`ies-sort-option${sortValue === option.id ? ' active' : ''}`}
                        onClick={() => {
                          setSortValue(option.id);
                          setShowSortMenu(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {sortValue === option.id && (
                          <span className="ies-sort-check"><CheckIcon /></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="ies-menu-anchor" ref={filterMenuRef}>
                <button
                  type="button"
                  className="ies-action-btn"
                  onClick={() => {
                    setShowFilterPanel((prev) => !prev);
                    setShowSortMenu(false);
                  }}
                >
                  <FilterIcon />
                  <span>{t('home.filter')}</span>
                  {filterCount > 0 && <span className="ies-filter-count">{filterCount}</span>}
                </button>
                <FilterPanel
                  open={showFilterPanel}
                  onClose={() => setShowFilterPanel(false)}
                  selected={selectedFilters}
                  onSelectionChange={setManualSelectedFilters}
                />
              </div>
            </div>
          </div>

          {selectedFilters.length > 0 && (
            <div className="ies-selected-filters-row">
              {selectedFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="ies-tag ies-selected-filter-chip"
                  onClick={() => handleRemoveSelectedFilter(filter)}
                >
                  <span>{filter}</span>
                  <CloseIcon />
                </button>
              ))}
            </div>
          )}

          {visibleResults.length > 0 && (
            <div className="ies-results-count">
              <strong>{visibleResults.length}</strong> {t('enterpriseSearch.resultsFound')}
            </div>
          )}

          <div className="ies-results">
            {visibleResults.map((item) => (
              <article key={item.id} className="ies-result-card">
                <button type="button" className="ies-result-title" onClick={() => openDetail(item)}>
                  {item.title}
                </button>
                <div className="ies-result-meta">{item.dateLabel} - {item.internalExternal}</div>
                <p className="ies-result-summary">{item.summary}</p>
                <div className="ies-result-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="ies-tag">{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="ies-detail-shell">
          <button type="button" className="ies-back-btn" onClick={handleBack}>
            <BackIcon />
            <span>{t('common.back')}</span>
          </button>

          <div className="ies-detail-header">
            <h1 className="ies-detail-title">{detailItem.title}</h1>
            <div className="ies-detail-id">ID: {detailItem.proposalId}</div>
            <div className="ies-result-tags">
              {detailItem.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="ies-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="ies-detail-stats">
            <div className="ies-stat-card"><span>{t('enterpriseSearch.client')}</span><strong>{detailItem.client}</strong></div>
            <div className="ies-stat-card"><span>{t('enterpriseSearch.year')}</span><strong>{detailItem.year}</strong></div>
            <div className="ies-stat-card"><span>{t('enterpriseSearch.dealSize')}</span><strong>{detailItem.dealSize}</strong></div>
            <div className="ies-stat-card"><span>{t('enterpriseSearch.relevance')}</span><strong>{detailItem.relevance}</strong></div>
          </div>

          <section className="ies-panel">
            <h2>{t('enterpriseSearch.overview')}</h2>
            <p>{detailItem.summary}</p>
          </section>

          <section className="ies-panel">
            <div className="ies-panel-head">
              <h2>{t('enterpriseSearch.files')}</h2>
            </div>
            <div className="ies-file-header">
              <span>{t('enterpriseSearch.fileName')}</span>
              <span>{t('enterpriseSearch.dateUpdated')}</span>
            </div>
            {detailItem.files.map((file) => (
              <div key={file.id} className="ies-file-row">
                <div className="ies-file-name">
                  <FileTypeIcon />
                  <span>{file.name}</span>
                </div>
                <div className="ies-file-actions">
                  <span>{file.updatedAt}</span>
                  <div className="ies-file-menu-wrap" ref={openFileMenuId === file.id ? fileMenuRef : null}>
                    <button type="button" className="ies-file-menu-btn" onClick={() => setOpenFileMenuId((prev) => (prev === file.id ? null : file.id))}>
                      <MoreIcon />
                    </button>
                    {openFileMenuId === file.id && (
                      <div className="ies-file-menu">
                        <button type="button" onClick={() => setOpenFileMenuId(null)}>
                          <EyeIcon />
                          <span>{t('enterpriseSearch.preview')}</span>
                        </button>
                        <button type="button" onClick={() => setOpenFileMenuId(null)}>
                          <DownloadIcon />
                          <span>{t('enterpriseSearch.download')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="ies-detail-footer">
            <button type="button" className="ies-use-btn" onClick={handleUseInProposal}>
              {t('enterpriseSearch.useInProposal')}
            </button>
          </div>

          {showAddModal && (
            <div className="ies-modal-backdrop">
              <div className="ies-modal">
                <div className="ies-modal-topbar">
                  <span>{t('enterpriseSearch.addToProposal')}</span>
                  <button type="button" onClick={() => setShowAddModal(false)}>×</button>
                </div>
                <div className="ies-modal-body">
                  <p className="ies-modal-text">
                    {t('enterpriseSearch.addReferencePrompt', { name: detailItem.title })}
                  </p>
                  <div className="ies-reference-card">
                    <h3>{detailItem.title}</h3>
                    <div className="ies-reference-meta">{detailItem.client} • {detailItem.year}</div>
                    <div className="ies-result-tags">
                      {detailItem.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="ies-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ies-proposal-list">
                    <div className="ies-proposal-list-title">
                      <FileTypeIcon />
                      <span>{t('enterpriseSearch.files')}</span>
                    </div>
                    <p className="ies-proposal-list-hint">Select the reference documents you want to add to your proposal</p>
                    <div className="ies-proposal-items">
                      <div className="ies-proposal-files-head">
                        <span>{t('enterpriseSearch.fileName')}</span>
                        <span>{t('enterpriseSearch.dateUpdated')}</span>
                        <span />
                      </div>
                      {detailItem.files.map((file) => {
                        const isSelected = selectedFileIds.includes(file.id);

                        return (
                          <label key={file.id} className="ies-proposal-file-item">
                            <div className="ies-proposal-file-main">
                              <div className="ies-proposal-item-left">
                                <FileTypeIcon />
                                <span>{file.name}</span>
                              </div>
                              <span className="ies-proposal-file-date">{file.updatedAt}</span>
                            </div>
                            <span className={`ies-proposal-radio ies-proposal-radio--round${isSelected ? ' checked' : ''}`} aria-hidden="true">
                              {isSelected && <RadioCheckedIcon />}
                            </span>
                            <input
                              type="checkbox"
                              className="ies-proposal-radio-input"
                              checked={isSelected}
                              onChange={() => handleToggleSelectedFile(file.id)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="ies-proposal-list">
                    <div className="ies-proposal-list-title">
                      <FolderIcon />
                      <span>{t('enterpriseSearch.openProposalCount', { count: openProposalTargets.length })}</span>
                    </div>
                    <p className="ies-proposal-list-hint">{t('enterpriseSearch.selectProposal')}</p>
                    <div className="ies-proposal-items">
                      <div className="ies-proposal-head">{t('manageUsers.name')}</div>
                      {openProposalTargets.map((proposal) => (
                        <label key={proposal.id} className="ies-proposal-item">
                          <div className="ies-proposal-item-left">
                            <FileTypeIcon />
                            <span>{proposal.name}</span>
                          </div>
                          <span
                            className={`ies-proposal-radio${selectedProposalId === proposal.id ? ' checked' : ''}`}
                            aria-hidden="true"
                          >
                            {selectedProposalId === proposal.id && <RadioCheckedIcon />}
                          </span>
                          <input
                            type="radio"
                            name="targetProposal"
                            className="ies-proposal-radio-input"
                            checked={selectedProposalId === proposal.id}
                            onChange={() => setSelectedProposalId(proposal.id)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ies-modal-actions">
                  <button type="button" className="ies-cancel-btn" onClick={() => setShowAddModal(false)}>
                    {t('common.cancel')}
                  </button>
                  <button type="button" className="ies-add-btn" onClick={handleAddToProposal}>
                    {t('enterpriseSearch.addToProposal')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {drawerProposalState && drawerProposalState.enterpriseReferenceCard && (
        <div />
      )}
    </div>
  );
}
