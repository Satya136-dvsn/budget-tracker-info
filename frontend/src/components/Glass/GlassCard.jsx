import React from 'react';
import './GlassCard.css';

const GlassCard = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  hover = true,
  glow = false,
  animated = false,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'glass-card',
    `glass-card--${variant}`,
    `glass-card--${size}`,
    hover && 'glass-card--hover',
    glow && 'glass-card--glow',
    animated && 'glass-card--animated',
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

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'error']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  hover: PropTypes.bool,
  glow: PropTypes.bool,
  animated: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default GlassCard;