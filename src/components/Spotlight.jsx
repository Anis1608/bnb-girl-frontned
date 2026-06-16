import React from 'react';
import { useApp } from '../context/AppContext';

export default function Spotlight({ onOpenGuestModal, onOpenAudioPlayer, onOpenGuestInfo }) {
  const { featuredEpisodes, episodes, mentors, loading, cms } = useApp();

  if (loading) {
    return (
      <section className="spotlight reveal visible">
        <div className="spotlight__inner" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
          Loading spotlight guest...
        </div>
      </section>
    );
  }

  // Resolve the featured episode/guest from CMS or fallback to featuredEpisodes[0]
  let episode = null;
  const spotlightId = cms.cms_spotlight_mentor_id;

  if (spotlightId && spotlightId.trim() !== '') {
    // Admin has pinned a specific episode guest by ID
    episode = episodes.find(ep => String(ep.id) === String(spotlightId));
  }

  // Fallback: first featured episode
  if (!episode && featuredEpisodes.length > 0) {
    episode = featuredEpisodes[0];
  }

  if (!episode) {
    return (
      <section className="spotlight reveal visible">
        <div className="spotlight__inner" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
          No spotlight guest configured yet.
        </div>
      </section>
    );
  }

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
            <button className="btn btn--gold" onClick={() => onOpenGuestInfo(episode)}>
              Guest Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
