import React from 'react';

const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '',
  showBackButton = false,
  onBack,
  fullWidth = false 
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: 0,
      margin: 0
    }}>
      {/* Header Section */}
      {(title || subtitle || actions || showBackButton) && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.5rem 2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: fullWidth ? '100%' : '1400px',
            margin: '0 auto',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              {showBackButton && (
                <button 
                  onClick={onBack}
                  style={{
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '1.2rem',
                    color: '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e2e8f0';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ←
                </button>
              )}
              <div>
                {title && (
                  <h1 style={{ 
                    color: '#1e293b', 
                    fontSize: '1.875rem', 
                    fontWeight: '800', 
                    margin: '0 0 0.25rem 0',
                    lineHeight: '1.2'
                  }}>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '1rem', 
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {actions && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                flexWrap: 'wrap' 
              }}>
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div style={{
        padding: '2rem',
        maxWidth: fullWidth ? '100%' : '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className={`animate-fade-in ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;