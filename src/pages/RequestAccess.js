import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './RequestAccess.css';

const industryOptions = [
  'The Public',
  'National Defence',
  'Finance',
  'Manufacturing',
  'Service',
  'Medical Care',
  'Logistics',
];

export default function RequestAccess() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIndustrySelect = (opt) => {
    setSelectedIndustry(opt);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="ra-page">
      <header className="ra-topbar">
        <span className="ra-logo">{t('brand.samsungSds')}</span>
      </header>

      <main className="ra-main">
        <div className="ra-form-wrapper">
          <div className="ra-heading">
            <h1 className="ra-title">{t('requestAccess.title1')}</h1>
            <h1 className="ra-title">{t('requestAccess.title2')}</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ra-fields">
              <div className="ra-input-group">
                <input
                  type="text"
                  className="ra-input"
                  id="ra-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('requestAccess.firstName')}
                />
              </div>

              <div className="ra-input-group">
                <input
                  type="text"
                  className="ra-input"
                  id="ra-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('requestAccess.lastName')}
                />
              </div>

              <div className="ra-dropdown-wrapper" ref={dropdownRef}>
                <div
                  className={`ra-industry-box ${dropdownOpen ? 'ra-industry-box-open' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDropdownOpen((prev) => !prev);
                    }
                  }}
                >
                  <div className="ra-industry-content">
                    <span className="ra-industry-placeholder">
                      {selectedIndustry || t('requestAccess.chooseIndustry')}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`ra-dropdown-chevron ${dropdownOpen ? 'ra-chevron-up' : ''}`}
                    >
                      <path d="M6 8l4 4 4-4" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="ra-dropdown-panel">
                    {industryOptions.map((opt) => {
                      return (
                        <button
                          key={opt}
                          type="button"
                          className="ra-dropdown-item"
                          onClick={() => handleIndustrySelect(opt)}
                        >
                          <span className="ra-dropdown-label">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="ra-submit-btn">
              {t('requestAccess.requestBtn')}
            </button>

            <p className="ra-login-link-text">
              {t('requestAccess.hasAccount')}{' '}
              <Link to="/login" className="ra-login-link">{t('requestAccess.loginLink')}</Link>
            </p>
          </form>
        </div>
      </main>

      {submitted && (
        <div className="ra-popup-overlay">
          <div className="ra-popup-card">
            <div className="ra-popup-icon">
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="20" width="90" height="65" rx="8" fill="#5BA0E8" />
                <rect x="12" y="24" width="82" height="57" rx="6" fill="#6AB0F0" />
                <path d="M12 30L53 62L94 30" stroke="#4A90D9" strokeWidth="3" fill="none" />
                <path d="M12 81L40 58" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" />
                <path d="M94 81L66 58" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" />
                <polygon points="75,10 112,35 85,30" fill="#B0BEC5" />
                <polygon points="78,12 108,33 86,29" fill="#CFD8DC" />
              </svg>
            </div>

            <h2 className="ra-popup-title">{t('contactAdmin.title')}</h2>
            <p className="ra-popup-desc">
              {t('contactAdmin.message')} <strong>{t('contactAdmin.email')}</strong> {t('contactAdmin.suffix')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
