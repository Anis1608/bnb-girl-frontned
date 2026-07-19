import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_BASE } from '../context/AppContext';

export const EPS = {};


const SUBTOPICS = {
  all: [],
  arts: ['All', 'Film & TV', 'Music', 'Social Media', 'Writing'],
  business: ['All', 'Entrepreneurship', 'Branding', 'Marketing', 'Strategy'],
  health: ['All', 'Mental Health', 'Fitness', 'Beauty & Skincare', 'Wellness'],
  tech: ['All', 'AI & Future', 'Engineering', 'Product', 'Software'],
  leadership: ['All', 'Founders', 'Corporate', 'Activism'],
  finance: ['All', 'Investing', 'Personal Finance', 'Wealth Building'],
  law: ['All', 'Corporate Law', 'Human Rights', 'IP & Tech Law'],
  social: ['All', 'Activism', 'Community', 'Policy']
};

const CAT_LABELS = {
  all: 'All Episodes',
  arts: 'Arts & Media',
  business: 'Business',
  health: 'Health & Wellness',
  tech: 'Tech & STEM',
  leadership: 'Leadership',
  finance: 'Finance',
  law: 'Law',
  social: 'Social'
};

const SUBTOPIC_MAP = {
  'Mental Health': 'mental',
  'Wellness': 'wellness',
  'Beauty & Skincare': 'beauty',
  'Fitness': 'fitness',
  'Branding': 'branding',
  'Entrepreneurship': 'entrepreneurship',
  'Marketing': 'marketing',
  'Music': 'music',
  'Film & TV': 'film',
  'Social Media': 'social',
  'Writing': 'writing',
  'Tech': 'media',
  'Investing': 'investing'
};

const SYNONYMS = {
  job: ['career', 'work', 'employ', 'position', 'hire', 'recruit', 'cv', 'resume', 'portfolio', 'interview', 'salary', 'progress'],
  career: ['job', 'work', 'employ', 'position', 'hire', 'recruit', 'cv', 'resume', 'portfolio', 'interview', 'salary', 'progress'],
  cv: ['resume', 'portfolio', 'profile', 'apply', 'job', 'bio', 'letter'],
  resume: ['cv', 'portfolio', 'profile', 'apply', 'job', 'bio', 'letter'],
  interview: ['prep', 'question', 'star', 'prepare', 'job', 'hiring', 'hr', 'test'],
  hiring: ['job', 'work', 'employ', 'apply', 'interview'],
  
  money: ['finance', 'wealth', 'budget', 'salary', 'earn', 'investment', 'pay', 'income', 'compensation', 'stock', 'save'],
  wealth: ['money', 'finance', 'budget', 'salary', 'earn', 'investment', 'pay', 'income', 'compensation', 'stock', 'save'],
  salary: ['pay', 'earn', 'income', 'wage', 'money', 'wealth', 'compensation', 'rate', 'negotiate'],
  income: ['pay', 'earn', 'salary', 'wage', 'money', 'wealth', 'compensation', 'rate'],
  finance: ['money', 'wealth', 'budget', 'salary', 'investment', 'stock', 'saving', 'banking', 'fintech'],
  budget: ['saving', 'track', 'expense', 'money', 'workbook', 'personal finance'],
  investment: ['stock', 'save', 'grow', 'capital', 'finance', 'wealth'],

  tech: ['stem', 'software', 'coding', 'developer', 'engineering', 'programmer', 'science', 'computer', 'data', 'math'],
  coding: ['software', 'developer', 'programmer', 'tech', 'engineering', 'computer', 'science', 'data'],
  software: ['coding', 'developer', 'programmer', 'tech', 'engineering', 'computer', 'science', 'data'],
  engineering: ['tech', 'software', 'coding', 'science', 'computer', 'data', 'mechanic'],
  science: ['stem', 'biology', 'math', 'data science', 'physics', 'chemistry', 'research'],
  data: ['analytics', 'database', 'science', 'tech', 'computer'],

  stress: ['burnout', 'mental', 'mind', 'wellness', 'wellbeing', 'anxiety', 'calm', 'peace', 'stress', 'compassion'],
  burnout: ['stress', 'mental', 'mind', 'wellness', 'wellbeing', 'anxiety', 'calm', 'peace', 'recovery'],
  peace: ['stress', 'burnout', 'mental', 'mind', 'wellness', 'wellbeing', 'calm', 'anxiety', 'mindfulness'],
  wellness: ['wellbeing', 'mental', 'mind', 'stress', 'burnout', 'calm', 'peace', 'mindfulness', 'imposter'],
  wellbeing: ['wellness', 'mental', 'mind', 'stress', 'burnout', 'calm', 'peace', 'mindfulness', 'imposter'],
  confidence: ['imposter', 'syndrome', 'mindset', 'affirmation', 'worth', 'self-esteem', 'fear'],
  imposter: ['confidence', 'syndrome', 'mindset', 'affirmation', 'worth', 'self-esteem', 'fear'],

  business: ['startup', 'founder', 'entrepreneur', 'side hustle', 'pitch', 'deck', 'investment', 'model', 'canvas', 'brand'],
  startup: ['business', 'founder', 'entrepreneur', 'side hustle', 'pitch', 'deck', 'investment', 'model', 'canvas', 'brand'],
  founder: ['business', 'startup', 'entrepreneur', 'side hustle', 'pitch', 'deck', 'investment', 'model', 'canvas', 'brand'],
  brand: ['marketing', 'positioning', 'logo', 'identity', 'hustle', 'founder', 'business'],

  law: ['legal', 'court', 'justice', 'bar exam', 'lawyer', 'contract', 'agreement'],
  legal: ['law', 'court', 'justice', 'bar exam', 'lawyer', 'contract', 'agreement'],
  lawyer: ['law', 'legal', 'court', 'justice', 'bar exam', 'contract', 'agreement'],

  study: ['education', 'teaching', 'school', 'college', 'student', 'graduate', 'learn', 'academy'],
  learn: ['education', 'teaching', 'school', 'college', 'student', 'graduate', 'study', 'academy'],
  student: ['education', 'study', 'graduate', 'school', 'college', 'learn', 'networking'],
};

function levenshteinDistance(s1, s2) {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[len1][len2];
}

function isFuzzyMatch(word1, word2) {
  const w1 = word1.toLowerCase().trim();
  const w2 = word2.toLowerCase().trim();
  if (w1 === w2) return true;
  if (w1.length < 3 || w2.length < 3) return false;
  const maxDist = w1.length > 5 ? 2 : 1;
  return levenshteinDistance(w1, w2) <= maxDist;
}

