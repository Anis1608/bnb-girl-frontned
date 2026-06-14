import React from 'react';
import { useApp } from '../context/AppContext';

export default function Mission() {
  const { cms } = useApp();

  return (
    <section className="mission reveal visible" id="mission">
      <div className="mission__center">
        <div className="mission__kicker">{cms.cms_mission_kicker || "Our Purpose"}</div>
        <blockquote className="mission__statement">
          {cms.cms_mission_statement || `"Every young woman deserves to see herself in the women who came before her — and to know that her ambitions are not just possible, but inevitable."`}
        </blockquote>
        <p className="mission__body">
          {cms.cms_mission_body || "We connect ambitious young women with accomplished role models through honest conversations, mentorship, and community. No noise. Just stories that change careers."}
        </p>
        <div className="mission__deco-line">
          <span className="mission__deco-dot"></span>
          <span className="mission__deco-dash"></span>
          <span className="mission__deco-dot"></span>
        </div>
        <p className="mission__author">{cms.cms_mission_author || "— The Bold &amp; Brilliant Girls Team"}</p>
      </div>
    </section>
  );
}
