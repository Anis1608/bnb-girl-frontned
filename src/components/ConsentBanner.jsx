import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ConsentBanner() {
  const { consentSettings, updateConsent } = useApp();
  const [showCustomize, setShowCustomize] = useState(false);
  const [performanceChecked, setPerformanceChecked] = useState(true);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);

  if (consentSettings !== null) return null;

  const handleAcceptAll = () => {
    updateConsent({
      essential: true,
      performance: true,
      analytics: true
    });
  };

  const handleRejectAll = () => {
    updateConsent({
      essential: true,
      performance: false,
      analytics: false
    });
  };

  const handleSavePreferences = () => {
    updateConsent({
      essential: true,
      performance: performanceChecked,
      analytics: analyticsChecked
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      padding: '24px',
      background: 'rgba(15, 10, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Banner Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ flex: '1 1 600px' }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              🍪 Cookie Consent & Privacy Preference
            </h4>
            <p style={{
              margin: 0,
              fontSize: '13.5px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              We use cookies and localStorage to cache resources for faster loading, save your accessibility configurations, and manage login sessions. You can choose to reject non-essential features, and the website will continue to work smoothly.
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Customize
            </button>
            <button
              onClick={handleRejectAll}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#d1d5db',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Reject Non-Essential
            </button>
            <button
              onClick={handleAcceptAll}
              style={{
                padding: '11px 22px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Customization Details */}
        {showCustomize && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            animation: 'slideUp 0.3s ease'
          }}>
            {/* Essential */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Essential Data</span>
                <span style={{ fontSize: '11px', color: '#9333EA', fontWeight: 700, background: 'rgba(147, 51, 234, 0.15)', padding: '2px 8px', borderRadius: '12px' }}>Always Active</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.5' }}>
                Required to keep you securely signed in to your mentor/student dashboard and store your preference settings.
              </p>
            </div>

            {/* Performance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Performance &amp; Cache</span>
                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '38px', height: '20px' }}>
                  <input
                    type="checkbox"
                    checked={performanceChecked}
                    onChange={(e) => setPerformanceChecked(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: performanceChecked ? '#EC4899' : 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '14px', width: '14px',
                      left: performanceChecked ? '20px' : '3px',
                      bottom: '3px',
                      backgroundColor: '#white',
                      borderRadius: '50%',
                      background: '#fff',
                      transition: '0.3s'
                    }} />
                  </span>
                </label>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.5' }}>
                Caches resources lists and podcast episodes data locally so they load instantly on repeat visits.
              </p>
            </div>

            {/* Analytics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Analytics &amp; Optimization</span>
                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '38px', height: '20px' }}>
                  <input
                    type="checkbox"
                    checked={analyticsChecked}
                    onChange={(e) => setAnalyticsChecked(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: analyticsChecked ? '#9333EA' : 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '14px', width: '14px',
                      left: analyticsChecked ? '20px' : '3px',
                      bottom: '3px',
                      backgroundColor: '#white',
                      borderRadius: '50%',
                      background: '#fff',
                      transition: '0.3s'
                    }} />
                  </span>
                </label>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.5' }}>
                Helps us gather anonymous traffic and interaction patterns to continuously refine user experience.
              </p>
            </div>

            {/* Save Button Row */}
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '12px'
            }}>
              <button
                onClick={handleSavePreferences}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: '#fff',
                  border: 'none',
                  color: '#0F0A1E',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
