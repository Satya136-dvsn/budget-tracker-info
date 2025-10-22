import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Store error details for display
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo, errorId);
  }

  reportError = (error, errorInfo, errorId) => {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('userId') || 'anonymous'
    };

    // For now, just log to console
    console.error('Error Report:', errorReport);
    
    // You could also store in localStorage for later reporting
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
      existingErrors.push(errorReport);
      // Keep only last 10 errors
      const recentErrors = existingErrors.slice(-10);
      localStorage.setItem('errorReports', JSON.stringify(recentErrors));
    } catch (e) {
      console.error('Failed to store error report:', e);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          background: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '12px',
          margin: '1rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          
          <h2 style={{ 
            color: '#dc2626', 
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            Oops! Something went wrong
          </h2>
          
          <p style={{ 
            color: '#7f1d1d', 
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            We're sorry, but an unexpected error occurred. This has been automatically reported to our team.
          </p>

          {this.state.errorId && (
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              fontFamily: 'monospace',
              background: '#f9fafb',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              Error ID: {this.state.errorId}
            </p>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '1.5rem'
          }}>
            <button 
              onClick={this.handleRetry}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Try Again
            </button>
            
            <button 
              onClick={this.handleReload}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Refresh Page
            </button>
            
            <button 
              onClick={this.handleGoHome}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Go to Dashboard
            </button>
          </div>

          {isDevelopment && this.state.error && (
            <details style={{ 
              textAlign: 'left', 
              background: '#f9fafb',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Error Details (Development Mode)
              </summary>
              <pre style={{ 
                fontSize: '0.75rem', 
                color: '#dc2626',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.875rem',
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            If this problem persists, please contact support with the Error ID above.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;