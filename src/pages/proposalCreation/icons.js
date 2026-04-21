import React from 'react';

export function DocMenuIconEye() {
  return (
    <svg className="pcr-doctab-menu-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function DocMenuIconDownload() {
  return (
    <svg className="pcr-doctab-menu-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocMenuIconDelete() {
  return (
    <svg className="pcr-doctab-menu-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#000" />
      <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#000" />
      <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#000" />
    </svg>
  );
}

export function ReplyCloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
