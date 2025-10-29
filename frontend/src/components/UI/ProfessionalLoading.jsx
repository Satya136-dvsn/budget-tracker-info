import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalLoading = ({ 
  size = 'default',
  text = 'Loading...',
  showText = true,
  className = '',
  ...props 
}) => {
  const loadingClasses = [
    'professional-loading',
    className
  ].filter(Boolean).join(' ');

  const spinnerSizes = {
    small: { width: '20px', height: '20px' },
    default: { width: '32px', height: '32px' },
    large: { width: '48px', height: '48px' }
  };

  return (
    <div className={loadingClasses} {...props}>
      <div 
        className="professional-spinner"
        style={spinnerSizes[size]}
      />
      {showText && text && (
        <span className="professional-loading-text">{text}</span>
      )}
    </div>
  );
};

ProfessionalLoading.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  text: PropTypes.string,
  showText: PropTypes.bool,
  className: PropTypes.string
};

export default ProfessionalLoading;