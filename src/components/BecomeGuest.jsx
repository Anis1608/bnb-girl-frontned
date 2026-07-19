import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function BecomeGuest({ onShowToast }) {
  const { API_BASE } = useApp();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [pitch, setPitch] = useState('');
  const [motivation, setMotivation] = useState('');

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onShowToast('⚠️', 'Missing Info', 'Please provide your name and email.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/guest-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          job_title: jobTitle,
          organisation,
          linkedin,
          pitch,
          motivation,
          mentor_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong while submitting.');
      }

      setSubmitted(true);
      onShowToast('🎉', 'Success!', 'Your guest application has been received.');
    } catch (err) {
      console.error('Submission error:', err);
      onShowToast('❌', 'Error', err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="become-guest-wrap">
      <style>{`
        .become-guest-wrap {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, #1a0b2e 0%, #07030f 90%);
          color: #fff;
          padding: 120px 24px 80px;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .become-guest-card {
          background: rgba(30, 15, 60, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        @media (max-width: 600px) {
          .become-guest-wrap {
            padding: 90px 10px 60px !important;
          }
          .become-guest-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
      
      {/* Background Decorative Gradients */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-100px',
        left: '-100px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-100px',
        right: '-100px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '720px', width: '100%', zIndex: 1, position: 'relative' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: '#C084FC',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '16px'
          }}>
            Podcast Guest Application
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Become a <em style={{ fontStyle: 'italic', color: '#FEF08A' }}>Guest.</em>
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 20px'
          }}>
            Share your expertise, inspire our listeners, and tell your unique career story on the Bold & Brilliant Girls Podcast.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            textAlign: 'left',
            fontSize: '0.88rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <p style={{ margin: '0 0 16px 0' }}>
              We are a nonprofit platform empowering girls through mentorship, career guidance, and opportunity. Any proceeds from mentees are donated to charities supporting women and girls, including charities of your choice.
            </p>
            <p style={{ margin: '0 0 16px 0', fontWeight: '600', color: '#FEF08A' }}>
              Your guest feature creates impact twice — by sharing a future and supporting meaningful change.
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />
            <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '0.92rem', fontWeight: 600 }}>Do we collect fees?</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              In some cases, mentees may contribute a small fee for mentorship sessions or platform access. As a nonprofit initiative, any proceeds collected are donated to charities and initiatives supporting women and girls, including charities selected by mentors whenever possible.
            </p>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="become-guest-card">
          {submitted ? (
            /* Success View */
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '2.5rem'
              }}>
                🎙️
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '16px'
              }}>
                Application Submitted!
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                maxWidth: '480px',
                margin: '0 auto 32px'
              }}>
                Thank you for applying to be a guest, {name}! We have received your application and details. We will review your pitch and get back to you soon.
              </p>
              <button onClick={() => navigate('/episodes')} style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6B21A8, #9333EA)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
              }}>
                Browse Episodes
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  
                  {/* Name input */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                      Full Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      style={inputStyle}
                    />
                  </div>

                  {/* Email input */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                      Email Address <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={100}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  
                  {/* Job Title input */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                      Job Title / Role <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Director of AI Innovation"
                      style={inputStyle}
                    />
                  </div>

                  {/* Organisation input */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                      Company / Organisation
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      placeholder="e.g. Microsoft"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* LinkedIn Profile URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    maxLength={150}
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    style={inputStyle}
                  />
                </div>

                {/* Pitch / What to talk about */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                    Your Pitch (What would you like to speak about?) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    maxLength={1000}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Outline the main topics, career advice, or industry insights you would love to share with our audience of ambitious girls."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  />
                </div>

                {/* Motivation / Why guest */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                    Why do you want to be a guest on Bold & Brilliant Girls? <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    maxLength={1000}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Tell us what draws you to our mission of empowering the next generation of young women."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  />
                </div>

                {/* Submit button */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '14px 36px',
                      borderRadius: '10px',
                      background: submitting
                        ? 'rgba(255,255,255,0.1)'
                        : 'linear-gradient(135deg, #EC4899, #9333EA)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: submitting ? 'none' : '0 4px 12px rgba(236, 72, 153, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application 🎙️'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

// Reusable inline style for form inputs
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.25s ease'
};
