import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './UserDetailDrawer.css';

export default function UserDetailDrawer({ user, onClose }) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('User');
  const [industry, setIndustry] = useState('Finance');
  const [status, setStatus] = useState('Active');
  const [actionTaken, setActionTaken] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = user.name.split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setUserType(user.type || 'User');
      setIndustry(user.industry?.split('/')[0] || 'Finance');
      setStatus(user.status || 'Active');
      setActionTaken(null);
      setToastVisible(false);
      setSaved(false);
    }
  }, [user]);

  if (!user) return null;

  const isPending = user.status === 'Pending' && !actionTaken;
  const isDisabled = !!actionTaken;

  const handleApprove = () => {
    setActionTaken('approved');
    setStatus('Active');
    setToastVisible(true);
  };

  const handleDeny = () => {
    setActionTaken('denied');
    setStatus('Inactive');
    setToastVisible(true);
  };

  const handleDismissToast = () => {
    setToastVisible(false);
  };

  const toastMessage = actionTaken === 'approved'
    ? t('userDetail.approvedToast', { name: user.name })
    : actionTaken === 'denied'
      ? t('userDetail.deniedToast', { name: user.name })
      : '';

  return (
    <div className="ud-overlay" onClick={onClose}>
      <div className="ud-drawer" onClick={(e) => e.stopPropagation()}>
        {toastVisible && (
          <div className="ud-toast">
            <span className="ud-toast-msg">{toastMessage}</span>
            <button type="button" className="ud-toast-dismiss" onClick={handleDismissToast}>
              {t('common.dismiss')}
            </button>
          </div>
        )}

        <div className="ud-header">
          <span className="ud-header-title">{t('userDetail.title')}</span>
          <button type="button" className="ud-close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="ud-body">
          {isPending && (
            <div className="ud-info-bar">
              <div className="ud-info-text">
                <p className="ud-info-msg">
                  {t('userDetail.requestMsg', { name: user.name })}
                </p>
                <span className="ud-info-email">{user.email}</span>
              </div>
              <div className="ud-info-actions">
                <button type="button" className="ud-deny-btn" onClick={handleDeny}>{t('common.deny')}</button>
                <button type="button" className="ud-approve-btn" onClick={handleApprove}>{t('common.approve')}</button>
              </div>
            </div>
          )}

          <div className="ud-form">
            <div className="ud-field">
              <label className="ud-label">{t('userDetail.firstName')}</label>
              <input
                type="text"
                className={`ud-input ${isDisabled ? 'ud-input-disabled' : ''}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isDisabled}
              />
            </div>

            <div className="ud-field">
              <label className="ud-label">{t('userDetail.lastName')}</label>
              <input
                type="text"
                className={`ud-input ${isDisabled ? 'ud-input-disabled' : ''}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isDisabled}
              />
            </div>

            <div className="ud-field">
              <label className="ud-label">{t('userDetail.email')}</label>
              <input
                type="email"
                className={`ud-input ${isDisabled ? 'ud-input-disabled' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isDisabled}
              />
            </div>

            <div className="ud-field">
              <label className="ud-label">{t('userDetail.userType')}</label>
              <div className="ud-select-wrapper">
                <select
                  className="ud-select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="ud-select-chevron">
                  <path d="M6 8l4 4 4-4" stroke="#9FA8B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="ud-field">
              <label className="ud-label">{t('userDetail.industry')}</label>
              <div className="ud-select-wrapper">
                <select
                  className="ud-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="Finance">Finance</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Medical Care">Medical Care</option>
                  <option value="National Defence">National Defence</option>
                </select>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="ud-select-chevron">
                  <path d="M6 8l4 4 4-4" stroke="#9FA8B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="ud-field">
              <label className="ud-label">{t('userDetail.status')}</label>
              <div className="ud-select-wrapper">
                <select
                  className="ud-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="ud-select-chevron">
                  <path d="M6 8l4 4 4-4" stroke="#9FA8B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="ud-footer">
          {saved ? (
            <button type="button" className="ud-saved-btn" disabled>
              <span>{t('common.saved')}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9.5l3.5 3.5L14 5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button type="button" className="ud-save-btn" onClick={() => setSaved(true)}>
              {t('userDetail.saveBtn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
