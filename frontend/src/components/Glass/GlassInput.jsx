import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './GlassInput.css';

const GlassInput = forwardRef(({ 
  type = 'text',
  placeholder = '',
  label = '',
  error = '',
  success = false,
  disabled = false,
  required = false,
  icon = null,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  onChange,
  onFocus,
  onBlur,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || '');

  const inputClasses = [
    'glass-input',
    `glass-input--${variant}`,
    `glass-input--${size}`,
    error && 'glass-input--error',
    success && 'glass-input--success',
    disabled && 'glass-input--disabled',
    focused && 'glass-input--focused',
    hasValue && 'glass-input--has-value',
    fullWidth && 'glass-input--full-width',
    icon && `glass-input--with-icon-${iconPosition}`,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'glass-input-container',
    fullWidth && 'glass-input-container--full-width'
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className="glass-input-label">
          {label}
          {required && <span className="glass-input-required">*</span>}
        </label>
      )}
      
      <div className="glass-input-wrapper">
        {icon && iconPosition === 'left' && (
          <div className="glass-input-icon glass-input-icon--left">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="glass-input-icon glass-input-icon--right">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <div className="glass-input-error">
          {error}
        </div>
      )}
      
      {success && !error && (
        <div className="glass-input-success">
          Input is valid
        </div>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

GlassInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default GlassInput;