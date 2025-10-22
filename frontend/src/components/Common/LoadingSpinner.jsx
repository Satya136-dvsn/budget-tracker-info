import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#10b981', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const spinnerClass = `loading-spinner ${sizeClasses[size]}`;

  const spinner = (
    <div className="spinner-container">
      <div 
        className={spinnerClass}
        style={{ borderTopColor: color }}
      ></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;