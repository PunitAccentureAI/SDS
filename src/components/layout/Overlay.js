import React from 'react';
import './Overlay.css';

export default function Overlay({ show, onClick, children }) {
  if (!show) return null;

  return (
    <div className="overlay-backdrop" onClick={onClick}>
      {children}
    </div>
  );
}
