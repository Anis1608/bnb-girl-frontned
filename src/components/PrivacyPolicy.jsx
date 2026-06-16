import React, { useState, useEffect } from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview');

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
          Policies & Legal
        </div>
        <h1>Policies &amp; <span class="gold">Legal</span></h1>
        <p className="policy-hero-sub">Transparency, trust, and protection — for every bold and brilliant girl in our community.</p>
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
                href="#overview"
                className={activeSection === 'overview' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'overview')}
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                className={activeSection === 'privacy' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'privacy')}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#terms"
                className={activeSection === 'terms' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'terms')}
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href="#content"
                className={activeSection === 'content' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'content')}
              >
                Content Disclaimer
              </a>
            </li>
            <li>
              <a
                href="#copyright"
                className={activeSection === 'copyright' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'copyright')}
              >
                Copyright & IP
              </a>
            </li>
            <li>
              <a
                href="#minors"
                className={activeSection === 'minors' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'minors')}
              >
                Minor Participation Policy
              </a>
            </li>
            <li>
              <a
                href="#guest"
                className={activeSection === 'guest' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'guest')}
              >
                Guest Notice
              </a>
            </li>
            <li>
              <a
                href="#cookies"
                className={activeSection === 'cookies' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'cookies')}
              >
                Cookies & Tracking
              </a>
            </li>
            <li>
              <a
                href="#community"
                className={activeSection === 'community' ? 'active' : ''}
                onClick={(e) => handleScrollToSection(e, 'community')}
              >
                Community Guidelines
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
          {/* OVERVIEW */}
          <section className="policy-section" id="overview">
            <span className="section-tag">Overview</span>
            <h2>Our Commitment to You</h2>

            <p>Bold & Brilliant Girls ("BBG", "we", "us", or "our") is dedicated to creating a safe, empowering, and trustworthy space for young women to discover career possibilities, connect with mentors, and build community. These policies govern your use of our website, podcast, resources, and community programmes.</p>

            <div className="pull-quote">
              <p>We believe every young woman deserves a space that is honest, safe, and genuinely committed to her growth. These policies are how we protect that promise.</p>
            </div>

            <div className="last-updated-grid">
              <div className="update-card">
                <div className="update-label">Document Version</div>
                <div className="update-value">v4.0</div>
              </div>
              <div className="update-card">
                <div className="update-label">Last Updated</div>
                <div className="update-value">March 2, 2026</div>
              </div>
              <div className="update-card">
                <div className="update-label">Effective From</div>
                <div className="update-value">March 2, 2026</div>
              </div>
            </div>

            <p>By accessing or using the BBG website (bnbgirls.com), podcast, community features, or any related services, you agree to be bound by these policies. If you do not agree, please discontinue use of our services.</p>
          </section>

          <div className="section-divider"></div>

          {/* PRIVACY POLICY */}
          <section className="policy-section" id="privacy">
            <span className="section-tag">Privacy Policy</span>
            <h2>Privacy Policy</h2>

            <p>Your privacy matters deeply to us. This policy explains what information we collect, how we use it, and the choices you have.</p>

            <h3>Information We Collect</h3>
            <ul>
              <li><strong>Information you provide:</strong> Name, email address, age, and career interests when you submit forms (mentorship applications, guest applications, community sign-ups).</li>
              <li><strong>Usage data:</strong> Episode listening progress, quiz responses, and PDF downloads stored locally in your browser (localStorage) — no account required for these features.</li>
              <li><strong>Account data (optional):</strong> If you create a BBG account to unlock gamification features, we store your badge progress and streak counts on our servers.</li>
              <li><strong>Comments & community posts:</strong> Name, email, and any content you voluntarily submit to our discussion areas.</li>
              <li><strong>Contact information:</strong> Any correspondence you send to sanah@bnbgirls.com.</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <ul>
              <li>To match mentorship applicants with suitable mentors.</li>
              <li>To send personalised episode recommendations (only if you opt in).</li>
              <li>To improve our content, website functionality, and community programmes.</li>
              <li>To send the BBG newsletter and Tip of the Week email (only if subscribed).</li>
              <li>To moderate community discussions and maintain a safe environment.</li>
              <li>To comply with legal obligations.</li>
            </ul>

            <div className="highlight-box purple">
              <div className="highlight-title">🔒 Our Promise</div>
              <p style={{ margin: 0, fontSize: '15px' }}>We will <strong>never sell, rent, or trade your personal information</strong> to third parties for commercial purposes. BBG products are ad-free and we do not allow advertisers to target our community members.</p>
            </div>

            <h3>Data Storage & Security</h3>
            <p>Your data is stored securely on servers located within Australia. We use industry-standard encryption (HTTPS/TLS) for all data in transit. Listening progress and quiz results are stored in your browser's localStorage and never transmitted to our servers unless you create an account.</p>

            <h3>Your Rights</h3>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data at any time.</li>
              <li>Withdraw consent for email communications (unsubscribe link in every email).</li>
              <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC).</li>
            </ul>

            <h3>Third-Party Services</h3>
            <table className="policy-table">
              <thead>
                <tr><th>Service</th><th>Purpose</th><th>Privacy Policy</th></tr>
              </thead>
              <tbody>
                <tr><td>Buzzsprout / Anchor</td><td>Audio hosting & distribution</td><td>Their respective policies apply</td></tr>
                <tr><td>YouTube</td><td>Video embeds (click-to-load only)</td><td>Google Privacy Policy</td></tr>
                <tr><td>Mailchimp</td><td>Email newsletter</td><td>Mailchimp Privacy Policy</td></tr>
                <tr><td>Disqus (optional)</td><td>Episode comments</td><td>Disqus Privacy Policy</td></tr>
                <tr><td>Spotify / Apple Podcasts</td><td>Podcast distribution</td><td>Their respective policies apply</td></tr>
                <tr><td>Google Analytics 4</td><td>Anonymous site usage analytics</td><td>Google Privacy Policy</td></tr>
              </tbody>
            </table>

            <p>To contact us regarding your privacy, email <a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>sanah@bnbgirls.com</a> with the subject line "Privacy Request".</p>
          </section>

          <div className="section-divider"></div>

          {/* TERMS OF USE */}
          <section className="policy-section" id="terms">
            <span className="section-tag">Terms of Use</span>
            <h2>Terms of Use</h2>

            <p>By using the BBG website, podcast, or community features, you agree to the following terms.</p>

            <h3>Acceptable Use</h3>
            <ul>
              <li>Use our content and services for personal, non-commercial, educational purposes only.</li>
              <li>Engage respectfully with all community members, guests, mentors, and the BBG team.</li>
              <li>Provide accurate information in all form submissions and applications.</li>
              <li>Notify us if you are under 18 so we can apply appropriate safeguards.</li>
            </ul>

            <h3>Prohibited Conduct</h3>
            <ul>
              <li>Reproducing, distributing, or commercialising any BBG content without written permission.</li>
              <li>Harassing, threatening, or discriminating against any community member or guest.</li>
              <li>Submitting false or misleading information in mentorship or guest applications.</li>
              <li>Attempting to access, disrupt, or interfere with our website or servers.</li>
              <li>Using automated tools to scrape, copy, or harvest our content or data.</li>
              <li>Impersonating any BBG team member, guest, or mentor.</li>
            </ul>

            <div className="highlight-box gold">
              <div className="highlight-title">⚠️ Enforcement</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Violations may result in removal from the community, cancellation of mentorship matching, and/or legal action where applicable. We reserve the right to refuse service to anyone who breaches these terms.</p>
            </div>

            <h3>Limitation of Liability</h3>
            <p>BBG provides its content, resources, and mentorship matching in good faith for educational and inspirational purposes. We do not guarantee specific career outcomes. Career decisions are ultimately your own responsibility. BBG is not liable for decisions made based on podcast content, mentor advice, or website resources.</p>

            <h3>Changes to Terms</h3>
            <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms. Material changes will be announced via our newsletter and the ticker bar on the homepage.</p>
          </section>

          <div className="section-divider"></div>

          {/* CONTENT DISCLAIMER */}
          <section className="policy-section" id="content">
            <span className="section-tag">Content Disclaimer</span>
            <h2>Content Disclaimer</h2>

            <p>The Bold & Brilliant Girls podcast, website, and all associated content are intended for inspirational and educational purposes only.</p>

            <h3>Not Professional Advice</h3>
            <div className="highlight-box pink">
              <div className="highlight-title">📢 Important Notice</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Content published by BBG, including guest interviews, mentor guidance, career guides, and PDF resources, does <strong>not</strong> constitute professional legal, financial, medical, or psychological advice. Always consult a qualified professional for advice specific to your situation.</p>
            </div>

            <h3>Guest Opinions</h3>
            <p>Views, opinions, and experiences expressed by podcast guests are their own and do not necessarily represent the views of Bold & Brilliant Girls, its team, or sponsors. We do not independently verify all claims made by guests during episodes.</p>

            <h3>Accuracy of Information</h3>
            <p>We strive to ensure all published content is current and accurate, however information may become outdated. We recommend verifying career statistics, salary data, and industry information through authoritative sources before making important decisions.</p>

            <h3>External Links</h3>
            <p>Our website, episode PDFs, and resource guides may contain links to external websites. BBG is not responsible for the content, privacy practices, or accuracy of third-party websites. Inclusion of a link does not constitute endorsement.</p>
          </section>

          <div className="section-divider"></div>

          {/* COPYRIGHT & IP */}
          <section className="policy-section" id="copyright">
            <span className="section-tag">Copyright & IP</span>
            <h2>Copyright & Intellectual Property</h2>

            <p>All content created by Bold & Brilliant Girls is protected by copyright and intellectual property law.</p>

            <h3>What We Own</h3>
            <ul>
              <li>All podcast episodes (audio and video recordings).</li>
              <li>Episode PDFs, career guides, and downloadable templates.</li>
              <li>The BBG logo, brand assets, colour system, and visual identity.</li>
              <li>Written content including show notes, transcripts, blog articles, and quick tips.</li>
              <li>The BBG website design, code, and gamification system.</li>
              <li>The Career Quiz content, outcomes, and result copy.</li>
            </ul>

            <h3>What You May Do</h3>
            <ul>
              <li>Download and use episode PDFs for your own personal, non-commercial use.</li>
              <li>Share links to BBG episodes and articles on social media (we love this!).</li>
              <li>Quote brief excerpts (under 50 words) from BBG content with clear attribution to Bold & Brilliant Girls and a link to the source.</li>
            </ul>

            <h3>What You May NOT Do</h3>
            <ul>
              <li>Re-upload, redistribute, or republish BBG episode audio or video without written permission.</li>
              <li>Use BBG logos or brand assets without permission.</li>
              <li>Create derivative works from BBG content for commercial purposes.</li>
              <li>Remove copyright or attribution notices from downloaded resources.</li>
            </ul>

            <p>To request permission for use beyond these terms, email <a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>sanah@bnbgirls.com</a> with subject line "Copyright Request".</p>

            <h3>Guest & Contributor IP</h3>
            <p>By participating in a BBG episode, guests grant BBG a non-exclusive, royalty-free licence to publish, distribute, and promote their appearance in perpetuity across all platforms. Guests retain ownership of their original intellectual property discussed during the episode.</p>

            <p>© 2026 Bold & Brilliant Girls. All rights reserved.</p>
          </section>

          <div className="section-divider"></div>

          {/* MINOR PARTICIPATION POLICY */}
          <section className="policy-section" id="minors">
            <span className="section-tag">Minor Participation</span>
            <h2>Minor Participation Policy</h2>

            <div className="highlight-box dark">
              <div className="highlight-title">🛡️ Child Safety First</div>
              <p>The safety and wellbeing of young people is our highest priority. We have specific safeguards in place for any participant under the age of 18.</p>
            </div>

            <h3>Age of Participants</h3>
            <p>The BBG mentorship programme welcomes applicants aged 14–25. General use of the website (listening to episodes, accessing resources, participating in the career quiz) is appropriate for all ages.</p>

            <h3>Under-18 Safeguards</h3>
            <ul>
              <li>Mentorship applicants under 18 must provide a parent or guardian email address. We will contact the parent/guardian to confirm consent before proceeding with any match.</li>
              <li>Parental/guardian consent is required in writing before any under-18 participant is featured in a podcast episode.</li>
              <li>Mentorship sessions involving under-18 participants follow a structured, documented format with regular check-ins from the BBG team.</li>
              <li>Under-18 participants in the community are not permitted to share personal identifying information (school name, home address, or phone number) in public discussion areas.</li>
            </ul>

            <h3>Data Protection for Minors</h3>
            <p>We collect only the minimum necessary personal data from under-18 participants. Parent/guardian data collected for consent purposes is stored securely and not used for marketing. We will never share a minor's personal information with third parties without explicit written parental consent.</p>

            <h3>Reporting Concerns</h3>
            <p>If you have a concern about the safety of a minor in our community, please contact us immediately at <a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>sanah@bnbgirls.com</a>. We take all safeguarding concerns seriously and will respond within 24 hours.</p>
          </section>

          <div className="section-divider"></div>

          {/* GUEST NOTICE */}
          <section className="policy-section" id="guest">
            <span className="section-tag">Guest Notice</span>
            <h2>Guest Notice</h2>

            <p>Thank you for sharing your story with the Bold & Brilliant Girls community. Please read the following before your episode recording.</p>

            <h3>Recording & Distribution</h3>
            <ul>
              <li>Episodes may be distributed on Spotify, Apple Podcasts, YouTube, Google Podcasts, and any other platform where BBG publishes content — now or in the future.</li>
              <li>Episode audio and video may be edited for clarity, length, and quality. You will be given reasonable opportunity to review before publication.</li>
              <li>Short clips from your episode may be shared on Instagram, TikTok, YouTube Shorts, and other social media channels for promotional purposes.</li>
              <li>Your episode may be evergreen content that remains published and promoted indefinitely.</li>
            </ul>

            <h3>Guest Responsibilities</h3>
            <ul>
              <li>Ensure you have the right to share all information, stories, and opinions during your appearance.</li>
              <li>Do not disclose confidential, commercially sensitive, or legally privileged information belonging to current or former employers.</li>
              <li>Notify us in advance of any topics or questions you are not comfortable discussing.</li>
              <li>Provide accurate biographical information for use in show notes, PDF downloads, and the BBG guest directory.</li>
            </ul>

            <div className="highlight-box purple">
              <div className="highlight-title">📝 Episode PDF</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Your episode will include a downloadable PDF summary featuring your bio, key takeaways, and quotes. You will receive a copy before publication. This PDF is made available free to our community and may be distributed widely.</p>
            </div>

            <h3>Withdrawal of Consent</h3>
            <p>If you wish to request removal of your episode after publication, please email <a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>sanah@bnbgirls.com</a>. Removal requests will be considered on a case-by-case basis. Please note that once distributed to third-party podcast platforms, complete removal from all caches may take additional time beyond our control.</p>
          </section>

          <div className="section-divider"></div>

          {/* COOKIES */}
          <section className="policy-section" id="cookies">
            <span className="section-tag">Cookies & Tracking</span>
            <h2>Cookies & Tracking</h2>

            <p>We aim to be transparent about how we track your activity on our site.</p>

            <h3>What We Use</h3>
            <table className="policy-table">
              <thead>
                <tr><th>Type</th><th>What It Does</th><th>Can You Opt Out?</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>localStorage</strong></td>
                  <td>Stores your episode progress, quiz results, dark mode preference, and badge progress in your browser. Never sent to our servers.</td>
                  <td>Yes — clear your browser data at any time.</td>
                </tr>
                <tr>
                  <td><strong>Essential Cookies</strong></td>
                  <td>Required for the website to function (session management, form security tokens).</td>
                  <td>No — these are necessary for the site to work.</td>
                </tr>
                <tr>
                  <td><strong>Analytics (GA4)</strong></td>
                  <td>Anonymous usage data: page views, time on site, popular episodes. No personally identifiable data.</td>
                  <td>Yes — use the cookie preference banner or a browser extension.</td>
                </tr>
                <tr>
                  <td><strong>YouTube Cookies</strong></td>
                  <td>Only loaded when you click to play a YouTube video embed. Activates YouTube's own tracking.</td>
                  <td>Yes — videos are click-to-load. Your choice to activate them.</td>
                </tr>
              </tbody>
            </table>

            <h3>Do Not Track</h3>
            <p>We respect browser Do Not Track (DNT) signals. When DNT is enabled, we disable Google Analytics tracking for your session.</p>
          </section>

          <div className="section-divider"></div>

          {/* COMMUNITY GUIDELINES */}
          <section className="policy-section" id="community">
            <span className="section-tag">Community Guidelines</span>
            <h2>Community Guidelines</h2>

            <p>The BBG community exists to uplift, inspire, and support every young woman on her career journey. These guidelines keep our space safe and positive.</p>

            <div className="pull-quote">
              <p>We are bold, brilliant, and kind. Our community is built on the belief that lifting each other up is how we all rise higher.</p>
            </div>

            <h3>We Welcome</h3>
            <ul>
              <li>Genuine questions about careers, study, and professional growth.</li>
              <li>Sharing your own experiences, wins, and lessons — however big or small.</li>
              <li>Thoughtful, constructive feedback on ideas and resources.</li>
              <li>Diverse perspectives across industries, backgrounds, cultures, and career stages.</li>
              <li>Celebrating each other's achievements enthusiastically.</li>
            </ul>

            <h3>We Do Not Tolerate</h3>
            <ul>
              <li>Harassment, bullying, or targeted unkindness toward any person.</li>
              <li>Discrimination based on race, gender, sexuality, religion, disability, or background.</li>
              <li>Spam, self-promotion, or unsolicited commercial messaging.</li>
              <li>Sharing of misleading information presented as fact.</li>
              <li>Sharing personal information about others without their consent.</li>
              <li>Content that demeans, objectifies, or sexualises any person.</li>
            </ul>

            <h3>Moderation</h3>
            <p>Comments and community posts are moderated by the BBG team. We reserve the right to remove any content that violates these guidelines without notice, and to ban users who repeatedly or seriously breach them.</p>

            <h3>Reporting</h3>
            <p>If you encounter content or behaviour that concerns you, please email <a href="mailto:sanah@bnbgirls.com" style={{ color: 'var(--purple-mid)', fontWeight: 600 }}>sanah@bnbgirls.com</a>. All reports are treated confidentially. We aim to review all reports within 48 hours.</p>
          </section>

          {/* CONTACT CARD */}
          <div className="contact-card">
            <h3>Questions About Our Policies?</h3>
            <p>We're a real team and we're happy to answer any questions you have about these policies, your data, or how we work.</p>
            <a href="mailto:sanah@bnbgirls.com" className="contact-btn">✉ sanah@bnbgirls.com</a>
            <p style={{ marginTop: '16px', fontSize: '12px' }}>We aim to respond within 5 business days.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
