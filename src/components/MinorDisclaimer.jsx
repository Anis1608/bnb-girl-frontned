import React, { useState, useEffect } from 'react';
import './MinorDisclaimer.css';

export default function MinorDisclaimer() {
  const [activeSection, setActiveSection] = useState('s1');
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate scroll progress percentage
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollPercent((scrollY / totalScroll) * 100);
      } else {
        setScrollPercent(0);
      }

      // 2. Track which section is active based on position
      const sections = document.querySelectorAll('.minor-disclaimer-page .sec');
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Trigger section change when it is scrolled past 180px from top
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
    <div className="minor-disclaimer-page">
      {/* Scroll Progress Bar at the top of the viewport */}
      <div className="progress-bar" style={{ width: `${scrollPercent}%` }}></div>

      <div className="shell">
        {/* ── HERO BANNER ── */}
        <div className="hero">
          <div className="hero-blob1"></div>
          <div className="hero-blob2"></div>
          <div className="hero-left">
            <div className="hero-badge">
              <i className="ti ti-shield-lock"></i>
              Mentorship · Legal &amp; Safety
            </div>
            <h1>Empowering connections,<br /><em>clearly defined.</em></h1>
            <p className="hero-desc">
              Our legal &amp; safety policies protect every girl in our community — mentors, mentees, and families alike. Please read these carefully before participating.
            </p>
            <div className="hero-tags">
              <span className="htag">Mentorship disclaimer</span>
              <span className="htag">No guarantees</span>
              <span className="htag">Fees &amp; refunds</span>
              <span className="htag">Minor safety</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hstat" onClick={(e) => handleScrollToSection(e, 's1')}>
              <div className="hstat-ico hs1">
                <i className="ti ti-shield-check"></i>
              </div>
              <div className="hstat-text">
                <div className="hstat-title">Mentorship Disclaimer</div>
                <div className="hstat-sub">Platform role &amp; responsibility</div>
              </div>
            </div>
            <div className="hstat" onClick={(e) => handleScrollToSection(e, 's2')}>
              <div className="hstat-ico hs2">
                <i className="ti ti-circle-off"></i>
              </div>
              <div className="hstat-text">
                <div className="hstat-title">No Guarantees</div>
                <div className="hstat-sub">Outcomes &amp; independent mentors</div>
              </div>
            </div>
            <div className="hstat" onClick={(e) => handleScrollToSection(e, 's3')}>
              <div className="hstat-ico hs3">
                <i className="ti ti-credit-card"></i>
              </div>
              <div className="hstat-text">
                <div className="hstat-title">Fees &amp; Payments</div>
                <div className="hstat-sub">Pricing, access &amp; refunds</div>
              </div>
            </div>
            <div className="hstat" onClick={(e) => handleScrollToSection(e, 's4')}>
              <div className="hstat-ico hs4">
                <i className="ti ti-heart"></i>
              </div>
              <div className="hstat-text">
                <div className="hstat-title">Minor Safety Policy</div>
                <div className="hstat-sub">Protecting participants under 18</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sb-label">On this page</div>
            <div className="sb-nav">
              <a
                className={`sb-link ${activeSection === 's1' ? 'active' : ''}`}
                href="#s1"
                onClick={(e) => handleScrollToSection(e, 's1')}
              >
                <span className="sb-num sbn-s">01</span>
                <span className="sb-txt">Mentorship disclaimer</span>
              </a>
              <a
                className={`sb-link ${activeSection === 's2' ? 'active' : ''}`}
                href="#s2"
                onClick={(e) => handleScrollToSection(e, 's2')}
              >
                <span className="sb-num sbn-p">02</span>
                <span className="sb-txt">No guarantees</span>
              </a>
              <a
                className={`sb-link ${activeSection === 's3' ? 'active' : ''}`}
                href="#s3"
                onClick={(e) => handleScrollToSection(e, 's3')}
              >
                <span className="sb-num sbn-a">03</span>
                <span className="sb-txt">Fees &amp; payments</span>
              </a>
              <a
                className={`sb-link ${activeSection === 's4' ? 'active' : ''}`}
                href="#s4"
                onClick={(e) => handleScrollToSection(e, 's4')}
              >
                <span className="sb-num sbn-t">04</span>
                <span className="sb-txt">Minor safety policy</span>
              </a>
            </div>
            <div className="sb-box">
              <div className="sb-box-title">Questions?</div>
              <p>For any queries about these policies, visit <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>bnbgirl.com</a> or reach out via our contact page.</p>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main">
            {/* SECTION 1: DISCLAIMER */}
            <div className="sec" id="s1">
              <div className="sec-hdr">
                <div className="sec-ico ico-s">
                  <i className="ti ti-shield-check"></i>
                </div>
                <div>
                  <p className="sec-title">Mentorship disclaimer</p>
                  <p className="sec-sub">Section 01 &nbsp;·&nbsp; Platform role &amp; participant responsibility</p>
                </div>
              </div>
              <div className="sec-body">
                <p className="intro">
                  BB Girls provides a platform to encourage mentorship, learning, and career conversations. While we aim to foster meaningful and supportive connections, we do not independently verify mentor or mentee backgrounds, qualifications, statements, or advice. Any guidance shared reflects the individual's views — not professional, legal, financial, medical, or psychological counsel.
                </p>
                <ul className="brows">
                  <li className="brow">
                    <span className="brow-ico bi-s"><i className="ti ti-minus"></i></span>
                    BB Girls is not responsible for decisions made based on mentorship conversations
                  </li>
                  <li className="brow">
                    <span className="brow-ico bi-s"><i className="ti ti-minus"></i></span>
                    Outcomes resulting from mentor or mentee interactions are the responsibility of participants
                  </li>
                  <li className="brow">
                    <span className="brow-ico bi-s"><i className="ti ti-minus"></i></span>
                    Conduct or communications outside the BB Girls platform are beyond our supervision
                  </li>
                </ul>
                <div className="callout callout-s">
                  <i className="ti ti-info-circle"></i>
                  <p>
                    BB Girls does not supervise or monitor private meetings, calls, or communications. All users are encouraged to exercise good judgment, maintain respectful boundaries, and prioritize personal safety in every interaction.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: NO GUARANTEES */}
            <div className="sec" id="s2">
              <div className="sec-hdr">
                <div className="sec-ico ico-p">
                  <i className="ti ti-circle-off"></i>
                </div>
                <div>
                  <p className="sec-title">No guarantee &amp; independent relationship</p>
                  <p className="sec-sub">Section 02 &nbsp;·&nbsp; Outcomes, mentor status &amp; program scope</p>
                </div>
              </div>
              <div className="sec-body">
                <p className="intro">
                  The mentorship experience varies for each participant. BB Girls makes no guarantees regarding the following outcomes or opportunities — every journey is unique and results depend on many factors outside our control.
                </p>
                <div className="gcards">
                  <div className="gcard">
                    <i className="ti ti-school"></i>
                    <span>Admissions outcomes</span>
                  </div>
                  <div className="gcard">
                    <i className="ti ti-briefcase"></i>
                    <span>Internship or employment</span>
                  </div>
                  <div className="gcard">
                    <i className="ti ti-users"></i>
                    <span>Mentor availability</span>
                  </div>
                  <div className="gcard">
                    <i className="ti ti-message"></i>
                    <span>Responses from mentors</span>
                  </div>
                  <div className="gcard">
                    <i className="ti ti-star"></i>
                    <span>Career or personal outcomes</span>
                  </div>
                  <div className="gcard">
                    <i className="ti ti-certificate"></i>
                    <span>Educational results</span>
                  </div>
                </div>
                <div className="callout callout-p">
                  <i className="ti ti-user-check"></i>
                  <p>
                    Mentors participate independently and are not employees, representatives, agents, or contractors of BB Girls. Their guidance reflects their personal experience and perspective only.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: FEES & PAYMENTS */}
            <div className="sec" id="s3">
              <div className="sec-hdr">
                <div className="sec-ico ico-a">
                  <i className="ti ti-credit-card"></i>
                </div>
                <div>
                  <p className="sec-title">Mentorship fees &amp; payment</p>
                  <p className="sec-sub">Section 03 &nbsp;·&nbsp; Pricing, access &amp; refund policy</p>
                </div>
              </div>
              <div className="sec-body">
                <p className="intro">
                  Certain mentorship opportunities or platform features may require payment or participation fees. Fees collected support the operation, growth, accessibility, and mission-driven initiatives of BB Girls. Payment does not guarantee a specific mentor match, admission, internship, scholarship, or any other outcome.
                </p>
                <ul className="brows">
                  <li className="brow">
                    <span className="brow-ico bi-a"><i className="ti ti-x"></i></span>
                    No guaranteed mentor match upon payment
                  </li>
                  <li className="brow">
                    <span className="brow-ico bi-a"><i className="ti ti-x"></i></span>
                    No guaranteed placement, scholarship, or job outcome
                  </li>
                  <li className="brow">
                    <span className="brow-ico bi-a"><i className="ti ti-x"></i></span>
                    Ongoing mentor availability is not assured
                  </li>
                </ul>
                <div className="callout callout-a">
                  <i className="ti ti-receipt-refund"></i>
                  <p>
                    Unless otherwise stated, mentorship fees are non-refundable once mentorship access, sessions, or introductions have been provided. BB Girls reserves the right to modify offerings, pricing, or scheduling at any time.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: MINOR SAFETY POLICY */}
            <div className="sec" id="s4">
              <div className="sec-hdr">
                <div className="sec-ico ico-t">
                  <i className="ti ti-heart"></i>
                </div>
                <div>
                  <p className="sec-title">Minor participation &amp; safety policy</p>
                  <p className="sec-sub">Section 04 &nbsp;·&nbsp; Protecting participants under 18</p>
                </div>
              </div>
              <div className="sec-body">
                <p className="intro">
                  BB Girls is committed to creating a respectful, safe, and empowering environment for all participants — especially younger members of our community. The following safeguards are in place to protect minors at every step.
                </p>
                <div className="sgrid">
                  <div className="scard">
                    <div className="scard-ico">
                      <i className="ti ti-user-shield"></i>
                    </div>
                    <div className="scard-title">Parent or guardian involvement</div>
                    <div className="scard-body">
                      Participants under 18 should involve a parent or guardian before engaging in any mentorship interactions.
                    </div>
                  </div>
                  <div className="scard">
                    <div className="scard-ico">
                      <i className="ti ti-lock"></i>
                    </div>
                    <div className="scard-title">Protect personal information</div>
                    <div className="scard-body">
                      Users should avoid sharing sensitive personal, financial, or private information in any interaction.
                    </div>
                  </div>
                  <div className="scard">
                    <div className="scard-ico">
                      <i className="ti ti-heart-handshake"></i>
                    </div>
                    <div className="scard-title">Professional conduct required</div>
                    <div className="scard-body">
                      All mentorship interactions must remain professional and appropriate at all times without exception.
                    </div>
                  </div>
                  <div className="scard">
                    <div className="scard-ico">
                      <i className="ti ti-flag"></i>
                    </div>
                    <div className="scard-title">Report inappropriate behavior</div>
                    <div className="scard-body">
                      Any inappropriate behavior should be reported immediately. BB Girls may restrict or remove any participant.
                    </div>
                  </div>
                </div>
                <div className="callout callout-t" style={{ marginTop: '16px' }}>
                  <i className="ti ti-alert-circle"></i>
                  <p>
                    Parents or guardians may be required to consent to certain activities involving minors. BB Girls reserves the right to review, restrict, or remove any participation where necessary to maintain community safety.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION FOOTER BLOCK */}
            <div className="pgfoot">
              <div className="pgfoot-left">
                <div className="pgfoot-hed">BB <em>Girls</em> Mentorship Program</div>
                <p>These policies apply to all mentors, mentees, and participants. By participating, you acknowledge and agree to the terms described above.</p>
              </div>
              <div>
                <div className="pgfoot-links">
                  <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); window.location.href = '/privacy-policy'; }}>Privacy Policy</a>
                  <a href="/terms-of-service" onClick={(e) => { e.preventDefault(); window.location.href = '/terms-of-service'; }}>Terms of Service</a>
                  <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>bnbgirl.com</a>
                </div>
                <p className="pgfoot-meta">© 2025 BB Girls Inc. · All rights reserved</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
