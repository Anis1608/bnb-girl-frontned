import React, { useState } from 'react';

const CHIPS = [
  { label: 'STEM', emoji: '🔬' },
  { label: 'Entrepreneur', emoji: '🚀' },
  { label: 'Law', emoji: '⚖️' },
  { label: 'Creative', emoji: '🎨' },
  { label: 'Finance', emoji: '💰' },
  { label: 'Wellbeing', emoji: '🌸' }
];

export default function Ask({ onShowToast }) {
  const [mode, setMode] = useState('Q'); // 'Q' (Ask) or 'G' (Suggest)
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Form states for Ask
  const [askName, setAskName] = useState('');
  const [askEmail, setAskEmail] = useState('');
  const [askQ, setAskQ] = useState('');
  const [askSuccess, setAskSuccess] = useState(false);

  // Form states for Suggest
  const [suggestName, setSuggestName] = useState('');
  const [suggestEmail, setSuggestEmail] = useState('');
  const [suggestQ, setSuggestQ] = useState('');
  const [selectedChip, setSelectedChip] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  const handleConfirmSubscribed = () => {
    setIsSubscribed(true);
    onShowToast('📺', 'Subscribed!', 'Now suggest a guest!');
  };

  const handleAskSubmit = () => {
    if (!askQ.trim()) {
      onShowToast('❌', 'Error', 'Please enter your question.');
      return;
    }
    setAskSuccess(true);
    onShowToast('✨', 'Question Sent!', 'Thank you!');
  };

  const handleAskReset = () => {
    setAskName('');
    setAskEmail('');
    setAskQ('');
    setAskSuccess(false);
  };

  const handleSuggestSubmit = () => {
    if (!suggestQ.trim()) {
      onShowToast('❌', 'Error', 'Please describe the guest you want.');
      return;
    }
    setSuggestSuccess(true);
    onShowToast('⭐', 'Suggestion Sent!', 'We love your pick!');
  };

  const handleSuggestReset = () => {
    setSuggestName('');
    setSuggestEmail('');
    setSuggestQ('');
    setSelectedChip('');
    setSuggestSuccess(false);
  };

  return (
    <section className="ask-section" id="ask-question">
      <div className="ask-glow-1"></div>
      <div className="ask-glow-2"></div>
      <div className="ask-wrap">
        <div className="section-header reveal visible">
          <div className="eyebrow">Shape the Show</div>
          <h2 className="section-h2" style={{ color: '#fff' }}>
            Your Voice <span style={{ color: '#C4B5FD' }}>Matters</span>
          </h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,.5)' }}>
            Ask questions or suggest the next guest — we read every message.
          </p>
          <div className="sdiv"></div>
        </div>

        {/* Tab Controls */}
        <div className="ask-mode reveal visible" id="askMode">
          <button
            className={`ask-mode__btn ${mode === 'Q' ? 'active' : ''}`}
            onClick={() => setMode('Q')}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
            Ask a Guest
          </button>
          <button
            className={`ask-mode__btn ${mode === 'G' ? 'active' : ''}`}
            onClick={() => setMode('G')}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"></path>
            </svg>
            Suggest a Guest
          </button>
        </div>

        <div className="ask-card reveal visible">
          {/* Ask Panel */}
          {mode === 'Q' && (
            <div className="ask-pane active" id="askPaneQ">
              {!askSuccess ? (
                <>
                  <div className="ask-field-row">
                    <div className="ask-field">
                      <label className="ask-label">Your Name</label>
                      <input
                        className="ask-input"
                        type="text"
                        placeholder="e.g. Priya Singh"
                        value={askName}
                        onChange={(e) => setAskName(e.target.value)}
                      />
                    </div>
                    <div className="ask-field">
                      <label className="ask-label">Email</label>
                      <input
                        className="ask-input"
                        type="email"
                        placeholder="your@email.com"
                        value={askEmail}
                        onChange={(e) => setAskEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="ask-field">
                    <label className="ask-label">Your Question</label>
                    <textarea
                      className="ask-input"
                      placeholder="How did you handle self-doubt early in your career?"
                      value={askQ}
                      onChange={(e) => setAskQ(e.target.value)}
                    ></textarea>
                  </div>
                  <button className="ask-submit" onClick={handleAskSubmit}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send My Question
                  </button>
                </>
              ) : (
                <div className="ask-success" style={{ display: 'block' }}>
                  <div className="ask-success__icon">✨</div>
                  <h3 className="ask-success__h3">Question Received</h3>
                  <p className="ask-success__p">
                    Every message is read personally. Your question could shape an upcoming episode.
                  </p>
                  <button className="ask-again" onClick={handleAskReset}>
                    Send Another
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Suggest Panel */}
          {mode === 'G' && (
            <div className="ask-pane active" id="askPaneG">
              {!isSubscribed ? (
                <div id="subscribeGate">
                  <div className="subscribe-gate">
                    <div className="subscribe-gate__lock">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                      </svg>
                    </div>
                    <div className="subscribe-gate__label">Subscribers Only</div>
                    <h3 className="subscribe-gate__h3">Subscribe to Suggest a Guest</h3>
                    <p className="subscribe-gate__p">
                      This feature is exclusive to our YouTube community. Subscribe first — it only takes 2 seconds.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                      <a
                        href="https://www.youtube.com/@BoldandBrilliantgirl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="subscribe-gate__yt"
                      >
                        <svg viewBox="0 0 24 16" style={{ width: '20px', height: '14px', fill: '#fff', marginRight: '8px' }}>
                          <path d="M23.495 2.506a3.02 3.02 0 00-2.122-2.13C19.505 0 12 0 12 0S4.495 0 2.627.376A3.02 3.02 0 00.505 2.506 31.553 31.553 0 000 8a31.553 31.553 0 00.505 5.494 3.02 3.02 0 002.122 2.13C4.495 16 12 16 12 16s7.505 0 9.373-.376a3.02 3.02 0 002.122-2.13A31.553 31.553 0 0024 8a31.553 31.553 0 00-.505-5.494z"></path>
                          <path d="M9.6 11.4L15.8 8 9.6 4.6v6.8z" fill="white"></path>
                        </svg>
                        Subscribe on YouTube
                      </a>
                      <div className="subscribe-gate__confirm-row" style={{ marginTop: '12px' }}>
                        <button className="subscribe-gate__confirm" onClick={handleConfirmSubscribed}>
                          ✓ I've subscribed — show me the form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="suggest-form show" id="suggestForm">
                  {!suggestSuccess ? (
                    <>
                      <div className="suggest-gate-done">✓ Subscribed — suggest away!</div>
                      <div className="ask-label" style={{ color: 'rgba(255,255,255,.45)', marginBottom: '8px' }}>
                        Field of interest
                      </div>
                      <div className="ask-chips">
                        {CHIPS.map((chip) => (
                          <div
                            key={chip.label}
                            className={`ask-chip ${selectedChip === chip.label ? 'sel' : ''}`}
                            onClick={() => setSelectedChip(chip.label)}
                          >
                            <span className="ask-chip__emoji">{chip.emoji}</span>
                            {chip.label}
                          </div>
                        ))}
                      </div>
                      <div className="ask-field-row">
                        <div className="ask-field">
                          <label className="ask-label">Your Name</label>
                          <input
                            className="ask-input"
                            type="text"
                            placeholder="Optional"
                            value={suggestName}
                            onChange={(e) => setSuggestName(e.target.value)}
                          />
                        </div>
                        <div className="ask-field">
                          <label className="ask-label">Email</label>
                          <input
                            className="ask-input"
                            type="email"
                            placeholder="Optional"
                            value={suggestEmail}
                            onChange={(e) => setSuggestEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="ask-field">
                        <label className="ask-label">Who would you love us to invite?</label>
                        <textarea
                          className="ask-input"
                          placeholder="Name someone or describe the woman whose story you'd love to hear."
                          value={suggestQ}
                          onChange={(e) => setSuggestQ(e.target.value)}
                        ></textarea>
                      </div>
                      <button className="ask-submit" onClick={handleSuggestSubmit}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Send Suggestion
                      </button>
                    </>
                  ) : (
                    <div className="ask-success" style={{ display: 'block' }}>
                      <div className="ask-success__icon">⭐</div>
                      <h3 className="ask-success__h3">Suggestion Received</h3>
                      <p className="ask-success__p">Your pick could be our next guest.</p>
                      <button className="ask-again" onClick={handleSuggestReset}>
                        Suggest Another
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
