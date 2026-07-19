import React from 'react';
import { X, Cloud, ShieldAlert } from 'lucide-react';

interface ModalGoogleLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => void;
  onContinueAsGuest: () => void;
}

export const ModalGoogleLogin: React.FC<ModalGoogleLoginProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onContinueAsGuest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        
        <div className="modal-header">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cloud size={18} style={{ color: 'var(--primary-red)' }} /> Sync Progress
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Log in with your Google account to back up and sync your habits, checklist progress, streaks, and XP points. If you choose Guest Mode, progress is stored locally in your browser cookies.
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Google Sign In Button */}
            <button 
              onClick={() => {
                onGoogleLogin();
                onClose();
              }}
              className="btn-primary" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.8rem 1rem',
                fontSize: '0.8rem',
                background: 'linear-gradient(135deg, #4285F4, #357ae8)',
                boxShadow: '0 0 15px rgba(66, 133, 244, 0.3)'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity="0.85"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#fff" opacity="0.75"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#fff" opacity="0.9"/>
              </svg>
              Sign In with Google
            </button>

            {/* Guest Mode Button */}
            <button 
              onClick={() => {
                onContinueAsGuest();
                onClose();
              }}
              className="btn-secondary" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.8rem 1rem',
                fontSize: '0.8rem',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              Continue in Guest Mode
            </button>

          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: '8px',
            padding: '0.65rem',
            marginTop: '0.25rem'
          }}>
            <ShieldAlert size={16} style={{ color: 'var(--difficulty-medium)', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Guest Mode data is stored in browser cookies. Clearing cookies will delete your guest progress. Log in with Google to secure it.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
