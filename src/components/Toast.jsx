import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast && toast.visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`badge-toast ${toast.visible ? 'show' : ''}`} id="badgeToast">
      <span className="badge-toast__icon" id="badgeToastIcon">
        {toast.icon || '🏅'}
      </span>
      <div>
        <div className="badge-toast__text" id="badgeToastText">
          {toast.text}
        </div>
        <div className="badge-toast__sub" id="badgeToastSub">
          {toast.sub}
        </div>
      </div>
    </div>
  );
}
