import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const TOPICS = [
  { e: '💻', l: 'Technology' },
  { e: '🎨', l: 'Arts' },
  { e: '⚖️', l: 'Law' },
  { e: '💰', l: 'Finance' },
  { e: '🔬', l: 'Medicine' },
  { e: '🧠', l: 'Psychology' },
  { e: '🚀', l: 'Entrepreneurship' },
  { e: '🎬', l: 'Media' },
  { e: '🏃', l: 'Sport Science' },
  { e: '🎵', l: 'Music' },
  { e: '📚', l: 'Education' },
  { e: '🌱', l: 'Sustainability' }
];

export default function Hero({ onWatchNow, onFindMentor }) {
  const { stats, cms } = useApp();
  // Sparkle configuration
  const sparkles = [
    { top: '12%', left: '16%', delay: '0s' },
    { top: '28%', left: '44%', delay: '.6s' },
    { top: '68%', left: '9%', delay: '1.1s' },
    { top: '82%', left: '58%', delay: '1.6s' },
    { top: '18%', left: '77%', delay: '.4s' }
  ];

  // Mobile counter states
  const [episodesCount, setEpisodesCount] = useState(0);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);

  useEffect(() => {
    // Animate counters on load / stats fetch
    const targets = {
      episodes: stats.episodes || 8,
      mentors: stats.mentors || 10,
      community: stats.community || 100
    };
    
    const duration = 1600;
    const start = performance.now();

    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const easeVal = 1 - Math.pow(1 - p, 3); // cubic ease out
      setEpisodesCount(Math.floor(targets.episodes * easeVal));
      setMentorsCount(Math.floor(targets.mentors * easeVal));
      setCommunityCount(Math.floor(targets.community * easeVal));

      if (p < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [stats]);

  // Calculate coordinates for Desktop Circular Orbit
  const R = 200; // Radius
  const diam = R * 2;

  return (
    <section className="hero" id="home">
      {/* Background Sparkles */}
      {sparkles.map((sp, idx) => (
        <div
          key={idx}
          className="sparkle"
          style={{
            top: sp.top,
            left: sp.left,
            animationDelay: sp.delay
          }}
        />
      ))}

      <div className="hero__inner">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <div className="hero__dot"></div>{cms.cms_hero_eyebrow || "New Episode Live Now"}
          </div>
          <h1 className="hero__title" dangerouslySetInnerHTML={{ __html: cms.cms_hero_title || "Bold &amp; <em class=\"gold\">Brilliant</em> Girls" }} />
          <p className="hero__sub">
            {cms.cms_hero_subtitle || "Real stories from inspiring women across every career — so you can see what's possible for you."}
          </p>
          <div className="hero__ctas">
            <button className="btn btn--primary" onClick={onWatchNow}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                <polygon points="5 3 19 12 5 21" />
              </svg>
              {cms.cms_hero_cta_primary_text || "Watch Now"}
            </button>
            <button className="btn btn--secondary" onClick={onFindMentor}>
              {cms.cms_hero_cta_secondary_text || "Find a Mentor \u2192"}
            </button>
          </div>
          <div className="hero__social-proof">
            <div className="hero__avatars">
              <div className="hero__avatar" style={{ background: 'linear-gradient(135deg,#6B21A8,#EC4899)' }}>A</div>
              <div className="hero__avatar" style={{ background: 'linear-gradient(135deg,#EC4899,#F97316)' }}>J</div>
              <div className="hero__avatar" style={{ background: 'linear-gradient(135deg,#EAB308,#F97316)' }}>M</div>
              <div className="hero__avatar" style={{ background: 'linear-gradient(135deg,#9333EA,#EAB308)' }}>S</div>
            </div>
            <div className="hero__sp-text">
              <span className="hero__sp-stars">★★★★★</span>{cms.cms_hero_social_proof || "Loved by 50+ bold women"}
            </div>
          </div>

          {/* Mobile Only Section */}
          <div className="hero__mobile-only">
            <div className="hero__mob-cards">
              <div className="hero__mob-card">
                <span className="hero__mob-card-num">{episodesCount}+</span>
                <span className="hero__mob-card-lbl">Episodes</span>
              </div>
              <div className="hero__mob-card">
                <span className="hero__mob-card-num">{mentorsCount}+</span>
                <span className="hero__mob-card-lbl">Mentors</span>
              </div>
              <div className="hero__mob-card">
                <span className="hero__mob-card-num">{communityCount}+</span>
                <span className="hero__mob-card-lbl">Community</span>
              </div>
            </div>
            <div className="hero__mob-badge">
              <div className="hero__mob-badge-dot"></div>
              <span className="hero__mob-badge-text">🎙️ Streaming — New Episode Live</span>
            </div>
            {/* Mobile Marquee */}
            <div className="hero__topics-marquee">
              <div className="hero__topics-track">
                {[...TOPICS, ...TOPICS].map((t, idx) => (
                  <div key={idx} className="hero__topic-chip">
                    {t.e} {t.l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Hero Panel */}
        <div className="hero__panel">
          <div className="hero__float-onair">
            <div className="hero__float-onair-dot"></div>
            <span className="hero__float-onair-text">On Air</span>
          </div>

          {/* Circular Orbit Ring */}
          <div className="hero__orbit-wrap">
            <div
              className="orbit-ring"
              style={{
                width: `${diam}px`,
                height: `${diam}px`,
                margin: `-${R}px 0 0 -${R}px`,
                position: 'absolute',
                top: '50%',
                left: '50%'
              }}
            >
              {TOPICS.map((t, i) => {
                const angle = (360 / TOPICS.length) * i * (Math.PI / 180);
                const x = R + R * Math.sin(angle);
                const y = R - R * Math.cos(angle);
                return (
                  <div
                    key={i}
                    className="orbit-chip"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      position: 'absolute',
                      animation: 'chipUp 28s linear infinite'
                    }}
                  >
                    <span>{t.e}</span>
                    {t.l}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SVG Mic Container */}
          <div style={{ position: 'relative', zIndex: 15, filter: 'drop-shadow(0 0 50px rgba(147,51,234,.5)) drop-shadow(0 0 100px rgba(236,72,153,.2))' }}>
            <svg viewBox="0 0 480 580" width="440" height="540" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="bG1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9333EA" stopOpacity=".25" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="mB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E2E8F0" />
                  <stop offset="35%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B0764" />
                  <stop offset="100%" stopColor="#1E1B4B" />
                </linearGradient>
                <linearGradient id="mR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
                <linearGradient id="mS" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
                <filter id="gGlow">
                  <feGaussianBlur stdDeviation="10" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse cx="240" cy="270" rx="200" ry="200" fill="url(#bG1)">
                <animate attributeName="rx" values="185;210;185" dur="5s" repeatCount="indefinite" />
              </ellipse>
              <circle cx="240" cy="250" r="165" fill="none" stroke="rgba(147,51,234,.2)" strokeWidth="1.5" strokeDasharray="7 5">
                <animateTransform attributeName="transform" type="rotate" from="0 240 250" to="360 240 250" dur="22s" repeatCount="indefinite" />
              </circle>
              <circle cx="240" cy="250" r="205" fill="none" stroke="rgba(236,72,153,.12)" strokeWidth="1" stroke-dasharray="4 9">
                <animateTransform attributeName="transform" type="rotate" from="0 240 250" to="-360 240 250" dur="30s" repeatCount="indefinite" />
              </circle>
              <g>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-14;0,0" dur="5.5s" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite" />
                <rect x="196" y="436" width="88" height="13" rx="6" fill="#1E293B" />
                <rect x="200" y="432" width="80" height="8" rx="4" fill="#334155" />
                <rect x="232" y="346" width="16" height="90" rx="8" fill="url(#mS)" />
                <rect x="148" y="346" width="144" height="12" rx="6" fill="url(#mS)" />
                <rect x="216" y="175" width="48" height="138" rx="24" fill="url(#mB)" />
                <rect x="212" y="218" width="56" height="9" rx="4.5" fill="url(#mR)" />
                <rect x="212" y="270" width="56" height="9" rx="4.5" fill="url(#mR)" />
                <rect x="216" y="94" width="48" height="88" rx="24" fill="url(#mG)" />
                <ellipse cx="240" cy="94" rx="24" ry="12" fill="url(#mG)" />
                <line x1="226" y1="112" x2="226" y2="167" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
                <line x1="233" y1="107" x2="233" y2="170" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
                <line x1="240" y1="105" x2="240" y2="171" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
                <line x1="247" y1="107" x2="247" y2="170" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
                <line x1="254" y1="112" x2="254" y2="167" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
                <circle cx="240" cy="318" r="8" filter="url(#gGlow)">
                  <animate attributeName="r" values="5;11;5" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="fill" values="#EC4899;#F9A8D4;#EC4899" dur="1.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="240" cy="318" r="18" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeOpacity=".3">
                  <animate attributeName="r" values="14;26;14" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values=".3;0;.3" dur="1.4s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
