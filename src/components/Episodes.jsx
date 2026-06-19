import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const EP = [
  { id: 1, n: '01', title: "Relearning the ABCs of Girls' Education", guest: 'Dr. Sheen Gurrib', role: 'Podcaster & Entrepreneur', cat: 'Education', dur: '18 min', isNew: true, thumb: 'https://img.youtube.com/vi/yl-mqB1_1co/mqdefault.jpg', photo: 'https://placehold.co/64x64/9333EA/fff?text=SG', prog: 35, yt: 'yl-mqB1_1co', tags: ['education', 'girls', 'women', 'stem', 'oxford'] },
  { id: 2, n: '02', title: 'From Side Hustle to Global Brand', guest: 'Sheen Gurrib', role: 'CEO, Dream Girl', cat: 'Business', dur: '45 min', isNew: true, thumb: 'https://img.youtube.com/vi/yl-mqB1_1co/mqdefault.jpg', photo: 'https://placehold.co/64x64/EC4899/fff?text=SG', prog: 0, yt: 'yl-mqB1_1co', tags: ['business', 'entrepreneurship', 'brand', 'startup'] },
  { id: 3, n: '03', title: 'Building Wealth for Women — Money Mindsets', guest: 'Afnan Khalifa', role: 'Finance Expert', cat: 'Finance', dur: '52 min', isNew: false, thumb: 'https://img.youtube.com/vi/yl-mqB1_1co/mqdefault.jpg', photo: 'https://placehold.co/64x64/F97316/fff?text=AK', prog: 72, yt: 'yl-mqB1_1co', tags: ['finance', 'wealth', 'money', 'investing'] },
  { id: 4, n: '04', title: 'Confidence: What It Truly Means', guest: 'Dr. Shadé Zahrai', role: 'Leadership Coach', cat: 'Career', dur: '48 min', isNew: false, thumb: 'https://img.youtube.com/vi/yl-mqB1_1co/mqdefault.jpg', photo: 'https://placehold.co/64x64/EAB308/0F0A1E?text=SZ', prog: 0, yt: 'yl-mqB1_1co', tags: ['confidence', 'leadership', 'career change'] },
  { id: 5, n: '05', title: 'Breaking Into Law — The Untold Journey', guest: 'Amara Mensah', role: 'Barrister & Advocate', cat: 'Law', dur: '38 min', isNew: true, thumb: 'https://img.youtube.com/vi/yl-mqB1_1co/mqdefault.jpg', photo: 'https://placehold.co/64x64/6B21A8/fff?text=AM', prog: 0, yt: 'yl-mqB1_1co', tags: ['law', 'barrister', 'justice', 'career'] }
];

export default function Episodes({ onOpenGuestModal, onOpenAudioPlayer, onShowToast }) {
  const { featuredEpisodes, loading } = useApp();

  if (loading) {
    return (
      <section className="episodes-section" id="episodes">
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--grey-muted)' }}>
          Loading episodes...
        </div>
      </section>
    );
  }

  return (
    <section className="episodes-section" id="episodes">
      <div className="episodes-section__top reveal visible">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--purple-mid)', background: 'rgba(147,51,234,.07)', border: '1px solid rgba(147,51,234,.13)', padding: '4px 12px', borderRadius: '999px', marginBottom: '8px' }}>
            🏆 Editor's Picks
          </div>
          <h2 style={{ fontFamily: 'var(--font-d)', fontWeight: 900, fontSize: 'clamp(1.9rem,3.5vw,2.75rem)', color: 'var(--page-text)', letterSpacing: '-0.025em' }}>
            Must-Listen <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hits</span>
          </h2>
        </div>
        <Link to="/episodes">Browse All →</Link>
      </div>
      <div className="episodes-grid" id="episodesGrid">
        {featuredEpisodes.slice(0, 4).map((e) => (
          <div key={e.id} className="episode-card reveal visible">
            <div className="episode-card__thumb" onClick={() => onOpenGuestModal(e)}>
              <img src={e.thumb} alt={e.title} loading="lazy" />
              <div className="episode-card__play-overlay">
                <div className="episode-card__play-btn">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21" />
                  </svg>
                </div>
              </div>
              <span className="episode-card__tag">{e.cat}</span>
              {e.isNew && <span className="episode-card__new">NEW</span>}
            </div>
            <div className="episode-card__body">
              <p className="episode-card__meta">EP. {e.n} · {e.dur}</p>
              <h3 className="episode-card__title">{e.title}</h3>
              <div className="episode-card__guest">
                <div className="episode-card__guest-photo">
                  <img src={e.photo} alt={e.guest} loading="lazy" />
                </div>
                <div>
                  <div className="episode-card__guest-name">{e.guest}</div>
                  <div className="episode-card__guest-role">{e.role}</div>
                </div>
              </div>
              {e.prog > 0 && (
                <div className="episode-card__progress">
                  <div className="episode-card__progress-fill" style={{ width: `${e.prog}%` }}></div>
                </div>
              )}
              <div className="episode-card__actions">
                <button
                  className="ep-btn ep-btn--watch"
                  onClick={() => onOpenGuestModal(e)}
                >
                  ▶ Watch
                </button>
                <button
                  className="ep-btn ep-btn--audio"
                  onClick={() => onOpenAudioPlayer(e)}
                >
                  🎧
                </button>
                <button
                  className="ep-btn ep-btn--pdf"
                  onClick={() => onShowToast('📄', 'PDF ready', `${e.title.substring(0, 20)}...`)}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
