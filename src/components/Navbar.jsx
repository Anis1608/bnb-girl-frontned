import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar({ onSearchOpen, activeNav, onNavChange }) {
  const { cms } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLinkClick = (e, nav) => {
    e.preventDefault();
    if (onNavChange) {
      onNavChange(nav);
    }
    closeDrawer();
  };

  return (
    <>
      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <linearGradient id="eyeG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>
      </svg>

      {/* ══ DESKTOP NAV ══ */}
      <nav className="bbg-nav">
        <a href="/" className="bbg-logo" onClick={(e) => handleLinkClick(e, 'home')}>
          <img src={cms.cms_navbar_logo || "https://bnbgirl.com/wp-content/uploads/2026/03/logo-BjMcg-i3__2___1_-removebg-preview.png"} alt="Bold & Brilliant Girls" draggable="false" />
        </a>
        <div className="bbg-links">
          <a href="/" className={activeNav === 'home' ? 'bbg-on' : ''} onClick={(e) => handleLinkClick(e, 'home')}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </a>
          <a href="/about-us" className={activeNav === 'about' ? 'bbg-on' : ''} onClick={(e) => handleLinkClick(e, 'about')}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            About Us
          </a>
          <a href="/episodes" className={activeNav === 'episodes' ? 'bbg-on' : ''} onClick={(e) => handleLinkClick(e, 'episodes')}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            Episodes
          </a>
          <a href="/resources" className={activeNav === 'resources' ? 'bbg-on' : ''} onClick={(e) => handleLinkClick(e, 'resources')}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Resources
          </a>
          <a href="/join-us" className={activeNav === 'joinus' ? 'bbg-on' : ''} onClick={(e) => handleLinkClick(e, 'joinus')}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Join Us
          </a>
          
          <div className="bbg-sep"></div>

          <a href="/find-your-path" className={`link-path ${activeNav === 'quiz' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'quiz')}>
            <span className="fp-ring">
              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            Find Your Path
          </a>
          <a href="/#mentorship" className={`pill-gold ${activeNav === 'mentorship' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'mentorship')}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Apply for Mentorship
          </a>
        </div>
        <div></div>
      </nav>

      {/* ══ MOBILE TOP BAR ══ */}
      <div className="bbg-mob-bar">
        <a href="/" className="bbg-logo bbg-logo-sm" onClick={(e) => handleLinkClick(e, 'home')}>
          <img src={cms.cms_navbar_logo || "https://bnbgirl.com/wp-content/uploads/2026/03/logo-BjMcg-i3__2___1_-removebg-preview.png"} alt="Bold & Brilliant Girls" draggable="false" />
        </a>
        <button className={`bbg-ham ${isDrawerOpen ? 'is-open' : ''}`} onClick={toggleDrawer} aria-label="Menu">
          <div className="bbg-bar"></div>
          <div className="bbg-bar"></div>
          <div className="bbg-bar"></div>
        </button>
      </div>

      {/* ══ MOBILE DRAWER ══ */}
      <div className={`bbg-drawer ${isDrawerOpen ? 'is-open' : ''}`}>
        <div className="bbg-drw-glow"></div>
        <div className="bbg-drw-inner">
          <a href="/" className={`bbg-drw-link ${activeNav === 'home' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'home')}>
            <div className="bbg-drw-left">
              <svg className="bbg-drw-icon" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="bbg-drw-label">Home</span>
            </div>
            <span className="bbg-drw-arr">→</span>
          </a>
          <a href="/about-us" className={`bbg-drw-link ${activeNav === 'about' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'about')}>
            <div className="bbg-drw-left">
              <svg className="bbg-drw-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <span className="bbg-drw-label">About Us</span>
            </div>
            <span className="bbg-drw-arr">→</span>
          </a>
          <a href="/episodes" className={`bbg-drw-link ${activeNav === 'episodes' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'episodes')}>
            <div className="bbg-drw-left">
              <svg className="bbg-drw-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="#9b72cf" stroke="none" />
              </svg>
              <span className="bbg-drw-label">Episodes</span>
            </div>
            <span className="bbg-drw-arr">→</span>
          </a>
          <a href="/resources" className={`bbg-drw-link ${activeNav === 'resources' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'resources')}>
            <div className="bbg-drw-left">
              <svg className="bbg-drw-icon" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="bbg-drw-label">Resources</span>
            </div>
            <span className="bbg-drw-arr">→</span>
          </a>
          <a href="/join-us" className={`bbg-drw-link ${activeNav === 'joinus' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'joinus')}>
            <div className="bbg-drw-left">
              <svg className="bbg-drw-icon" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="bbg-drw-label">Join Us</span>
            </div>
            <span className="bbg-drw-arr">→</span>
          </a>
          <a href="/find-your-path" className={`bbg-drw-link ${activeNav === 'quiz' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'quiz')}>
            <div className="bbg-drw-left">
              <svg className="bbg-drw-icon" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="bbg-drw-label">
                Find Your Path <span className="bbg-drw-badge">QUIZ</span>
              </span>
            </div>
            <span className="bbg-drw-arr">→</span>
          </a>
          <div className="drw-cta-wrap">
            <a href="/#mentorship" className="bbg-drw-cta-gold" onClick={(e) => handleLinkClick(e, 'mentorship')}>
              <svg style={{ width: '16px', height: '16px', fill: 'none', stroke: '#92600a', strokeWidth: 1.8, flexShrink: 0 }} viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Apply for Mentorship
            </a>
            <a href="/find-your-path" className="bbg-drw-cta-path" onClick={(e) => handleLinkClick(e, 'quiz')}>
              <svg style={{ width: '16px', height: '16px', fill: 'none', stroke: '#6B21A8', strokeWidth: 1.8, flexShrink: 0 }} viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Find Your Path
            </a>
          </div>
        </div>
      </div>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav className="bbg-bot">
        <div className="bbg-bot-inner">
          <a href="/" className={`bbg-bot-item ${activeNav === 'home' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'home')}>
            <svg className="bot-icon" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="bbg-bot-lbl">Home</span>
          </a>
          <a href="/episodes" className={`bbg-bot-item ${activeNav === 'episodes' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'episodes')}>
            <svg className="bot-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            <span className="bbg-bot-lbl">Episodes</span>
          </a>
          <a href="/find-your-path" className={`bbg-bot-item ${activeNav === 'quiz' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'quiz')}>
            <div className="bbg-eye-wrap">
              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="url(#eyeG)" fill="none" />
                <circle cx="12" cy="12" r="3" stroke="url(#eyeG)" fill="none" />
              </svg>
            </div>
            <span className="bbg-bot-lbl">Find Path</span>
          </a>
          <a href="/join-us" className={`bbg-bot-item ${activeNav === 'joinus' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'joinus')}>
            <svg className="bot-icon" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="bbg-bot-lbl">Join Us</span>
          </a>
          <a href="/#mentorship" className={`bbg-bot-item ${activeNav === 'mentorship' ? 'bbg-on' : ''}`} onClick={(e) => handleLinkClick(e, 'mentorship')}>
            <svg className="bot-icon" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="bbg-bot-lbl">Apply</span>
          </a>
        </div>
      </nav>
    </>
  );
}
