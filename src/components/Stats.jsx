import React, { useState, useEffect, useRef } from 'react';

const TESTIMONIALS = [
  {
    text: '"The salary negotiation episode gave me exact phrases I used in my review meeting. I got 40% more than I\'d asked for. I cried in the car on the way home."',
    author: '— Prisha M., Product Manager · Bangalore'
  },
  {
    text: '"I booked a mentorship session and in 45 minutes my mentor helped me reframe a career decision I\'d been paralysed by for months. Worth every rupee — though it all went to charity anyway."',
    author: '— Vanya K., Career Changer · Delhi'
  },
  {
    text: '"Dr Saliha\'s burnout episode arrived in my life at exactly the right moment. I took 2 weeks off and came back a completely different person."',
    author: '— Pehal S., Doctor + Founder · Mumbai'
  },
  {
    text: '"I came for the podcast. I stayed for the community and the mentors. BBG is the only platform where I\'ve seen women genuinely lift each other without competition."',
    author: '— Erica T., Healthcare Admin · Sydney'
  },
  {
    text: '"After my mentorship session with Priya, I restructured my entire approach to job interviews. I got an offer at a company I thought was out of my league."',
    author: '— Jane W., Marketing Professional · New York'
  }
];

export default function Stats() {
  const [tIdx, setTIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [counts, setCounts] = useState({ episodes: 0, mentors: 0, community: 0, downloads: 0 });
  const statsRef = useRef(null);
  const timerRef = useRef(null);
  const animatedRef = useRef(false);

  // Testimonial Carousel Auto-play
  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [tIdx]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleTestimonialTransition((tIdx + 1) % TESTIMONIALS.length);
    }, 5500);
  };

  const handleTestimonialTransition = (newIndex) => {
    setFade(false);
    setTimeout(() => {
      setTIdx(newIndex);
      setFade(true);
    }, 220);
  };

  const goTestimonial = (i) => {
    handleTestimonialTransition(i);
    startTimer();
  };

  // Count animations on scroll visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateAll();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateAll = () => {
    const targets = { episodes: 5, mentors: 10, community: 50, downloads: 100 };
    const duration = 1600; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out

      setCounts({
        episodes: Math.floor(targets.episodes * ease),
        mentors: Math.floor(targets.mentors * ease),
        community: Math.floor(targets.community * ease),
        downloads: Math.floor(targets.downloads * ease)
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <section className="stats-section reveal visible" ref={statsRef}>
      <div className="stats-inner">
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-num">{counts.episodes}+</div>
            <div className="stat-lbl">Episodes</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{counts.mentors}+</div>
            <div className="stat-lbl">Mentors</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{counts.community}+</div>
            <div className="stat-lbl">Community</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{counts.downloads}+</div>
            <div className="stat-lbl">Downloads</div>
          </div>
        </div>

        <div className="testimonial-block">
          <span className="testimonial-block__quote-mark">"</span>
          <div
            id="testimonialText"
            className="testimonial-block__text"
            style={{
              opacity: fade ? 1 : 0,
              transition: 'opacity .22s'
            }}
          >
            {TESTIMONIALS[tIdx].text}
          </div>
          <div id="testimonialAuthor" className="testimonial-block__author">
            {TESTIMONIALS[tIdx].author}
          </div>
          <div className="testimonial-block__dots">
            {TESTIMONIALS.map((_, i) => (
              <div
                key={i}
                className={`testimonial-block__dot ${i === tIdx ? 'active' : ''}`}
                onClick={() => goTestimonial(i)}
                aria-label={`Testimonial slide ${i + 1}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
