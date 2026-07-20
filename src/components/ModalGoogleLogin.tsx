import React from 'react';
import { GlassLoginForm } from './GlassLoginForm';

interface ModalGoogleLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => void;
  onContinueAsGuest?: () => void;
}

export const ModalGoogleLogin: React.FC<ModalGoogleLoginProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
}) => {
  return (
    <GlassLoginForm
      isOpen={isOpen}
      onClose={onClose}
      onGoogleLogin={onGoogleLogin}
      onSuccessLogin={() => {
        onClose();
      }}
    />
  );
};
