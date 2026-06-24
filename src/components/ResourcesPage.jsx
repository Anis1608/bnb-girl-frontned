import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';

const FIELDS = [];


const TYPE_COLORS = {
  pdf: { bg: 'rgba(147,51,234,0.08)', color: '#7C3AED', label: 'Episode PDF' },
  guide: { bg: 'rgba(234,179,8,0.1)', color: '#92700A', label: 'Career Guide' },
  template: { bg: 'rgba(236,72,153,0.1)', color: '#BE185D', label: 'Template' },
  worksheet: { bg: 'rgba(16,185,129,0.1)', color: '#065F46', label: 'Workbook' },
  reading: { bg: 'rgba(249,115,22,0.1)', color: '#9A3412', label: 'Reading List' },
  toolkit: { bg: 'rgba(99,102,241,0.1)', color: '#3730A3', label: 'Toolkit' },
  salary: { bg: 'rgba(6,182,212,0.1)', color: '#155E75', label: 'Salary Report' },
  script: { bg: 'rgba(244,114,182,0.1)', color: '#9D174D', label: 'Scripts & Emails' },
};

const FIELD_COLORS = {
  stem: '#0D9488', business: '#D97706', law: '#6366F1', mental: '#EC4899',
  creative: '#F97316', finance: '#0284C7', health: '#10B981', education: '#9333EA',
  technology: '#0D9488', 'creative-and-media': '#F97316', healthcare: '#EC4899', 'education-and-academia': '#9333EA'
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

const getRelevanceScore = (r, fieldName, queryStr) => {
  const q = queryStr.toLowerCase().trim();
  if (!q) return 1;

  const terms = q.split(/\s+/).filter(Boolean);
  let totalScore = 0;

  const title = r.title.toLowerCase();
  const desc = r.desc.toLowerCase();
  const tags = (r.tags || []).map(t => t.toLowerCase());
  const field = (fieldName || '').toLowerCase();
  const typeLabel = (TYPE_COLORS[r.type]?.label || '').toLowerCase();

  terms.forEach(term => {
    let termScore = 0;

    if (title.includes(term)) termScore += 15;
    if (field.includes(term)) termScore += 8;
    if (typeLabel.includes(term)) termScore += 6;
    if (tags.some(t => t.includes(term))) termScore += 5;
    if (desc.includes(term)) termScore += 3;

    const titleWords = title.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const descWords = desc.split(/[^a-zA-Z0-9]+/).filter(Boolean);

    if (titleWords.some(w => isFuzzyMatch(w, term))) termScore += 10;
    if (tags.some(t => isFuzzyMatch(t, term))) termScore += 8;
    if (isFuzzyMatch(field, term)) termScore += 6;
    if (descWords.some(w => isFuzzyMatch(w, term))) termScore += 2;

    const syns = SYNONYMS[term] || [];
    syns.forEach(syn => {
      if (title.includes(syn)) termScore += 5;
      if (tags.some(t => t.includes(syn))) termScore += 4;
      if (field.includes(syn)) termScore += 3;
      if (desc.includes(syn)) termScore += 1;
    });

    totalScore += termScore;
  });

  return totalScore;
};

export default function ResourcesPage({ onNavChange, onShowToast }) {
  const { resources: dbFields, loading, submitForm, cms } = useApp();
  const fields = dbFields || [];

  const [activeType, setActiveType] = useState('all');
  const [activeField, setActiveField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [subfieldFilters, setSubfieldFilters] = useState({});

  // Reset or initialize subfieldFilters when fields change
  useEffect(() => {
    setSubfieldFilters(
      fields.reduce((acc, curr) => {
        acc[curr.id] = 'All';
        return acc;
      }, {})
    );
  }, [fields]);

  // Flatten all resources with field info for quick search
  const ALL_RESOURCES = useMemo(() => {
    const list = [];
    fields.forEach(f => {
      f.resources.forEach((r, i) => {
        list.push({
          ...r,
          field: f.id,
          fieldName: f.name,
          fieldEmoji: f.emoji,
          fieldColor: f.color || '#9333EA',
          uid: `${f.id}_${i}`
        });
      });
    });
    return list;
  }, [fields]);

  // Dynamic featured resources
  const featuredResources = useMemo(() => {
    return ALL_RESOURCES.filter(r => r.isFeatured || r.is_featured);
  }, [ALL_RESOURCES]);

  // Dynamic counts for each resource type
  const typeCounts = useMemo(() => {
    const counts = {
      pdf: 0,
      guide: 0,
      template: 0,
      worksheet: 0,
      reading: 0,
      toolkit: 0,
      salary: 0,
      script: 0
    };
    ALL_RESOURCES.forEach(r => {
      if (counts[r.type] !== undefined) {
        counts[r.type]++;
      }
    });
    return counts;
  }, [ALL_RESOURCES]);

  const handleTypeCardClick = (type) => {
    setActiveType(type);
    setActiveField('all');
    // Smooth scroll to the filter bar
    const el = document.getElementById('filterBar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic coming soon resources
  const pipelineCards = useMemo(() => {
    const cards = [];
    for (let i = 1; i <= 4; i++) {
      const icon = cms?.[`cms_resources_coming_card${i}_icon`];
      const title = cms?.[`cms_resources_coming_card${i}_title`];
      const desc = cms?.[`cms_resources_coming_card${i}_desc`];
      const tag = cms?.[`cms_resources_coming_card${i}_tag`];
      const notify = cms?.[`cms_resources_coming_card${i}_notify`];
      
      if (title) {
        cards.push({
          uid: `coming_card_${i}`,
          icon: icon || "🔒",
          title,
          desc,
          tag,
          notifyTitle: notify || title
        });
      }
    }
    
    if (cards.length === 0) {
      return [
        {
          uid: 'coming_card_1',
          icon: '🏛️',
          title: 'Breaking Into Law — The Complete Playbook',
          desc: 'Bar exam timelines, law school application guide, and networking scripts for aspiring lawyers.',
          tag: '⚖️ Law · Q2 2026',
          notifyTitle: 'Law Playbook'
        },
        {
          uid: 'coming_card_2',
          icon: '🎙️',
          title: 'Podcast Ep. 05 — Healthcare Career Guide',
          desc: 'Full insight PDF for our upcoming episode featuring a senior NHS consultant and medical researcher.',
          tag: '🏥 Healthcare · Coming June',
          notifyTitle: 'Healthcare Guide'
        },
        {
          uid: 'coming_card_3',
          icon: '💡',
          title: "Founder's Toolkit — Starting From Zero",
          desc: 'Business model canvas, pitch deck templates, and a step-by-step guide to validating your idea.',
          tag: '🚀 Entrepreneurship · Q2 2026',
          notifyTitle: 'Founder Toolkit'
        },
        {
          uid: 'coming_card_4',
          icon: '🎨',
          title: 'Creative Industry Rate Card & Negotiation Guide',
          desc: 'Freelance rates, agency salaries, and scripts for negotiating your creative fees like a pro.',
          tag: '🎨 Creative · Q3 2026',
          notifyTitle: 'Creative Rate Guide'
        }
      ];
    }
    return cards;
  }, [cms]);

  const searchWrapRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchSuggestionsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleDownload = (title) => {
    if (onShowToast) {
      onShowToast('📥', 'Downloaded!', title.length > 28 ? title.substring(0, 28) + '...' : title);
    }
  };

  const handleNotifyMe = (title) => {
    if (onShowToast) {
      onShowToast('🔔', 'Notification set!', `You will be notified for: ${title}`);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    const emailToSubmit = newsletterEmail;

    // Optimistically update UI state immediately
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    if (onShowToast) {
      onShowToast('✉️', 'Subscribed!', 'Welcome to the BBG Resource newsletter!');
    }

    // Trigger API request in the background
    submitForm('community', { email: emailToSubmit }).catch(err => {
      console.error('Newsletter background subscription error:', err);
      // Notify user on background error
      if (onShowToast) {
        onShowToast('❌', 'Error', 'Background subscription sync failed.');
      }
    });
  };

  const handleSubfieldChange = (fieldId, subfield) => {
    setSubfieldFilters(prev => ({
      ...prev,
      [fieldId]: subfield
    }));
  };

  const resetFilters = () => {
    setActiveType('all');
    setActiveField('all');
    setSearchQuery('');
    setSearchSuggestionsOpen(false);
    setSubfieldFilters(
      fields.reduce((acc, curr) => {
        acc[curr.id] = 'All';
        return acc;
      }, {})
    );
  };

  // Get matching suggestions for search query
  const getSearchSuggestions = () => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) return [];
    return ALL_RESOURCES
      .map(r => ({
        ...r,
        _score: getRelevanceScore(r, r.fieldName, searchQuery)
      }))
      .filter(r => r._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 6);
  };

  const suggestions = getSearchSuggestions();

  // Scroll to element helper
  const scrollToCard = (uid) => {
    setSearchSuggestionsOpen(false);
    const element = document.getElementById(uid);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Apply micro-animation highlight
      element.style.outline = '2px solid var(--purple-mid)';
      element.style.transform = 'scale(1.03)';
      setTimeout(() => {
        element.style.outline = 'none';
        element.style.transform = '';
      }, 1500);
    }
  };

  // Check if a resource matches the selected filters
  const matchesFilters = (r, fieldId, fieldName) => {
    // 1. Matches active resource type tab
    const matchType = activeType === 'all' || activeType === r.type;
    // 2. Matches active field chip
    const matchField = activeField === 'all' || activeField === fieldId;
    // 3. Matches category-specific subfield tab
    const activeSub = subfieldFilters[fieldId] || 'All';
    const matchSubfield = activeSub === 'All' || (r.tags || []).some(t => t.toLowerCase().includes(activeSub.toLowerCase()));

    if (!matchType || !matchField || !matchSubfield) return false;

    const q = searchQuery.toLowerCase().trim();
    if (q === '') return true;

    const score = getRelevanceScore(r, fieldName, searchQuery);
    return score > 0;
  };

  // Calculate total visible items
  let totalVisible = 0;
  fields.forEach(f => {
    if (activeField === 'all' || activeField === f.id) {
      f.resources.forEach(r => {
        if (matchesFilters(r, f.id, f.name)) {
          totalVisible++;
        }
      });
    }
  });

  return (
    <div className="resources-page-container" style={{ position: 'relative', zIndex: 1, background: '#0A0414', minHeight: '100vh', color: '#fff' }}>
      {/* Back to Home Button */}
      <button className="back-nav" onClick={() => onNavChange('home')} style={{ border: 'none', cursor: 'pointer' }}>
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to BBG
      </button>

      {/* ── HERO ── */}
      <section className="hero" style={{ zIndex: 8000 }}>
        {/* Glow Effects */}
        <div style={{
          content: "''",
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(147, 51, 234, 0.18) 0%, transparent 100%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(236, 72, 153, 0.12) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          content: "''",
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none'
        }} />

        <div className="hero__inner" style={{ zIndex: 8000 }}>
          <div className="hero__eyebrow" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '.2em',
            color: 'rgba(255, 215, 0, 0.8)',
            background: 'rgba(255, 215, 0, 0.08)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            padding: '5px 16px',
            borderRadius: '9999px',
            marginBottom: '20px'
          }}>{cms?.cms_resources_hero_eyebrow || '📚 Resource Library'}</div>

          {cms?.cms_resources_hero_title ? (
            <h1 className="hero__h1" style={{
              fontFamily: "var(--font-d)",
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              color: '#fff',
              marginBottom: '14px',
              lineHeight: 1.08,
              letterSpacing: '-0.03em'
            }} dangerouslySetInnerHTML={{ __html: cms.cms_resources_hero_title }} />
          ) : (
            <h1 className="hero__h1" style={{
              fontFamily: "var(--font-d)",
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              color: '#fff',
              marginBottom: '14px',
              lineHeight: 1.08,
              letterSpacing: '-0.03em'
            }}>Everything You Need to<br /><span style={{
              background: 'linear-gradient(90deg, #FFE100, #F97316, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Build Your Career</span></h1>
          )}

          <p className="hero__sub" style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '36px',
            maxWidth: '580px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.7
          }}>{cms?.cms_resources_hero_subtitle || 'Episode PDFs, career guides, templates, reading lists, salary reports and more — all free, all curated from our guest experts across every field.'}</p>

          {/* Search bar */}
          <div className="search-wrap" ref={searchWrapRef} style={{
            maxWidth: '620px',
            margin: '0 auto 40px',
            position: 'relative',
            zIndex: 8000
          }}>
            <svg className="search-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.4)',
              pointerEvents: 'none'
            }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-box"
              placeholder="Search by topic, guest, field, or resource type…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchSuggestionsOpen(e.target.value.trim().length >= 2);
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setSearchSuggestionsOpen(true);
              }}
              autoComplete="off"
              style={{
                width: '100%',
                height: '58px',
                borderRadius: '14px',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.07)',
                color: '#fff',
                fontSize: '15px',
                padding: '0 56px 0 52px',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button className="search-clear vis" onClick={() => { setSearchQuery(''); setSearchSuggestionsOpen(false); }} style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>✕</button>
            )}

            {/* Auto suggestions list */}
            {searchSuggestionsOpen && (
              <div className="search-results-drop open" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: '#1A0D35',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                maxHeight: '350px',
                overflowY: 'auto',
                zIndex: 8000,
                display: 'block',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                textAlign: 'left'
              }}>
                {suggestions.length > 0 ? (
                  suggestions.map((r) => {
                    const t = TYPE_COLORS[r.type] || TYPE_COLORS.pdf;
                    return (
                      <div key={r.uid} className="search-drop-item" onClick={() => scrollToCard(r.uid)}>
                        <div className="search-drop-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>{r.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="search-drop-title">{r.title}</div>
                          <div className="search-drop-meta">{r.fieldEmoji} {r.fieldName} · {t.label}</div>
                        </div>
                        <div className="search-drop-tag" style={{ background: t.bg, color: t.color }}>{r.pages}p</div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '20px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hero-stats" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>{ALL_RESOURCES.length}</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>{cms?.cms_resources_stat_resources_lbl || 'Resources'}</span>
            </div>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative', borderLeft: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>{typeCounts.pdf}</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>{cms?.cms_resources_stat_pdfs_lbl || 'Episode PDFs'}</span>
            </div>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative', borderLeft: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>{fields.length}</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>{cms?.cms_resources_stat_fields_lbl || 'Career Fields'}</span>
            </div>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative', borderLeft: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>{typeCounts.template}</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>{cms?.cms_resources_stat_templates_lbl || 'Templates'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ── */}
      <div className="filter-bar" id="filterBar" style={{ zIndex: 100 }}>
        <div className="filter-bar__inner">
          <div className="filter-types">
            <button className={`filter-type-btn ${activeType === 'all' ? 'active' : ''}`} onClick={() => setActiveType('all')}>
              <span className="dot" style={{ background: '#fff' }}></span>All Resources
            </button>
            <button className={`filter-type-btn ${activeType === 'pdf' ? 'active' : ''}`} onClick={() => setActiveType('pdf')}>
              <span className="dot" style={{ background: '#9333EA' }}></span>Episode PDFs
            </button>
            <button className={`filter-type-btn ${activeType === 'guide' ? 'active' : ''}`} onClick={() => setActiveType('guide')}>
              <span className="dot" style={{ background: '#EAB308' }}></span>Career Guides
            </button>
            <button className={`filter-type-btn ${activeType === 'template' ? 'active' : ''}`} onClick={() => setActiveType('template')}>
              <span className="dot" style={{ background: '#EC4899' }}></span>Templates
            </button>
            <button className={`filter-type-btn ${activeType === 'worksheet' ? 'active' : ''}`} onClick={() => setActiveType('worksheet')}>
              <span className="dot" style={{ background: '#10B981' }}></span>Workbooks
            </button>
            <button className={`filter-type-btn ${activeType === 'reading' ? 'active' : ''}`} onClick={() => setActiveType('reading')}>
              <span className="dot" style={{ background: '#F97316' }}></span>Reading Lists
            </button>
            <button className={`filter-type-btn ${activeType === 'toolkit' ? 'active' : ''}`} onClick={() => setActiveType('toolkit')}>
              <span className="dot" style={{ background: '#6366F1' }}></span>Toolkits
            </button>
            <button className={`filter-type-btn ${activeType === 'salary' ? 'active' : ''}`} onClick={() => setActiveType('salary')}>
              <span className="dot" style={{ background: '#06B6D4' }}></span>Salary Reports
            </button>
            <button className={`filter-type-btn ${activeType === 'script' ? 'active' : ''}`} onClick={() => setActiveType('script')}>
              <span className="dot" style={{ background: '#F472B6' }}></span>Scripts &amp; Emails
            </button>
          </div>

          <div className="filter-fields">
            <button className={`field-chip ${activeField === 'all' ? 'active' : ''}`} data-field="all" onClick={() => setActiveField('all')}>
              All Fields
            </button>
            {fields.map(f => (
              <button key={f.id} className={`field-chip ${activeField === f.id ? 'active' : ''}`} data-field={f.id} onClick={() => {
                setActiveField(f.id);
                setTimeout(() => {
                  const el = document.getElementById(`field-${f.id}`);
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
              }}>
                {f.emoji} {f.name}
              </button>
            ))}
          </div>

          <div className="results-count" id="resultsCount">
            Showing <strong>{totalVisible}</strong> resources
          </div>
        </div>
      </div>

      {/* ── FEATURED WEEKLY RESOURCES (dark theme) ── */}
      {(loading || featuredResources.length > 0) && (
        <div className="featured-section">
          <div className="featured-section__inner">
            <div className="section-label">
              <span className="section-label__text">⭐ Featured This Week</span>
              <div className="section-label__line"></div>
            </div>
            <div className="featured-grid">
              {loading ? (
                <>
                  <div className="feat-card-big" style={{ opacity: 0.6, pointerEvents: 'none' }}>
                    <div className="feat-card-big__cover skeleton-box" style={{ height: '240px' }}></div>
                    <div className="feat-card-big__body" style={{ textAlign: 'left' }}>
                      <div className="skeleton-box" style={{ height: '10px', width: '30%', marginBottom: '10px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '24px', width: '70%', marginBottom: '12px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '14px', width: '90%', marginBottom: '8px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '14px', width: '50%', marginBottom: '24px', borderRadius: '4px' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="skeleton-box" style={{ height: '14px', width: '80px', borderRadius: '4px' }}></div>
                        <div className="skeleton-box" style={{ height: '36px', width: '120px', borderRadius: '8px' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="feat-card-sm" style={{ opacity: 0.6, pointerEvents: 'none' }}>
                    <div className="feat-card-sm__cover skeleton-box" style={{ height: '100%' }}></div>
                    <div className="feat-card-sm__body" style={{ textAlign: 'left' }}>
                      <div className="skeleton-box" style={{ height: '10px', width: '30%', marginBottom: '10px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '20px', width: '80%', marginBottom: '12px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '14px', width: '90%', marginBottom: '24px', borderRadius: '4px' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="skeleton-box" style={{ height: '14px', width: '60px', borderRadius: '4px' }}></div>
                        <div className="skeleton-box" style={{ height: '32px', width: '100px', borderRadius: '8px' }}></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                featuredResources.map((r, idx) => {
                  const t = TYPE_COLORS[r.type] || TYPE_COLORS.pdf;
                  if (idx === 0) {
                    return (
                      <div key={r.uid} className="feat-card-big" onClick={() => handleDownload(r.title)}>
                        <div className="feat-card-big__cover" style={{ background: r.bg || r.cover_color }}>
                          <span className="feat-card-big__badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{t.label}</span>
                          <span className="feat-card-big__new">NEW</span>
                          <svg viewBox="0 0 200 140" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .2 }}>
                            <circle cx="160" cy="30" r="60" fill="white" />
                            <circle cx="40" cy="110" r="40" fill="white" />
                            <rect x="70" y="50" width="60" height="80" rx="8" fill="white" opacity=".3" />
                            <rect x="80" y="30" width="40" height="10" rx="5" fill="white" opacity=".4" />
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '52px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}>{r.icon}</div>
                            {r.pages > 0 && <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: 'rgba(255,255,255,0.7)' }}>{r.pages}-Page Deep Dive</div>}
                          </div>
                        </div>
                        <div className="feat-card-big__body" style={{ textAlign: 'left' }}>
                          <div className="feat-card-big__field">{r.fieldName}</div>
                          <div className="feat-card-big__title">{r.title}</div>
                          <div className="feat-card-big__desc">{r.desc || r.description}</div>
                          <div className="feat-card-big__footer">
                            <span className="feat-card-big__ep">{r.ep}</span>
                            <button className="dl-btn" onClick={(e) => { e.stopPropagation(); handleDownload(r.title); }}>
                              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>
                              Download Free
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={r.uid} className="feat-card-sm" onClick={() => handleDownload(r.title)}>
                        <div className="feat-card-sm__cover" style={{ background: r.bg || r.cover_color }}>
                          <div className="feat-card-sm__icon">{r.icon}</div>
                        </div>
                        <div className="feat-card-sm__body" style={{ textAlign: 'left' }}>
                          <div className="feat-card-sm__type">{t.label} · {r.fieldName}</div>
                          <div className="feat-card-sm__title">{r.title}</div>
                          <div className="feat-card-sm__desc">{r.desc || r.description}</div>
                          <div className="feat-card-sm__footer">
                            {r.pages > 0 && <span className="feat-card-sm__pages">{r.pages} pages</span>}
                            <button className="dl-btn" style={{ fontSize: '11px', height: '32px', padding: '0 12px' }} onClick={(e) => { e.stopPropagation(); handleDownload(r.title); }}>
                              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>
                              Free PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN RESOURCES GRID BY FIELDS ── */}
      <div className="page-body" style={{ background: '#F7F3FF', minHeight: '60vh' }}>
        <style>{`
          .skeleton-box {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
            background-size: 400% 100% !important;
            animation: skeleton-loading 1.4s ease infinite !important;
          }
          .page-body .skeleton-box {
            background: linear-gradient(90deg, rgba(0, 0, 0, 0.03) 25%, rgba(0, 0, 0, 0.08) 37%, rgba(0, 0, 0, 0.03) 63%) !important;
            background-size: 400% 100% !important;
            animation: skeleton-loading 1.4s ease infinite !important;
          }
          @keyframes skeleton-loading {
            0% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          /* Card body definitions */
          .feat-card-big__body {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .feat-card-sm__body {
            padding: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .rc__body {
            padding: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          /* Tag, type, field color & spacing corrections */
          .feat-card-big__field {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .12em;
            color: rgba(255, 255, 255, 0.35);
            margin-bottom: 6px;
          }
          .feat-card-sm__type {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .14em;
            color: rgba(255, 255, 255, 0.3);
            margin-bottom: 5px;
          }
          .rc__field {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .1em;
            color: var(--grey-muted);
            margin-bottom: 6px;
          }

          /* Reset resources-grid global conflict from landing page */
          .resources-page-container .resources-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            max-width: none;
            margin: 32px 0 0;
            padding: 0;
          }

          /* Featured section spacing and background */
          .featured-section {
            background: #0A0414 !important;
            padding: 52px 24px 80px !important;
          }
          .featured-section__inner {
            max-width: 1200px;
            margin: 0 auto;
          }

          /* Category headers (field sections) styling */
          .field-section {
            margin-bottom: 52px;
          }
          .field-section__head {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 8px;
            cursor: pointer;
          }
          .field-section__emoji {
            font-size: 28px;
          }
          .field-section__info {
            flex: 1;
          }
          .field-section__name {
            font-family: var(--font-d);
            font-size: 22px;
            font-weight: 700;
            color: var(--page-text, #0F0A1E);
            margin-bottom: 2px;
          }
          .field-section__sub {
            font-size: 12px;
            color: var(--grey-muted);
            font-weight: 500;
          }
          .field-section__count {
            font-size: 12px;
            font-weight: 700;
            color: var(--grey-muted);
            padding: 4px 12px;
            border-radius: 9999px;
            background: rgba(107,33,168,0.06);
            border: 1px solid rgba(107,33,168,0.08);
            white-space: nowrap;
          }

          /* Subfield tabs */
          .subfield-tabs {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin-bottom: 24px;
            padding: 12px 0 0;
          }
          .subfield-tab {
            padding: 5px 14px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            border: 1px solid rgba(107,33,168,0.12);
            background: transparent;
            color: var(--grey-text);
            transition: all .2s;
            font-family: var(--font-b);
          }
          .subfield-tab:hover {
            border-color: rgba(147,51,234,0.3);
            color: var(--purple-mid);
          }
          .subfield-tab.active {
            background: var(--purple-mid);
            border-color: transparent;
            color: #fff;
          }

          /* Empty State styles */
          .empty-state {
            text-align: center;
            padding: 80px 24px;
            display: none;
          }
          .empty-state.show {
            display: block;
          }
          .empty-state__icon {
            font-size: 52px;
            margin-bottom: 16px;
          }
          .empty-state__h3 {
            font-family: var(--font-d);
            font-size: 22px;
            font-weight: 700;
            color: var(--page-text, #0F0A1E);
            margin-bottom: 8px;
          }
          .empty-state__p {
            font-size: 15px;
            color: var(--grey-text);
            max-width: 360px;
            margin: 0 auto 24px;
          }
          .empty-state__btn {
            height: 42px;
            padding: 0 24px;
            border-radius: 9999px;
            background: var(--purple-mid);
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            font-family: var(--font-b);
          }

          /* Responsive Rules */
          @media(max-width:1024px){
            .resources-page-container .resources-grid{grid-template-columns:repeat(3,1fr)}
            .coming-grid{grid-template-columns:repeat(2,1fr) !important}
            .types-grid{grid-template-columns:repeat(2,1fr) !important}
            .featured-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}
            .feat-card-big{grid-column:1/-1}
          }
          @media(max-width:768px){
            .featured-grid{grid-template-columns:1fr}
            .resources-page-container .resources-grid{grid-template-columns:repeat(2,1fr);gap:14px}
            .coming-grid{grid-template-columns:repeat(2,1fr) !important}
            .types-grid{grid-template-columns:repeat(2,1fr) !important}
            .resources-section{padding:36px 16px 60px}
          }
          @media(max-width:480px){
            .resources-page-container .resources-grid{grid-template-columns:1fr}
            .coming-grid{grid-template-columns:1fr !important}
            .types-grid{grid-template-columns:1fr 1fr !important}
          }
        `}</style>
        <div className="resources-section">
          {loading ? (
            <div className="field-section" style={{ textAlign: 'left' }}>
              <div className="field-section__head" style={{ opacity: 0.6, pointerEvents: 'none' }}>
                <div className="skeleton-box" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
                <div className="field-section__info">
                  <div className="skeleton-box" style={{ height: '20px', width: '200px', marginBottom: '6px', borderRadius: '4px' }}></div>
                  <div className="skeleton-box" style={{ height: '12px', width: '320px', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div className="resources-grid" style={{ marginTop: '24px' }}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="rc" style={{ opacity: 0.6, pointerEvents: 'none' }}>
                    <div className="rc__cover skeleton-box" style={{ height: '120px' }}></div>
                    <div className="rc__body">
                      <div className="skeleton-box" style={{ height: '10px', width: '40%', marginBottom: '10px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '18px', width: '80%', marginBottom: '12px', borderRadius: '4px' }}></div>
                      <div className="skeleton-box" style={{ height: '12px', width: '90%', marginBottom: '20px', borderRadius: '4px' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="skeleton-box" style={{ height: '12px', width: '60px', borderRadius: '4px' }}></div>
                        <div className="skeleton-box" style={{ height: '28px', width: '80px', borderRadius: '6px' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : fields.map((f) => {
            const showField = activeField === 'all' || activeField === f.id;

            // Filter and sort resources of this category by search relevance
            const visibleResources = f.resources
              .filter(r => matchesFilters(r, f.id, f.name))
              .map(r => ({
                ...r,
                _score: searchQuery.trim() ? getRelevanceScore(r, f.name, searchQuery) : 0
              }))
              .sort((a, b) => b._score - a._score);

            if (!showField || visibleResources.length === 0) return null;

            return (
              <React.Fragment key={f.id}>
                <div className="field-section visible reveal vis" id={`field-${f.id}`} style={{ textAlign: 'left' }}>
                  <div className="field-section__head">
                    <div className="field-section__emoji">{f.emoji}</div>
                    <div className="field-section__info">
                      <div className="field-section__name">{f.name}</div>
                      <div className="field-section__sub">{f.sub}</div>
                    </div>
                    <div className="field-section__count">{visibleResources.length} resources</div>
                  </div>

                  {/* Subfield category tabs */}
                  <div className="subfield-tabs">
                    {f.subfields.map((sf, idx) => (
                      <button
                        key={idx}
                        className={`subfield-tab ${subfieldFilters[f.id] === sf ? 'active' : ''}`}
                        onClick={() => handleSubfieldChange(f.id, sf)}
                      >
                        {sf}
                      </button>
                    ))}
                  </div>

                  {/* Resources Grid */}
                  <div className="resources-grid" id={`grid-${f.id}`}>
                    {visibleResources.map((r, i) => {
                      const t = TYPE_COLORS[r.type] || TYPE_COLORS.pdf;
                      const uid = `${f.id}_${i}`;
                      return (
                        <div key={uid} className={`rc rc--${r.type}`} id={uid} onClick={() => handleDownload(r.title)}>
                          <div className="rc__cover" style={{ background: r.bg }}>
                            <div className="rc__cover-icon">{r.icon}</div>
                            <div className="rc__type-badge" style={{ background: t.bg, color: t.color }}>{t.label}</div>
                            {r.pages && <div className="rc__pages">{r.pages}p</div>}
                          </div>
                          <div className="rc__body">
                            <div className="rc__field">
                              <span className="rc__field-dot" style={{ background: FIELD_COLORS[f.id] || '#9333EA' }}></span>
                              {f.emoji} {f.name}
                            </div>
                            <div className="rc__title">{r.title}</div>
                            <div className="rc__desc">{r.desc}</div>
                            <div className="rc__footer">
                              <span className="rc__ep-link">
                                {r.ep}
                                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginTop: '1px' }}>
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </span>
                              <button className="rc__dl" onClick={(e) => { e.stopPropagation(); handleDownload(r.title); }}>
                                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ height: '1px', background: 'rgba(107,33,168,0.06)', margin: '8px 0 44px' }}></div>
              </React.Fragment>
            );
          })}

          {/* Empty state view when no resources found */}
          <div className={`empty-state ${totalVisible === 0 ? 'show' : ''}`} id="emptyState">
            <div className="empty-state__icon">🔍</div>
            <h3 className="empty-state__h3">No resources found</h3>
            <p className="empty-state__p">Try a different filter or search term. We're adding new resources every week.</p>
            <button className="empty-state__btn" onClick={resetFilters}>Clear Filters</button>
          </div>
        </div>
      </div>

      {/* ── RESOURCE TYPES EXPLAINER ── */}
      <div className="types-section">
        <div className="types-section__inner">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--purple-mid)', background: 'rgba(147,51,234,0.07)', border: '1px solid rgba(147,51,234,0.14)', padding: '4px 14px', borderRadius: '999px', marginBottom: '14px' }}>
              {cms?.cms_resources_types_kicker || "What's Inside"}
            </div>
            {cms?.cms_resources_types_title ? (
              <h2 style={{ fontFamily: 'var(--font-d)', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--black)', letterSpacing: '-0.02em' }} dangerouslySetInnerHTML={{ __html: cms.cms_resources_types_title }} />
            ) : (
              <h2 style={{ fontFamily: 'var(--font-d)', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--black)', letterSpacing: '-0.02em' }}>8 Types of Resources,<br />All Free to Download</h2>
            )}
          </div>
          <div className="types-grid" style={{ marginTop: '36px' }}>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('pdf')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(147,51,234,0.1)' }}>📄</div>
              <div className="type-card__name">Episode PDFs</div>
              <div className="type-card__desc">{cms?.cms_resources_type_pdf_desc || 'Key takeaways, guest quotes, action items and reflection prompts for every episode.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(147,51,234,0.08)', color: 'var(--purple-mid)' }}>{typeCounts.pdf} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('guide')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(234,179,8,0.1)' }}>🗺️</div>
              <div className="type-card__name">Career Guides</div>
              <div className="type-card__desc">{cms?.cms_resources_type_guide_desc || 'Step-by-step roadmaps to break into each field — qualifications, timelines, first steps.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(234,179,8,0.08)', color: '#92700A' }}>{typeCounts.guide} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('template')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(236,72,153,0.1)' }}>📝</div>
              <div className="type-card__name">Templates</div>
              <div className="type-card__desc">{cms?.cms_resources_type_template_desc || 'Field-specific CV/resume templates, cover letter frameworks, and LinkedIn bio builders.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(236,72,153,0.08)', color: '#BE185D' }}>{typeCounts.template} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('worksheet')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(16,185,129,0.1)' }}>📓</div>
              <div className="type-card__name">Workbooks</div>
              <div className="type-card__desc">{cms?.cms_resources_type_worksheet_desc || 'Goal-setting workbooks, self-assessment guides, and quarterly reflection journals.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(16,185,129,0.08)', color: '#065F46' }}>{typeCounts.worksheet} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('reading')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(249,115,22,0.1)' }}>📚</div>
              <div className="type-card__name">Reading Lists</div>
              <div className="type-card__desc">{cms?.cms_resources_type_reading_desc || 'Curated books, podcasts, and courses recommended directly by our guest experts.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(249,115,22,0.08)', color: '#9A3412' }}>{typeCounts.reading} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('toolkit')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(99,102,241,0.1)' }}>🧰</div>
              <div className="type-card__name">Toolkits</div>
              <div className="type-card__desc">{cms?.cms_resources_type_toolkit_desc || 'Interview prep kits, skill checklists, and everything you need to land your first role.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(99,102,241,0.08)', color: '#3730A3' }}>{typeCounts.toolkit} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('salary')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(6,182,212,0.1)' }}>📊</div>
              <div className="type-card__name">Salary Reports</div>
              <div className="type-card__desc">{cms?.cms_resources_type_salary_desc || 'Real earnings data across industries — so you know your worth before any negotiation.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(6,182,212,0.08)', color: '#155E75' }}>{typeCounts.salary} available</div>
            </div>
            <div className="type-card" style={{ cursor: 'pointer' }} onClick={() => handleTypeCardClick('script')}>
              <div className="type-card__icon-wrap" style={{ background: 'rgba(244,114,182,0.1)' }}>✉️</div>
              <div className="type-card__name">Scripts &amp; Emails</div>
              <div className="type-card__desc">{cms?.cms_resources_type_script_desc || 'Networking email templates, LinkedIn outreach scripts, and mentorship request messages.'}</div>
              <div className="type-card__count" style={{ background: 'rgba(244,114,182,0.08)', color: '#9D174D' }}>{typeCounts.script} available</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMING SOON ── */}
      <div className="coming-section">
        <div className="coming-section__inner" style={{ textAlign: 'left' }}>
          <div className="section-label">
            <span className="section-label__text">{cms?.cms_resources_coming_kicker || "🔒 Coming Soon"}</span>
            <div className="section-label__line"></div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#fff', fontWeight: 700, marginTop: '4px', marginBottom: '4px' }}>
            {cms?.cms_resources_coming_title || "Resources in the Pipeline"}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '0' }}>
            {cms?.cms_resources_coming_subtitle || "Notify me when they drop."}
          </p>

          <div className="coming-grid">
            {pipelineCards.map((r) => (
              <div key={r.uid} className="coming-card">
                <div className="coming-card__lock">{r.icon}</div>
                <div className="coming-card__title">{r.title}</div>
                <div className="coming-card__desc">{r.desc}</div>
                <div className="coming-card__tag">{r.tag}</div>
                <button className="coming-card__notify" onClick={() => handleNotifyMe(r.notifyTitle || r.title)}>🔔 Notify Me</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER SIGNUP ── */}
      <div className="newsletter">
        <div className="newsletter__inner">
          <h2 className="newsletter__h2">New Resources,<br />Every Week</h2>
          <p className="newsletter__sub">Get notified the moment we drop a new PDF, guide, or template — straight to your inbox.</p>
          {!newsletterSubscribed ? (
            <form className="newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="newsletter__input"
                placeholder="your@email.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterSubmitting}
                required
              />
              <button type="submit" className="newsletter__btn" disabled={newsletterSubmitting}>
                {newsletterSubmitting ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
          ) : (
            <div className="newsletter__success" style={{
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.25)',
              borderRadius: '12px',
              padding: '24px',
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>✉️</div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>You're Subscribed!</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5 }}>
                Welcome to the circle. A confirmation welcome email has been sent to your inbox.
              </p>
            </div>
          )}
          <div className="newsletter__perks">
            <span className="newsletter__perk">✓ Weekly drops</span>
            <span className="newsletter__perk">✓ No spam, ever</span>
            <span className="newsletter__perk">✓ Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
