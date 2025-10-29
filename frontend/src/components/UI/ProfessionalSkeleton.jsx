import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalSkeleton = ({ 
  variant = 'text',
  width,
  height,
  className = '',
  ...props 
}) => {
  const skeletonClasses = [
    'professional-skeleton',
    variant,
    className
  ].filter(Boolean).join(' ');

  const style = {
    ...(width && { width }),
    ...(height && { height })
  };

  return (
    <div 
      className={skeletonClasses}
      style={style}
      {...props}
    />
  );
};

ProfessionalSkeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'title', 'avatar', 'button', 'card']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

export default ProfessionalSkeleton;