import React, { useState } from 'react';
import './FloatingInput.css';

export default function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  required,
  error,
  errorContent,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  let wrapperClass = 'floating-input-wrapper';
  if (error) wrapperClass += ' error';
  else if (focused) wrapperClass += ' focused';
  else if (hasValue) wrapperClass += ' filled';

  return (
    <div>
      <div className={wrapperClass}>
        <input
          type={type}
          className="floating-input"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          required={required}
        />
        <label className="floating-label">{label}</label>
      </div>
      {error && errorContent && (
        <div className="floating-input-error-text">
          {errorContent}
        </div>
      )}
    </div>
  );
}
