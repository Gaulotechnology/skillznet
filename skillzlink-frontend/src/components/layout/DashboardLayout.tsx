import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/api';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = user?.role || localStorage.getItem('role') || 'seeker';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminNav: NavItem[] = [
    { to: '/dashboard/admin/overview',      icon: 'ti-dashboard',               label: 'Overview' },
    { to: '/dashboard/admin/users',          icon: 'ti-user',                    label: 'All Users' },
    { to: '/dashboard/admin/professionals',  icon: 'ti-id-badge',                label: 'All Professionals' },
    { to: '/dashboard/admin/categories',     icon: 'ti-menu',                    label: 'Manage Categories' },
    { to: '/dashboard/admin/theme-settings', icon: 'ti-paint-roller',            label: 'Theme Settings' },
    { to: '/dashboard/admin/form-builder',   icon: 'ti-layout-list-thumb-alt',   label: 'Form Builder' },
    { to: '/dashboard/admin/api-logs',       icon: 'ti-bar-chart',               label: 'API Logs' },
  ];

  const providerNav: NavItem[] = [
    { to: '/dashboard/provider/overview',   icon: 'ti-dashboard',      label: 'Overview' },
    { to: '/dashboard/profile',             icon: 'ti-user',           label: 'My Profile' },
    { to: '/dashboard/insights',            icon: 'ti-bar-chart',      label: 'Insights & Stats' },
    { to: '/dashboard/subscription',        icon: 'ti-star',           label: 'Subscription' },
    { to: '/dashboard/messages',            icon: 'ti-comment',        label: 'Messages' },
    { to: '/dashboard/saved',               icon: 'ti-heart',          label: 'Saved Items' },
    { to: '/dashboard/settings',            icon: 'ti-settings',       label: 'Account Settings' },
    { to: '/dashboard/help',                icon: 'ti-help',           label: 'Help & Support' },
  ];

  const seekerNav: NavItem[] = [
    { to: '/dashboard/seeker/overview',     icon: 'ti-dashboard',      label: 'Overview' },
    { to: '/nearby-professionals',          icon: 'ti-search',         label: 'Find Professionals' },
    { to: '/dashboard/saved',               icon: 'ti-heart',          label: 'Saved Professionals' },
    { to: '/dashboard/messages',            icon: 'ti-comment',        label: 'Messages' },
    { to: '/dashboard/settings',            icon: 'ti-settings',       label: 'Account Settings' },
    { to: '/dashboard/help',                icon: 'ti-help',           label: 'Help & Support' },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'provider' ? providerNav : seekerNav;

  const roleColor = role === 'admin' ? '#722ed1' : role === 'provider' ? '#1890ff' : '#52c41a';
  const roleLabel = role === 'admin' ? 'Administrator' : role === 'provider' ? 'Professional' : 'Seeker';

  return (
    <main id="wt-main" className="wt-main wt-haslayout">
      {/* Sidebar */}
      <div id="wt-sidebarwrapper" className={`wt-sidebarwrapper ${sidebarOpen ? 'wt-open' : ''}`}>
        <div id="wt-btnmenutoggle" className="wt-btnmenutoggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="menu-icon"><em></em><em></em><em></em></span>
        </div>

        <div id="wt-verticalscrollbar" className="wt-verticalscrollbar" style={{ overflowY: 'auto' }}>
          {/* User Card */}
          <div className="wt-companysdetails wt-usersidebar" style={{ padding: '20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 700, color: '#fff'
              }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '15px', color: '#333' }}>{user?.name || 'User'}</h4>
                <span style={{
                  background: roleColor, color: '#fff', padding: '2px 8px',
                  borderRadius: '20px', fontSize: '11px', fontWeight: 600
                }}>
                  {roleLabel}
                </span>
              </div>
            </div>
            {role === 'provider' && (
              <Link to="/dashboard/profile" className="wt-btn" style={{ width: '100%', textAlign: 'center', fontSize: '12px', padding: '8px' }}>
                Edit Profile
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav id="wt-navdashboard" className="wt-navdashboard">
            <ul>
              {navItems.map((item) => (
                <li key={item.to} className={location.pathname === item.to ? 'wt-active' : ''}>
                  <Link to={item.to}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    width: '100%', padding: '12px 20px', color: '#ff5851',
                    fontSize: '14px', textAlign: 'left'
                  }}
                >
                  <i className="ti-shift-right" style={{ color: '#ff5851' }}></i>
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="wt-navdashboard-footer">
            <span>SkillzLink. © 2024 All Rights Reserved.</span>
          </div>
        </div>
      </div>
      {/* Sidebar End */}

      {/* Main Content */}
      <section className="wt-haslayout">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9">
            <div className="wt-haslayout wt-dbsectionspace">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
