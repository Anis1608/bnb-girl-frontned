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

  // Dashboard Data State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'history'

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
      setError('Failed to load your booking history.');
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

  // Render Dashboard View
  return (
    <div className="dash-page-wrap">
      <div className="dash-glow"></div>
      
      <div className="dash-container">
        {/* Header */}
        <header className="dash-header">
          <div className="dh-info">
            <h1 className="dh-title">Welcome Back, <em>{userProfile?.name || 'Explorer'}!</em></h1>
            <p className="dh-sub">Monitor your mentorship session bookings, schedules, and Stripe transaction history.</p>
          </div>
          <button onClick={handleLogout} className="dash-logout-btn">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Log Out
          </button>
        </header>

        {/* Stats Matrix */}
        <div className="dash-stats">
          <div className="dstat">
            <span className="dstat-lbl">Total Bookings</span>
            <span className="dstat-val">{totalBookings}</span>
          </div>
          <div className="dstat">
            <span className="dstat-lbl">Upcoming Sessions</span>
            <span className="dstat-val" style={{ color: '#EC4899' }}>{upcomingCount}</span>
          </div>
          <div className="dstat">
            <span className="dstat-lbl">Total Invested</span>
            <span className="dstat-val">${totalSpent}</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="dash-content-box">
          <div className="dash-tabs">
            <button 
              className={`dtab-btn${activeTab === 'upcoming' ? ' on' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Sessions ({upcomingCount})
            </button>
            <button 
              className={`dtab-btn${activeTab === 'history' ? ' on' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Booking & Payment History
            </button>
          </div>

          <div className="dash-panel">
            {loadingBookings ? (
              <div className="dash-loading">
                <svg className="spin" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
                <span>Loading your sessions...</span>
              </div>
            ) : activeTab === 'upcoming' ? (
              <div className="bookings-list">
                {upcomingSessions.length === 0 ? (
                  <div className="dash-empty">
                    <span className="de-icon">🗓️</span>
                    <h3>No upcoming sessions scheduled</h3>
                    <p>Connect with our expert mentors to jumpstart your operational skillsets.</p>
                    <button 
                      onClick={() => onNavChange('mentorship')} 
                      className="btn-p"
                      style={{ marginTop: '16px', display: 'inline-flex' }}
                    >
                      Book a Session
                    </button>
                  </div>
                ) : (
                  upcomingSessions.map(b => (
                    <div key={b._id} className="booking-card">
                      <div className="bc-header">
                        <div className="bc-mentor">
                          <div className="bc-ava">{(b.data.mentor || 'M').charAt(0)}</div>
                          <div>
                            <h4>{b.data.mentor}</h4>
                            <span>Mentor Profile</span>
                          </div>
                        </div>
                        <span className="bc-badge">Upcoming</span>
                      </div>
                      
                      <div className="bc-details">
                        <div className="bcd-i">
                          <span className="k">Date & Time</span>
                          <span className="v">{fmtDate(b.data.date)} at {b.data.time}</span>
                        </div>
                        <div className="bcd-i">
                          <span className="k">Duration</span>
                          <span className="v">{b.data.duration} minutes</span>
                        </div>
                        <div className="bcd-i">
                          <span className="k">Amount Paid</span>
                          <span className="v" style={{ color: '#EC4899' }}>{b.data.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="history-list">
                {pastSessions.length === 0 && upcomingSessions.length === 0 ? (
                  <div className="dash-empty">
                    <span className="de-icon">💳</span>
                    <h3>No transaction history found</h3>
                    <p>Your Stripe payments and session history will be logged here.</p>
                  </div>
                ) : (
                  <div className="history-table-wrapper">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Payment Date</th>
                          <th>Description</th>
                          <th>Session Time</th>
                          <th>Stripe Transaction ID</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td style={{ fontWeight: '500' }}>{new Date(b.created_at || b.data.submitted_at || Date.now()).toLocaleDateString()}</td>
                            <td>
                              <div style={{ fontWeight: '600' }}>Mentorship with {b.data.mentor}</div>
                              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{b.data.duration} mins session</span>
                            </td>
                            <td>{fmtDate(b.data.date)} · {b.data.time}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#9CA3AF' }}>
                              {b.data.stripe_session_id || 'mock_checkout_session_id'}
                            </td>
                            <td style={{ fontWeight: '600', color: '#EC4899' }}>{b.data.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
