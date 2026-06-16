import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  auth, 
  googleProvider, 
  appleProvider, 
  signInWithPopup, 
  isConfigured 
} from '../config/firebase';
import './Dashboard.css';

export default function Dashboard({ onShowToast, onNavChange }) {
  const { 
    userToken, 
    userProfile, 
    loginUser, 
    registerUser, 
    loginWithFirebase,
    logoutUser, 
    fetchUserBookings 
  } = useApp();

  // Login/Register Form State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Navigation State
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'sessions', 'billing', 'profile'
  const [sessionFilter, setSessionFilter] = useState('all'); // 'all', 'upcoming', 'completed'

  // Dashboard Data State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (userToken) {
      loadBookings();
    }
  }, [userToken]);

  const loadBookings = async () => {
    setLoadingBookings(true);
    setError('');
    try {
      const data = await fetchUserBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load portal data.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        if (onShowToast) {
          onShowToast('🔑', 'Welcome back!', 'Successfully logged in to your account.');
        }
      } else {
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        await registerUser(name, email, password);
        if (onShowToast) {
          onShowToast('✨', 'Account created!', 'Your customer profile has been registered.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (isConfigured) {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();
        await loginWithFirebase(idToken, user.displayName, user.email);
        if (onShowToast) {
          onShowToast('🌐', 'Google Sign In', `Welcome back, ${user.displayName}!`);
        }
      } else {
        // Simulation/Mock mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loginWithFirebase('mock_firebase_token', 'Jane Doe (Google)', 'jane.google@example.com');
        if (onShowToast) {
          onShowToast('⚡', 'Demo Mode Login', 'Logged in with a Demo Google Account!');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (isConfigured) {
        const result = await signInWithPopup(auth, appleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();
        await loginWithFirebase(idToken, user.displayName || 'Apple User', user.email);
        if (onShowToast) {
          onShowToast('🍎', 'Apple Sign In', `Welcome back!`);
        }
      } else {
        // Simulation/Mock mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loginWithFirebase('mock_firebase_token', 'Clara Smith (Apple)', 'clara.apple@example.com');
        if (onShowToast) {
          onShowToast('⚡', 'Demo Mode Login', 'Logged in with a Demo Apple Account!');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Apple authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setBookings([]);
    setActiveSection('overview');
    if (onShowToast) {
      onShowToast('🚪', 'Logged out', 'Successfully logged out.');
    }
  };

  // Helper date parsing
  const isUpcoming = (dateStr) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sessionDate = new Date(dateStr + 'T00:00:00');
      return sessionDate >= today;
    } catch (e) {
      return true;
    }
  };

  const upcomingSessions = bookings.filter(b => b.data && isUpcoming(b.data.date));
  const pastSessions = bookings.filter(b => b.data && !isUpcoming(b.data.date));

  // Compute stats
  const totalBookings = bookings.length;
  const upcomingCount = upcomingSessions.length;
  const totalSpent = bookings.reduce((sum, b) => {
    if (b.data && b.data.amount) {
      const numeric = parseInt(b.data.amount.replace(/[^0-9]/g, ''), 10);
      return sum + (isNaN(numeric) ? 0 : numeric);
    }
    return sum;
  }, 0);

  // Extract earliest upcoming session
  const getNextSession = () => {
    if (upcomingSessions.length === 0) return null;
    // Sort upcoming by date ascending
    const sorted = [...upcomingSessions].sort((a, b) => {
      return new Date(a.data.date + 'T' + a.data.time) - new Date(b.data.date + 'T' + b.data.time);
    });
    return sorted[0];
  };
  const nextSession = getNextSession();

  // Date styling formats
  const getDayNum = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr + 'T00:00:00').getDate();
    } catch (e) {
      return '';
    }
  };

  const getMonthAbbr = (dateStr) => {
    if (!dateStr) return '';
    try {
      const MONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return MONS[new Date(dateStr + 'T00:00:00').getMonth()];
    } catch (e) {
      return '';
    }
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    try {
      const dt = new Date(iso + 'T00:00:00');
      const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return DAYS[dt.getDay()] + ', ' + dt.getDate() + ' ' + MONS[dt.getMonth()] + ' ' + dt.getFullYear();
    } catch (e) {
      return iso;
    }
  };

  // Render Login/Register View
  if (!userToken) {
    return (
      <div className="auth-page-wrap">
        <div className="auth-neon-glow-top"></div>
        <div className="auth-neon-glow-bottom"></div>
        
        <div className="auth-card">
          <div className="auth-card-border-glow"></div>
          
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Join the Platform'}</h2>
            <p className="auth-sub">
              {isLogin 
                ? 'Sign in to access your booked sessions & operations' 
                : 'Create an account to book sessions with vetted experts'}
            </p>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="auth-social-buttons">
            <button 
              type="button" 
              className="social-btn google" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button 
              type="button" 
              className="social-btn apple" 
              onClick={handleAppleLogin}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-err">{error}</div>}

            {!isLogin && (
              <div className="auth-fld-g">
                <input 
                  type="text" 
                  id="reg-name"
                  placeholder=" " 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="reg-name">Your Full Name</label>
                <div className="fld-focus-line"></div>
              </div>
            )}

            <div className="auth-fld-g">
              <input 
                type="email" 
                id="login-email"
                placeholder=" " 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="login-email">Email Address</label>
              <div className="fld-focus-line"></div>
            </div>

            <div className="auth-fld-g">
              <input 
                type="password" 
                id="login-pass"
                placeholder=" " 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="login-pass">Password</label>
              <div className="fld-focus-line"></div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner">
                  <svg className="spin" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.2-8.6" fill="none" stroke="currentColor" strokeWidth="3"/></svg>
                  Processing...
                </span>
              ) : isLogin ? 'Sign In to Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <span>
              {isLogin ? "New to Bold & Brilliant? " : "Already have an account? "}
              <button 
                type="button" 
                className="auth-toggle" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Sign up here' : 'Log in here'}
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Premium Management Portal View
  return (
    <div className="portal-layout">
      {/* Background Neon Blobs */}
      <div className="portal-glow-top"></div>
      <div className="portal-glow-bottom"></div>

      {/* Left Navigation Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-brand">
          <div className="sb-logo">B</div>
          <div className="sb-meta">
            <h3>BBG Portal</h3>
            <span>Client Desk</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="su-avatar">
            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            <div className="su-status-dot"></div>
          </div>
          <div className="su-info">
            <h4 title={userProfile?.name}>{userProfile?.name || 'Client User'}</h4>
            <span title={userProfile?.email}>{userProfile?.email || 'customer@example.com'}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-item${activeSection === 'overview' ? ' active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
            Overview
          </button>
          <button 
            className={`menu-item${activeSection === 'sessions' ? ' active' : ''}`}
            onClick={() => setActiveSection('sessions')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            My Sessions
            {upcomingCount > 0 && <span className="menu-badge">{upcomingCount}</span>}
          </button>
          <button 
            className={`menu-item${activeSection === 'billing' ? ' active' : ''}`}
            onClick={() => setActiveSection('billing')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Billing Ledger
          </button>
          <button 
            className={`menu-item${activeSection === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile Desk
          </button>
        </nav>

        <button onClick={handleLogout} className="sidebar-logout">
          <svg viewBox="0 0 24 24" className="menu-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </aside>

      {/* Main Content Workspace */}
      <main className="portal-main">
        {loadingBookings ? (
          <div className="portal-workspace-loading">
            <svg className="spin" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.2-8.6" fill="none" stroke="currentColor" strokeWidth="3.5"/></svg>
            <h3>Synchronizing portal details...</h3>
            <p>Gathering session rosters and ledger records securely.</p>
          </div>
        ) : (
          <div className="workspace-inner fade-in-workspace">
            {/* OVERVIEW PANEL */}
            {activeSection === 'overview' && (
              <div className="overview-workspace">
                {/* Greeting banner */}
                <div className="overview-banner">
                  <div className="banner-g"></div>
                  <div className="banner-txt">
                    <h2>Hello, {userProfile?.name ? userProfile.name.split(' ')[0] : 'Explorer'}!</h2>
                    <p>Welcome to your operational headquarters. You have {upcomingCount} upcoming sessions scheduled.</p>
                  </div>
                </div>

                {/* Metrics Cards grid */}
                <div className="metrics-grid">
                  <div className="metric-c bookings">
                    <div className="mc-head">
                      <span>Total Booked</span>
                      <div className="mc-icon">🏆</div>
                    </div>
                    <h3>{totalBookings}</h3>
                    <div className="mc-bar"><div className="mc-bar-progress" style={{ width: `${Math.min(totalBookings * 10, 100)}%` }}></div></div>
                  </div>

                  <div className="metric-c active-sessions">
                    <div className="mc-head">
                      <span>Upcoming Sessions</span>
                      <div className="mc-icon">🗓️</div>
                    </div>
                    <h3 style={{ color: 'var(--rose)' }}>{upcomingCount}</h3>
                    <div className="mc-bar"><div className="mc-bar-progress" style={{ width: `${Math.min(upcomingCount * 25, 100)}%`, background: 'var(--rose)' }}></div></div>
                  </div>

                  <div className="metric-c billing">
                    <div className="mc-head">
                      <span>Total Invested</span>
                      <div className="mc-icon">💎</div>
                    </div>
                    <h3>${totalSpent}</h3>
                    <div className="mc-bar"><div className="mc-bar-progress" style={{ width: `${Math.min(totalSpent / 5, 100)}%`, background: '#EAB308' }}></div></div>
                  </div>
                </div>

                {/* Split Widgets */}
                <div className="overview-split-grid">
                  {/* Next session widget */}
                  <div className="next-session-widget">
                    <div className="widget-header">
                      <h4>Next Scheduled Session</h4>
                      <span className="live-pulse">Ready</span>
                    </div>
                    {nextSession ? (
                      <div className="ns-content">
                        <div className="ns-mentor-row">
                          <div className="ns-ava">{nextSession.data.mentor.charAt(0)}</div>
                          <div className="ns-mentor-info">
                            <h5>{nextSession.data.mentor}</h5>
                            <span>Professional Mentor</span>
                          </div>
                        </div>
                        <div className="ns-details-list">
                          <div className="nsd-item">
                            <span className="l">Schedule Date</span>
                            <span className="v">{fmtDate(nextSession.data.date)}</span>
                          </div>
                          <div className="nsd-item">
                            <span className="l">Session Time</span>
                            <span className="v">{nextSession.data.time}</span>
                          </div>
                          <div className="nsd-item">
                            <span className="l">Duration Slot</span>
                            <span className="v">{nextSession.data.duration} Mins</span>
                          </div>
                        </div>
                        <div className="ns-actions">
                          <a 
                            href="https://meet.google.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="ns-join-btn"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            Launch Meeting
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="ns-empty">
                        <span className="ne-emoji">☕</span>
                        <p>No upcoming sessions scheduled. Need advice?</p>
                        <button onClick={() => onNavChange('mentorship')} className="ns-book-shortcut">
                          Book Mentor
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent Activity Mini Ledger */}
                  <div className="recent-activity-widget">
                    <div className="widget-header">
                      <h4>Recent Purchases</h4>
                      <button className="widget-view-all" onClick={() => setActiveSection('billing')}>View All</button>
                    </div>
                    {bookings.length === 0 ? (
                      <div className="ra-empty">
                        <p>No transaction history logged yet.</p>
                      </div>
                    ) : (
                      <div className="ra-list">
                        {bookings.slice(0, 3).map(b => (
                          <div key={b._id} className="ra-item">
                            <div className="ra-meta">
                              <strong>Mentorship with {b.data.mentor}</strong>
                              <span>{new Date(b.created_at || b.data.submitted_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="ra-value">
                              <span className="ra-amount">{b.data.amount}</span>
                              <span className="ra-status">Paid</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SESSIONS PANEL */}
            {activeSection === 'sessions' && (
              <div className="sessions-workspace">
                <div className="ws-title-row">
                  <div>
                    <h2>Mentorship Sessions</h2>
                    <p>Track your scheduled video calls and professional operations.</p>
                  </div>
                  <button onClick={() => onNavChange('mentorship')} className="btn-p">
                    + Book New Session
                  </button>
                </div>

                {/* Filters Row */}
                <div className="sessions-filters">
                  <button className={`filter-tab${sessionFilter === 'all' ? ' on' : ''}`} onClick={() => setSessionFilter('all')}>
                    All Sessions ({bookings.length})
                  </button>
                  <button className={`filter-tab${sessionFilter === 'upcoming' ? ' on' : ''}`} onClick={() => setSessionFilter('upcoming')}>
                    Upcoming ({upcomingSessions.length})
                  </button>
                  <button className={`filter-tab${sessionFilter === 'completed' ? ' on' : ''}`} onClick={() => setSessionFilter('completed')}>
                    Completed ({pastSessions.length})
                  </button>
                </div>

                {/* Session roster list */}
                <div className="sessions-grid-wrapper">
                  {(sessionFilter === 'all' ? bookings : sessionFilter === 'upcoming' ? upcomingSessions : pastSessions).length === 0 ? (
                    <div className="dash-empty">
                      <span className="de-icon">📅</span>
                      <h3>No records match the filter</h3>
                      <p>Your scheduled consultations will be logged in this section.</p>
                    </div>
                  ) : (
                    <div className="sessions-grid">
                      {(sessionFilter === 'all' ? bookings : sessionFilter === 'upcoming' ? upcomingSessions : pastSessions).map(b => {
                        const upcoming = isUpcoming(b.data.date);
                        return (
                          <div key={b._id} className={`session-card-p${upcoming ? ' upcoming' : ' completed'}`}>
                            <div className="sc-date-block">
                              <span className="sc-month">{getMonthAbbr(b.data.date)}</span>
                              <span className="sc-day">{getDayNum(b.data.date)}</span>
                            </div>

                            <div className="sc-info-block">
                              <div className="sc-mentor-meta">
                                <h4>{b.data.mentor}</h4>
                                <span className="sc-title">Mentor Profile</span>
                              </div>

                              <div className="sc-params">
                                <div className="scp-i">
                                  <span>Time Slot</span>
                                  <strong>{b.data.time}</strong>
                                </div>
                                <div className="scp-i">
                                  <span>Duration</span>
                                  <strong>{b.data.duration} mins</strong>
                                </div>
                                <div className="scp-i">
                                  <span>Invested</span>
                                  <strong>{b.data.amount}</strong>
                                </div>
                              </div>

                              <div className="sc-footer-actions">
                                <span className={`sc-status-badge ${upcoming ? 'scheduled' : 'completed'}`}>
                                  {upcoming ? 'Scheduled' : 'Completed'}
                                </span>
                                {upcoming && (
                                  <a 
                                    href="https://meet.google.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="sc-meet-btn"
                                  >
                                    Join Call
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BILLING LEDGER PANEL */}
            {activeSection === 'billing' && (
              <div className="billing-workspace">
                <div className="ws-title-row">
                  <div>
                    <h2>Billing & Invoices</h2>
                    <p>Access receipts and checkout history logs managed by Stripe.</p>
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="dash-empty">
                    <span className="de-icon">💳</span>
                    <h3>No invoice records loaded</h3>
                    <p>All completed Stripe transactions will show up here.</p>
                  </div>
                ) : (
                  <div className="ledger-table-wrapper">
                    <table className="ledger-table">
                      <thead>
                        <tr>
                          <th>Payment Date</th>
                          <th>Description</th>
                          <th>Session Details</th>
                          <th>Invoice Ref</th>
                          <th>Status</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td>{new Date(b.created_at || b.data.submitted_at || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>
                              <div className="invoice-desc-col">
                                <strong>Mentorship with {b.data.mentor}</strong>
                                <span>Session Invoice</span>
                              </div>
                            </td>
                            <td>{fmtDate(b.data.date)} at {b.data.time}</td>
                            <td className="monospace-ref" title={b.data.stripe_session_id || 'mock_checkout_session_id'}>
                              {b.data.stripe_session_id ? b.data.stripe_session_id.substring(0, 16) + '...' : 'mock_invoice_id'}
                            </td>
                            <td>
                              <span className="status-pill paid">Paid</span>
                            </td>
                            <td className="amount-col">{b.data.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE SETTINGS PANEL */}
            {activeSection === 'profile' && (
              <div className="profile-workspace">
                <div className="ws-title-row">
                  <div>
                    <h2>Profile Settings</h2>
                    <p>View your platform credentials and verification status details.</p>
                  </div>
                </div>

                <div className="profile-settings-card">
                  <div className="psc-glow"></div>
                  <div className="profile-header-group">
                    <div className="psc-avatar">
                      {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3>{userProfile?.name || 'Client User'}</h3>
                      <span>Platform Member</span>
                    </div>
                  </div>

                  <div className="profile-details-grid">
                    <div className="pd-row">
                      <span className="lbl">Email Account</span>
                      <strong className="val">{userProfile?.email}</strong>
                    </div>
                    <div className="pd-row">
                      <span className="lbl">Account Type</span>
                      <strong className="val">Platform Customer</strong>
                    </div>
                    <div className="pd-row">
                      <span className="lbl">Verified Status</span>
                      <strong className="val" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="status-dot-green"></span> Approved
                      </strong>
                    </div>
                    <div className="pd-row">
                      <span className="lbl">Linked Provider</span>
                      <strong className="val">Social Sign-In (Firebase)</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
