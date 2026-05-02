import '../CSS/Start.css';
import titlelogo from '../Logo/video-call (1).png';
import bg from '../Logo/sbg.png';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Start() {
    return (
        <div className="start-page">
            <header className="start-header">
                <Link to='/' className="start-brand">
                    <img src={titlelogo} alt="Microsoft Teams" className="start-logo" />
                    <span className="start-brand-name">Microsoft Teams</span>
                </Link>
            </header>

            <main className="start-main">
                <div className="start-content">
                    <div className="start-hero">
                        <Typography variant="h3" className="start-headline" component="h1">
                            Connect, collaborate,<br />and get more done
                        </Typography>
                        <Typography variant="h6" className="start-subheadline" component="p">
                            Chat with teammates, make video calls, and stay on the same page — all in one place.
                        </Typography>

                        <Box className="start-actions">
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className="start-btn-primary"
                                >
                                    Get started for free
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
                        <img src={bg} alt="Teams collaboration" className="start-bg-image" />
                    </div>
                </div>

                <div className="start-features">
                    <div className="start-feature-card">
                        <div className="feature-icon chat-icon">💬</div>
                        <Typography variant="subtitle1" fontWeight={600}>Instant Messaging</Typography>
                        <Typography variant="body2" color="text.secondary">Send messages, share files and stay connected with your team in real time.</Typography>
                    </div>
                    <div className="start-feature-card">
                        <div className="feature-icon video-icon">📹</div>
                        <Typography variant="subtitle1" fontWeight={600}>Video Calling</Typography>
                        <Typography variant="body2" color="text.secondary">Start high-quality video calls directly from the app — no extra setup needed.</Typography>
                    </div>
                    <div className="start-feature-card">
                        <div className="feature-icon people-icon">👥</div>
                        <Typography variant="subtitle1" fontWeight={600}>Find People</Typography>
                        <Typography variant="body2" color="text.secondary">Search and connect with teammates instantly from anywhere in your organization.</Typography>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Start;