import React, { useState, useEffect, useRef } from 'react';
import { EP } from './Episodes';

// 1. VIDEO MODAL (Pure YouTube player)
export function VideoModal({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div className="video-modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="video-modal__wrap">
        <button className="video-modal__close" onClick={onClose} aria-label="Close video player">✕</button>
        <div className="video-modal__player">
          <iframe
            id="videoIframe"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowFullScreen
            title="YouTube Video Player"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

// 2. AUDIO MODAL (Simulated audio player with frequency wave, speed controls, scrubber)
export function AudioModal({ episodeIndex, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [bars, setBars] = useState([]);
  const timerRef = useRef(null);

  const duration = 2534; // 42 min 14 sec
  const speeds = [1, 1.25, 1.5, 2];
  const isObject = typeof episodeIndex === 'object' && episodeIndex !== null;
  const episode = isObject ? episodeIndex : EP[episodeIndex];

  useEffect(() => {
    if (episodeIndex === null || !episode) return;
    
    // Reset state on open
    setIsPlaying(false);
    setCurrentTime(0);
    setSpeedIdx(0);
    clearInterval(timerRef.current);

    // Generate random frequency bars
    const generatedBars = [];
    for (let i = 0; i < 34; i++) {
      generatedBars.push(12 + Math.random() * 28);
    }
    setBars(generatedBars);

    return () => clearInterval(timerRef.current);
  }, [episodeIndex]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + speeds[speedIdx];
          if (next >= duration) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return duration;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speedIdx]);

  if (episodeIndex === null || !episode) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeekBack = () => {
    setCurrentTime((prev) => Math.max(0, prev - 15));
  };

  const handleSeekForward = () => {
    setCurrentTime((prev) => Math.min(duration, prev + 30));
  };

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    setCurrentTime(Math.floor(progress * duration));
  };

  const cycleSpeed = () => {
    setSpeedIdx((prev) => (prev + 1) % speeds.length);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="audio-modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`audio-player ${isPlaying ? 'playing' : ''}`}>
        <button className="audio-player__close" onClick={onClose} aria-label="Close audio player">✕</button>
        <div className="audio-player__art">🎙️</div>
        <div className="audio-player__title">{episode.title}</div>
        <div className="audio-player__guest">{`EP. ${episode.n} · ${episode.guest}`}</div>
        
        <div className="audio-player__waveform">
          {bars.map((h, i) => (
            <div
              key={i}
              className="audio-player__bar"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.06}s`
              }}
            ></div>
          ))}
        </div>

        <div className="audio-player__scrubber" onClick={handleScrubberClick}>
          <div className="audio-player__scrubber-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>

        <div className="audio-player__time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="audio-player__controls">
          <button className="audio-ctrl" onClick={handleSeekBack} aria-label="Rewind 15 seconds">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
          <button className="audio-ctrl audio-ctrl--main" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21" />
              </svg>
            )}
          </button>
          <button className="audio-ctrl" onClick={handleSeekForward} aria-label="Forward 30 seconds">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
          <button className="audio-player__speed" onClick={cycleSpeed}>
            {speeds[speedIdx]}×
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. GUEST MODAL (Video, Bio tabs, submission questions form)
const GUEST_INFO = [
  {
    bio: "Dr. Sheen Gurrib is the first girl from Mauritius to study at both Oxford and Cambridge. A multi-award winning podcaster and entrepreneur, she hosts Dream, Girl — a global platform supporting empowered women.",
    quote: "I want to play my part in supporting the next generation of empowered women.",
    tags: ['Education', 'Empowerment', 'Oxford', 'Entrepreneurship'],
    stats: [{ val: 'Oxford', lbl: 'University' }, { val: '18 min', lbl: 'Length' }, { val: '5★', lbl: 'Rating' }, { val: '2,400+', lbl: 'Views' }]
  },
  {
    bio: "Sheen Gurrib built her brand from a side hustle into a globally recognised company. She shares raw insights about starting with nothing and growing through resilience.",
    quote: "Every side hustle starts with a single brave step forward.",
    tags: ['Business', 'Brand', 'Startup', 'Founder'],
    stats: [{ val: 'CEO', lbl: 'Title' }, { val: '45 min', lbl: 'Length' }, { val: '5★', lbl: 'Rating' }, { val: '1,800+', lbl: 'Views' }]
  },
  {
    bio: "Afnan Khalifa is a finance expert and wealth strategist specialising in helping women understand money, investing, and building financial freedom.",
    quote: "Financial freedom is not a privilege — it's a right every woman deserves.",
    tags: ['Finance', 'Wealth', 'Investing', 'Money'],
    stats: [{ val: 'Expert', lbl: 'Specialty' }, { val: '52 min', lbl: 'Length' }, { val: '4.9★', lbl: 'Rating' }, { val: '3,100+', lbl: 'Views' }]
  },
  {
    bio: "Dr. Shadé Zahrai is an award-winning leadership expert, Harvard-trained coach, and bestselling author specialising in performance psychology.",
    quote: "Confidence is not something you wait to feel — it's something you choose daily.",
    tags: ['Confidence', 'Leadership', 'Psychology', 'Career'],
    stats: [{ val: 'Harvard', lbl: 'Training' }, { val: '48 min', lbl: 'Length' }, { val: '5★', lbl: 'Rating' }, { val: '2,900+', lbl: 'Views' }]
  },
  {
    bio: "Amara Mensah is a barrister and legal advocate who broke barriers to reach the top of the UK legal profession — and is committed to making law accessible for all.",
    quote: "The law should be a tool of justice for everyone, not just the privileged few.",
    tags: ['Law', 'Justice', 'Advocacy', 'Career'],
    stats: [{ val: 'Barrister', lbl: 'Title' }, { val: '38 min', lbl: 'Length' }, { val: '5★', lbl: 'Rating' }, { val: '2,200+', lbl: 'Views' }]
  }
];

export function GuestModal({ episodeIndex, onClose, onOpenVideo, onOpenAudio, onShowToast }) {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'ask'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setActiveTab('about');
    setName('');
    setEmail('');
    setQuestion('');
    setIsSuccess(false);
  }, [episodeIndex]);

  const isObject = typeof episodeIndex === 'object' && episodeIndex !== null;
  const episode = isObject ? episodeIndex : EP[episodeIndex];
  const guestInfo = isObject ? {
    bio: episode.bio,
    quote: episode.ins?.quote || episode.quote || "Coming soon.",
    tags: episode.tags || [],
    stats: episode.facts ? episode.facts.map(f => ({ val: f.v, lbl: f.l })) : []
  } : (GUEST_INFO[episodeIndex] || GUEST_INFO[0]);

  if (episodeIndex === null || !episode) return null;

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !question.trim()) {
      alert('Please fill in name and question.');
      return;
    }
    setIsSuccess(true);
  };

  const handleAskReset = () => {
    setName('');
    setEmail('');
    setQuestion('');
    setIsSuccess(false);
  };

  const handleWatchVideo = () => {
    onClose();
    onOpenVideo(episode.yt);
  };

  const handleListenAudio = () => {
    onClose();
    onOpenAudio(episodeIndex);
  };

  return (
    <div className="guest-modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="guest-modal__wrap">
        <div className="guest-modal__video-side">
          <div className="guest-modal__video-player">
            <iframe
              src={`https://www.youtube.com/embed/${episode.yt}?autoplay=1&rel=0`}
              allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
              allowFullScreen
              title={episode.title}
            ></iframe>
          </div>
          <div className="guest-modal__video-meta">
            <div className="guest-modal__video-ep">EP. {episode.n}</div>
            <div className="guest-modal__video-title">{episode.title}</div>
            <div className="guest-modal__video-actions">
              <button className="gv-btn gv-btn--watch" onClick={handleWatchVideo}>
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                  <polygon points="5 3 19 12 5 21" />
                </svg>
                Full Video
              </button>
              <button className="gv-btn gv-btn--audio" onClick={handleListenAudio}>
                🎧 Audio
              </button>
              <button className="gv-btn gv-btn--pdf" onClick={() => onShowToast('📥', 'Downloaded!', 'Career Notes')}>
                📄 PDF
              </button>
            </div>
          </div>
        </div>

        <div className="guest-modal__info-side">
          <button className="guest-modal__close" onClick={onClose} aria-label="Close details">✕</button>
          <div className="guest-modal__badge">🎙️ EP. {episode.n}</div>
          <div className="guest-modal__photo-row">
            <div className="guest-modal__photo">
              <img src={episode.photo} alt={episode.guest} />
            </div>
            <div>
              <div className="guest-modal__name">{episode.guest}</div>
              <div className="guest-modal__role">{episode.role}</div>
            </div>
          </div>

          <div className="gm-tabs">
            <button
              className={`gm-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <svg viewBox="0 0 24 24" style={{ width: '12px', height: '12px', marginRight: '4px' }}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              About
            </button>
            <button
              className={`gm-tab-btn ${activeTab === 'ask' ? 'active' : ''}`}
              onClick={() => setActiveTab('ask')}
            >
              <svg viewBox="0 0 24 24" style={{ width: '12px', height: '12px', marginRight: '4px' }}>
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Ask
            </button>
          </div>

          {activeTab === 'about' ? (
            <div className="gm-panel active">
              <div className="guest-modal__tags">
                {guestInfo.tags.map((tag, idx) => (
                  <span key={idx} className="guest-modal__tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="guest-modal__stats">
                {guestInfo.stats.map((stat, idx) => (
                  <div key={idx} className="guest-modal__stat">
                    <div className="guest-modal__stat-val">{stat.val}</div>
                    <div className="guest-modal__stat-label">{stat.lbl}</div>
                  </div>
                ))}
              </div>
              <div className="guest-modal__section-title">About</div>
              <div className="guest-modal__bio">{guestInfo.bio}</div>
              <div className="guest-modal__quote">"{guestInfo.quote}"</div>
              <div className="guest-modal__section-title">Connect</div>
              <div className="guest-modal__connect">
                <button className="guest-modal__connect-btn" onClick={() => onShowToast('👋', 'Connecting', 'Instagram link clicked')}>Instagram</button>
                <button className="guest-modal__connect-btn" onClick={() => onShowToast('👋', 'Connecting', 'LinkedIn link clicked')}>LinkedIn</button>
                <a href="#mentorship" className="guest-modal__book-mentor-btn" onClick={onClose}>
                  📅 Book Mentorship Session
                </a>
              </div>
            </div>
          ) : (
            <div className="gm-panel active">
              {!isSuccess ? (
                <form onSubmit={handleAskSubmit}>
                  <div className="gm-ask-intro">
                    <div className="gm-ask-intro-avatar">
                      <img src={episode.photo} alt={episode.guest} />
                    </div>
                    <div className="gm-ask-intro-text">
                      <strong>{episode.guest}</strong>
                      Drop a question for {episode.guest.split(' ')[0]}
                    </div>
                  </div>
                  <div className="gm-ask-label">Name</div>
                  <input
                    className="gm-ask-input"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="gm-ask-label">Email</div>
                  <input
                    className="gm-ask-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="gm-ask-label">Question</div>
                  <textarea
                    className="gm-ask-textarea"
                    placeholder="What would you love to ask them?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="gm-ask-submit">
                    ✉️ Send Question
                  </button>
                </form>
              ) : (
                <div className="gm-ask-success show">
                  <div className="gm-ask-success-icon">🎉</div>
                  <div className="gm-ask-success-title">Sent!</div>
                  <div className="gm-ask-success-text">We've passed your question on.</div>
                  <button className="gm-ask-again" onClick={handleAskReset}>
                    Ask Another
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. SEARCH OVERLAY (Tag indexing, search matches, triggers video player)
const searchData = EP.map((e, idx) => ({
  title: e.title,
  meta: `EP. ${e.n} · ${e.guest}`,
  thumb: e.thumb,
  tags: [e.title, e.guest, e.cat, ...e.tags].join(' ').toLowerCase(),
  yt: e.yt,
  index: idx
}));

export function SearchOverlay({ isOpen, onClose, onOpenVideo }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchClick = (yt) => {
    onClose();
    onOpenVideo(yt);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  const filteredMatches = query.trim().length >= 2
    ? searchData.filter((d) => d.tags.includes(query.toLowerCase()) || d.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="search-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="search-overlay__close" onClick={onClose} aria-label="Close search">✕</button>
      <div className="search-overlay__box">
        <div className="search-overlay__header">
          <span className="search-overlay__title">Search BBG</span>
        </div>
        <div className="search-overlay__input-wrap">
          <svg className="search-overlay__search-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-overlay__input"
            placeholder="Search episodes, guests, topics…"
            autoComplete="off"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.trim().length > 0 && (
            <button className="search-overlay__clear" onClick={handleClear}>✕</button>
          )}
        </div>

        {query.trim().length >= 2 ? (
          <div className="search-overlay__results" style={{ display: 'block' }}>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((m, idx) => (
                <div key={idx} className="search-result" onClick={() => handleSearchClick(m.yt)}>
                  <div className="search-result__thumb">
                    <img src={m.thumb} alt="" />
                  </div>
                  <div className="search-result__info">
                    <div className="search-result__title">{m.title}</div>
                    <div className="search-result__meta">{m.meta}</div>
                  </div>
                  <span className="search-result__type">Episode</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '28px', color: 'var(--grey-muted)', fontSize: '13px' }}>
                No results for "<strong>{query}</strong>"
              </div>
            )}
          </div>
        ) : (
          <div id="searchPopular">
            <div className="search-overlay__popular-title">Trending Topics</div>
            <div className="search-overlay__tags-row">
              <span className="search-overlay__tag" onClick={() => handleTagClick('Women in Tech')}>💻 Women in Tech</span>
              <span className="search-overlay__tag" onClick={() => handleTagClick('Imposter Syndrome')}>🧠 Imposter Syndrome</span>
              <span className="search-overlay__tag" onClick={() => handleTagClick('Career Change')}>🔄 Career Change</span>
              <span className="search-overlay__tag" onClick={() => handleTagClick('Money')}>💰 Money Mindsets</span>
            </div>
          </div>
        )}

        <div className="search-overlay__footer">
          <span className="search-overlay__footer-hint"><kbd>ESC</kbd> Close</span>
          <span style={{ fontSize: '10px', color: 'var(--grey-muted)' }}>50+ episodes indexed</span>
        </div>
      </div>
    </div>
  );
}
