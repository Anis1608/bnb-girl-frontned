import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CATEGORY_TAXONOMY = [
  {
    name: "Business",
    subcategories: ["Entrepreneurship", "Startups", "Small Business", "Leadership", "Operations", "Marketing", "Sales", "E-commerce", "Branding", "Freelancing", "Consulting", "Management"]
  },
  {
    name: "Technology",
    subcategories: ["Software Engineering", "AI & Machine Learning", "Data Science", "Cybersecurity", "UX/UI Design", "Product Management", "Cloud Computing", "Web Development", "Mobile Development", "Blockchain", "Gaming", "Tech Startups"]
  },
  {
    name: "Healthcare",
    subcategories: ["Nursing", "Medicine", "Mental Health", "Public Health", "Physical Therapy", "Nutrition", "Fitness", "Healthcare Administration", "Alternative Medicine", "Women’s Health"]
  },
  {
    name: "Finance",
    subcategories: ["Personal Finance", "Investment Banking", "Accounting & Operation", "Wealth Management & Financial Planning", "Structuring, financing,Portfolio Management", "Real Estate Finance", "Cryptocurrency", "FinTech", "Venture Capital", "Relationship Management", "Corporate Finance"]
  },
  {
    name: "Law",
    subcategories: ["Corporate Law", "Criminal Law", "Family Law", "Immigration Law", "Intellectual Property", "Human Rights", "Legal Tech", "Compliance", "Government Policy"]
  },
  {
    name: "Social Impact & Community",
    subcategories: ["Nonprofits", "Social Work", "Education", "Advocacy", "Community Leadership", "DEI", "Humanitarian Work", "Youth Development", "Public Service"]
  },
  {
    name: "Creative & Media",
    subcategories: ["Content Creation", "Podcasting", "Film & TV", "Photography", "Music", "Writing", "Graphic Design", "Fashion", "Influencer Careers", "Digital Media"]
  },
  {
    name: "Education & Academia",
    subcategories: ["Teaching", "Research", "Higher Education", "Academic Leadership", "Online Learning", "EdTech"]
  },
  {
    name: "Government & Public Sector",
    subcategories: ["Public Administration", "Politics", "International Relations", "Urban Planning", "Public Policy", "Military", "Law Enforcement"]
  },
  {
    name: "Lifestyle Careers",
    subcategories: ["Remote Work", "Digital Nomad", "Work-Life Balance", "Productivity", "Career Change", "Motherhood & Career", "Gen Z Careers"]
  }
];

