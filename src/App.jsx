import React, { useState, useEffect, useRef } from 'react';

// Import all custom components
import Navbar from './components/Navbar';
import About from './components/About';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Mission from './components/Mission';
import Episodes from './components/Episodes';
import Ask from './components/Ask';
import Why from './components/Why';
import Path from './components/Path';
import Series from './components/Series';
import Spotlight from './components/Spotlight';
import Stats from './components/Stats';
import Resources from './components/Resources';
import Community from './components/Community';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { VideoModal, AudioModal, GuestModal, SearchOverlay, GuestInfoModal } from './components/Modals';
import EpisodesPage from './components/EpisodesPage';
import ResourcesPage from './components/ResourcesPage';
import JoinUs from './components/JoinUs';
import FindYourPath from './components/FindYourPath';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Mentorship from './components/Mentorship';
import Dashboard from './components/Dashboard';
import MinorDisclaimer from './components/MinorDisclaimer';
import BecomeMentor from './components/BecomeMentor';
import MentorDashboard from './components/MentorDashboard';
import UnsubscribePage from './components/UnsubscribePage';
import './App.css';


import { useLocation, useNavigate } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map route path to activeNav key
  const getActiveNavFromPath = (pathname) => {
    switch (pathname) {
      case '/about-us': return 'about';
      case '/episodes': return 'episodes';
      case '/resources': return 'resources';
      case '/join-us': return 'joinus';
      case '/find-your-path': return 'quiz';
      case '/privacy-policy': return 'privacy';
      case '/terms-of-service': return 'terms';
      case '/minor-disclaimer': return 'disclaimer';
      case '/mentorship': return 'mentorship';
      case '/dashboard': return 'dashboard';
      case '/become-a-mentor': return 'become-mentor';
      case '/mentor-dashboard': return 'mentor-dashboard';
      case '/unsubscribe': return 'unsubscribe';
      case '/home':
      case '/':
      default:
        return 'home';
    }
  };

  const activeNav = getActiveNavFromPath(location.pathname);

  // URL routing transitions
  const handleNavChange = (nav) => {
    const targetPathMap = {
      about: '/about-us',
      episodes: '/episodes',
      resources: '/resources',
      joinus: '/join-us',
      quiz: '/find-your-path',
      privacy: '/privacy-policy',
      terms: '/terms-of-service',
      disclaimer: '/minor-disclaimer',
      mentorship: '/mentorship',
      dashboard: '/dashboard',
      'become-mentor': '/become-a-mentor',
      'mentor-dashboard': '/mentor-dashboard',
      unsubscribe: '/unsubscribe',
      home: '/'
    };
    
    const targetPath = targetPathMap[nav];
    if (targetPath) {
      if (location.pathname === targetPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(targetPath);
      }
    }
  };

  // Handle scroll reset and hash scrolls when route/hash changes
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Dynamic SEO Page Title & Description Updates
  useEffect(() => {
    const seoConfig = {
      home: {
        title: "Bold & Brilliant Girls — Empowering Career Conversations & Mentorship",
        description: "Bold & Brilliant Girls connects ambitious young women and teens with accomplished female leaders through authentic career discussions, 1-on-1 mentorship, and free downloadable resources."
      },
      about: {
        title: "About Sanah — Meet the Founder of Bold & Brilliant Girls",
        description: "Discover the story behind Bold & Brilliant Girls and why Sanah started a platform to help teens and young women explore career paths with accomplished female mentors."
      },
      episodes: {
        title: "Podcast Episodes — Authentic Career Insight Masterclasses",
        description: "Listen to real career stories from inspiring women in STEM, finance, law, medicine, creative arts, and entrepreneurship on the Bold & Brilliant Girls Podcast."
      },
      resources: {
        title: "Resource Library — Free Career PDF Guides, Templates, & Salary Reports",
        description: "Browse free downloadable worksheets, resume templates, and salary reports designed to help young women launch successful careers in competitive industries."
      },
      mentorship: {
        title: "Get 1-on-1 Mentorship — Connect with Professional Female Leaders",
        description: "Apply to book free 1-on-1 video mentorship sessions with established professionals at Google, Spotify, top law firms, and fintech start-ups."
      },
      quiz: {
        title: "Find Your Path — Career Selection Quiz",
        description: "Take the BBG career selection assessment to discover which specialized fields align best with your skills, goals, and passions."
      },
      joinus: {
        title: "Join Our Community — Empowering the Next Generation of Women",
        description: "Be part of a support network of ambitious girls sharing resources, motivation, and professional advice."
      },
      dashboard: {
        title: "Student Dashboard — Manage Your Bookings & Downloads",
        description: "Log in to your student dashboard to review pending mentorship sessions, bookings, and unlocked resources."
      },
      'become-mentor': {
        title: "Become a Mentor — Empower Young Female Minds",
        description: "Share your professional expertise and inspire the next generation of ambitious leaders. Join the Bold & Brilliant Girls mentor program."
      },
      'mentor-dashboard': {
        title: "Mentor Portal — Manage Bookings & Availability",
        description: "Manage your mentorship sessions, set availability schedules, and review student application profiles."
      }
    };

    const currentSeo = seoConfig[activeNav] || seoConfig.home;
    document.title = currentSeo.title;
    
    // Update or create meta description tag dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", currentSeo.description);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", currentSeo.description);
      document.head.appendChild(metaDesc);
    }
  }, [activeNav]);

  const [activeGuestInfoModal, setActiveGuestInfoModal] = useState(null);
  const [activeGuestModal, setActiveGuestModal] = useState(null); // EP index
  const [activeVideoModal, setActiveVideoModal] = useState(null); // YT videoId
  const [activeAudioModal, setActiveAudioModal] = useState(null); // EP index
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, icon: '', text: '', sub: '' });

  const showToast = (icon, text, sub) => {
    setToast({ visible: true, icon, text, sub });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Keyboard navigation shortcuts (ESC to close modals, Ctrl+K/Cmd+K to search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveGuestModal(null);
        setActiveVideoModal(null);
        setActiveAudioModal(null);
        setIsSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Control body scrolling when a modal is active
  useEffect(() => {
    const isModalOpen =
      activeGuestModal !== null ||
      activeGuestInfoModal !== null ||
      activeVideoModal !== null ||
      activeAudioModal !== null ||
      isSearchOpen;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeGuestModal, activeGuestInfoModal, activeVideoModal, activeAudioModal, isSearchOpen]);

  // Synchronize modal state with browser history stack (Back button closes modal)
  const anyModalOpen = !!(
    activeVideoModal ||
    activeAudioModal ||
    activeGuestModal !== null ||
    activeGuestInfoModal ||
    isSearchOpen
  );
  const prevModalOpenRef = useRef(false);
  // Flag: modal was closed via browser back button (popstate), so don't call history.back() again
  const closedByPopStateRef = useRef(false);

  useEffect(() => {
    if (anyModalOpen && !prevModalOpenRef.current) {
      // First modal opening -> push state to history stack
      if (!window.history.state || !window.history.state.modalOpen) {
        window.history.pushState({ modalOpen: true }, '');
      }
    } else if (!anyModalOpen && prevModalOpenRef.current) {
      // All modals closed -> only call history.back() if NOT already triggered by back button
      if (!closedByPopStateRef.current && window.history.state && window.history.state.modalOpen) {
        window.history.back();
      }
      closedByPopStateRef.current = false;
    }
    prevModalOpenRef.current = anyModalOpen;
  }, [anyModalOpen]);

  useEffect(() => {
    const handlePopState = (e) => {
      // Mark that closure was triggered by browser back, so anyModalOpen effect won't back() again
      closedByPopStateRef.current = true;
      // Close all modals when browser Back button is pressed
      setActiveVideoModal(null);
      setActiveAudioModal(null);
      setActiveGuestModal(null);
      setActiveGuestInfoModal(null);
      setIsSearchOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isMentorDashboard = activeNav === 'mentor-dashboard';

  return (
    <>
      {/* 1. Header Navigation */}
      {!isMentorDashboard && (
        <Navbar
          onSearchOpen={() => setIsSearchOpen(true)}
          activeNav={activeNav}
          onNavChange={handleNavChange}
        />
      )}

      <div className="route-transition-wrap" key={activeNav}>
        {activeNav === 'about' ? (
          <About />
        ) : activeNav === 'episodes' ? (
          <EpisodesPage
            onOpenGuestModal={setActiveGuestModal}
            onOpenAudioPlayer={setActiveAudioModal}
            onShowToast={showToast}
          />
        ) : activeNav === 'resources' ? (
          <ResourcesPage
            onNavChange={handleNavChange}
            onShowToast={showToast}
          />
        ) : activeNav === 'joinus' ? (
          <JoinUs
            onShowToast={showToast}
            onNavChange={handleNavChange}
          />
        ) : activeNav === 'quiz' ? (
          <FindYourPath
            onShowToast={showToast}
            onNavChange={handleNavChange}
          />
        ) : activeNav === 'privacy' ? (
          <PrivacyPolicy />
        ) : activeNav === 'terms' ? (
          <TermsOfService />
        ) : activeNav === 'disclaimer' ? (
          <MinorDisclaimer />
        ) : activeNav === 'mentorship' ? (
          <Mentorship
            onShowToast={showToast}
            onNavChange={handleNavChange}
          />
        ) : activeNav === 'become-mentor' ? (
          <BecomeMentor
            onShowToast={showToast}
          />
        ) : activeNav === 'mentor-dashboard' ? (
          <MentorDashboard
            onShowToast={showToast}
          />
        ) : activeNav === 'unsubscribe' ? (
          <UnsubscribePage
            onShowToast={showToast}
          />
        ) : activeNav === 'dashboard' ? (
          <Dashboard
            onShowToast={showToast}
            onNavChange={handleNavChange}
          />
        ) : (
          <>
            {/* 2. Hero Presentation */}
            <Hero onWatchNow={() => handleNavChange('episodes')} onFindMentor={() => handleNavChange('mentorship')} />

            {/* 3. Infinite News Ticker */}
            <Ticker />

            {/* 4. Brand Purpose & Author Info */}
            <Mission />

            {/* 5. Editor's Picks Episodes Grid */}
            <Episodes
              onOpenGuestModal={setActiveGuestModal}
              onOpenAudioPlayer={setActiveAudioModal}
              onShowToast={showToast}
            />

            {/* 6. Ask or Suggest Guest Form */}
            <Ask onShowToast={showToast} />

            {/* 7. Why Bold & Brilliant Girls? 3D Flip Cards */}
            <Why />

            {/* 8. Curated Collections Series slider */}
            <Series />

            {/* 9. Spotlight Featured Guest Biography */}
            <Spotlight
              onOpenGuestModal={setActiveGuestModal}
              onOpenAudioPlayer={setActiveAudioModal}
              onOpenGuestInfo={setActiveGuestInfoModal}
            />

            {/* 10. Scroll Statistics & Testimonial Carousel */}
            <Stats />

            {/* 11. Simple Mentorship Action Call */}
            <section className="mentorship-cta reveal visible" id="mentorship">
              <div className="container">
                <h2 className="mentorship-cta__h2">Find Your Mentor. Find Your Path.</h2>
                <p className="mentorship-cta__sub">Connect 1-on-1 with professionals who'll guide your journey.</p>
                <a
                  href="/mentorship"
                  className="btn btn--primary"
                  style={{ margin: '0 auto', fontSize: '15px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavChange('mentorship');
                  }}
                >
                  Apply for Mentorship →
                </a>
              </div>
            </section>

            {/* 12. Spark / Path Selection */}
            <Path />

            {/* 13. Downloadable Resources Library */}
            <Resources onShowToast={showToast} />

            {/* 14. Community Counter, Email signup, and Socials */}
            <Community onShowToast={showToast} />
          </>
        )}
      </div>

      {/* 15. Footer Links, Copyright and Back-to-top button */}
      {!isMentorDashboard && <Footer />}

      {/* ══ MODALS PORTAL OVERLAYS ══ */}
      
      {/* YT Video Overlay */}
      <VideoModal
        videoId={activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
      />

      {/* Audio Mock Player Scrubber Overlay */}
      <AudioModal
        episodeIndex={activeAudioModal}
        onClose={() => setActiveAudioModal(null)}
      />

      {/* Guest Bio Details & Tabs Overlay */}
      <GuestModal
        episodeIndex={activeGuestModal}
        onClose={() => setActiveGuestModal(null)}
        onOpenVideo={setActiveVideoModal}
        onOpenAudio={setActiveAudioModal}
        onShowToast={showToast}
      />

      {/* Guest Info Full Profile Overlay (from Spotlight 'Guest Info' button) */}
      <GuestInfoModal
        episode={activeGuestInfoModal}
        onClose={() => setActiveGuestInfoModal(null)}
        onOpenVideo={setActiveVideoModal}
        onOpenAudio={setActiveAudioModal}
      />

      {/* Search Input Filter Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenVideo={setActiveVideoModal}
      />

      {/* Temporary badge success toast */}
      <Toast
        toast={toast}
        onClose={hideToast}
      />
    </>
  );
}
