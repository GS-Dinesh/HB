import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalAddHabitProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string, difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const ModalAddHabit: React.FC<ModalAddHabitProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim(), difficulty);
    setName('');
    setDescription('');
    setDifficulty('easy');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>
            Create Habit Tracker
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Habit Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Wake up at 5:00 AM" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
              maxLength={40}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Brief Description</label>
            <textarea 
              className="form-input" 
              placeholder="e.g. Drink 250ml water immediately upon rising." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
              style={{ minHeight: '60px', resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label>Difficulty Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.2rem' }}>
              <button 
                type="button" 
                onClick={() => setDifficulty('easy')}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: difficulty === 'easy' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  backgroundColor: difficulty === 'easy' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0,0,0,0.2)',
                  color: difficulty === 'easy' ? '#10b981' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Easy (+10 XP)
              </button>
              <button 
                type="button" 
                onClick={() => setDifficulty('medium')}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: difficulty === 'medium' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                  backgroundColor: difficulty === 'medium' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0,0,0,0.2)',
                  color: difficulty === 'medium' ? '#f59e0b' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Medium (+20 XP)
              </button>
              <button 
                type="button" 
                onClick={() => setDifficulty('hard')}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: difficulty === 'hard' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  backgroundColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0,0,0,0.2)',
                  color: difficulty === 'hard' ? '#ef4444' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Hard (+30 XP)
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ fontSize: '0.75rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
