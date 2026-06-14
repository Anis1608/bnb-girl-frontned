import React, { useState } from 'react';

export default function Community({ onShowToast }) {
  const [emailMain, setEmailMain] = useState('');
  const [emailNL, setEmailNL] = useState('');
  const [nlSubscribed, setNlSubscribed] = useState(false);

  const handleMainJoin = (e) => {
    e.preventDefault();
    if (!emailMain.trim()) return;
    onShowToast('🎉', 'Welcome!', 'You joined BBG!');
    setEmailMain('');
  };

  const handleNLSubmit = (e) => {
    e.preventDefault();
    if (!emailNL.trim()) return;
    setNlSubscribed(true);
    setEmailNL('');
  };

  return (
    <>
      {/* ══ COMMUNITY SECTION ══ */}
      <section className="community-section" id="community">
        <div className="community__content">
          <h2 className="community__counter reveal visible">
            Join <span className="gold">50+</span> Bold &amp; Brilliant Women
          </h2>
          <p className="community__sub reveal visible">A community that celebrates ambition and lifts each other up.</p>
          <div className="community__avatars reveal visible">
            <div className="community__avatar" style={{ background: 'linear-gradient(135deg,#6B21A8,#EC4899)' }}>A</div>
            <div className="community__avatar" style={{ background: 'linear-gradient(135deg,#9333EA,#F97316)' }}>J</div>
            <div className="community__avatar" style={{ background: 'linear-gradient(135deg,#EC4899,#EAB308)' }}>M</div>
            <div className="community__avatar" style={{ background: 'linear-gradient(135deg,#F97316,#6B21A8)' }}>S</div>
            <div className="community__avatar" style={{ background: 'linear-gradient(135deg,#EAB308,#EC4899)' }}>P</div>
          </div>
          <form className="community__form reveal visible" onSubmit={handleMainJoin}>
            <input
              type="email"
              className="community__input"
              placeholder="Your email address…"
              value={emailMain}
              onChange={(e) => setEmailMain(e.target.value)}
              required
            />
            <button type="submit" className="community__submit">
              Join
            </button>
          </form>
          <div className="community__socials reveal visible">
            <a href="https://instagram.com/bnbgirls.podcast" target="_blank" rel="noopener noreferrer" className="community__social" aria-label="Instagram">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@BoldandBrilliantgirl" target="_blank" rel="noopener noreferrer" className="community__social" aria-label="YouTube">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER SECTION ══ */}
      <section style={{ background: 'linear-gradient(135deg,#0F0A1E,#1E1035)', padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(147,51,234,.08) 1px,transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,.1)' }}></div>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>
              Bold &amp; Brilliant Girls
            </span>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,.1)' }}></div>
          </div>
          <div className="newsletter-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginTop: '32px' }}>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#EC4899', marginBottom: '12px' }}>
                Weekly Edition
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '16px' }}>
                Join the <em style={{ fontStyle: 'italic', color: '#FEF08A' }}>Conversation.</em>
              </h2>
              <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: '16px' }}>
                Career stories · Episode drops · Mentorship insights · Real talk. Every Thursday.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.68rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', background: 'rgba(147,51,234,.12)', border: '1px solid rgba(147,51,234,.2)', color: '#D8B4FE' }}>
                  Business
                </span>
                <span style={{ fontSize: '.68rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.2)', color: '#FDA4AF' }}>
                  Mental Health
                </span>
                <span style={{ fontSize: '.68rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', background: 'rgba(234,179,8,.1)', border: '1px solid rgba(234,179,8,.2)', color: '#FDE68A' }}>
                  Finance
                </span>
                <span style={{ fontSize: '.68rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', color: '#FDBA74' }}>
                  Careers
                </span>
              </div>
            </div>
            <div>
              {!nlSubscribed ? (
                <form id="homeNLForm" onSubmit={handleNLSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    id="homeNLEmail"
                    value={emailNL}
                    onChange={(e) => setEmailNL(e.target.value)}
                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '.95rem', outline: 'none' }}
                  />
                  <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg,#6B21A8 0%,#9333EA 25%,#EC4899 55%,#F97316 80%,#EAB308 100%)', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '.85rem', fontWeight: 700, letterSpacing: '.04em', border: 'none', cursor: 'pointer' }}>
                    Subscribe Free →
                  </button>
                  <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.25)', textAlign: 'center', margin: 0 }}>
                    No spam. Unsubscribe any time. 500+ women already in.
                  </p>
                </form>
              ) : (
                <div id="homeNLSuccess" style={{ display: 'block', textAlign: 'center', padding: '20px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💜</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: '#fff', fontWeight: 700 }}>
                    You're in!
                  </div>
                  <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>
                    Check your inbox Thursday.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
