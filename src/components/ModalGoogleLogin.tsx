import React, { useState } from 'react';
import { Mail, User, X } from 'lucide-react';

interface ModalGoogleLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name: string, avatar: string) => void;
}

export const ModalGoogleLogin: React.FC<ModalGoogleLoginProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      setError('Please enter a Gmail address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Require gmail domain for Gmail-id association
    if (!trimmedEmail.endsWith('@gmail.com')) {
      setError('Please use a standard Google account ending in @gmail.com.');
      return;
    }

    if (!trimmedName) {
      setError('Please enter a nickname/display name.');
      return;
    }

    // Create a deterministic color avatar based on email initials
    const initials = trimmedName.slice(0, 2).toUpperCase();
    const hash = trimmedEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    // Generate inline SVG data URI for profile picture
    const avatarSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="hsl(${hue}, 70%, 25%)"/><text x="50%" y="55%" font-family="'Outfit', sans-serif" font-weight="800" font-size="28" fill="%23fff" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;

    onLogin(trimmedEmail, trimmedName, avatarSvg);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '420px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        
        <div className="modal-header">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} style={{ color: 'var(--primary-red)' }} /> Connect Gmail Account
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Synchronize and lock your progress data under your Google/Gmail account credentials. 
            This enables multi-profile local storage switching.
          </span>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--primary-red)',
              borderRadius: '6px',
              padding: '0.65rem',
              fontSize: '0.7rem',
              color: 'var(--primary-red)',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={12} /> Gmail Address
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="username@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={12} /> Nickname / Display Name
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Dinesh" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>

          <button type="submit" className="btn-primary" style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem'
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign In with Google
          </button>

        </form>
      </div>
    </div>
  );
};
