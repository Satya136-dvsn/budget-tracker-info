import React from 'react';
import './GlassCard.css';

const GlassCard = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  hover = true,
  glow = false,
  animated = true,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'pro-card',
    `pro-card-${variant}`,
    `pro-card-${size}`,
    hover && 'hover-lift',
    glow && 'hover-glow',
    animated && 'transition-smooth',
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

export default GlassCard;