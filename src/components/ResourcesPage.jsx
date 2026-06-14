import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';

// Data from resources.html
const FIELDS = [
  {
    id: 'stem', emoji: '🔬', name: 'Women in STEM', sub: 'Biology · Engineering · Computer Science · Data Science · Mathematics',
    color: '#065F46', subfields: ['All', 'Biology', 'Engineering', 'Computer Science', 'Data Science', 'Mathematics'],
    resources: [
      { type: 'pdf', icon: '🎓', title: "Girls' Education Career Playbook", desc: 'Key insights, action steps and reflection prompts from EP. 01 with Dr. Sheen Gurrib.', pages: 12, ep: 'EP. 01', bg: 'linear-gradient(135deg,#3B0764,#7C3AED,#EC4899)', tags: ['education', 'stem', 'sheen', 'oxford'] },
      { type: 'toolkit', icon: '💻', title: 'Women in Tech Interview Prep Kit', desc: '50 interview questions, STAR templates and confidence frameworks from our STEM guests.', pages: 18, ep: 'STEM Series', bg: 'linear-gradient(135deg,#022C22,#065F46,#34D399)', tags: ['tech', 'interview', 'coding', 'stem'] },
      { type: 'guide', icon: '🔭', title: 'Breaking Into STEM — A Roadmap', desc: 'Step-by-step guide to entering science, technology, engineering or maths careers from scratch.', pages: 14, ep: 'STEM Series', bg: 'linear-gradient(135deg,#0C4A6E,#0369A1,#38BDF8)', tags: ['stem', 'career', 'guide', 'roadmap'] },
      { type: 'template', icon: '📋', title: 'STEM Graduate CV Template', desc: 'ATS-friendly CV template designed for STEM graduates — with a guided example and tips.', pages: 4, ep: 'All Episodes', bg: 'linear-gradient(135deg,#1E1B4B,#4338CA,#818CF8)', tags: ['cv', 'resume', 'template', 'stem'] },
      { type: 'reading', icon: '📖', title: 'STEM Reading List — Recommended by Guests', desc: 'Books, podcasts and online courses curated by every STEM guest who\'s appeared on BBG.', pages: 8, ep: 'All Episodes', bg: 'linear-gradient(135deg,#134E4A,#0F766E,#2DD4BF)', tags: ['books', 'reading', 'stem', 'learning'] },
      { type: 'salary', icon: '📊', title: 'Women in Tech Salary Report 2025', desc: 'Real salary data for software, data, engineering and science roles across UK, US and India.', pages: 20, ep: 'Research', bg: 'linear-gradient(135deg,#082F49,#0369A1,#38BDF8)', tags: ['salary', 'tech', 'finance', 'data'] },
    ]
  },
  {
    id: 'business', emoji: '🚀', name: 'Entrepreneurship & Business', sub: 'Startups · Social Enterprise · Leadership · E-commerce · Branding',
    color: '#92400E', subfields: ['All', 'Startups', 'Social Enterprise', 'Leadership', 'E-commerce', 'Branding'],
    resources: [
      { type: 'pdf', icon: '🚀', title: "Side Hustle to Global Brand — EP. 02 Insights", desc: 'Complete breakdown of Dr. Sheen\'s entrepreneurship episode: mindset shifts, key frameworks, and the 5 mistakes to avoid.', pages: 10, ep: 'EP. 02', bg: 'linear-gradient(135deg,#451A03,#B45309,#F59E0B)', tags: ['entrepreneurship', 'brand', 'startup', 'business'] },
      { type: 'guide', icon: '💡', title: 'Starting From Zero — The Founder\'s Guide', desc: 'A practical step-by-step framework for validating your business idea before quitting your day job.', pages: 16, ep: 'Business Series', bg: 'linear-gradient(135deg,#78350F,#D97706,#FCD34D)', tags: ['founder', 'startup', 'idea', 'business'] },
      { type: 'template', icon: '📊', title: 'Pitch Deck Template for Women Founders', desc: '10-slide investor pitch deck framework with a guided example, metrics guide, and storytelling tips.', pages: 22, ep: 'Entrepreneurship Series', bg: 'linear-gradient(135deg,#3F1505,#C2410C,#FB923C)', tags: ['pitch', 'investor', 'deck', 'template'] },
      { type: 'worksheet', icon: '📓', title: 'Business Model Canvas — Fillable Workbook', desc: 'Interactive workbook version of the Business Model Canvas with reflection questions for each block.', pages: 8, ep: 'Business Series', bg: 'linear-gradient(135deg,#1C1917,#57534E,#D6D3D1)', tags: ['business model', 'canvas', 'workbook', 'planning'] },
      { type: 'reading', icon: '📚', title: 'Entrepreneur Reading List — Books That Changed Our Guests\' Lives', desc: 'Books hand-picked by every entrepreneurial guest who has appeared on BBG — with a note on why each book mattered.', pages: 6, ep: 'All Episodes', bg: 'linear-gradient(135deg,#713F12,#CA8A04,#FEF08A)', tags: ['books', 'reading', 'entrepreneurship', 'founder'] },
      { type: 'toolkit', icon: '🧰', title: 'The BBG Leadership Toolkit', desc: 'Self-assessment, values mapping, and communication style guide for aspiring leaders.', pages: 14, ep: 'Leadership Series', bg: 'linear-gradient(135deg,#312E81,#4338CA,#818CF8)', tags: ['leadership', 'toolkit', 'management', 'skills'] },
    ]
  },
  {
    id: 'law', emoji: '⚖️', name: 'Law & Justice', sub: 'Corporate Law · Criminal Law · Human Rights · International Law · Family Law',
    color: '#312E81', subfields: ['All', 'Corporate', 'Criminal', 'Human Rights', 'International', 'Family'],
    resources: [
      { type: 'guide', icon: '⚖️', title: 'How to Become a Lawyer — The Complete Guide', desc: 'Law school applications, bar exam prep, and the different routes into practice across UK, US and India.', pages: 18, ep: 'Law Series', bg: 'linear-gradient(135deg,#1E1B4B,#3730A3,#6366F1)', tags: ['law', 'lawyer', 'guide', 'career'] },
      { type: 'template', icon: '📝', title: 'Law School Personal Statement Template', desc: 'A structured template with prompts and real examples to help you write a compelling law school application.', pages: 6, ep: 'Law Series', bg: 'linear-gradient(135deg,#0D0B2A,#1E1B4B,#4338CA)', tags: ['law school', 'template', 'application', 'personal statement'] },
      { type: 'worksheet', icon: '📓', title: 'Legal Career Self-Assessment Workbook', desc: 'Find which area of law suits your personality, strengths and values — with a guided 30-day action plan.', pages: 10, ep: 'Law Series', bg: 'linear-gradient(135deg,#2E1065,#6B21A8,#A855F7)', tags: ['law', 'self-assessment', 'career', 'workbook'] },
      { type: 'reading', icon: '📚', title: 'Law Reading List — Recommended by Guests', desc: 'Essential law books, podcasts and documentaries curated by every legal professional who\'s appeared on BBG.', pages: 5, ep: 'All Episodes', bg: 'linear-gradient(135deg,#1E1B4B,#4338CA,#818CF8)', tags: ['law', 'books', 'reading', 'legal'] },
    ]
  },
  {
    id: 'mental', emoji: '🌸', name: 'Mental Health & Wellbeing', sub: 'Work-Life Balance · Burnout Prevention · Mindfulness · Self-Compassion',
    color: '#831843', subfields: ['All', 'Burnout', 'Mindfulness', 'Work-Life Balance', 'Self-Compassion'],
    resources: [
      { type: 'pdf', icon: '🌸', title: 'Mental Health & Career — EP. 03 Insights', desc: 'Key insights on managing mental health while building a career, from our dedicated Mental Health & Career episode.', pages: 9, ep: 'EP. 03', bg: 'linear-gradient(135deg,#500724,#BE185D,#F472B6)', tags: ['mental health', 'wellbeing', 'career', 'burnout'] },
      { type: 'worksheet', icon: '📓', title: 'Burnout Self-Assessment & Recovery Workbook', desc: 'A 30-question burnout assessment, a 4-week recovery plan, and daily check-in templates.', pages: 12, ep: 'Wellbeing Series', bg: 'linear-gradient(135deg,#831843,#DB2777,#F9A8D4)', tags: ['burnout', 'workbook', 'recovery', 'mental health'] },
      { type: 'guide', icon: '🧘', title: 'Mindfulness for Ambitious Women — A Practical Guide', desc: 'Evidence-based mindfulness techniques adapted for women managing careers, study, and personal goals.', pages: 10, ep: 'Wellbeing Series', bg: 'linear-gradient(135deg,#4A044E,#9333EA,#E879F9)', tags: ['mindfulness', 'guide', 'wellbeing', 'stress'] },
      { type: 'toolkit', icon: '🛡️', title: 'The Imposter Syndrome Toolkit', desc: 'Confidence audit, cognitive reframing exercises, and affirmations used by our guests to overcome imposter syndrome.', pages: 8, ep: 'All Episodes', bg: 'linear-gradient(135deg,#3B0764,#9333EA,#D8B4FE)', tags: ['imposter syndrome', 'confidence', 'toolkit', 'psychology'] },
    ]
  },
  {
    id: 'creative', emoji: '🎨', name: 'Creative Arts & Media', sub: 'Design · Writing · Film & TV · Music · Fashion · Journalism',
    color: '#7C2D12', subfields: ['All', 'Design', 'Writing', 'Film & TV', 'Music', 'Fashion', 'Journalism'],
    resources: [
      { type: 'guide', icon: '🎨', title: 'Breaking Into the Creative Industry — A Realistic Guide', desc: 'The truth about creative careers: income, portfolios, pitching, and building a sustainable creative practice.', pages: 14, ep: 'Creative Series', bg: 'linear-gradient(135deg,#431407,#C2410C,#FB923C)', tags: ['creative', 'design', 'career', 'portfolio'] },
      { type: 'template', icon: '🖼️', title: 'Creative Portfolio Template — What to Include', desc: 'A checklist and framework for building your first professional portfolio across design, writing, film, and more.', pages: 6, ep: 'Creative Series', bg: 'linear-gradient(135deg,#7C2D12,#EA580C,#FED7AA)', tags: ['portfolio', 'template', 'creative', 'design'] },
      { type: 'reading', icon: '📖', title: 'Creative Reading List — Books Every Aspiring Artist Should Read', desc: 'From "Steal Like an Artist" to "Big Magic" — curated recommendations from BBG\'s creative guests.', pages: 5, ep: 'All Episodes', bg: 'linear-gradient(135deg,#292524,#78716C,#D6D3D1)', tags: ['books', 'reading', 'creative', 'art'] },
      { type: 'script', icon: '✉️', title: 'Creative Freelance Rate-Setting & Pitch Script', desc: 'How to charge your worth: rate calculator, email scripts for negotiating freelance projects, and a pitch template.', pages: 8, ep: 'Creative Series', bg: 'linear-gradient(135deg,#831843,#EC4899,#FBCFE8)', tags: ['freelance', 'rates', 'script', 'creative', 'negotiation'] },
    ]
  },
  {
    id: 'finance', emoji: '💰', name: 'Finance & Wealth', sub: 'Personal Finance · Investment · Banking · Accounting · Fintech',
    color: '#0C4A6E', subfields: ['All', 'Personal Finance', 'Investment', 'Banking', 'Accounting', 'Fintech'],
    resources: [
      { type: 'pdf', icon: '💰', title: 'Money Mindsets — EP. 04 Full Insight PDF', desc: 'Afnan Khalifa\'s complete framework for building wealth, key takeaways, and a personal finance action plan.', pages: 8, ep: 'EP. 04', bg: 'linear-gradient(135deg,#082F49,#0C4A6E,#0EA5E9)', tags: ['finance', 'money', 'wealth', 'afnan'] },
      { type: 'salary', icon: '📊', title: 'Women in Finance Salary Report 2025', desc: 'Salary benchmarks across investment banking, accounting, fintech, and insurance — with negotiation tips.', pages: 24, ep: 'Research', bg: 'linear-gradient(135deg,#0C4A6E,#0284C7,#38BDF8)', tags: ['salary', 'finance', 'banking', 'investment'] },
      { type: 'worksheet', icon: '📓', title: 'Personal Finance Starter Workbook', desc: 'Budgeting templates, debt tracker, savings goal calculator, and a step-by-step guide to your first investment.', pages: 16, ep: 'Finance Series', bg: 'linear-gradient(135deg,#134E4A,#0F766E,#2DD4BF)', tags: ['personal finance', 'budget', 'workbook', 'investment'] },
      { type: 'guide', icon: '📈', title: 'How to Break Into Investment Banking — A Guide for Women', desc: 'The insider\'s guide to landing your first role in investment banking, with real advice from finance professionals.', pages: 18, ep: 'Finance Series', bg: 'linear-gradient(135deg,#082F49,#0369A1,#0EA5E9)', tags: ['investment banking', 'guide', 'career', 'finance'] },
      { type: 'template', icon: '📋', title: 'Finance CV Template — Stand Out on the Trading Floor', desc: 'A sleek, recruiter-approved CV template for finance roles, with a real example and cover letter framework.', pages: 4, ep: 'Finance Series', bg: 'linear-gradient(135deg,#0F172A,#1E3A5F,#3B82F6)', tags: ['finance', 'cv', 'template', 'banking'] },
    ]
  },
  {
    id: 'health', emoji: '🏥', name: 'Healthcare & Medicine', sub: 'Medicine · Nursing · Public Health · Medical Research · Pharmacy',
    color: '#064E3B', subfields: ['All', 'Medicine', 'Nursing', 'Public Health', 'Research', 'Pharmacy'],
    resources: [
      { type: 'guide', icon: '🩺', title: 'Medicine as a Career — What Nobody Tells You', desc: 'The full picture: medical school applications, junior doctor life, specialisation, and the realities women face in medicine.', pages: 16, ep: 'Healthcare Series', bg: 'linear-gradient(135deg,#022C22,#065F46,#34D399)', tags: ['medicine', 'doctor', 'guide', 'career', 'health'] },
      { type: 'template', icon: '📝', title: 'Medical School Personal Statement Template', desc: 'A structured personal statement framework with prompts, word counts, and example openings for medical applications.', pages: 5, ep: 'Healthcare Series', bg: 'linear-gradient(135deg,#064E3B,#0F766E,#6EE7B7)', tags: ['medical school', 'template', 'application', 'statement'] },
      { type: 'reading', icon: '📚', title: 'Healthcare Reading List — Curated by Our Medical Guests', desc: 'The books, journals and documentaries every aspiring healthcare professional should engage with.', pages: 6, ep: 'All Episodes', bg: 'linear-gradient(135deg,#022C22,#065F46,#10B981)', tags: ['healthcare', 'reading', 'books', 'medicine'] },
    ]
  },
  {
    id: 'education', emoji: '📚', name: 'Education & Teaching', sub: 'Teaching · Academic Research · EdTech · Higher Education · Tutoring',
    color: '#4C1D95', subfields: ['All', 'Teaching', 'Research', 'EdTech', 'Higher Education'],
    resources: [
      { type: 'guide', icon: '🏫', title: 'A Career in Education — All Your Options', desc: 'From classroom teaching to EdTech, curriculum design and academia — a complete overview of education career paths.', pages: 12, ep: 'Education Series', bg: 'linear-gradient(135deg,#2E1065,#6B21A8,#A855F7)', tags: ['education', 'teaching', 'career', 'guide'] },
      { type: 'worksheet', icon: '📓', title: 'Goal Setting Workbook for Students & Graduates', desc: 'A 90-day goal-setting framework with weekly check-ins, habit tracking, and reflection prompts.', pages: 14, ep: 'All Episodes', bg: 'linear-gradient(135deg,#3B0764,#7C3AED,#DDD6FE)', tags: ['goals', 'workbook', 'students', 'planning'] },
      { type: 'script', icon: '✉️', title: 'Networking Email Templates for Students', desc: '7 done-for-you email templates: cold outreach, LinkedIn connection requests, mentorship asks, and follow-ups.', pages: 6, ep: 'All Episodes', bg: 'linear-gradient(135deg,#1E1B4B,#4338CA,#A5B4FC)', tags: ['networking', 'email', 'templates', 'students'] },
    ]
  },
];

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
};

