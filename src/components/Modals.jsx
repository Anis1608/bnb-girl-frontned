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

// 2. AUDIO MODAL (Plays YouTube video audio, Spotify embeds, HTML5 audio, or fallback simulated player)
export function AudioModal({ episodeIndex, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2534); // 42 min 14 sec default fallback
  const [speedIdx, setSpeedIdx] = useState(0);
  const [bars, setBars] = useState([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const speeds = [1, 1.25, 1.5, 2];
  const isObject = typeof episodeIndex === 'object' && episodeIndex !== null;
  const episode = isObject ? episodeIndex : EP[episodeIndex];

  // Helper to extract YouTube ID from url
  const getYouTubeId = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper to check if a URL is a direct audio file
  const isDirectAudio = (url) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return cleanUrl.endsWith('.mp3') || cleanUrl.endsWith('.wav') || cleanUrl.endsWith('.m4a') || cleanUrl.endsWith('.ogg');
  };

  // Helper to check if a URL is a Spotify URL
  const isSpotifyUrl = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('spotify.com');
  };

  // Helper to format Spotify embed URL
  const getSpotifyEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
  };

  // Determine the playback type and details
  let playerType = 'simulated'; // 'audio' | 'youtube' | 'spotify' | 'simulated'
  let audioUrl = '';
  let ytId = null;
  let spotifyEmbedUrl = '';

  if (episode) {
    if (episode.audio && isDirectAudio(episode.audio)) {
      playerType = 'audio';
      audioUrl = episode.audio;
    } else if (episode.audio && getYouTubeId(episode.audio)) {
      playerType = 'youtube';
      ytId = getYouTubeId(episode.audio);
    } else if (episode.spotify && getYouTubeId(episode.spotify)) {
      playerType = 'youtube';
      ytId = getYouTubeId(episode.spotify);
    } else if (episode.spotify && isSpotifyUrl(episode.spotify)) {
      playerType = 'spotify';
      spotifyEmbedUrl = getSpotifyEmbedUrl(episode.spotify);
    } else if (episode.spotify && isDirectAudio(episode.spotify)) {
      playerType = 'audio';
      audioUrl = episode.spotify;
    } else if (episode.yt) {
      playerType = 'youtube';
      ytId = getYouTubeId(episode.yt);
    }
  }

  // Handle resets and setup on episodeIndex change
  useEffect(() => {
    if (episodeIndex === null || !episode) return;
    
    // Reset state on open
    setIsPlaying(false);
    setCurrentTime(0);
    setSpeedIdx(0);
    clearInterval(timerRef.current);

    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.playbackRate = 1;
    }

    // Generate random frequency bars
    const generatedBars = [];
    for (let i = 0; i < 34; i++) {
      generatedBars.push(12 + Math.random() * 28);
    }
    setBars(generatedBars);

    return () => clearInterval(timerRef.current);
  }, [episodeIndex]);

  // Sync simulated progress loop
  useEffect(() => {
    if (playerType !== 'simulated') return;

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
  }, [isPlaying, speedIdx, playerType]);

  // Sync real HTML5 audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 2534);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [episodeIndex, playerType]);

  if (episodeIndex === null || !episode) return null;

  const togglePlay = () => {
    if (playerType === 'audio') {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeekBack = () => {
    const newTime = Math.max(0, currentTime - 15);
    setCurrentTime(newTime);
    if (playerType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSeekForward = () => {
    const newTime = Math.min(duration, currentTime + 30);
    setCurrentTime(newTime);
    if (playerType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    const newTime = Math.floor(progress * duration);
    setCurrentTime(newTime);
    if (playerType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const cycleSpeed = () => {
    const nextIdx = (speedIdx + 1) % speeds.length;
    setSpeedIdx(nextIdx);
    if (playerType === 'audio' && audioRef.current) {
      audioRef.current.playbackRate = speeds[nextIdx];
    }
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
        
        {/* Render YouTube Player Embed */}
        {playerType === 'youtube' && (
          <>
            <div className="audio-player__youtube-wrap" style={{ marginTop: '20px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe
                width="100%"
                height="210"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                title="YouTube audio player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
              ></iframe>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
              📺 Playing episode stream via YouTube Embed
            </p>
          </>
        )}

        {/* Render Spotify Embed */}
        {playerType === 'spotify' && (
          <>
            <div className="audio-player__spotify-wrap" style={{ marginTop: '20px', borderRadius: '14px', overflow: 'hidden' }}>
              <iframe
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ display: 'block', borderRadius: '12px' }}
              ></iframe>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
              🟢 Playing episode stream via Spotify Embed
            </p>
          </>
        )}

        {/* Render HTML5 audio controls for direct audio or simulated player */}
        {(playerType === 'audio' || playerType === 'simulated') && (
          <>
            {playerType === 'audio' && (
              <audio
                ref={audioRef}
                src={audioUrl}
                preload="metadata"
              />
            )}

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
            {playerType === 'audio' && (
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '14px', marginBottom: 0 }}>
                🔊 Playing high-quality direct audio stream
              </p>
            )}
          </>
        )}
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
              {episode.pdf ? (
                <a
                  className="gv-btn gv-btn--pdf"
                  href={episode.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  📄 PDF
                </a>
              ) : (
                <button className="gv-btn gv-btn--pdf" onClick={() => onShowToast('📥', 'No Guide', 'No career notes PDF available')}>
                  📄 PDF
                </button>
              )}
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
                    maxLength={50}
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

// 5. GUEST INFO MODAL — Full guest/mentor profile, opened from "Guest Info" button
export function GuestInfoModal({ episode, onClose, onOpenVideo, onOpenAudio }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!episode) return null;

  const initials = (episode.guest || '??')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasPhoto = episode.photo && !episode.photo.includes('placehold');
  const hasLinkedin = episode.linkedin || (episode.facts && episode.facts.find(f => f.l === 'LinkedIn'));
  const hasAvail = episode.availability || episode.mentor_avail;
  const hasRate = episode.rate || episode.mentor_rate;
  const hasExpertise = episode.expertise_areas || episode.mentor_fields;

  return (
    <div
      className="guest-info-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9100,
        background: 'rgba(5, 2, 20, 0.82)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="guest-info-modal-card"
        style={{
          background: 'linear-gradient(145deg, #0f0a24 0%, #140a2e 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          position: 'relative',
          animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)'
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', zIndex: 10
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Hero Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(147,51,234,0.25) 0%, rgba(236,72,153,0.15) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 32px 24px',
          display: 'flex', gap: '20px', alignItems: 'center'
        }}>
          {/* Avatar */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%', flexShrink: 0,
            border: '3px solid rgba(147,51,234,0.6)',
            boxShadow: '0 0 0 6px rgba(147,51,234,0.12), 0 8px 24px rgba(0,0,0,0.4)',
            overflow: 'hidden', position: 'relative'
          }}>
            {hasPhoto ? (
              <img src={episode.photo} alt={episode.guest} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-1px'
              }}>
                {initials}
              </div>
            )}
          </div>

          {/* Name & Role */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '11px', fontWeight: '700', letterSpacing: '2px',
              color: 'rgba(216,180,254,0.7)', textTransform: 'uppercase', marginBottom: '6px'
            }}>
              🎙️ EP.{episode.n} · This Week's Guest
            </div>
            <h2 style={{
              fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: '800', color: '#fff',
              margin: '0 0 6px', lineHeight: 1.2
            }}>
              {episode.guest}
            </h2>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginBottom: '10px' }}>
              {episode.role}
            </div>
            {episode.cat && (
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(147,51,234,0.18)', border: '1px solid rgba(147,51,234,0.35)',
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
                color: '#C084FC', textTransform: 'uppercase'
              }}>
                {episode.cat}
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Bio */}
          {episode.bio && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                About
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                {episode.bio}
              </p>
            </div>
          )}

          {/* Quote */}
          {episode.quote && (
            <blockquote style={{
              margin: 0, padding: '16px 20px',
              borderLeft: '3px solid #9333EA',
              background: 'rgba(147,51,234,0.08)',
              borderRadius: '0 12px 12px 0'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '14px', color: 'rgba(216,180,254,0.9)', lineHeight: '1.6' }}>
                "{episode.quote}"
              </p>
            </blockquote>
          )}

          {/* Tags */}
          {episode.tags && episode.tags.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                Topics
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {episode.tags.filter(Boolean).map((tag, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facts / Quick Info Grid */}
          {episode.facts && episode.facts.filter(f => f.v).length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>
                Quick Info
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {episode.facts.filter(f => f.v).map((fact, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px', padding: '12px 14px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>{fact.v}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{fact.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Mentor Details */}
          {(hasExpertise || hasAvail || hasRate) && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
                Mentorship Details
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                {hasExpertise && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', width: '90px', flexShrink: 0 }}>Expertise</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>{hasExpertise}</span>
                  </div>
                )}
                {hasAvail && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', width: '90px', flexShrink: 0 }}>Availability</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>{hasAvail}</span>
                  </div>
                )}
                {hasRate && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', width: '90px', flexShrink: 0 }}>Rate</span>
                    <span style={{ color: '#34D399', fontWeight: '700' }}>{hasRate} / 30 min</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
            {episode.yt && (
              <button
                onClick={() => { onClose(); onOpenVideo(episode.yt); }}
                style={{
                  flex: 1, minWidth: '120px', padding: '12px 20px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #9333EA, #EC4899)',
                  border: 'none', color: '#fff', fontWeight: '700', fontSize: '13px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21" /></svg>
                Watch Episode
              </button>
            )}
            {(episode.audio || episode.spotify) && (
              <button
                onClick={() => { onClose(); onOpenAudio(episode); }}
                style={{
                  flex: 1, minWidth: '120px', padding: '12px 20px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontWeight: '700', fontSize: '13px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                🎧 Listen
              </button>
            )}
            {hasLinkedin && (
              <a
                href={typeof hasLinkedin === 'string' ? hasLinkedin : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: '120px', padding: '12px 20px', borderRadius: '12px',
                  background: 'rgba(10,102,194,0.15)', border: '1px solid rgba(10,102,194,0.3)',
                  color: '#60B8FF', fontWeight: '700', fontSize: '13px',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                in LinkedIn
              </a>
            )}
            <a
              href="/mentorship"
              onClick={onClose}
              style={{
                flex: 1, minWidth: '120px', padding: '12px 20px', borderRadius: '12px',
                background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.3)',
                color: '#FDE047', fontWeight: '700', fontSize: '13px',
                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              📅 Book Session
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

