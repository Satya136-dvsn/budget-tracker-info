import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import ProfessionalButton from './ProfessionalButton';

const ProfessionalModal = ({ 
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'default',
  className = '',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ...props 
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalClasses = [
    'professional-modal',
    size !== 'default' && `size-${size}`,
    className
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div className="professional-modal-backdrop" onClick={handleBackdropClick}>
      <div className={modalClasses} {...props}>
        {title && (
          <div className="professional-modal-header">
            <h2 className="professional-modal-title">{title}</h2>
            <button 
              className="professional-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="professional-modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="professional-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

ProfessionalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['default', 'small', 'large', 'full']),
  className: PropTypes.string,
  closeOnBackdropClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool
};

export default ProfessionalModal;