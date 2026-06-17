import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { cms } = useApp();
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bbgf">
      <div className="bbgf-inner">
        <div className="bbgf-top">
          <div>
             <div className="bbgf-logo-pill">
              <img
                src={cms.cms_navbar_logo || cms.cms_footer_logo || "/logo-main.png"}
                alt="Bold &amp; Brilliant Girls"
              />
            </div>
            <p className="bbgf-tagline">
              {cms.cms_footer_tagline ? (
                <span>{cms.cms_footer_tagline}</span>
              ) : (
                <>
                  <strong>Real Stories. Real Women. Real Possibilities.</strong>
                  <br />
                  Empowering the next generation of female leaders through authentic conversations and meaningful mentorship.
                </>
              )}
            </p>
            <div className="bbgf-socials">
              <a className="bbgf-soc" href={cms.cms_footer_social_insta || "https://instagram.com/bnbgirls.podcast"} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
              <a className="bbgf-soc" href={cms.cms_footer_social_yt || "https://www.youtube.com/@BoldandBrilliantgirl"} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="white" stroke="none" />
                </svg>
                YouTube
              </a>
            </div>
          </div>
          <div>
            <div className="bbgf-legal-title">Legal &amp; Portals</div>
             <div className="bbgf-legal-links">
              <Link to="/privacy-policy">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Privacy Policy
              </Link>
              <Link to="/terms-of-service">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Terms of Service
              </Link>
              <Link to="/minor-disclaimer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Minor Disclaimer
              </Link>
              <Link to="/mentor-dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Mentor Portal
              </Link>
            </div>
          </div>
        </div>
        <div className="bbgf-bottom">
          <p className="bbgf-copy" dangerouslySetInnerHTML={{ __html: cms.cms_footer_copyright || "&copy; 2026 <span>Bold &amp; Brilliant Girls Podcast</span>. Made with 💜 for every bold and brilliant girl." }} />
          <button className="bbgf-top-btn" onClick={handleScrollToTop} aria-label="Scroll to top">
            <svg viewBox="0 0 24 24">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