const getEpisodeRelevanceScore = (ep, queryStr) => {
  const q = queryStr.toLowerCase().trim();
  if (!q) return 1;

  const terms = q.split(/\s+/).filter(Boolean);
  let totalScore = 0;

  const title = (ep.title || '').toLowerCase();
  const guest = (ep.name || ep.guest || '').toLowerCase();
  const role = (ep.role || '').toLowerCase();
  const catL = (ep.catL || ep.category_name || '').toLowerCase();
  const tags = (ep.tags || []).map(t => t.toLowerCase());
  const quote = (ep.ins?.quote || '').toLowerCase();
  const summary = (ep.ins?.summary || '').toLowerCase();
  const takeaways = (ep.ins?.takeaways || []).map(t => t.toLowerCase());
  const themes = (ep.ins?.themes || []).map(t => t.toLowerCase());

  terms.forEach(term => {
    let termScore = 0;

    // Direct substring matches
    if (guest.includes(term)) termScore += 25;
    if (title.includes(term)) termScore += 15;
    if (catL.includes(term)) termScore += 10;
    if (role.includes(term)) termScore += 8;
    if (tags.some(t => t.includes(term))) termScore += 6;
    if (themes.some(t => t.includes(term))) termScore += 5;
    if (summary.includes(term)) termScore += 4;
    if (quote.includes(term)) termScore += 3;
    if (takeaways.some(t => t.includes(term))) termScore += 2;

    // Fuzzy matching
    const titleWords = title.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const guestWords = guest.split(/[^a-zA-Z0-9]+/).filter(Boolean);

    if (guestWords.some(w => isFuzzyMatch(w, term))) termScore += 20;
    if (titleWords.some(w => isFuzzyMatch(w, term))) termScore += 10;
    if (tags.some(t => isFuzzyMatch(t, term))) termScore += 8;
    if (themes.some(t => isFuzzyMatch(t, term))) termScore += 6;

    // Synonyms
    const syns = SYNONYMS[term] || [];
    syns.forEach(syn => {
      if (guest.includes(syn)) termScore += 10;
      if (title.includes(syn)) termScore += 5;
      if (tags.some(t => t.includes(syn))) termScore += 4;
      if (themes.some(t => t.includes(syn))) termScore += 3;
      if (summary.includes(syn)) termScore += 2;
    });

    totalScore += termScore;
  });

  return totalScore;
};

