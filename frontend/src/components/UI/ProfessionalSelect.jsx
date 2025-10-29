import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ProfessionalSelect = forwardRef(({ 
  options = [],
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  placeholder = 'Select an option...',
  className = '',
  id,
  name,
  required = false,
  ...props 
}, ref) => {
  return (
    <div className={`professional-select ${className}`}>
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

ProfessionalSelect.displayName = 'ProfessionalSelect';

ProfessionalSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool
};

export default ProfessionalSelect;