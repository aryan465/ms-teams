import React, { useState } from 'react';
import '../CSS/Start.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/fbConfig';
import SynqLogo from './shared/SynqLogo';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/ \(.*\)/, ''));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter your email address above first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/ \(.*\)/, ''));
    } finally {
      setLoading(false);
    }
  };

  const exitResetMode = () => {
    setResetMode(false);
    setResetSent(false);
    setError('');
  };

  return (
    <div className="auth-page">
      <header className="start-header">
        <Link to='/' className="start-brand">
          <SynqLogo size={30} />
          <span className="start-brand-name">Synq</span>
        </Link>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <SynqLogo size={44} />
          </div>

          {resetMode ? (
            <>
              <h1 className="auth-title">Reset password</h1>
              <p className="auth-subtitle">
                {resetSent
                  ? 'Check your inbox — we sent a reset link.'
                  : 'Enter your email and we\'ll send you a reset link.'}
              </p>

              {error && <div className="auth-error">{error}</div>}

              {!resetSent && (
                <form className="auth-form" onSubmit={handleReset}>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="ri-email">Email</label>
                    <input
                      id="ri-email"
                      className="auth-input"
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? <span className="auth-spinner" /> : 'Send reset link'}
                  </button>
                </form>
              )}

              <p className="auth-footer-text" style={{ marginTop: resetSent ? 24 : 16 }}>
                <button
                  className="auth-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                  onClick={exitResetMode}
                >
                  ← Back to sign in
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="auth-title">Sign in</h1>
              <p className="auth-subtitle">Welcome back — good to see you again.</p>

              {error && <div className="auth-error">{error}</div>}

              <form className="auth-form" onSubmit={handleSignin}>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="si-email">Email</label>
                  <input
                    id="si-email"
                    className="auth-input"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label className="auth-label" htmlFor="si-password">Password</label>
                    <button
                      type="button"
                      className="auth-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', fontSize: 13 }}
                      onClick={() => { setError(''); setResetMode(true); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="si-password"
                    className="auth-input"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : 'Sign In'}
                </button>
              </form>

              <p className="auth-footer-text">
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">Sign Up</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}