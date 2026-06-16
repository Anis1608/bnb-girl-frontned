import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// local configuration data for the series cards
const SERIES_DATA = [
  {
    id: 'stem',
    title: 'Women in STEM',
    epCount: '8 Episodes',
    icon: '🔬',
    bgClass: 'series-card--stem',
    category: 'tech',
    youtubeUrl: '', // Add a direct YouTube link here to redirect externally, or leave blank to redirect locally to categories
    percentage: '25%',
    artSvg: (
      <svg className="series-card__art" viewBox="0 0 256 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="60" r="80" fill="white" fillOpacity=".04" />
        <circle cx="200" cy="60" r="50" fill="white" fillOpacity=".04" />
        <line x1="0" y1="90" x2="256" y2="90" stroke="white" strokeOpacity=".07" strokeWidth="1" />
        <line x1="0" y1="180" x2="256" y2="180" stroke="white" strokeOpacity=".07" strokeWidth="1" />
        <line x1="0" y1="270" x2="256" y2="270" stroke="white" strokeOpacity=".07" strokeWidth="1" />
        <circle cx="40" cy="120" r="3" fill="#34D399" fillOpacity=".6" />
        <circle cx="80" cy="85" r="3" fill="#34D399" fillOpacity=".6" />
        <circle cx="130" cy="65" r="4" fill="#34D399" fillOpacity=".7" />
        <circle cx="180" cy="42" r="3" fill="#34D399" fillOpacity=".6" />
        <path d="M40 120 L80 85 L130 65 L180 42" stroke="#34D399" strokeOpacity=".35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="16" y="290" width="32" height="4" rx="2" fill="white" fillOpacity=".2" />
        <rect x="16" y="300" width="52" height="4" rx="2" fill="white" fillOpacity=".12" />
        <circle cx="220" cy="280" r="22" stroke="#0D9488" strokeOpacity=".3" strokeWidth="1.5" fill="none" />
        <text x="220" y="285" textAnchor="middle" fontSize="18" fill="#34D399" fillOpacity=".7">🔬</text>
      </svg>
    )
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship Diaries',
    epCount: '6 Episodes',
    icon: '🚀',
    bgClass: 'series-card--entrepreneurship',
    category: 'business',
    youtubeUrl: '', // Add a direct YouTube link here to redirect externally, or leave blank to redirect locally to categories
    percentage: '0%',
    artSvg: (
      <svg className="series-card__art" viewBox="0 0 256 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M128 40 L160 100 L230 110 L178 162 L192 232 L128 198 L64 232 L78 162 L26 110 L96 100 Z" fill="white" fillOpacity=".04" stroke="white" strokeOpacity=".1" strokeWidth="1" />
        <circle cx="128" cy="136" r="30" fill="white" fillOpacity=".04" />
        <line x1="50" y1="50" x2="200" y2="50" stroke="white" strokeOpacity=".07" strokeWidth="1" />
        <line x1="30" y1="200" x2="226" y2="200" stroke="white" strokeOpacity=".07" strokeWidth="1" />
        <path d="M60 280 L90 250 L120 265 L150 240 L180 255 L210 220" stroke="#F59E0B" strokeOpacity=".4" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="210" cy="220" r="5" fill="#F59E0B" fillOpacity=".6" />
        <circle cx="60" cy="280" r="4" fill="#F59E0B" fillOpacity=".4" />
      </svg>
    )
  },
  {
    id: 'mental',
    title: 'Mental Health & Career',
    epCount: '4 Episodes',
    icon: '🌸',
    bgClass: 'series-card--mental-health',
    category: 'health',
    youtubeUrl: '', // Add a direct YouTube link here to redirect externally, or leave blank to redirect locally to categories
    percentage: '50%',
    artSvg: (
      <svg className="series-card__art" viewBox="0 0 256 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="110" r="70" fill="white" fillOpacity=".04" stroke="white" strokeOpacity=".08" strokeWidth="1" />
        <circle cx="128" cy="110" r="45" fill="white" fillOpacity=".04" />
        <circle cx="128" cy="110" r="22" fill="white" fillOpacity=".06" />
        <path d="M88 200 Q128 170 168 200 Q188 220 168 250 Q148 280 128 270 Q108 280 88 250 Q68 220 88 200Z" fill="white" fillOpacity=".06" stroke="white" strokeOpacity=".12" strokeWidth="1" />
        <line x1="40" y1="300" x2="216" y2="300" stroke="white" strokeOpacity=".1" strokeWidth="1" />
        <circle cx="50" cy="50" r="8" stroke="#F472B6" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
        <circle cx="210" cy="80" r="5" stroke="#F472B6" strokeOpacity=".25" strokeWidth="1" fill="none" />
      </svg>
    )
  },
  {
    id: 'law',
    title: 'Breaking Barriers in Law',
    epCount: '5 Episodes',
    icon: '⚖️',
    bgClass: 'series-card--law',
    category: 'law',
    youtubeUrl: '', // Add a direct YouTube link here to redirect externally, or leave blank to redirect locally to categories
    percentage: '0%',
    artSvg: (
      <svg className="series-card__art" viewBox="0 0 256 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="96" y="40" width="64" height="8" rx="4" fill="white" fillOpacity=".15" />
        <rect x="108" y="48" width="40" height="120" rx="4" fill="white" fillOpacity=".06" />
        <line x1="60" y1="168" x2="200" y2="168" stroke="white" strokeOpacity=".2" strokeWidth="2" />
        <path d="M70 168 L90 220 L110 168" fill="white" fillOpacity=".06" stroke="white" strokeOpacity=".15" strokeWidth="1" />
        <path d="M150 168 L170 220 L190 168" fill="white" fillOpacity=".06" stroke="white" strokeOpacity=".15" strokeWidth="1" />
        <rect x="80" y="280" width="96" height="12" rx="3" fill="white" fillOpacity=".1" />
        <line x1="40" y1="60" x2="40" y2="280" stroke="white" strokeOpacity=".06" strokeWidth="1" />
        <line x1="216" y1="60" x2="216" y2="280" stroke="white" strokeOpacity=".06" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'creative',
    title: 'The Creative Career',
    epCount: '7 Episodes',
    icon: '🎨',
    bgClass: 'series-card--creative',
    category: 'arts',
    youtubeUrl: '', // Add a direct YouTube link here to redirect externally, or leave blank to redirect locally to categories
    percentage: '14%',
    artSvg: (
      <svg className="series-card__art" viewBox="0 0 256 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="100" r="55" fill="white" fillOpacity=".05" />
        <circle cx="176" cy="80" r="40" fill="white" fillOpacity=".04" />
        <circle cx="128" cy="160" r="30" fill="white" fillOpacity=".04" />
        <path d="M 50 260 Q 90 220 128 240 Q 166 260 206 220" stroke="#FCA5A1" strokeOpacity=".35" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="260" r="4" fill="#EA580C" fillOpacity=".5" />
        <circle cx="128" cy="240" r="4" fill="#EA580C" fillOpacity=".5" />
        <circle cx="206" cy="220" r="5" fill="#EA580C" fillOpacity=".6" />
        <line x1="30" y1="300" x2="226" y2="300" stroke="white" strokeOpacity=".08" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'finance',
    title: 'Corporate & Finance',
    epCount: '5 Episodes',
    icon: '💼',
    bgClass: 'series-card--finance',
    category: 'finance',
    youtubeUrl: '', // Add a direct YouTube link here to redirect externally, or leave blank to redirect locally to categories
    percentage: '0%',
    artSvg: (
      <svg className="series-card__art" viewBox="0 0 256 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="260" width="28" height="60" rx="4" fill="white" fillOpacity=".08" />
        <rect x="76" y="220" width="28" height="100" rx="4" fill="white" fillOpacity=".08" />
        <rect x="116" y="190" width="28" height="130" rx="4" fill="white" fillOpacity=".08" />
        <rect x="156" y="150" width="28" height="170" rx="4" fill="white" fillOpacity=".1" />
        <rect x="196" y="110" width="28" height="210" rx="4" fill="white" fillOpacity=".12" />
        <path d="M50 260 L90 220 L130 190 L170 150 L210 110" stroke="#38BDF8" strokeOpacity=".45" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="210" cy="110" r="5" fill="#38BDF8" fill-opacity=".7" />
        <circle cx="50" cy="88" r="24" stroke="#38BDF8" strokeOpacity=".2" strokeWidth="1.5" fill="none" />
        <text x="50" y="94" textAnchor="middle" fontSize="16" fill="white" fillOpacity=".4">$</text>
      </svg>
    )
  }
];

export default function Series() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollSeries = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 260, behavior: 'smooth' });
    }
  };

  const handleCardClick = (e, card) => {
    const hasRealLink = card.youtubeUrl && card.youtubeUrl.trim() !== '';
    if (hasRealLink) {
      // If we put a YouTube link, let the normal behavior open it in a new tab
      return;
    }
    
    // Otherwise, redirect locally to the category on the episodes page
    e.preventDefault();
    navigate(`/episodes?category=${card.category}`);
  };

  return (
    <section className="series-section">
      <div className="section-header reveal visible">
        <div className="eyebrow" style={{ background: 'rgba(255,215,0,.09)', borderColor: 'rgba(255,215,0,.18)', color: '#C9A800' }}>
          Curated Collections
        </div>
        <h2 className="section-h2" style={{ color: '#fff' }}>
          Explore Episode <span style={{ background: 'linear-gradient(90deg,#EAB308,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Series</span>
        </h2>
        <p className="section-sub" style={{ color: 'rgba(255,255,255,.45)' }}>
          Binge-listen to curated collections on topics that matter to you.
        </p>
        <div className="sdiv"></div>
      </div>
      <div className="series-wrapper">
        <button className="series-arrow series-arrow--left" onClick={() => scrollSeries(-1)} aria-label="Scroll left">
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="series-scroll" id="seriesScroll" ref={scrollRef}>
          {SERIES_DATA.map((card) => {
            const hasRealLink = card.youtubeUrl && card.youtubeUrl.trim() !== '';
            const href = hasRealLink ? card.youtubeUrl : `/episodes?category=${card.category}`;
            const target = hasRealLink ? '_blank' : '_self';
            const rel = hasRealLink ? 'noopener noreferrer' : undefined;

            return (
              <a
                key={card.id}
                className={`series-card ${card.bgClass} reveal visible`}
                href={href}
                target={target}
                rel={rel}
                onClick={(e) => handleCardClick(e, card)}
              >
                <div className="series-card__bg"></div>
                {card.artSvg}
                <div className="series-card__icon">{card.icon}</div>
                <div className="series-card__content">
                  <p className="series-card__badge">{card.epCount}</p>
                  <h3 className="series-card__title">{card.title}</h3>
                  <div className="series-card__bar-wrap">
                    <div className="series-card__bar-fill" style={{ width: card.percentage }}></div>
                  </div>
                  <button className="series-card__btn">Watch on YouTube →</button>
                </div>
              </a>
            );
          })}
        </div>
        <button className="series-arrow series-arrow--right" onClick={() => scrollSeries(1)} aria-label="Scroll right">
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
