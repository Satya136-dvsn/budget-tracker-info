import React from 'react';
import ErrorBoundary from '../Common/ErrorBoundary';
import LoadingSpinner from '../Common/LoadingSpinner';
import './ChartWrapper.css';

const ChartWrapper = ({ 
  children, 
  title, 
  isLoading = false, 
  error = null, 
  className = '',
  height = '400px',
  showLegend = true,
  onRetry = null
}) => {
  if (error) {
    return (
      <div className={`chart-wrapper error ${className}`}>
        <div className="chart-header">
          {title && <h3 className="chart-title">{title}</h3>}
        </div>
        <div className="chart-error">
          <div className="error-icon">📊</div>
          <p className="error-message">Unable to load chart data</p>
          <p className="error-details">{error}</p>
          {onRetry && (
            <button 
              className="retry-button"
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`chart-wrapper loading ${className}`} style={{ height }}>
        <div className="chart-header">
          {title && <h3 className="chart-title">{title}</h3>}
        </div>
        <div className="chart-loading">
          <LoadingSpinner 
            size="large" 
            message="Loading chart data..." 
            color="#10b981"
          />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`chart-wrapper ${className}`} style={{ height }}>
        <div className="chart-header">
          {title && <h3 className="chart-title">{title}</h3>}
        </div>
        <div className="chart-content">
          {children}
        </div>
        {showLegend && (
          <div className="chart-legend-container">
            {/* Legend will be handled by individual chart components */}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ChartWrapper;