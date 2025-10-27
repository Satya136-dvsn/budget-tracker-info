import React from 'react';
import PropTypes from 'prop-types';
import './GlassButton.css';

const GlassButton = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,
  className = '',
  onClick,
  ...props 
}) => {
  const buttonClasses = [
    'glass-btn',
    `glass-btn--${variant}`,
    `glass-btn--${size}`,
    disabled && 'glass-btn--disabled',
    loading && 'glass-btn--loading',
    fullWidth && 'glass-btn--full-width',
    glow && 'glass-btn--glow',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button 
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <div className="glass-btn__spinner">
          <div className="glass-btn__spinner-circle"></div>
        </div>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="glass-btn__icon glass-btn__icon--left">
          {icon}
        </span>
      )}
      
      {!loading && (
        <span className="glass-btn__text">
          {children}
        </span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="glass-btn__icon glass-btn__icon--right">
          {icon}
        </span>
      )}
    </button>
  );
};

GlassButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'ghost']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  glow: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default GlassButton;