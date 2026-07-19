import React, { useState, useEffect, useRef } from 'react';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  // Settings state
  const [textSize, setTextSize] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [contrast, setContrast] = useState('normal'); // 'normal' | 'high' | 'monochrome'
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [focusOutline, setFocusOutline] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('bbg_accessibility_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.textSize) setTextSize(parsed.textSize);
        if (parsed.contrast) setContrast(parsed.contrast);
        if (parsed.underlineLinks !== undefined) setUnderlineLinks(parsed.underlineLinks);
        if (parsed.focusOutline !== undefined) setFocusOutline(parsed.focusOutline);
        if (parsed.dyslexicFont !== undefined) setDyslexicFont(parsed.dyslexicFont);
        if (parsed.reduceMotion !== undefined) setReduceMotion(parsed.reduceMotion);
      }
    } catch (e) {
      console.error('Failed to load accessibility settings:', e);
    }
  }, []);

  // Apply CSS classes to document root/body when settings change
  useEffect(() => {
    const body = document.body;

    // Reset text size
    body.classList.remove('acc-large-text', 'acc-xlarge-text');
    if (textSize === 'large') body.classList.add('acc-large-text');
    if (textSize === 'xlarge') body.classList.add('acc-xlarge-text');

    // Reset contrast
    body.classList.remove('acc-high-contrast', 'acc-monochrome');
    if (contrast === 'high') body.classList.add('acc-high-contrast');
    if (contrast === 'monochrome') body.classList.add('acc-monochrome');

    // Link underlines
    if (underlineLinks) {
      body.classList.add('acc-underline-links');
    } else {
      body.classList.remove('acc-underline-links');
    }

    // Focus outline
    if (focusOutline) {
      body.classList.add('acc-focus-outline');
    } else {
      body.classList.remove('acc-focus-outline');
    }

    // Dyslexic font
    if (dyslexicFont) {
      body.classList.add('acc-dyslexic-font');
    } else {
      body.classList.remove('acc-dyslexic-font');
    }

    // Reduce motion
    if (reduceMotion) {
      body.classList.add('acc-reduce-motion');
    } else {
      body.classList.remove('acc-reduce-motion');
    }

    // Save to localStorage
    try {
      localStorage.setItem('bbg_accessibility_settings', JSON.stringify({
        textSize,
        contrast,
        underlineLinks,
        focusOutline,
        dyslexicFont,
        reduceMotion
      }));
    } catch (e) {}

  }, [textSize, contrast, underlineLinks, focusOutline, dyslexicFont, reduceMotion]);

  const resetAll = () => {
    setTextSize('normal');
    setContrast('normal');
    setUnderlineLinks(false);
    setFocusOutline(false);
    setDyslexicFont(false);
    setReduceMotion(false);
  };

  return (
    <div ref={widgetRef} style={{ position: 'fixed', bottom: '80px', right: '24px', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.4)',
          transition: 'transform 0.2s',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Open accessibility options"
      >
        ♿
      </button>

      {/* Settings Card */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: 0,
          width: '320px',
          background: '#0F0A1E',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit' }}>Accessibility</h3>
            <button
              onClick={resetAll}
              style={{
                fontSize: '11px',
                color: '#EC4899',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

          {/* Text Size Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Text Size</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['normal', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    border: '1px solid',
                    borderColor: textSize === size ? '#9333EA' : 'rgba(255, 255, 255, 0.15)',
                    background: textSize === size ? 'rgba(147, 51, 234, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: textSize === size ? '#fff' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer'
                  }}
                >
                  {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'X-Large'}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast Mode Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Contrast Mode</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['normal', 'high', 'monochrome'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setContrast(mode)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    border: '1px solid',
                    borderColor: contrast === mode ? '#9333EA' : 'rgba(255, 255, 255, 0.15)',
                    background: contrast === mode ? 'rgba(147, 51, 234, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: contrast === mode ? '#fff' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer'
                  }}
                >
                  {mode === 'normal' ? 'Normal' : mode === 'high' ? 'High' : 'Grayscale'}
                </button>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

          {/* Boolean Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Underline Links */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)' }}>Underline Links</span>
              <input
                type="checkbox"
                checked={underlineLinks}
                onChange={(e) => setUnderlineLinks(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#EC4899', cursor: 'pointer' }}
              />
            </div>

            {/* Keyboard Focus Highlight */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)' }}>Highlight Keyboard Focus</span>
              <input
                type="checkbox"
                checked={focusOutline}
                onChange={(e) => setFocusOutline(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#EC4899', cursor: 'pointer' }}
              />
            </div>

            {/* Dyslexia-Friendly Font */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)' }}>Dyslexic Font</span>
              <input
                type="checkbox"
                checked={dyslexicFont}
                onChange={(e) => setDyslexicFont(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#EC4899', cursor: 'pointer' }}
              />
            </div>

            {/* Reduce Motion */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)' }}>Reduce Motion</span>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#EC4899', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
