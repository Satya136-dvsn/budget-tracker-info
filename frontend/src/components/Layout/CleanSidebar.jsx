import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRoles } from '../../utils/RoleBasedAccess';
import NotificationBadge from '../Common/NotificationBadge';
import { GlassCard, GlassButton } from '../Glass';
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
          <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            {/* Brand */}
            <div 
              onClick={handleNavBrandClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '2rem',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>💰</span>
              {!collapsed && <span>BudgetWise</span>}
            </div>

            {/* Auth buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              <button 
                onClick={() => navigate('/signin')}
                disabled={location.pathname === '/signin'}
                className="professional-btn professional-btn-secondary"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  opacity: location.pathname === '/signin' ? 0.6 : 1
                }}
              >
                {collapsed ? '🔑' : 'Sign In'}
              </button>
              <button 
                onClick={() => navigate('/signup')}
                disabled={location.pathname === '/signup'}
                className="professional-btn"
                style={{
                  background: 'white',
                  color: '#667eea',
                  opacity: location.pathname === '/signup' ? 0.6 : 1
                }}
              >
                {collapsed ? '✨' : '✨ Get Started'}
              </button>
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
        <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          {/* Brand */}
          <div 
            onClick={handleNavBrandClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '2rem',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            {!collapsed && <span>BudgetWise</span>}
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1 }}>
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
              icon="❤️"
              label="Health"
              path="/financial-health"
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
            <SidebarNavButton
              icon="🎯"
              label="Savings & Planning"
              path="/planning"
              collapsed={collapsed}
              navigate={navigate}
              location={location}
            />
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
            <SidebarNavButton
              icon="👥"
              label="Community"
              path="/community"
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
            <SidebarNavButton
              icon="💱"
              label="Currencies"
              path="/currencies"
              collapsed={collapsed}
              navigate={navigate}
              location={location}
            />
            <SidebarNavButton
              icon="🏦"
              label="Banking"
              path="/banking"
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
                icon="⚙️"
                label="Admin"
                path="/admin"
                collapsed={collapsed}
                navigate={navigate}
                location={location}
              />
            )}
          </nav>

          {/* Logout */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>🚪</span>
              {!collapsed && <span>Logout</span>}
            </button>
            
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
      style={{
        width: '100%',
        padding: collapsed ? '0.75rem' : '0.75rem 1rem',
        marginBottom: '0.5rem',
        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.3s ease',
        opacity: isActive ? 1 : 0.8
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.background = 'rgba(255,255,255,0.1)';
        }
        e.target.style.transform = 'translateX(4px)';
        e.target.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.background = 'transparent';
        }
        e.target.style.transform = 'translateX(0)';
        e.target.style.opacity = isActive ? '1' : '0.8';
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
};

// Helper component for sidebar navigation buttons with notification badge
const SidebarNavButtonWithBadge = ({ icon, label, path, collapsed, navigate, location }) => {
  const isActive = location.pathname === path;
  
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        width: '100%',
        padding: collapsed ? '0.75rem' : '0.75rem 1rem',
        marginBottom: '0.5rem',
        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.3s ease',
        opacity: isActive ? 1 : 0.8,
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.background = 'rgba(255,255,255,0.1)';
        }
        e.target.style.transform = 'translateX(4px)';
        e.target.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.background = 'transparent';
        }
        e.target.style.transform = 'translateX(0)';
        e.target.style.opacity = isActive ? '1' : '0.8';
      }}
    >
      <span style={{ fontSize: '1.1rem', position: 'relative' }}>
        {icon}
        <NotificationBadge />
      </span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
};

export default CleanSidebar;