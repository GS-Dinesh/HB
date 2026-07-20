import React from 'react';
import { GlassLoginForm } from './GlassLoginForm';

interface ModalGoogleLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin?: () => void;
  onContinueAsGuest?: () => void;
}

export const ModalGoogleLogin: React.FC<ModalGoogleLoginProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <GlassLoginForm
      isOpen={isOpen}
      onClose={onClose}
      onSuccessLogin={() => {
        onClose();
      }}
    />
  );
};
