import React, { useState, useEffect } from 'react';
import './PrivacyPolicy.css'; // Reuse the excellent policy page style rules

export default function MinorDisclaimer() {
  const [activeSection, setActiveSection] = useState('disclaimer');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      let currentSection = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 180) {
          currentSection = section.id;
        }
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="policy-page">
      {/* ── HERO ── */}
      <section className="policy-hero">
        <div className="hero-breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>Home</a>
          <span>&rsaquo;</span>
          Mentorship Legal & Safety
        </div>
        <h1>Mentorship Legal &amp; <span className="gold">Safety</span></h1>
        <p className="policy-hero-sub">Empowering connections, clearly defined. Please read these safeguards before participating.</p>
        <div className="hero-meta">Last reviewed: March 2, 2026</div>
      </section>

      {/* ── MAIN LAYOUT ── */}
      <div className="policy-layout">
        {/* SIDEBAR */}
        <aside className="policy-toc">
          <div className="toc-label">📋 On this page</div>
          <ul className="toc-list">
            <li>
              <a
                href="#disclaimer"
                className={activeSection === 'disclaimer' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'disclaimer')}
              >
                01 Mentorship Disclaimer
              </a>
            </li>
            <li>
              <a
                href="#guarantees"
                className={activeSection === 'guarantees' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'guarantees')}
              >
                02 No Guarantees
              </a>
            </li>
            <li>
              <a
                href="#fees"
                className={activeSection === 'fees' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'fees')}
              >
                03 Fees & Payments
              </a>
            </li>
            <li>
              <a
                href="#safety"
                className={activeSection === 'safety' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'safety')}
              >
                04 Minor Safety Policy
              </a>
            </li>
          </ul>
          <div className="toc-contact">
            <p>Questions about our policies?</p>
            <a href="mailto:sanah@bnbgirls.com">✉ sanah@bnbgirls.com</a>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="policy-content">
          {/* SECTION 1: MENTORSHIP DISCLAIMER */}
          <section className="policy-section" id="disclaimer">
            <span className="section-tag">Section 01</span>
            <h2>Mentorship Disclaimer</h2>
            <p>BB Girls provides a platform to encourage mentorship, learning, and career conversations. While we aim to foster meaningful and supportive connections, we do not independently verify mentor or mentee backgrounds, qualifications, statements, or advice. Any guidance shared reflects the individual's views — not professional, legal, financial, medical, or psychological counsel.</p>
            
            <ul>
              <li>BB Girls is not responsible for decisions made based on mentorship conversations.</li>
              <li>Outcomes resulting from mentor or mentee interactions are the responsibility of participants.</li>
              <li>Conduct or communications outside the BB Girls platform are beyond our supervision.</li>
            </ul>

            <div className="highlight-box purple">
              <div className="highlight-title">🔒 Platform Disclaimer</div>
              <p style={{ margin: 0, fontSize: '15px' }}>BB Girls does not supervise or monitor private meetings, calls, or communications. All users are encouraged to exercise good judgment, maintain respectful boundaries, and prioritize personal safety in every interaction.</p>
            </div>
          </section>

          <div className="section-divider"></div>

          {/* SECTION 2: NO GUARANTEES */}
          <section className="policy-section" id="guarantees">
            <span className="section-tag">Section 02</span>
            <h2>No Guarantee & Independent Relationship</h2>
            <p>The mentorship experience varies for each participant. BB Girls makes no guarantees regarding the following outcomes or opportunities — every journey is unique and results depend on many factors outside our control.</p>

            <table className="policy-table">
              <thead>
                <tr>
                  <th>Focus Area</th>
                  <th>Policy Scope & Clarification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Admissions outcomes</strong></td>
                  <td>We do not guarantee admission into any university or program.</td>
                </tr>
                <tr>
                  <td><strong>Internship or employment</strong></td>
                  <td>Sessions do not guarantee job placements, internships, or recruiter calls.</td>
                </tr>
                <tr>
                  <td><strong>Mentor availability</strong></td>
                  <td>Availability is determined solely by independent mentors, not the platform.</td>
                </tr>
                <tr>
                  <td><strong>Responses from mentors</strong></td>
                  <td>Ongoing dialogue is voluntary and at the mentor's discretion.</td>
                </tr>
                <tr>
                  <td><strong>Career/Personal outcomes</strong></td>
                  <td>Guidance represents personal opinions and not legally binding recommendations.</td>
                </tr>
                <tr>
                  <td><strong>Educational results</strong></td>
                  <td>Decisions, homework completion, or study success are the user's responsibility.</td>
                </tr>
              </tbody>
            </table>

            <div className="highlight-box gold">
              <div className="highlight-title">⚠️ Independent Mentors</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Mentors participate independently and are not employees, representatives, agents, or contractors of BB Girls. Their guidance reflects their personal experience and perspective only.</p>
            </div>
          </section>

          <div className="section-divider"></div>

          {/* SECTION 3: FEES & PAYMENTS */}
          <section className="policy-section" id="fees">
            <span className="section-tag">Section 03</span>
            <h2>Mentorship Fees & Payment</h2>
            <p>Certain mentorship opportunities or platform features may require payment or participation fees. Fees collected support the operation, growth, accessibility, and mission-driven initiatives of BB Girls. Payment does not guarantee a specific mentor match, admission, internship, scholarship, or any other outcome.</p>

            <ul>
              <li>No guaranteed mentor match upon payment.</li>
              <li>No guaranteed placement, scholarship, or job outcome.</li>
              <li>Ongoing mentor availability is not assured.</li>
            </ul>

            <div className="highlight-box pink">
              <div className="highlight-title">💳 Payments & Refund Policy</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Unless otherwise stated, mentorship fees are non-refundable once mentorship access, sessions, or introductions have been provided. BB Girls reserves the right to modify offerings, pricing, or scheduling at any time.</p>
            </div>
          </section>

          <div className="section-divider"></div>

          {/* SECTION 4: MINOR SAFETY */}
          <section className="policy-section" id="safety">
            <span className="section-tag">Section 04</span>
            <h2>Minor Participation & Safety Policy</h2>
            <p>BB Girls is committed to creating a respectful, safe, and empowering environment for all participants — especially younger members of our community. The following safeguards are in place to protect minors at every step.</p>

            <div className="pull-quote">
              <p>We are bold, brilliant, and kind. Protecting the safety and growth of minors in our community is our highest and most strict standard.</p>
            </div>

            <ul>
              <li><strong>Parent/Guardian Involvement:</strong> Participants under 18 must involve a parent or guardian before engaging in mentorship.</li>
              <li><strong>Information Security:</strong> Users are strictly advised to avoid sharing sensitive personal, financial, or contact credentials.</li>
              <li><strong>Professional Conduct:</strong> All interactions between mentors and mentees must remain appropriate and professional.</li>
              <li><strong>Safeguarding & Reporting:</strong> Any inappropriate behavior will result in instant removal. Report concerns immediately.</li>
            </ul>

            <div className="highlight-box dark">
              <div className="highlight-title">🛡️ Guardian Notice</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Parents or guardians may be required to consent to certain activities involving minors. BB Girls reserves the right to review, restrict, or remove any participation where necessary to maintain community safety.</p>
            </div>
          </section>

          {/* CONTACT INFO */}
          <div className="contact-card">
            <h3>Questions About Our Policies?</h3>
            <p>We're a real team and we're happy to answer any questions you have about these policies, your data, or how we work.</p>
            <a href="mailto:sanah@bnbgirls.com" className="contact-btn">✉ sanah@bnbgirls.com</a>
            <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>We aim to respond within 5 business days.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
