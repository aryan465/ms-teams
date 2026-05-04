import React, { useState } from 'react';
import '../CSS/Start.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/fbConfig';
import SynqLogo from './shared/SynqLogo';

export default function SignUp() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const makeUserDoc = async (user) => {
    await setDoc(doc(firestore, 'users', user.email), {
      name: user.displayName,
      uid: user.uid,
      email: user.email,
      chatusers: [],
      mycalls: {},
      currentuser: '',
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: `${fname} ${lname}` });
      await makeUserDoc({ ...user, displayName: `${fname} ${lname}` });
      navigate('/signin');
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join Synq and start collaborating today.</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label" htmlFor="su-fname">First Name</label>
                <input
                  id="su-fname"
                  className="auth-input"
                  type="text"
                  required
                  autoComplete="given-name"
                  autoFocus
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="su-lname">Last Name</label>
                <input
                  id="su-lname"
                  className="auth-input"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="su-email">Email</label>
              <input
                id="su-email"
                className="auth-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="su-password">Password</label>
              <input
                id="su-password"
                className="auth-input"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/signin" className="auth-link">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}