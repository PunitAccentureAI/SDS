import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './Loader.css';

export default function Loader({ message }) {
  const { t } = useTranslation();
  return (
    <div className="loader-page">
      <header className="loader-topbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
          <span className="loader-logo">{t('brand.samsungSds')}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="loader-center">
        <div className="loader-spinner" />
        <p className="loader-text">{message || t('loader.message')}</p>
      </div>
    </div>
  );
}
