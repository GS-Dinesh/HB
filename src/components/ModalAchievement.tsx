import React, { useEffect } from 'react';
import { X, Award, Flame, CheckSquare, Zap, Coins, Trophy } from 'lucide-react';
import type { Achievement } from '../utils/achievements';
import { triggerConfetti } from '../utils/confetti';
import { audio } from '../utils/audio';

interface ModalAchievementProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
}

const renderIcon = (iconName: string, size = 48) => {
  switch (iconName) {
    case 'CheckSquare': return <CheckSquare size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'Award': return <Award size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Coins': return <Coins size={size} />;
    case 'Trophy': return <Trophy size={size} />;
    default: return <Award size={size} />;
  }
};

export const ModalAchievement: React.FC<ModalAchievementProps> = ({
  isOpen,
  onClose,
  achievement,
}) => {
  useEffect(() => {
    if (isOpen && achievement) {
      // Fire confetti and play fanfare sound effects
      triggerConfetti();
      audio.playAchievement();
    }
  }, [isOpen, achievement]);

  if (!isOpen || !achievement) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          textAlign: 'center',
          maxWidth: '380px',
          border: '1px solid var(--primary-red)',
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.35)',
          background: 'radial-gradient(circle at center, #271414 0%, #151518 100%)',
          padding: '2.5rem 1.75rem',
          position: 'relative'
        }}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={18} />
        </button>

        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--primary-red)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          display: 'block',
          marginBottom: '1rem',
          textShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
        }}>
          Achievement Unlocked!
        </span>

        {/* Large Glowing Icon */}
        <div style={{
          color: 'var(--primary-red)',
          filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.5))',
          display: 'flex',
          justifyContent: 'center',
          margin: '1.25rem 0'
        }}>
          {renderIcon(achievement.icon, 52)}
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
          {achievement.title}
        </h2>
        
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.45 }}>
          {achievement.description}
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '0.45rem 1.2rem',
          borderRadius: '20px',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.8rem'
        }}>
          <Coins size={14} style={{ color: 'var(--difficulty-medium)' }} />
          +{achievement.xpReward} Credits
        </div>

        <button 
          className="btn-primary" 
          onClick={onClose}
          style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
};
