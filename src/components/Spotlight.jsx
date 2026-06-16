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
    // Try finding in mentors list first (since admin now selects a Mentor)
    const mentor = mentors.find(m => String(m.id) === String(spotlightId));
    if (mentor) {
      // Format the mentor object into the expected "episode" format for Spotlight & Modals
      episode = {
        id: mentor.id,
        n: mentor.episode_number || '',
        title: mentor.episode_title || '',
        guest: mentor.name,
        role: mentor.role,
        cat: mentor.cat_name || '',
        dur: mentor.duration || '',
        thumb: mentor.youtube_id ? `https://img.youtube.com/vi/${mentor.youtube_id}/mqdefault.jpg` : 'https://placehold.co/640x360/0F0A1E/fff?text=Podcast',
        photo: mentor.photo || 'https://placehold.co/64x64/9333EA/fff?text=Guest',
        prog: 0,
        yt: mentor.youtube_id || '',
        spotify: mentor.spotify || '',
        audio: mentor.audio || '',
        tags: typeof mentor.expertise_areas === 'string' ? mentor.expertise_areas.split(',').map(t => t.trim()) : [],
        bio: mentor.bio || '',
        quote: mentor.quote || '',
        facts: [
          { l: 'Based in', v: mentor.role ? mentor.role.split(' · ')[1] || 'Global' : 'Global' },
          { l: 'Episode', v: mentor.episode_number ? `EP. ${mentor.episode_number}` : 'Special Guest' },
          { l: 'Duration', v: mentor.duration || '' },
          { l: 'Industry', v: mentor.cat_name || '' }
        ],
        linkedin: mentor.linkedin || '',
        availability: mentor.availability || '',
        rate: mentor.rate || '',
        expertise_areas: mentor.expertise_areas || '',
        mentor_avail: mentor.availability || '',
        mentor_rate: mentor.rate || '',
        mentor_fields: mentor.expertise_areas || '',
        mentor_linkedin: mentor.linkedin || ''
      };
    } else {
      // Fallback: check episodes
      episode = episodes.find(ep => String(ep.id) === String(spotlightId));
    }
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
            {episode.n && <div className="spotlight__ep-badge">EP.{episode.n}</div>}
            <div className="spotlight__featured-badge">⭐ Featured This Week</div>
          </div>
        </div>
        <div>
          <p className="spotlight__label">This Week's Guest</p>
          <h2 className="spotlight__name">{episode.guest}</h2>
          <p className="spotlight__title">{episode.role}</p>
          {episode.cat && <span className="spotlight__tag">{episode.cat}</span>}
          <p className="spotlight__bio">{episode.bio}</p>
          {episode.quote && (
            <blockquote className="spotlight__quote">"{episode.quote}"</blockquote>
          )}
          <div className="spotlight__ctas">
            {episode.yt && (
              <button className="btn btn--primary" onClick={() => onOpenGuestModal(episode)}>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                  <polygon points="5 3 19 12 5 21" />
                </svg>{' '}
                Watch
              </button>
            )}
            {(episode.audio || episode.spotify || episode.yt) && (
              <button className="btn btn--secondary" onClick={() => onOpenAudioPlayer(episode)}>
                🎧 Audio
              </button>
            )}
            <button className="btn btn--gold" onClick={() => onOpenGuestInfo(episode)}>
              Guest Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
