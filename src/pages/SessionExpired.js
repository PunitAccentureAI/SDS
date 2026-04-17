import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SessionExpired.css';

export default function SessionExpired() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="se-overlay">
      <div className="se-card">
        <div className="se-clock">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="56" fill="#4A90D9" />
            <circle cx="60" cy="60" r="52" fill="#5BA0E8" />
            <circle cx="60" cy="60" r="46" fill="#6AB0F0" />
            <circle cx="60" cy="60" r="4" fill="#FFFFFF" />
            {/* Hour markers */}
            <rect x="58" y="16" width="4" height="10" rx="2" fill="#FFFFFF" opacity="0.8" />
            <rect x="58" y="94" width="4" height="10" rx="2" fill="#FFFFFF" opacity="0.8" />
            <rect x="94" y="58" width="10" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
            <rect x="16" y="58" width="10" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
            {/* Hour hand */}
            <line x1="60" y1="60" x2="60" y2="34" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            {/* Minute hand */}
            <line x1="60" y1="60" x2="82" y2="48" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="se-title">{t('sessionExpired.title')}</h1>
        <p className="se-desc">
          {t('sessionExpired.description')}
        </p>

        <button
          type="button"
          className="se-btn"
          onClick={() => navigate('/login')}
        >
          {t('common.backToLogin')}
        </button>
      </div>
    </div>
  );
}
