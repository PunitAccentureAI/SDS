import React from 'react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import './PageTopControls.css';

export default function PageTopControls({
  showLeftButton = true,
  onLeftButtonClick,
  leftButtonAriaLabel = 'Toggle sidebar',
}) {
  return (
    <>
      <div className="page-top-controls-left">
        {showLeftButton && (
          <button
            className="page-top-controls-toggle"
            aria-label={leftButtonAriaLabel}
            onClick={onLeftButtonClick}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="18" height="18" rx="3" stroke="#09121F" strokeWidth="1.5" fill="none" />
              <line x1="7" y1="1" x2="7" y2="19" stroke="#09121F" strokeWidth="1.5" />
            </svg>
          </button>
        )}
      </div>
      <div className="page-top-controls-right">
        <LanguageSwitcher />
      </div>
    </>
  );
}
