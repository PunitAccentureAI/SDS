import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './NotFound.css';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="nf-page">
      <header className="nf-topbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
          <span className="nf-logo">{t('brand.samsungSds')}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="nf-content">
        <span className="nf-code">{t('notFound.code')}</span>
        <h1 className="nf-title">{t('notFound.title')}</h1>
        <p className="nf-subtitle">
          {t('notFound.subtitle')}
        </p>
        <p className="nf-desc">
          {t('notFound.description')}
        </p>

        <div className="nf-actions">
          <button type="button" className="nf-btn-secondary" onClick={() => navigate(-1)}>
            {t('common.goBack')}
          </button>
          <button type="button" className="nf-btn-primary" onClick={() => navigate('/login')}>
            {t('common.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
