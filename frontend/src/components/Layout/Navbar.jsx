import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

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
    <nav className="clean-navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={handleNavBrandClick}>
          <FontAwesomeIcon icon={faChartLine} />
          <span>Budget Tracker</span>
        </div>
        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <button 
                className="nav-btn nav-btn-outline" 
                onClick={() => navigate('/signin')}
                disabled={location.pathname === '/signin'}
              >
                Sign In
              </button>
              <button 
                className="nav-btn nav-btn-primary" 
                onClick={() => navigate('/signup')}
                disabled={location.pathname === '/signup'}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-btn ${location.pathname === '/dashboard' ? 'nav-btn-active' : 'nav-btn-ghost'}`}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-btn ${location.pathname === '/profile' ? 'nav-btn-active' : 'nav-btn-ghost'}`}
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>
              <button className="nav-btn nav-btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;