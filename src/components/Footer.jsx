import React from 'react';

export default function Footer() {
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
                src="https://bnbgirl.com/wp-content/uploads/2026/03/logo-BjMcg-i3__2___1_-removebg-preview.png"
                alt="Bold &amp; Brilliant Girls"
              />
            </div>
            <p className="bbgf-tagline">
              <strong>Real Stories. Real Women. Real Possibilities.</strong>
              <br />
              Empowering the next generation of female leaders through authentic conversations and meaningful mentorship.
            </p>
            <div className="bbgf-socials">
              <a className="bbgf-soc" href="https://instagram.com/bnbgirls.podcast" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
              <a className="bbgf-soc" href="https://www.youtube.com/@BoldandBrilliantgirl" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="white" stroke="none" />
                </svg>
                YouTube
              </a>
            </div>
          </div>
          <div>
            <div className="bbgf-legal-title">Legal</div>
            <div className="bbgf-legal-links">
              <a href="https://bnbgirl.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Privacy Policy
              </a>
              <a href="https://bnbgirl.com/terms-of-service/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
        <div className="bbgf-bottom">
          <p className="bbgf-copy">
            &copy; 2026 <span>Bold &amp; Brilliant Girls Podcast</span>. Made with 💜 for every bold and brilliant girl.
          </p>
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
