import React from 'react';
import { useApp } from '../context/AppContext';

const CARDS = [
  {
    kicker: 'Deep-dive conversations',
    title: 'Podcast Episodes',
    desc: 'Inspiring conversations with accomplished women — designed for curious minds and busy schedules. Each episode is a career masterclass.',
    cta: 'Listen Now →',
    link: '#episodes',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"></path>
        <path d="M19 10v2a7 7 0 01-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    )
  },
  {
    kicker: '1-on-1 guidance',
    title: 'Mentorship',
    desc: "Connect directly with professionals who've walked the path you want to walk. Real mentors, real impact.",
    cta: 'Apply Now →',
    link: '#mentorship',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"></path>
      </svg>
    )
  },
  {
    kicker: 'Free downloads',
    title: 'Resource Library',
    desc: 'Beautiful PDFs, guides, and templates distilling each episode into actionable career tools — completely free.',
    cta: 'Browse PDFs →',
    link: '#resources',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path>
      </svg>
    )
  },
  {
    kicker: 'Safe space',
    title: 'Community',
    desc: 'A supportive network of like-minded girls where you can share goals, solve problems, and grow together.',
    cta: 'Join Now →',
    link: '#community',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    )
  }
];

export default function Why() {
  const { cms } = useApp();

  const cards = [
    {
      ...CARDS[0],
      kicker: cms.cms_why_card1_kicker || CARDS[0].kicker,
      title: cms.cms_why_card1_title || CARDS[0].title,
      desc: cms.cms_why_card1_desc || CARDS[0].desc,
      cta: cms.cms_why_card1_cta || CARDS[0].cta
    },
    {
      ...CARDS[1],
      kicker: cms.cms_why_card2_kicker || CARDS[1].kicker,
      title: cms.cms_why_card2_title || CARDS[1].title,
      desc: cms.cms_why_card2_desc || CARDS[1].desc,
      cta: cms.cms_why_card2_cta || CARDS[1].cta
    },
    {
      ...CARDS[2],
      kicker: cms.cms_why_card3_kicker || CARDS[2].kicker,
      title: cms.cms_why_card3_title || CARDS[2].title,
      desc: cms.cms_why_card3_desc || CARDS[2].desc,
      cta: cms.cms_why_card3_cta || CARDS[2].cta
    },
    {
      ...CARDS[3],
      kicker: cms.cms_why_card4_kicker || CARDS[3].kicker,
      title: cms.cms_why_card4_title || CARDS[3].title,
      desc: cms.cms_why_card4_desc || CARDS[3].desc,
      cta: cms.cms_why_card4_cta || CARDS[3].cta
    }
  ];

  return (
    <section className="why-section">
      <div className="section-header reveal visible">
        <div className="eyebrow">{cms.cms_why_eyebrow || "What We Offer"}</div>
        <h2 className="section-h2" dangerouslySetInnerHTML={{ __html: cms.cms_why_title || `Why <span class="grad">Bold &amp; Brilliant</span> Girls?` }} />
        <p className="section-sub">
          {cms.cms_why_subtitle || "Every young woman deserves guidance to transform her career aspirations into reality."}
        </p>
        <div className="sdiv"></div>
      </div>
      <div className="why-grid container">
        {cards.map((card, idx) => (
          <div key={idx} className={`why-card reveal reveal-d${idx + 1} visible`}>
            <div className="why-card__inner">
              <div className="why-card__front">
                <div className="why-card__icon-wrap">{card.icon}</div>
                <div className="why-card__front-title">{card.title}</div>
                <div className="why-card__front-hint">Hover to explore</div>
              </div>
              <div className="why-card__back">
                <div>
                  <div className="why-card__back-kicker">{card.kicker}</div>
                  <div className="why-card__back-title">{card.title}</div>
                  <div className="why-card__back-desc">{card.desc}</div>
                </div>
                <a href={card.link} className="why-card__back-cta">
                  {card.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
