import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Dashboard.css'; // Reuse premium portal styling

export default function MentorDashboard({ onShowToast }) {
  const {
    mentorToken,
    mentorProfile,
    loginMentor,
    logoutMentor,
    fetchMentorBookings,
    updateMentorProfile,
    API_BASE
  } = useApp();

  // Theme Switcher State
  const [theme, setTheme] = useState(() => localStorage.getItem('bbg_mentor_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('bbg_mentor_theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#070412' : '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Section Navigation
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'sessions', 'settings'
  const [sessionFilter, setSessionFilter] = useState('upcoming'); // 'upcoming', 'completed', 'all'

  // Booking details modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mentor profile/settings form
  const [profileForm, setProfileForm] = useState({
    bio: '',
    quote: '',
    rate: '',
    role: '',
    linkedin: '',
    expertise_areas: '',
    photo: '',
    slots: [],
    busy: [],
    durs: []
  });

  // Bookings list
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Predefined standard slots
  const ALL_POSSIBLE_SLOTS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  // Predefined durations
  const ALL_DURS = ["30", "60", "120"];

  useEffect(() => {
    if (mentorToken) {
      loadBookings();
    }
  }, [mentorToken]);

  // Sync profile details when logged in
  useEffect(() => {
    if (mentorProfile) {
      setProfileForm({
        bio: mentorProfile.bio || '',
        quote: mentorProfile.quote || '',
        rate: mentorProfile.rate || '$20',
        role: mentorProfile.role || '',
        linkedin: mentorProfile.linkedin || '',
        expertise_areas: Array.isArray(mentorProfile.expertise_areas)
          ? mentorProfile.expertise_areas.join(', ')
          : mentorProfile.expertise_areas || '',
        photo: mentorProfile.photo || '',
        slots: mentorProfile.slots || [],
        busy: mentorProfile.busy || [],
        durs: mentorProfile.durs || ['30', '60']
      });
    }
  }, [mentorProfile]);

  // Rescheduling states
  const [processingRescheduleId, setProcessingRescheduleId] = useState(null);

  const handleRescheduleDecision = async (bookingId, action) => {
    setProcessingRescheduleId(bookingId);
    try {
      const endpoint = action === 'accept' ? 'reschedule-accept' : 'reschedule-decline';
      const res = await fetch(`${API_BASE}/api/mentor/bookings/${bookingId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mentorToken}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (onShowToast) {
          onShowToast(
            action === 'accept' ? '✅' : '❌',
            action === 'accept' ? 'Reschedule Accepted' : 'Reschedule Declined',
            action === 'accept' ? 'The session has been successfully moved.' : 'The reschedule request was declined.'
          );
        }
        loadBookings();
      } else {
        alert(data.message || 'Failed to update reschedule request.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error updating reschedule request.');
    } finally {
      setProcessingRescheduleId(null);
    }
  };

  const loadBookings = async () => {
    setLoadingBookings(true);
    setError('');
    try {
      const data = await fetchMentorBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch scheduled mentorship sessions.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginMentor(email, password);
      if (onShowToast) {
        onShowToast('🔑', 'Welcome Back!', 'Successfully logged in to your Mentor Portal.');
      }
    } catch (err) {
      setError(err.message || 'Invalid mentor credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const cleanFields = {
        ...profileForm,
        // Convert comma separated expertise back to array
        expertise_areas: profileForm.expertise_areas.split(',').map(t => t.trim()).filter(Boolean)
      };
      await updateMentorProfile(cleanFields);
      if (onShowToast) {
        onShowToast('⚙️', 'Profile Updated', 'Your settings and availability were saved successfully.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update profile settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSlotToggle = (slot) => {
    setProfileForm(prev => {
      const slots = prev.slots.includes(slot)
        ? prev.slots.filter(s => s !== slot)
        : [...prev.slots, slot].sort();
      return { ...prev, slots };
    });
  };

  const handleBusyToggle = (slot) => {
    setProfileForm(prev => {
      const busy = prev.busy.includes(slot)
        ? prev.busy.filter(s => s !== slot)
        : [...prev.busy, slot].sort();
      return { ...prev, busy };
    });
  };

  const handleDurToggle = (dur) => {
    setProfileForm(prev => {
      const durs = prev.durs.includes(dur)
        ? prev.durs.filter(d => d !== dur)
        : [...prev.durs, dur];
      return { ...prev, durs };
    });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        // Fallback for YYYY-MM-DD strings directly
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${months[parseInt(parts[1]) - 1]} ${parts[2]}, ${parts[0]}`;
        }
        return dateStr;
      }
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter logic
  const now = new Date();
  const getSessionStatus = (b) => {
    try {
      const dateParts = b.data.date.split('-');
      const timeParts = b.data.time.split(':');
      const sessionStart = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        0
      );
      const duration = parseInt(b.data.duration) || 30;
      const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);

      if (now < sessionStart) return 'upcoming';
      if (now >= sessionStart && now <= sessionEnd) return 'live';
      return 'completed';
    } catch (e) {
      return 'completed';
    }
  };

  const filteredBookings = bookings.filter(b => {
    const status = getSessionStatus(b);
    if (sessionFilter === 'upcoming') return status === 'upcoming' || status === 'live';
    if (sessionFilter === 'completed') return status === 'completed';
    return true;
  });

  const totalSessions = bookings.length;
  const upcomingCount = bookings.filter(b => getSessionStatus(b) === 'upcoming' || getSessionStatus(b) === 'live').length;

  // Calculate mock earnings (Sessions * rate)
  const baseRate = parseInt(mentorProfile?.rate?.replace(/[^0-9]/g, '') || '20');
  const totalEarnings = bookings.reduce((sum, b) => {
    const amt = parseInt(b.data.amount?.replace(/[^0-9]/g, '') || '0') || baseRate;
    return sum + amt;
  }, 0);

  // Next session finder
  const nextSession = bookings
    .filter(b => getSessionStatus(b) === 'upcoming' || getSessionStatus(b) === 'live')
    .sort((a, b) => new Date(`${a.data.date}T${a.data.time}`) - new Date(`${b.data.date}T${b.data.time}`))[0];

  // Render Login state
  if (!mentorToken) {
    return (
      <div className={`auth-page-wrap full-screen ${theme === 'light' ? 'light-theme' : ''}`}>
        <div className="auth-neon-glow-top"></div>
        <div className="auth-neon-glow-bottom"></div>

        <div className="auth-card">
          <div className="auth-card-border-glow"></div>

          <div className="auth-header">
            <h2>Mentor Portal Login</h2>
            <p className="auth-sub">Enter your credentials to manage your directory profile, pricing, and student meetings.</p>
          </div>

          {error && <div className="auth-err">{error}</div>}

          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="auth-fld-g">
              <input
                type="email"
                required
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email Address</label>
              <div className="fld-focus-line"></div>
            </div>

            <div className="auth-fld-g">
              <input
                type="password"
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <div className="fld-focus-line"></div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <div className="auth-spinner">
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 11-6.2-8.6" />
                  </svg>
                  Authenticating...
                </div>
              ) : 'Log In to Dashboard'}
            </button>
          </form>

          <div className="auth-footer">
            <span>Forgot credentials or need a link? Contact admin support.</span>
          </div>
        </div>
      </div>
    );
  }

  // Render logged-in dashboard
  return (
    <div className={`portal-layout full-screen ${theme === 'light' ? 'light-theme' : ''}`}>
      <div className="portal-glow-top"></div>
      <div className="portal-glow-bottom"></div>

      {/* Portal Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-brand">
          <div className="sb-logo">BBG</div>
          <div className="sb-meta">
            <h3>Mentor Portal</h3>
            <span>OPERATIONS</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="su-avatar">
            {mentorProfile?.photo ? (
              <img src={mentorProfile.photo} alt={mentorProfile.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : mentorProfile?.name ? mentorProfile.name.charAt(0) : 'M'}
            <div className="su-status-dot"></div>
          </div>
          <div className="su-info">
            <h4>{mentorProfile?.name || 'Mentor'}</h4>
            <span>{mentorProfile?.role || 'Professional'}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
            Overview
          </button>

          <button
            className={`menu-item ${activeSection === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveSection('sessions')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            Sessions Log
            {upcomingCount > 0 && <span className="menu-badge">{upcomingCount}</span>}
          </button>

          <button
            className={`menu-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <svg viewBox="0 0 24 24" className="menu-icon"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            Availability &amp; Profile
          </button>

          <a
            href="/"
            className="menu-item"
            style={{ textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px', paddingTop: '16px' }}
          >
            <svg viewBox="0 0 24 24" className="menu-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Website
          </a>
        </nav>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="menu-item sidebar-theme-toggle"
          style={{
            marginTop: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
            fontWeight: '600'
          }}
        >
          {theme === 'dark' ? (
            <>
              <svg viewBox="0 0 24 24" className="menu-icon" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light Mode
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="menu-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Dark Mode
            </>
          )}
        </button>

        <button onClick={logoutMentor} className="sidebar-logout">
          <svg viewBox="0 0 24 24" className="menu-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Sign Out
        </button>
      </aside>

      {/* Main Content Workspace */}
      <main className="portal-main">
        {loadingBookings ? (
          <div className="portal-workspace-loading">
            <svg className="spin" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.2-8.6" fill="none" stroke="currentColor" strokeWidth="3.5" /></svg>
            <h3>Loading database rosters...</h3>
            <p>Gathering session records and availability slots securely.</p>
          </div>
        ) : (
          <div className="workspace-inner fade-in-workspace">

            {/* 1. OVERVIEW VIEW */}
            {activeSection === 'overview' && (
              <div className="overview-workspace">
                <div className="overview-banner">
                  <div className="banner-g"></div>
                  <div className="banner-txt">
                    <h2>Welcome back, {mentorProfile?.name?.split(' ')[0]}!</h2>
                    <p>Manage your availability slots, view student bookings, and host sessions directly from your dashboard.</p>
                  </div>
                </div>

                {/* Metrics Cards Grid */}
                <div className="metrics-grid">
                  <div className="metric-c">
                    <div className="mc-head">
                      <span>Total Sessions</span>
                      <span className="mc-icon">🎙️</span>
                    </div>
                    <h3>{totalSessions}</h3>
                    <div className="mc-bar"><div className="mc-bar-progress" style={{ width: `${Math.min(totalSessions * 10, 100)}%` }}></div></div>
                  </div>

                  <div className="metric-c">
                    <div className="mc-head">
                      <span>Upcoming Meetings</span>
                      <span className="mc-icon" style={{ color: 'var(--rose)' }}>⚡</span>
                    </div>
                    <h3 style={{ color: 'var(--rose)' }}>{upcomingCount}</h3>
                    <div className="mc-bar"><div className="mc-bar-progress" style={{ width: `${Math.min(upcomingCount * 20, 100)}%`, background: 'var(--rose)' }}></div></div>
                  </div>

                  <div className="metric-c">
                    <div className="mc-head">
                      <span>Estimated Earnings</span>
                      <span className="mc-icon" style={{ color: '#EAB308' }}>💎</span>
                    </div>
                    <h3 style={{ color: '#EAB308' }}>${totalEarnings}</h3>
                    <div className="mc-bar"><div className="mc-bar-progress" style={{ width: `${Math.min(totalEarnings / 10, 100)}%`, background: '#EAB308' }}></div></div>
                  </div>
                </div>

                {/* Split widgets */}
                <div className="overview-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                  {/* Next session details widget */}
                  <div className="next-session-widget" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '28px' }}>
                    <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '18px', fontFamily: 'Outfit' }}>Next Scheduled Call</h4>
                      <span className="live-pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                        <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span> Ready
                      </span>
                    </div>

                    {nextSession ? (
                      <div className="ns-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #9333EA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                            {nextSession.data.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Student Request</h5>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{nextSession.data.email}</span>
                          </div>
                        </div>

                        <div className="ns-details-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Date</span>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{fmtDate(nextSession.data.date)}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Time Slot</span>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{nextSession.data.time}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</span>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{nextSession.data.duration} Mins</span>
                          </div>
                        </div>

                        {nextSession.data.goals && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', fontSize: '13.5px', borderLeft: '3px solid var(--rose)' }}>
                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#e5e7eb' }}>Goals / Topics:</strong>
                            <p style={{ margin: 0, color: '#9ca3af', lineHeight: '1.4' }}>"{nextSession.data.goals}"</p>
                          </div>
                        )}

                        {nextSession.data.reschedule_request && nextSession.data.reschedule_request.status === 'pending' && (
                          <div style={{ background: 'rgba(234,179,8,0.06)', borderLeft: '3px solid #EAB308', padding: '14px', borderRadius: '12px', fontSize: '13.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <strong style={{ display: 'block', color: '#EAB308' }}>⚠️ Reschedule Request Pending:</strong>
                            <p style={{ margin: 0, color: '#e5e7eb', lineHeight: '1.4' }}>
                              Student requested to move this session to <strong>{fmtDate(nextSession.data.reschedule_request.date)} at {nextSession.data.reschedule_request.time}</strong>.
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <button
                                type="button"
                                onClick={() => handleRescheduleDecision(nextSession._id, 'accept')}
                                disabled={processingRescheduleId === nextSession._id}
                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                {processingRescheduleId === nextSession._id ? 'Processing...' : 'Accept Request'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRescheduleDecision(nextSession._id, 'decline')}
                                disabled={processingRescheduleId === nextSession._id}
                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                          <a
                            href={nextSession.data.meet_link || 'https://meet.google.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)', border: 'none', color: '#fff', display: 'block', boxShadow: '0 4px 15px rgba(236,72,153,0.2)' }}
                          >
                            🚀 Launch Google Meet
                          </a>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setSelectedBooking(nextSession)}
                            style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            Full Dossier
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '48px 0', textPosition: 'center', color: '#9ca3af' }}>
                        No upcoming sessions scheduled. Relax and update your settings!
                      </div>
                    )}
                  </div>

                  {/* Operational checklist widget */}
                  <div className="checklist-widget" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '28px' }}>
                    <h4 style={{ margin: '0 0 20px', fontSize: '18px', fontFamily: 'Outfit' }}>Platform Checklist</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px', color: mentorProfile?.email ? '#4ade80' : '#ff7878' }}>
                          {mentorProfile?.email ? '✓' : '✗'}
                        </span>
                        <div>
                          <strong style={{ fontSize: '14px', display: 'block' }}>Email Configured</strong>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Your login &amp; alerts mail: {mentorProfile?.email}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px', color: profileForm.slots.length > 0 ? '#4ade80' : '#ff7878' }}>
                          {profileForm.slots.length > 0 ? '✓' : '✗'}
                        </span>
                        <div>
                          <strong style={{ fontSize: '14px', display: 'block' }}>Availability Configured</strong>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{profileForm.slots.length} booking slots active</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px', color: mentorProfile?.bio ? '#4ade80' : '#ff7878' }}>
                          {mentorProfile?.bio ? '✓' : '✗'}
                        </span>
                        <div>
                          <strong style={{ fontSize: '14px', display: 'block' }}>Biography Active</strong>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Dossier details present for directory display</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SESSIONS VIEW */}
            {activeSection === 'sessions' && (
              <div>
                <div className="ws-title-row">
                  <div>
                    <h2>Mentorship Sessions Log</h2>
                    <p>Roster of booked consultations, details, and meeting channels.</p>
                  </div>

                  {/* Status filter tabs */}
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                    {[
                      { key: 'upcoming', label: 'Upcoming' },
                      { key: 'completed', label: 'Completed' },
                      { key: 'all', label: 'All History' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        className={`tab-btn ${sessionFilter === tab.key ? 'active' : ''}`}
                        onClick={() => setSessionFilter(tab.key)}
                        style={{ padding: '6px 14px', borderRadius: '8px', background: sessionFilter === tab.key ? 'rgba(236,72,153,0.1)' : 'none', color: sessionFilter === tab.key ? 'var(--rose)' : '#9ca3af', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '64px', borderRadius: '20px', border: '1px solid var(--border-light)', textAlign: 'center', color: '#9ca3af' }}>
                    <span style={{ fontSize: '36px', display: 'block', marginBottom: '16px' }}>📅</span>
                    <h3>No sessions found</h3>
                    <p>No booked slots match this filter.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredBookings.map(b => {
                      const stat = getSessionStatus(b);
                      return (
                        <div
                          key={b._id}
                          className="glass-box"
                          style={{
                            padding: '24px',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            alignItems: 'center',
                            gap: '24px',
                            borderLeft: stat === 'upcoming' || stat === 'live' ? '4px solid var(--rose)' : '1px solid var(--border-light)'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {b.data.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, fontSize: '15.5px' }}>{b.data.email}</h4>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '20px',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  background: stat === 'upcoming' ? 'rgba(59,130,246,0.1)' : stat === 'live' ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                                  color: stat === 'upcoming' ? '#60a5fa' : stat === 'live' ? '#4ade80' : '#9ca3af'
                                }}>
                                  {stat}
                                </span>
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#9ca3af' }}>
                                {fmtDate(b.data.date)} · {b.data.time} ({b.data.duration} mins) · Fee: {b.data.amount || 'N/A'}
                              </div>
                              {b.data.reschedule_request && b.data.reschedule_request.status === 'pending' && (
                                <div style={{ marginTop: '12px', background: 'rgba(234,179,8,0.06)', borderLeft: '3px solid #EAB308', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ color: '#EAB308', fontWeight: 'bold' }}>⚠️ Reschedule Requested by Student</span>
                                  <span style={{ color: '#e5e7eb' }}>
                                    Proposed New Schedule: <strong>{fmtDate(b.data.reschedule_request.date)} at {b.data.reschedule_request.time}</strong>
                                  </span>
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleRescheduleDecision(b._id, 'accept')}
                                      disabled={processingRescheduleId === b._id}
                                      style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                      {processingRescheduleId === b._id ? 'Processing...' : 'Accept Request'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRescheduleDecision(b._id, 'decline')}
                                      disabled={processingRescheduleId === b._id}
                                      style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                      Decline
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedBooking(b)}
                              style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              Dossier
                            </button>
                            {(stat === 'upcoming' || stat === 'live') && (
                              <a
                                href={b.data.meet_link || 'https://meet.google.com'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                                style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)', border: 'none', color: '#fff', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                              >
                                Join Meet
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. SETTINGS & AVAILABILITY VIEW */}
            {activeSection === 'settings' && (
              <div>
                <div className="ws-title-row">
                  <div>
                    <h2>Availability &amp; Settings</h2>
                    <p>Customise rates, active slots, biography details, and specialized taxonomy tags.</p>
                  </div>
                </div>

                <form onSubmit={handleSettingsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Rate & Durations */}
                  <div className="glass-box" style={{ padding: '28px' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontFamily: 'Outfit' }}>Rates &amp; Durations</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '28px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>Base Hourly Rate *</label>
                        <input
                          type="text"
                          name="rate"
                          required
                          value={profileForm.rate}
                          onChange={handleTextChange}
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                        />
                        <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>e.g. $25 (60m is auto calculated at 1.8x, 120m at 3.2x unless customized)</span>
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>Allowed Duration Options</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                          {ALL_DURS.map(dur => {
                            const isChecked = profileForm.durs.includes(dur);
                            return (
                              <button
                                type="button"
                                key={dur}
                                className={`dur-chip ${isChecked ? 'active' : ''}`}
                                onClick={() => handleDurToggle(dur)}
                                style={{
                                  padding: '10px 18px',
                                  borderRadius: '8px',
                                  border: isChecked ? '1px solid var(--rose)' : '1px solid rgba(255,255,255,0.08)',
                                  background: isChecked ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.02)',
                                  color: isChecked ? 'var(--rose)' : '#9ca3af',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                {dur} Minutes
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Slots Checklist */}
                  <div className="glass-box" style={{ padding: '28px' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Outfit' }}>Active Work Slots</h3>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>Check all potential slots you can accept sessions for. Busy status (regular lunch blocks) can be marked below.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                      {ALL_POSSIBLE_SLOTS.map(slot => {
                        const isActive = profileForm.slots.includes(slot);
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => handleSlotToggle(slot)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '8px',
                              border: isActive ? '1px solid #9333EA' : '1px solid rgba(255,255,255,0.05)',
                              background: isActive ? 'rgba(147,51,234,0.15)' : 'none',
                              color: isActive ? '#d8b4fe' : '#6b7280',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Statically Busy slots */}
                  <div className="glass-box" style={{ padding: '28px' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Outfit' }}>Statically Busy Blocks</h3>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>Select slots that should be blocked statically (e.g. recurrent breaks). Overlapping dynamic checkouts will also block automatically.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                      {profileForm.slots.map(slot => {
                        const isBusy = profileForm.busy.includes(slot);
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => handleBusyToggle(slot)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '8px',
                              border: isBusy ? '1px solid #ff7878' : '1px solid rgba(255,255,255,0.05)',
                              background: isBusy ? 'rgba(239,68,68,0.15)' : 'none',
                              color: isBusy ? '#ff7878' : '#9ca3af',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            {slot} {isBusy ? '❌' : ''}
                          </button>
                        );
                      })}
                      {profileForm.slots.length === 0 && (
                        <div style={{ color: '#6b7280', fontSize: '13px', gridColumn: 'span 12' }}>Please check some active slots first above.</div>
                      )}
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="glass-box" style={{ padding: '28px' }}>
                    <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontFamily: 'Outfit' }}>Profile Dossier Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Professional Role / Designation *</label>
                          <input
                            type="text"
                            name="role"
                            required
                            value={profileForm.role}
                            onChange={handleTextChange}
                            placeholder="e.g. Senior Software Engineer at Netflix"
                            style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>LinkedIn Profile Link</label>
                          <input
                            type="url"
                            name="linkedin"
                            value={profileForm.linkedin}
                            onChange={handleTextChange}
                            placeholder="https://linkedin.com/in/..."
                            style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Profile Photo URL</label>
                          <input
                            type="url"
                            name="photo"
                            value={profileForm.photo}
                            onChange={handleTextChange}
                            placeholder="Paste image address URL..."
                            style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Expertise Areas (Comma separated)</label>
                          <input
                            type="text"
                            name="expertise_areas"
                            value={profileForm.expertise_areas}
                            onChange={handleTextChange}
                            placeholder="e.g. Frontend development, PM Interviews, Offer Negotiation"
                            style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Short Inspire Quote</label>
                        <input
                          type="text"
                          name="quote"
                          value={profileForm.quote}
                          onChange={handleTextChange}
                          placeholder="e.g. Dream big, build fast, never settle."
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Biography / Background *</label>
                        <textarea
                          name="bio"
                          required
                          value={profileForm.bio}
                          onChange={handleTextChange}
                          rows={5}
                          placeholder="Tell students about yourself, your trajectory, and what you'd like to mentor them on..."
                          style={{ width: '100%', padding: '14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={savingSettings}
                      style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)', color: '#fff', fontWeight: 'bold', fontSize: '15.5px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(236,72,153,0.2)' }}
                    >
                      {savingSettings ? 'Saving Settings...' : 'Save Settings & Availability'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking dossier details modal */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="glass-box" style={{ maxWidth: '560px', width: '100%', padding: '32px', background: '#0e0a24', border: '1px solid var(--border-light)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'Outfit' }}>Booking Dossier</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer', padding: 0 }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Student Email</span>
                <a href={`mailto:${selectedBooking.data.email}`} style={{ color: 'var(--rose)', fontWeight: 'bold', textDecoration: 'none' }}>
                  {selectedBooking.data.email}
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Date</span>
                  <span style={{ fontWeight: '600' }}>{fmtDate(selectedBooking.data.date)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Time</span>
                  <span style={{ fontWeight: '600' }}>{selectedBooking.data.time}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Duration</span>
                  <span style={{ fontWeight: '600' }}>{selectedBooking.data.duration} Minutes</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Amount Paid</span>
                  <span style={{ fontWeight: '600', color: '#EAB308' }}>{selectedBooking.data.amount || 'N/A'}</span>
                </div>
              </div>

              {selectedBooking.data.field && (
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Student Domain</span>
                  <span style={{ fontWeight: '600' }}>{selectedBooking.data.field}</span>
                </div>
              )}

              {selectedBooking.data.goals && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--rose)' }}>
                  <span style={{ fontSize: '11px', color: '#e5e7eb', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Goals / Topics:</span>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '13.5px', lineHeight: '1.5' }}>"{selectedBooking.data.goals}"</p>
                </div>
              )}

              {selectedBooking.data.meet_link && (
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Google Meet Link</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      readOnly
                      value={selectedBooking.data.meet_link}
                      style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12.5px', color: '#d8b4fe' }}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedBooking.data.meet_link);
                        alert('Meet link copied to clipboard!');
                      }}
                      style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedBooking(null)}
                style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Close Dossier
              </button>
              {selectedBooking.data.meet_link && (
                <a
                  href={selectedBooking.data.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Join Google Meet
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
