import React from 'react';
import { useApp } from '../context/AppContext';

export default function Spotlight({ onOpenGuestModal, onOpenAudioPlayer }) {
  const { featuredEpisodes, loading } = useApp();

  if (loading || featuredEpisodes.length === 0) {
    return (
      <section className="spotlight reveal visible">
        <div className="spotlight__inner" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
          Loading spotlight guest...
        </div>
      </section>
    );
  }

  const episode = featuredEpisodes[0];

  return (
    <section className="spotlight reveal visible">
      <div className="spotlight__inner">
        <div className="spotlight__photo-wrap">
          <div className="spotlight__photo">
            <img className="spotlight__photo-img" src={episode.photo} alt={episode.guest} />
            <div className="spotlight__ep-badge">EP.{episode.n}</div>
            <div className="spotlight__featured-badge">⭐ Featured This Week</div>
          </div>
        </div>
        <div>
          <p className="spotlight__label">This Week's Guest</p>
          <h2 className="spotlight__name">{episode.guest}</h2>
          <p className="spotlight__title">{episode.role}</p>
          <span className="spotlight__tag">{episode.cat}</span>
          <p className="spotlight__bio">{episode.bio}</p>
          {episode.quote && (
            <blockquote className="spotlight__quote">"{episode.quote}"</blockquote>
          )}
          <div className="spotlight__ctas">
            <button className="btn btn--primary" onClick={() => onOpenGuestModal(episode)}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                <polygon points="5 3 19 12 5 21" />
              </svg>{' '}
              Watch
            </button>
            <button className="btn btn--secondary" onClick={() => onOpenAudioPlayer(episode)}>
              🎧 Audio
            </button>
            <button className="btn btn--gold" onClick={() => onOpenGuestModal(episode)}>
              Guest Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
