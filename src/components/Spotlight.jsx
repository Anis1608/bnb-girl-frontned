import React from 'react';

export default function Spotlight({ onOpenGuestModal, onOpenAudioPlayer }) {
  return (
    <section className="spotlight reveal visible">
      <div className="spotlight__inner">
        <div className="spotlight__photo-wrap">
          <div className="spotlight__photo">
            <img className="spotlight__photo-img" src="https://placehold.co/260x260/9333EA/ffffff?text=SG" alt="Dr. Sheen Gurrib" />
            <div className="spotlight__ep-badge">EP.01</div>
            <div className="spotlight__featured-badge">⭐ Featured This Week</div>
          </div>
        </div>
        <div>
          <p className="spotlight__label">This Week's Guest</p>
          <h2 className="spotlight__name">Dr. Sheen Gurrib</h2>
          <p className="spotlight__title">Podcaster, Entrepreneur · Oxford &amp; Cambridge</p>
          <span className="spotlight__tag">Education &amp; Empowerment</span>
          <p className="spotlight__bio">
            Dr. Sheen is the first girl from Mauritius to attend both Oxford and Cambridge. She hosts Dream, Girl — a global platform supporting the next generation of empowered women.
          </p>
          <blockquote className="spotlight__quote">"I want to play my part in supporting the next generation of empowered women."</blockquote>
          <div className="spotlight__ctas">
            <button className="btn btn--primary" onClick={() => onOpenGuestModal(0)}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                <polygon points="5 3 19 12 5 21" />
              </svg>{' '}
              Watch
            </button>
            <button className="btn btn--secondary" onClick={() => onOpenAudioPlayer(0)}>
              🎧 Audio
            </button>
            <button className="btn btn--gold" onClick={() => onOpenGuestModal(0)}>
              Guest Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
