import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalForm = ({ 
  children, 
  onSubmit,
  className = '',
  ...props 
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <form 
      className={`professional-form ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
};

const ProfessionalFormGroup = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`professional-form-group ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const ProfessionalFormLabel = ({ 
  children, 
  htmlFor,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <label 
      className={`professional-form-label ${className}`}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {required && <span className="text-error"> *</span>}
    </label>
  );
};

const ProfessionalFormError = ({ 
  children, 
  className = '',
  ...props 
}) => {
  if (!children) return null;

  return (
    <div 
      className={`professional-form-error ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

const ProfessionalFormSuccess = ({ 
  children, 
  className = '',
  ...props 
}) => {
  if (!children) return null;

  return (
    <div 
      className={`professional-form-success ${className}`}
      role="status"
      {...props}
    >
      {children}
    </div>
  );
};

ProfessionalForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  className: PropTypes.string
};

ProfessionalFormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

ProfessionalFormLabel.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string
};

ProfessionalFormError.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

ProfessionalFormSuccess.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

// Export all form components
export default ProfessionalForm;
export { 
  ProfessionalFormGroup, 
  ProfessionalFormLabel, 
  ProfessionalFormError, 
  ProfessionalFormSuccess 
};