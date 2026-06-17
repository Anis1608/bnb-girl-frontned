import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Community({ onShowToast }) {
  const { submitForm } = useApp();
  const [emailNL, setEmailNL] = useState('');
  const [nlSubscribed, setNlSubscribed] = useState(false);

  const handleNLSubmit = async (e) => {
    e.preventDefault();
    if (!emailNL.trim()) return;

    const emailToSubmit = emailNL;

    // Optimistically update UI state immediately
    setNlSubscribed(true);
    setEmailNL('');
    if (onShowToast) {
      onShowToast('✉️', 'Subscribed!', 'Welcome to the BBG newsletter!');
    }

    // Trigger API request in the background
    submitForm('community', { email: emailToSubmit }).catch(err => {
      console.error('Newsletter background subscription error in Community:', err);
      if (onShowToast) {
        onShowToast('❌', 'Error', 'Background newsletter sync failed.');
      }
    });
  };

  return (
    <>
      {/* ══ NEWSLETTER / COMMUNITY SECTION ══ */}
      <section id="community" style={{ background: 'linear-gradient(135deg,#0F0A1E,#1E1035)', padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
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
