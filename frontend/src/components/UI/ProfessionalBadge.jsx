import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalBadge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const badgeClasses = [
    'professional-badge',
    variant !== 'default' && variant,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

ProfessionalBadge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error']),
  className: PropTypes.string
};

export default ProfessionalBadge;