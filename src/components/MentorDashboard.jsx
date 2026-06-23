import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { auth, googleProvider, signInWithPopup, isConfigured } from '../config/firebase';
import './Dashboard.css'; // Reuse premium portal styling

export default function MentorDashboard({ onShowToast }) {
  const {
    mentorToken,
    mentorProfile,
    loginMentor,
    loginMentorWithGoogle,
    logoutMentor,
    fetchMentorBookings,
    updateMentorProfile,
    API_BASE
  } = useApp();

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Section Navigation
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'sessions', 'settings'
  const [sessionFilter, setSessionFilter] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');

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
    durs: [],
    meeting_link: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  });

  // Free session toggle
  const [isFreeSession, setIsFreeSession] = useState(false);

  // Bookings list
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      const rateVal = mentorProfile.rate || '$20';
      const isCurrentlyFree = !rateVal || rateVal.toLowerCase().includes('free') || rateVal === '0' || rateVal === '$0';
      setIsFreeSession(isCurrentlyFree);
      setProfileForm({
        bio: mentorProfile.bio || '',
        quote: mentorProfile.quote || '',
        rate: isCurrentlyFree ? 'Free' : rateVal,
        role: mentorProfile.role || '',
        linkedin: mentorProfile.linkedin || '',
        expertise_areas: Array.isArray(mentorProfile.expertise_areas)
          ? mentorProfile.expertise_areas.join(', ')
          : mentorProfile.expertise_areas || '',
        photo: mentorProfile.photo || '',
        slots: mentorProfile.slots || [],
        busy: mentorProfile.busy || [],
        durs: mentorProfile.durs || ['30', '60'],
        meeting_link: mentorProfile.meeting_link || '',
        timezone: mentorProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
      });
    }
  }, [mentorProfile]);

  // Rescheduling states
  const [processingRescheduleId, setProcessingRescheduleId] = useState(null);
  const [reschedulingSession, setReschedulingSession] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState(null);
  const [loadingRescheduleAvailability, setLoadingRescheduleAvailability] = useState(false);
  const [submittingReschedule, setSubmittingReschedule] = useState(false);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [mentorBusySlots, setMentorBusySlots] = useState([]);

  useEffect(() => {
    if (reschedulingSession && rescheduleDate && mentorProfile) {
      setLoadingRescheduleAvailability(true);
      const tz = mentorProfile.timezone || 'America/New_York';
      fetch(`${API_BASE}/api/mentors/${mentorProfile.id || mentorProfile._id}/availability?date=${rescheduleDate}&student_tz=${encodeURIComponent(tz)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMentorBusySlots(data.bookedSlots || []);
          }
        })
        .catch(err => console.error('Error fetching reschedule availability:', err))
        .finally(() => setLoadingRescheduleAvailability(false));
    } else {
      setMentorBusySlots([]);
    }
  }, [reschedulingSession, rescheduleDate, mentorProfile, API_BASE]);

  const openRescheduleModal = (session) => {
    setReschedulingSession(session);
    setRescheduleDate(null);
    setRescheduleTime(null);
    setRescheduleSuccess(false);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleDate || !rescheduleTime || !reschedulingSession) return;
    setSubmittingReschedule(true);
    try {
      const res = await fetch(`${API_BASE}/api/mentor/bookings/${reschedulingSession._id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mentorToken}`
        },
        body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRescheduleSuccess(true);
        if (onShowToast) {
          onShowToast('📅', 'Rescheduled', 'Mentorship session rescheduled successfully and student notified.');
        }
        loadBookings();
      } else {
        alert(data.message || 'Failed to reschedule session.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting reschedule.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const getRescheduleDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      dates.push(dt);
    }
    return dates;
  };

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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (isConfigured) {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();
        await loginMentorWithGoogle(idToken, user.email);
        if (onShowToast) {
          onShowToast('🌐', 'Google Sign In', `Welcome back, ${user.displayName || 'Mentor'}!`);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loginMentorWithGoogle('mock_firebase_token', 'mentor@example.com');
        if (onShowToast) {
          onShowToast('⚡', 'Demo Mode Login', 'Logged in with a Demo Google Account!');
        }
      }
    } catch (err) {
      console.error(err);
      let errMsg = err.message || 'Google authentication failed.';
      if (errMsg.includes('auth/popup-closed-by-user')) {
        errMsg = 'The login popup was closed before completing sign-in. Please try again.';
      } else if (errMsg.includes('auth/cancelled-popup-request')) {
        errMsg = 'The authentication request was cancelled. Please try again.';
      } else if (errMsg.includes('auth/popup-blocked')) {
        errMsg = 'The login popup was blocked by your browser. Please allow popups for this site.';
      } else if (errMsg.includes('auth/network-request-failed')) {
        errMsg = 'A network error occurred. Please check your internet connection.';
      } else if (errMsg.toLowerCase().includes('firebase')) {
        errMsg = 'Google sign-in failed. Please try again or use your password credentials.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setSavingSettings(true);
    try {
      const cleanFields = {
        ...profileForm,
        // Convert comma separated expertise back to array
        expertise_areas: profileForm.expertise_areas.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (newPassword) {
        cleanFields.password = newPassword;
      }
      await updateMentorProfile(cleanFields);
      setNewPassword('');
      setConfirmPassword('');
      if (onShowToast) {
        onShowToast('⚙️', 'Profile Updated', 'Your settings and password were saved successfully.');
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

  const getSessionTimeForMentor = (b) => {
    const tz = mentorProfile?.timezone || 'America/New_York';
    if (b.data.utc_start) {
      const date = new Date(b.data.utc_start);
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const parts = formatter.formatToParts(date);
        const map = {};
        parts.forEach(p => map[p.type] = p.value);
        return {
          date: `${map.year}-${map.month}-${map.day}`,
          time: `${map.hour}:${map.minute}`
        };
      } catch (err) {
        console.error('Intl formatting failed', err);
      }
    }
    return {
      date: b.data.date,
      time: b.data.time
    };
  };

  const getRescheduleTimeForMentor = (b) => {
    const tz = mentorProfile?.timezone || 'America/New_York';
    const req = b.data.reschedule_request;
    if (req) {
      if (req.utc_start) {
        const date = new Date(req.utc_start);
        try {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          const parts = formatter.formatToParts(date);
          const map = {};
          parts.forEach(p => map[p.type] = p.value);
          return {
            date: `${map.year}-${map.month}-${map.day}`,
            time: `${map.hour}:${map.minute}`
          };
        } catch (err) {
          console.error('Intl formatting failed', err);
        }
      }
      return {
        date: req.date,
        time: req.time
      };
    }
    return null;
  };

  // Filter logic
  const now = new Date();
  const getSessionStatus = (b) => {
    try {
      let sessionStart;
      if (b.data.utc_start) {
        sessionStart = new Date(b.data.utc_start);
      } else {
        const dateParts = b.data.date.split('-');
        const timeParts = b.data.time.split(':');
        sessionStart = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2]),
          parseInt(timeParts[0]),
          parseInt(timeParts[1]),
          0
        );
      }
      const duration = parseInt(b.data.duration) || 30;
      const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);

      if (now < sessionStart) return 'upcoming';
      if (now >= sessionStart && now <= sessionEnd) return 'live';
      return 'completed';
    } catch (e) {
      return 'completed';
    }
  };

  const filteredBookings = bookings
    .filter(b => {
      // 1. Status Filter
      const status = getSessionStatus(b);
      let matchStatus = true;
      if (sessionFilter === 'upcoming') matchStatus = (status === 'upcoming' || status === 'live');
      else if (sessionFilter === 'completed') matchStatus = (status === 'completed');

      // 2. Search Filter (by student email)
      const matchSearch = searchQuery 
        ? b.data?.email?.toLowerCase().includes(searchQuery.toLowerCase()) 
        : true;

      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      // 3. Sorting Logic
      if (sortBy === 'date-asc' || sortBy === 'date-desc') {
        const dateA = a.data.utc_start ? new Date(a.data.utc_start) : new Date(`${a.data.date}T${a.data.time}`);
        const dateB = b.data.utc_start ? new Date(b.data.utc_start) : new Date(`${b.data.date}T${b.data.time}`);
        return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === 'amount-asc' || sortBy === 'amount-desc') {
        const valA = parseInt(a.data.amount?.replace(/[^0-9]/g, '') || '0', 10);
        const valB = parseInt(b.data.amount?.replace(/[^0-9]/g, '') || '0', 10);
        return sortBy === 'amount-asc' ? valA - valB : valB - valA;
      }
      return 0;
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
    .sort((a, b) => {
      const dateA = a.data.utc_start ? new Date(a.data.utc_start) : new Date(`${a.data.date}T${a.data.time}`);
      const dateB = b.data.utc_start ? new Date(b.data.utc_start) : new Date(`${b.data.date}T${b.data.time}`);
      return dateA - dateB;
    })[0];

  // Render Login state
  if (!mentorToken) {
    return (
      <div className="auth-page-wrap full-screen">
        <div className="auth-neon-glow-top"></div>
        <div className="auth-neon-glow-bottom"></div>

        <div className="auth-card">
          <div className="auth-card-border-glow"></div>

          <div className="auth-header">
            <h2>Mentor Portal Login</h2>
            <p className="auth-sub">Enter your credentials to manage your directory profile, pricing, and student meetings.</p>
          </div>

          {error && <div className="auth-err">{error}</div>}

          {/* Social Sign-In Buttons */}
          <div className="auth-social-buttons" style={{ marginBottom: '20px' }}>
            <button 
              type="button" 
              className="social-btn google" 
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', color: '#6b7280', fontSize: '13px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
            <span style={{ padding: '0 12px' }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          </div>

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

            <div className="auth-fld-g" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '44px' }}
              />
              <label>Password</label>
              <div className="fld-focus-line"></div>
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
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
    <div className="portal-layout full-screen">
      <div className="portal-glow-top"></div>
      <div className="portal-glow-bottom"></div>

      {/* Portal Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-brand" style={{ padding: '0 20px', gap: '10px', display: 'flex', alignItems: 'center' }}>
          <img src="/logo-192x192.png" alt="BBG Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(147,51,234,0.3))' }} />
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '900',
            fontSize: '22px',
            background: 'linear-gradient(135deg, #6B21A8 0%, #9333EA 25%, #EC4899 55%, #F97316 80%, #EAB308 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            Mentor Portal
          </span>
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
            className="menu-item back-to-website-item"
          >
            <svg viewBox="0 0 24 24" className="menu-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Website
          </a>
        </nav>

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
                  <div className="next-session-widget" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '20px' }}>
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

                        {(() => {
                          const nsTime = getSessionTimeForMentor(nextSession);
                          const nsReschedTime = getRescheduleTimeForMentor(nextSession);
                          const tz = mentorProfile?.timezone || 'America/New_York';
                          return (
                            <>
                              <div className="ns-details-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Date</span>
                                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{fmtDate(nsTime.date)}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Time Slot</span>
                                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{nsTime.time} ({tz})</span>
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
                                    Student requested to move this session to <strong>{nsReschedTime ? `${fmtDate(nsReschedTime.date)} at ${nsReschedTime.time} (${tz})` : `${fmtDate(nextSession.data.reschedule_request.date)} at ${nextSession.data.reschedule_request.time}`}</strong>.
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
                            </>
                          );
                        })()}

                        <div className="flex-btn-container" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
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
                            onClick={() => openRescheduleModal(nextSession)}
                            style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.08)', color: 'var(--rose)', border: '1px solid rgba(236, 72, 153, 0.2)', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            📅 Reschedule
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setSelectedBooking(nextSession)}
                            style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                          >
                            Full Profile
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af' }}>
                        No upcoming sessions scheduled. Relax and update your settings!
                      </div>
                    )}
                  </div>

                  {/* Operational checklist widget */}
                  <div className="checklist-widget" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '20px' }}>
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
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Profile details present for directory display</span>
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

                {/* Search & Sort Controls */}
                <div className="sessions-controls-row">
                  {/* Search Bar */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      placeholder="Search by student email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        background: 'rgba(11,8,25,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px' }}>🔍</span>
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(11,8,25,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="date-asc">Date (Oldest First)</option>
                      <option value="date-desc">Date (Newest First)</option>
                      <option value="amount-desc">Fee (Highest First)</option>
                      <option value="amount-asc">Fee (Lowest First)</option>
                    </select>
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
                      const bTime = getSessionTimeForMentor(b);
                      const bReschedTime = getRescheduleTimeForMentor(b);
                      const tz = mentorProfile?.timezone || 'America/New_York';
                      return (
                        <div key={b._id} className={`session-card-p${stat === 'upcoming' || stat === 'live' ? ' upcoming' : ' completed'}`}>
                          <div className="sc-date-block">
                            <span className="sc-month">{getMonthAbbr(bTime.date)}</span>
                            <span className="sc-day">{getDayNum(bTime.date)}</span>
                          </div>

                          <div className="sc-info-block">
                            <div className="sc-mentor-meta">
                              <h4>{b.data.email}</h4>
                              <span className="sc-title">Student Profile</span>
                            </div>

                            <div className="sc-params">
                              <div className="scp-i">
                                <span>Time Slot</span>
                                <strong>{bTime.time} ({tz})</strong>
                              </div>
                              <div className="scp-i">
                                <span>Duration</span>
                                <strong>{b.data.duration} mins</strong>
                              </div>
                              <div className="scp-i">
                                <span>Earned Fee</span>
                                <strong>{b.data.amount || 'Free'}</strong>
                              </div>
                            </div>

                            {b.data.reschedule_request && b.data.reschedule_request.status === 'pending' && (
                              <div style={{ background: 'rgba(234,179,8,0.06)', borderLeft: '3px solid #EAB308', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ color: '#EAB308', fontWeight: 'bold' }}>⚠️ Reschedule Requested by Student</span>
                                <span style={{ color: '#e5e7eb' }}>
                                  Proposed New Schedule: <strong>{bReschedTime ? `${fmtDate(bReschedTime.date)} at ${bReschedTime.time} (${tz})` : `${fmtDate(b.data.reschedule_request.date)} at ${b.data.reschedule_request.time}`}</strong>
                                </span>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleRescheduleDecision(b._id, 'accept')}
                                    disabled={processingRescheduleId === b._id}
                                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                  >
                                    {processingRescheduleId === b._id ? 'Processing...' : 'Accept Request'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRescheduleDecision(b._id, 'decline')}
                                    disabled={processingRescheduleId === b._id}
                                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="sc-footer-actions">
                              <span className={`sc-status-badge ${stat === 'upcoming' || stat === 'live' ? 'scheduled' : 'completed'}`}>
                                {stat}
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setSelectedBooking(b)}
                                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', cursor: 'pointer' }}
                                >
                                  Details
                                </button>
                                {(stat === 'upcoming' || stat === 'live') && (
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => openRescheduleModal(b)}
                                    style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.2)', background: 'rgba(236,72,153,0.05)', color: 'var(--rose)', cursor: 'pointer', fontWeight: 'bold' }}
                                  >
                                    Reschedule
                                  </button>
                                )}
                                {(stat === 'upcoming' || stat === 'live') && (
                                  <a
                                    href={b.data.meet_link || 'https://meet.google.com'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sc-meet-btn"
                                    style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    Join Call
                                  </a>
                                )}
                              </div>
                            </div>
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
                  <div className="glass-box">
                    <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontFamily: 'Outfit' }}>Rates &amp; Durations</h3>

                    {/* Free Session Toggle */}
                    <div className="free-session-toggle-card" style={{ background: isFreeSession ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)', border: isFreeSession ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.07)' }} onClick={() => {
                      const nowFree = !isFreeSession;
                      setIsFreeSession(nowFree);
                      setProfileForm(prev => ({ ...prev, rate: nowFree ? 'Free' : '$20' }));
                    }}>
                      {/* Toggle Switch */}
                      <div style={{ position: 'relative', width: '44px', height: '24px', flexShrink: 0 }}>
                        <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: isFreeSession ? '#10B981' : 'rgba(255,255,255,0.12)', transition: 'background 0.25s' }}></div>
                        <div style={{ position: 'absolute', top: '3px', left: isFreeSession ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'left 0.25s' }}></div>
                      </div>
                      <div className="toggle-info">
                        <div style={{ fontSize: '14px', fontWeight: '700', color: isFreeSession ? '#10B981' : '#e5e7eb' }}>🎁 Offer Free Sessions</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                          {isFreeSession ? 'Your sessions are currently FREE — students can book at no cost.' : 'Toggle ON to make all your sessions completely free for students.'}
                        </div>
                      </div>
                      {isFreeSession && (
                        <span className="free-badge-span" style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', color: '#10B981', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.25)' }}>FREE</span>
                      )}
                    </div>

                    <div className="rates-durations-grid">
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>
                          {isFreeSession ? 'Session Rate' : 'Base Hourly Rate *'}
                        </label>
                        {isFreeSession ? (
                          <div style={{ width: '100%', padding: '12px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', color: '#10B981', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🎁</span> Free — No charge to students
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              name="rate"
                              required
                              value={profileForm.rate}
                              onChange={handleTextChange}
                              placeholder="e.g. $25"
                              style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                            />
                            <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>e.g. $25 (60m auto-calculated at 1.8x, 120m at 3.2x)</span>
                          </>
                        )}
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>Allowed Duration Options</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
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

                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>Your Local Timezone (Auto-detected)</label>
                        <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#4ade80', fontSize: '14.5px', fontWeight: 'bold' }}>
                          🌐 {profileForm.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'}
                        </div>
                        <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px', display: 'block' }}>Crucial for calculating scheduling differences. Resolved dynamically from your browser context.</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Slots Checklist */}
                  <div className="glass-box">
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
                  <div className="glass-box">
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
                  <div className="glass-box">
                    <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontFamily: 'Outfit' }}>Profile Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="profile-dossier-grid">
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

                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Personal Meeting Link (Google Meet / Zoom / Calendly / Teams)</label>
                        <input
                          type="url"
                          name="meeting_link"
                          value={profileForm.meeting_link || ''}
                          onChange={handleTextChange}
                          placeholder="e.g. https://meet.google.com/abc-defg-hij or https://zoom.us/j/1234567"
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                        />
                        <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                          If provided, sessions booked with you will use this link. You will be the host/owner of the meeting!
                        </span>
                      </div>

                      <div className="profile-dossier-grid">
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

                  {/* Security & Password */}
                  <div className="glass-box">
                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontFamily: 'Outfit' }}>Security &amp; Password</h3>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>Update your portal login password. Leave these fields blank if you do not wish to change your password.</p>
                    <div className="profile-dossier-grid">
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new secure password..."
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter to confirm password..."
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="form-actions-row">
                    <button
                      type="submit"
                      className="btn btn-primary form-submit-btn"
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
      {selectedBooking && (() => {
        const bTime = getSessionTimeForMentor(selectedBooking);
        const tz = mentorProfile?.timezone || 'America/New_York';
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <div className="glass-box" style={{ maxWidth: '560px', width: '100%', padding: '32px', background: '#0e0a24', border: '1px solid var(--border-light)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'Outfit' }}>Booking Details</h3>
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
                    <span style={{ fontWeight: '600' }}>{fmtDate(bTime.date)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Time</span>
                    <span style={{ fontWeight: '600' }}>{bTime.time} ({tz})</span>
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
                  Close
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
        );
      })()}

      {/* Reschedule Modal */}
      {reschedulingSession && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="glass-box" style={{ maxWidth: '560px', width: '100%', padding: '32px', background: '#0e0a24', border: '1px solid var(--border-light)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'Outfit' }}>Reschedule Session</h3>
              <button
                onClick={() => setReschedulingSession(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer', padding: 0 }}
              >
                ×
              </button>
            </div>

            {rescheduleSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📅</span>
                <h3 style={{ color: '#4ade80', fontSize: '18px', marginBottom: '8px', fontWeight: 'bold' }}>Session Rescheduled</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px' }}>
                  The session with <strong>{reschedulingSession.data.email}</strong> has been successfully rescheduled to <strong>{fmtDate(rescheduleDate)} at {rescheduleTime}</strong>. The student has been notified by email.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setReschedulingSession(null);
                    setRescheduleSuccess(false);
                    setRescheduleDate(null);
                    setRescheduleTime(null);
                  }}
                  style={{ width: '100%', height: '44px', background: 'linear-gradient(135deg, #EC4899, #9333EA)', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ color: '#9ca3af', fontSize: '13.5px', margin: 0, lineHeight: '1.4' }}>
                  Select a new date and time from your available slots. Rescheduling will directly update the booking and notify the student.
                </p>

                {/* 1. Date Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Select Date</label>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {getRescheduleDates().map(dt => {
                      const year = dt.getFullYear();
                      const month = String(dt.getMonth() + 1).padStart(2, '0');
                      const day = String(dt.getDate()).padStart(2, '0');
                      const iso = `${year}-${month}-${day}`;
                      const isSelected = rescheduleDate === iso;
                      
                      const daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      const monsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      
                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => { setRescheduleDate(iso); setRescheduleTime(null); }}
                          style={{
                            flexShrink: 0,
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid var(--rose)' : '1px solid rgba(255,255,255,0.08)',
                            background: isSelected ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.02)',
                            color: isSelected ? 'var(--rose)' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '70px',
                            outline: 'none'
                          }}
                        >
                          <span style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.8 }}>{daysList[dt.getDay()]}</span>
                          <strong style={{ fontSize: '15px', display: 'block', margin: '2px 0', color: isSelected ? '#fff' : '#e5e7eb' }}>{dt.getDate()}</strong>
                          <span style={{ fontSize: '9px', opacity: 0.8 }}>{monsList[dt.getMonth()]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Time Selector */}
                {rescheduleDate && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
                      Available Times
                      {loadingRescheduleAvailability && <span style={{ float: 'right', fontSize: '11px', color: 'var(--rose)', textTransform: 'none' }}>Checking slots...</span>}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', opacity: loadingRescheduleAvailability ? 0.5 : 1 }}>
                      {(() => {
                        const slots = mentorProfile?.slots || ["09:00", "09:30", "10:00", "11:00", "11:30", "14:00", "14:30", "15:00", "16:00", "16:30"];
                        return slots.map(t => {
                          const isBusySlot = mentorBusySlots.includes(t) || (mentorProfile?.busy && mentorProfile.busy.includes(t));
                          const isSelected = rescheduleTime === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={isBusySlot}
                              onClick={() => setRescheduleTime(t)}
                              style={{
                                padding: '8px 4px',
                                borderRadius: '6px',
                                border: isSelected ? '1px solid #9333EA' : isBusySlot ? '1px solid rgba(239,68,68,0.1)' : '1px solid rgba(255,255,255,0.05)',
                                background: isSelected ? 'rgba(147,51,234,0.15)' : isBusySlot ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                                color: isSelected ? '#d8b4fe' : isBusySlot ? '#ff7878' : '#e5e7eb',
                                cursor: isBusySlot ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textDecoration: isBusySlot ? 'line-through' : 'none',
                                outline: 'none'
                              }}
                            >
                              {t}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* 3. Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <button 
                    type="button"
                    className="btn btn-secondary" 
                    onClick={() => setReschedulingSession(null)}
                    disabled={submittingReschedule}
                    style={{ flex: 1, height: '44px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary" 
                    disabled={!rescheduleDate || !rescheduleTime || submittingReschedule}
                    onClick={handleRescheduleSubmit}
                    style={{ flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #EC4899, #9333EA)', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {submittingReschedule ? (
                      <>
                        <svg className="spin" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: '#fff', strokeWidth: 3 }}><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
                        Rescheduling...
                      </>
                    ) : 'Reschedule'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
