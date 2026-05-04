import '../CSS/Start.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SynqLogo from './shared/SynqLogo';

// Hero illustration — SVG, no external file
const HeroIllustration = () => (
  <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="start-hero-svg" aria-hidden="true">
    <defs>
      <linearGradient id="synq-hero-grad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
      <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
        <stop stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5" stopOpacity="0"/>
      </radialGradient>
      {/* Clip main chat window content */}
      <clipPath id="main-clip">
        <rect x="60" y="76" width="210" height="120" rx="0"/>
      </clipPath>
      {/* Clip second window content */}
      <clipPath id="second-clip">
        <rect x="202" y="162" width="150" height="84" rx="0"/>
      </clipPath>
    </defs>

    {/* Background glow */}
    <ellipse cx="210" cy="150" rx="165" ry="120" fill="url(#hero-glow)" fillOpacity="0.18"/>

    {/* ── Main chat window ── */}
    <rect x="60" y="42" width="210" height="154" rx="14" fill="#1a1a36" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5"/>
    {/* Window title bar */}
    <rect x="60" y="42" width="210" height="34" rx="14" fill="url(#synq-hero-grad)"/>
    <rect x="60" y="56" width="210" height="20" fill="url(#synq-hero-grad)"/>
    {/* Traffic lights */}
    <circle cx="78" cy="59" r="5" fill="rgba(255,255,255,0.35)"/>
    <circle cx="94" cy="59" r="5" fill="rgba(255,255,255,0.25)"/>
    <circle cx="110" cy="59" r="5" fill="rgba(255,255,255,0.18)"/>
    {/* Window label */}
    <text x="155" y="64" fill="rgba(255,255,255,0.85)" fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif" textAnchor="middle">General</text>

    {/* Chat bubbles — clipped inside window */}
    <g clipPath="url(#main-clip)">
      <rect x="76" y="82" width="110" height="20" rx="10" fill="url(#synq-hero-grad)" opacity="0.9"/>
      <rect x="76" y="110" width="140" height="20" rx="10" fill="url(#synq-hero-grad)" opacity="0.7"/>
      <rect x="140" y="138" width="115" height="20" rx="10" fill="#2d2d50" stroke="rgba(124,58,237,0.4)" strokeWidth="1"/>
      <rect x="140" y="166" width="90" height="20" rx="10" fill="url(#synq-hero-grad)" opacity="0.55"/>
    </g>

    {/* ── Second (video) window ── */}
    <rect x="198" y="142" width="156" height="114" rx="12" fill="#13132a" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5"/>
    {/* Second window title bar */}
    <rect x="198" y="142" width="156" height="28" rx="12" fill="#1e1e3f"/>
    <rect x="198" y="156" width="156" height="14" fill="#1e1e3f"/>
    {/* Avatar dot */}
    <circle cx="214" cy="156" r="7" fill="#7c3aed" opacity="0.85"/>
    <text x="214" y="156" fill="white" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif" textAnchor="middle" dominantBaseline="central">A</text>
    <text x="260" y="160" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="Inter,sans-serif" textAnchor="middle">Video call</text>

    {/* Second window content — clipped */}
    <g clipPath="url(#second-clip)">
      <rect x="210" y="176" width="105" height="16" rx="8" fill="#7c3aed" opacity="0.65"/>
      <rect x="210" y="198" width="130" height="16" rx="8" fill="#2d2d50" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
      <rect x="210" y="220" width="88" height="16" rx="8" fill="#7c3aed" opacity="0.45"/>
    </g>

    {/* Live badge — sits on bottom edge of second window */}
    <rect x="270" y="238" width="54" height="18" rx="9" fill="#7c3aed"/>
    <text x="297" y="247" fill="white" fontSize="8" fontWeight="600" fontFamily="Inter,sans-serif" textAnchor="middle" dominantBaseline="central">● Live</text>

    {/* ── Floating avatars ── */}
    {/* Avatar A — top right */}
    <circle cx="334" cy="72" r="20" fill="url(#synq-hero-grad)" opacity="0.92"/>
    <text x="334" y="72" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif" textAnchor="middle" dominantBaseline="central">A</text>

    {/* Avatar B — bottom left */}
    <circle cx="44" cy="218" r="18" fill="#4f46e5" opacity="0.85"/>
    <text x="44" y="218" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif" textAnchor="middle" dominantBaseline="central">B</text>

    {/* Connection lines */}
    <line x1="314" y1="82" x2="280" y2="142" stroke="rgba(124,58,237,0.25)" strokeWidth="1.5" strokeDasharray="4 4"/>
    <line x1="62" y1="210" x2="90" y2="196" stroke="rgba(79,70,229,0.25)" strokeWidth="1.5" strokeDasharray="4 4"/>
  </svg>
);

function Start() {
    return (
        <div className="start-page">
            <header className="start-header">
                <Link to='/' className="start-brand">
                    <SynqLogo size={30} />
                    <span className="start-brand-name">Synq</span>
                </Link>
                <nav className="start-nav">
                    <Link to="/signin" className="start-nav-link">Sign in</Link>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" size="small" sx={{ borderRadius: '8px', fontWeight: 600, px: 2 }}>
                            Get started
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="start-main">
                <div className="start-content">
                    <div className="start-hero">
                        <div className="start-badge">✦ Real-time collaboration</div>
                        <Typography variant="h3" className="start-headline" component="h1">
                            Where you<br />stay in sync
                        </Typography>
                        <Typography variant="h6" className="start-subheadline" component="p">
                            Instant messaging, HD video calls, and smart presence — all in one beautifully minimal app.
                        </Typography>

                        <Box className="start-actions">
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className="start-btn-primary"
                                >
                                    Start for free
                                </Button>
                            </Link>
                            <Link to="/signin" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    className="start-btn-secondary"
                                >
                                    Sign in
                                </Button>
                            </Link>
                        </Box>
                    </div>

                    <div className="start-illustration">
                        <HeroIllustration />
                    </div>
                </div>

                <div className="start-features">
                    <div className="start-feature-card">
                        <div className="feature-icon-wrap feature-icon-chat">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'var(--color-text)' }}>Instant Messaging</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 0.5 }}>Real-time chat with your team, no lag, no noise.</Typography>
                    </div>
                    <div className="start-feature-card">
                        <div className="feature-icon-wrap feature-icon-video">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                        </div>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'var(--color-text)' }}>HD Video Calls</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 0.5 }}>One-click video calls with echo cancellation built in.</Typography>
                    </div>
                    <div className="start-feature-card">
                        <div className="feature-icon-wrap feature-icon-people">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'var(--color-text)' }}>Find Anyone</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 0.5 }}>Search and connect with people in seconds.</Typography>
                    </div>
                </div>
            </main>

            <footer className="start-footer">
                <span>© 2026 Synq</span>
            </footer>
        </div>
    );
}

export default Start;
