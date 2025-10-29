import React from 'react';
import './GlassTable.css';

const GlassTable = ({ 
  children, 
  variant = 'primary',
  hover = true,
  striped = false,
  className = '',
  ...props 
}) => {
  const tableClasses = [
    'glass-table',
    `glass-table-${variant}`,
    hover && 'glass-table-hover',
    striped && 'glass-table-striped',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="glass-table-container">
      <table 
        className={tableClasses}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export default GlassTable;