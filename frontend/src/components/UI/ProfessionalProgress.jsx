import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalProgress = ({ 
  value = 0,
  max = 100,
  variant = 'default',
  showLabel = false,
  className = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const progressClasses = [
    'professional-progress',
    variant !== 'default' && variant,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="professional-progress-container">
      {showLabel && (
        <div className="professional-progress-label">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={progressClasses} {...props}>
        <div 
          className="professional-progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProfessionalProgress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'error']),
  showLabel: PropTypes.bool,
  className: PropTypes.string
};

export default ProfessionalProgress;