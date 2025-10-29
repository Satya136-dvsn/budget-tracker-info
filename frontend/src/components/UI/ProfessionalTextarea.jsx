import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ProfessionalTextarea = forwardRef(({ 
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  rows = 4,
  className = '',
  id,
  name,
  required = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      className={`professional-textarea ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      rows={rows}
      required={required}
      {...props}
    />
  );
});

ProfessionalTextarea.displayName = 'ProfessionalTextarea';

ProfessionalTextarea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool
};

export default ProfessionalTextarea;