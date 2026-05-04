import React, { useState } from 'react';
import '../CSS/Start.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/fbConfig';
import SynqLogo from './shared/SynqLogo';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
              <label className="auth-label" htmlFor="si-password">Password</label>
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
        </div>
      </main>
    </div>
  );
}