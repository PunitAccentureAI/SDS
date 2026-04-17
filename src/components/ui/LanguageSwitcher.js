import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'ko' : 'en');
  };

  return (
    <button type="button" className="lang-switcher" onClick={toggleLang}>
      <span className={`lang-option ${currentLang === 'en' ? 'lang-active' : ''}`}>EN</span>
      <span className="lang-divider">|</span>
      <span className={`lang-option ${currentLang === 'ko' ? 'lang-active' : ''}`}>한</span>
    </button>
  );
}
