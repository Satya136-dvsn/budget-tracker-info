import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRoles } from '../../utils/RoleBasedAccess';
import NotificationBadge from '../Common/NotificationBadge';
import { GlassCard, GlassButton, GlassNavigation } from '../Glass';
import './CleanSidebar.css';

const CleanSidebar = ({ collapsed, onToggle, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { isAdmin } = useRoles();

  // Hide sidebar on home page
  if (location.pathname === '/') {
    return null;
  }

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
      <>
        <div className={`sidebar-container ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <div className="sidebar-content">
            {/* Brand */}
            <div 
              onClick={handleNavBrandClick}
              className="sidebar-brand"
            >
              <span className="sidebar-brand-icon">💰</span>
              {!collapsed && <span className="sidebar-brand-text">BudgetWise</span>}
            </div>

            {/* Auth buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              <GlassButton 
                onClick={() => navigate('/signin')}
                disabled={location.pathname === '/signin'}
                variant="secondary"
                fullWidth={true}
                icon={collapsed ? '🔑' : null}
              >
                {collapsed ? '' : 'Sign In'}
              </GlassButton>
              <GlassButton 
                onClick={() => navigate('/signup')}
                disabled={location.pathname === '/signup'}
                variant="primary"
                fullWidth={true}
                icon={collapsed ? '✨' : '✨'}
              >
                {collapsed ? '' : 'Get Started'}
              </GlassButton>
            </div>
            
            {/* Toggle Button - INSIDE sidebar - Fixed positioning */}
            <button 
              className={`sidebar-toggle ${collapsed ? 'collapsed' : 'expanded'}`}
              onClick={onToggle}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid rgba(255,255,255,1)',
                borderRadius: '6px',
                color: '#667eea',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 1001,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.95)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
              }}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Authenticated sidebar
  return (
    <>
      <div className={`sidebar-container ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="sidebar-content">
          {/* Brand */}
          <div 
            onClick={handleNavBrandClick}
            className="sidebar-brand"
          >
            <span className="sidebar-brand-icon">💰</span>
            {!collapsed && <span className="sidebar-brand-text">BudgetWise</span>}
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {/* Main Section */}
            <div className="nav-section">
              {!collapsed && <div className="nav-section-title">Main</div>}
              <SidebarNavButton 
                icon="🏠" 
                label="Dashboard" 
                path="/dashboard" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="💳" 
                label="Transactions" 
                path="/transactions" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="📊" 
                label="Analytics" 
                path="/analytics" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="🎯" 
                label="Budgets" 
                path="/budgets" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
            </div>

            {/* Planning Section */}
            <div className="nav-section">
              {!collapsed && <div className="nav-section-title">Planning</div>}
              <SidebarNavButton 
                icon="💰" 
                label="Planning" 
                path="/planning" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="❤️" 
                label="Health" 
                path="/financial-health" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="📈" 
                label="Investments" 
                path="/investments" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
            </div>

            {/* Tools Section */}
            <div className="nav-section">
              {!collapsed && <div className="nav-section-title">Tools</div>}
              <SidebarNavButton 
                icon="📋" 
                label="Bills" 
                path="/bills" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="🤖" 
                label="AI Insights" 
                path="/ai" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButtonWithBadge 
                icon="🔔" 
                label="Notifications" 
                path="/notifications" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
            </div>

            {/* Account Section */}
            <div className="nav-section">
              {!collapsed && <div className="nav-section-title">Account</div>}
              <SidebarNavButton 
                icon="👤" 
                label="Profile" 
                path="/profile" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              <SidebarNavButton 
                icon="⚙️" 
                label="Settings" 
                path="/settings" 
                collapsed={collapsed} 
                navigate={navigate} 
                location={location} 
              />
              {isAdmin && (
                <SidebarNavButton 
                  icon="🔧" 
                  label="Admin" 
                  path="/admin" 
                  collapsed={collapsed} 
                  navigate={navigate} 
                  location={location} 
                />
              )}
            </div>
          </nav>

          {/* Logout */}
          <div className="sidebar-footer">
            <GlassButton
              onClick={handleLogout}
              variant="secondary"
              fullWidth={true}
              className="logout-btn"
              icon={collapsed ? '🚪' : '🚪'}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              {collapsed ? '' : 'Logout'}
            </GlassButton>
            
            {/* Toggle Button - INSIDE sidebar - Fixed positioning */}
            <button 
              className={`sidebar-toggle ${collapsed ? 'collapsed' : 'expanded'}`}
              onClick={onToggle}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid rgba(255,255,255,1)',
                borderRadius: '6px',
                color: '#667eea',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 1001,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.95)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
              }}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper component for sidebar navigation buttons
const SidebarNavButton = ({ icon, label, path, collapsed, navigate, location }) => {
  const isActive = location.pathname === path;
  
  return (
    <button
      onClick={() => navigate(path)}
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      <span className="nav-item-icon">{icon}</span>
      {!collapsed && <span className="nav-item-text">{label}</span>}
    </button>
  );
};

// Helper component for sidebar navigation buttons with notification badge
const SidebarNavButtonWithBadge = ({ icon, label, path, collapsed, navigate, location }) => {
  const isActive = location.pathname === path;
  
  return (
    <button
      onClick={() => navigate(path)}
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      <span className="nav-item-icon" style={{ position: 'relative' }}>
        {icon}
        <NotificationBadge />
      </span>
      {!collapsed && <span className="nav-item-text">{label}</span>}
    </button>
  );
};

export default CleanSidebar;