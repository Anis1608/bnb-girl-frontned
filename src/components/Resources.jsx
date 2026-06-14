import React from 'react';

const RC_ART = [
  /* Card 1 — Education: Elegant dark purple, geometric constellation */
  `<svg class="rc-svg-art" viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="210" fill="#150830"/>
  <defs><radialGradient id="rc1g" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#7C3AED" stop-opacity=".35"/><stop offset="100%" stop-color="#150830" stop-opacity="0"/></radialGradient></defs>
  <rect width="320" height="210" fill="url(#rc1g)"/>
  <circle cx="160" cy="95" r="55" fill="none" stroke="#A78BFA" stroke-width="1" stroke-opacity=".25"/>
  <circle cx="160" cy="95" r="35" fill="none" stroke="#C084FC" stroke-width="1.5" stroke-opacity=".35" stroke-dasharray="5 4"/>
  <circle cx="160" cy="95" r="18" fill="#7C3AED" fill-opacity=".2" stroke="#DDD6FE" stroke-width="1" stroke-opacity=".4"/>
  <circle cx="160" cy="95" r="6" fill="#C084FC" fill-opacity=".7"/>
  <line x1="160" y1="40" x2="160" y2="72" stroke="#A78BFA" stroke-opacity=".3" stroke-width="1"/>
  <line x1="160" y1="118" x2="160" y2="154" stroke="#A78BFA" stroke-opacity=".3" stroke-width="1"/>
  <line x1="106" y1="95" x2="138" y2="95" stroke="#A78BFA" stroke-opacity=".3" stroke-width="1"/>
  <line x1="182" y1="95" x2="214" y2="95" stroke="#A78BFA" stroke-opacity=".3" stroke-width="1"/>
  <circle cx="160" cy="40" r="4" fill="#EAB308" fill-opacity=".7"/><circle cx="214" cy="95" r="4" fill="#EC4899" fill-opacity=".6"/><circle cx="106" cy="95" r="3.5" fill="#34D399" fill-opacity=".6"/><circle cx="160" cy="154" r="4" fill="#60A5FA" fill-opacity=".6"/>
  <circle cx="118" cy="57" r="2.5" fill="#DDD6FE" fill-opacity=".45"/><circle cx="202" cy="57" r="2.5" fill="#DDD6FE" fill-opacity=".45"/><circle cx="118" cy="133" r="2.5" fill="#DDD6FE" fill-opacity=".4"/><circle cx="202" cy="133" r="2.5" fill="#DDD6FE" fill-opacity=".4"/>
  <line x1="0" y1="0" x2="320" y2="210" stroke="white" stroke-opacity=".025" stroke-width="1"/>
  <text x="160" y="200" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#A78BFA" fill-opacity=".6" font-style="italic">Career Playbook</text>
  </svg>`,
  /* Card 2 — Finance: Dark slate, candlestick & data chart */
  `<svg class="rc-svg-art" viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="210" fill="#051018"/>
  <defs><linearGradient id="rc2ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10B981" stop-opacity=".15"/><stop offset="100%" stop-color="#10B981" stop-opacity="0"/></linearGradient></defs>
  <line x1="0" y1="52" x2="320" y2="52" stroke="#10B981" stroke-width=".4" stroke-opacity=".15"/>
  <line x1="0" y1="104" x2="320" y2="104" stroke="#10B981" stroke-width=".4" stroke-opacity=".15"/>
  <line x1="0" y1="156" x2="320" y2="156" stroke="#10B981" stroke-width=".4" stroke-opacity=".15"/>
  <line x1="64" y1="0" x2="64" y2="210" stroke="#10B981" stroke-width=".4" stroke-opacity=".1"/>
  <line x1="128" y1="0" x2="128" y2="210" stroke="#10B981" stroke-width=".4" stroke-opacity=".1"/>
  <line x1="192" y1="0" x2="192" y2="210" stroke="#10B981" stroke-width=".4" stroke-opacity=".1"/>
  <line x1="256" y1="0" x2="256" y2="210" stroke="#10B981" stroke-width=".4" stroke-opacity=".1"/>
  <path d="M24 170 L64 148 L104 130 L144 105 L184 82 L224 55 L280 30" stroke="#00FF88" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24 170 L64 148 L104 130 L144 105 L184 82 L224 55 L280 30 L280 190 L24 190 Z" fill="url(#rc2ga)"/>
  <circle cx="144" cy="105" r="4" fill="#00FF88" fill-opacity=".9"/>
  <circle cx="224" cy="55" r="4" fill="#00FF88" fill-opacity=".9"/>
  <circle cx="280" cy="30" r="5.5" fill="#00FF88" fill-opacity=".9"/><circle cx="280" cy="30" r="13" fill="#00FF88" fill-opacity=".15"/>
  <rect x="40" y="148" width="8" height="22" rx="2" fill="#10B981" fill-opacity=".35"/><line x1="44" y1="142" x2="44" y2="148" stroke="#10B981" stroke-opacity=".4" stroke-width="1.5"/><line x1="44" y1="170" x2="44" y2="175" stroke="#10B981" stroke-opacity=".4" stroke-width="1.5"/>
  <rect x="100" y="122" width="8" height="16" rx="2" fill="#EC4899" fill-opacity=".35"/><line x1="104" y1="116" x2="104" y2="122" stroke="#EC4899" stroke-opacity=".4" stroke-width="1.5"/><line x1="104" y1="138" x2="104" y2="143" stroke="#EC4899" stroke-opacity=".4" stroke-width="1.5"/>
  <rect x="160" y="96" width="8" height="14" rx="2" fill="#10B981" fill-opacity=".4"/><line x1="164" y1="90" x2="164" y2="96" stroke="#10B981" stroke-opacity=".5" stroke-width="1.5"/>
  <circle cx="36" cy="36" r="18" fill="none" stroke="#EAB308" stroke-width="1.5" stroke-opacity=".3"/><circle cx="36" cy="36" r="10" fill="#EAB308" fill-opacity=".1"/><text x="36" y="41" text-anchor="middle" font-size="12" fill="#EAB308" fill-opacity=".7" font-weight="700">$</text>
  <text x="160" y="204" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#10B981" fill-opacity=".6" font-style="italic">Wealth Guide</text>
  </svg>`,
  /* Card 3 — Confidence: Deep magenta, radial bloom */
  `<svg class="rc-svg-art" viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="210" fill="#200028"/>
  <defs><radialGradient id="rc3g" cx="50%" cy="48%" r="55%"><stop offset="0%" stop-color="#DB2777" stop-opacity=".3"/><stop offset="55%" stop-color="#7C3AED" stop-opacity=".15"/><stop offset="100%" stop-color="#200028" stop-opacity="0"/></radialGradient></defs>
  <rect width="320" height="210" fill="url(#rc3g)"/>
  <circle cx="160" cy="95" r="78" fill="none" stroke="#F472B6" stroke-width="1" stroke-opacity=".2"/>
  <circle cx="160" cy="95" r="58" fill="none" stroke="#EC4899" stroke-width="1.5" stroke-opacity=".28"/>
  <circle cx="160" cy="95" r="38" fill="none" stroke="#C084FC" stroke-width="2" stroke-opacity=".38"/>
  <circle cx="160" cy="95" r="20" fill="#7C3AED" fill-opacity=".18"/>
  <circle cx="160" cy="95" r="8" fill="#EC4899" fill-opacity=".6"/>
  <circle cx="160" cy="95" r="3" fill="#fff" fill-opacity=".9"/>
  <line x1="160" y1="17" x2="160" y2="172" stroke="#F472B6" stroke-opacity=".12" stroke-width="1"/>
  <line x1="82" y1="95" x2="238" y2="95" stroke="#F472B6" stroke-opacity=".12" stroke-width="1"/>
  <line x1="105" y1="40" x2="215" y2="150" stroke="#F472B6" stroke-opacity=".1" stroke-width="1"/>
  <line x1="215" y1="40" x2="105" y2="150" stroke="#F472B6" stroke-opacity=".1" stroke-width="1"/>
  <circle cx="160" cy="17" r="5" fill="#F472B6" fill-opacity=".6"/>
  <circle cx="238" cy="95" r="4" fill="#C084FC" fill-opacity=".6"/>
  <circle cx="82" cy="95" r="4" fill="#EC4899" fill-opacity=".6"/>
  <circle cx="160" cy="173" r="4" fill="#F9A8D4" fill-opacity=".6"/>
  <circle cx="107" cy="42" r="3.5" fill="#EAB308" fill-opacity=".55"/>
  <circle cx="213" cy="42" r="3.5" fill="#EAB308" fill-opacity=".55"/>
  <circle cx="107" cy="148" r="3.5" fill="#A78BFA" fill-opacity=".5"/>
  <circle cx="213" cy="148" r="3.5" fill="#A78BFA" fill-opacity=".5"/>
  <text x="160" y="204" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#F472B6" fill-opacity=".6" font-style="italic">Confidence Blueprint</text>
  </svg>`
];

