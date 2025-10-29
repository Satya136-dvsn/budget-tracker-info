import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProfessionalSidebar from './ProfessionalSidebar';
import MobileNavigation from './MobileNavigation';
import './AppLayoutWrapper.css';

const AppLayoutWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on pages that shouldn't show sidebar
  const isHomePage = location.pathname === '/';
  const isAuthPage = ['/signin', '/signup', '/forgot-password'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isHomePage && !isAuthPage;

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(false); // Reset collapsed state on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={`app-layout ${
      showSidebar ? 
        (sidebarCollapsed ? 'sidebar-collapsed' : '') : 
        'no-sidebar'
    }`}>
      {showSidebar && (
        <>
          {/* Mobile Menu Button - Always visible on mobile */}
          {isMobile && (
            <button 
              className="mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}

          {/* Desktop Toggle Button - Show when sidebar is collapsed */}
          {!isMobile && sidebarCollapsed && (
            <button 
              className="desktop-toggle-btn"
              onClick={toggleSidebar}
              aria-label="Expand navigation menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Sidebar Container */}
          <div className={`sidebar-container ${
            isMobile ? (mobileMenuOpen ? 'mobile-open' : 'mobile-hidden') : ''
          }`}>
            <ProfessionalSidebar 
              collapsed={!isMobile && sidebarCollapsed} 
              onToggle={toggleSidebar}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <MobileNavigation 
              isOpen={mobileMenuOpen}
              onClose={closeMobileMenu}
            />
          )}

          {/* Mobile Overlay */}
          {isMobile && mobileMenuOpen && (
            <div 
              className="mobile-overlay" 
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
          )}
        </>
      )}

      {/* Main Content */}
      <main className={showSidebar ? 'main-content' : 'main-content-full'}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayoutWrapper;