import React, { useState, useRef } from 'react';
import { Camera, Trophy, User } from 'lucide-react';
import { resizeAvatar } from '../utils/cookies';

interface ModalOnboardingProps {
  isOpen: boolean;
  onComplete: (name: string, avatar: string) => void;
}

export const ModalOnboarding: React.FC<ModalOnboardingProps> = ({
  isOpen,
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Image must be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeAvatar(reader.result as string);
        setAvatar(resized);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete(name.trim(), avatar);
  };

  return (
    <div className="modal-overlay" style={{ backgroundColor: 'rgba(9, 9, 11, 0.95)' }}>
      <div 
        className="modal-content animate-fade-in" 
        style={{ 
          maxWidth: '420px', 
          textAlign: 'center', 
          border: '1px solid var(--primary-red)',
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
          background: 'radial-gradient(circle at center, #1b0a0a 0%, #111114 100%)',
          padding: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Trophy size={36} style={{ color: 'var(--primary-red)', filter: 'drop-shadow(0 0 8px var(--primary-red))' }} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', marginBottom: '0.25rem' }}>
          Welcome to Habit Game
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Configure your gaming profile to start tracking your daily habits.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          
          {/* Avatar Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Upload Profile Photo
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px dashed var(--primary-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                backgroundColor: 'rgba(239, 68, 68, 0.03)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f87171'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--primary-red)'}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', gap: '0.2rem' }}>
                  <User size={24} />
                  <Camera size={14} />
                </div>
              )}
              {avatar && (
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0, bottom: 0, left: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}
                className="avatar-hover-overlay"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <Camera size={18} />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dark)' }}>PNG or JPG (Max 1MB)</span>
          </div>

          {/* Username */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Player Nickname</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your username" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
              maxLength={20}
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            Enter Habit Lands
          </button>

        </form>
      </div>
    </div>
  );
};
