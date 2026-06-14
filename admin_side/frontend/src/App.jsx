import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Mic, Users, FolderTree, BookOpen, Inbox, BarChart3, 
  Settings as SettingsIcon, LogOut, Plus, Search, Download, Trash2, 
  Edit, Save, Upload, Link, FileText, CheckCircle, AlertCircle, Info, ExternalLink, X, PlusCircle, Check
} from 'lucide-react';

const API_BASE = 'https://bnb-girl-backend.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('bbg_token') || '');
  const [username, setUsername] = useState(localStorage.getItem('bbg_username') || '');
  const [activeView, setActiveView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Login Form State
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Global Lists shared across views for fast dropdown rendering
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [specializedFields, setSpecializedFields] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth fetch wrapper
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      // Auto logout on unauthorized
      handleLogout();
      throw new Error('Session expired. Please log in again.');
    }
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  };

  // Fetch initial config lists
  const loadGlobalLists = async () => {
    if (!token) return;
    try {
      const cats = await apiFetch('/categories');
      setCategories(cats);
      
      const allSubs = [];
      for (const cat of cats) {
        const subs = await apiFetch(`/categories/${cat._id}/subcategories`);
        allSubs.push(...subs);
      }
      setSubcategories(allSubs);

      const sFields = await apiFetch('/admin/specialized-fields');
      setSpecializedFields(sFields);

      // Fetch episodes (public API has same attributes)
      const epsData = await apiFetch('/admin/episodes');
      setEpisodes(epsData);
    } catch (err) {
      console.error('Error loading config list', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadGlobalLists();
    }
  }, [token]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const data = await apiFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      if (data.success) {
        localStorage.setItem('bbg_token', data.token);
        localStorage.setItem('bbg_username', data.username);
        setToken(data.token);
        setUsername(data.username);
        showToast('Login Successful! Welcome to BBG Platform.');
      }
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('bbg_token');
    localStorage.removeItem('bbg_username');
    setToken('');
    setUsername('');
    setActiveView('dashboard');
    showToast('Logged out successfully.', 'info');
  };

  // Render Login view if no token
  if (!token) {
    return (
      <div className="login-container">
        <div className="login-glass-card animate-scale">
          <div className="flex-center" style={{ marginBottom: '24px' }}>
            <img src="https://bnbgirl.com/wp-content/uploads/2026/03/logo-BjMcg-i3__2___1_-removebg-preview.png" alt="Bold & Brilliant Girls Logo" style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(147, 51, 234, 0.45))' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '900', marginBottom: '8px', background: 'var(--theme-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BBG Platform</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', marginBottom: '32px' }}>Bold & Brilliant Girls Admin Dashboard</p>
          
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            {loginError && (
              <div style={{ backgroundColor: 'hsl(var(--danger) / 0.15)', color: 'hsl(var(--danger))', padding: '12px', borderRadius: 'var(--border-radius-md)', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}
            
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                className="input-field" 
                required 
                value={loginUser} 
                onChange={(e) => setLoginUser(e.target.value)} 
                placeholder="Enter username (admin)" 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label>Password</label>
              <input 
                type="password" 
                className="input-field" 
                required 
                value={loginPass} 
                onChange={(e) => setLoginPass(e.target.value)} 
                placeholder="Enter password (admin123)" 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }} disabled={loggingIn}>
              {loggingIn ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Toast Alert */}
      {toast && (
        <div className="animate-fade" style={{ 
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: toast.type === 'danger' ? 'hsl(var(--danger))' : toast.type === 'info' ? 'hsl(var(--info))' : 'linear-gradient(135deg, var(--primary), var(--accent))',
          color: '#fff', padding: '14px 24px', borderRadius: 'var(--border-radius-md)', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', fontSize: '14px'
        }}>
          {toast.type === 'danger' ? <AlertCircle size={18} /> : toast.type === 'info' ? <Info size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-brand" style={{ padding: '0 20px', gap: '8px' }}>
          <img src="https://bnbgirl.com/wp-content/uploads/2026/03/cropped-logo-BjMcg-i3__2___1_-removebg-preview-192x192.png" alt="BBG Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(147,51,234,0.3))' }} />
          <span className="brand-title">BBG Platform</span>
        </div>
        
        <div className="sidebar-menu">
          <div className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div className={`menu-item ${activeView === 'episodes' ? 'active' : ''}`} onClick={() => setActiveView('episodes')}>
            <Mic size={18} />
            <span>Episodes</span>
          </div>
          <div className={`menu-item ${activeView === 'mentors' ? 'active' : ''}`} onClick={() => setActiveView('mentors')}>
            <Users size={18} />
            <span>Mentors</span>
          </div>
          <div className={`menu-item ${activeView === 'categories' ? 'active' : ''}`} onClick={() => setActiveView('categories')}>
            <FolderTree size={18} />
            <span>Categories</span>
          </div>
          <div className={`menu-item ${activeView === 'resources' ? 'active' : ''}`} onClick={() => setActiveView('resources')}>
            <BookOpen size={18} />
            <span>Resources</span>
          </div>
          <div className={`menu-item ${activeView === 'submissions' ? 'active' : ''}`} onClick={() => setActiveView('submissions')}>
            <Inbox size={18} />
            <span>Submissions</span>
          </div>
          <div className={`menu-item ${activeView === 'stats' ? 'active' : ''}`} onClick={() => setActiveView('stats')}>
            <BarChart3 size={18} />
            <span>Stats Manager</span>
          </div>
          <div className={`menu-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>
            <SettingsIcon size={18} />
            <span>Settings</span>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>{username}</span>
            <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>Administrator</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '6px' }} title="Log out">
            <LogOut size={16} style={{ color: 'hsl(var(--danger))' }} />
          </button>
        </div>
      </div>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="header">
          <div>
            <span style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>BBG Platform / {activeView.charAt(0).toUpperCase() + activeView.slice(1)}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="/" target="_blank" className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '6px' }}>
              <ExternalLink size={14} />
              <span>Visit Site</span>
            </a>
          </div>
        </div>

        <div className="content-area">
          <div className="animate-fade">
            {activeView === 'dashboard' && <DashboardView apiFetch={apiFetch} setView={setActiveView} categories={categories} episodes={episodes} />}
            {activeView === 'episodes' && <EpisodesView apiFetch={apiFetch} showToast={showToast} categories={categories} subcategories={subcategories} specializedFields={specializedFields} loadGlobalLists={loadGlobalLists} />}
            {activeView === 'mentors' && <MentorsView apiFetch={apiFetch} showToast={showToast} categories={categories} subcategories={subcategories} specializedFields={specializedFields} episodes={episodes} />}
            {activeView === 'categories' && <CategoriesView apiFetch={apiFetch} showToast={showToast} categories={categories} subcategories={subcategories} specializedFields={specializedFields} loadGlobalLists={loadGlobalLists} />}
            {activeView === 'resources' && <ResourcesView apiFetch={apiFetch} showToast={showToast} categories={categories} subcategories={subcategories} specializedFields={specializedFields} />}
            {activeView === 'submissions' && <SubmissionsView apiFetch={apiFetch} showToast={showToast} />}
            {activeView === 'stats' && <StatsView apiFetch={apiFetch} showToast={showToast} />}
            {activeView === 'settings' && <SettingsView apiFetch={apiFetch} showToast={showToast} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   SUB-VIEWS COMPONENTS
   ==================================================================== */

// Helper to handle uploading files
async function handleFileUpload(file, apiFetch, showToast) {
  if (!file) return '';
  const formData = new FormData();
  formData.append('file', file);
  
  // Custom fetch for multipart form upload
  const token = localStorage.getItem('bbg_token');
  const response = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'File upload failed');
  }
  return data.url;
}

// ── 1. DASHBOARD VIEW ────────────────────────────────────────────────
function DashboardView({ apiFetch, setView, categories, episodes }) {
  const [stats, setStats] = useState({ episodes: 0, mentors: 0, community: 0, downloads: 0, countries: 0 });
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [recentSubs, setRecentSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const statsData = await apiFetch('/stats');
        setStats(statsData);

        const subsData = await apiFetch('/admin/submissions?page=1');
        setSubmissionsCount(subsData.counts.total);
        setRecentSubs(subsData.rows.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="flex-center" style={{ height: '300px', color: 'hsl(var(--text-secondary))' }}>Loading dashboard metrics...</div>;
  }

  const metricCards = [
    { title: 'Total Episodes', value: stats.episodes, desc: 'Published episodes', icon: '🎙️' },
    { title: 'Active Mentors', value: stats.mentors, desc: 'Mentors in pool', icon: '👩‍🏫' },
    { title: 'Submissions', value: submissionsCount, desc: 'Total form signups', icon: '📩' },
    { title: 'Countries', value: stats.countries, desc: 'Global audience', icon: '🌍' },
  ];

  const formsLabels = {
    'ask_guest': { label: 'Ask a Guest', icon: '💬' },
    'suggest_guest': { label: 'Suggest a Guest', icon: '💡' },
    'community': { label: 'Join Community', icon: '🌟' },
    'quiz': { label: 'Quiz Results', icon: '🎯' },
    'mentorship': { label: 'Mentorship Request', icon: '🌱' },
    'guest_apply': { label: 'Be Our Guest', icon: '🎙️' },
    'mentor_apply': { label: 'Join as Mentor', icon: '🏛️' }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome to Bold & Brilliant Girls platform manager.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        {metricCards.map((card, i) => (
          <div key={i} className="glass-box hoverable">
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>{card.title}</span>
              <span style={{ fontSize: '24px' }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: '800', marginBottom: '4px' }}>{card.value}+</div>
            <span style={{ fontSize: '12px', color: 'hsl(var(--text-muted))' }}>{card.desc}</span>
          </div>
        ))}
      </div>

      <div className="grid-cols-12">
        {/* Recent Submissions */}
        <div style={{ gridColumn: 'span 8' }}>
          <div className="glass-box">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2>Recent Submissions</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setView('submissions')}>View All</button>
            </div>

            {recentSubs.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>No form submissions found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentSubs.map((sub, idx) => {
                  const lbl = formsLabels[sub.form_type] || { label: sub.form_type, icon: '📄' };
                  return (
                    <div key={idx} className="flex-between" style={{ padding: '12px 16px', background: 'hsl(var(--bg-dark))', borderRadius: 'var(--border-radius-md)', border: '1px solid hsl(var(--border-color))' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px' }}>{lbl.icon}</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{lbl.label}</div>
                          <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>From: {sub.data?.email || sub.data?.name || 'Anonymous'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>{new Date(sub.created_at).toLocaleDateString()}</span>
                        <span className={`badge badge-${sub.status}`}>{sub.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div style={{ gridColumn: 'span 4' }}>
          <div className="glass-box" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2>Quick Actions</h2>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setView('episodes')}>+ Add Episode</button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setView('mentors')}>+ Add Mentor</button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setView('resources')}>+ Add Resource</button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setView('categories')}>Manage Categories</button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setView('stats')}>Update Live Stats</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. EPISODES VIEW ─────────────────────────────────────────────────
function EpisodesView({ apiFetch, showToast, categories, subcategories, specializedFields, loadGlobalLists }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Editor view states
  const [editingEp, setEditingEp] = useState(null); // null means listing. {}/obj means edit/new form.
  const [formData, setFormData] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      const queryStr = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiFetch(`/admin/episodes${queryStr}`);
      setList(data);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEpisodes();
  }, [search]);

  const handleEditClick = (ep) => {
    setEditingEp(ep);
    setFormData(ep ? {
      ...ep,
      category_id: ep.category_id?._id || ep.category_id || '',
      subcategory_id: ep.subcategory_id?._id || ep.subcategory_id || '',
      specialized_field_id: ep.specialized_field_id?._id || ep.specialized_field_id || '',
      episode_type: ep.episode_type || 'Interview'
    } : {
      title: '', guest_name: '', guest_role: '', guest_photo: '', guest_bio: '', guest_quote: '',
      episode_number: '', category_id: '', subcategory_id: '', specialized_field_id: '', episode_type: 'Interview',
      youtube_id: '', spotify_url: '', audio_url: '', duration: '', description: '', tags: '', is_featured: false, is_new: true,
      is_mentor: false, mentor_rate: '', mentor_avail: '', mentor_linkedin: '', mentor_fields: '', status: 'published'
    });
    setUploadFile(null);
  };

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // YouTube URL extraction helper
  const handleYoutubePasted = (e) => {
    const val = e.target.value;
    let ytId = val;
    if (val.includes('youtu')) {
      const match = val.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        ytId = match[1];
      }
    }
    setFormData(prev => ({ ...prev, youtube_id: ytId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let photoUrl = formData.guest_photo;
      if (uploadFile) {
        photoUrl = await handleFileUpload(uploadFile, apiFetch, showToast);
      }

      const submissionData = {
        ...formData,
        guest_photo: photoUrl
      };

      if (formData._id) {
        // Update
        await apiFetch(`/admin/episodes/${formData._id}`, {
          method: 'PUT',
          body: JSON.stringify(submissionData)
        });
        showToast('Episode updated successfully!');
      } else {
        // Create
        await apiFetch('/admin/episodes', {
          method: 'POST',
          body: JSON.stringify(submissionData)
        });
        showToast('New episode published successfully!');
      }
      loadEpisodes();
      loadGlobalLists(); // update dropdown counts
      setEditingEp(null);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this episode?')) return;
    try {
      await apiFetch(`/admin/episodes/${id}`, { method: 'DELETE' });
      showToast('Episode deleted successfully.');
      loadEpisodes();
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  const getFilteredSubs = () => {
    if (!formData.category_id) return [];
    return subcategories.filter(s => s.category_id === formData.category_id || s.category_id?._id === formData.category_id);
  };

  const getFilteredSpecializedFields = () => {
    if (!formData.subcategory_id) return [];
    return specializedFields.filter(sf => sf.subcategory_id === formData.subcategory_id || sf.subcategory_id?._id === formData.subcategory_id);
  };

  // ── RENDER LISTING
  if (editingEp === null) {
    return (
      <div>
        <div className="flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1>Episodes Manager</h1>
            <p className="subtitle">Manage podcast episodes, media URLs, and guests.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleEditClick(false)}>
            <Plus size={16} /> Add New Episode
          </button>
        </div>

        {/* Search */}
        <div className="glass-box" style={{ marginBottom: '24px', padding: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
            <input 
              type="text" 
              className="input-field" 
              style={{ paddingLeft: '48px' }}
              placeholder="Search episodes by title, guest name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--text-secondary))' }}>Loading episodes list...</div>
        ) : list.length === 0 ? (
          <div className="glass-box" style={{ padding: '64px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '32px' }}>🎙️</span>
            <p style={{ color: 'hsl(var(--text-muted))', marginTop: '12px' }}>No episodes found. Click 'Add New Episode' to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Episode</th>
                  <th>Guest</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(ep => (
                  <tr key={ep._id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>EP. {ep.episode_number || '—'}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{ep.title}</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>Duration: {ep.duration || '—'}</span>
                        <span className="badge badge-reviewed" style={{ fontSize: '10px', padding: '1px 6px' }}>{ep.episode_type || 'Interview'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {ep.guest_photo ? (
                          <img src={ep.guest_photo} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px' }}>
                            {(ep.guest_name || 'G').charAt(0)}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '500' }}>{ep.guest_name || '—'}</div>
                          <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>{ep.guest_role || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="cat-pill" style={{ backgroundColor: ep.category_id?.color || '#ccc' }}></span>
                        <span>{ep.category_id?.icon} {ep.category_id?.name || 'None'}</span>
                      </div>
                      {ep.subcategory_id && (
                        <div style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', paddingLeft: '18px' }}>&#x21B3; {ep.subcategory_id.name || (typeof ep.subcategory_id === 'object' ? ep.subcategory_id.name : '')}</div>
                      )}
                      {ep.specialized_field_id && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', paddingLeft: '32px' }}>&#x21B3; {ep.specialized_field_id.name || (typeof ep.specialized_field_id === 'object' ? ep.specialized_field_id.name : '')}</div>
                      )}
                    </td>
                    <td>
                      {ep.is_featured ? (
                        <span className="badge badge-actioned" style={{ padding: '2px 8px', fontSize: '10px' }}>Featured</span>
                      ) : (
                        <span style={{ color: 'hsl(var(--text-muted))', fontSize: '12px' }}>No</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${ep.status === 'published' ? 'badge-actioned' : 'badge-draft'}`}>
                        {ep.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(ep)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ep._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER EDITOR / ADD NEW
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <h1>{formData._id ? 'Edit Episode' : 'Create Episode'}</h1>
        <button className="btn btn-secondary" onClick={() => setEditingEp(null)}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-12" style={{ alignItems: 'start' }}>
          {/* Form Main Area */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Episode Details */}
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Episode Details</h2>
              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text" className="input-field" required name="title"
                  value={formData.title} onChange={handleTextChange} 
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Episode Number</label>
                  <input 
                    type="text" className="input-field" name="episode_number" placeholder="e.g. 01"
                    value={formData.episode_number} onChange={handleTextChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input 
                    type="text" className="input-field" name="duration" placeholder="e.g. 18 min"
                    value={formData.duration} onChange={handleTextChange} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="textarea-field" name="description"
                  value={formData.description} onChange={handleTextChange} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Tags (comma separated)</label>
                <input 
                  type="text" className="input-field" name="tags" placeholder="e.g. stem, oxbridge, startup"
                  value={formData.tags} onChange={handleTextChange} 
                />
              </div>
            </div>

            {/* Media URLs */}
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Media links</h2>
              
              <div className="form-group">
                <label>YouTube Link or Video ID</label>
                <input 
                  type="text" className="input-field" name="youtube_id" placeholder="Paste full YouTube URL or ID"
                  value={formData.youtube_id} onChange={handleYoutubePasted}
                />
                <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Pasting a URL will automatically extract the ID.</span>
              </div>

              {formData.youtube_id && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '8px' }}>Thumbnail Preview</label>
                  <img 
                    src={`https://img.youtube.com/vi/${formData.youtube_id}/mqdefault.jpg`} 
                    style={{ borderRadius: 'var(--border-radius-md)', maxWidth: '240px', border: '1px solid hsl(var(--border-color))' }} 
                    alt="" 
                  />
                </div>
              )}

              <div className="grid-cols-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Spotify URL</label>
                  <input 
                    type="url" className="input-field" name="spotify_url" placeholder="https://open.spotify.com/..."
                    value={formData.spotify_url} onChange={handleTextChange} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Direct Audio URL</label>
                  <input 
                    type="url" className="input-field" name="audio_url" placeholder="https://..."
                    value={formData.audio_url} onChange={handleTextChange} 
                  />
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Guest Information</h2>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Guest Name</label>
                  <input 
                    type="text" className="input-field" name="guest_name"
                    value={formData.guest_name} onChange={handleTextChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Guest Role / Title</label>
                  <input 
                    type="text" className="input-field" name="guest_role" placeholder="e.g. Entrepreneur · Oxford"
                    value={formData.guest_role} onChange={handleTextChange} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Guest Photo</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.guest_photo && !uploadFile && (
                    <img src={formData.guest_photo} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid hsl(var(--border-color))' }} alt="" />
                  )}
                  {uploadFile && (
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={18} style={{ color: 'var(--primary)' }} />
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*" id="guest-photo-upload" style={{ display: 'none' }}
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                  <label htmlFor="guest-photo-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Choose Photo File
                  </label>
                  {uploadFile && <span style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>{uploadFile.name}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Guest Bio</label>
                <textarea 
                  className="textarea-field" name="guest_bio"
                  value={formData.guest_bio} onChange={handleTextChange} 
                />
              </div>

              <div className="form-group">
                <label>Guest Quote</label>
                <input 
                  type="text" className="input-field" name="guest_quote" placeholder="e.g. The bravest thing I ever did..."
                  value={formData.guest_quote} onChange={handleTextChange} 
                />
              </div>

              {/* Toggle Mentor Capabilities */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed hsl(var(--border-color))' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: formData.is_mentor ? '20px' : 0 }}>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" name="is_mentor"
                      checked={formData.is_mentor} onChange={handleTextChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>This guest is also available as a Mentor</span>
                </div>

                {formData.is_mentor && (
                  <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'hsl(var(--bg-dark))', padding: '16px', borderRadius: 'var(--border-radius-md)', border: '1px solid hsl(var(--border-color))' }}>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--primary)' }}>Mentor Details (Shows on Mentorship public page)</h4>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label>Mentorship Rate</label>
                        <input 
                          type="text" className="input-field" name="mentor_rate" placeholder="e.g. Free / Paid"
                          value={formData.mentor_rate} onChange={handleTextChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Availability</label>
                        <input 
                          type="text" className="input-field" name="mentor_avail" placeholder="e.g. Monthly, By request"
                          value={formData.mentor_avail} onChange={handleTextChange} 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>LinkedIn URL</label>
                      <input 
                        type="url" className="input-field" name="mentor_linkedin" placeholder="https://linkedin.com/in/..."
                        value={formData.mentor_linkedin} onChange={handleTextChange} 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Expertise Areas (comma separated)</label>
                      <input 
                        type="text" className="input-field" name="mentor_fields" placeholder="e.g. Tech, Leadership, STEM"
                        value={formData.mentor_fields} onChange={handleTextChange} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Sidebar Publish settings */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Publish Settings</h2>
              
              <div className="form-group">
                <label>Status</label>
                <select className="select-field" name="status" value={formData.status} onChange={handleTextChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" name="is_new"
                    checked={formData.is_new} onChange={handleTextChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Mark as NEW badge</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" name="is_featured"
                    checked={formData.is_featured} onChange={handleTextChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Featured Episode</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }} disabled={uploading}>
                {uploading ? 'Publishing...' : formData._id ? 'Update Episode' : 'Publish Episode'}
              </button>
            </div>

            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Category & Taxonomy</h2>
              
              <div className="form-group">
                <label>Main Category</label>
                <select 
                  className="select-field" name="category_id"
                  value={formData.category_id || ''} onChange={handleTextChange}
                >
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sub-category</label>
                <select 
                  className="select-field" name="subcategory_id"
                  value={formData.subcategory_id || ''} onChange={handleTextChange}
                  disabled={!formData.category_id}
                >
                  <option value="">None</option>
                  {getFilteredSubs().map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Specialized Field (Level 3)</label>
                <select 
                  className="select-field" name="specialized_field_id"
                  value={formData.specialized_field_id || ''} onChange={handleTextChange}
                  disabled={!formData.subcategory_id}
                >
                  <option value="">None</option>
                  {getFilteredSpecializedFields().map(sf => (
                    <option key={sf._id} value={sf._id}>{sf.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Episode Type</label>
                <select 
                  className="select-field" name="episode_type"
                  value={formData.episode_type || 'Interview'} onChange={handleTextChange}
                >
                  <option value="Interview">Interview</option>
                  <option value="Solo">Solo</option>
                  <option value="Panel">Panel</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Coaching">Coaching</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── 3. MENTORS VIEW ──────────────────────────────────────────────────
function MentorsView({ apiFetch, showToast, categories, subcategories, specializedFields, episodes }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMentor, setEditingMentor] = useState(null); // null = listing, else form object
  const [formData, setFormData] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadMentors = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/mentors');
      setList(data);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, []);

  const handleEditClick = (mentor) => {
    setEditingMentor(mentor);
    let initialSubId = '';
    if (mentor && mentor.specialized_field_id) {
      const fieldId = mentor.specialized_field_id._id || mentor.specialized_field_id;
      const foundField = specializedFields.find(f => f._id === fieldId);
      if (foundField) {
        initialSubId = foundField.subcategory_id?._id || foundField.subcategory_id || '';
      }
    }
    setFormData(mentor ? {
      ...mentor,
      category_id: mentor.category_id?._id || mentor.category_id || '',
      specialized_field_id: mentor.specialized_field_id?._id || mentor.specialized_field_id || '',
      subcategory_id: initialSubId
    } : {
      name: '', role: '', photo: '', bio: '', quote: '', episode_id: '',
      linkedin: '', expertise_areas: '', rate: '', availability: '', category_id: '',
      subcategory_id: '', specialized_field_id: '', is_featured: false, status: 'published'
    });
    setUploadFile(null);
  };

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getFilteredSubs = () => {
    if (!formData.category_id) return [];
    return subcategories.filter(s => s.category_id === formData.category_id || s.category_id?._id === formData.category_id);
  };

  const getFilteredSpecializedFields = () => {
    if (!formData.subcategory_id) return [];
    return specializedFields.filter(sf => sf.subcategory_id === formData.subcategory_id || sf.subcategory_id?._id === formData.subcategory_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let photoUrl = formData.photo;
      if (uploadFile) {
        photoUrl = await handleFileUpload(uploadFile, apiFetch, showToast);
      }

      const submissionData = {
        ...formData,
        photo: photoUrl
      };

      const { subcategory_id, ...mentorPayload } = submissionData;

      if (formData._id) {
        await apiFetch(`/admin/mentors/${formData._id}`, {
          method: 'PUT',
          body: JSON.stringify(mentorPayload)
        });
        showToast('Dedicated mentor updated!');
      } else {
        await apiFetch('/admin/mentors', {
          method: 'POST',
          body: JSON.stringify(mentorPayload)
        });
        showToast('Dedicated mentor added successfully!');
      }
      loadMentors();
      setEditingMentor(null);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dedicated mentor permanently?')) return;
    try {
      await apiFetch(`/admin/mentors/${id}`, { method: 'DELETE' });
      showToast('Mentor deleted successfully.');
      loadMentors();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  if (editingMentor === null) {
    return (
      <div>
        <div className="flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1>Dedicated Mentors Manager</h1>
            <p className="subtitle">Manage mentors who are NOT episode guests.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleEditClick(false)}>
            <Plus size={16} /> Add Dedicated Mentor
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--text-secondary))' }}>Loading mentors list...</div>
        ) : list.length === 0 ? (
          <div className="glass-box" style={{ padding: '64px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '32px' }}>👩‍🏫</span>
            <p style={{ color: 'hsl(var(--text-muted))', marginTop: '12px' }}>No dedicated mentors yet. Click 'Add Dedicated Mentor' to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Mentor</th>
                  <th>Role</th>
                  <th>Category</th>
                  <th>Linked Episode</th>
                  <th>Rate / Avail</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(m => (
                  <tr key={m._id}>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {m.photo ? (
                          <img src={m.photo} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '600' }}>{m.name}</div>
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" style={{ fontSize: '11px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              LinkedIn <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{m.role || '—'}</td>
                    <td>
                      <div>{m.category_id?.icon} {m.category_id?.name || '—'}</div>
                      {m.specialized_field_id && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>
                          &#x21B3; {m.specialized_field_id.name || (typeof m.specialized_field_id === 'object' ? m.specialized_field_id.name : '')}
                        </div>
                      )}
                    </td>
                    <td>
                      {m.episode_id ? (
                        <div style={{ fontSize: '13px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>EP. {m.episode_id.episode_number}</span> &mdash; {m.episode_id.guest_name}
                        </div>
                      ) : (
                        <span style={{ color: 'hsl(var(--text-muted))', fontSize: '12px' }}>Dedicated (None)</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{m.rate || '—'}</div>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>{m.availability || '—'}</span>
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'published' ? 'badge-actioned' : 'badge-draft'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(m)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER EDITOR / ADD
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <h1>{formData._id ? 'Edit Dedicated Mentor' : 'Add Dedicated Mentor'}</h1>
        <button className="btn btn-secondary" onClick={() => setEditingMentor(null)}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-12" style={{ alignItems: 'start' }}>
          
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Mentor Details</h2>
              
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" className="input-field" name="name" required value={formData.name} onChange={handleTextChange} />
                </div>
                <div className="form-group">
                  <label>Role / Job Title</label>
                  <input type="text" className="input-field" name="role" placeholder="e.g. Founder, Doctor, CEO" value={formData.role} onChange={handleTextChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Photo</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.photo && !uploadFile && (
                    <img src={formData.photo} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid hsl(var(--border-color))' }} alt="" />
                  )}
                  <input 
                    type="file" accept="image/*" id="mentor-photo-upload" style={{ display: 'none' }}
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                  <label htmlFor="mentor-photo-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Choose Photo File
                  </label>
                  {uploadFile && <span style={{ fontSize: '12px' }}>{uploadFile.name}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea className="textarea-field" name="bio" value={formData.bio} onChange={handleTextChange} />
              </div>

              <div className="form-group">
                <label>Quote</label>
                <input type="text" className="input-field" name="quote" value={formData.quote} onChange={handleTextChange} />
              </div>

              <div className="grid-cols-3">
                <div className="form-group">
                  <label>Rate</label>
                  <input type="text" className="input-field" name="rate" placeholder="e.g. Free / Paid" value={formData.rate} onChange={handleTextChange} />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <input type="text" className="input-field" name="availability" placeholder="e.g. Monthly slots" value={formData.availability} onChange={handleTextChange} />
                </div>
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input type="url" className="input-field" name="linkedin" placeholder="https://linkedin.com/..." value={formData.linkedin} onChange={handleTextChange} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Expertise Areas (comma separated)</label>
                <input type="text" className="input-field" name="expertise_areas" placeholder="e.g. Law, Startups, Design" value={formData.expertise_areas} onChange={handleTextChange} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Publish Settings</h2>

              <div className="form-group">
                <label>Status</label>
                <select className="select-field" name="status" value={formData.status} onChange={handleTextChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="select-field" name="category_id" value={formData.category_id || ''} onChange={handleTextChange}>
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sub-category</label>
                <select 
                  className="select-field" name="subcategory_id"
                  value={formData.subcategory_id || ''} onChange={handleTextChange}
                  disabled={!formData.category_id}
                >
                  <option value="">None</option>
                  {getFilteredSubs().map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Specialized Field (Level 3)</label>
                <select 
                  className="select-field" name="specialized_field_id"
                  value={formData.specialized_field_id || ''} onChange={handleTextChange}
                  disabled={!formData.subcategory_id}
                >
                  <option value="">None</option>
                  {getFilteredSpecializedFields().map(sf => (
                    <option key={sf._id} value={sf._id}>{sf.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Linked Episode (optional)</label>
                <select className="select-field" name="episode_id" value={formData.episode_id || ''} onChange={handleTextChange}>
                  <option value="">None — dedicated mentor</option>
                  {episodes.map(e => (
                    <option key={e._id} value={e._id}>EP. {e.episode_number} — {e.guest_name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Link if this person is also an episode guest.</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
                <label className="toggle-switch">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleTextChange} />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Featured Mentor</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }} disabled={uploading}>
                {uploading ? 'Saving...' : formData._id ? 'Update Mentor' : 'Add Dedicated Mentor'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

// ── 4. CATEGORIES VIEW ───────────────────────────────────────────────
function CategoriesView({ apiFetch, showToast, categories, subcategories, specializedFields, loadGlobalLists }) {
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', color: '#9333EA', icon: '📚', description: '', sort_order: 0 });
  
  const [editingSubId, setEditingSubId] = useState(null);
  const [subForm, setSubForm] = useState({ category_id: '', name: '', sort_order: 0 });

  const [editingSfId, setEditingSfId] = useState(null);
  const [sfForm, setSfForm] = useState({ subcategory_id: '', name: '', sort_order: 0 });

  // Handle Category Submit
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await apiFetch(`/admin/categories/${editingCatId}`, {
          method: 'PUT',
          body: JSON.stringify(catForm)
        });
        showToast('Category updated!');
      } else {
        await apiFetch('/admin/categories', {
          method: 'POST',
          body: JSON.stringify(catForm)
        });
        showToast('Category created!');
      }
      setEditingCatId(null);
      setCatForm({ name: '', color: '#9333EA', icon: '📚', description: '', sort_order: 0 });
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Handle Subcategory Submit
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubId) {
        await apiFetch(`/admin/subcategories/${editingSubId}`, {
          method: 'PUT',
          body: JSON.stringify(subForm)
        });
        showToast('Sub-category updated!');
      } else {
        await apiFetch('/admin/subcategories', {
          method: 'POST',
          body: JSON.stringify(subForm)
        });
        showToast('Sub-category created!');
      }
      setEditingSubId(null);
      setSubForm({ category_id: '', name: '', sort_order: 0 });
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Handle Specialized Field Submit
  const handleSfSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSfId) {
        await apiFetch(`/admin/specialized-fields/${editingSfId}`, {
          method: 'PUT',
          body: JSON.stringify(sfForm)
        });
        showToast('Specialized field updated!');
      } else {
        await apiFetch('/admin/specialized-fields', {
          method: 'POST',
          body: JSON.stringify(sfForm)
        });
        showToast('Specialized field created!');
      }
      setEditingSfId(null);
      setSfForm({ subcategory_id: '', name: '', sort_order: 0 });
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Delete category and all its nested subcategories permanently?')) return;
    try {
      await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' });
      showToast('Category deleted.');
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  const handleDeleteSub = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await apiFetch(`/admin/subcategories/${id}`, { method: 'DELETE' });
      showToast('Sub-category deleted.');
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  const handleDeleteSf = async (id) => {
    if (!window.confirm('Delete this specialized field?')) return;
    try {
      await apiFetch(`/admin/specialized-fields/${id}`, { method: 'DELETE' });
      showToast('Specialized field deleted.');
      loadGlobalLists();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1>Categories & Sub-categories</h1>
        <p className="subtitle">Manage page taxonomies, filters, color pills, and emojis.</p>
      </div>

      <div className="grid-cols-12" style={{ alignItems: 'start' }}>
        {/* Left Side: Listing */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="glass-box">
            <h2 style={{ marginBottom: '20px' }}>Taxonomy Tree</h2>
            
            {categories.length === 0 ? (
              <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '32px 0' }}>No categories found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map(cat => {
                  const nested = subcategories.filter(s => s.category_id === cat._id || s.category_id?._id === cat._id);
                  return (
                    <div key={cat._id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'hsl(var(--bg-dark) / 0.5)', padding: '12px 16px', borderRadius: 'var(--border-radius-lg)', border: '1px solid hsl(var(--border-color))' }}>
                      <div className="flex-between">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span className="cat-pill" style={{ backgroundColor: cat.color, width: '16px', height: '16px' }}></span>
                          <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>{cat.name}</span>
                          <span style={{ fontSize: '10px', color: 'hsl(var(--text-muted))' }}>({nested.length} subs)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} onClick={() => {
                            setEditingCatId(cat._id);
                            setCatForm({ ...cat });
                          }}>Edit</button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDeleteCat(cat._id)}>Del</button>
                        </div>
                      </div>
                      
                      {/* Nested subcategories */}
                      {nested.map(sub => {
                        const fields = specializedFields.filter(f => f.subcategory_id === sub._id || f.subcategory_id?._id === sub._id);
                        return (
                          <div key={sub._id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'hsl(var(--bg-card) / 0.3)', borderLeft: '2px solid var(--primary)', marginLeft: '16px', borderRadius: 'var(--border-radius-sm)', marginTop: '4px', padding: '8px 12px' }}>
                            <div className="flex-between" style={{ fontSize: '13px' }}>
                              <span style={{ fontWeight: '600' }}>{sub.name}</span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => {
                                  setEditingSubId(sub._id);
                                  setSubForm({ category_id: sub.category_id?._id || sub.category_id, name: sub.name, sort_order: sub.sort_order });
                                }}>Edit</button>
                                <button className="btn btn-danger btn-sm" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => handleDeleteSub(sub._id)}>Del</button>
                              </div>
                            </div>
                            
                            {/* Level 3 Specialized Fields */}
                            {fields.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', paddingLeft: '8px' }}>
                                {fields.map(f => (
                                  <div key={f._id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'hsl(var(--bg-dark) / 0.8)', border: '1px solid hsl(var(--border-color))', borderRadius: '4px', padding: '2px 8px', fontSize: '11px' }}>
                                    <span>{f.name}</span>
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                      <button style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer', padding: 0 }} onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSfId(f._id);
                                        setSfForm({ subcategory_id: f.subcategory_id?._id || f.subcategory_id, name: f.name, sort_order: f.sort_order });
                                      }} title="Edit Specialized Field">
                                        <Edit size={10} />
                                      </button>
                                      <button style={{ background: 'none', border: 'none', color: 'hsl(var(--danger))', cursor: 'pointer', padding: 0 }} onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSf(f._id);
                                      }} title="Delete Specialized Field">
                                        <X size={10} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Add/Edit Forms */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Category Form */}
          <div className="glass-box">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2>{editingCatId ? 'Edit Category' : 'Add Category'}</h2>
              {editingCatId && (
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setEditingCatId(null);
                  setCatForm({ name: '', color: '#9333EA', icon: '📚', description: '', sort_order: 0 });
                }}>Cancel</button>
              )}
            </div>
            
            <form onSubmit={handleCatSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Category Name *</label>
                <input 
                  type="text" className="input-field" required 
                  value={catForm.name} onChange={(e) => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Icon (Emoji)</label>
                  <input 
                    type="text" className="input-field" maxLength={5}
                    value={catForm.icon} onChange={(e) => setCatForm(prev => ({ ...prev, icon: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Color Picker</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="color" style={{ width: '48px', height: '40px', border: '1px solid hsl(var(--border-color))', background: 'none', padding: '2px', borderRadius: '4px', cursor: 'pointer' }}
                      value={catForm.color} onChange={(e) => setCatForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{catForm.color}</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Description</label>
                <input 
                  type="text" className="input-field" 
                  value={catForm.description} onChange={(e) => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Sort Order</label>
                <input 
                  type="number" className="input-field" min={0}
                  value={catForm.sort_order} onChange={(e) => setCatForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {editingCatId ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>

          {/* Subcategory Form */}
          <div className="glass-box" style={{ marginBottom: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2>{editingSubId ? 'Edit Sub-category' : 'Add Sub-category'}</h2>
              {editingSubId && (
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setEditingSubId(null);
                  setSubForm({ category_id: '', name: '', sort_order: 0 });
                }}>Cancel</button>
              )}
            </div>

            <form onSubmit={handleSubSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Parent Category *</label>
                <select 
                  className="select-field" required
                  value={subForm.category_id} onChange={(e) => setSubForm(prev => ({ ...prev, category_id: e.target.value }))}
                >
                  <option value="">Select Category...</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Sub-category Name *</label>
                <input 
                  type="text" className="input-field" required
                  value={subForm.name} onChange={(e) => setSubForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Sort Order</label>
                <input 
                  type="number" className="input-field" min={0}
                  value={subForm.sort_order} onChange={(e) => setSubForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {editingSubId ? 'Update Sub-category' : 'Add Sub-category'}
              </button>
            </form>
          </div>

          {/* Specialized Field Form */}
          <div className="glass-box">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2>{editingSfId ? 'Edit Specialized Field' : 'Add Specialized Field'}</h2>
              {editingSfId && (
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setEditingSfId(null);
                  setSfForm({ subcategory_id: '', name: '', sort_order: 0 });
                }}>Cancel</button>
              )}
            </div>

            <form onSubmit={handleSfSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Parent Sub-category *</label>
                <select 
                  className="select-field" required
                  value={sfForm.subcategory_id} onChange={(e) => setSfForm(prev => ({ ...prev, subcategory_id: e.target.value }))}
                >
                  <option value="">Select Sub-category...</option>
                  {categories.map(c => {
                    const subs = subcategories.filter(s => s.category_id === c._id || s.category_id?._id === c._id);
                    if (subs.length === 0) return null;
                    return (
                      <optgroup key={c._id} label={`${c.icon} ${c.name}`}>
                        {subs.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Field Name *</label>
                <input 
                  type="text" className="input-field" required
                  value={sfForm.name} onChange={(e) => setSfForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Sort Order</label>
                <input 
                  type="number" className="input-field" min={0}
                  value={sfForm.sort_order} onChange={(e) => setSfForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {editingSfId ? 'Update Field' : 'Add Field'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 5. RESOURCES VIEW ────────────────────────────────────────────────
function ResourcesView({ apiFetch, showToast, categories, subcategories, specializedFields }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRes, setEditingRes] = useState(null); // null = listing, else object
  const [formData, setFormData] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const resourceTypes = {
    'pdf': 'Episode PDF',
    'guide': 'Career Guide',
    'template': 'Template',
    'worksheet': 'Workbook',
    'reading': 'Reading List',
    'toolkit': 'Toolkit',
    'salary': 'Salary Report',
    'script': 'Scripts & Emails'
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/resources');
      setList(data);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleEditClick = (res) => {
    setEditingRes(res);
    setFormData(res ? {
      ...res,
      category_id: res.category_id?._id || res.category_id || '',
      subcategory_id: res.subcategory_id?._id || res.subcategory_id || '',
      specialized_field_id: res.specialized_field_id?._id || res.specialized_field_id || ''
    } : {
      title: '', description: '', resource_type: 'pdf', category_id: '',
      subcategory_id: '', specialized_field_id: '', episode_ref: '', file_url: '', external_link: '',
      pages: 0, icon: '📄', cover_color: '', is_featured: false, is_coming_soon: true,
      sort_order: 0, status: 'published'
    });
    setUploadFile(null);
  };

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let fileUrl = formData.file_url;
      if (uploadFile) {
        fileUrl = await handleFileUpload(uploadFile, apiFetch, showToast);
      }

      const submissionData = {
        ...formData,
        file_url: fileUrl
      };

      if (formData._id) {
        await apiFetch(`/admin/resources/${formData._id}`, {
          method: 'PUT',
          body: JSON.stringify(submissionData)
        });
        showToast('Resource updated successfully!');
      } else {
        await apiFetch('/admin/resources', {
          method: 'POST',
          body: JSON.stringify(submissionData)
        });
        showToast('Resource added successfully!');
      }
      loadResources();
      setEditingRes(null);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource permanently?')) return;
    try {
      await apiFetch(`/admin/resources/${id}`, { method: 'DELETE' });
      showToast('Resource deleted.');
      loadResources();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  const getFilteredSubs = () => {
    if (!formData.category_id) return [];
    return subcategories.filter(s => s.category_id === formData.category_id || s.category_id?._id === formData.category_id);
  };

  const getFilteredSpecializedFields = () => {
    if (!formData.subcategory_id) return [];
    return specializedFields.filter(sf => sf.subcategory_id === formData.subcategory_id || sf.subcategory_id?._id === formData.subcategory_id);
  };

  if (editingRes === null) {
    return (
      <div>
        <div className="flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1>Resources Manager</h1>
            <p className="subtitle">Manage PDFs, Career Guides, Salary Reports, and tools.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleEditClick(false)}>
            <Plus size={16} /> Add Resource
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--text-secondary))' }}>Loading resources list...</div>
        ) : list.length === 0 ? (
          <div className="glass-box" style={{ padding: '64px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '32px' }}>📚</span>
            <p style={{ color: 'hsl(var(--text-muted))', marginTop: '12px' }}>No resources added yet. Click 'Add Resource' to start.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Ref</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>{r.icon}</span>
                        <div>
                          <div style={{ fontWeight: '600' }}>{r.title}</div>
                          <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>Pages: {r.pages || '—'} {r.is_coming_soon ? '(Coming Soon)' : ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-reviewed" style={{ fontSize: '10px' }}>{resourceTypes[r.resource_type] || r.resource_type}</span>
                    </td>
                    <td>
                      <div>{r.category_id?.icon} {r.category_id?.name || '—'}</div>
                      {r.subcategory_id && (
                        <div style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', paddingLeft: '18px' }}>&#x21B3; {r.subcategory_id.name || (typeof r.subcategory_id === 'object' ? r.subcategory_id.name : '')}</div>
                      )}
                      {r.specialized_field_id && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', paddingLeft: '32px' }}>&#x21B3; {r.specialized_field_id.name || (typeof r.specialized_field_id === 'object' ? r.specialized_field_id.name : '')}</div>
                      )}
                    </td>
                    <td style={{ fontSize: '13px' }}>{r.episode_ref || '—'}</td>
                    <td>
                      <span className={`badge ${r.status === 'published' ? 'badge-actioned' : 'badge-draft'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(r)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER EDITOR / ADD
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <h1>{formData._id ? 'Edit Resource' : 'Add Resource'}</h1>
        <button className="btn btn-secondary" onClick={() => setEditingRes(null)}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-12" style={{ alignItems: 'start' }}>
          
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Resource Details</h2>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" className="input-field" required name="title" value={formData.title} onChange={handleTextChange} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="textarea-field" name="description" value={formData.description} onChange={handleTextChange} />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Episode Reference</label>
                  <input type="text" className="input-field" name="episode_ref" placeholder="e.g. EP. 01 · Guest Name" value={formData.episode_ref} onChange={handleTextChange} />
                </div>
                <div className="form-group">
                  <label>Pages Count</label>
                  <input type="number" className="input-field" min={0} name="pages" value={formData.pages} onChange={handleTextChange} />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Emoji Icon</label>
                  <input type="text" className="input-field" maxLength={5} name="icon" value={formData.icon} onChange={handleTextChange} />
                </div>
                <div className="form-group">
                  <label>Cover Gradient CSS (CSS background)</label>
                  <input type="text" className="input-field" name="cover_color" placeholder="linear-gradient(135deg,#6B21A8,#EC4899)" value={formData.cover_color} onChange={handleTextChange} />
                </div>
              </div>
            </div>

            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>File / Download Link</h2>
              
              <div className="form-group">
                <label>Upload File (PDF/Document)</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.file_url && !uploadFile && (
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>Has file: {formData.file_url.split('/').pop()}</span>
                  )}
                  <input 
                    type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" id="res-file-upload" style={{ display: 'none' }}
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                  <label htmlFor="res-file-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Choose File
                  </label>
                  {uploadFile && <span style={{ fontSize: '12px' }}>{uploadFile.name}</span>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>OR External Link URL</label>
                <input type="url" className="input-field" name="external_link" placeholder="https://drive.google.com/..." value={formData.external_link} onChange={handleTextChange} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Publish Settings</h2>

              <div className="form-group">
                <label>Type</label>
                <select className="select-field" name="resource_type" value={formData.resource_type} onChange={handleTextChange}>
                  {Object.entries(resourceTypes).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="select-field" name="category_id" value={formData.category_id || ''} onChange={handleTextChange}>
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sub-category</label>
                <select 
                  className="select-field" name="subcategory_id" value={formData.subcategory_id || ''} onChange={handleTextChange}
                  disabled={!formData.category_id}
                >
                  <option value="">None</option>
                  {getFilteredSubs().map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Specialized Field (Level 3)</label>
                <select 
                  className="select-field" name="specialized_field_id"
                  value={formData.specialized_field_id || ''} onChange={handleTextChange}
                  disabled={!formData.subcategory_id}
                >
                  <option value="">None</option>
                  {getFilteredSpecializedFields().map(sf => (
                    <option key={sf._id} value={sf._id}>{sf.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select className="select-field" name="status" value={formData.status} onChange={handleTextChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <label className="toggle-switch">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleTextChange} />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Featured Resource</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
                <label className="toggle-switch">
                  <input type="checkbox" name="is_coming_soon" checked={formData.is_coming_soon} onChange={handleTextChange} />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Coming Soon (Download locked)</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }} disabled={uploading}>
                {uploading ? 'Saving...' : formData._id ? 'Update Resource' : 'Publish Resource'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

// ── 6. SUBMISSIONS VIEW ──────────────────────────────────────────────
function SubmissionsView({ apiFetch, showToast }) {
  const [activeTab, setActiveTab] = useState('ask_guest');
  const [list, setList] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const tabs = [
    { key: 'ask_guest', label: 'Ask a Guest', icon: '💬' },
    { key: 'suggest_guest', label: 'Suggest a Guest', icon: '💡' },
    { key: 'community', label: 'Community Signups', icon: '🌟' },
    { key: 'quiz', label: 'Quiz Results', icon: '🎯' },
    { key: 'mentorship', label: 'Mentorship Request', icon: '🌱' },
    { key: 'guest_apply', label: 'Be Our Guest', icon: '🎙️' },
    { key: 'mentor_apply', label: 'Join as Mentor', icon: '🏛️' }
  ];

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const q = [
        `tab=${activeTab}`,
        `page=${page}`,
        statusFilter ? `status=${statusFilter}` : '',
        search ? `s=${encodeURIComponent(search)}` : ''
      ].filter(Boolean).join('&');

      const data = await apiFetch(`/admin/submissions?${q}`);
      setList(data.rows);
      setCounts(data.counts);
      setTotalPages(Math.ceil(data.total / 30));
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [activeTab, page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadSubmissions();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiFetch(`/admin/submissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      showToast('Status updated successfully.');
      loadSubmissions();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  const getCols = (t) => {
    const mapping = {
      'ask_guest': ['name', 'email', 'question', 'guest_for'],
      'suggest_guest': ['name', 'email', 'field', 'suggestion'],
      'community': ['name', 'email', 'age', 'field', 'dream', 'source'],
      'quiz': ['name', 'email', 'stage', 'result', 'match_pct'],
      'mentorship': ['name', 'email', 'field', 'stage', 'goals', 'urgency', 'session_pref'],
      'guest_apply': ['name', 'email', 'job_title', 'pitch', 'motivation'],
      'mentor_apply': ['name', 'email', 'job_title', 'years_exp', 'expertise', 'hours']
    };
    return mapping[t] || ['name', 'email'];
  };

  const handleExport = (single = true) => {
    const token = localStorage.getItem('bbg_token');
    const url = `${API_BASE}/admin/submissions/export?${single ? `form=${activeTab}` : ''}`;
    
    // Download using standard token authorization in URL or fetch
    // Since browser standard link triggers don't send auth headers, we can fetch, convert to blob, and save
    showToast('Preparing download...', 'info');
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `bbg-export-${single ? activeTab : 'all'}-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      showToast('Download started!');
    })
    .catch(err => {
      showToast('Export failed', 'danger');
      console.error(err);
    });
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1>Form Submissions</h1>
          <p className="subtitle">Manage user entries, applications, and feedback.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleExport(false)}>
          <Download size={16} /> Download ALL Forms (CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        {tabs.map(t => (
          <button 
            key={t.key} 
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(t.key);
              setPage(1);
              setSearch('');
              setStatusFilter('');
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span className="badge-pill-count">{counts[t.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass-box" style={{ marginBottom: '24px', padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
            <input 
              type="text" className="input-field" placeholder="Search entries..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">Search</button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              className="select-field" style={{ width: '160px' }}
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="actioned">Actioned</option>
              <option value="spam">Spam</option>
            </select>
            
            <button type="button" className="btn btn-secondary" onClick={() => handleExport(true)} style={{ display: 'flex', gap: '6px' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--text-secondary))' }}>Loading submission list...</div>
      ) : list.length === 0 ? (
        <div className="glass-box" style={{ padding: '64px 0', textAlign: 'center' }}>
          <Inbox size={32} style={{ color: 'hsl(var(--text-muted))' }} />
          <p style={{ color: 'hsl(var(--text-muted))', marginTop: '12px' }}>No submissions found for this form category.</p>
        </div>
      ) : (
        <div>
          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {getCols(activeTab).map(c => (
                    <th key={c}>{c.replace('_', ' ')}</th>
                  ))}
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(row => {
                  const d = row.data || {};
                  return (
                    <tr key={row._id}>
                      <td style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', whiteSpace: 'nowrap' }}>
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      {getCols(activeTab).map(c => {
                        const cellVal = d[c] || '';
                        return (
                          <td key={c} style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={String(cellVal)}>
                            {typeof cellVal === 'object' ? JSON.stringify(cellVal) : String(cellVal)}
                          </td>
                        );
                      })}
                      <td>
                        <span className={`badge badge-${row.status}`}>{row.status}</span>
                      </td>
                      <td>
                        <select 
                          className="select-field" style={{ padding: '4px 8px', fontSize: '12px', width: '110px' }}
                          value={row.status}
                          onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="actioned">Actioned</option>
                          <option value="spam">Spam</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '20px', justifyContent: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  className={`btn ${p === page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 7. STATS VIEW ───────────────────────────────────────────────────
function StatsView({ apiFetch, showToast }) {
  const [stats, setStats] = useState({
    episodes: '', mentors: '', community: '', downloads: '', 
    countries: '', response: '', industries: '', views: '', views_unit: 'M+'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fields = {
    'episodes': { icon: '🎙️', label: 'Episodes', hint: 'Published episodes count' },
    'mentors': { icon: '👩‍🏫', label: 'Mentors', hint: 'Active mentors' },
    'community': { icon: '👥', label: 'Community', hint: 'Community members signups' },
    'downloads': { icon: '📥', label: 'Downloads', hint: 'Total materials downloaded' },
    'countries': { icon: '🌍', label: 'Countries', hint: 'Countries represented' },
    'response': { icon: '⚡', label: 'Response days', hint: 'Average days taken to respond' },
    'industries': { icon: '💼', label: 'Industries', hint: 'Distinct industry categories' },
    'views': { icon: '👀', label: 'Views', hint: 'Platform views' },
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiFetch('/admin/stats');
        setStats(data);
      } catch (err) {
        showToast(err.message, 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/admin/stats', {
        method: 'PUT',
        body: JSON.stringify(stats)
      });
      showToast('Live website statistics saved successfully!');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--text-secondary))' }}>Loading stats fields...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1>Stats Manager</h1>
        <p className="subtitle">Update indicators and numbers displayed on the public landing page.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="glass-box">
          <div className="grid-cols-4" style={{ gap: '20px' }}>
            {Object.entries(fields).map(([key, f]) => (
              <div key={key} className="glass-box" style={{ padding: '16px', background: 'hsl(var(--bg-dark))', borderStyle: 'dashed', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '28px' }}>{f.icon}</span>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>{f.label}</label>
                <input 
                  type="text" className="input-field" name={key}
                  value={stats[key]} onChange={handleChange}
                />
                <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>{f.hint}</span>
              </div>
            ))}
            
            <div className="glass-box" style={{ padding: '16px', background: 'hsl(var(--bg-dark))', borderStyle: 'dashed', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '28px' }}>🔤</span>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Views Unit</label>
              <select 
                className="select-field" name="views_unit"
                value={stats.views_unit} onChange={handleChange}
              >
                <option value="M+">M+</option>
                <option value="K+">K+</option>
                <option value="+">+</option>
              </select>
              <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>Suffix placed after the views number</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', minWidth: '180px', height: '44px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Stats'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── 8. SETTINGS VIEW ─────────────────────────────────────────────────
function SettingsView({ apiFetch, showToast }) {
  const [settings, setSettings] = useState({
    bbg_email: '', bbg_email_on_submit: true, bbg_quiz_gate: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiFetch('/admin/settings');
        setSettings(data);
      } catch (err) {
        showToast(err.message, 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggle = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      showToast('Settings saved.');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '200px', color: 'hsl(var(--text-secondary))' }}>Loading system settings...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1>Settings</h1>
        <p className="subtitle">Configure platform triggers, email notifications, and quiz policies.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid-cols-12" style={{ alignItems: 'start' }}>
          
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Email Notifications</h2>
              <div className="form-group">
                <label>Recipient Notification Email</label>
                <input 
                  type="email" className="input-field" required
                  value={settings.bbg_email} 
                  onChange={(e) => setSettings(prev => ({ ...prev, bbg_email: e.target.value }))}
                />
                <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Form submission alerts are sent here.</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.bbg_email_on_submit} 
                    onChange={() => handleToggle('bbg_email_on_submit')}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Send email alerts on submission</span>
              </div>
            </div>

            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Quiz Settings</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.bbg_quiz_gate} 
                    onChange={() => handleToggle('bbg_quiz_gate')}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Require YouTube subscription to display quiz results</span>
              </div>
            </div>

            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Migrated Public API Endpoints</h2>
              <p style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>Your frontend HTML pages can hook into these replicated endpoints on this server:</p>
              
              {['stats', 'episodes', 'mentors', 'resources', 'categories'].map(endpoint => (
                <div key={endpoint} style={{ display: 'flex', gap: '12px', padding: '10px 14px', background: 'hsl(var(--bg-dark))', borderRadius: 'var(--border-radius-md)', border: '1px solid hsl(var(--border-color))', fontSize: '13px', marginBottom: '8px' }}>
                  <span className="badge badge-actioned" style={{ padding: '2px 8px', fontSize: '9px' }}>GET</span>
                  <code style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{`/api/${endpoint}`}</code>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <div className="glass-box">
              <h2 style={{ marginBottom: '20px' }}>Save Changes</h2>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
