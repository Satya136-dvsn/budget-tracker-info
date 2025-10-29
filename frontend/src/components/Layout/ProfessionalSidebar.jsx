import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRoles } from '../../utils/RoleBasedAccess';
import NotificationBadge from '../Common/NotificationBadge';
import './ProfessionalSidebar.css';

const ProfessionalSidebar = ({ collapsed, onToggle, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { isAdmin } = useRoles();

  // Hide sidebar on home page
  if (location.pathname === '/') {
    return null;
  }

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠', description: 'Overview & Stats' },
    { path: '/transactions', label: 'Transactions', icon: '💳', description: 'Manage Money' },
    { path: '/analytics', label: 'Analytics', icon: '📊', description: 'Data Insights' },
    { path: '/financial-health', label: 'Health Score', icon: '❤️', description: 'Financial Health' },
    { path: '/budgets', label: 'Budgets', icon: '🎯', description: 'Budget Planning' },
    { path: '/planning', label: 'Planning', icon: '📈', description: 'Future Goals' },
    { path: '/bills', label: 'Bills', icon: '📋', description: 'Bill Management' },
    { path: '/ai', label: 'AI Insights', icon: '🤖', description: 'Smart Analysis' },
    { path: '/investments', label: 'Investments', icon: '📈', description: 'Portfolio' },
    { path: '/currencies', label: 'Currencies', icon: '💱', description: 'Exchange Rates' },
    { path: '/banking', label: 'Banking', icon: '🏦', description: 'Bank Integration' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', description: 'Alerts', badge: true },
    { path: '/profile', label: 'Profile', icon: '👤', description: 'User Settings' },
    { path: '/settings', label: 'Settings', icon: '⚙️', description: 'Preferences' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: '👑', description: 'Admin Panel' }] : [])
  ];

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

  if (!isAuthenticated) {
    return (
      <div className={`professional-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="professional-sidebar-content">
          {/* Brand */}
          <div className="professional-brand" onClick={handleNavBrandClick}>
            <span className="professional-brand-icon">💰</span>
            {!collapsed && <span className="professional-brand-text">BudgetWise</span>}
          </div>

          {/* Auth Actions */}
          <div className="professional-auth-actions">
            <button 
              className="professional-btn primary"
              onClick={() => navigate('/signin')}
              disabled={location.pathname === '/signin'}
            >
              {collapsed ? '🔑' : '🔑 Sign In'}
            </button>
            <button 
              className="professional-btn secondary"
              onClick={() => navigate('/signup')}
              disabled={location.pathname === '/signup'}
            >
              {collapsed ? '✨' : '✨ Get Started'}
            </button>
          </div>

          {/* Toggle Button */}
          <button className="professional-toggle" onClick={onToggle}>
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`professional-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="professional-sidebar-content">
        {/* Brand */}
        <div className="professional-brand" onClick={handleNavBrandClick}>
          <span className="professional-brand-icon">💰</span>
          {!collapsed && <span className="professional-brand-text">BudgetWise</span>}
        </div>

        {/* Navigation */}
        <nav className="professional-nav">
          {navigationItems.map((item) => (
            <ProfessionalNavItem 
              key={item.path}
              {...item}
              collapsed={collapsed}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="professional-sidebar-footer">
          <button 
            className="professional-btn logout"
            onClick={handleLogout}
          >
            {collapsed ? '🚪' : '🚪 Logout'}
          </button>
        </div>

        {/* Toggle Button */}
        <button className="professional-toggle" onClick={onToggle}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </div>
  );
};

const ProfessionalNavItem = ({ path, label, icon, description, badge, collapsed, isActive, onClick }) => {
  return (
    <div 
      className={`professional-nav-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="professional-nav-icon">
        {icon}
        {badge && <NotificationBadge />}
      </span>
      {!collapsed && (
        <div className="professional-nav-content">
          <span className="professional-nav-text">{label}</span>
          <span className="professional-nav-description">{description}</span>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSidebar;