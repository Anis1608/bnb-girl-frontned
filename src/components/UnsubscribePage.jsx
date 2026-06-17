import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function UnsubscribePage({ onShowToast }) {
  const { API_BASE } = useApp();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract email from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        if (onShowToast) {
          onShowToast('✉️', 'Unsubscribed', 'You have been unsubscribed successfully.');
        }
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to connect to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="unsubscribe-page-container">
      <style>{`
        .unsubscribe-page-container {
          --black: #07070A;
          --black-2: #0F0F14;
          --pink: #FF1F7D;
          --purple: #7B2FBE;
          --purple-2: #A259FF;
          --white: #FFFFFF;
          --w75: rgba(255, 255, 255, .75);
          --w50: rgba(255, 255, 255, .50);
          --w12: rgba(255, 255, 255, .12);
          
          background: var(--black);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        .unsubscribe-bg-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 31, 125, .15) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }

        .unsubscribe-card {
          width: 100%;
          max-width: 480px;
          background: var(--black-2);
          border: 1px solid var(--w12);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .unsubscribe-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--pink), var(--purple-2), var(--pink));
          background-size: 200%;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
        }

        .unsub-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          display: inline-block;
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .unsub-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.8rem;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .unsub-desc {
          color: var(--w75);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .unsub-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .unsub-input-group {
          text-align: left;
        }

        .unsub-label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--w50);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .unsub-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--w12);
          border-radius: 12px;
          padding: 14px 16px;
          color: var(--white);
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
        }

        .unsub-input:focus {
          border-color: var(--pink);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 10px rgba(255, 31, 125, 0.2);
        }

        .unsub-btn {
          width: 100%;
          background: var(--pink);
          color: var(--black);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(.34, 1.56, .64, 1);
          cursor: pointer;
        }

        .unsub-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 31, 125, 0.4);
        }

        .unsub-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .unsub-error {
          color: #EF4444;
          font-size: 0.85rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 10px;
          border-radius: 8px;
          margin-top: 5px;
        }

        .unsub-success-card {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .unsub-back-link {
          margin-top: 20px;
          display: inline-block;
          color: var(--w50);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s;
        }

        .unsub-back-link:hover {
          color: var(--white);
        }
      `}</style>

      <div className="unsubscribe-bg-glow" />

      <div className="unsubscribe-card">
        {!isSuccess ? (
          <>
            <span className="unsub-icon">✉️</span>
            <h1 className="unsub-title">Unsubscribe</h1>
            <p className="unsub-desc">
              We are sorry to see you go. Confirm your email address below to opt out of the newsletter and updates.
            </p>

            <form onSubmit={handleUnsubscribe} className="unsub-form">
              <div className="unsub-input-group">
                <label className="unsub-label">Email Address</label>
                <input
                  type="email"
                  className="unsub-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {errorMessage && <div className="unsub-error">{errorMessage}</div>}

              <button type="submit" className="unsub-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Confirm Unsubscribe'}
              </button>
            </form>
          </>
        ) : (
          <div className="unsub-success-card">
            <span className="unsub-icon">✨</span>
            <h1 className="unsub-title">Unsubscribed</h1>
            <p className="unsub-desc" style={{ marginBottom: '20px' }}>
              You have been successfully unsubscribed from the newsletter lists for <strong>{email}</strong>.
            </p>
            <p className="unsub-desc">
              Please allow up to 24 hours for the updates to apply fully across our systems.
            </p>
            <a href="/" className="unsub-back-link">← Return to Homepage</a>
          </div>
        )}
      </div>
    </div>
  );
}
