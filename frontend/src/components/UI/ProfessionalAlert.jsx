import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalAlert = ({ 
  title,
  message,
  variant = 'info',
  icon,
  className = '',
  onClose,
  ...props 
}) => {
  const alertClasses = [
    'professional-alert',
    variant,
    className
  ].filter(Boolean).join(' ');

  const defaultIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  const alertIcon = icon || defaultIcons[variant];

  return (
    <div className={alertClasses} {...props}>
      {alertIcon && (
        <div className="professional-alert-icon">
          {alertIcon}
        </div>
      )}
      <div className="professional-alert-content">
        {title && (
          <h4 className="professional-alert-title">{title}</h4>
        )}
        {message && (
          <p className="professional-alert-message">{message}</p>
        )}
      </div>
      {onClose && (
        <button 
          className="professional-alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

ProfessionalAlert.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  icon: PropTypes.string,
  className: PropTypes.string,
  onClose: PropTypes.func
};

export default ProfessionalAlert;