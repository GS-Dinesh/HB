import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ModalConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '380px',
          border: '1px solid var(--primary-red)',
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
          background: 'radial-gradient(circle at center, #1b0a0a 0%, #111114 100%)',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            padding: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <AlertTriangle size={28} style={{ color: 'var(--primary-red)' }} />
          </div>
        </div>

        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#fff',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </h3>
        
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4',
          marginBottom: '1.75rem'
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onCancel}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={onConfirm}
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'var(--primary-red)',
              borderColor: 'var(--primary-red)',
              fontSize: '0.75rem'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