export default function EpisodesPage({ onOpenGuestModal, onOpenAudioPlayer, onShowToast }) {
  const { episodes: dbEpisodes, categories: dbCategories, loading, fetchFilteredEpisodes } = useApp();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [heroQuery, setHeroQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [heroSuggestionsOpen, setHeroSuggestionsOpen] = useState(false);
  const [filterSuggestionsOpen, setFilterSuggestionsOpen] = useState(false);
  const [highlightedEpKey, setHighlightedEpKey] = useState(null);

  const heroSearchRef = useRef(null);
  const filterSearchRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target)) {
        setHeroSuggestionsOpen(false);
      }
      if (filterSearchRef.current && !filterSearchRef.current.contains(e.target)) {
        setFilterSuggestionsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Parse category query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat);
      setSelectedSubtopic('All');
      
      // Scroll to categories filter / episodes list header
      setTimeout(() => {
        const target = document.getElementById('gridSec');
        if (target) {
          const filterBar = document.getElementById('filterBar');
          const offset = filterBar ? filterBar.getBoundingClientRect().height : 120;
          const elementPosition = target.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - offset - 15;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.search]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState('All');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [selectedSpecialized, setSelectedSpecialized] = useState('All');
  const [selectedSpecializedId, setSelectedSpecializedId] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(24);
  const [placeholder, setPlaceholder] = useState('Search episodes, guests, topics…');

  // Server-side filtered results state
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [filterLoading, setFilterLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filterPage, setFilterPage] = useState(1);
  const PER_PAGE = 24;

  // DB-fetched taxonomy for pills (all subcategories / specialized fields, not just those in episodes)
  const [dbSubcategories, setDbSubcategories] = useState([]);
  const [dbSpecializedFields, setDbSpecializedFields] = useState([]);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const [specializedLoading, setSpecializedLoading] = useState(false);



  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  // Search input typing placeholders
  useEffect(() => {
    const phrases = [
      'Entrepreneurship…',
      'Mental health…',
      'Leadership…',
      'Burnout & recovery…',
      'Identity & reinvention…',
      'Building your brand…',
      'Soft girl era…'
    ];
    let pi = 0;
    let ci = 0;
    let del = false;
    let timer;

    const tick = () => {
      const cur = phrases[pi];
      if (del) {
        ci--;
        setPlaceholder(cur.substring(0, ci));
        if (ci === 0) {
          del = false;
          pi = (pi + 1) % phrases.length;
          timer = setTimeout(tick, 500);
        } else {
          timer = setTimeout(tick, 40);
        }
      } else {
        ci++;
        setPlaceholder(cur.substring(0, ci));
        if (ci === cur.length) {
          del = true;
          timer = setTimeout(tick, 1900);
        } else {
          timer = setTimeout(tick, ci === 1 ? 300 : 65);
        }
      }
    };

    timer = setTimeout(tick, 1200);
    return () => clearTimeout(timer);
  }, []);

  // When dbEpisodes first loads from context, seed filteredEpisodes
  // so the grid is not blank before the first server filter call returns
  useEffect(() => {
    if (dbEpisodes.length > 0 && filteredEpisodes.length === 0) {
      setFilteredEpisodes(dbEpisodes);
      setTotalCount(dbEpisodes.length);
      setFilterLoading(false);
    }
  }, [dbEpisodes]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubtopic('All');
    setSelectedSubtopicId(null);
    setSelectedSpecialized('All');
    setSelectedSpecializedId(null);
    setDbSubcategories([]);
    setDbSpecializedFields([]);
    setTimeout(() => {
      const el = document.getElementById('gridSec');
      if (el) {
        const filterBar = document.getElementById('filterBar');
        const offset = filterBar ? filterBar.getBoundingClientRect().height : 120;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset - 15;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Resolve subcategory name -> ID from fetched results
  const handleSubtopicSelect = (sub) => {
    setSelectedSubtopic(sub);
    setSelectedSpecialized('All');
    setSelectedSpecializedId(null);
    if (sub === 'All') {
      setSelectedSubtopicId(null);
    } else {
      // Find the ID from currently fetched episodes
      const match = filteredEpisodes.find(ep => ep.subcategory_name === sub);
      const subId = match ? (match.subcategory_id || null) : null;
      setSelectedSubtopicId(subId);
    }
  };

  // Resolve specialized field name -> ID from fetched results
  const handleSpecializedSelect = (field) => {
    setSelectedSpecialized(field);
    if (field === 'All') {
      setSelectedSpecializedId(null);
    } else {
      const match = filteredEpisodes.find(ep => ep.specialized_field_name === field);
      const specId = match ? (match.specialized_field_id || null) : null;
      setSelectedSpecializedId(specId);
    }
  };

  const handleHeroSearchChange = (e) => {
    const val = e.target.value;
    setHeroQuery(val);
    setFilterQuery('');
    setSearchQuery(val);
    setVisibleCount(9);
  };

  const handleFilterSearchChange = (e) => {
    const val = e.target.value;
    setFilterQuery(val);
    setHeroQuery('');
    setSearchQuery(val);
    setVisibleCount(9);
  };

  const handleClearSearch = () => {
    setHeroQuery('');
    setFilterQuery('');
    setSearchQuery('');
  };

  // ── Server-side filter effect ────────────────────────────────────────
  // Fires whenever any filter changes. Debounced for search input.
  const searchDebounceRef = useRef(null);

  const runServerFilter = async (opts = {}) => {
    const {
      catSlug    = selectedCategory,
      subId      = selectedSubtopicId,
      specId     = selectedSpecializedId,
      query      = searchQuery,
      page       = 1,
    } = opts;

    setFilterLoading(true);
    try {
      const result = await fetchFilteredEpisodes({
        category_slug:        catSlug !== 'all' ? catSlug : undefined,
        subcategory_id:       subId || undefined,
        specialized_field_id: specId || undefined,
        search:               query || undefined,
        page,
        per_page: PER_PAGE,
      });
      if (page === 1) {
        setFilteredEpisodes(result.rows);
      } else {
        setFilteredEpisodes(prev => [...prev, ...result.rows]);
      }
      setTotalCount(result.total);
      setFilterPage(page);
    } catch (e) {
      console.error('Filter fetch failed:', e);
    } finally {
      setFilterLoading(false);
    }
  };

  // Run on mount + whenever category/subcategory/specialized changes
  useEffect(() => {
    runServerFilter({
      catSlug: selectedCategory,
      subId:   selectedSubtopicId,
      specId:  selectedSpecializedId,
      query:   searchQuery,
      page:    1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedSubtopicId, selectedSpecializedId]);

  // Debounce search — wait 400ms after user stops typing
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      runServerFilter({
        catSlug: selectedCategory,
        subId:   selectedSubtopicId,
        specId:  selectedSpecializedId,
        query:   searchQuery,
        page:    1,
      });
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Load more (next page)
  const handleLoadMore = () => {
    runServerFilter({
      catSlug: selectedCategory,
      subId:   selectedSubtopicId,
      specId:  selectedSpecializedId,
      query:   searchQuery,
      page:    filterPage + 1,
    });
  };

  // Fetch ALL subcategories for selected category from DB (not derived from episodes)
  useEffect(() => {
    if (selectedCategory === 'all') {
      setDbSubcategories([]);
      setDbSpecializedFields([]);
      setSubcategoryLoading(false);
      return;
    }
    setSubcategoryLoading(true);
    setDbSubcategories([]); // clear immediately so old pills don't flash
    fetch(`${API_BASE}/api/subcategories?category_slug=${selectedCategory}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setDbSubcategories(Array.isArray(data) ? data : []);
        setSubcategoryLoading(false);
      })
      .catch(() => { setDbSubcategories([]); setSubcategoryLoading(false); });
  }, [selectedCategory]);

  // Fetch ALL specialized fields for selected subcategory from DB
  useEffect(() => {
    if (!selectedSubtopicId) {
      setDbSpecializedFields([]);
      setSpecializedLoading(false);
      return;
    }
    setSpecializedLoading(true);
    setDbSpecializedFields([]); // clear immediately
    fetch(`${API_BASE}/api/subcategories/${selectedSubtopicId}/specialized-fields`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setDbSpecializedFields(Array.isArray(data) ? data : []);
        setSpecializedLoading(false);
      })
      .catch(() => { setDbSpecializedFields([]); setSpecializedLoading(false); });
  }, [selectedSubtopicId]);

  // Level 2 pills: ONLY from DB — no fallback (prevents double-render flicker)
  const getSubtopics = () => {
    if (selectedCategory === 'all') return [];
    return dbSubcategories.map(s => s.name); // empty [] while loading — pills appear all at once
  };

  // Level 3 pills: ONLY from DB — no fallback
  const getSpecializedFields = () => {
    if (selectedSubtopic === 'All' || selectedCategory === 'all') return [];
    return dbSpecializedFields.map(f => f.name);
  };

  const activeSubtopics       = getSubtopics();
  const activeSpecializedFields = getSpecializedFields();



  // Sort server-fetched results client-side (server returns newest first by default)
  const getSortedEpisodes = () => {
    let list = [...filteredEpisodes];
    if (sortOrder === 'popular') {
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortOrder === 'az') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    // 'newest' = default server order (created_at desc)
    return list;
  };

  const filteredList   = getSortedEpisodes();
  const displayedList  = filteredList; // server already paginated
  const hasMore        = filteredList.length < totalCount;


  const latestEpisode = dbEpisodes.length > 0 ? dbEpisodes[0] : { title: 'Loading...', name: 'Guest', guest: 'Guest', epNum: '', n: '', thumb: '', ytId: '', yt: '', dur: '' };
  const featuredEpisode = dbEpisodes.length > 0 ? (dbEpisodes.find(ep => ep.is_featured) || dbEpisodes[0]) : { title: 'Loading...', name: 'Guest', guest: 'Guest', epNum: '', n: '', bio: '', highlights: '', role: '', tags: [], thumb: '', ytId: '', yt: '', dur: '' };

  const getInitials = (name) => {
    if (!name) return 'B';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Matchmaker Quiz logic
  const quizQuestions = [
    {
      q: "What's your biggest focus right now?",
      opts: [
        { i: '💼', t: 'Career or business', v: 'business' },
        { i: '❤️', t: 'Health & wellbeing', v: 'health' },
        { i: '✨', t: 'Personal growth', v: 'growth' },
        { i: '🎨', t: 'Creative expression', v: 'arts' }
      ]
    },
    {
      q: "Where are you in life right now?",
      opts: [
        { i: '🌱', t: 'Just starting out', v: 'starter' },
        { i: '🔄', t: 'Rebuilding myself', v: 'rebuild' },
        { i: '🚀', t: 'Growing fast', v: 'growing' },
        { i: '🧘', t: 'Seeking peace', v: 'peace' }
      ]
    },
    {
      q: "What type of conversation fires you up?",
      opts: [
        { i: '🔥', t: 'Raw, unfiltered talk', v: 'raw' },
        { i: '📚', t: 'Practical advice', v: 'practical' },
        { i: '💭', t: 'Deep mindset shifts', v: 'deep' },
        { i: '🌍', t: 'World-changing stories', v: 'impact' }
      ]
    }
  ];

  const startQuiz = () => {
    setQuizActive(true);
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const handleQuizSelect = (val) => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = val;
    setQuizAnswers(newAnswers);
  };

  const nextQuizStep = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      finishQuiz();
    }
  };

  const skipQuizStep = () => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = null;
    setQuizAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const a = quizAnswers;
    const fm = {
      business: ['maha', 'amy', 'jet'],
      health: ['sara', 'saliha', 'hasia'],
      growth: ['liz', 'mehreen', 'maha'],
      arts: ['mehreen', 'lamide', 'djbliss']
    };
    const sm = {
      starter: ['amy', 'lamide', 'mehreen'],
      rebuild: ['maha', 'sara', 'liz'],
      growing: ['jet', 'djbliss', 'saliha'],
      peace: ['liz', 'saliha', 'sara']
    };
    const tm = {
      raw: ['sara', 'liz', 'lamide'],
      practical: ['amy', 'jet', 'hasia'],
      deep: ['saliha', 'maha', 'liz'],
      impact: ['djbliss', 'maha', 'jet']
    };

    const allPicks = [
      ...(fm[a[0]] || []),
      ...(sm[a[1]] || []),
      ...(tm[a[2]] || [])
    ];

    const freq = {};
    allPicks.forEach(k => {
      freq[k] = (freq[k] || 0) + 1;
    });

    let picks = Object.entries(freq)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 3)
      .map(e => e[0]);

    if (!picks.length) {
      picks = ['maha', 'sara', 'saliha'];
    }

    const il = {
      business: '💼',
      health: '❤️',
      growth: '✨',
      arts: '🎨'
    };

    const ll = {
      business: 'Career & Business',
      health: 'Health & Mind',
      growth: 'Personal Growth',
      arts: 'Creative Expression'
    };

    const f = a[0] || 'growth';

    setQuizResult({
      icon: il[f] || '🎯',
      title: `Perfect for ${ll[f] || 'You'}`,
      desc: "Based on your answers, these episodes are made for exactly where you are right now.",
      picks: picks.map(k => {
        if (dbEpisodes.length > 0) {
          return dbEpisodes.find(ep => ep.id === k || ep.category_slug === k || ep.n === k || (ep.guest && ep.guest.toLowerCase().includes(k.toLowerCase())) || ep.title.toLowerCase().includes(k.toLowerCase()));
        }
        return EPS[k];
      }).filter(Boolean)
    });
  };

  const restartQuiz = () => {
    setQuizActive(false);
    setQuizResult(null);
  };

  const ALL_CATEGORIES = [
    { slug: 'business', label: 'Business', icon: '💼' },
    { slug: 'health', label: 'Health & Wellness', icon: '❤️' },
    { slug: 'arts', label: 'Arts & Media', icon: '🎨' },
    { slug: 'tech', label: 'Tech & STEM', icon: '⚡' },
    { slug: 'leadership', label: 'Leadership', icon: '🌟' },
    { slug: 'finance', label: 'Finance & Wealth', icon: '💰' },
    { slug: 'law', label: 'Law', icon: '⚖️' },
    { slug: 'social', label: 'Social', icon: '🌍' },
  ];

  const getSearchSuggestions = (queryStr) => {
    const q = queryStr.toLowerCase().trim();
    if (q.length < 2) return { categories: [], episodes: [] };
    
    // Match categories
    const matchedCats = ALL_CATEGORIES.filter(c =>
      c.label.toLowerCase().includes(q) || c.slug.includes(q)
    );

    // Match episodes
    const list = dbEpisodes.length > 0 ? dbEpisodes : Object.values(EPS);
    const matchedEps = list
      .map(ep => ({
        ...ep,
        _score: getEpisodeRelevanceScore(ep, queryStr)
      }))
      .filter(ep => ep._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 5);

    return { categories: matchedCats.slice(0, 3), episodes: matchedEps };
  };

  const heroSuggestions = getSearchSuggestions(heroQuery);
  const filterSuggestions = getSearchSuggestions(filterQuery);

  const handleSuggestionEpClick = (ep, closeFns) => {
    // Close dropdowns
    closeFns.forEach(fn => fn());
    // DB episodes use ep.id; static EPS use ep.key
    const key = ep.key || ep.id || ep._id;

    // 1. Show all episodes so the card is definitely in DOM
    setSelectedCategory('all');
    setVisibleCount(999);

    // 2. Wait for React to re-render the full grid
    setTimeout(() => {
      const cardEl = document.getElementById(`ep-card-${key}`);
      if (cardEl) {
        // Scroll to card
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 3. Apply glow directly via inline DOM styles (bypasses CSS specificity)
        cardEl.style.transition = 'none';
        cardEl.style.border = '3px solid #EC4899';
        cardEl.style.boxShadow = '0 0 12px 4px #EC4899, 0 0 40px 14px #9333EA';
        cardEl.style.animation = 'ep-glow-pulse 1s ease-in-out 0s 6';
        cardEl.style.zIndex = '2';

        // 4. Clear glow after animation (6 seconds)
        setTimeout(() => {
          cardEl.style.border = '';
          cardEl.style.boxShadow = '';
          cardEl.style.animation = '';
          cardEl.style.transition = '';
          cardEl.style.zIndex = '';
        }, 6000);
      } else {
        // fallback: try the episode's category
        const catSlug = ep.cat || ep.category_slug || 'all';
        setSelectedCategory(catSlug);
        setTimeout(() => {
          const el2 = document.getElementById(`ep-card-${key}`);
          if (el2) {
            el2.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el2.style.transition = 'none';
            el2.style.border = '3px solid #EC4899';
            el2.style.boxShadow = '0 0 12px 4px #EC4899, 0 0 40px 14px #9333EA';
            el2.style.animation = 'ep-glow-pulse 1s ease-in-out 0s 6';
            el2.style.zIndex = '2';
            setTimeout(() => {
              el2.style.border = '';
              el2.style.boxShadow = '';
              el2.style.animation = '';
              el2.style.transition = '';
              el2.style.zIndex = '';
            }, 6000);
          }
        }, 80);
      }
    }, 80);
  };
  const hexToHsl = (hex) => {
    if (!hex) return { h: 270, s: 70, l: 50 };
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return { h: 270, s: 70, l: 50 };
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const activeCat = dbCategories.find(c => c.slug === selectedCategory);
  const gridTitle = activeCat ? activeCat.name : (CAT_LABELS[selectedCategory] || 'All Episodes');
  
  let customSecStyle = {};
  let isDarkTheme = false;
  let customTitleStyle = {};
  let customLinkStyle = {};

  if (activeCat) {
    const hsl = hexToHsl(activeCat.color || '#9333EA');
    customSecStyle = {
      background: `linear-gradient(160deg, hsl(${hsl.h}, ${hsl.s}%, 5%) 0%, hsl(${hsl.h}, ${hsl.s}%, 12%) 70%, hsl(${hsl.h}, ${hsl.s}%, 5%) 100%)`,
      transition: 'background 0.7s ease'
    };
    customTitleStyle = { color: '#fff' };
    customLinkStyle = { color: `hsl(${hsl.h}, ${hsl.s}%, 75%)` };
    isDarkTheme = true;
  } else {
    const staticDarkThemes = ['arts', 'business', 'health', 'tech', 'leadership', 'finance', 'law', 'social'];
    if (staticDarkThemes.includes(selectedCategory)) {
      isDarkTheme = true;
    }
  }

  return (
    <div className="episodes-page-container">
      <style>{`
        .search-results-drop {
          transition: opacity 0.2s, transform 0.2s;
        }
        .search-drop-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .search-cat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 30px;
          background: rgba(147, 51, 234, 0.18);
          border: 1px solid rgba(147, 51, 234, 0.35);
          color: #D8B4FE;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Syne', sans-serif;
        }
        .search-cat-chip:hover {
          background: rgba(147, 51, 234, 0.35);
          border-color: rgba(147, 51, 234, 0.6);
          color: #fff;
        }
        .search-drop-section-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 10px 16px 4px;
          font-family: 'Syne', sans-serif;
        }
        @keyframes ep-glow-pulse {
          0%   { box-shadow: 0 0 8px 2px #EC4899, 0 0 24px 8px #9333EA; }
          50%  { box-shadow: 0 0 26px 10px #EC4899, 0 0 60px 22px #9333EA; }
          100% { box-shadow: 0 0 8px 2px #EC4899, 0 0 24px 8px #9333EA; }
        }
        .skeleton-box {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
          background-size: 400% 100% !important;
          animation: skeleton-loading 1.4s ease infinite !important;
        }
        @keyframes skeleton-loading {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-item"><span className="t-dot">✦</span> NEW: Maha Abouelenein on Identity &amp; Reinvention</span>
          <span className="ticker-item"><span className="t-dot">✦</span> Mentorship Spots Limited — Apply Now</span>
          <span className="ticker-item"><span className="t-dot">✦</span> Dr Sara Al Madani — Letting Go of Toxic Love</span>
          <span className="ticker-item"><span className="t-dot">✦</span> Dr Saliha Afridi on Burnout &amp; Mental Health</span>
          <span className="ticker-item"><span className="t-dot">✦</span> 100M+ Views · 500K+ Community</span>
          {/* Duplicate for infinite loop */}
          <span className="ticker-item"><span className="t-dot">✦</span> NEW: Maha Abouelenein on Identity &amp; Reinvention</span>
          <span className="ticker-item"><span className="t-dot">✦</span> Mentorship Spots Limited — Apply Now</span>
          <span className="ticker-item"><span className="t-dot">✦</span> Dr Sara Al Madani — Letting Go of Toxic Love</span>
          <span className="ticker-item"><span className="t-dot">✦</span> Dr Saliha Afridi on Burnout &amp; Mental Health</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <div className="hero-dot"></div>
              <span>Bold &amp; Brilliant Girls Podcast</span>
            </div>
            <h1 className="hero-h1">
              Stories That<br />
              <em>Shape You.</em>
            </h1>
            <p className="hero-p">Conversations with women rewriting the rules. New episodes every week — watch, listen, and take notes.</p>
            
            <div className="hero-search" ref={heroSearchRef} style={{ position: 'relative' }}>
              <div className="hero-search-wrap">
                <span className="hero-search-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input 
                  type="text" 
                  autoComplete="off" 
                  placeholder={placeholder} 
                  value={heroQuery}
                  onChange={(e) => {
                    handleHeroSearchChange(e);
                    setHeroSuggestionsOpen(true);
                  }}
                  onFocus={() => setHeroSuggestionsOpen(true)}
                />
                <button className="hero-search-btn">
                  <span className="hero-search-btn__text">Search</span>
                  <svg className="hero-search-btn__icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
              </div>

              {/* Suggestions overlay */}
              {heroSuggestionsOpen && heroQuery.trim().length >= 2 && (
                <div className="search-results-drop open" style={{
                  position: 'absolute',
                  top: '60px',
                  left: 0,
                  right: 0,
                  background: '#1A0D35',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  zIndex: 8000,
                  display: 'block',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                  textAlign: 'left'
                }}>
                  {/* Category chips */}
                  {heroSuggestions.categories.length > 0 && (
                    <>
                      <div className="search-drop-section-label">📂 Categories</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '4px 16px 12px' }}>
                        {heroSuggestions.categories.map(cat => (
                          <span key={cat.slug} className="search-cat-chip" onClick={() => {
                            setHeroSuggestionsOpen(false);
                            setHeroQuery('');
                            setSearchQuery('');
                            handleCategorySelect(cat.slug);
                          }}>
                            {cat.icon} {cat.label}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Episode results */}
                  {heroSuggestions.episodes.length > 0 && (
                    <>
                      {heroSuggestions.categories.length > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 0 0' }} />}
                      <div className="search-drop-section-label">🎙 Episodes</div>
                      {heroSuggestions.episodes.map((ep, idx) => {
                        const guestName = ep.name || ep.guest || 'Guest';
                        const categoryLabel = ep.catL || ep.category_name || 'Podcast';
                        return (
                          <div key={ep._id || ep.key || idx} className="search-drop-item" onClick={() => {
                            setHeroSuggestionsOpen(false);
                            setHeroQuery('');
                            setSearchQuery('');
                            handleSuggestionEpClick(ep, [() => setHeroSuggestionsOpen(false)]);
                          }} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              background: ep.grad || 'linear-gradient(135deg, #A259FF, #FF1F7D)',
                              color: '#fff', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0
                            }}>
                              {getInitials(guestName)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ep.title}
                              </div>
                              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
                                {guestName} · <span style={{ color: 'rgba(168,139,250,0.8)' }}>{categoryLabel}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>↗</div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {heroSuggestions.categories.length === 0 && heroSuggestions.episodes.length === 0 && (
                    <div style={{ padding: '20px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
                      No results for "{heroQuery}"
                    </div>
                  )}
                </div>
              )}

              <div className="hero-hints">
                <span className="hint-pill" onClick={() => { setHeroQuery('Entrepreneurship'); setSearchQuery('Entrepreneurship'); setHeroSuggestionsOpen(true); }}>💼 Business</span>
                <span className="hint-pill" onClick={() => { setHeroQuery('Mental Health'); setSearchQuery('Mental Health'); setHeroSuggestionsOpen(true); }}>🧠 Mental Health</span>
                <span className="hint-pill" onClick={() => { setHeroQuery('Leadership'); setSearchQuery('Leadership'); setHeroSuggestionsOpen(true); }}>🌟 Leadership</span>
                <span className="hint-pill" onClick={() => { setHeroQuery('Burnout'); setSearchQuery('Burnout'); setHeroSuggestionsOpen(true); }}>🔥 Burnout</span>
                <span className="hint-pill" onClick={() => { setHeroQuery('Identity'); setSearchQuery('Identity'); setHeroSuggestionsOpen(true); }}>✨ Identity</span>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat-item" style={{ cursor: 'pointer' }}>
                <div className="stat-num">52</div>
                <div className="stat-label">Episodes</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">30</div>
                <div className="stat-label">Mentors</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">100<sup>M+</sup></div>
                <div className="stat-label">Views</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">500<sup>K+</sup></div>
                <div className="stat-label">Community</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-cat-card" onClick={() => handleCategorySelect('health')} style={{ '--card-col': '#EC4899' }}>
              <div className="hero-cat-icon" style={{ background: 'linear-gradient(135deg,rgba(131,24,67,.5),rgba(219,39,119,.4))' }}>❤️</div>
              <div className="hero-cat-info">
                <div className="hero-cat-name">Health &amp; Wellness</div>
                <div className="hero-cat-count">Mental health · Fitness · Beauty</div>
              </div>
              <div className="hero-cat-arrow">→</div>
            </div>
            <div className="hero-cat-card" onClick={() => handleCategorySelect('business')}>
              <div className="hero-cat-icon" style={{ background: 'linear-gradient(135deg,rgba(146,64,14,.5),rgba(217,119,6,.4))' }}>💼</div>
              <div className="hero-cat-info">
                <div className="hero-cat-name">Business &amp; Branding</div>
                <div className="hero-cat-count">Entrepreneurship · Strategy</div>
              </div>
              <div className="hero-cat-arrow">→</div>
            </div>
            <div className="hero-cat-card" onClick={() => handleCategorySelect('arts')}>
              <div className="hero-cat-icon" style={{ background: 'linear-gradient(135deg,rgba(76,29,149,.5),rgba(124,58,237,.4))' }}>🎨</div>
              <div className="hero-cat-info">
                <div className="hero-cat-name">Arts &amp; Media</div>
                <div className="hero-cat-count">Film · Music · Social Media</div>
              </div>
              <div className="hero-cat-arrow">→</div>
            </div>
            <div className="hero-cat-card" onClick={() => handleCategorySelect('tech')}>
              <div className="hero-cat-icon" style={{ background: 'linear-gradient(135deg,rgba(14,116,144,.5),rgba(6,182,212,.4))' }}>⚡</div>
              <div className="hero-cat-info">
                <div className="hero-cat-name">Tech &amp; STEM</div>
                <div className="hero-cat-count">AI · Engineering · Product</div>
              </div>
              <div className="hero-cat-arrow">→</div>
            </div>
            <div className="hero-cat-card" onClick={() => handleCategorySelect('leadership')}>
              <div className="hero-cat-icon" style={{ background: 'linear-gradient(135deg,rgba(107,33,168,.5),rgba(147,51,234,.4))' }}>🌟</div>
              <div className="hero-cat-info">
                <div className="hero-cat-name">Leadership</div>
                <div className="hero-cat-count">Founders · Executives · Activism</div>
              </div>
              <div className="hero-cat-arrow">→</div>
            </div>
            <div className="hero-cat-card" onClick={() => handleCategorySelect('finance')}>
              <div className="hero-cat-icon" style={{ background: 'linear-gradient(135deg,rgba(6,95,70,.5),rgba(5,150,105,.4))' }}>💰</div>
              <div className="hero-cat-info">
                <div className="hero-cat-name">Finance &amp; Wealth</div>
                <div className="hero-cat-count">Investing · Money · Freedom</div>
              </div>
              <div className="hero-cat-arrow">→</div>
            </div>
          </div>
        </div>

        {/* Latest episode strip */}
        <div className="hero-latest">
          <div className="hero-latest-badge">▶ Latest Episode</div>
          <div className="hero-latest-title">{latestEpisode.title}</div>
          <div className="hero-latest-guest">{(latestEpisode.name || latestEpisode.guest)} · EP.{latestEpisode.epNum || latestEpisode.n}</div>
          <div className="hero-latest-play" onClick={() => onOpenGuestModal(latestEpisode)}>
            <div className="hero-latest-play-tri"></div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="filter-bar" id="filterBar">
        <div className="filter-inner">
          <div className="search-row">
            <div className="search-outer" ref={filterSearchRef} style={{ position: 'relative' }}>
              <div className="search-wrap">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--gm)', flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search guest, topic, keyword…" 
                  value={filterQuery}
                  onChange={(e) => {
                    handleFilterSearchChange(e);
                    setFilterSuggestionsOpen(true);
                  }}
                  onFocus={() => setFilterSuggestionsOpen(true)}
                />
                {filterQuery && (
                  <button onClick={handleClearSearch} style={{ background: 'none', border: 'none', color: 'var(--gm)', cursor: 'pointer', fontSize: '.8rem', padding: 0 }}>✕</button>
                )}
              </div>

              {/* Suggestions overlay */}
              {filterSuggestionsOpen && filterQuery.trim().length >= 2 && (
                <div className="search-results-drop open" style={{
                  position: 'absolute',
                  top: '50px',
                  left: 0,
                  right: 0,
                  background: '#1A0D35',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  maxHeight: '360px',
                  overflowY: 'auto',
                  zIndex: 8000,
                  display: 'block',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                  textAlign: 'left'
                }}>
                  {/* Category chips */}
                  {filterSuggestions.categories.length > 0 && (
                    <>
                      <div className="search-drop-section-label">📂 Categories</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '4px 16px 12px' }}>
                        {filterSuggestions.categories.map(cat => (
                          <span key={cat.slug} className="search-cat-chip" onClick={() => {
                            setFilterSuggestionsOpen(false);
                            setFilterQuery('');
                            setSearchQuery('');
                            handleCategorySelect(cat.slug);
                          }}>
                            {cat.icon} {cat.label}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Episode results */}
                  {filterSuggestions.episodes.length > 0 && (
                    <>
                      {filterSuggestions.categories.length > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />}
                      <div className="search-drop-section-label">🎙 Episodes</div>
                      {filterSuggestions.episodes.map((ep, idx) => {
                        const guestName = ep.name || ep.guest || 'Guest';
                        const categoryLabel = ep.catL || ep.category_name || 'Podcast';
                        return (
                          <div key={ep._id || ep.key || idx} className="search-drop-item" onClick={() => {
                            setFilterSuggestionsOpen(false);
                            setFilterQuery('');
                            setSearchQuery('');
                            handleSuggestionEpClick(ep, [() => setFilterSuggestionsOpen(false)]);
                          }} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              background: ep.grad || 'linear-gradient(135deg, #A259FF, #FF1F7D)',
                              color: '#fff', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0
                            }}>
                              {getInitials(guestName)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ep.title}
                              </div>
                              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
                                {guestName} · <span style={{ color: 'rgba(168,139,250,0.8)' }}>{categoryLabel}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>↗</div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {filterSuggestions.categories.length === 0 && filterSuggestions.episodes.length === 0 && (
                    <div style={{ padding: '20px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
                      No results for "{filterQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="sort-btn-wrapper">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="sort-icon-svg" style={{ color: 'var(--gt)', pointerEvents: 'none' }}>
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              <select className="sort-sel" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="az">A – Z</option>
              </select>
            </div>
          </div>

          <div className="pill-wrap">
            <div className="pill-row" id="pillRow">
              <button className={`pill ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategorySelect('all')}>All Episodes</button>
              {dbCategories.length > 0 ? (
                dbCategories.map(cat => (
                  <button 
                    key={cat._id}
                    className={`pill ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))
              ) : (
                <>
                  <button className={`pill ${selectedCategory === 'tech' ? 'active' : ''}`} onClick={() => handleCategorySelect('tech')}>⚡ Tech &amp; STEM</button>
                  <button className={`pill ${selectedCategory === 'business' ? 'active' : ''}`} onClick={() => handleCategorySelect('business')}>💼 Business</button>
                  <button className={`pill ${selectedCategory === 'health' ? 'active' : ''}`} onClick={() => handleCategorySelect('health')}>❤️ Health</button>
                  <button className={`pill ${selectedCategory === 'arts' ? 'active' : ''}`} onClick={() => handleCategorySelect('arts')}>🎨 Arts &amp; Media</button>
                  <button className={`pill ${selectedCategory === 'leadership' ? 'active' : ''}`} onClick={() => handleCategorySelect('leadership')}>🌟 Leadership</button>
                  <button className={`pill ${selectedCategory === 'finance' ? 'active' : ''}`} onClick={() => handleCategorySelect('finance')}>💰 Finance</button>
                  <button className={`pill ${selectedCategory === 'law' ? 'active' : ''}`} onClick={() => handleCategorySelect('law')}>⚖️ Law</button>
                  <button className={`pill ${selectedCategory === 'social' ? 'active' : ''}`} onClick={() => handleCategorySelect('social')}>🌍 Social</button>
                </>
              )}
            </div>
            
            {/* Level 2 — Subtopic pills */}
            <div className={`sub-pill-row ${selectedCategory !== 'all' ? 'visible' : ''}`}>
              {selectedCategory !== 'all' && (
                <>
                  <span className="sub-pill-label">Topics</span>
                  {subcategoryLoading ? (
                    // Skeleton shimmer while DB fetch is in progress
                    Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="sub-pill skeleton-pill" style={{
                        display: 'inline-block', width: `${60 + i * 15}px`, height: '28px',
                        borderRadius: '20px', background: 'rgba(147,51,234,0.1)',
                        animation: 'skeleton-pulse 1.2s ease-in-out infinite',
                        verticalAlign: 'middle'
                      }} />
                    ))
                  ) : (
                    <>
                      <button
                        className={`sub-pill ${selectedSubtopic === 'All' ? 'active' : ''}`}
                        onClick={() => handleSubtopicSelect('All')}
                      >All</button>
                      {activeSubtopics.map((sub, i) => (
                        <button
                          key={i}
                          className={`sub-pill ${selectedSubtopic === sub ? 'active' : ''}`}
                          onClick={() => handleSubtopicSelect(sub)}
                        >
                          {sub}
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Level 3 — Specialized Field pills */}
            <div className={`sub-pill-row specialized-pill-row ${(specializedLoading || activeSpecializedFields.length > 0) && selectedSubtopic !== 'All' ? 'visible' : ''}`}>
              {selectedSubtopic !== 'All' && (
                <>
                  {specializedLoading ? (
                    <>
                      <span className="sub-pill-label specialized-label">Specialized</span>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className="sub-pill skeleton-pill" style={{
                          display: 'inline-block', width: `${70 + i * 12}px`, height: '28px',
                          borderRadius: '20px', background: 'rgba(236,72,153,0.1)',
                          animation: 'skeleton-pulse 1.2s ease-in-out infinite',
                          verticalAlign: 'middle'
                        }} />
                      ))}
                    </>
                  ) : activeSpecializedFields.length > 0 ? (
                    <>
                      <span className="sub-pill-label specialized-label">Specialized</span>
                      <button
                        className={`sub-pill specialized-pill ${selectedSpecialized === 'All' ? 'active' : ''}`}
                        onClick={() => handleSpecializedSelect('All')}
                      >All</button>
                      {activeSpecializedFields.map((field, i) => (
                        <button
                          key={i}
                          className={`sub-pill specialized-pill ${selectedSpecialized === field ? 'active' : ''}`}
                          onClick={() => handleSpecializedSelect(field)}
                        >
                          {field}
                        </button>
                      ))}
                    </>
                  ) : null}
                </>
              )}
            </div>

          </div>
          <div className="results-count">
            {filterLoading
              ? 'Loading…'
              : `Showing ${filteredList.length} of ${totalCount} episode${totalCount !== 1 ? 's' : ''}`
            }
          </div>
        </div>
      </div>

      {/* ── FEATURED WEEKLY EPISODE ── */}
      <section className="featured">
        <div className="featured-inner">
          <div className="sec-label">⭐ Featured This Week</div>
          {loading ? (
            <div className="featured-grid fade-up visible" style={{ opacity: 0.6, pointerEvents: 'none' }}>
              <div className="vid-frame skeleton-box" style={{ minHeight: '340px', borderRadius: '16px' }}></div>
              <div className="feat-details">
                <div className="skeleton-box" style={{ height: '14px', width: '30%', marginBottom: '16px', borderRadius: '4px' }}></div>
                <div className="skeleton-box" style={{ height: '32px', width: '80%', marginBottom: '20px', borderRadius: '4px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
                  <div className="skeleton-box" style={{ width: '42px', height: '42px', borderRadius: '50%' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-box" style={{ height: '16px', width: '50%', marginBottom: '6px', borderRadius: '4px' }}></div>
                    <div className="skeleton-box" style={{ height: '12px', width: '30%', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div className="skeleton-box" style={{ height: '60px', width: '100%', marginBottom: '20px', borderRadius: '4px' }}></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="skeleton-box" style={{ height: '40px', width: '150px', borderRadius: '12px' }}></div>
                  <div className="skeleton-box" style={{ height: '40px', width: '150px', borderRadius: '12px' }}></div>
                </div>
              </div>
            </div>
          ) : dbEpisodes.length > 0 ? (
            <div className="featured-grid fade-up visible">
              <div className="vid-frame" onClick={() => onOpenGuestModal(featuredEpisode)}>
                <img className="vid-thumb" src={featuredEpisode.thumb || `https://i.ytimg.com/vi/${featuredEpisode.yt || featuredEpisode.ytId}/hqdefault.jpg`} alt={featuredEpisode.guest || featuredEpisode.name} />
                <div className="vid-overlay"></div>
                <div className="play-btn">
                  <div className="play-tri"></div>
                </div>
                <div className="ep-tag">▶ EP.{featuredEpisode.epNum || featuredEpisode.n} · {featuredEpisode.dur}</div>
                {featuredEpisode.isNew && <div className="new-badge">NEW</div>}
              </div>
              <div className="feat-details">
                <div className="feat-ep-num">EP. {featuredEpisode.epNum || featuredEpisode.n} · {featuredEpisode.category_name || featuredEpisode.cat}</div>
                <h2 className="feat-title">{featuredEpisode.title}</h2>
                <div className="guest-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
                  <div className="g-avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', background: featuredEpisode.grad || 'linear-gradient(135deg,#6B21A8,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '.9rem' }}>{featuredEpisode.av || getInitials(featuredEpisode.name || featuredEpisode.guest)}</div>
                  <div>
                    <div className="g-name" style={{ fontWeight: 700, fontSize: '.95rem' }}>{featuredEpisode.name || featuredEpisode.guest}</div>
                    <div className="g-role" style={{ fontSize: '.76rem', color: 'var(--grey-text)' }}>{featuredEpisode.role}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  {featuredEpisode.tags && featuredEpisode.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="ind-pill" style={{ display: 'inline-block', background: 'rgba(147,51,234,.08)', color: 'var(--purple-deep)', padding: '4px 10px', borderRadius: '20px', fontSize: '.7rem', fontWeight: 600, marginRight: '6px', textTransform: 'capitalize' }}>{tag}</span>
                  ))}
                </div>
                <p className="feat-desc" style={{ fontSize: '.88rem', color: 'var(--grey-text)', lineHeight: 1.6, marginBottom: '20px' }}>{featuredEpisode.highlights || featuredEpisode.bio}</p>
                <div className="feat-actions" style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-p" onClick={() => onOpenGuestModal(featuredEpisode)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bk)', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '.78rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', cursor: 'pointer' }}>
                    <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                    Watch &amp; Listen
                  </button>
                  <button className="btn-audio" onClick={() => onOpenAudioPlayer(featuredEpisode)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1.5px solid rgba(0,0,0,.15)', background: '#fff', color: 'var(--bk)', padding: '12px 24px', borderRadius: '12px', fontSize: '.78rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', cursor: 'pointer' }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                    </svg>
                    Audio Only
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              No episodes available right now.
            </div>
          )}
        </div>
      </section>

      {/* ── EPISODES GRID ── */}
      <section className="grid-sec" id="gridSec" data-theme={selectedCategory} style={customSecStyle}>
        <div className="grid-inner">
          <div className="grid-header">
            <h2 className="grid-title" style={customTitleStyle}>{gridTitle}</h2>
            {displayedList.length > 0 && (
              <a href="https://www.youtube.com/@BoldandBrilliantgirl" target="_blank" rel="noopener noreferrer" className="grid-yt-link" style={customLinkStyle}>Watch on YouTube →</a>
            )}
          </div>

          <div className="ep-grid" style={filterLoading && filteredEpisodes.length > 0 ? { opacity: 0.5, pointerEvents: 'none', transition: 'opacity .2s' } : { opacity: 1, transition: 'opacity .3s' }}>
            {(loading || (filterLoading && filteredEpisodes.length === 0)) ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="ep-card" style={{ opacity: 0.6, pointerEvents: 'none' }}>
                  <div className="card-thumb skeleton-box" style={{ height: '200px', width: '100%', borderRadius: '12px' }}></div>
                  <div className="card-body" style={{ padding: '20px' }}>
                    <div className="skeleton-box" style={{ height: '14px', width: '40%', marginBottom: '12px', borderRadius: '4px' }}></div>
                    <div className="skeleton-box" style={{ height: '20px', width: '80%', marginBottom: '16px', borderRadius: '4px' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="skeleton-box" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
                      <div style={{ flex: 1 }}>
                        <div className="skeleton-box" style={{ height: '12px', width: '60%', marginBottom: '6px', borderRadius: '4px' }}></div>
                        <div className="skeleton-box" style={{ height: '10px', width: '40%', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : displayedList.length > 0 ? (
              displayedList.map((ep) => {
                const epKey = ep.key || ep.id || ep._id;
                const isHighlighted = false; // highlight done via direct DOM style
                return (
                <div
                  key={epKey}
                  id={`ep-card-${epKey}`}
                  className="ep-card fade-up visible"
                >
                  <div className="card-thumb" onClick={() => onOpenGuestModal(ep)}>
                    <img src={ep.thumb || `https://i.ytimg.com/vi/${ep.ytId}/hqdefault.jpg`} alt={ep.name} />
                    <div className="thumb-ov"></div>
                    <div className="thumb-play">
                      <div className="thumb-play-tri"></div>
                    </div>
                    <div className="card-cat">{ep.catL}</div>
                    {ep.isNew && <div className="card-new">NEW</div>}
                    {isHighlighted && (
                      <div style={{
                        position: 'absolute', inset: 0, borderRadius: 'inherit',
                        background: 'linear-gradient(135deg, rgba(147,51,234,0.18), rgba(236,72,153,0.12))',
                        pointerEvents: 'none', zIndex: 3
                      }} />
                    )}
                  </div>
                  <span className="card-accent" style={{ background: ep.grad }}></span>
                  <div className="card-body">
                    <div className="card-ep-meta">
                      <span>EP. {ep.epNum}</span>
                      <span>·</span>
                      <span>{ep.dur}</span>
                    </div>
                    <div className="card-title">{ep.title}</div>
                    <div className="card-guest">
                      <div className="card-av" style={{ background: ep.grad }}>{ep.av || getInitials(ep.name || ep.guest)}</div>
                      <div>
                        <div className="card-g-name">{ep.name}</div>
                        <div className="card-g-role">{ep.role && ep.role.split('·')[0]}</div>
                      </div>
                    </div>
                    {ep.prog > 0 && (
                      <div className="card-prog-track">
                        <div className="card-prog-fill" style={{ width: `${ep.prog}%` }}></div>
                      </div>
                    )}
                    <div className="card-actions">
                      <button className="cbtn cbtn-play" onClick={() => onOpenGuestModal(ep)}>▶ Play</button>
                      <button className="cbtn cbtn-ins" onClick={() => onOpenGuestModal(ep)}>✦ Insights</button>
                      <button className="cbtn cbtn-aud" onClick={() => onOpenAudioPlayer(ep)}>🎧</button>
                    </div>
                  </div>
                </div>
                );
              })
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                padding: '60px 20px', 
                textAlign: 'center', 
                color: isDarkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', 
                background: isDarkTheme ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', 
                borderRadius: '16px', 
                border: isDarkTheme ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)' 
              }}>
                <h3 style={{ color: isDarkTheme ? '#fff' : 'var(--bk)', marginBottom: '8px' }}>No episodes found</h3>
                <p style={{ margin: 0 }}>Try resetting filters or searching another keyword.</p>
              </div>
            )}

            {/* Coming Soon cards */}
            {!loading && selectedCategory === 'all' && (
              <>
                <div className="ep-card coming-soon-card">
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚖️</div>
                  <div className="cs-badge">✦ Coming Soon</div>
                  <div className="cs-title">Breaking Barriers in Law</div>
                  <div className="cs-text">New episodes with trailblazing women in law dropping soon.</div>
                  <button className="cs-notify" onClick={() => onShowToast('🔔', 'Notification set!', 'You will be notified for law episodes.')}>🔔 Notify Me</button>
                </div>
                <div className="ep-card coming-soon-card">
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💰</div>
                  <div className="cs-badge">✦ Coming Soon</div>
                  <div className="cs-title">Finance &amp; Wealth Building</div>
                  <div className="cs-text">Conversations about money, investing, and financial freedom.</div>
                  <button className="cs-notify" onClick={() => onShowToast('🔔', 'Notification set!', 'You will be notified for finance episodes.')}>🔔 Notify Me</button>
                </div>
                <div className="ep-card coming-soon-card">
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌟</div>
                  <div className="cs-badge">✦ Coming Soon</div>
                  <div className="cs-title">Women in Leadership</div>
                  <div className="cs-text">In-depth conversations with CEOs and change-makers.</div>
                  <button className="cs-notify" onClick={() => onShowToast('🔔', 'Notification set!', 'You will be notified for leadership episodes.')}>🔔 Notify Me</button>
                </div>
              </>
            )}
          </div>

          {hasMore && !filterLoading && (
            <div className="load-more-wrap">
              <button className="btn-lm" onClick={handleLoadMore}>↓ Load More Episodes</button>
            </div>
          )}
          {filterLoading && filteredList.length > 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', opacity: 0.5, fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem' }}>
              Loading more…
            </div>
          )}
        </div>
      </section>

      {/* ── QUIZ MATCHMAKER ── */}
      <section className="quiz-sec" id="quizSec">
        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {!quizActive && !quizResult && (
            <div id="qzIntro" style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(234,179,8,.35)', background: 'rgba(234,179,8,.08)', color: '#FEF08A', fontFamily: 'Syne, sans-serif', fontSize: '.65rem', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', padding: '7px 16px', borderRadius: '30px', marginBottom: '28px' }}>✦ Episode Matchmaker</div>
              <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '12px' }}>
                Lost in the Archive?<br />
                <span style={{ background: 'linear-gradient(135deg,#9333EA,#EC4899,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Find Your Episode.</span>
              </h2>
              <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.45)', margin: '16px auto 0', maxWidth: '380px', lineHeight: 1.75, fontFamily: 'DM Sans, sans-serif' }}>3 questions. Your perfect episode, matched in seconds.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', margin: '28px 0' }}>
                <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50px', padding: '9px 18px', color: 'rgba(255,255,255,.6)', fontFamily: 'Syne, sans-serif', fontSize: '.7rem', fontWeight: 600, letterSpacing: '.04em' }}>⚡ UNDER 30 SECONDS</div>
                <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50px', padding: '9px 18px', color: 'rgba(255,255,255,.6)', fontFamily: 'Syne, sans-serif', fontSize: '.7rem', fontWeight: 600, letterSpacing: '.04em' }}>🎯 PERSONALISED PICK</div>
              </div>
              <button className="btn btn--primary" onClick={startQuiz} style={{ padding: '18px 48px', borderRadius: '60px', textTransform: 'uppercase', margin: '0 auto', display: 'inline-block' }}>Find My Episode →</button>
            </div>
          )}

          {quizActive && !quizResult && (
            <div id="qzActive">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '36px' }} id="qzDots">
                {[0, 1, 2].map((stepIdx) => (
                  <div 
                    key={stepIdx}
                    style={{
                      height: '8px',
                      width: quizStep === stepIdx ? '36px' : '8px',
                      borderRadius: quizStep === stepIdx ? '4px' : '50%',
                      background: quizStep === stepIdx ? 'linear-gradient(90deg,#9333EA,#EC4899)' : 'rgba(255,255,255,.2)',
                      transition: 'all .4s'
                    }}
                  ></div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ padding: '36px 40px 24px' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '.65rem', fontWeight: 800, color: 'rgba(255,255,255,.3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Question {quizStep + 1} of 3</div>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(1.2rem,2.2vw,1.65rem)', fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: '28px' }}>{quizQuestions[quizStep].q}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {quizQuestions[quizStep].opts.map((opt, i) => {
                      const isSelected = quizAnswers[quizStep] === opt.v;
                      return (
                        <button 
                          key={i}
                          onClick={() => handleQuizSelect(opt.v)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            background: isSelected ? 'linear-gradient(135deg,rgba(124,58,237,.32),rgba(236,72,153,.22))' : 'rgba(255,255,255,.05)',
                            border: isSelected ? '1.5px solid #EC4899' : '1.5px solid rgba(255,255,255,.1)',
                            color: isSelected ? '#fff' : 'rgba(255,255,255,.72)',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '.87rem',
                            fontWeight: 500,
                            transition: 'all .2s',
                            width: '100%'
                          }}
                        >
                          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{opt.i}</span>
                          <span>{opt.t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ padding: '18px 40px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  <button onClick={skipQuizStep} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontFamily: 'Syne, sans-serif', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '.04em' }}>Skip →</button>
                  <button 
                    onClick={nextQuizStep}
                    disabled={!quizAnswers[quizStep]}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                      color: '#fff',
                      padding: '12px 28px',
                      borderRadius: '12px',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: '.75rem',
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: quizAnswers[quizStep] ? 1 : 0.4,
                      transition: 'opacity .2s'
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {quizResult && (
            <div id="qzResult" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '14px' }}>{quizResult.icon}</div>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '10px', lineHeight: 1.1 }}>{quizResult.title}</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.9rem', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.75, fontFamily: 'DM Sans, sans-serif' }}>{quizResult.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', textAlign: 'left' }}>
                {quizResult.picks.map((ep, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onOpenGuestModal(ep)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: 'rgba(255,255,255,.05)',
                      border: '1px solid rgba(255,255,255,.08)',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      transition: 'all .2s'
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: ep.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: '.8rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{ep.av}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '.9rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{ep.name}</div>
                      <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.title}</div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.9rem' }}>▶</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={restartQuiz} style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)', border: '1.5px solid rgba(255,255,255,.12)', padding: '11px 22px', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer' }}>↩ Retake</button>
                <button onClick={() => { restartQuiz(); handleCategorySelect('all'); }} style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer' }}>Browse All →</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