export default function BecomeMentor({ onShowToast }) {
  const { API_BASE } = useApp();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [bio, setBio] = useState('');
  const [motivation, setMotivation] = useState('');
  const [age, setAge] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [category1, setCategory1] = useState('');
  const [subcategory1, setSubcategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const [subcategory2, setSubcategory2] = useState('');
  const [writeIn3, setWriteIn3] = useState('');
  const [writeIn4, setWriteIn4] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form pages: 0 = Info, 1 = Experience & Expertise, 2 = About & Motivation
  const [step, setStep] = useState(0);

  const expertiseOptions = [
    'Software Engineering',
    'Product Management',
    'UX/UI Design',
    'Data Science & AI',
    'Entrepreneurship',
    'Marketing & Growth',
    'Public Speaking',
    'Leadership & Strategy',
    'Finance & Venture Capital'
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) {
          onShowToast('⚠️', 'Invalid File Type', 'Only image files (JPG, PNG, WEBP, etc.) are allowed.');
        } else {
          alert('Only image files are allowed.');
        }
        e.target.value = ''; // Reset input
        return;
      }
      
      // Compress image client-side to prevent 413 Request Entity Too Large errors
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              setPhotoFile(compressedFile);
              
              const previewReader = new FileReader();
              previewReader.onloadend = () => {
                setPhotoPreview(previewReader.result);
              };
              previewReader.readAsDataURL(compressedFile);
            }
          }, 'image/jpeg', 0.75);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 0 && (!name.trim() || !email.trim())) {
      onShowToast('⚠️', 'Missing Info', 'Please provide your name and email address.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onShowToast('⚠️', 'Missing Info', 'Please provide your name and email.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('role', role);
      formData.append('organisation', organisation);
      formData.append('linkedin', linkedin);
      formData.append('years_exp', yearsExp);
      formData.append('bio', bio);
      formData.append('motivation', motivation);
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York');
      
      if (age) {
        formData.append('age', age);
      }
      if (age && parseInt(age, 10) < 18 && guardianEmail) {
        formData.append('guardian_email', guardianEmail);
      }

      // Consolidate expertise options
      const selectedExpertise = [];
      if (category1) selectedExpertise.push(`${category1} (${subcategory1})`);
      if (category2 && subcategory2) selectedExpertise.push(`${category2} (${subcategory2})`);
      if (writeIn3.trim()) selectedExpertise.push(writeIn3.trim());
      if (writeIn4.trim()) selectedExpertise.push(writeIn4.trim());
      
      formData.append('expertise', selectedExpertise.join(', '));

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch(`${API_BASE}/api/mentor-application`, {
        method: 'POST',
        body: formData
        // Note: Content-Type is omitted so browser sets it automatically with the correct boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong while submitting.');
      }

      setSubmitted(true);
      onShowToast('🎉', 'Success!', 'Your application has been received.');
    } catch (err) {
      console.error('Submission error:', err);
      onShowToast('❌', 'Error', err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="become-mentor-wrap">
      <style>{`
        .become-mentor-wrap {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, #170d2e 0%, #0c061a 90%);
          color: #fff;
          padding: 120px 24px 80px;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .become-mentor-card {
          background: rgba(30, 20, 55, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        @media (max-width: 600px) {
          .become-mentor-wrap {
            padding: 90px 10px 60px !important;
          }
          .become-mentor-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
      {/* Background Decorative Gradients */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-100px',
        right: '-100px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-100px',
        left: '-100px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '720px', width: '100%', zIndex: 1, position: 'relative' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(236,72,153,0.1)',
            border: '1px solid rgba(236,72,153,0.2)',
            color: '#EC4899',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '16px'
          }}>
            Mentorship Network
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Become a <em style={{ fontStyle: 'italic', color: '#FEF08A' }}>Mentor.</em>
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 20px'
          }}>
            One conversation can change a career — and your time can change lives beyond it.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            textAlign: 'left',
            fontSize: '0.88rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <p style={{ margin: '0 0 16px 0' }}>
              We are a nonprofit platform empowering girls through mentorship, career guidance, and opportunity. Any proceeds from mentees are donated to charities supporting women and girls, including charities of your choice.
            </p>
            <p style={{ margin: '0 0 16px 0', fontWeight: '600', color: '#FEF08A' }}>
              Your guidance/time creates impact twice — by shaping a future and supporting meaningful change.
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />
            <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '0.92rem', fontWeight: 600 }}>Do we collect fees?</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              In some cases, mentees may contribute a small fee for mentorship sessions or platform access. As a nonprofit initiative, any proceeds collected are donated to charities and initiatives supporting women and girls, including charities selected by mentors whenever possible.
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        {!submitted && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              left: '5%',
              right: '5%',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              height: '2px',
              background: 'linear-gradient(90deg, #9333EA, #EC4899)',
              left: '5%',
              width: step === 0 ? '0%' : step === 1 ? '45%' : '90%',
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'width 0.4s ease',
              zIndex: 0
            }} />

            {[
              { label: 'Profile Info', num: 0 },
              { label: 'Expertise', num: 1 },
              { label: 'About & Bio', num: 2 }
            ].map((s) => (
              <div key={s.num} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step > s.num
                    ? 'linear-gradient(135deg, #9333EA, #EC4899)'
                    : step === s.num
                      ? '#6B21A8'
                      : '#1F1936',
                  border: step === s.num
                    ? '2px solid #EC4899'
                    : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: s.num <= step ? 'pointer' : 'default'
                }} onClick={() => s.num <= step && setStep(s.num)}>
                  {step > s.num ? '✓' : s.num + 1}
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  marginTop: '8px',
                  fontWeight: 600,
                  color: step >= s.num ? '#fff' : 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.05em'
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main Form Area */}
        <div className="become-mentor-card">
          {submitted ? (
            /* Success View */
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '2.5rem'
              }}>
                💜
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '16px'
              }}>
                Application Submitted!
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                maxWidth: '480px',
                margin: '0 auto 32px'
              }}>
                Thank you for applying, {name}! We have received your application and will review your details. A confirmation email has been sent to <strong>{email}</strong>.
              </p>
              <button onClick={() => navigate('/mentorship')} style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6B21A8, #9333EA)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
              }}>
                Browse Mentors
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: PERSONAL & PROFESSIONAL INFO */}
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    
                    {/* Name input */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        Full Name <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        style={inputStyle}
                      />
                    </div>

                    {/* Email input */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        Email Address <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        maxLength={100}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    
                    {/* Role/Job Title input */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        Current Role / Job Title
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Software Architect"
                        style={inputStyle}
                      />
                    </div>

                    {/* Organisation input */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        Company / Organisation
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        placeholder="e.g. Google"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    
                    {/* LinkedIn Link input */}
                    <div style={{ flex: 2, minWidth: '280px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        maxLength={150}
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        style={inputStyle}
                      />
                    </div>

                    {/* Years of Experience input */}
                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={yearsExp}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                            setYearsExp(val);
                          }
                        }}
                        placeholder="e.g. 8"
                        style={inputStyle}
                      />
                    </div>

                    {/* Age input */}
                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                        Age *
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 25"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Parent consent guardian email if under 18 */}
                  {age !== '' && parseInt(age, 10) < 18 && (
                    <div style={{
                      background: 'rgba(236,72,153,0.06)',
                      border: '1px solid rgba(236,72,153,0.18)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                        Parent / Guardian Email *
                      </label>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        Since you are under 18, we require a parent or guardian's email for consent to register as a mentor.
                      </p>
                      <input
                        type="email"
                        required
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        placeholder="parent@email.com"
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {/* Photo Upload Section with Live Preview */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
                      Profile Photo
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1.5px dashed rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem', opacity: 0.35 }}>👤</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          accept="image/*"
                          id="mentor-photo-input"
                          onChange={handlePhotoChange}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="mentor-photo-input" style={{
                          display: 'inline-block',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}>
                          Choose Photo
                        </label>
                        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', margin: '6px 0 0' }}>
                          JPG, PNG, or WEBP. Max 5MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: AREAS OF EXPERTISE */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FEF08A', marginBottom: '8px' }}>
                      Professional Categories &amp; Subcategories
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '16px' }}>
                      Select up to two main categories and their respective subcategories to describe your expertise.
                    </p>
                  </div>

                  {/* Category 1 Row */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                        Primary Category *
                      </label>
                      <select
                        required
                        value={category1}
                        onChange={(e) => {
                          setCategory1(e.target.value);
                          setSubcategory1('');
                        }}
                        style={inputStyle}
                      >
                        <option value="">Select Primary Category</option>
                        {CATEGORY_TAXONOMY.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                        Primary Subcategory *
                      </label>
                      <select
                        required
                        disabled={!category1}
                        value={subcategory1}
                        onChange={(e) => setSubcategory1(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="">Select Subcategory</option>
                        {category1 && CATEGORY_TAXONOMY.find(c => c.name === category1)?.subcategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category 2 Row */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                        Secondary Category (Optional)
                      </label>
                      <select
                        value={category2}
                        onChange={(e) => {
                          setCategory2(e.target.value);
                          setSubcategory2('');
                        }}
                        style={inputStyle}
                      >
                        <option value="">Select Secondary Category</option>
                        {CATEGORY_TAXONOMY.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                        Secondary Subcategory (Optional)
                      </label>
                      <select
                        disabled={!category2}
                        value={subcategory2}
                        onChange={(e) => setSubcategory2(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="">Select Subcategory</option>
                        {category2 && CATEGORY_TAXONOMY.find(c => c.name === category2)?.subcategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />

                  {/* Write-in Categories 3 and 4 */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                        Custom Focus Area 3 (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={writeIn3}
                        onChange={(e) => setWriteIn3(e.target.value)}
                        placeholder="e.g. Prompt Engineering, Brand Strategy"
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                        Custom Focus Area 4 (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={writeIn4}
                        onChange={(e) => setWriteIn4(e.target.value)}
                        placeholder="e.g. Mobile Development, Remote Work"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: BIO & MOTIVATION */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Bio / About */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                      Short Bio <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      maxLength={1000}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a brief overview of your journey and professional focus. This will be displayed on your profile (150-200 words recommended)."
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    />
                  </div>

                  {/* Motivation */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                      Why do you want to mentor on Bold & Brilliant Girls? <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      maxLength={1000}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Tell us what drives you to support women in technology and leadership, and what you hope to achieve with your mentees."
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    />
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ← Back
                  </button>
                ) : (
                  <div /> /* Spacer */
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #6B21A8, #9333EA)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '12px 32px',
                      borderRadius: '10px',
                      background: submitting
                        ? 'rgba(255,255,255,0.1)'
                        : 'linear-gradient(135deg, #EC4899, #F97316)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: submitting ? 'none' : '0 4px 12px rgba(236, 72, 153, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application 🎉'}
                  </button>
                )}
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}

// Reuseable inline style for form inputs
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.25s ease'
};
