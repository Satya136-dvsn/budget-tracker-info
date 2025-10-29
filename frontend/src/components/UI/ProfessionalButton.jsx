import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalButton = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  type = 'button',
  disabled = false,
  loading = false,
  className = '', 
  onClick,
  ...props 
}) => {
  const buttonClasses = [
    'professional-btn',
    variant !== 'default' && variant,
    size !== 'default' && size,
    loading && 'loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="professional-spinner" style={{ width: '16px', height: '16px' }} />
      )}
      {children}
    </button>
  );
};

ProfessionalButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['default', 'small', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default ProfessionalButton;