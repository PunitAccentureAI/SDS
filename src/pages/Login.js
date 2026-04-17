import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FloatingInput from '../components/ui/FloatingInput';
import { login, validateEmail } from '../services/authService';
import './Login.css';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [emailChecking, setEmailChecking] = useState(false);

  const isValidEmailFormat = (addr) => /\S+@\S+\.\S+/.test(addr);

  const isUserActive = (payload) => {
    if (typeof payload === 'boolean') return payload;
    if (!payload || typeof payload !== 'object') return true;

    if (typeof payload.active === 'boolean') return payload.active;
    if (typeof payload.isActive === 'boolean') return payload.isActive;
    if (typeof payload.enabled === 'boolean') return payload.enabled;
    if (typeof payload.valid === 'boolean') return payload.valid;
    if (typeof payload.success === 'boolean') return payload.success;
    if (typeof payload.status === 'string') return payload.status.toLowerCase() === 'active';

    return true;
  };

  const handleEmailBlur = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
      return;
    }

    setEmailChecking(true);

    try {
      const result = await validateEmail(normalizedEmail);

      if (!isUserActive(result)) {
        setErrorType('expired');
      } else if (errorType === 'expired') {
        setErrorType(null);
      }
    } catch (error) {
      setErrorType('expired');
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorType(null);
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result?.success) {
        navigate('/');
        return;
      }

      setErrorType('invalid');
    } catch (error) {
      setErrorType('invalid');
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    if (errorType) setErrorType(null);
  };

  const expiredContent = (
    <>
      {t('login.expiredUser')}{' '}
      <a href="/contact">{t('login.contactUs')}</a>{' '}
      {t('login.expiredSuffix')}
    </>
  );

  return (
    <div className="login-page d-flex flex-column min-vh-100">
      <header className="login-header">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="login-brand">{t('brand.samsungSds')}</div>
        </div>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="login-form-wrapper">
          <div className="login-heading">
            <h1 className="login-title">{t('login.title1')}</h1>
            <h1 className="login-title">{t('login.title2')}</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-fields">
              <FloatingInput
                label={t('login.email')}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                onBlur={handleEmailBlur}
                required
                error={errorType === 'invalid' || errorType === 'expired'}
                errorContent={errorType === 'expired' ? expiredContent : null}
              />
              <FloatingInput
                label={t('login.password')}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                required
                error={errorType === 'invalid'}
              />
            </div>

            {errorType === 'invalid' && (
              <div className="login-error-banner">
                <div className="login-error-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#C22B3F" />
                    <text x="8" y="12" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">!</text>
                  </svg>
                </div>
                <div className="login-error-text">
                  {t('login.invalidCredentials')}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-btn w-100"
              disabled={loading || emailChecking}
            >
              {loading || emailChecking ? (
                <span className="login-spinner" />
              ) : (
                t('login.loginBtn')
              )}
            </button>

            <p className="text-center login-signup-text">
              {t('login.noAccount')}{' '}
              <Link to="/request-access" className="login-link">
                {t('login.requestAccess')}
              </Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="login-footer text-center">
        <p className="mb-0">{t('login.footer')}</p>
      </footer>
    </div>
  );
}
