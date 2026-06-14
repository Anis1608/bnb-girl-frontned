import React, { useState, useEffect } from 'react';
import './TermsOfService.css';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('s1');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.tos-section');
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
    <div className="tos-page">
      {/* ─── HERO ─── */}
      <section className="tos-hero">
        <div className="hero-inner">
          <div className="hero-breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>Home</a>
            <span>&rsaquo;</span>
            Policies &amp; Legal
            <span>&rsaquo;</span>
            Terms of Service
          </div>
          <h1>Terms of <span className="gold">Service</span></h1>
          <p className="hero-desc">Please read these terms carefully before using our website, podcast, mentorship programme, or community features. By using any BBG service, you agree to be bound by these terms.</p>
        </div>
      </section>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="tos-layout">
        {/* SIDEBAR */}
        <aside className="tos-sidebar">
          <div className="toc-card">
            <div className="toc-heading">📋 Contents</div>
            <ul className="toc-nav">
              <li>
                <a
                  href="#s1"
                  className={activeSection === 's1' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's1')}
                >
                  <span className="toc-num">1</span> Agreement & Acceptance
                </a>
              </li>
              <li>
                <a
                  href="#s2"
                  className={activeSection === 's2' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's2')}
                >
                  <span className="toc-num">2</span> About BBG
                </a>
              </li>
              <li>
                <a
                  href="#s3"
                  className={activeSection === 's3' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's3')}
                >
                  <span className="toc-num">3</span> Eligibility
                </a>
              </li>
              <li>
                <a
                  href="#s4"
                  className={activeSection === 's4' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's4')}
                >
                  <span className="toc-num">4</span> User Accounts
                </a>
              </li>
              <li>
                <a
                  href="#s5"
                  className={activeSection === 's5' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's5')}
                >
                  <span className="toc-num">5</span> Acceptable Use
                </a>
              </li>
              <li>
                <a
                  href="#s6"
                  className={activeSection === 's6' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's6')}
                >
                  <span className="toc-num">6</span> Mentorship Programme
                </a>
              </li>
              <li>
                <a
                  href="#s7"
                  className={activeSection === 's7' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's7')}
                >
                  <span className="toc-num">7</span> Community Features
                </a>
              </li>
              <li>
                <a
                  href="#s8"
                  className={activeSection === 's8' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's8')}
                >
                  <span className="toc-num">8</span> Gamification & Rewards
                </a>
              </li>
              <li>
                <a
                  href="#s9"
                  className={activeSection === 's9' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's9')}
                >
                  <span className="toc-num">9</span> Intellectual Property
                </a>
              </li>
              <li>
                <a
                  href="#s10"
                  className={activeSection === 's10' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's10')}
                >
                  <span className="toc-num">10</span> User-Generated Content
                </a>
              </li>
              <li>
                <a
                  href="#s11"
                  className={activeSection === 's11' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's11')}
                >
                  <span className="toc-num">11</span> Disclaimers
                </a>
              </li>
              <li>
                <a
                  href="#s12"
                  className={activeSection === 's12' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's12')}
                >
                  <span className="toc-num">12</span> Limitation of Liability
                </a>
              </li>
              <li>
                <a
                  href="#s13"
                  className={activeSection === 's13' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's13')}
                >
                  <span className="toc-num">13</span> Indemnification
                </a>
              </li>
              <li>
                <a
                  href="#s14"
                  className={activeSection === 's14' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's14')}
                >
                  <span className="toc-num">14</span> Service Availability
                </a>
              </li>
              <li>
                <a
                  href="#s15"
                  className={activeSection === 's15' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's15')}
                >
                  <span className="toc-num">15</span> Termination
                </a>
              </li>
              <li>
                <a
                  href="#s16"
                  className={activeSection === 's16' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's16')}
                >
                  <span className="toc-num">16</span> Dispute Resolution
                </a>
              </li>
              <li>
                <a
                  href="#s18"
                  className={activeSection === 's18' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's18')}
                >
                  <span className="toc-num">18</span> Changes to Terms
                </a>
              </li>
              <li>
                <a
                  href="#s19"
                  className={activeSection === 's19' ? 'active' : ''}
                  onClick={(e) => handleScrollToSection(e, 's19')}
                >
                  <span className="toc-num">19</span> Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="sidebar-info">
            <p>Questions about these terms? We're a real team — just ask us.</p>
            <a href="mailto:sanah@bnbgirls.com">✉ Email Us</a>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="tos-content">
          {/* 1. AGREEMENT */}
          <section className="tos-section" id="s1">
            <div className="section-header">
              <div className="section-num">1</div>
              <div className="section-title-group">
                <span className="section-tag">Acceptance</span>
                <h2>Agreement &amp; Acceptance</h2>
              </div>
            </div>

            <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and Bold &amp; Brilliant Girls ("BBG", "we", "us", "our"), governing your access to and use of the BBG website located at bnbgirls.com, our podcast content, mentorship programme, community features, gamification system, and all related services (collectively, the "Services").</p>

            <div className="callout info">
              <div className="callout-icon">📋</div>
              <div className="callout-body">
                <div className="callout-title">By Using Our Services, You Agree</div>
                <p>Accessing or using any BBG Service — including listening to episodes, downloading PDFs, participating in the career quiz, applying for mentorship, or posting in our community — constitutes your acceptance of these Terms. If you do not agree, please discontinue use immediately.</p>
              </div>
            </div>

            <p>These Terms must be read alongside our <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); window.location.href = '/privacy-policy'; }} style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>Privacy Policy</a>, Content Disclaimer, Minor Participation Policy, and Community Guidelines, all of which are incorporated into these Terms by reference.</p>
          </section>

          <div className="divider"></div>

          {/* 2. ABOUT BBG */}
          <section className="tos-section" id="s2">
            <div className="section-header">
              <div className="section-num">2</div>
              <div className="section-title-group">
                <span className="section-tag">Who We Are</span>
                <h2>About Bold &amp; Brilliant Girls</h2>
              </div>
            </div>

            <p>Bold &amp; Brilliant Girls is an independent podcast and digital community platform dedicated to empowering young women through real career stories, mentorship connections, and educational resources.</p>

            <div className="pull-quote">
              <p>Our mission is to ensure every young woman has access to the stories, guidance, and community she needs to build a bold and brilliant future — regardless of background, industry, or starting point.</p>
            </div>

            <p>BBG operates as a non-commercial, mission-driven platform. The Services are provided free of charge to users. We do not charge subscription fees, display advertising, or allow sponsors to influence our content or community recommendations.</p>

            <p><strong>Contact:</strong> <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> · Instagram: @bnbgirls.podcast</p>
          </section>

          <div className="divider"></div>

          {/* 3. ELIGIBILITY */}
          <section className="tos-section" id="s3">
            <div className="section-header">
              <div className="section-num">3</div>
              <div className="section-title-group">
                <span className="section-tag">Who Can Use BBG</span>
                <h2>Eligibility</h2>
              </div>
            </div>

            <h3>General Access</h3>
            <p>The BBG website, podcast episodes, PDF resources, and career quiz are freely accessible to users of all ages. There is no age minimum to browse our content or listen to episodes.</p>

            <h3>Mentorship Programme</h3>
            <p>Mentorship applicants must be between 14 and 25 years of age. Applicants aged 14–17 require written parental or guardian consent before being matched. See our Minor Participation Policy for full details.</p>

            <h3>Community Participation</h3>
            <p>Posting comments, participating in polls, and engaging with community discussion features is open to users aged 14 and above. Users under 18 must not share personally identifying information (home address, school name, personal phone number) in public community areas.</p>

            <h3>Guest Applications</h3>
            <p>There is no strict age requirement to apply as a podcast guest, however guests under 18 require parental/guardian consent and the presence of a parent or guardian during recording.</p>

            <div className="callout warning">
              <div className="callout-icon">⚠️</div>
              <div className="callout-body">
                <div className="callout-title">Age Misrepresentation</div>
                <p>Providing false information about your age, or an under-18 user bypassing the parental consent process, constitutes a material breach of these Terms and may result in immediate removal from all BBG programmes.</p>
              </div>
            </div>
          </section>

          <div className="divider"></div>

          {/* 4. USER ACCOUNTS */}
          <section className="tos-section" id="s4">
            <div className="section-header">
              <div className="section-num">4</div>
              <div className="section-title-group">
                <span className="section-tag">Accounts</span>
                <h2>User Accounts</h2>
              </div>
            </div>

            <p>Most BBG features (listening, quiz, PDF downloads, progress tracking) require no account. Your progress is stored locally in your browser via localStorage.</p>

            <h3>Optional Account Registration</h3>
            <p>Creating a BBG account unlocks the full gamification experience, including badge persistence across devices, streak syncing, and community leaderboard participation. Accounts are optional and free.</p>

            <h3>Account Responsibilities</h3>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must provide accurate, current information when registering.</li>
              <li>You may not create accounts for others or share your account access.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>Notify us immediately at <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> if you suspect unauthorised access to your account.</li>
            </ul>

            <h3>Account Deletion</h3>
            <p>You may request deletion of your account and associated data at any time by emailing <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> with the subject line "Delete My Account". We will action all deletion requests within 30 days.</p>
          </section>

          <div className="divider"></div>

          {/* 5. ACCEPTABLE USE */}
          <section className="tos-section" id="s5">
            <div className="section-header">
              <div className="section-num">5</div>
              <div className="section-title-group">
                <span className="section-tag">Rules of Use</span>
                <h2>Acceptable Use Policy</h2>
              </div>
            </div>

            <h3>You May</h3>
            <ul>
              <li>Access and use our Services for personal, non-commercial, educational purposes.</li>
              <li>Download episode PDFs for your own personal use and career development.</li>
              <li>Share links to BBG content on social media with proper attribution.</li>
              <li>Quote brief excerpts (under 50 words) from BBG content with clear attribution and a link to the source.</li>
              <li>Submit applications for mentorship, community membership, or guest appearances in good faith.</li>
              <li>Engage with other community members respectfully and constructively.</li>
            </ul>

            <h3>You Must Not</h3>
            <ul>
              <li>Use the Services for any unlawful purpose or in violation of any applicable law or regulation.</li>
              <li>Reproduce, redistribute, resell, or commercialise BBG content without prior written permission.</li>
              <li>Attempt to gain unauthorised access to any part of our website, servers, or systems.</li>
              <li>Use automated bots, scrapers, or tools to harvest content, data, or user information from our Services.</li>
              <li>Upload or transmit viruses, malware, or any other malicious code.</li>
              <li>Impersonate BBG staff, guests, mentors, or other community members.</li>
              <li>Submit false, misleading, or fraudulent information in any form or application.</li>
              <li>Use our Services to send spam, unsolicited messages, or unauthorised advertisements.</li>
              <li>Systematically download or archive BBG content for redistribution without permission.</li>
              <li>Interfere with the proper functioning of the website or degrade other users' experience.</li>
            </ul>

            <div className="callout critical">
              <div className="callout-icon">🚫</div>
              <div className="callout-body">
                <div className="callout-title">Zero Tolerance</div>
                <p>Harassment, abuse, hate speech, or any conduct that endangers the safety or wellbeing of community members — particularly minors — will result in immediate and permanent removal from all BBG Services. We may refer serious cases to relevant authorities.</p>
              </div>
            </div>
          </section>

          <div className="divider"></div>

          {/* 6. MENTORSHIP */}
          <section className="tos-section" id="s6">
            <div className="section-header">
              <div className="section-num">6</div>
              <div className="section-title-group">
                <span className="section-tag">Mentorship</span>
                <h2>Mentorship Programme Terms</h2>
              </div>
            </div>

            <p>The BBG Mentorship Programme connects young women with professional mentors at no cost to either party. The following terms apply to all participants.</p>

            <h3>Application & Matching</h3>
            <ul>
              <li>Submitting a mentorship application does not guarantee a match. We match based on compatibility, availability, and programme capacity.</li>
              <li>All information provided in your application must be accurate and truthful.</li>
              <li>BBG reserves the right to decline any application without providing a reason.</li>
              <li>Matching typically occurs within 5 business days of a complete application being received.</li>
            </ul>

            <h3>Programme Conduct</h3>
            <ul>
              <li>Both mentees and mentors agree to engage respectfully, professionally, and in good faith.</li>
              <li>All mentorship sessions should occur via video call (Zoom, Google Meet, or similar). In-person meetings are not facilitated or endorsed by BBG.</li>
              <li>Financial transactions between mentors and mentees are strictly prohibited. All BBG mentorship is free.</li>
              <li>Mentors must not request personal or financial information from mentees beyond what is relevant to career guidance.</li>
              <li>Both parties agree to the initial 3-month programme commitment, with the option to continue by mutual agreement.</li>
            </ul>

            <h3>Safeguarding</h3>
            <ul>
              <li>BBG maintains oversight of all active mentorship relationships and conducts regular check-ins.</li>
              <li>Any safeguarding concern must be reported to <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> immediately. We will respond within 24 hours.</li>
              <li>Additional safeguards apply to all mentorships involving participants under 18. See our Minor Participation Policy.</li>
            </ul>

            <h3>Disclaimer</h3>
            <p>BBG facilitates connections in good faith but is not responsible for advice given by mentors, outcomes of the mentorship relationship, or any arrangements made between mentors and mentees outside the programme. Mentor advice does not constitute professional legal, financial, medical, or psychological counsel.</p>

            <h3>Rematch & Withdrawal</h3>
            <p>Either party may request a rematch or exit the programme at any time by emailing <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a>. We will always accommodate reasonable requests without requiring justification.</p>
          </section>

          <div className="divider"></div>

          {/* 7. COMMUNITY */}
          <section className="tos-section" id="s7">
            <div className="section-header">
              <div className="section-num">7</div>
              <div className="section-title-group">
                <span className="section-tag">Community</span>
                <h2>Community Features</h2>
              </div>
            </div>

            <p>BBG community features include episode comments, discussion forums, peer circles, polls, and any other interactive elements on the site. By participating, you agree to the following.</p>

            <h3>Comments & Discussion</h3>
            <ul>
              <li>You are solely responsible for any content you post in community areas.</li>
              <li>Content must comply with our Community Guidelines (incorporated by reference).</li>
              <li>Posts are subject to moderation and may be removed at BBG's discretion.</li>
              <li>Name and email address are required to post. Email addresses are not publicly displayed.</li>
              <li>We use comment moderation queues. Approved comments may be published at any time.</li>
            </ul>

            <h3>Polls & Reactions</h3>
            <ul>
              <li>Participation in weekly polls and episode reactions is voluntary and anonymous (tracked by localStorage and IP for rate-limiting only).</li>
              <li>Poll results are visible to all users and may be shared by BBG on social media.</li>
              <li>Attempting to manipulate poll results through automated means or multiple accounts is prohibited.</li>
            </ul>

            <div className="callout info">
              <div className="callout-icon">💬</div>
              <div className="callout-body">
                <div className="callout-title">Community First</div>
                <p>Our community exists to uplift. We moderate actively to maintain a safe, positive, and empowering space. Respectful disagreement is welcome; disrespect is not.</p>
              </div>
            </div>
          </section>

          <div className="divider"></div>

          {/* 8. GAMIFICATION */}
          <section className="tos-section" id="s8">
            <div className="section-header">
              <div className="section-num">8</div>
              <div className="section-title-group">
                <span className="section-tag">Rewards</span>
                <h2>Gamification &amp; Rewards System</h2>
              </div>
            </div>

            <p>The BBG Reward System includes badges, listening streaks, BBG Points, and community leaderboards designed to celebrate engagement with our content and community.</p>

            <h3>Points, Badges & Streaks</h3>
            <ul>
              <li>BBG Points, badges, and streaks have no monetary value and cannot be redeemed, transferred, or exchanged.</li>
              <li>Without an account, progress is stored in your browser's localStorage. Clearing your browser data will reset local progress.</li>
              <li>With an account, progress is synced to our servers and persists across devices.</li>
              <li>BBG reserves the right to modify, reset, or discontinue any gamification feature at any time without liability.</li>
            </ul>

            <h3>Leaderboard</h3>
            <ul>
              <li>Participation in the community leaderboard is entirely opt-in.</li>
              <li>Leaderboard data (display name, badge count, streak length) is publicly visible to other users.</li>
              <li>Manipulating leaderboard standings through inauthentic activity is prohibited and may result in account suspension.</li>
            </ul>

            <div className="callout info">
              <div className="callout-icon">🏅</div>
              <div className="callout-body">
                <div className="callout-title">Rewards Are For Fun</div>
                <p>The BBG gamification system is designed to celebrate your genuine engagement with career content — not to create competitive pressure. Enjoy it at your own pace.</p>
              </div>
            </div>
          </section>

          <div className="divider"></div>

          {/* 9. IP */}
          <section className="tos-section" id="s9">
            <div className="section-header">
              <div className="section-num">9</div>
              <div className="section-title-group">
                <span className="section-tag">Ownership</span>
                <h2>Intellectual Property</h2>
              </div>
            </div>

            <p>All content created and published by BBG is protected by copyright and intellectual property law in Australia and internationally.</p>

            <h3>BBG Ownership</h3>
            <p>BBG owns or holds the necessary licences for all of the following:</p>
            <ul>
              <li>All podcast episode recordings (audio and video).</li>
              <li>Episode PDFs, career guides, templates, and downloadable resources.</li>
              <li>The BBG brand identity including logos, colour system, and visual assets.</li>
              <li>Written content: show notes, transcripts, articles, quick tips, quiz content.</li>
              <li>The BBG website design, layout, code, and gamification system architecture.</li>
            </ul>

            <h3>Limited Licence to You</h3>
            <p>BBG grants you a personal, non-exclusive, non-transferable, revocable licence to access and use the Services for personal, non-commercial purposes only. This licence does not permit you to:</p>
            <ul>
              <li>Redistribute, sublicense, or resell any BBG content.</li>
              <li>Create derivative commercial works based on BBG content.</li>
              <li>Remove copyright, trademark, or attribution notices.</li>
              <li>Use BBG brand assets in any external context without written permission.</li>
            </ul>

            <div className="tos-table-wrap">
              <table className="tos-table">
                <thead>
                  <tr><th>Action</th><th>Permitted?</th></tr>
                </thead>
                <tbody>
                  <tr><td>Downloading episode PDFs for personal use</td><td><span className="badge-pill green">✓ Yes</span></td></tr>
                  <tr><td>Sharing links to BBG content on social media</td><td><span className="badge-pill green">✓ Yes</span></td></tr>
                  <tr><td>Quoting under 50 words with attribution</td><td><span className="badge-pill green">✓ Yes</span></td></tr>
                  <tr><td>Re-uploading BBG audio or video</td><td><span className="badge-pill red">✗ No</span></td></tr>
                  <tr><td>Using BBG logos without permission</td><td><span className="badge-pill red">✗ No</span></td></tr>
                  <tr><td>Distributing BBG PDFs commercially</td><td><span className="badge-pill red">✗ No</span></td></tr>
                  <tr><td>Using content for educational presentations (non-commercial)</td><td><span className="badge-pill yellow">Ask us first</span></td></tr>
                  <tr><td>Translating or adapting content for community use</td><td><span className="badge-pill yellow">Ask us first</span></td></tr>
                </tbody>
              </table>
            </div>

            <p>© 2026 Bold & Brilliant Girls. All rights reserved.</p>
          </section>

          <div className="divider"></div>

          {/* 10. UGC */}
          <section className="tos-section" id="s10">
            <div className="section-header">
              <div className="section-num">10</div>
              <div className="section-title-group">
                <span className="section-tag">Your Content</span>
                <h2>User-Generated Content</h2>
              </div>
            </div>

            <p>When you post comments, submit quiz responses, participate in polls, or contribute any content to the BBG Services ("User Content"), the following terms apply.</p>

            <h3>Your Ownership</h3>
            <p>You retain ownership of content you create and submit. You are responsible for ensuring you have the right to submit it.</p>

            <h3>Licence You Grant BBG</h3>
            <p>By submitting User Content to any BBG Service, you grant BBG a non-exclusive, royalty-free, worldwide, perpetual licence to use, display, reproduce, and share that content across our platforms for the purpose of operating and promoting our Services. This includes (but is not limited to) featuring listener testimonials, community comments, or poll results in our social media, newsletter, or website.</p>

            <p>We will always attribute your content to your chosen display name and will never sell your content to third parties.</p>

            <h3>Content Standards</h3>
            <p>User Content must not:</p>
            <ul>
              <li>Infringe any third party's intellectual property, privacy, or legal rights.</li>
              <li>Contain false, defamatory, or misleading statements about any person or organisation.</li>
              <li>Include personal information about others without their consent.</li>
              <li>Violate any applicable law, regulation, or our Community Guidelines.</li>
            </ul>

            <h3>Removal of Content</h3>
            <p>BBG reserves the right to remove any User Content at any time for any reason, including content that violates these Terms. You may request removal of your own previously submitted content by emailing <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a>.</p>
          </section>

          <div className="divider"></div>

          {/* 11. DISCLAIMERS */}
          <section className="tos-section" id="s11">
            <div className="section-header">
              <div className="section-num">11</div>
              <div className="section-title-group">
                <span className="section-tag">Disclaimers</span>
                <h2>Disclaimers &amp; Warranties</h2>
              </div>
            </div>

            <div className="callout critical">
              <div className="callout-icon">📢</div>
              <div className="callout-body">
                <div className="callout-title">Not Professional Advice</div>
                <p>All BBG content — including podcast episodes, guest interviews, mentor guidance, career guides, quick tips, and PDFs — is provided for <strong>inspirational and educational purposes only</strong>. It does not constitute professional legal, financial, medical, psychological, or career advice. Always consult a qualified professional for advice specific to your circumstances.</p>
              </div>
            </div>

            <h3>Services Provided "As Is"</h3>
            <p>To the maximum extent permitted by applicable law, the BBG Services are provided on an "as is" and "as available" basis without warranties of any kind, express or implied. We do not warrant that:</p>
            <ul>
              <li>The Services will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
              <li>Information on the site will be accurate, complete, or up to date at all times.</li>
              <li>The career outcomes, statistics, or research cited in our content apply to your specific situation.</li>
              <li>Any specific result, career outcome, or professional connection will be achieved through use of our Services.</li>
            </ul>

            <h3>Third-Party Content & Links</h3>
            <p>Our Services may contain links to third-party websites, resources, or services. We do not control, endorse, or accept responsibility for any third-party content. Your use of third-party services is governed by their own terms and policies.</p>

            <h3>Guest Opinions</h3>
            <p>Views, opinions, and experiences expressed by podcast guests are their own and do not represent the views of BBG. We do not independently verify all claims made during episodes.</p>
          </section>

          <div className="divider"></div>

          {/* 12. LIABILITY */}
          <section className="tos-section" id="s12">
            <div className="section-header">
              <div className="section-num">12</div>
              <div className="section-title-group">
                <span className="section-tag">Liability</span>
                <h2>Limitation of Liability</h2>
              </div>
            </div>

            <p>To the maximum extent permitted by applicable Australian law, Bold &amp; Brilliant Girls, its team members, contributors, guests, mentors, and affiliated parties shall not be liable for:</p>

            <ul>
              <li>Any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services.</li>
              <li>Loss of data, including locally stored listening progress, badges, or streaks.</li>
              <li>Career decisions made in reliance on content, mentor guidance, or resources accessed through BBG.</li>
              <li>Any content, conduct, or actions of third parties, including podcast guests and mentors.</li>
              <li>Unauthorised access to or alteration of your account or submissions.</li>
              <li>Any bugs, errors, or inaccuracies in our content or systems.</li>
              <li>Service interruptions, downtime, or data loss.</li>
            </ul>

            <div className="callout warning">
              <div className="callout-icon">⚖️</div>
              <div className="callout-body">
                <div className="callout-title">Australian Consumer Law</div>
                <p>Nothing in these Terms excludes, restricts, or modifies any right or remedy, or any guarantee, warranty, or other term or condition, implied or imposed by the Australian Consumer Law or any other applicable consumer protection legislation that cannot lawfully be excluded or limited.</p>
              </div>
            </div>

            <p>In any case where BBG is found liable despite the above, our total cumulative liability to you shall not exceed AUD $100.</p>
          </section>

          <div className="divider"></div>

          {/* 13. INDEMNIFICATION */}
          <section className="tos-section" id="s13">
            <div className="section-header">
              <div className="section-num">13</div>
              <div className="section-title-group">
                <span className="section-tag">Indemnification</span>
                <h2>Indemnification</h2>
              </div>
            </div>

            <p>You agree to indemnify, defend, and hold harmless Bold &amp; Brilliant Girls and its team members, affiliates, guests, mentors, and contributors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from:</p>

            <ul>
              <li>Your breach of these Terms or any other BBG policy.</li>
              <li>Your violation of any applicable law or third-party right, including intellectual property or privacy rights.</li>
              <li>Any User Content you submit, post, or transmit through our Services.</li>
              <li>Your misuse of the mentorship programme, community features, or any other BBG Service.</li>
              <li>Any fraudulent or inaccurate information you provide to BBG.</li>
            </ul>
          </section>

          <div className="divider"></div>

          {/* 14. SERVICE AVAILABILITY */}
          <section className="tos-section" id="s14">
            <div className="section-header">
              <div className="section-num">14</div>
              <div className="section-title-group">
                <span className="section-tag">Availability</span>
                <h2>Service Availability &amp; Downtime</h2>
              </div>
            </div>

            <p>We aim to keep the BBG website and Services available at all times, but we cannot guarantee uninterrupted access.</p>

            <h3>Planned Maintenance</h3>
            <p>We will endeavour to announce planned maintenance periods via our Instagram (@bnbgirls.podcast) and newsletter with reasonable advance notice. Maintenance windows will typically occur during low-traffic hours (AEDT midnight–6am).</p>

            <h3>Unplanned Downtime</h3>
            <p>BBG is not liable for unplanned outages, server failures, or third-party service disruptions (including Buzzsprout, YouTube, or hosting provider outages). We will restore services as promptly as possible.</p>

            <h3>Content Removal</h3>
            <p>BBG reserves the right to remove, modify, or restrict any episode, PDF, guide, or other content from our Services at any time. We will provide reasonable notice where a major content change affects active mentorship participants or community members.</p>

            <h3>Feature Changes</h3>
            <p>We continuously improve our Services. Features may be added, modified, or discontinued at any time. Significant changes to core features (e.g. gamification, mentorship matching) will be communicated via our newsletter.</p>
          </section>

          <div className="divider"></div>

          {/* 15. TERMINATION */}
          <section className="tos-section" id="s15">
            <div className="section-header">
              <div className="section-num">15</div>
              <div className="section-title-group">
                <span className="section-tag">Termination</span>
                <h2>Termination of Access</h2>
              </div>
            </div>

            <h3>By BBG</h3>
            <p>BBG may suspend or permanently terminate your access to the Services — including account access, mentorship participation, and community features — at our discretion and without prior notice if we believe you have:</p>
            <ul>
              <li>Violated these Terms or any BBG policy.</li>
              <li>Engaged in conduct that harms other users, the community, or the reputation of BBG.</li>
              <li>Provided false or fraudulent information to BBG.</li>
              <li>Engaged in any illegal activity through our Services.</li>
            </ul>

            <h3>By You</h3>
            <p>You may discontinue use of BBG Services at any time. To delete your account and associated data, email <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> with the subject "Delete My Account".</p>

            <h3>Effect of Termination</h3>
            <p>Upon termination, your right to use the Services ceases immediately. Provisions of these Terms that by their nature should survive termination (including Sections 9, 10, 11, 12, 13, and 16) will continue in full force.</p>
          </section>

          <div className="divider"></div>

          {/* 16. DISPUTE RESOLUTION */}
          <section className="tos-section" id="s16">
            <div className="section-header">
              <div className="section-num">16</div>
              <div className="section-title-group">
                <span className="section-tag">Disputes</span>
                <h2>Dispute Resolution</h2>
              </div>
            </div>

            <p>We genuinely hope you never have a dispute with us. If you do, here is how we handle it.</p>

            <h3>Step 1 — Informal Resolution</h3>
            <p>Before initiating any formal proceedings, please contact us at <a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>sanah@bnbgirls.com</a> with a clear description of your concern. We will acknowledge your message within 5 business days and make a genuine effort to resolve the issue within 20 business days.</p>

            <h3>Step 2 — Mediation</h3>
            <p>If informal resolution fails, the parties agree to attempt mediation through a mutually agreed mediator before pursuing litigation. Mediation costs will be shared equally unless otherwise agreed.</p>

            <h3>Step 3 — Litigation</h3>
            <p>If mediation is unsuccessful, disputes shall be resolved through the courts of New South Wales, Australia, under Australian law. Both parties submit to the non-exclusive jurisdiction of those courts.</p>

            <div className="callout info">
              <div className="callout-icon">🤝</div>
              <div className="callout-body">
                <div className="callout-title">Our Commitment</div>
                <p>BBG is a small, mission-driven team. We genuinely want to resolve any issue fairly and quickly. An email to us is almost always the fastest path to a solution.</p>
              </div>
            </div>
          </section>

          <div className="divider"></div>

          {/* 18. CHANGES */}
          <section className="tos-section" id="s18">
            <div className="section-header">
              <div className="section-num">18</div>
              <div className="section-title-group">
                <span className="section-tag">Updates</span>
                <h2>Changes to These Terms</h2>
              </div>
            </div>

            <p>We may update these Terms from time to time to reflect changes in our Services, legal requirements, or community needs.</p>

            <h3>How We Notify You</h3>
            <ul>
              <li>Minor updates (grammar, clarifications, non-material changes): updated silently without notice.</li>
              <li>Material changes: announced via the BBG newsletter and the ticker bar on the homepage at least 14 days before taking effect.</li>
              <li>Changes that affect active mentorship participants: notified directly by email.</li>
            </ul>

            <h3>Your Continued Use</h3>
            <p>Your continued use of the Services after any updated Terms are published constitutes your acceptance of those changes. If you do not agree with updated Terms, you should discontinue use of the Services.</p>

            <p>Previous versions of these Terms are available upon request by emailing <a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a>.</p>
          </section>

          <div className="divider"></div>

          {/* 19. CONTACT */}
          <section className="tos-section" id="s19">
            <div className="section-header">
              <div className="section-num">19</div>
              <div className="section-title-group">
                <span className="section-tag">Get in Touch</span>
                <h2>Contact Us</h2>
              </div>
            </div>

            <p>If you have any questions, concerns, or requests related to these Terms, please reach out to us. We're a real team and we read every message.</p>

            <div className="tos-table-wrap">
              <table className="tos-table">
                <thead>
                  <tr><th>Matter</th><th>Contact Method</th><th>Response Time</th></tr>
                </thead>
                <tbody>
                  <tr><td>General Terms questions</td><td><a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)' }}>sanah@bnbgirls.com</a></td><td>5 business days</td></tr>
                  <tr><td>Privacy & data requests</td><td><a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> · subject: "Privacy Request"</td><td>5 business days</td></tr>
                  <tr><td>Account deletion</td><td><a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> · subject: "Delete My Account"</td><td>30 days</td></tr>
                  <tr><td>Copyright / IP concerns</td><td><a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> · subject: "Copyright Request"</td><td>10 business days</td></tr>
                  <tr><td>Safeguarding / urgent concerns</td><td><a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> · subject: "Safeguarding"</td><td>24 hours</td></tr>
                  <tr><td>Mentorship issues</td><td><a href="mailto:sanah@bnbgirls.com">sanah@bnbgirls.com</a> · subject: "Mentorship Support"</td><td>5 business days</td></tr>
                </tbody>
              </table>
            </div>

            <p>You can also reach us on Instagram: <a href="https://instagram.com/bnbgirls.podcast" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>@bnbgirls.podcast</a></p>
          </section>

          {/* ACCEPTANCE BANNER */}
          <div className="acceptance-banner">
            <span className="sparkle">✨</span>
            <h3>Ready to Build Your Future?</h3>
            <p>Now that you know the rules, let's start your journey. Connect with mentors, listen to inspiring stories, and find your path.</p>
            <div className="banner-btns">
              <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="btn-gold">Back to Home</a>
              <a href="/find-your-path" onClick={(e) => { e.preventDefault(); window.location.href = '/find-your-path'; }} className="btn-outline">Take Career Quiz</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
