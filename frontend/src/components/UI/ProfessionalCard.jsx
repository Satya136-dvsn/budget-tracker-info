import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalCard = ({ 
  children, 
  variant = 'default', 
  className = '', 
  onClick,
  hover = true,
  ...props 
}) => {
  const cardClasses = [
    'professional-card',
    variant !== 'default' && variant,
    hover && 'hover-enabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

ProfessionalCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'glass']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  hover: PropTypes.bool
};

export default ProfessionalCard;