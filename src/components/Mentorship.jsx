import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Mentorship.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STRIPE_PK = (import.meta.env && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) || 'pk_test_YOUR_KEY';
const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5002';

// Hardcoded mentors matching the ones from final mentorship.txt
const STATIC_MENTORS = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    role: 'Senior Product Manager · Google',
    photo: '',
    bio: "Ex-startup PM, now Senior PM at Google. I help women break into product and negotiate offers they're proud of.",
    quote: '',
    availability: 'Tomorrow',
    cat_name: 'Technology',
    expertise_areas: ['Career pivots', 'PM interviews', 'Negotiation'],
    city: 'Mumbai',
    hook: 'Helped 40+ women break into product roles at Google, Meta and Amazon.',
    durs: ['30', '60'],
    slots: ["09:00", "09:30", "10:00", "11:00", "11:30", "14:00", "14:30", "15:00", "16:00", "16:30"],
    busy: ["11:00", "15:00"],
    p30: '$20',
    p60: '$36',
    rating: '4.9',
    sessions: '128',
    resp: "Usually replies in ~2h",
    lang: "English · Hindi"
  },
  {
    id: 'vanya',
    name: 'Vanya Mehta',
    role: 'Founder & CEO · FinTech',
    photo: '',
    bio: "Raised $2M and scaled a fintech to 50k users. I demystify fundraising and early growth for women founders.",
    quote: '',
    availability: 'Fri',
    cat_name: 'Finance',
    expertise_areas: ['Fundraising', 'Startups', 'Growth'],
    city: 'London',
    hook: 'Raised $2M seed and scaled to 50,000 users in 18 months.',
    durs: ['60'],
    slots: ["09:00", "09:30", "10:30", "13:00", "13:30", "16:00", "16:30", "17:00"],
    busy: ["09:30", "16:30"],
    p60: '$36',
    rating: '5.0',
    sessions: '86',
    resp: "Usually replies in ~1 day",
    lang: "English"
  },
  {
    id: 'pehal',
    name: 'Pehal Kaur',
    role: 'Corporate Lawyer',
    photo: '',
    bio: "Corporate lawyer who's closed contracts north of $1M. I guide women into legal leadership and sharper negotiation.",
    quote: '',
    availability: 'Today',
    cat_name: 'Law',
    expertise_areas: ['Contracts', 'Negotiation', 'Legal careers'],
    city: 'Toronto',
    hook: 'Negotiated 6 corporate contracts exceeding $1M each.',
    durs: ['30', '60'],
    slots: ["08:30", "09:00", "09:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30"],
    busy: ["09:00", "15:30"],
    p30: '$20',
    p60: '$36',
    rating: '4.8',
    sessions: '154',
    resp: "Usually replies in ~3h",
    lang: "English · Punjabi"
  },
  {
    id: 'jane',
    name: 'Jane Williams',
    role: 'Marketing Director · Agency',
    photo: '',
    bio: "Marketing Director who grew a brand from zero to 2M. I help you find positioning that actually converts.",
    quote: '',
    availability: 'Mon',
    cat_name: 'Business',
    expertise_areas: ['Brand strategy', 'Content', 'Positioning'],
    city: 'New York',
    hook: 'Grew a brand from zero to 2M followers in 18 months.',
    durs: ['60', '120'],
    slots: ["10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "15:00", "15:30"],
    busy: ["11:30", "13:00"],
    p60: '$36',
    p120: '$65',
    rating: '4.9',
    sessions: '201',
    resp: "Usually replies in ~1 day",
    lang: "English"
  },
  {
    id: 'erica',
    name: 'Erica Thompson',
    role: 'Healthcare Administrator',
    photo: '',
    bio: "Led 120 clinicians across four hospitals. I coach women navigating healthcare operations and leadership.",
    quote: '',
    availability: 'Today',
    cat_name: 'Healthcare',
    expertise_areas: ['Leadership', 'Operations', 'Strategy'],
    city: 'Sydney',
    hook: 'Led a team of 120 clinicians across 4 hospitals.',
    durs: ['30'],
    slots: ["07:00", "07:30", "08:00", "08:30", "12:00", "12:30", "13:00", "13:30"],
    busy: ["07:30", "13:00"],
    p30: '$20',
    rating: '5.0',
    sessions: '63',
    resp: "Usually replies in ~4h",
    lang: "English"
  },
  {
    id: 'lucy',
    name: 'Lucy Chen',
    role: 'Software Engineer · Spotify',
    photo: '',
    bio: "Went bootcamp-to-Spotify in 14 months. I help career changers land their first real engineering role.",
    quote: '',
    availability: 'Wed',
    cat_name: 'Technology',
    expertise_areas: ['Bootcamp to job', 'Frontend', 'Interviews'],
    city: 'Berlin',
    hook: 'Went from a coding bootcamp to Spotify engineer in 14 months.',
    durs: ['30', '60'],
    slots: ["09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "17:00", "17:30"],
    busy: ["10:00", "15:00"],
    p30: '$20',
    p60: '$36',
    rating: '4.7',
    sessions: '97',
    resp: "Usually replies in ~2h",
    lang: "English · Mandarin"
  }
];

export default function Mentorship({ onShowToast, onNavChange }) {
  const { mentors: backendMentors, submitForm, userToken, userProfile } = useApp();
  const navigate = useNavigate();
  const [mentorsList, setMentorsList] = useState([]);
  
  // Page Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  // Booking Modal State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    if (selectedMentor && selectedDate) {
      setLoadingAvailability(true);
      fetch(`${API_BASE}/api/mentors/${selectedMentor.id}/availability?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookedSlots(data.bookedSlots || []);
          }
        })
        .catch(err => {
          console.error('Error fetching availability:', err);
        })
        .finally(() => {
          setLoadingAvailability(false);
        });
    } else {
      setBookedSlots([]);
    }
  }, [selectedMentor, selectedDate]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedMentor, selectedDate]);

  const [bookingStep, setBookingStep] = useState('picker'); // 'picker', 'email', 'pay', 'success'
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  // Stripe Integration State
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const cardElementRef = useRef(null);

  const userTimezone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'your local time';
    } catch (e) {
      return 'your local time';
    }
  })();

  // Normalize dynamic database mentors or fall back to static list
  useEffect(() => {
    const normalizeMentor = (m) => {
      const init = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'M';
      const rawExpertise = m.expertise_areas || '';
      const tags = typeof rawExpertise === 'string'
        ? rawExpertise.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(rawExpertise) ? rawExpertise : []);

      let cleanRate = m.rate || '$20';
      if (!cleanRate.startsWith('$') && !isNaN(cleanRate)) {
        cleanRate = `$${cleanRate}`;
      }

      let p30Val = cleanRate;
      let p60Val = '$36';
      try {
        const numeric = parseInt(cleanRate.replace(/[^0-9]/g, ''));
        if (!isNaN(numeric)) {
          p60Val = `$${Math.round(numeric * 1.8)}`;
        }
      } catch (e) {}

      let hash = 0;
      if (m.name) {
        for (let i = 0; i < m.name.length; i++) {
          hash = m.name.charCodeAt(i) + ((hash << 5) - hash);
        }
      }
      const ratingVal = (4.7 + Math.abs(hash % 4) * 0.1).toFixed(1);
      const sessionsVal = String(50 + Math.abs(hash % 121));

      return {
        id: m.id || m._id || String(hash),
        name: m.name || '',
        role: m.role || 'Professional Mentor',
        photo: m.photo || '',
        init,
        bio: m.bio || "Ex-startup lead, ready to help you navigate your career and find your path.",
        quote: m.quote || '',
        availability: m.availability || 'Tomorrow',
        cat_name: m.cat_name || 'Technology',
        expertise_areas: tags.length > 0 ? tags : ['Career guidance', 'Growth'],
        city: m.role && m.role.includes(' · ') ? m.role.split(' · ')[1] : 'Global',
        hook: m.quote || m.bio || 'Connect directly for professional career guidance.',
        durs: m.durs || ['30', '60'],
        slots: m.slots || ["09:00", "09:30", "10:00", "11:00", "11:30", "14:00", "14:30", "15:00", "16:00", "16:30"],
        busy: m.busy || ["11:00", "15:00"],
        p30: m.p30 || p30Val,
        p60: m.p60 || p60Val,
        p120: m.p120 || '',
        pricing: m.pricing || {},
        rating: ratingVal,
        sessions: sessionsVal,
        resp: "Usually replies in ~2h",
        lang: "English"
      };
    };

    if (backendMentors && backendMentors.length > 0) {
      setMentorsList(backendMentors.map(normalizeMentor));
    } else {
      setMentorsList(STATIC_MENTORS);
    }
  }, [backendMentors]);

  // Handle Scroll reveal and parallax effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.12 });

    const revealElements = document.querySelectorAll('.mentorship-page-wrap .rev');
    revealElements.forEach((el) => observer.observe(el));

    // Parallax mouse movements
    const para = document.getElementById('heroPara');
    const handleMouseMove = (e) => {
      if (!para) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 22;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      para.style.transform = `translate(${x}px, ${y}px)`;
    };

    if (para && !window.matchMedia('(prefers-reduced-motion:reduce)').matches && window.innerWidth > 900) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mentorsList]);

  // Control body scrolling when sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  // Verify Stripe Checkout Session on mount if redirecting back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      const verifySession = async () => {
        setIsProcessing(true);
        setBookingStep('verifying');
        setIsSheetOpen(true);
        try {
          const res = await fetch(`${API_BASE}/api/verify-checkout-session/${sessionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.booking) {
              const b = data.booking;
              // Mock mentor object matching structure
              setSelectedMentor({
                name: b.mentor,
                role: 'Professional Mentor',
                durs: [b.duration],
                init: b.mentor.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                bio: 'Mentorship booking verified.',
                resp: 'Confirmed',
                lang: 'English'
              });
              setSelectedDuration(b.duration);
              setSelectedDate(b.date);
              setSelectedTime(b.time);
              setEmail(b.email);
              setBookingStep('success');
              triggerConfetti();
              if (onShowToast) {
                onShowToast('🎉', 'Payment Verified!', 'Your mentorship session has been booked.');
              }
            } else {
              setStripeError('Verification failed. Please contact support.');
              setBookingStep('picker');
            }
          } else {
            setStripeError('Verification failed. Please contact support.');
            setBookingStep('picker');
          }
        } catch (e) {
          console.error('Session verification error:', e);
          setStripeError('Verification failed. Please contact support.');
          setBookingStep('picker');
        } finally {
          setIsProcessing(false);
        }
      };
      verifySession();
      
      // Clean query params so reload doesn't re-verify
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [mentorsList]);

  // Auto-open booking sheet if mentor query param is present in URL
  useEffect(() => {
    if (mentorsList.length === 0) return;
    
    const params = new URLSearchParams(window.location.search);
    const mentorIdParam = params.get('mentor_id');
    const mentorNameParam = params.get('mentor_name');
    
    if (mentorIdParam || mentorNameParam) {
      const foundMentor = mentorsList.find(m => 
        (mentorIdParam && String(m.id) === String(mentorIdParam)) ||
        (mentorNameParam && m.name.toLowerCase() === mentorNameParam.toLowerCase())
      );
      
      if (foundMentor) {
        const timer = setTimeout(() => {
          openSheet(foundMentor);
          // Scroll to the specific mentor's card
          const targetCard = document.getElementById(`mentor-card-${foundMentor.id}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            const targetSection = document.getElementById('mentors');
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
          // Clean the query parameters so reload doesn't keep opening it
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [mentorsList]);

  // Modal Open Handler
  const openSheet = (mentor) => {
    if (!userToken) {
      if (onShowToast) {
        onShowToast('🔑', 'Login Required', 'Please log in to book a mentorship session.');
      }
      navigate(`/dashboard?redirect=mentorship&mentor_id=${mentor.id}`);
      return;
    }

    setSelectedMentor(mentor);
    setSelectedDuration(mentor.durs.length === 1 ? mentor.durs[0] : null);
    setSelectedDate(null);
    setSelectedTime(null);
    setEmail(userProfile?.email || '');
    setEmailError(false);
    setStripeLoaded(false);
    setStripeError('');
    setIsProcessing(false);
    setBookingStep('picker');
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setTimeout(() => {
      setSelectedMentor(null);
    }, 300);
  };

  // Helper date methods
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      dates.push(dt);
    }
    return dates;
  };

  const durLabel = (d) => {
    return d === '30' ? '30 minutes' : d === '60' ? '60 minutes' : '2 hours';
  };

  const durDesc = (d) => {
    return d === '30' ? 'Quick focused session' : d === '60' ? 'Deep-dive conversation' : d === '120' ? 'Extended strategy' : 'Custom mentorship session';
  };

  const priceOf = (d) => {
    if (!selectedMentor) return '';
    if (selectedMentor.pricing && selectedMentor.pricing[d]) {
      return selectedMentor.pricing[d];
    }
    return d === '30' ? selectedMentor.p30 : d === '60' ? selectedMentor.p60 : selectedMentor.p120 || '';
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    const dt = new Date(iso + 'T00:00:00');
    return DAYS[dt.getDay()] + ', ' + dt.getDate() + ' ' + MONS[dt.getMonth()];
  };

  // Confetti particles generator
  const triggerConfetti = () => {
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none';
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    document.body.appendChild(cv);
    
    const x = cv.getContext('2d');
    const cols = ['#E8756A', '#F4A07A', '#E8924D', '#22C55E', '#D85A4E'];
    const P = Array.from({ length: 130 }, () => ({
      x: Math.random() * cv.width,
      y: -20,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 12,
      c: cols[Math.random() * cols.length | 0],
      vx: (Math.random() - 0.5) * 6,
      vy: 3 + Math.random() * 4,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.3,
      a: 1
    }));
    
    let f = 0;
    (function loop() {
      x.clearRect(0, 0, cv.width, cv.height);
      let live = 0;
      P.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.r += p.vr;
        if (p.y > cv.height * 0.82) {
          p.a = Math.max(0, p.a - 0.03);
        }
        if (p.a > 0) {
          live++;
          x.save();
          x.globalAlpha = p.a;
          x.translate(p.x, p.y);
          x.rotate(p.r);
          x.fillStyle = p.c;
          x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          x.restore();
        }
      });
      f++;
      if (live > 0 || f < 40) {
        requestAnimationFrame(loop);
      } else {
        document.body.removeChild(cv);
      }
    })();
  };

  const handleDirectFreeBooking = async (cleanEmail) => {
    setIsProcessing(true);
    const amount = priceOf(selectedDuration);
    const payload = {
      mentor: selectedMentor.name,
      mentor_id: selectedMentor.id,
      duration: selectedDuration,
      date: selectedDate,
      time: selectedTime,
      email: cleanEmail,
      amount: amount,
      submitted_at: new Date().toISOString()
    };
    try {
      await submitForm('mentorship', payload);
      handleSuccess();
    } catch (err) {
      console.error('Error saving free booking:', err);
      handleSuccess();
    }
  };
  // Submit email handler (Redirects directly to Stripe Hosted Checkout for paid sessions)
  const handleEmailSubmit = async () => {
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);

    // If session is Free, directly complete the booking without Stripe redirect
    const price = priceOf(selectedDuration);
    if (!price || price.toLowerCase().includes('free') || price.replace(/[^0-9]/g, '') === '0') {
      await handleDirectFreeBooking(cleanEmail);
      return;
    }

    setIsProcessing(true);
    setStripeError('');

    try {
      const r = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          mentor: selectedMentor.name,
          dur: selectedDuration,
          date: selectedDate,
          time: selectedTime,
          email: cleanEmail
        })
      });

      if (!r.ok) throw new Error('Create checkout session failed');
      const { id, url } = await r.json();

      if (id === 'free_session') {
        await handleDirectFreeBooking(cleanEmail);
        return;
      }

      if (url) {
        // Redirect directly to Stripe Secure Hosted Checkout
        window.location.href = url;
      } else {
        setStripeError('Failed to create secure checkout session. Please try again.');
        setIsProcessing(false);
      }
    } catch (e) {
      console.error('Error creating checkout session:', e);
      setStripeError('Failed to connect to payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSuccess = () => {
    setIsProcessing(false);
    setBookingStep('success');
    triggerConfetti();
    if (onShowToast) {
      onShowToast('🎉', 'Mentorship Booked!', 'A confirmation has been sent to your email.');
    }
  };

  // Accordion faq helper
  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // Scrim click handler
  const handleScrimClick = (e) => {
    if (e.target.id === 'scrim') {
      closeSheet();
    }
  };

  // Filtered mentors list logic
  const filteredMentors = mentorsList.filter(m => {
    const matchesCat = !selectedCategory || m.cat_name.toLowerCase() === selectedCategory.toLowerCase();
    const searchStr = `${m.name} ${m.role} ${m.cat_name} ${m.bio} ${(m.expertise_areas || []).join(' ')}`.toLowerCase();
    const matchesQuery = !searchQuery || searchStr.includes(searchQuery.trim().toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getStepNumber = () => {
    if (bookingStep === 'picker') return 1;
    if (bookingStep === 'email') return 2;
    return 3;
  };

  const isBookingReady = selectedDuration && selectedDate && selectedTime;

  return (
    <div className="mentorship-page-wrap">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bgwrap">
          <div className="hero-orb1"></div>
          <div className="hero-orb2"></div>
          <div id="heroPara" className="hero-para">
            <span className="blob b1"></span>
            <span className="blob b2"></span>
            <span className="blob b3"></span>
          </div>
          <svg className="hero-petal" viewBox="0 0 400 400" fill="none">
            <ellipse cx="200" cy="200" rx="52" ry="175" stroke="rgba(232,117,106,.1)" strokeWidth="1.2" transform="rotate(0 200 200)" />
            <ellipse cx="200" cy="200" rx="52" ry="175" stroke="rgba(232,117,106,.09)" strokeWidth="1.2" transform="rotate(45 200 200)" />
            <ellipse cx="200" cy="200" rx="52" ry="175" stroke="rgba(232,117,106,.08)" strokeWidth="1.2" transform="rotate(90 200 200)" />
            <ellipse cx="200" cy="200" rx="52" ry="175" stroke="rgba(232,117,106,.07)" strokeWidth="1.2" transform="rotate(135 200 200)" />
            <circle cx="200" cy="200" r="30" fill="rgba(232,117,106,.05)" />
          </svg>
          
          <div className="hero-inner">
            <div className="wrap">
              <div className="hero-badge rev">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" fill="rgba(232,117,106,.14)" stroke="#E8756A" strokeWidth="1.5" strokeLinejoin="round" />
                  <polyline points="8.5,12 11,14.5 15.5,9.5" stroke="#E8756A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Verified women mentors · 100% confidential</span>
              </div>
              <h1 className="hero-h rev rev-d1">The gap between where you are and where you want to be is<br /><em>one right mentor.</em></h1>
              <p className="hero-lede rev rev-d2">Most women stay stuck not because they lack talent or drive — nobody ever showed them the door.</p>
              <p className="hero-line rev rev-d2">Every mentor here has walked the road you're on.</p>
              <div className="hero-pod rev rev-d2">
                <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>
                As heard on the <b>Bold &amp; Brilliant Girls</b> podcast
              </div>
              
              <div className="hero-metrics rev rev-d3">
                <div className="hm">
                  <div className="hm-ic"><svg viewBox="0 0 24 24"><polygon points="12 3 14.1 8.3 19.8 8.7 15.4 12.4 16.8 18 12 14.9 7.2 18 8.6 12.4 4.2 8.7 9.9 8.3 12 3" /></svg></div>
                  <span className="hm-n">87%</span>
                  <span className="hm-l">feel more confident within 6 months</span>
                </div>
                <div className="hm">
                  <div className="hm-ic"><svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg></div>
                  <span className="hm-n">3×</span>
                  <span className="hm-l">more likely to get promoted</span>
                </div>
                <div className="hm">
                  <div className="hm-ic"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
                  <span className="hm-n">$85K</span>
                  <span className="hm-l">average salary jump in 2 years</span>
                </div>
                <div className="hm">
                  <div className="hm-ic"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                  <span className="hm-n">500+</span>
                  <span className="hm-l">verified mentors across fields</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TICKER ===== */}
      <div className="ticker" aria-hidden="true">
        <div className="tk-track">
          <div className="tk-i"><b>✦</b><span>A mentor doesn't make you smarter — they make your path shorter.</span></div>
          <div className="tk-i"><b>✦</b><span>The right introduction opens doors a hundred cold emails never could.</span></div>
          <div className="tk-i"><b>✦</b><span>What took someone ten years to learn, they can teach you in one hour.</span></div>
          <div className="tk-i"><b>✦</b><span>Clarity is the rarest career resource. A great mentor gives you exactly that.</span></div>
          <div className="tk-i"><b>✦</b><span>The highest performers had someone who believed in them first.</span></div>
          {/* Double content for seamless looping */}
          <div className="tk-i"><b>✦</b><span>A mentor doesn't make you smarter — they make your path shorter.</span></div>
          <div className="tk-i"><b>✦</b><span>The right introduction opens doors a hundred cold emails never could.</span></div>
          <div className="tk-i"><b>✦</b><span>What took someone ten years to learn, they can teach you in one hour.</span></div>
          <div className="tk-i"><b>✦</b><span>Clarity is the rarest career resource. A great mentor gives you exactly that.</span></div>
          <div className="tk-i"><b>✦</b><span>The highest performers had someone who believed in them first.</span></div>
        </div>
      </div>

      {/* ===== DISCOVERY (FILTERS) ===== */}
      <div className="discovery">
        <div className="life-strip" id="lifeStrip">
          <div className="wrap">
            <div className="life-tag"><span className="ls-star">✦</span><span class="ls-txt">Change your life today</span><span className="ls-star">✦</span></div>
            <div className="life-row">
              <div className="life-chips">
                <button className={`fch${selectedCategory === '' ? ' on' : ''}`} onClick={() => setSelectedCategory('')}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>All mentors
                </button>
                <button className={`fch${selectedCategory === 'technology' ? ' on' : ''}`} onClick={() => setSelectedCategory('technology')}>
                  <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>Technology
                </button>
                <button className={`fch${selectedCategory === 'finance' ? ' on' : ''}`} onClick={() => setSelectedCategory('finance')}>
                  <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>Finance
                </button>
                <button className={`fch${selectedCategory === 'law' ? ' on' : ''}`} onClick={() => setSelectedCategory('law')}>
                  <svg viewBox="0 0 24 24"><path d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0L7 7zM17 7l-3 7a3 3 0 0 0 6 0l-3-7zM7 21h10" /></svg>Law
                </button>
                <button className={`fch${selectedCategory === 'business' ? ' on' : ''}`} onClick={() => setSelectedCategory('business')}>
                  <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>Business
                </button>
                <button className={`fch${selectedCategory === 'healthcare' ? ' on' : ''}`} onClick={() => setSelectedCategory('healthcare')}>
                  <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" /></svg>Healthcare
                </button>
              </div>
              <div className="life-search">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input
                  type="search"
                  placeholder="Search mentors…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== MENTORS LIST ===== */}
        <section className="mentors" id="mentors">
          <div className="wrap">
            <div className="mentors-head">
              <h2 className="mentors-t rev">Meet your <em>mentors.</em></h2>
              <div className="mentors-c rev"><b>{filteredMentors.length}</b> women ready to help you move forward</div>
              <a className="match-nudge rev" href="/find-your-path" onClick={(e) => { e.preventDefault(); onNavChange('quiz'); }}><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>Not sure who fits? Take the 2-min match</a>
            </div>

            <div className="grid">
              {filteredMentors.map((mentor) => (
                <article id={`mentor-card-${mentor.id}`} key={mentor.id} className="card rev" onClick={() => openSheet(mentor)}>
                  <div className="card-top">
                    <div className="ava" style={mentor.photo ? { backgroundImage: `url(${mentor.photo})` } : null}>
                      {mentor.photo ? '' : mentor.init}
                    </div>
                    <div className="card-id">
                      <div className="card-nm">{mentor.name}</div>
                      <div className="card-rl">{mentor.role}</div>
                    </div>
                    <div className="card-rt">
                      <svg viewBox="0 0 24 24" className="sf"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>
                      <b>{mentor.rating}</b>
                    </div>
                  </div>
                  <div className="card-cat">{mentor.cat_name} · {mentor.city}</div>
                  <p className="card-hk">{mentor.hook}</p>
                  <div className="card-tg">
                    {mentor.expertise_areas.map((tag, i) => (
                      <span key={i} className="ch">{tag}</span>
                    ))}
                  </div>
                  <div className="card-ft">
                    <div className="card-mt">
                      <span className="av-dot"><i></i>{mentor.availability}</span>
                      <span className="card-pr">
                        {mentor.p30 && <span className="pp">30 min · {mentor.p30}</span>}
                        {mentor.p60 && <span className="pp">60 min · {mentor.p60}</span>}
                      </span>
                    </div>
                    <button
                      className="bk"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSheet(mentor);
                      }}
                    >
                      <svg className="bk-cal" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      Book session
                      <svg className="bk-arr" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  </div>
                </article>
              ))}

              {filteredMentors.length === 0 && (
                <div className="empty" style={{ display: 'block' }}>
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  <h3>No mentors match that yet</h3>
                  <p>Try a different field or clear your search.</p>
                  <button onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}>Show all mentors</button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ===== REAL STORIES ===== */}
      <section className="stories" id="stories">
        <div className="wrap stories-head rev">
          <span className="eyebrow">Real stories</span>
          <h2 className="stories-h">Women who took the leap — <em>and landed.</em></h2>
          <p className="stories-sub">Real names, real roles, real outcomes. Every story started with one conversation.</p>
        </div>
        <div className="wrap">
          <div className="st-trust rev">
            <div className="st-trust-i">
              <svg viewBox="0 0 24 24" className="sf"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>
              <span className="st-trust-n">4.9</span>
              <span className="st-trust-l">average session rating</span>
            </div>
            <div className="st-trust-sep"></div>
            <div className="st-trust-i">
              <span className="st-trust-n">2,400+</span>
              <span className="st-trust-l">sessions booked</span>
            </div>
            <div className="st-trust-sep"></div>
            <div className="st-trust-i">
              <span className="st-trust-n">98%</span>
              <span className="st-trust-l">would recommend</span>
            </div>
          </div>

          <div className="st-grid">
            <div className="st rev">
              <div className="st-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="sf"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>
                ))}
              </div>
              <p className="st-q">&ldquo;She helped me see I was ready for a role I had talked myself out of for a year.&rdquo;</p>
              <div className="st-o"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Promoted to Senior PM</div>
              <div className="st-a">
                <div className="st-av">AN</div>
                <div>
                  <div className="st-nm">Aarti N.</div>
                  <div className="st-mt">Product Manager · Bengaluru</div>
                </div>
              </div>
              <div className="st-via">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                Mentored by <b>Priya Sharma</b>
              </div>
            </div>

            <div className="st rev rev-d1">
              <div className="st-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="sf"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>
                ))}
              </div>
              <p className="st-q">&ldquo;I walked in unsure and left with a 90-day plan and a warm intro to a hiring manager.&rdquo;</p>
              <div className="st-o"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Landed a tech role</div>
              <div className="st-a">
                <div className="st-av">SR</div>
                <div>
                  <div className="st-nm">Sneha R.</div>
                  <div className="st-mt">Software Engineer · Hyderabad</div>
                </div>
              </div>
              <div className="st-via">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                Mentored by <b>Lucy Chen</b>
              </div>
            </div>

            <div className="st rev rev-d2">
              <div className="st-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="sf"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>
                ))}
              </div>
              <p className="st-q">&ldquo;My mentor had raised the exact round I was terrified of. One hour saved me months.&rdquo;</p>
              <div className="st-o"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Closed $500K pre-seed</div>
              <div className="st-a">
                <div className="st-av">PM</div>
                <div>
                  <div className="st-nm">Preethi M.</div>
                  <div className="st-mt">Founder · Mumbai</div>
                </div>
              </div>
              <div className="st-via">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                Mentored by <b>Vanya Mehta</b>
              </div>
            </div>
          </div>

          <div className="st-from rev">
            <div className="st-from-l">Our mentors come from</div>
            <div className="st-from-row">
              <span className="st-co">Google</span>
              <span className="st-co">Meta</span>
              <span className="st-co">Amazon</span>
              <span className="st-co">Spotify</span>
              <span className="st-co">&amp; more</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY IT WORKS ===== */}
      <section className="why" id="why">
        <div className="wrap">
          <div className="why-head rev">
            <span className="eyebrow">Why it works</span>
            <h2 className="why-h">Career growth isn't luck.<br />It's <em>guided.</em></h2>
            <p className="why-sub">The biggest predictor of advancement isn't talent — it's access to someone who's already solved the problem in front of you.</p>
          </div>
          
          <div className="why-stats">
            <div className="wstat rev">
              <div className="wstat-ic"><svg viewBox="0 0 24 24"><polygon points="12 3 14.1 8.3 19.8 8.7 15.4 12.4 16.8 18 12 14.9 7.2 18 8.6 12.4 4.2 8.7 9.9 8.3 12 3" /></svg></div>
              <div className="wstat-n">87%</div>
              <div className="wstat-rule"></div>
              <div className="wstat-l">Feel more confident</div>
              <div className="wstat-s">within 6 months · HBR</div>
            </div>
            <div className="wstat rev rev-d1">
              <div className="wstat-ic"><svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg></div>
              <div className="wstat-n">3×</div>
              <div className="wstat-rule"></div>
              <div className="wstat-l">More likely promoted</div>
              <div className="wstat-s">vs. non-mentored · McKinsey</div>
            </div>
            <div className="wstat rev rev-d1">
              <div className="wstat-ic"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" /></svg></div>
              <div className="wstat-n">94%</div>
              <div className="wstat-rule"></div>
              <div className="wstat-l">Session satisfaction</div>
              <div className="wstat-s">across 2,400+ sessions</div>
            </div>
            <div className="wstat rev rev-d2">
              <div className="wstat-ic"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
              <div className="wstat-n">$85K</div>
              <div className="wstat-rule"></div>
              <div className="wstat-l">Avg. salary jump</div>
              <div className="wstat-s">within 2 years · Mentoring.org</div>
            </div>
          </div>

          <div className="why-foot rev">
            <p>One conversation can change the trajectory of your <em>whole career.</em></p>
            <button
              className="btn-p"
              onClick={() => {
                const element = document.getElementById('mentors');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: '#fff', strokeWidth: 2, strokeLinecap: 'round' }}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              Book a session
            </button>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq">
        <div className="wrap">
          <div className="faq-grid">
            <div className="faq-side rev">
              <span className="eyebrow">Questions</span>
              <h2 className="faq-h">Everything you<br />need to <em>know.</em></h2>
              <p>Browse the mentors above — you can read every profile before booking a thing.</p>
            </div>
            
            <div className="faq-list rev rev-d1">
              {[
                {
                  q: "How are mentors verified?",
                  a: "Every mentor completes identity verification and a background check, and we confirm their professional history before they can take a session."
                },
                {
                  q: "What happens in a session?",
                  a: "A private one-to-one video call. You bring a question or a goal; your mentor brings lived experience. Most people leave with a clear next step."
                },
                {
                  q: "What does it cost?",
                  a: "Sessions start at $20 for a focused 30-minute conversation. Longer sessions are priced by each mentor and shown upfront. No subscriptions."
                },
                {
                  q: "Is it really confidential?",
                  a: "Yes. What you discuss stays between you and your mentor. We never share session content, and your booking details stay private."
                },
                {
                  q: "What if I need to reschedule?",
                  a: "You can reschedule or cancel up to 24 hours before your session at no cost, directly from your confirmation email."
                },
                {
                  q: "Do I have to commit to a package?",
                  a: "No. Book one session, see how it feels, and come back when you need to. There is no commitment beyond the session you book."
                }
              ].map((faq, index) => {
                const isOpen = activeFaqIndex === index;
                return (
                  <div key={index} className={`faq-i${isOpen ? ' open' : ''}`}>
                    <button className="faq-q" onClick={() => toggleFaq(index)}>
                      {faq.q}
                      <span className="faq-ic">
                        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </button>
                    <div className="faq-a">
                      <div className="faq-ai">{faq.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOOKING MODAL (SHEET) ===== */}
      {selectedMentor && createPortal(
        <div className="mentorship-page-wrap" style={{ padding: 0, minHeight: 'auto', background: 'none', position: 'relative', zIndex: 99999 }}>
          <div
            className={`scrim${isSheetOpen ? ' open' : ''}`}
            id="scrim"
            onClick={handleScrimClick}
            style={{ zIndex: 99999 }}
          ></div>
          
          <div
            className={`sheet${isSheetOpen ? ' open' : ''}`}
            id="sheet"
            style={{ zIndex: 100000 }}
          >
            {bookingStep !== 'success' && (
              <div className="s-head">
                <div className="s-mentor">
                  <div
                    className="s-ava"
                    style={selectedMentor.photo ? { backgroundImage: `url(${selectedMentor.photo})` } : null}
                  >
                    {selectedMentor.photo ? '' : selectedMentor.init}
                  </div>
                  <div>
                    <div className="s-nm">{selectedMentor.name}</div>
                    <div className="s-rl">{selectedMentor.role}</div>
                  </div>
                  <button className="s-x" onClick={closeSheet}>
                    <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="s-steps">
                  <span className={`sstep${getStepNumber() >= 1 ? ' on' : ''}`}></span>
                  <span className={`sstep${getStepNumber() >= 2 ? ' on' : ''}`}></span>
                  <span className={`sstep${getStepNumber() >= 3 ? ' on' : ''}`}></span>
                </div>
              </div>
            )}

            <div className="s-body">
              {bookingStep === 'picker' && (
                <>
                  <div className="s-intro">
                    <div
                      className="s-intro-ph"
                      style={selectedMentor.photo ? { backgroundImage: `url(${selectedMentor.photo})` } : null}
                    >
                      {selectedMentor.photo ? '' : selectedMentor.init}
                    </div>
                    <div className="s-intro-d">
                      <div className="s-intro-bio">{selectedMentor.bio}</div>
                      <div className="s-intro-meta">
                        <span><svg viewBox="0 0 24 24"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>{selectedMentor.rating}</span>
                        <span>{selectedMentor.sessions} sessions</span>
                        <span>{selectedMentor.resp}</span>
                        <span>{selectedMentor.lang}</span>
                      </div>
                    </div>
                  </div>

                  <div className="fld">
                    <div className="fl">Session length</div>
                    <div className="durs">
                      {selectedMentor.durs.map((d) => (
                        <button
                          key={d}
                          className={`dur${selectedDuration === d ? ' on' : ''}`}
                          onClick={() => setSelectedDuration(d)}
                        >
                          <div className="dur-lbl">
                            <span className="dur-t">{durLabel(d)}</span>
                            <span className="dur-d">{durDesc(d)}</span>
                          </div>
                          {priceOf(d) && <span className="dur-p">{priceOf(d)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fld">
                    <div className="fl">Pick a date</div>
                    <div className="dates">
                      {getDates().map((dt) => {
                        const iso = dt.toISOString().slice(0, 10);
                        const openCount = selectedMentor.slots.filter(t => !selectedMentor.busy.includes(t)).length;
                        return (
                          <button
                            key={iso}
                            className={`date${selectedDate === iso ? ' on' : ''}`}
                            onClick={() => setSelectedDate(iso)}
                          >
                            <span className="date-w">{DAYS[dt.getDay()]}</span>
                            <span className="date-d">{dt.getDate()}</span>
                            <span className="date-m">{MONS[dt.getMonth()]}</span>
                            <span className="date-s">{openCount} open</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="fld">
                    <div className="fl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Available times</span>
                      {loadingAvailability && <span style={{ fontSize: '11px', color: 'var(--primary)', opacity: 0.8 }}>Checking live slots...</span>}
                    </div>
                    <div className="times" style={{ opacity: loadingAvailability ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                      {selectedMentor.slots.map((t) => {
                        const isBusy = selectedMentor.busy.includes(t) || bookedSlots.includes(t);
                        return (
                          <button
                            key={t}
                            className={`tm${isBusy ? ' busy' : ''}${selectedTime === t ? ' on' : ''}`}
                            disabled={isBusy}
                            onClick={() => !isBusy && setSelectedTime(t)}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                    <div className="tz-note">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      Times shown in your timezone · {userTimezone}
                    </div>
                  </div>
                </>
              )}

              {bookingStep === 'email' && (
                <>
                  <div className="sum-card">
                    <div className="sum-r"><span className="k">Mentor</span><span className="v">{selectedMentor.name}</span></div>
                    <div className="sum-r"><span className="k">Date</span><span className="v">{fmtDate(selectedDate)}</span></div>
                    <div className="sum-r"><span className="k">Time</span><span class="v">{selectedTime}</span></div>
                    <div className="sum-r"><span className="k">Session</span><span class="v">{durLabel(selectedDuration)}</span></div>
                    {priceOf(selectedDuration) && (
                      <div className="sum-r"><span className="k">Total</span><span className="v" style={{ color: 'var(--rose)' }}>{priceOf(selectedDuration)}</span></div>
                    )}
                  </div>

                  <div className="fld">
                    <div className="fl">Your email — for confirmation</div>
                    <input
                      type="email"
                      className="f-in"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                      }}
                    />
                    {emailError && <div className="f-err" style={{ display: 'block' }}>Please enter a valid email address.</div>}
                    <div className="f-note">
                      <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                      We'll send your booking confirmation and calendar invite here.
                    </div>
                  </div>
                </>
              )}

              {bookingStep === 'verifying' && (
                <div className="success" style={{ padding: '36px 10px' }}>
                  <svg className="spin" viewBox="0 0 24 24" style={{ width: '48px', height: '48px', fill: 'none', stroke: 'var(--rose)', strokeWidth: 2.5, margin: '0 auto 18px', display: 'block' }}><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
                  <h3 className="sc-h" style={{ fontSize: '20px' }}>Verifying your payment…</h3>
                  <p className="sc-sub">Please wait while we confirm your booking with Stripe.</p>
                </div>
              )}

              {bookingStep === 'success' && (
                <div className="success">
                  <div className="sc-ring"><i></i><i></i><i></i><div className="sc-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div></div>
                  <h3 className="sc-h">You're <em>booked!</em></h3>
                  <p className="sc-sub">A confirmation and calendar invite are on the way to<br /><b>{email}</b></p>
                  
                  <div className="sum-card">
                    <div className="sum-r"><span className="k">Mentor</span><span className="v">{selectedMentor.name}</span></div>
                    <div className="sum-r"><span className="k">Date</span><span className="v">{fmtDate(selectedDate)}</span></div>
                    <div className="sum-r"><span className="k">Time</span><span className="v">{selectedTime}</span></div>
                    <div className="sum-r"><span className="k">Duration</span><span className="v">{durLabel(selectedDuration)}</span></div>
                    {priceOf(selectedDuration) && (
                      <div className="sum-r"><span className="k">Paid</span><span className="v">{priceOf(selectedDuration)}</span></div>
                    )}
                  </div>

                  <div className="sc-cal">
                    <button className="cb"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>Google</button>
                    <button className="cb"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>Outlook</button>
                  </div>

                  <div className="sc-next">
                    <h4><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>What happens next</h4>
                    <ul>
                      <li>{selectedMentor.name.split(' ')[0]} will confirm and may send a short prep note within 24 hours.</li>
                      <li>Your video link arrives by email one hour before the session.</li>
                      <li>Bring one or two questions — focused sessions work best.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="s-foot">
              {bookingStep === 'picker' && (
                <>
                  <div className={`s-sum${!isBookingReady ? ' empty' : ''}`}>
                    <div className="s-sum-ic"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg></div>
                    <div className="s-sum-d">
                      <div className="s-sum-m">
                        {isBookingReady
                          ? `${durLabel(selectedDuration)} with ${selectedMentor.name.split(' ')[0]}`
                          : `Pick ${[!selectedDuration && 'duration', !selectedDate && 'date', !selectedTime && 'time'].filter(Boolean).join(', ')}`
                        }
                      </div>
                      {isBookingReady && <div className="s-sum-s">{fmtDate(selectedDate)} · {selectedTime}</div>}
                    </div>
                    {isBookingReady && <div className="s-sum-p">{priceOf(selectedDuration)}</div>}
                  </div>
                  <button
                    className="s-go"
                    disabled={!isBookingReady}
                    onClick={() => setBookingStep('email')}
                  >
                    <span>Continue</span>
                    <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                </>
              )}

              {bookingStep === 'email' && (
                <button className="s-go" disabled={isProcessing} onClick={handleEmailSubmit}>
                  <span>
                    {isProcessing ? (
                      <>
                        <svg className="spin" viewBox="0 0 24 24" style={{ width: '17px', height: '17px', fill: 'none', stroke: '#fff', strokeWidth: 2.4, display: 'inline', marginRight: '6px' }}><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
                        Redirecting to Stripe…
                      </>
                    ) : (
                      <>
                        Pay {priceOf(selectedDuration)} Securely
                      </>
                    )}
                  </span>
                  {!isProcessing && <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
                </button>
              )}

              {bookingStep === 'verifying' && (
                <button className="s-go" disabled={true}>
                  <span>
                    <svg className="spin" viewBox="0 0 24 24" style={{ width: '17px', height: '17px', fill: 'none', stroke: '#fff', strokeWidth: 2.4, display: 'inline', marginRight: '6px' }}><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
                    Verifying Payment…
                  </span>
                </button>
              )}

              {bookingStep === 'success' && (
                <button className="s-go" onClick={() => { closeSheet(); navigate('/dashboard'); }}>
                  <span>Go to My Dashboard</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </button>
              )}
              
              {bookingStep !== 'success' && (
                <div className="s-sec">
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  Secured by Stripe · cancel free up to 24h · 100% confidential
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