export default function ResourcesPage({ onNavChange, onShowToast }) {
  const { resources: dbFields, loading, submitForm } = useApp();
  const fields = dbFields.length > 0 ? dbFields : FIELDS;

  const [activeType, setActiveType] = useState('all');
  const [activeField, setActiveField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
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
    try {
      await submitForm('community', { email: newsletterEmail });
      if (onShowToast) {
        onShowToast('✉️', 'Subscribed!', 'Welcome to the BBG Resource newsletter!');
      }
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
      if (onShowToast) {
        onShowToast('❌', 'Error', err.message || 'Subscription failed.');
      }
    }
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
    return ALL_RESOURCES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      r.fieldName.toLowerCase().includes(q)
    ).slice(0, 6);
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
    // 3. Matches global search query
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = q === '' ||
      r.title.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      fieldName.toLowerCase().includes(q);
    // 4. Matches category-specific subfield tab
    const activeSub = subfieldFilters[fieldId] || 'All';
    const matchSubfield = activeSub === 'All' || r.tags.some(t => t.toLowerCase().includes(activeSub.toLowerCase()));

    return matchType && matchField && matchSearch && matchSubfield;
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
    <div className="resources-page-container" style={{ background: '#0A0414', minHeight: '100vh', color: '#fff' }}>
      {/* Back to Home Button */}
      <button className="back-nav" onClick={() => onNavChange('home')} style={{ border: 'none', cursor: 'pointer' }}>
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to BBG
      </button>

      {/* ── HERO ── */}
      <section className="hero" style={{
        minHeight: '480px',
        background: 'linear-gradient(160deg, #0A0414 0%, #1A0D35 40%, #2D1060 70%, #0A0414 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px 24px 60px'
      }}>
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

        <div className="hero__inner" style={{
          display: 'block',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}>
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
          }}>📚 Resource Library</div>

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

          <p className="hero__sub" style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '36px',
            maxWidth: '580px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.7
          }}>Episode PDFs, career guides, templates, reading lists, salary reports and more — all free, all curated from our guest experts across every field.</p>

          {/* Search bar */}
          <div className="search-wrap" ref={searchWrapRef} style={{
            maxWidth: '620px',
            margin: '0 auto 40px',
            position: 'relative'
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
                overflow: 'hidden',
                zIndex: 200,
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
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>48</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Resources</span>
            </div>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative', borderLeft: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>28</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Episode PDFs</span>
            </div>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative', borderLeft: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>8</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Career Fields</span>
            </div>
            <div className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '16px 12px', position: 'relative', borderLeft: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span className="hero-stat__num" style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 900, color: '#FFE100', display: 'block', lineHeight: 1, marginBottom: '4px' }}>12</span>
              <span className="hero-stat__lbl" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Templates</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ── */}
      <div className="filter-bar" id="filterBar">
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
            <button className={`field-chip ${activeField === 'stem' ? 'active' : ''}`} data-field="stem" onClick={() => setActiveField('stem')}>
              🔬 STEM
            </button>
            <button className={`field-chip ${activeField === 'business' ? 'active' : ''}`} data-field="business" onClick={() => setActiveField('business')}>
              🚀 Entrepreneurship
            </button>
            <button className={`field-chip ${activeField === 'law' ? 'active' : ''}`} data-field="law" onClick={() => setActiveField('law')}>
              ⚖️ Law &amp; Justice
            </button>
            <button className={`field-chip ${activeField === 'mental' ? 'active' : ''}`} data-field="mental" onClick={() => setActiveField('mental')}>
              🌸 Mental Health
            </button>
            <button className={`field-chip ${activeField === 'creative' ? 'active' : ''}`} data-field="creative" onClick={() => setActiveField('creative')}>
              🎨 Creative Arts
            </button>
            <button className={`field-chip ${activeField === 'finance' ? 'active' : ''}`} data-field="finance" onClick={() => setActiveField('finance')}>
              💰 Finance
            </button>
            <button className={`field-chip ${activeField === 'health' ? 'active' : ''}`} data-field="health" onClick={() => setActiveField('health')}>
              🏥 Healthcare
            </button>
            <button className={`field-chip ${activeField === 'education' ? 'active' : ''}`} data-field="education" onClick={() => setActiveField('education')}>
              📚 Education
            </button>
          </div>

          <div className="results-count" id="resultsCount">
            Showing <strong>{totalVisible}</strong> resources
          </div>
        </div>
      </div>

      {/* ── FEATURED WEEKLY RESOURCES (dark theme) ── */}
      <div className="featured-section">
        <div className="featured-section__inner">
          <div className="section-label">
            <span className="section-label__text">⭐ Featured This Week</span>
            <div className="section-label__line"></div>
          </div>
          <div className="featured-grid">

            {/* BIG CARD */}
            <div className="feat-card-big" onClick={() => handleDownload("Girls' Education Career Playbook")}>
              <div className="feat-card-big__cover" style={{ background: 'linear-gradient(155deg,#3B0764,#7C3AED,#EC4899)' }}>
                <span className="feat-card-big__badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Episode PDF</span>
                <span className="feat-card-big__new">NEW</span>
                <svg viewBox="0 0 200 140" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .2 }}>
                  <circle cx="160" cy="30" r="60" fill="white" />
                  <circle cx="40" cy="110" r="40" fill="white" />
                  <rect x="70" y="50" width="60" height="80" rx="8" fill="white" opacity=".3" />
                  <rect x="80" y="30" width="40" height="10" rx="5" fill="white" opacity=".4" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '52px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}>🎓</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: 'rgba(255,255,255,0.7)' }}>12-Page Deep Dive</div>
                </div>
              </div>
              <div className="feat-card-big__body" style={{ textAlign: 'left' }}>
                <div className="feat-card-big__field">🔬 STEM · Education</div>
                <div className="feat-card-big__title">Girls' Education Career Playbook — Dr. Sheen Gurrib</div>
                <div className="feat-card-big__desc">Complete episode breakdown with key insights, career action steps, resource recommendations, and a personal reflection worksheet. Based on EP. 01 with Oxford &amp; Cambridge graduate Dr. Sheen Gurrib.</div>
                <div className="feat-card-big__footer">
                  <span className="feat-card-big__ep">EP. 01 · 18 min listen</span>
                  <button className="dl-btn" onClick={(e) => { e.stopPropagation(); handleDownload("Girls' Education Career Playbook"); }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download Free
                  </button>
                </div>
              </div>
            </div>

            {/* SMALL 1 */}
            <div className="feat-card-sm" onClick={() => handleDownload("Women in Finance Salary Report 2025")}>
              <div className="feat-card-sm__cover" style={{ background: 'linear-gradient(155deg,#082F49,#0369A1,#38BDF8)' }}>
                <svg viewBox="0 0 200 130" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .15 }}>
                  <rect x="10" y="90" width="25" height="35" fill="white" rx="3" />
                  <rect x="45" y="70" width="25" height="55" fill="white" rx="3" />
                  <rect x="80" y="45" width="25" height="80" fill="white" rx="3" />
                  <rect x="115" y="25" width="25" height="100" fill="white" rx="3" />
                  <rect x="150" y="10" width="25" height="115" fill="white" rx="3" />
                  <path d="M22 88 L57 68 L92 43 L127 23 L162 8" stroke="white" strokeWidth="3" opacity=".5" />
                </svg>
                <div className="feat-card-sm__icon">📊</div>
              </div>
              <div className="feat-card-sm__body" style={{ textAlign: 'left' }}>
                <div className="feat-card-sm__type">Salary Report · Finance</div>
                <div className="feat-card-sm__title">Women in Finance — Salary &amp; Progression Report 2025</div>
                <div className="feat-card-sm__desc">Real salary data across banking, investment, fintech and accounting — broken down by experience level and region.</div>
                <div className="feat-card-sm__footer">
                  <span className="feat-card-sm__pages">24 pages</span>
                  <button className="dl-btn" style={{ fontSize: '11px', height: '32px', padding: '0 12px' }} onClick={(e) => { e.stopPropagation(); handleDownload("Women in Finance Salary Report 2025"); }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Free PDF
                  </button>
                </div>
              </div>
            </div>

            {/* SMALL 2 */}
            <div className="feat-card-sm" onClick={() => handleDownload("Tech Interview Prep Kit")}>
              <div className="feat-card-sm__cover" style={{ background: 'linear-gradient(155deg,#022C22,#065F46,#34D399)' }}>
                <svg viewBox="0 0 200 130" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .12 }}>
                  <rect x="20" y="20" width="160" height="90" rx="10" fill="white" />
                  <rect x="40" y="40" width="120" height="10" rx="3" fill="#000" />
                  <rect x="40" y="60" width="80" height="10" rx="3" fill="#000" />
                  <rect x="40" y="80" width="100" height="10" rx="3" fill="#000" />
                </svg>
                <div className="feat-card-sm__icon">💻</div>
              </div>
              <div className="feat-card-sm__body" style={{ textAlign: 'left' }}>
                <div className="feat-card-sm__type">Toolkit · STEM</div>
                <div className="feat-card-sm__title">Women in Tech Interview Prep Kit</div>
                <div className="feat-card-sm__desc">50 common tech interview questions, STAR method templates, and confidence-building strategies from our STEM guests.</div>
                <div className="feat-card-sm__footer">
                  <span className="feat-card-sm__pages">18 pages</span>
                  <button className="dl-btn" style={{ fontSize: '11px', height: '32px', padding: '0 12px' }} onClick={(e) => { e.stopPropagation(); handleDownload("Tech Interview Prep Kit"); }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Free PDF
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN RESOURCES GRID BY FIELDS ── */}
      <div className="page-body" style={{ background: '#F7F3FF', minHeight: '60vh' }}>
        <style>{`
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
          .resources-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
            max-width: none !important;
            margin: 32px 0 0 !important;
            padding: 0 !important;
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
            .resources-grid{grid-template-columns:repeat(3,1fr)}
            .coming-grid{grid-template-columns:repeat(2,1fr)}
            .types-grid{grid-template-columns:repeat(2,1fr)}
            .featured-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}
            .feat-card-big{grid-column:1/-1}
          }
          @media(max-width:768px){
            .featured-grid{grid-template-columns:1fr}
            .resources-grid{grid-template-columns:repeat(2,1fr);gap:14px}
            .coming-grid{grid-template-columns:repeat(2,1fr)}
            .types-grid{grid-template-columns:repeat(2,1fr)}
            .resources-section{padding:36px 16px 60px}
          }
          @media(max-width:480px){
            .resources-grid{grid-template-columns:1fr}
            .coming-grid{grid-template-columns:1fr}
            .types-grid{grid-template-columns:1fr 1fr}
          }
        `}</style>
        <div className="resources-section">
          {fields.map((f) => {
            const showField = activeField === 'all' || activeField === f.id;

            // Filter resources of this category
            const visibleResources = f.resources.filter(r => matchesFilters(r, f.id, f.name));

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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--purple-mid)', background: 'rgba(147,51,234,0.07)', border: '1px solid rgba(147,51,234,0.14)', padding: '4px 14px', borderRadius: '999px', marginBottom: '14px' }}>What's Inside</div>
            <h2 style={{ fontFamily: 'var(--font-d)', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--black)', letterSpacing: '-0.02em' }}>8 Types of Resources,<br />All Free to Download</h2>
          </div>
          <div className="types-grid" style={{ marginTop: '36px' }}>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(147,51,234,0.1)' }}>📄</div>
              <div className="type-card__name">Episode PDFs</div>
              <div className="type-card__desc">Key takeaways, guest quotes, action items and reflection prompts for every episode.</div>
              <div className="type-card__count" style={{ background: 'rgba(147,51,234,0.08)', color: 'var(--purple-mid)' }}>28 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(234,179,8,0.1)' }}>🗺️</div>
              <div className="type-card__name">Career Guides</div>
              <div className="type-card__desc">Step-by-step roadmaps to break into each field — qualifications, timelines, first steps.</div>
              <div className="type-card__count" style={{ background: 'rgba(234,179,8,0.08)', color: '#92700A' }}>8 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(236,72,153,0.1)' }}>📝</div>
              <div className="type-card__name">Templates</div>
              <div className="type-card__desc">Field-specific CV/resume templates, cover letter frameworks, and LinkedIn bio builders.</div>
              <div className="type-card__count" style={{ background: 'rgba(236,72,153,0.08)', color: '#BE185D' }}>12 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(16,185,129,0.1)' }}>📓</div>
              <div className="type-card__name">Workbooks</div>
              <div className="type-card__desc">Goal-setting workbooks, self-assessment guides, and quarterly reflection journals.</div>
              <div className="type-card__count" style={{ background: 'rgba(16,185,129,0.08)', color: '#065F46' }}>6 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(249,115,22,0.1)' }}>📚</div>
              <div className="type-card__name">Reading Lists</div>
              <div className="type-card__desc">Curated books, podcasts, and courses recommended directly by our guest experts.</div>
              <div className="type-card__count" style={{ background: 'rgba(249,115,22,0.08)', color: '#9A3412' }}>8 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(99,102,241,0.1)' }}>🧰</div>
              <div className="type-card__name">Toolkits</div>
              <div className="type-card__desc">Interview prep kits, skill checklists, and everything you need to land your first role.</div>
              <div className="type-card__count" style={{ background: 'rgba(99,102,241,0.08)', color: '#3730A3' }}>6 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(6,182,212,0.1)' }}>📊</div>
              <div className="type-card__name">Salary Reports</div>
              <div className="type-card__desc">Real earnings data across industries — so you know your worth before any negotiation.</div>
              <div className="type-card__count" style={{ background: 'rgba(6,182,212,0.08)', color: '#155E75' }}>4 available</div>
            </div>
            <div className="type-card">
              <div className="type-card__icon-wrap" style={{ background: 'rgba(244,114,182,0.1)' }}>✉️</div>
              <div className="type-card__name">Scripts &amp; Emails</div>
              <div className="type-card__desc">Networking email templates, LinkedIn outreach scripts, and mentorship request messages.</div>
              <div className="type-card__count" style={{ background: 'rgba(244,114,182,0.08)', color: '#9D174D' }}>6 available</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMING SOON ── */}
      <div className="coming-section">
        <div className="coming-section__inner" style={{ textAlign: 'left' }}>
          <div className="section-label">
            <span className="section-label__text">🔒 Coming Soon</span>
            <div className="section-label__line"></div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#fff', fontWeight: 700, marginTop: '4px', marginBottom: '4px' }}>Resources in the Pipeline</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '0' }}>Notify me when they drop.</p>

          <div className="coming-grid">
            <div className="coming-card">
              <div className="coming-card__lock">🏛️</div>
              <div className="coming-card__title">Breaking Into Law — The Complete Playbook</div>
              <div className="coming-card__desc">Bar exam timelines, law school application guide, and networking scripts for aspiring lawyers.</div>
              <div className="coming-card__tag">⚖️ Law · Q2 2026</div>
              <button className="coming-card__notify" onClick={() => handleNotifyMe("Breaking Into Law")}>🔔 Notify Me</button>
            </div>
            <div className="coming-card">
              <div className="coming-card__lock">🎙️</div>
              <div className="coming-card__title">Podcast Ep. 05 — Healthcare Career Guide</div>
              <div className="coming-card__desc">Full insight PDF for our upcoming episode featuring a senior NHS consultant and medical researcher.</div>
              <div className="coming-card__tag">🏥 Healthcare · Coming June</div>
              <button className="coming-card__notify" onClick={() => handleNotifyMe("Ep. 05 Healthcare Guide")}>🔔 Notify Me</button>
            </div>
            <div className="coming-card">
              <div className="coming-card__lock">💡</div>
              <div className="coming-card__title">Founder's Toolkit — Starting From Zero</div>
              <div className="coming-card__desc">Business model canvas, pitch deck templates, and a step-by-step guide to validating your idea.</div>
              <div className="coming-card__tag">🚀 Entrepreneurship · Q2 2026</div>
              <button className="coming-card__notify" onClick={() => handleNotifyMe("Founder's Toolkit")}>🔔 Notify Me</button>
            </div>
            <div className="coming-card">
              <div className="coming-card__lock">🎨</div>
              <div className="coming-card__title">Creative Industry Rate Card &amp; Negotiation Guide</div>
              <div className="coming-card__desc">Freelance rates, agency salaries, and scripts for negotiating your creative fees like a pro.</div>
              <div className="coming-card__tag">🎨 Creative · Q3 2026</div>
              <button className="coming-card__notify" onClick={() => handleNotifyMe("Creative Industry Rate Card")}>🔔 Notify Me</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER SIGNUP ── */}
      <div className="newsletter">
        <div className="newsletter__inner">
          <h2 className="newsletter__h2">New Resources,<br />Every Week</h2>
          <p className="newsletter__sub">Get notified the moment we drop a new PDF, guide, or template — straight to your inbox.</p>
          <form className="newsletter__form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="newsletter__input"
              placeholder="your@email.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter__btn">Subscribe Free</button>
          </form>
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
