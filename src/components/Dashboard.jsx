import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

export default function Dashboard({ onShowToast, onNavChange }) {
  const { 
    userToken, 
    userProfile, 
    loginUser, 
    registerUser, 
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
        <div className="auth-glow"></div>
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p className="auth-sub">
              {isLogin 
                ? 'Sign in to access your booked sessions and details' 
                : 'Join us to schedule 1-on-1 sessions with verified mentors'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-err">{error}</div>}

            {!isLogin && (
              <div className="auth-fld">
                <label>Your Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Doe" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="auth-fld">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-fld">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            <span>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="auth-toggle" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
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
            <h1 className="dh-title">Hello, <em>{userProfile?.name || 'Explorer'}!</em></h1>
            <p className="dh-sub">Manage your mentorship sessions and checkout details here.</p>
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
            <span className="dstat-val" style={{ color: 'var(--rose)' }}>{upcomingCount}</span>
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
                          <span className="v" style={{ color: 'var(--rose)' }}>{b.data.amount}</span>
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
                              <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>{b.data.duration} mins session</span>
                            </td>
                            <td>{fmtDate(b.data.date)} · {b.data.time}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>
                              {b.data.stripe_session_id || 'mock_checkout_session_id'}
                            </td>
                            <td style={{ fontWeight: '600', color: 'var(--rose)' }}>{b.data.amount}</td>
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
