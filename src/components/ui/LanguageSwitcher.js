import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const resolvedLang = String(i18n.language || 'en').toLowerCase();
  const currentLang = resolvedLang.startsWith('ko') ? 'ko' : 'en';
  const currentLabel = currentLang === 'ko' ? 'KO' : 'EN';

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-trigger"
        aria-label="Language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="lang-current">{currentLabel}</span>
        <svg className="lang-chevron" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 8l4 4 4-4" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="lang-menu" role="menu" aria-label="Language options">
          <button
            type="button"
            role="menuitem"
            className={`lang-menu-item${currentLang === 'en' ? ' active' : ''}`}
            onClick={() => {
              i18n.changeLanguage('en');
              setOpen(false);
            }}
          >
            EN
          </button>
          <button
            type="button"
            role="menuitem"
            className={`lang-menu-item${currentLang === 'ko' ? ' active' : ''}`}
            onClick={() => {
              i18n.changeLanguage('ko');
              setOpen(false);
            }}
          >
            KO
          </button>
        </div>
      )}
    </div>
  );
}