export const RESOURCES = [
  { ep: 'EP. 01 · Dr. Sheen Gurrib', title: "Girls' Education — Career Playbook", desc: '7-page summary with key takeaways, quotes, and action items.', pages: 7, artIdx: 0 },
  { ep: 'EP. 03 · Afnan Khalifa', title: 'Building Wealth — Money Mindsets PDF', desc: 'Investment basics, budgeting templates, and wealth-building tips.', pages: 8, artIdx: 1 },
  { ep: 'EP. 04 · Dr. Shadé Zahrai', title: 'Confidence Blueprint — Your Guide', desc: 'Imposter syndrome toolkit, daily affirmations, and exercises.', pages: 6, artIdx: 2 }
];

export default function Resources({ onShowToast }) {
  const handleDownload = (title) => {
    onShowToast('📥', 'Downloaded!', title.substring(0, 28) + '...');
  };

  return (
    <section className="resources-section" id="resources">
      <div className="section-header reveal visible">
        <div className="eyebrow">Free Downloads</div>
        <h2 className="section-h2">Your <span className="grad">Career Library</span></h2>
        <p className="section-sub">Beautifully designed PDFs packed with insights and action plans from each episode.</p>
        <div className="sdiv"></div>
      </div>
      <div className="resources-grid" id="resourcesGrid">
        {RESOURCES.map((r, i) => (
          <div key={i} className={`resource-card reveal reveal-d${i + 1} visible`}>
            <div className="resource-card__cover">
              <div dangerouslySetInnerHTML={{ __html: RC_ART[r.artIdx] }} />
              <span className="resource-card__pages">{r.pages} pages</span>
            </div>
            <div className="resource-card__body">
              <p className="resource-card__ep">{r.ep}</p>
              <h3 className="resource-card__title">{r.title}</h3>
              <p className="resource-card__desc">{r.desc}</p>
              <button className="resource-card__dl-btn" onClick={() => handleDownload(r.title)}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Free PDF
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="resources-section__cta reveal visible">
        <a href="#resources" className="btn btn--grad">View All Resources →</a>
      </div>
    </section>
  );
}
