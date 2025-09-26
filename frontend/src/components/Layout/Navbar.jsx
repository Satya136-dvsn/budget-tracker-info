import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="navbar-outer">
      <nav className="navbar boxed-navbar">
        <div className="nav-brand" onClick={handleNavBrandClick} style={{ cursor: 'pointer' }}>
          <i className="fas fa-chart-bar"></i>
          <h1>Budget Tracker</h1>
        </div>
        <div className="nav-menu">
          {!isAuthenticated ? (
            <>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/signin')}
                disabled={location.pathname === '/signin'}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/signup')}
                disabled={location.pathname === '/signup'}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button 
                className={`btn ${location.pathname === '/dashboard' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => navigate('/dashboard')}
              >
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </button>
              <button 
                className={`btn ${location.pathname === '/transactions' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => navigate('/transactions')}
              >
                <i className="fas fa-exchange-alt"></i> Transactions
              </button>
              <button 
                className={`btn ${location.pathname === '/budget' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => navigate('/budget')}
              >
                <i className="fas fa-calculator"></i> Budget
              </button>
              <button 
                className={`btn ${location.pathname === '/profile' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => navigate('/profile')}
              >
                <i className="fas fa-user"></i> Profile
              </button>
              <button className="btn btn-outline" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;