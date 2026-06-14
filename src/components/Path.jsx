import React from 'react';

const PILLS = [
  { label: 'Women in STEM', sub: '8 episodes · 5 mentors', icon: '🔬', color: 'rgba(13,148,136,.1)' },
  { label: 'Entrepreneurship', sub: '6 episodes · 3 mentors', icon: '🚀', color: 'rgba(234,179,8,.1)' },
  { label: 'Health & Wellbeing', sub: '4 episodes · 4 mentors', icon: '🌸', color: 'rgba(236,72,153,.08)' },
  { label: 'Corporate & Finance', sub: '5 episodes · 3 mentors', icon: '💼', color: 'rgba(99,102,241,.09)' }
];

export default function Path() {
  return (
    <section className="path-section" id="quiz">
      <div className="path-orb-1"></div>
      <div className="path-orb-2"></div>
      <div className="path-geo">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="150" x2="1200" y2="150" stroke="white" strokeWidth="0.5" strokeOpacity=".05" />
          <line x1="0" y1="300" x2="1200" y2="300" stroke="white" strokeWidth="0.5" strokeOpacity=".05" />
          <line x1="0" y1="450" x2="1200" y2="450" stroke="white" strokeWidth="0.5" strokeOpacity=".05" />
          <line x1="300" y1="0" x2="300" y2="600" stroke="white" strokeWidth="0.5" strokeOpacity=".04" />
          <line x1="600" y1="0" x2="600" y2="600" stroke="white" strokeWidth="0.5" strokeOpacity=".04" />
          <line x1="900" y1="0" x2="900" y2="600" stroke="white" stroke-width="0.5" strokeOpacity=".04" />
          <circle cx="950" cy="300" r="280" stroke="#9333EA" strokeWidth="1" strokeOpacity=".12" fill="none" />
          <circle cx="950" cy="300" r="180" stroke="#EC4899" strokeWidth="1" strokeOpacity=".08" fill="none" />
          <path d="M0 450 L200 380 L400 420 L600 300 L800 350 L1000 200 L1200 250" stroke="#7C3AED" strokeOpacity=".15" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="path-inner">
        <div className="section-header reveal visible">
          <div className="eyebrow">Career Discovery</div>
          <h2 className="section-h2">
            Find Your <span className="grad">Spark</span>
          </h2>
          <p className="section-sub">
            5 minutes. Real results. Personalised episode picks and mentor matches just for you.
          </p>
          <div className="sdiv"></div>
        </div>
        <div className="path-card reveal visible">
          <div>
            <div className="path-card__label">Career Quiz</div>
            <h3 className="path-card__h2">
              Discover Your <span className="grad-y">Path</span>
            </h3>
            <p className="path-card__p">
              Take our short quiz to find which career path suits your personality — and get hand-picked episode recommendations from our guest experts.
            </p>
            <div className="path-card__features">
              <span className="path-feature">🕐 5 minutes</span>
              <span className="path-feature">🎯 Personalised</span>
              <span className="path-feature">🎧 Episode picks</span>
              <span className="path-feature">👩‍🏫 Mentor match</span>
            </div>
            <a href="#quiz" className="path-card__btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Start the Quiz →
            </a>
          </div>
          <div className="path-card__visual">
            {PILLS.map((pill, idx) => (
              <div key={idx} className="path-pill" onClick={() => window.location.hash = 'quiz'}>
                <div className="path-pill__icon" style={{ background: pill.color }}>
                  {pill.icon}
                </div>
                <div>
                  <div className="path-pill__label">{pill.label}</div>
                  <div className="path-pill__sub">{pill.sub}</div>
                </div>
                <span className="path-pill__arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
