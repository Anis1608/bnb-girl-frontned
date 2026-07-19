import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function JoinUs({ onShowToast, onNavChange }) {
  const { submitForm } = useApp();
  // Form input states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [field, setField] = useState('');
  const [source, setSource] = useState('');
  const [dream, setDream] = useState('');
  const [agree, setAgree] = useState(false);

  // Form interaction / validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Show guardian email field if age is entered and is < 18
  const showGuardianField = age !== '' && parseInt(age) > 0 && parseInt(age) < 18;

  // Real-time error clearing on input change
  const handleInputChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 14 || parsedAge > 25) {
      newErrors.age = true;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = true;
    }
    
    if (!field) {
      newErrors.field = true;
    }
    
    if (showGuardianField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail)) {
      newErrors.guardianEmail = true;
    }
    
    if (!agree) {
      newErrors.agree = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Scroll reveal animations observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });

    const elements = document.querySelectorAll('.joinus-page-container .reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [isSubmitted]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      if (onShowToast) {
        onShowToast('❌', 'Error', 'Please correct the highlighted fields.');
      }
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      name,
      age,
      email,
      field,
      source,
      dream,
      submitted_at: new Date().toISOString()
    };
    if (showGuardianField && guardianEmail) {
      payload.guardian_email = guardianEmail;
    }

    try {
      await submitForm('community', payload);
      setIsSubmitted(true);
      if (onShowToast) {
        onShowToast('✨', 'Welcome to the circle!', 'Application sent successfully.');
      }
    } catch (err) {
      console.error(err);
      if (onShowToast) {
        onShowToast('❌', 'Error', err.message || 'Failed to submit application.');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        const card = document.getElementById('formCard');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "Who is this community for?",
      a: "Girls and young women aged 14–25. In school, in your first job, or completely lost — if you're ambitious and searching, there's a seat here. Under-18s need a guardian email to apply."
    },
    {
      q: "What happens after I apply?",
      a: "Sanah personally reads every application. Within 3 business days you'll get a welcome email and your first steps into the community. It's not a bot — it's a human who actually cares."
    },
    {
      q: "Is this free?",
      a: "Yes. BBG is entirely not-for-profit. Every penny from partnerships goes directly to charitable causes. The community has been, and will always be, free."
    },
    {
      q: "Why do you ask that big question?",
      a: "Because generic forms get generic results. Knowing your dream helps us match you with the right mentor — someone who's been where you want to go."
    },
    {
      q: "I'm outside India — can I still join?",
      a: "Absolutely. 18+ countries represented and growing. Mentorship is online, the podcast is global, and ambition has no borders."
    }
  ];

  return (
    <div className="joinus-page-container">
      {/* SCOPED PAGE CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

        .joinus-page-container {
          --black: #07070A;
          --black-2: #0F0F14;
          --black-3: #161620;
          --pink: #FF1F7D;
          --pink-2: #FF5CA8;
          --pink-dim: rgba(255, 31, 125, .18);
          --purple: #7B2FBE;
          --purple-2: #A259FF;
          --purple-dim: rgba(162, 89, 255, .18);
          --white: #FFFFFF;
          --w90: rgba(255, 255, 255, .90);
          --w75: rgba(255, 255, 255, .75);
          --w50: rgba(255, 255, 255, .50);
          --w25: rgba(255, 255, 255, .25);
          --w12: rgba(255, 255, 255, .12);
          --w07: rgba(255, 255, 255, .07);

          background: var(--black);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
          position: relative;
        }

        .joinus-page-container * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .joinus-page-container a, 
        .joinus-page-container button, 
        .joinus-page-container label {
          cursor: pointer;
        }

        /* ══ MARQUEE ══ */
        .joinus-page-container .marquee-wrap {
          background: var(--pink);
          overflow: hidden;
          padding: 12px 0;
          position: relative;
          z-index: 10;
        }
        .joinus-page-container .marquee-track {
          display: flex;
          width: max-content;
          animation: bbgMarquee 22s linear infinite;
        }
        .joinus-page-container .marquee-item {
          font-family: 'Syne', sans-serif;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--black);
          white-space: nowrap;
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .joinus-page-container .marquee-item::after {
          content: '✦';
          font-size: 9px;
        }
        @keyframes bbgMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ══ HERO ══ */
        .joinus-page-container .joinus-hero {
          position: relative;
          overflow: hidden;
          background: var(--black);
        }
        .joinus-page-container .joinus-hero-bg {
          position: absolute;
          inset: 0;
          background: var(--black);
        }
        .joinus-page-container .joinus-hero-blob-a {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(123, 47, 190, .4) 0%, transparent 65%);
          top: -15%;
          left: -10%;
          animation: bbgBlobFloat 10s ease-in-out infinite;
          pointer-events: none;
        }
        .joinus-page-container .joinus-hero-blob-b {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 31, 125, .3) 0%, transparent 65%);
          bottom: -10%;
          right: -5%;
          animation: bbgBlobFloat 14s ease-in-out infinite reverse;
          pointer-events: none;
        }
        @keyframes bbgBlobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.04); }
          66% { transform: translate(-10px, 18px) scale(.97); }
        }

        .joinus-page-container .joinus-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          position: relative;
          z-index: 2;
        }
        .joinus-page-container .joinus-hero-left {
          padding: 100px 72px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid var(--w12);
        }
        .joinus-page-container .joinus-hero-right {
          padding: 100px 72px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .joinus-page-container .kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .joinus-page-container .kicker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--pink);
          flex-shrink: 0;
        }
        .joinus-page-container .kicker-txt {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--pink);
          font-weight: 600;
        }

        .joinus-page-container .joinus-hero-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: .93;
          color: var(--white);
          margin-bottom: 40px;
        }
        .joinus-page-container .joinus-hero-h1 .line {
          display: block;
          overflow: hidden;
        }
        .joinus-page-container .joinus-hero-h1 .line-inner {
          display: block;
          animation: bbgSlideUp .9s cubic-bezier(.16, 1, .3, 1) both;
          font-size: clamp(3.2rem, 5.5vw, 6rem);
          letter-spacing: -2.5px;
        }
        .joinus-page-container .joinus-hero-h1 .line:nth-child(2) .line-inner {
          animation-delay: .08s;
        }
        .joinus-page-container .joinus-hero-h1 .line:nth-child(3) .line-inner {
          animation-delay: .16s;
        }
        @keyframes bbgSlideUp {
          from { transform: translateY(110%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .joinus-page-container .joinus-hero-h1 .pink {
          color: var(--pink);
        }
        .joinus-page-container .joinus-hero-h1 .outline {
          -webkit-text-stroke: 2px var(--white);
          color: transparent;
        }

        .joinus-page-container .joinus-hero-sub-wrap {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .joinus-page-container .joinus-hero-sub {
          font-size: 1.05rem;
          color: var(--w90);
          font-weight: 400;
          line-height: 1.8;
          max-width: 360px;
        }
        .joinus-page-container .joinus-hero-cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .joinus-page-container .btn-pink {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--pink);
          color: var(--black);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: .82rem;
          letter-spacing: .5px;
          padding: 15px 30px;
          border-radius: 100px;
          border: none;
          transition: all .3s cubic-bezier(.34, 1.56, .64, 1);
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
        }
        .joinus-page-container .btn-pink:hover {
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 31, 125, .4);
        }
        .joinus-page-container .btn-pink svg {
          width: 15px;
          height: 15px;
          transition: transform .3s;
          flex-shrink: 0;
        }
        .joinus-page-container .btn-pink:hover svg {
          transform: translateX(3px);
        }
        .joinus-page-container .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1.5px solid var(--w50);
          color: var(--w90);
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: .8rem;
          letter-spacing: .5px;
          padding: 14px 26px;
          border-radius: 100px;
          transition: all .3s;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
        }
        .joinus-page-container .btn-ghost:hover {
          border-color: var(--white);
          background: var(--w07);
        }

        /* STAT ROWS */
        .joinus-page-container .stat-display {
          display: flex;
          flex-direction: column;
        }
        .joinus-page-container .stat-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding: 24px 0;
          border-bottom: 1px solid var(--w12);
          position: relative;
          overflow: hidden;
        }
        .joinus-page-container .stat-row:first-child {
          border-top: 1px solid var(--w12);
        }
        .joinus-page-container .stat-row::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 1px;
          background: var(--pink);
          transition: width .6s ease;
        }
        .joinus-page-container .stat-row:hover::after {
          width: 100%;
        }
        .joinus-page-container .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 4.5vw, 4.8rem);
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1;
          background: linear-gradient(135deg, var(--pink), var(--purple-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          flex-shrink: 0;
        }
        .joinus-page-container .stat-label {
          font-size: .88rem;
          color: var(--w75);
          font-weight: 400;
          line-height: 1.4;
        }

        .joinus-page-container .joinus-hero-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 72px;
          border-top: 1px solid var(--w12);
          position: relative;
          z-index: 2;
          gap: 16px;
          flex-wrap: wrap;
        }
        .joinus-page-container .hb-members {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .joinus-page-container .hb-avs {
          display: flex;
        }
        .joinus-page-container .hb-av {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--black);
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -7px;
          flex-shrink: 0;
        }
        .joinus-page-container .hb-av:first-child {
          margin-left: 0;
        }
        .joinus-page-container .av-1 { background: linear-gradient(135deg, #FF1F7D, #A259FF); }
        .joinus-page-container .av-2 { background: linear-gradient(135deg, #A259FF, #FF1F7D); }
        .joinus-page-container .av-3 { background: linear-gradient(135deg, #FF5CA8, #7B2FBE); }
        .joinus-page-container .av-4 { background: var(--w25); }
        
        .joinus-page-container .hb-txt {
          font-size: .82rem;
          color: var(--w75);
        }
        .joinus-page-container .hb-txt strong {
          color: var(--white);
          font-weight: 600;
          display: block;
        }
        .joinus-page-container .hb-scroll {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: .68rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--w50);
        }
        .joinus-page-container .scroll-arrow {
          width: 30px;
          height: 30px;
          border: 1px solid var(--w25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bbgBounce 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .joinus-page-container .scroll-arrow svg {
          width: 11px;
          height: 11px;
        }
        @keyframes bbgBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* ══ IDENTITY ══ */
        .joinus-page-container .identity-sec {
          background: var(--black-2);
          padding: 100px 0;
          position: relative;
        }
        .joinus-page-container .id-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 72px;
        }
        .joinus-page-container .id-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          margin-bottom: 56px;
          align-items: end;
        }
        .joinus-page-container .id-kicker {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--purple-2);
          font-weight: 600;
          margin-bottom: 18px;
        }
        .joinus-page-container .id-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 3.5vw, 3.8rem);
          font-weight: 300;
          font-style: italic;
          color: var(--white);
          line-height: 1.1;
        }
        .joinus-page-container .id-h strong {
          font-style: normal;
          font-weight: 600;
          -webkit-text-stroke: 1px var(--pink);
          color: transparent;
          display: block;
        }
        .joinus-page-container .id-right p {
          font-size: 1rem;
          color: var(--w75);
          line-height: 1.85;
          font-weight: 400;
        }

        .joinus-page-container .id-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .joinus-page-container .id-tag {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 20px;
          border-radius: 100px;
          border: 1px solid var(--w12);
          font-size: .88rem;
          color: var(--w75);
          font-weight: 400;
          transition: all .3s cubic-bezier(.34, 1.56, .64, 1);
          position: relative;
          overflow: hidden;
        }
        .joinus-page-container .id-tag::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--pink-dim), var(--purple-dim));
          opacity: 0;
          transition: opacity .3s;
        }
        .joinus-page-container .id-tag:hover {
          border-color: var(--pink);
          color: var(--white);
          transform: translateY(-3px);
        }
        .joinus-page-container .id-tag:hover::before {
          opacity: 1;
        }
        .joinus-page-container .id-tag svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .joinus-page-container .id-tag span {
          position: relative;
          z-index: 1;
        }

        /* ══ FORM ══ */
        .joinus-page-container .form-sec {
          background: var(--black);
          padding: 100px 0 120px;
          position: relative;
        }
        .joinus-page-container .form-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 72px;
          align-items: start;
        }

        .joinus-page-container .form-editorial {
          position: sticky;
          top: 100px;
        }
        .joinus-page-container .fe-kicker {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--pink);
          font-weight: 600;
          margin-bottom: 20px;
        }
        .joinus-page-container .fe-h {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 4vw, 4.8rem);
          font-weight: 800;
          letter-spacing: -2.5px;
          line-height: .9;
          margin-bottom: 28px;
        }
        .joinus-page-container .fe-h .block {
          display: block;
        }
        .joinus-page-container .fe-h .wh { color: var(--white); }
        .joinus-page-container .fe-h .pk { color: var(--pink); }
        .joinus-page-container .fe-h .ol {
          -webkit-text-stroke: 1.5px var(--w50);
          color: transparent;
        }
        .joinus-page-container .fe-p {
          font-size: .97rem;
          color: var(--w75);
          line-height: 1.8;
          font-weight: 400;
          max-width: 320px;
          margin-bottom: 36px;
        }
        .joinus-page-container .fe-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .joinus-page-container .fe-stat {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1px solid var(--w12);
          border-radius: 12px;
          background: var(--w07);
        }
        .joinus-page-container .fe-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--pink), var(--purple-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          flex-shrink: 0;
        }
        .joinus-page-container .fe-stat-lbl {
          font-size: .8rem;
          color: var(--w75);
          font-weight: 400;
          line-height: 1.35;
        }

        /* FORM CARD */
        .joinus-page-container .form-card {
          background: var(--black-2);
          border: 1px solid var(--w12);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
        }
        .joinus-page-container .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--pink), var(--purple-2), var(--pink));
          background-size: 200%;
          animation: bbgGradShift 4s linear infinite;
        }
        @keyframes bbgGradShift {
          0% { background-position: 0%; }
          100% { background-position: 200%; }
        }

        .joinus-page-container .form-top {
          padding: 36px 40px 0;
        }
        .joinus-page-container .form-label {
          font-family: 'Syne', sans-serif;
          font-size: .66rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--purple-2);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .joinus-page-container .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 300;
          font-style: italic;
          color: var(--white);
          margin-bottom: 6px;
          line-height: 1.15;
        }
        .joinus-page-container .form-title em {
          color: var(--pink);
          font-style: normal;
        }
        .joinus-page-container .form-desc {
          font-size: .88rem;
          color: var(--w75);
          font-weight: 400;
          line-height: 1.65;
          margin-bottom: 28px;
        }

        .joinus-page-container .form-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }
        .joinus-page-container .fp-pill {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: var(--w12);
          transition: background .4s;
        }
        .joinus-page-container .fp-pill.active {
          background: linear-gradient(90deg, var(--pink), var(--purple-2));
        }
        .joinus-page-container .fp-label {
          font-family: 'Syne', sans-serif;
          font-size: .62rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--w50);
          white-space: nowrap;
        }

        .joinus-page-container .form-body {
          padding: 0 40px;
        }
        .joinus-page-container .frow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .joinus-page-container .fg {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .joinus-page-container .fg label {
          font-family: 'Syne', sans-serif;
          font-size: .65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--w75);
          font-weight: 600;
          text-align: left;
        }
        .joinus-page-container .fi, 
        .joinus-page-container .fs, 
        .joinus-page-container .ft {
          background: rgba(255, 255, 255, .05);
          border: 1.5px solid var(--w12);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: .95rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--white);
          transition: border .25s, background .25s, box-shadow .25s;
          width: 100%;
        }
        .joinus-page-container .fi::placeholder, 
        .joinus-page-container .ft::placeholder {
          color: var(--w50);
        }
        .joinus-page-container .fi:focus, 
        .joinus-page-container .fs:focus, 
        .joinus-page-container .ft:focus {
          outline: none;
          border-color: var(--pink);
          background: rgba(255, 31, 125, .07);
          box-shadow: 0 0 0 4px rgba(255, 31, 125, .1);
        }
        .joinus-page-container .fi.err, 
        .joinus-page-container .fs.err {
          border-color: #FF4444;
          box-shadow: 0 0 0 3px rgba(255, 68, 68, .1);
        }
        .joinus-page-container .fi.ok {
          border-color: var(--purple-2);
        }
        .joinus-page-container .ft {
          resize: vertical;
          min-height: 130px;
          line-height: 1.6;
        }
        .joinus-page-container .fs {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A259FF' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
          background-color: rgba(255, 255, 255, .05);
        }
        .joinus-page-container .fs option {
          background: var(--black-3);
          color: var(--white);
        }
        .joinus-page-container .emsg {
          font-size: .76rem;
          color: #FF6B6B;
          margin-top: 3px;
          font-weight: 500;
          text-align: left;
        }

        .joinus-page-container .guardian-notice {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          background: rgba(255, 200, 50, .07);
          border: 1px solid rgba(255, 200, 50, .22);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 12px;
          font-size: .8rem;
          color: rgba(255, 220, 80, .92);
          line-height: 1.55;
          text-align: left;
        }
        .joinus-page-container .guardian-notice svg {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .joinus-page-container .deep-q {
          background: linear-gradient(135deg, rgba(123, 47, 190, .2), rgba(255, 31, 125, .1));
          border: 1px solid rgba(162, 89, 255, .28);
          border-radius: 16px;
          padding: 24px 22px;
          margin-bottom: 14px;
        }
        .joinus-page-container .dq-tag {
          font-family: 'Syne', sans-serif;
          font-size: .63rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--purple-2);
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .joinus-page-container .dq-tag svg {
          width: 10px;
          height: 10px;
        }
        .joinus-page-container .dq-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-style: italic;
          font-weight: 400;
          color: var(--white);
          line-height: 1.4;
          margin-bottom: 14px;
          text-align: left;
        }
        .joinus-page-container .dq-q em {
          color: var(--pink);
          font-style: normal;
        }
        .joinus-page-container .char-rel {
          position: relative;
        }
        .joinus-page-container .char-cnt {
          position: absolute;
          bottom: 10px;
          right: 13px;
          font-size: .67rem;
          color: var(--w50);
          pointer-events: none;
          font-family: 'Syne', sans-serif;
        }

        .joinus-page-container .agree-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 18px;
          background: var(--w07);
          border: 1px solid var(--w12);
          border-radius: 12px;
          margin-bottom: 14px;
          text-align: left;
          transition: outline 0.2s ease;
        }
        .joinus-page-container .agree-row input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--pink);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .joinus-page-container .agree-row label {
          font-size: .83rem;
          color: var(--w75);
          font-weight: 400;
          line-height: 1.6;
        }
        .joinus-page-container .agree-row label strong {
          color: var(--white);
          font-weight: 600;
        }

        .joinus-page-container .form-foot {
          padding: 20px 40px 36px;
        }
        .joinus-page-container .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          border: none;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: .9rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--white);
          cursor: pointer;
          transition: all .3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .joinus-page-container .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--purple), var(--pink));
          opacity: 0;
          transition: opacity .4s;
        }
        .joinus-page-container .submit-btn:hover::after {
          opacity: 1;
        }
        .joinus-page-container .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 48px rgba(255, 31, 125, .32);
        }
        .joinus-page-container .submit-btn:disabled {
          opacity: .4;
          transform: none;
          box-shadow: none;
          pointer-events: none;
        }
        .joinus-page-container .submit-btn svg, 
        .joinus-page-container .submit-btn span {
          position: relative;
          z-index: 1;
        }
        .joinus-page-container .submit-btn svg {
          width: 18px;
          height: 18px;
        }
        .joinus-page-container .form-note {
          text-align: center;
          margin-top: 12px;
          font-size: .75rem;
          color: var(--w50);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .joinus-page-container .form-note svg {
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }

        .joinus-page-container .success-view {
          padding: 56px 40px;
          text-align: center;
        }
        .joinus-page-container .success-view.show {
          display: block;
          animation: bbgFadeIn .6s ease forwards;
        }
        @keyframes bbgFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .joinus-page-container .suc-ico {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pink-dim), var(--purple-dim));
          border: 1px solid rgba(255, 31, 125, .3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .joinus-page-container .suc-ico svg {
          width: 32px;
          height: 32px;
        }
        .joinus-page-container .suc-h {
          font-family: 'Syne', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .joinus-page-container .suc-h .pk {
          color: var(--pink);
        }
        .joinus-page-container .suc-rule {
          width: 44px;
          height: 2px;
          background: linear-gradient(90deg, var(--pink), var(--purple-2));
          border-radius: 2px;
          margin: 16px auto;
        }
        .joinus-page-container .suc-p {
          font-size: .9rem;
          color: var(--w75);
          line-height: 1.75;
          max-width: 320px;
          margin: 0 auto 22px;
        }
        .joinus-page-container .suc-p strong {
          color: var(--pink);
        }
        .joinus-page-container .suc-email {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 100px;
          border: 1px solid var(--w25);
          font-size: .82rem;
          color: var(--w75);
          transition: all .25s;
          text-decoration: none;
        }
        .joinus-page-container .suc-email:hover {
          border-color: var(--pink);
          color: var(--pink);
        }
        .joinus-page-container .suc-email svg {
          width: 14px;
          height: 14px;
        }

        /* ══ VOICES ══ */
        .joinus-page-container .voices-sec {
          background: var(--black-3);
          padding: 100px 0;
        }
        .joinus-page-container .voices-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 72px;
        }
        .joinus-page-container .voices-hd {
          text-align: center;
          margin-bottom: 56px;
        }
        .joinus-page-container .voices-kicker {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--purple-2);
          font-weight: 600;
          margin-bottom: 14px;
        }
        .joinus-page-container .voices-h {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 3.8vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -2px;
          line-height: .95;
        }
        .joinus-page-container .voices-h .wh {
          color: var(--white);
        }
        .joinus-page-container .voices-h .ol {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, .22);
          color: transparent;
        }
        .joinus-page-container .voices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .joinus-page-container .vc {
          background: var(--black-2);
          border: 1px solid var(--w12);
          border-radius: 20px;
          padding: 32px 28px;
          transition: all .3s cubic-bezier(.34, 1.56, .64, 1);
          position: relative;
          overflow: hidden;
          text-align: left;
        }
        .joinus-page-container .vc::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--pink), var(--purple-2));
          opacity: 0;
          transition: opacity .3s;
        }
        .joinus-page-container .vc:hover {
          transform: translateY(-7px);
          border-color: var(--pink);
          box-shadow: 0 20px 56px rgba(255, 31, 125, .14);
        }
        .joinus-page-container .vc:hover::before {
          opacity: 1;
        }
        .joinus-page-container .vc-q-mark {
          font-family: 'Syne', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--pink);
          line-height: 1;
          margin-bottom: 10px;
          opacity: .32;
        }
        .joinus-page-container .vc-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.22rem;
          font-style: italic;
          font-weight: 400;
          color: var(--white);
          line-height: 1.55;
          margin-bottom: 24px;
        }
        .joinus-page-container .vc-foot {
          display: flex;
          align-items: center;
          gap: 11px;
          padding-top: 18px;
          border-top: 1px solid var(--w12);
        }
        .joinus-page-container .vc-av {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .joinus-page-container .vc-name {
          font-family: 'Syne', sans-serif;
          font-size: .8rem;
          font-weight: 700;
          color: var(--white);
          letter-spacing: .3px;
        }
        .joinus-page-container .vc-meta {
          font-size: .75rem;
          color: var(--w50);
          margin-top: 2px;
        }

        .joinus-page-container .voices-hint {
          display: none;
        }

        /* ══ FAQ ══ */
        .joinus-page-container .faq-sec {
          background: var(--black);
          padding: 100px 0;
        }
        .joinus-page-container .faq-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 72px;
        }
        .joinus-page-container .faq-kicker {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--pink);
          font-weight: 600;
          text-align: center;
          margin-bottom: 14px;
        }
        .joinus-page-container .faq-h {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.9rem, 3.2vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -1.5px;
          text-align: center;
          margin-bottom: 48px;
          color: var(--white);
        }
        .joinus-page-container .faq-item {
          border-bottom: 1px solid var(--w12);
        }
        .joinus-page-container .faq-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 20px 0;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: .97rem;
          font-weight: 500;
          color: var(--w75);
          text-align: left;
          transition: color .2s;
        }
        .joinus-page-container .faq-btn:hover {
          color: var(--white);
        }
        .joinus-page-container .faq-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--w25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all .3s;
          color: var(--w75);
        }
        .joinus-page-container .faq-arrow svg {
          width: 11px;
          height: 11px;
          transition: transform .3s;
        }
        .joinus-page-container .faq-item.open .faq-btn {
          color: var(--white);
        }
        .joinus-page-container .faq-item.open .faq-arrow {
          background: var(--pink);
          border-color: var(--pink);
          color: var(--white);
        }
        .joinus-page-container .faq-item.open .faq-arrow svg {
          transform: rotate(180deg);
        }
        .joinus-page-container .faq-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height .4s ease;
        }
        .joinus-page-container .faq-item.open .faq-body {
          max-height: 220px;
        }
        .joinus-page-container .faq-body p {
          padding-bottom: 20px;
          font-size: .9rem;
          color: var(--w75);
          line-height: 1.8;
          font-weight: 400;
          text-align: left;
        }

        /* ══ INNER FOOTER ══ */
        .joinus-page-container .footer {
          background: var(--black-2);
          padding: 72px 0 44px;
          text-align: center;
          border-top: 1px solid var(--w12);
        }
        .joinus-page-container .footer-h {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3vw, 3rem);
          font-weight: 800;
          letter-spacing: -1.5px;
          margin-bottom: 10px;
          line-height: .95;
        }
        .joinus-page-container .footer-h .wh { color: var(--white); }
        .joinus-page-container .footer-h .pk { color: var(--pink); }
        .joinus-page-container .footer-h .ol {
          -webkit-text-stroke: 1.5px var(--w50);
          color: transparent;
        }
        .joinus-page-container .footer-sub {
          font-size: .9rem;
          color: var(--w75);
          margin-bottom: 28px;
        }
        .joinus-page-container .footer-email {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          border-radius: 100px;
          border: 1.5px solid var(--w25);
          font-size: .88rem;
          color: var(--white);
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          transition: all .3s;
          text-decoration: none;
        }
        .joinus-page-container .footer-email svg {
          width: 15px;
          height: 15px;
        }
        .joinus-page-container .footer-email:hover {
          background: var(--pink);
          border-color: var(--pink);
          color: var(--black);
        }
        .joinus-page-container .footer-copy {
          margin-top: 48px;
          font-size: .73rem;
          color: var(--w50);
          letter-spacing: .5px;
        }

        /* REVEAL */
        .joinus-page-container .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .75s ease, transform .75s ease;
        }
        .joinus-page-container .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .joinus-page-container .carousel-hint {
          display: none;
        }

        /* ══════════════════════════════
           TABLET  ≤ 1024px
        ══════════════════════════════ */
        @media(max-width: 1100px) {
          .joinus-page-container .form-inner {
            grid-template-columns: 1fr;
            max-width: 620px;
            gap: 40px;
            padding: 0 28px;
          }
          .joinus-page-container .form-editorial {
            position: static;
          }
          .joinus-page-container .fe-stats {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
          }
          .joinus-page-container .fe-stat {
            flex: 1;
            min-width: 130px;
          }
        }
        @media(max-width: 1024px) {
          .joinus-page-container .joinus-hero-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .joinus-page-container .joinus-hero-left {
            padding: 72px 40px 48px;
            border-right: none;
          }
          .joinus-page-container .joinus-hero-right {
            padding: 0 40px 56px;
          }
          .joinus-page-container .joinus-hero-bottom {
            padding: 20px 40px;
          }
          .joinus-page-container .id-inner, 
          .joinus-page-container .voices-inner, 
          .joinus-page-container .faq-inner {
            padding: 0 40px;
          }
          .joinus-page-container .id-header {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 36px;
          }
          .joinus-page-container .voices-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ══════════════════════════════
           MOBILE  ≤ 640px
        ══════════════════════════════ */
        @media(max-width: 640px) {
          /* ── GLOBAL ── */
          .joinus-page-container .identity-sec, 
          .joinus-page-container .voices-sec, 
          .joinus-page-container .faq-sec {
            padding: 52px 0;
          }
          .joinus-page-container .form-sec {
            padding: 52px 0 60px;
          }
          .joinus-page-container .footer {
            padding: 48px 0 32px;
          }

          /* ── HERO ── */
          .joinus-page-container .joinus-hero-grid {
            display: flex;
            flex-direction: column;
          }
          .joinus-page-container .joinus-hero-left {
            padding: 44px 20px 32px;
            border-right: none;
          }
          .joinus-page-container .joinus-hero-right {
            padding: 0 20px 36px;
          }
          .joinus-page-container .kicker {
            margin-bottom: 18px;
          }
          .joinus-page-container .joinus-hero-h1 .line-inner {
            font-size: clamp(2.6rem, 10.5vw, 3.8rem);
            letter-spacing: -1.5px;
          }
          .joinus-page-container .joinus-hero-h1 {
            margin-bottom: 24px;
          }
          .joinus-page-container .joinus-hero-sub {
            font-size: .93rem;
            max-width: 100%;
          }
          .joinus-page-container .joinus-hero-sub-wrap {
            gap: 20px;
          }
          .joinus-page-container .joinus-hero-cta-row {
            gap: 10px;
          }
          .joinus-page-container .btn-pink {
            padding: 13px 22px;
            font-size: .78rem;
          }
          .joinus-page-container .btn-ghost {
            padding: 12px 18px;
            font-size: .76rem;
          }

          /* STATS — horizontal swipe */
          .joinus-page-container .stat-display {
            flex-direction: row;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .joinus-page-container .stat-display::-webkit-scrollbar {
            display: none;
          }
          .joinus-page-container .stat-row {
            flex-direction: column;
            align-items: flex-start;
            flex-shrink: 0;
            min-width: 120px;
            padding: 16px 14px;
            gap: 3px;
            border-bottom: none;
            border-right: 1px solid var(--w12);
          }
          .joinus-page-container .stat-row:first-child {
            border-top: none;
          }
          .joinus-page-container .stat-row:last-child {
            border-right: none;
          }
          .joinus-page-container .stat-row::after {
            display: none;
          }
          .joinus-page-container .stat-num {
            font-size: 2rem;
            letter-spacing: -1px;
            -webkit-text-fill-color: unset;
            background: none;
            color: var(--pink);
          }
          .joinus-page-container .stat-label {
            font-size: .73rem;
            max-width: 90px;
          }

          /* HERO BOTTOM */
          .joinus-page-container .joinus-hero-bottom {
            padding: 14px 20px;
            border-top: none;
            flex-wrap: nowrap;
            gap: 0;
          }
          .joinus-page-container .hb-scroll {
            display: none;
          }
          .joinus-page-container .hb-txt {
            font-size: .76rem;
          }
          .joinus-page-container .hb-txt strong {
            font-size: .78rem;
          }

          /* ── IDENTITY ── */
          .joinus-page-container .id-inner {
            padding: 0 20px;
          }
          .joinus-page-container .id-header {
            gap: 12px;
            margin-bottom: 20px;
          }
          .joinus-page-container .id-h {
            font-size: clamp(1.8rem, 7.5vw, 2.4rem);
          }
          .joinus-page-container .id-right p {
            font-size: .9rem;
          }

          /* TAGS — horizontal swipe */
          .joinus-page-container .id-tags {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 8px;
            padding-bottom: 4px;
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .joinus-page-container .id-tags::-webkit-scrollbar {
            display: none;
          }
          .joinus-page-container .id-tag {
            flex-shrink: 0;
            padding: 10px 16px;
            font-size: .8rem;
            white-space: nowrap;
          }
          .joinus-page-container .id-tag:hover {
            transform: none;
          }

          /* TAGS hint */
          .joinus-page-container .id-tags-wrap .carousel-hint {
            display: flex;
            justify-content: flex-start;
            gap: 4px;
            margin-top: 14px;
            padding-left: 20px;
          }
          .joinus-page-container .carousel-hint span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--w12);
            flex-shrink: 0;
          }
          .joinus-page-container .carousel-hint span.a {
            background: var(--pink);
            width: 14px;
            border-radius: 3px;
          }

          /* ── FORM EDITORIAL ── */
          .joinus-page-container .form-inner {
            padding: 0 16px;
            gap: 24px;
            grid-template-columns: 1fr;
          }
          .joinus-page-container .form-editorial {
            position: static;
          }
          .joinus-page-container .fe-kicker {
            margin-bottom: 10px;
          }
          .joinus-page-container .fe-h {
            font-size: clamp(2.4rem, 10.5vw, 3.6rem);
            letter-spacing: -2px;
            margin-bottom: 14px;
          }
          .joinus-page-container .fe-p {
            font-size: .87rem;
            margin-bottom: 20px;
            max-width: 100%;
          }

          /* FORM STATS — stack vertically on mobile */
          .joinus-page-container .fe-stats {
            flex-direction: column;
            flex-wrap: wrap;
            overflow-x: unset;
            gap: 8px;
            padding-bottom: 0;
          }
          .joinus-page-container .fe-stat {
            flex-shrink: unset;
            min-width: unset;
            width: 100%;
            padding: 11px 13px;
            border-radius: 10px;
          }
          .joinus-page-container .fe-stat-num {
            font-size: 1.2rem;
          }
          .joinus-page-container .fe-stat-lbl {
            font-size: .72rem;
          }

          /* ── FORM CARD ── */
          .joinus-page-container .form-card {
            border-radius: 18px;
          }
          .joinus-page-container .form-top {
            padding: 22px 18px 0;
          }
          .joinus-page-container .form-body {
            padding: 0 18px;
          }
          .joinus-page-container .form-foot {
            padding: 12px 18px 28px;
          }
          .joinus-page-container .form-title {
            font-size: 1.7rem;
          }
          .joinus-page-container .form-desc {
            font-size: .84rem;
            margin-bottom: 20px;
          }
          .joinus-page-container .form-progress {
            margin-bottom: 20px;
          }
          .joinus-page-container .fg {
            margin-bottom: 10px;
          }
          .joinus-page-container .fg label {
            font-size: .63rem;
          }
          .joinus-page-container .fi, 
          .joinus-page-container .fs, 
          .joinus-page-container .ft {
            padding: 12px 14px;
            font-size: .93rem;
            border-radius: 10px;
          }
          .joinus-page-container .frow {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          .joinus-page-container .deep-q {
            padding: 18px 16px;
            margin-bottom: 10px;
            border-radius: 14px;
          }
          .joinus-page-container .dq-q {
            font-size: 1.1rem;
            margin-bottom: 10px;
          }
          .joinus-page-container .ft {
            min-height: 110px;
          }
          .joinus-page-container .agree-row {
            padding: 12px 14px;
            gap: 10px;
            margin-bottom: 10px;
            border-radius: 10px;
          }
          .joinus-page-container .agree-row label {
            font-size: .8rem;
          }
          .joinus-page-container .submit-btn {
            padding: 16px;
            font-size: .85rem;
            border-radius: 12px;
            gap: 8px;
          }
          .joinus-page-container .submit-btn svg {
            width: 16px;
            height: 16px;
          }
          .joinus-page-container .form-note {
            font-size: .72rem;
            margin-top: 10px;
          }
          .joinus-page-container .success-view {
            padding: 36px 18px;
          }
          .joinus-page-container .suc-h {
            font-size: 1.65rem;
          }

          /* ── VOICES — horizontal swipe ── */
          .joinus-page-container .voices-inner {
            padding: 0;
          }
          .joinus-page-container .voices-hd {
            padding: 0 20px;
            margin-bottom: 24px;
          }
          .joinus-page-container .voices-h {
            font-size: clamp(1.7rem, 7.5vw, 2.4rem);
            letter-spacing: -1.2px;
          }
          .joinus-page-container .voices-kicker {
            margin-bottom: 8px;
          }
          .joinus-page-container .voices-grid {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 12px;
            padding: 0 20px 8px;
            grid-template-columns: unset;
          }
          .joinus-page-container .voices-grid::-webkit-scrollbar {
            display: none;
          }
          .joinus-page-container .vc {
            flex-shrink: 0;
            width: 78vw;
            max-width: 280px;
            padding: 20px 18px;
            border-radius: 16px;
          }
          .joinus-page-container .vc::before {
            display: none;
          }
          .joinus-page-container .vc:hover {
            transform: none;
          }
          .joinus-page-container .vc-q-mark {
            font-size: 3rem;
            margin-bottom: 8px;
          }
          .joinus-page-container .vc-quote {
            font-size: 1.08rem;
            margin-bottom: 18px;
          }
          .joinus-page-container .vc-name {
            font-size: .78rem;
          }

          /* Voices hint */
          .joinus-page-container .voices-hint {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-top: 14px;
          }
          .joinus-page-container .voices-hint span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--w12);
            flex-shrink: 0;
          }
          .joinus-page-container .voices-hint span.a {
            background: var(--pink);
            width: 14px;
            border-radius: 3px;
          }

          /* ── FAQ ── */
          .joinus-page-container .faq-inner {
            padding: 0 20px;
          }
          .joinus-page-container .faq-h {
            margin-bottom: 24px;
            font-size: clamp(1.55rem, 7vw, 2.2rem);
            letter-spacing: -.8px;
          }
          .joinus-page-container .faq-btn {
            padding: 17px 0;
            font-size: .88rem;
          }
          .joinus-page-container .faq-body p {
            font-size: .86rem;
            padding-bottom: 16px;
          }
          .joinus-page-container .faq-item.open .faq-body {
            max-height: 260px;
          }

          /* ── FOOTER ── */
          .joinus-page-container .footer {
            padding: 40px 20px 28px;
          }
          .joinus-page-container .footer h2, 
          .joinus-page-container .footer p, 
          .joinus-page-container .footer a {
            text-align: center;
          }
          .joinus-page-container .footer-h {
            font-size: clamp(1.65rem, 8vw, 2.4rem);
            margin-bottom: 8px;
          }
          .joinus-page-container .footer-sub {
            font-size: .84rem;
            margin-bottom: 20px;
          }
          .joinus-page-container .footer-email {
            font-size: .82rem;
            padding: 12px 22px;
          }
          .joinus-page-container .footer-copy {
            margin-top: 28px;
            font-size: .7rem;
          }
        }

        @media(max-width: 380px) {
          .joinus-page-container .joinus-hero-h1 .line-inner {
            font-size: clamp(2.2rem, 10vw, 3rem);
          }
          .joinus-page-container .stat-row {
            min-width: 108px;
          }
          .joinus-page-container .vc {
            width: 86vw;
          }
          .joinus-page-container .id-tag {
            font-size: .76rem;
            padding: 9px 13px;
          }
        }
      `}</style>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <div className="marquee-item">Bold &amp; Brilliant Girls</div>
          <div className="marquee-item">Ambition has a community now</div>
          <div className="marquee-item">Bold &amp; Brilliant Girls</div>
          <div className="marquee-item">500+ women in 18 countries</div>
          <div className="marquee-item">Bold &amp; Brilliant Girls</div>
          <div className="marquee-item">Mentorship. Stories. Sisterhood</div>
          <div className="marquee-item">Bold &amp; Brilliant Girls</div>
          <div className="marquee-item">Ambition has a community now</div>
          <div className="marquee-item">Bold &amp; Brilliant Girls</div>
          <div className="marquee-item">500+ women in 18 countries</div>
          <div className="marquee-item">Bold &amp; Brilliant Girls</div>
          <div className="marquee-item">Mentorship. Stories. Sisterhood</div>
        </div>
      </div>

      {/* HERO */}
      <section className="joinus-hero">
        <div className="joinus-hero-bg"></div>
        <div className="joinus-hero-blob-a"></div>
        <div className="joinus-hero-blob-b"></div>
        <div className="joinus-hero-grid">
          <div className="joinus-hero-left">
            <div className="kicker">
              <div className="kicker-dot"></div>
              <span className="kicker-txt">For girls who refuse to shrink</span>
            </div>
            <h1 className="joinus-hero-h1">
              <span className="line"><span className="line-inner" style={{ color: 'var(--white)' }}>You don't</span></span>
              <span className="line"><span className="line-inner pink">figure it</span></span>
              <span className="line"><span className="line-inner outline">out alone.</span></span>
            </h1>
            <div className="joinus-hero-sub-wrap">
              <p className="joinus-hero-sub">Bold &amp; Brilliant Girls pairs ambition with mentors, real stories, and a sisterhood built to last. No filters. No pretending. Just women who show up for each other.</p>
              <div className="joinus-hero-cta-row">
                <a href="#join" className="btn-pink">
                  <span>Join the Circle</span>
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#about" className="btn-ghost">Learn more</a>
              </div>
            </div>
          </div>
          <div className="joinus-hero-right">
            <div className="stat-display">
              <div className="stat-row">
                <span className="stat-num">500+</span>
                <span className="stat-label">Girls inside the community</span>
              </div>
              <div className="stat-row">
                <span className="stat-num">18</span>
                <span className="stat-label">Countries represented</span>
              </div>
              <div className="stat-row">
                <span className="stat-num">50+</span>
                <span className="stat-label">Podcast episodes published</span>
              </div>
              <div className="stat-row">
                <span className="stat-num">30+</span>
                <span className="stat-label">Active mentors across 12 fields</span>
              </div>
            </div>
          </div>
        </div>
        <div className="joinus-hero-bottom">
          <div className="hb-members">
            <div className="hb-avs">
              <div className="hb-av av-1">A</div>
              <div className="hb-av av-2">P</div>
              <div className="hb-av av-3">S</div>
              <div className="hb-av av-4">+</div>
            </div>
            <div className="hb-txt">
              <strong>500+ girls already inside</strong>
              across 18 countries — growing every week
            </div>
          </div>
          <div className="hb-scroll">
            <div className="scroll-arrow">
              <svg viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 8l4 4 4-4" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            scroll down
          </div>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="identity-sec" id="about">
        <div className="id-inner">
          <div className="id-header reveal">
            <div className="id-left">
              <p className="id-kicker">You belong here if you are</p>
              <h2 className="id-h">A girl who carries a vision<br/><strong>bigger than the room</strong></h2>
            </div>
            <div className="id-right">
              <p>We didn't build this for the girl who has it all figured out. We built it for the one who's ambitious, searching, and tired of navigating it alone. If any of these sound like you — keep scrolling.</p>
            </div>
          </div>
          <div className="id-tags-wrap reveal" style={{ transitionDelay: '.1s' }}>
            <div className="id-tags">
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 5.2H15L10.1 9.5l1.8 5.5L8 11.7l-3.9 3.3 1.8-5.5L1 6.2h5.2z" stroke="var(--pink)" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                <span>Building something from nothing</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="var(--purple-2)" stroke-width="1.3"/><path d="M8 5v3l2 2" stroke="var(--purple-2)" stroke-width="1.3" stroke-linecap="round"/></svg>
                <span>Working hard in silence</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><path d="M2 12l4-4 3 3 5-7" stroke="var(--pink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Refusing to shrink for anyone</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="var(--purple-2)" stroke-width="1.3"/><path d="M5.5 8l2 2 3-3" stroke="var(--purple-2)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Ready to be seen</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><path d="M8 14S2 10.5 2 6.5a6 6 0 0112 0C14 10.5 8 14 8 14z" stroke="var(--pink)" stroke-width="1.3" stroke-linejoin="round"/></svg>
                <span>Ambitious, anxious, doing it anyway</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="var(--purple-2)" stroke-width="1.3"/><path d="M9.5 9.5L14 14" stroke="var(--purple-2)" stroke-width="1.4" stroke-linecap="round"/></svg>
                <span>Looking for the right people, not just any</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="2" stroke="var(--pink)" stroke-width="1.3"/><path d="M6 8h4M8 6v4" stroke="var(--pink)" stroke-width="1.3" stroke-linecap="round"/></svg>
                <span>Writing a story no one has written before</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1C4.7 1 2 3.7 2 7s2.7 6 6 6 6-2.7 6-6" stroke="var(--purple-2)" stroke-width="1.3" stroke-linecap="round"/><path d="M8 1l2 3-2 1-2-1z" fill="var(--purple-2)" opacity=".5"/></svg>
                <span>Outgrowing your old self on purpose</span>
              </div>
              <div className="id-tag">
                <svg viewBox="0 0 16 16" fill="none"><path d="M2 8c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="var(--pink)" stroke-width="1.3" stroke-linecap="round"/><path d="M8 5v3" stroke="var(--pink)" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="11" r=".8" fill="var(--pink)"/></svg>
                <span>Questioning everything, doubting nothing about yourself</span>
              </div>
            </div>
            <div className="carousel-hint">
              <span className="a"></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="form-sec" id="join">
        <div className="form-inner">
          <div className="form-editorial reveal">
            <p className="fe-kicker">Your seat at the table</p>
            <h2 className="fe-h">
              <span className="block wh">Join</span>
              <span className="block pk">the</span>
              <span className="block ol">circle.</span>
            </h2>
            <p className="fe-p">We ask a few real questions — not to filter you out, but to match you with the right mentors who'll genuinely get it. Takes less than 3 minutes.</p>
            <div className="fe-stats">
              <div className="fe-stat">
                <div className="fe-stat-num">500+</div>
                <div className="fe-stat-lbl">Members inside</div>
              </div>
              <div className="fe-stat">
                <div className="fe-stat-num">3 days</div>
                <div className="fe-stat-lbl">Personal welcome</div>
              </div>
              <div className="fe-stat">
                <div className="fe-stat-num">Free</div>
                <div className="fe-stat-lbl">Always, forever</div>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '.15s' }}>
            <div className="form-card" id="formCard">
              {isSubmitted ? (
                <div className="success-view show" id="successView">
                  <div className="suc-ico">
                    <svg viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="16" stroke="var(--pink)" strokeWidth="1.2"/>
                      <path d="M10 18l6 6 10-10" stroke="var(--pink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="suc-h">Welcome to<br/>the <span className="pk">circle.</span></h2>
                  <div className="suc-rule"></div>
                  <p className="suc-p">Your application is with us. Sanah will send a personal welcome within <strong>3 business days</strong> along with your first steps into the community.</p>
                  <a className="suc-email" href="mailto:sanah@bnbgirl.com">
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1.5 5l6.5 4.5L14.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    sanah@bnbgirl.com
                  </a>
                </div>
              ) : (
                <div id="formBody">
                  <div className="form-top">
                    <p className="form-label">Application 2026</p>
                    <h3 className="form-title">Tell us who you <em>are</em>.</h3>
                    <p className="form-desc">A few honest questions. No CVs, no filters, no performing. Just you.</p>
                    <div className="form-progress">
                      <div className="fp-pill active" id="pp1"></div>
                      <div className="fp-pill active" id="pp2"></div>
                      <div className={`fp-pill ${dream.length > 10 ? 'active' : ''}`} id="pp3"></div>
                      <span className="fp-label">Step 1 of 2</span>
                    </div>
                  </div>

                  <form id="mainForm" onSubmit={handleSubmit} noValidate>
                    <div className="form-body">
                      <div className="frow">
                        <div className={`fg ${errors.name ? 'has-err' : ''}`} id="fg-name">
                          <label htmlFor="f-name">Your Name *</label>
                          <input 
                            className={`fi ${errors.name ? 'err' : name ? 'ok' : ''}`} 
                            type="text" 
                            id="f-name" 
                            placeholder="What do you go by?" 
                            autoComplete="name"
                            value={name}
                            onChange={(e) => handleInputChange('name', e.target.value, setName)}
                            maxLength={50}
                          />
                          {errors.name && <span className="emsg">Please enter your name.</span>}
                        </div>
                        <div className={`fg ${errors.age ? 'has-err' : ''}`} id="fg-age">
                          <label htmlFor="f-age">Age * (14–25)</label>
                          <input 
                            className={`fi ${errors.age ? 'err' : age ? 'ok' : ''}`} 
                            type="number" 
                            id="f-age" 
                            placeholder="e.g. 20" 
                            min="14" 
                            max="25" 
                            inputMode="numeric"
                            value={age}
                            onChange={(e) => handleInputChange('age', e.target.value, setAge)}
                          />
                          {errors.age && <span className="emsg">Must be 14–25.</span>}
                        </div>
                      </div>

                      <div className={`fg ${errors.email ? 'has-err' : ''}`} id="fg-email">
                        <label htmlFor="f-email">Email Address *</label>
                        <input 
                          className={`fi ${errors.email ? 'err' : email ? 'ok' : ''}`} 
                          type="email" 
                          id="f-email" 
                          placeholder="you@email.com" 
                          autoComplete="email" 
                          inputMode="email"
                          value={email}
                          onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                        />
                        {errors.email && <span className="emsg">Please enter a valid email.</span>}
                      </div>

                      {showGuardianField && (
                        <div id="guardian-wrap" style={{ display: 'block' }}>
                          <div className="guardian-notice">
                            <svg viewBox="0 0 16 16" fill="none">
                              <path d="M8 1.5L1 14.5h14L8 1.5z" stroke="rgba(255,200,50,.9)" strokeWidth="1.3" strokeLinejoin="round"/>
                              <line x1="8" y1="7" x2="8" y2="11" stroke="rgba(255,200,50,.9)" strokeWidth="1.3" strokeLinecap="round"/>
                              <circle cx="8" cy="12.5" r=".7" fill="rgba(255,200,50,.9)"/>
                            </svg>
                            Under 18? We need a parent or guardian email too.
                          </div>
                          <div className={`fg ${errors.guardianEmail ? 'has-err' : ''}`} id="fg-guardian">
                            <label htmlFor="f-guardian">Guardian Email *</label>
                            <input 
                              className={`fi ${errors.guardianEmail ? 'err' : guardianEmail ? 'ok' : ''}`} 
                              type="email" 
                              id="f-guardian" 
                              placeholder="parent@email.com" 
                              inputMode="email"
                              value={guardianEmail}
                              onChange={(e) => handleInputChange('guardianEmail', e.target.value, setGuardianEmail)}
                            />
                            {errors.guardianEmail && <span className="emsg">Please enter a valid guardian email.</span>}
                          </div>
                        </div>
                      )}

                      <div className={`fg ${errors.field ? 'has-err' : ''}`} id="fg-field">
                        <label htmlFor="f-field">Your Field or Interest *</label>
                        <select 
                          className={`fs ${errors.field ? 'err' : field ? 'ok' : ''}`} 
                          id="f-field"
                          value={field}
                          onChange={(e) => handleInputChange('field', e.target.value, setField)}
                        >
                          <option value="" disabled>Pick one that fits</option>
                          <option value="Technology & STEM">Technology &amp; STEM</option>
                          <option value="Business & Entrepreneurship">Business &amp; Entrepreneurship</option>
                          <option value="Medicine & Healthcare">Medicine &amp; Healthcare</option>
                          <option value="Law & Policy">Law &amp; Policy</option>
                          <option value="Finance & Banking">Finance &amp; Banking</option>
                          <option value="Arts, Media & Design">Arts, Media &amp; Design</option>
                          <option value="Education & Teaching">Education &amp; Teaching</option>
                          <option value="Social Impact & NGO Work">Social Impact &amp; NGO Work</option>
                          <option value="Science & Research">Science &amp; Research</option>
                          <option value="Fashion & Beauty">Fashion &amp; Beauty</option>
                          <option value="Sports & Wellness">Sports &amp; Wellness</option>
                          <option value="Still figuring it out">Still figuring it out</option>
                        </select>
                        {errors.field && <span className="emsg">Please select your field.</span>}
                      </div>

                      <div className="fg">
                        <label htmlFor="f-source">How did you find us?</label>
                        <select 
                          className="fs" 
                          id="f-source"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                        >
                          <option value="" disabled>Pick one</option>
                          <option value="Instagram">Instagram</option>
                          <option value="A friend referred me">A friend referred me</option>
                          <option value="The BBG Podcast">The BBG Podcast</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Twitter / X">Twitter / X</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Google search">Google search</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="deep-q">
                        <p className="dq-tag">
                          <svg viewBox="0 0 12 12" fill="none"><path d="M6 1l1.2 3.6H11L8 6.8l1.2 3.7L6 8.3l-3.2 2.2L4 6.8 1 4.6h3.8z" stroke="var(--purple-2)" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                          The question that matters most
                        </p>
                        <p className="dq-q">What would you do if you <em>knew</em> you wouldn't fail?</p>
                        <div className="char-rel">
                          <textarea 
                            className="ft" 
                            id="f-dream" 
                            placeholder="Don't edit yourself. Just write." 
                            maxLength={300}
                            value={dream}
                            onChange={(e) => setDream(e.target.value)}
                          ></textarea>
                          <span className="char-cnt"><span id="dream-cnt">{dream.length}</span>/300</span>
                        </div>
                      </div>

                      <div className="agree-row" style={errors.agree ? { outline: '2px solid rgba(255,68,68,.45)' } : {}}>
                        <input 
                          type="checkbox" 
                          id="agree"
                          checked={agree}
                          onChange={(e) => handleInputChange('agree', e.target.checked, setAgree)}
                        />
                        <label htmlFor="agree">BBG is not-for-profit. My data is private, never sold. <strong>I'm ready to join.</strong></label>
                      </div>
                    </div>

                    <div className="form-foot">
                      <button type="submit" className="submit-btn" id="submitBtn" disabled={isSubmitting}>
                        <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l2.2 6.6H19l-5.5 4 2 6.4-5.5-4-5.5 4 2-6.4L1 8.6h6.8z" fill="currentColor"/></svg>
                        <span>{isSubmitting ? 'Sending…' : 'Join the Community'}</span>
                      </button>
                      <p className="form-note">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M7 1a6 6 0 100 12A6 6 0 007 1z" stroke="var(--purple-2)" strokeWidth="1.2"/><path d="M7 6.5v3M7 4.5v.5" stroke="var(--purple-2)" stroke-width="1.4" stroke-linecap="round"/></svg>
                        Free to join &nbsp;·&nbsp; Private &nbsp;·&nbsp; Reviewed by a real human
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="voices-sec">
        <div className="voices-inner">
          <div className="voices-hd reveal">
            <p className="voices-kicker">From inside the community</p>
            <h2 className="voices-h">
              <span className="wh">Women who</span><br/>
              <span className="ol">found their</span><br/>
              <span className="wh">people.</span>
            </h2>
          </div>
          <div className="voices-grid reveal" style={{ transitionDelay: '.1s' }}>
            <div className="vc">
              <div className="vc-q-mark">"</div>
              <p className="vc-quote">I never thought someone would take my ambitions seriously. BBG did on day one.</p>
              <div className="vc-foot">
                <div className="vc-av">S</div>
                <div><div className="vc-name">Shreya M.</div><div className="vc-meta">19 · Engineering Student · Mumbai</div></div>
              </div>
            </div>
            <div className="vc">
              <div className="vc-q-mark">"</div>
              <p className="vc-quote">My mentor saw a version of me I hadn't met yet. That changed everything.</p>
              <div className="vc-foot">
                <div className="vc-av">P</div>
                <div><div className="vc-name">Priya A.</div><div className="vc-meta">23 · Aspiring Lawyer · Delhi</div></div>
              </div>
            </div>
            <div className="vc">
              <div className="vc-q-mark">"</div>
              <p className="vc-quote">I was the girl with a plan and no one to run it by. Not anymore.</p>
              <div className="vc-foot">
                <div className="vc-av">Z</div>
                <div><div className="vc-name">Zara K.</div><div className="vc-meta">21 · Entrepreneur · Lagos</div></div>
              </div>
            </div>
          </div>
          <div className="voices-hint reveal" style={{ transitionDelay: '.2s' }}>
            <span className="a"></span><span></span><span></span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-sec">
        <div className="faq-inner">
          <p className="faq-kicker">Got questions?</p>
          <h2 className="faq-h">We've got answers.</h2>
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}>
              <button className="faq-btn" onClick={() => toggleFaq(index)}>
                {faq.q}
                <div className="faq-arrow">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              <div className="faq-body" style={openFaqIndex === index ? { maxHeight: '220px' } : {}}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INNER FOOTER */}
      <footer className="footer">
        <div>
          <h2 className="footer-h">
            <span className="wh">Still here?</span><br/>
            <span className="pk">You're</span> <span className="ol">ready.</span>
          </h2>
          <p className="footer-sub">Scroll back up. Fill the form. Join the circle.</p>
          <a className="footer-email" href="mailto:sanah@bnbgirl.com">
            <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="1.8" stroke="currentColor" strokeWidth="1.3"/><path d="M2 5.5l7 5 7-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            sanah@bnbgirl.com
          </a>
          <p className="footer-copy">© 2026 Bold &amp; Brilliant Girls &nbsp; Not-for-profit &nbsp; All proceeds to charity</p>
        </div>
      </footer>
    </div>
  );
}
