import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = 'https://bnb-girl-backend.onrender.com';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};

export default function AppContextProvider({ children }) {
  const [stats, setStats] = useState({
    episodes: 0,
    mentors: 0,
    community: 0,
    downloads: 0,
    countries: 0,
    views: 0,
    views_unit: 'M+'
  });
  const [episodes, setEpisodes] = useState([]);
  const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format DB episode to frontend EP structure
  const formatDbEpisode = (ep) => ({
    id: ep.id || ep._id,
    n: ep.episode_number || '',
    title: ep.title || '',
    guest: ep.guest_name || '',
    role: ep.guest_role || '',
    cat: ep.category_name || (ep.category_id && ep.category_id.name) || '',
    category_slug: ep.category_slug || (ep.category_id && ep.category_id.slug) || '',
    subcategory_name: ep.subcategory_name || (ep.subcategory_id && ep.subcategory_id.name) || '',
    dur: ep.duration || '',
    isNew: ep.is_new === 1 || ep.is_new === true,
    thumb: ep.youtube_id ? `https://img.youtube.com/vi/${ep.youtube_id}/mqdefault.jpg` : 'https://placehold.co/640x360/0F0A1E/fff?text=Podcast',
    photo: ep.guest_photo || 'https://placehold.co/64x64/9333EA/fff?text=Guest',
    prog: 0,
    yt: ep.youtube_id || '',
    tags: typeof ep.tags === 'string' ? ep.tags.split(',').map(t => t.trim()) : (ep.tags || []),
    bio: ep.guest_bio || '',
    quote: ep.guest_quote || '',
    facts: [
      { l: 'Based in', v: ep.guest_role ? ep.guest_role.split(' · ')[1] || 'Global' : 'Global' },
      { l: 'Episode', v: `EP. ${ep.episode_number || ''}` },
      { l: 'Duration', v: ep.duration || '' },
      { l: 'Industry', v: ep.category_name || (ep.category_id && ep.category_id.name) || '' }
    ]
  });

  // Group DB resources by categories
  const groupResourcesByCategories = (cats, resList) => {
    return cats.map(cat => {
      const catResources = resList.filter(res => res.category_id === cat._id || res.cat_name === cat.name || res.category_name === cat.name);
      const subfields = ['All', ...new Set(catResources.map(r => r.subcategory_name).filter(Boolean))];
      
      return {
        id: cat.slug || cat._id,
        emoji: cat.icon || '📚',
        name: cat.name,
        sub: cat.description || '',
        color: cat.color || '#6B21A8',
        subfields,
        resources: catResources.map(r => ({
          id: r.id || r._id,
          type: r.resource_type || 'pdf',
          icon: r.icon || '📄',
          title: r.title || '',
          desc: r.description || '',
          pages: r.pages || 0,
          ep: r.episode_ref || 'All Episodes',
          bg: r.cover_color || 'linear-gradient(135deg,#6B21A8,#EC4899)',
          tags: typeof r.tags === 'string' ? r.tags.split(',').map(t => t.trim()) : (r.tags || []),
          isComingSoon: r.is_coming_soon === 1 || r.is_coming_soon === true,
          fileUrl: r.file_url || '',
          externalLink: r.external_link || ''
        }))
      };
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${API_BASE}/api/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          episodes: parseInt(statsData.episodes) || 0,
          mentors: parseInt(statsData.mentors) || 0,
          community: parseInt(statsData.community) || 0,
          downloads: parseInt(statsData.downloads) || 0,
          countries: parseInt(statsData.countries) || 0,
          views: parseInt(statsData.views) || 0,
          views_unit: statsData.views_unit || 'M+'
        });
      }

      // 2. Fetch Categories
      const catsRes = await fetch(`${API_BASE}/api/categories`);
      let catsData = [];
      if (catsRes.ok) {
        catsData = await catsRes.json();
        setCategories(catsData);
      }

      // 3. Fetch Episodes
      const epsRes = await fetch(`${API_BASE}/api/episodes?per_page=100`);
      if (epsRes.ok) {
        const epsData = await epsRes.json();
        const formatted = epsData.rows.map(formatDbEpisode);
        setEpisodes(formatted);
        
        // Featured ones (Editor's Picks)
        const featured = formatted.filter(ep => ep.is_featured || ep.n === '01');
        // Fallback to first few if none marked featured
        setFeaturedEpisodes(featured.length > 0 ? featured : formatted.slice(0, 4));
      }

      // 4. Fetch Mentors
      const mentorsRes = await fetch(`${API_BASE}/api/mentors`);
      if (mentorsRes.ok) {
        const mentorsData = await mentorsRes.json();
        setMentors(mentorsData);
      }

      // 5. Fetch Resources
      const resRes = await fetch(`${API_BASE}/api/resources?per_page=100`);
      if (resRes.ok) {
        const resData = await resRes.json();
        const grouped = groupResourcesByCategories(catsData, resData.rows);
        setResources(grouped);
      }
    } catch (err) {
      console.error('Error fetching dynamic platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (formType, payload) => {
    let endpoint = '';
    switch (formType) {
      case 'ask_guest':
        endpoint = '/api/ask-guest';
        break;
      case 'suggest_guest':
        endpoint = '/api/suggest-guest';
        break;
      case 'community':
        endpoint = '/api/community';
        break;
      case 'quiz':
        endpoint = '/api/quiz';
        break;
      case 'mentorship':
        endpoint = '/api/mentorship';
        break;
      case 'guest_apply':
        endpoint = '/api/guest-apply';
        break;
      case 'mentor_apply':
        endpoint = '/api/mentor-apply';
        break;
      default:
        throw new Error(`Unknown form type: ${formType}`);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit form');
    }
    return data;
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppContext.Provider value={{
      stats,
      episodes,
      featuredEpisodes,
      categories,
      mentors,
      resources,
      loading,
      refreshData: loadData,
      submitForm
    }}>
      {children}
    </AppContext.Provider>
  );
}
