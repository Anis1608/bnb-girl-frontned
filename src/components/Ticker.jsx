import React, { useRef, useEffect, useState } from 'react';

const ITEMS = [
  { text: '🎙️ Must-Listen Episodes — Tune In Now', url: '#episodes' },
  { text: "✨ What's Your Career Path? — Find Out", url: '#quiz' },
  { text: '💜 Mentorship Spots Open — Apply Today', url: '#mentorship' },
  { text: '📚 Free Career PDFs — Download Now', url: '#resources' },
  { text: '🌟 Join 50+ Bold & Brilliant Women', url: '#community' }
];

export default function Ticker() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const posRef = useRef(0);

  useEffect(() => {
    const strip = scrollRef.current;
    if (!strip) return;

    let frameId;

    const tick = () => {
      if (!isPaused) {
        posRef.current -= 0.55;
        const halfWidth = strip.scrollWidth / 2;

        if (Math.abs(posRef.current) >= halfWidth) {
          posRef.current = 0;
        }
        strip.style.transform = `translateX(${posRef.current}px)`;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPaused]);

  // Double items array to ensure seamless looping
  const doubledItems = [...ITEMS, ...ITEMS];

  return (
    <div
      className="ticker"
      id="bbgTicker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="ticker__inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          flexWrap: 'nowrap',
          willChange: 'transform'
        }}
      >
        {doubledItems.map((item, idx) => (
          <a
            key={idx}
            className="ticker__item"
            href={item.url}
            rel="noopener noreferrer"
          >
            {item.text}
            <span className="ticker__sep"></span>
          </a>
        ))}
      </div>
    </div>
  );
}
