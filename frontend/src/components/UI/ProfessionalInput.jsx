import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ProfessionalInput = forwardRef(({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error = false,
  success = false,
  className = '',
  id,
  name,
  required = false,
  ...props 
}, ref) => {
  const inputClasses = [
    'professional-input',
    error && 'error',
    success && 'success',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      ref={ref}
      type={type}
      id={id}
      name={name}
      className={inputClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      required={required}
      {...props}
    />
  );
});

ProfessionalInput.displayName = 'ProfessionalInput';

ProfessionalInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool
};

export default ProfessionalInput;