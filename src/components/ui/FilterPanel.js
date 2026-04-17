import React, { useRef, useEffect } from 'react';
import './FilterPanel.css';

export const filterGroups = [
  {
    label: 'Industry',
    options: [
      'The Public', 'National Defence', 'Finance', 'Manufacturing',
      'Service', 'Medical Care', 'Logistics',
    ],
  },
  {
    label: 'Service',
    options: [
      'Cloud Transformation', 'AI Contact Center', 'SaaS Transformation',
      'Security', 'App ITO', 'Consulting', 'Network', 'ERP',
      'Standard Cloud', 'Gen AI Transformation', 'PLM', 'Cloud App ITO',
      'Telecom NW', 'CRM', 'Finance Service System', 'Portal',
      'Dedicated Cloud', 'Data Center', 'EFSS', 'RPA',
    ],
  },
  {
    label: 'Deal size',
    options: ['Class S', 'Class A', 'Class B', 'Class C'],
  },
];

export default function FilterPanel({ open, onClose, selected, onSelectionChange }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const toggleItem = (item) => {
    if (selected.includes(item)) {
      onSelectionChange(selected.filter((s) => s !== item));
    } else {
      onSelectionChange([...selected, item]);
    }
  };

  return (
    <div className="fp-panel" ref={ref}>
      {filterGroups.map((group) => (
        <div key={group.label} className="fp-group">
          <div className="fp-group-header">{group.label}</div>
          {group.options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <label key={opt} className="fp-item">
                <input
                  type="checkbox"
                  className="fp-checkbox-hidden"
                  checked={isChecked}
                  onChange={() => toggleItem(opt)}
                />
                <span className={`fp-checkbox ${isChecked ? 'checked' : ''}`}>
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="fp-label">{opt}</span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}
