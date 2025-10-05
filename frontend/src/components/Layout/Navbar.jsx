import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRoles } from '../../utils/RoleBasedAccess';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { isAdmin } = useRoles();

  const handleNavBrandClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={handleNavBrandClick}>
          <div className="brand-icon">
            <span className="brand-emoji">💰</span>
          </div>
          <span className="brand-text">Budget Tracker</span>
          <div className="brand-glow"></div>
        </div>
        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <button 
                className="modern-nav-btn nav-btn-signin" 
                onClick={() => navigate('/signin')}
                disabled={location.pathname === '/signin'}
              >
                <span className="btn-text">Sign In</span>
                <div className="btn-gradient"></div>
              </button>
              <button 
                className="modern-nav-btn nav-btn-signup" 
                onClick={() => navigate('/signup')}
                disabled={location.pathname === '/signup'}
              >
                <span className="btn-icon">✨</span>
                <span className="btn-text">Get Started</span>
                <div className="btn-shine"></div>
              </button>
            </>
          ) : (
            <>
              <button 
                className={`modern-nav-btn ${location.pathname === '/dashboard' ? 'nav-btn-active' : 'nav-btn-ghost'}`}
                onClick={() => navigate('/dashboard')}
              >
                <span className="btn-text">Home</span>
              </button>
              
              {/* Admin-only navigation */}
              {isAdmin() && (
                <button 
                  className={`modern-nav-btn ${location.pathname === '/admin' ? 'nav-btn-active' : 'nav-btn-ghost'}`}
                  onClick={() => navigate('/admin')}
                >
                  <span className="btn-icon">👑</span>
                  <span className="btn-text">Admin</span>
                </button>
              )}
              
              <button 
                className={`modern-nav-btn ${location.pathname === '/profile' ? 'nav-btn-active' : 'nav-btn-ghost'}`}
                onClick={() => navigate('/profile')}
              >
                <span className="btn-text">Profile</span>
              </button>
              <button className="modern-nav-btn nav-btn-logout" onClick={handleLogout}>
                <span className="btn-text">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;