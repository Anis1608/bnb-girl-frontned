import React, { useEffect } from 'react';

export default function About() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="about-page-container">
      {/* ── TICKER ── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span className="ticker-item">Bold and Brilliant Girls <span className="tsep"></span></span>
          <span className="ticker-item">Podcast for Teens <span className="tsep"></span></span>
          <span className="ticker-item">Dream Boldly <span className="tsep"></span></span>
          <span className="ticker-item">Real Careers · Real Stories <span className="tsep"></span></span>
          <span className="ticker-item">Kent Place School · Summit NJ <span className="tsep"></span></span>
          <span className="ticker-item">Bold and Brilliant Girls <span className="tsep"></span></span>
          <span className="ticker-item">Podcast for Teens <span className="tsep"></span></span>
          <span className="ticker-item">Dream Boldly <span className="tsep"></span></span>
          <span className="ticker-item">Real Careers · Real Stories <span className="tsep"></span></span>
          <span className="ticker-item">Kent Place School · Summit NJ <span className="tsep"></span></span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>

        <div className="hero-left">
          <div className="eyebrow-row">
            <div className="eyebrow-badge">
              <span className="eb-dot"></span>Podcast Host and Creator
            </div>
            <span className="eyebrow-school">Kent Place · Summit, NJ</span>
          </div>
          <h1 className="hero-name">
            <span className="name-hi">Hi, I'm</span>
            <span className="name-main">Sanah</span>
            <span className="name-sub">Brilliantly.</span>
          </h1>
          <p className="hero-desc">
            A podcast dedicated to helping <strong>teens and young women</strong> explore different career paths — and discover what's truly possible for their future.
          </p>
          <div className="cta-group">
            <a href="https://www.youtube.com/@BoldandBrilliantgirl" target="_blank" rel="noopener noreferrer" className="btn-main">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
              Watch on YouTube
            </a>
            <a href="#story" className="btn-wire">
              My Story
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="photo-outer">
            <div className="photo-blob-bg"></div>
            <div className="photo-frame">
              <img decoding="async" src="https://bnbgirl.com/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-11-at-4.25.42-AM.jpeg" alt="Sanah"/>
            </div>
            <div className="sticker sticker-a">Bold and Brilliant</div>
            <div className="sticker sticker-b">New Episodes Weekly!</div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN ── */}
      <section className="origin" id="story">
        <div className="section-eyebrow">
          <span className="se-tag">Origin Story</span>
          <div className="se-rule"></div>
          <span className="se-count">01 of 04</span>
        </div>

        <div className="origin-intro reveal">
          <h2 className="oi-title">The moment that changed <span class="hot">everything.</span></h2>
          <p className="oi-body">
            Freshman year of high school hit differently than I expected. It wasn't just the academics — it was the constant pressure of a question nobody seemed to answer well:<br/><br/>
            <em>"What do you want to do with your life?"</em><br/><br/>
            Advice came from every direction, with completely different ideas of what success should look like. And somehow, none of it felt like <em>mine.</em>
          </p>
        </div>

        <div className="chapters-grid">
          <div className="ch reveal">
            <div className="ch-watermark">01</div>
            <div className="ch-icon">
              <svg viewBox="0 0 24 24"><path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/></svg>
            </div>
            <div className="ch-label">
              <svg className="ch-star" viewBox="0 0 8 8" fill="var(--hot)"><path d="M4 0l.9 2.8H8L5.6 4.5l.9 2.8L4 5.8 1.5 7.3l.9-2.8L0 2.8h3.1z"/></svg>
              The Overwhelm
            </div>
            <div className="ch-title">Too many voices, too little clarity</div>
            <div className="ch-body">Walking into high school, I felt the weight of everyone else's expectations. My dad had a vision. My friends had opinions. None of it felt authentic to who I actually was.</div>
          </div>
          <div className="ch reveal">
            <div className="ch-watermark">02</div>
            <div className="ch-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 4 12.6V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.4A7 7 0 0 1 12 2z"/><line x1="9" y1="21" x2="15" y2="21"/><line x1="9.5" y1="18.5" x2="14.5" y2="18.5"/></svg>
            </div>
            <div className="ch-label">
              <svg className="ch-star" viewBox="0 0 8 8" fill="var(--hot)"><path d="M4 0l.9 2.8H8L5.6 4.5l.9 2.8L4 5.8 1.5 7.3l.9-2.8L0 2.8h3.1z"/></svg>
              The Realization
            </div>
            <div className="ch-title">I wasn't alone in this</div>
            <div className="ch-body">When I opened up to my friends, I discovered they felt exactly the same — the same confusion, the same pressure. That shared moment of honesty changed everything.</div>
          </div>
          <div className="ch reveal">
            <div className="ch-watermark">03</div>
            <div className="ch-icon">
              <svg viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
            </div>
            <div className="ch-label">
              <svg className="ch-star" viewBox="0 0 8 8" fill="var(--hot)"><path d="M4 0l.9 2.8H8L5.6 4.5l.9 2.8L4 5.8 1.5 7.3l.9-2.8L0 2.8h3.1z"/></svg>
              The Question
            </div>
            <div className="ch-title">What if we could hear from real people?</div>
            <div className="ch-body">Not textbooks. Not career quizzes. Real professionals who had walked interesting, unexpected paths — sharing their journeys in a way no classroom ever could.</div>
          </div>
          <div className="ch reveal">
            <div className="ch-watermark">04</div>
            <div className="ch-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/></svg>
            </div>
            <div className="ch-label">
              <svg className="ch-star" viewBox="0 0 8 8" fill="var(--hot)"><path d="M4 0l.9 2.8H8L5.6 4.5l.9 2.8L4 5.8 1.5 7.3l.9-2.8L0 2.8h3.1z"/></svg>
              The Creation
            </div>
            <div className="ch-title">Bold and Brilliant Girls is born</div>
            <div className="ch-body">That question became a podcast — a space for teens and young women to explore careers through authentic conversations, without pressure to have it all figured out.</div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <div className="quote-strip">
        <div className="qs-mark">"</div>
        <div className="qs-inner reveal">
          <p className="qs-text">
            I wanted to build something that encourages <span className="qs-pop">curiosity,</span> empowers young women, and helps the next generation dream <span className="qs-pop">boldly</span> while exploring their own unique paths.
          </p>
          <div className="qs-attr">
            <div className="qs-line"></div>
            Sanah · Founder, Bold and Brilliant Girls
            <div className="qs-line"></div>
          </div>
        </div>
      </div>

      {/* ── PILLARS ── */}
      <section className="pillars" id="mission">
        <div className="pillars-head reveal">
          <div className="sec-sup">✦ What I Stand For ✦</div>
          <h2 className="sec-title">Three things that<br/><span className="hot">drive</span> <span className="lime">everything.</span></h2>
        </div>
        <div className="pillars-row">
          <div className="pil">
            <div className="pil-watermark">01</div>
            <div className="pil-icon">
              <svg viewBox="0 0 28 28"><path d="M4 5h18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><line x1="7" y1="11" x2="12" y2="11"/><line x1="7" y1="15" x2="19" y2="15"/></svg>
            </div>
            <div className="pil-title">Authentic Voices</div>
            <p className="pil-body">Real professionals. Real stories. No filters, no corporate speak — just honest conversations about careers, struggles, and breakthroughs.</p>
            <div className="pil-line"></div>
          </div>
          <div className="pil">
            <div className="pil-watermark">02</div>
            <div className="pil-icon">
              <svg viewBox="0 0 28 28"><circle cx="10" cy="9" r="4"/><path d="M2 24a8 8 0 0 1 16 0"/><circle cx="21" cy="9" r="3"/><path d="M21 24h5a7 7 0 0 0-7-7"/></svg>
            </div>
            <div className="pil-title">Curious Community</div>
            <p className="pil-body">A supportive space where young women can ask big questions, challenge assumptions, and explore paths they never thought were possible.</p>
            <div className="pil-line"></div>
          </div>
          <div className="pil">
            <div className="pil-watermark">03</div>
            <div className="pil-icon">
              <svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="11"/><path d="M19 9l-3 5.5L9 19l5.5-3L19 9z"/></svg>
            </div>
            <div className="pil-title">Bold Futures</div>
            <p className="pil-body">Helping the next generation define success on their own terms — not someone else's timeline, blueprint, or definition of achievement.</p>
            <div className="pil-line"></div>
          </div>
        </div>
      </section>

      {/* ── HOBBIES ── */}
      <section className="hobbies">
        <div className="hobbies-head reveal">
          <div>
            <div className="sec-sup">✦ Beyond the Mic ✦</div>
            <h2 className="sec-title">What shapes <span className="hot">my drive.</span></h2>
          </div>
          <p className="hh-note">The disciplines that taught me resilience, patience, and how to move toward the things that scare me.</p>
        </div>
        <div className="hlist">
          <div className="hob reveal">
            <div className="hob-icon">
              <svg viewBox="0 0 32 32"><circle cx="22" cy="7" r="3"/><path d="M17 12l-4 7 6 4"/><path d="M4 22c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4-3 6 0"/></svg>
            </div>
            <div>
              <div className="hob-name">Swimming</div>
              <div className="hob-desc">Training in the water taught me that progress is invisible until it suddenly isn't. Every lap is a quiet lesson in showing up even when no one's watching.</div>
            </div>
            <span className="hob-pill">Discipline</span>
          </div>
          <div className="hob reveal">
            <div className="hob-icon">
              <svg viewBox="0 0 32 32"><line x1="10" y1="4" x2="10" y2="28" strokeWidth="2"/><path d="M10 4l14 5-14 5"/><ellipse cx="12" cy="27" rx="6" ry="2"/></svg>
            </div>
            <div>
              <div className="hob-name">Golf</div>
              <div className="hob-desc">Golf is patience made physical. It's just you, the course, and your mind — and learning to reset after a bad shot is a skill that transfers everywhere.</div>
            </div>
            <span className="hob-pill">Resilience</span>
          </div>
          <div className="hob reveal">
            <div className="hob-icon">
              <svg viewBox="0 0 32 32"><path d="M4 26L14 8l6 10 3-5 5 13"/><circle cx="23" cy="6" r="2.5"/><path d="M19 22l3 4M17 24l6-2"/></svg>
            </div>
            <div>
              <div className="hob-name">Skiing</div>
              <div className="hob-desc">Skiing taught me to move toward the things that scare me. On a steep slope, hesitation is more dangerous than going for it — a truth that lives off the mountain too.</div>
            </div>
            <span className="hob-pill">Confidence</span>
          </div>
        </div>
      </section>

      {/* ── LISTEN ── */}
      <section className="listen" id="listen">
        <div className="player-card reveal">
          <div className="pc-topline"></div>
          <div className="pc-live"><span class="pc-dot"></span>Now Playing</div>
          <div className="wave-row">
            <div className="wb"></div><div className="wb"></div><div className="wb"></div>
            <div className="wb"></div><div className="wb"></div><div className="wb"></div>
            <div className="wb"></div><div className="wb"></div><div className="wb"></div>
            <div className="wb"></div><div className="wb"></div><div className="wb"></div>
            <div className="wb"></div>
          </div>
          <div className="pc-title">Bold and Brilliant Girls</div>
          <div className="pc-sub">New episodes every week · Real stories, real paths</div>
          <a href="https://www.youtube.com/@BoldandBrilliantgirl" className="pc-btn" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
            Watch on YouTube
          </a>
        </div>

        <div className="listen-right reveal">
          <div className="sec-sup">✦ Tune In and Connect ✦</div>
          <h2 className="lr-title">Ready to start <span class="hot">listening?</span></h2>
          <p className="lr-body">Each episode features a real professional sharing their path — the pivots, the surprises, and the advice they wish someone had given them. Perfect for every young woman figuring out her next step.</p>
          <div className="contact-box">
            <div className="cb-lbl">Get in touch</div>
            <a href="mailto:sanah@bnbgirl.com" className="cb-email">
              <span className="cb-dot"></span>
              sanah@bnbgirl.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
