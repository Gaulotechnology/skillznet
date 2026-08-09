import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/api';
import { LiveChatWidget } from '../common/LiveChatWidget';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = user?.role || localStorage.getItem('role') || 'seeker';

  const isImpersonating = !!localStorage.getItem('skillzlink_prev_token');

  const handleReturnToAdmin = () => {
    const prevToken = localStorage.getItem('skillzlink_prev_token') || '';
    const prevUser = localStorage.getItem('skillzlink_prev_user') || '';
    localStorage.setItem('skillzlink_token', prevToken);
    localStorage.setItem('skillzlink_user', prevUser);
    localStorage.removeItem('skillzlink_prev_token');
    localStorage.removeItem('skillzlink_prev_user');
    window.dispatchEvent(new Event('auth_change'));
    navigate('/dashboard/admin/users');
  };

  const adminSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { to: '/dashboard/admin/overview',       icon: 'lnr lnr-pie-chart',       label: 'Overview' },
        { to: '/dashboard/admin/conversations',  icon: 'lnr lnr-bubble',          label: 'Conversations' },
      ]
    },
    {
      title: 'People',
      items: [
        { to: '/dashboard/admin/users',          icon: 'lnr lnr-users',           label: 'All Users' },
        { to: '/dashboard/admin/professionals',  icon: 'lnr lnr-user',            label: 'Professionals' },
        { to: '/dashboard/admin/seekers',        icon: 'lnr lnr-briefcase',       label: 'Seekers' },
        { to: '/dashboard/admin/agents',         icon: 'lnr lnr-laptop',          label: 'Agents' },
        { to: '/dashboard/admin/affiliates',     icon: 'lnr lnr-users',           label: 'Affiliates' },
        { to: '/dashboard/admin/employees',      icon: 'lnr lnr-users',           label: 'Employees' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { to: '/dashboard/admin/matching',       icon: 'lnr lnr-magic-wand',      label: 'On-Demand Matching' },
        { to: '/dashboard/admin/appointments',   icon: 'lnr lnr-calendar-full',   label: 'Appointments' },
        { to: '/dashboard/admin/invitations',    icon: 'lnr lnr-envelope',        label: 'Invitations' },
        { to: '/dashboard/admin/payments',       icon: 'lnr lnr-diamond',         label: 'Payments' },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { to: '/dashboard/admin/insights',       icon: 'lnr lnr-chart-bars',      label: 'Reports' },
        { to: '/dashboard/admin/api-logs',       icon: 'lnr lnr-code',            label: 'API Logs' },
        { to: '/dashboard/admin/sms-logs',       icon: 'lnr lnr-smartphone',      label: 'SMS Logs' },
        { to: '/dashboard/admin/comm-logs',      icon: 'lnr lnr-envelope',        label: 'Comm Logs' },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { to: '/dashboard/admin/categories',     icon: 'lnr lnr-list',            label: 'Categories' },
        { to: '/dashboard/admin/roles',          icon: 'lnr lnr-lock',            label: 'Roles & Permissions' },
        { to: '/dashboard/admin/form-builder',   icon: 'lnr lnr-text-align-left', label: 'Form Builder' },
        { to: '/dashboard/admin/knowledge-base', icon: 'lnr lnr-book',            label: 'Knowledge Base' },
        { to: '/dashboard/admin/theme-settings', icon: 'lnr lnr-cog',             label: 'Settings' },
      ]
    },
  ];

  const providerSections: NavSection[] = [
    {
      title: 'Dashboard',
      items: [
        { to: '/dashboard/provider/overview',     icon: 'lnr lnr-pie-chart',      label: 'Overview' },
        { to: '/dashboard/profile',               icon: 'lnr lnr-user',           label: 'My Profile' },
        { to: '/dashboard/insights',              icon: 'lnr lnr-chart-bars',     label: 'Insights' },
      ]
    },
    {
      title: 'Services',
      items: [
        { to: '/dashboard/quotes',                icon: 'lnr lnr-inbox',           label: 'Quotes' },
        { to: '/dashboard/ongoing-service',       icon: 'lnr lnr-sync',            label: 'Ongoing' },
        { to: '/dashboard/completed-services',    icon: 'lnr lnr-checkmark-circle',label: 'Completed' },
        { to: '/dashboard/cancelled-services',    icon: 'lnr lnr-cross-circle',    label: 'Cancelled' },
        { to: '/dashboard/provider/bookings',     icon: 'lnr lnr-calendar-full',  label: 'My Bookings' },
        { to: '/dashboard/provider/availability', icon: 'lnr lnr-clock',          label: 'Availability' },
        { to: '/dashboard/subscription',          icon: 'lnr lnr-star',           label: 'Subscription' },
      ]
    },
    {
      title: 'Communication',
      items: [
        { to: '/dashboard/provider/messages',     icon: 'lnr lnr-bubble',         label: 'Messages' },
        { to: '/dashboard/saved',                 icon: 'lnr lnr-heart',          label: 'Saved Items' },
      ]
    },
    {
      title: 'Account',
      items: [
        { to: '/dashboard/settings',              icon: 'lnr lnr-cog',            label: 'Settings' },
        { to: '/dashboard/help',                  icon: 'lnr lnr-question-circle',label: 'Help & Support' },
      ]
    },
  ];

  const agentSections: NavSection[] = [
    { title: 'Dashboard', items: [
      { to: '/dashboard/agent/overview',    icon: 'lnr lnr-pie-chart',   label: 'Overview' },
      { to: '/dashboard/agent/referrals',   icon: 'lnr lnr-users',       label: 'My Referrals' },
      { to: '/dashboard/agent/commissions', icon: 'lnr lnr-chart-bars',  label: 'Commissions' },
    ]},
    { title: 'Account', items: [
      { to: '/dashboard/settings',          icon: 'lnr lnr-cog',         label: 'Settings' },
    ]},
  ];

  const affiliateSections: NavSection[] = [
    { title: 'Dashboard', items: [
      { to: '/dashboard/affiliate/overview', icon: 'lnr lnr-pie-chart',  label: 'Overview' },
      { to: '/dashboard/affiliate/links',    icon: 'lnr lnr-link',       label: 'Referral Links' },
      { to: '/dashboard/affiliate/payouts',  icon: 'lnr lnr-briefcase',  label: 'Payouts' },
    ]},
    { title: 'Account', items: [
      { to: '/dashboard/settings',           icon: 'lnr lnr-cog',        label: 'Settings' },
    ]},
  ];

  const seekerSections: NavSection[] = [
    { title: 'Dashboard', items: [
      { to: '/dashboard/seeker/overview',   icon: 'lnr lnr-pie-chart',   label: 'Overview' },
      { to: '/nearby-professionals',        icon: 'lnr lnr-magnifier',   label: 'Find Professionals' },
      { to: '/dashboard/seeker/bookings',   icon: 'lnr lnr-calendar-full', label: 'My Bookings' },
    ]},
    { title: 'Saved', items: [
      { to: '/dashboard/saved',             icon: 'lnr lnr-heart',       label: 'Saved Professionals' },
      { to: '/dashboard/messages',          icon: 'lnr lnr-bubble',      label: 'Messages' },
    ]},
    { title: 'Account', items: [
      { to: '/dashboard/settings',          icon: 'lnr lnr-cog',         label: 'Settings' },
      { to: '/dashboard/help',              icon: 'lnr lnr-question-circle', label: 'Help & Support' },
    ]},
  ];

  const sections = (role === 'super_admin' || role === 'admin') ? adminSections
    : role === 'agent' ? agentSections
    : role === 'affiliate' ? affiliateSections
    : role === 'provider' ? providerSections
    : seekerSections;

  const getRoleLabel = (r: string) => {
    switch(r) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'agent': return 'Agent';
      case 'affiliate': return 'Affiliate';
      case 'provider': return 'Provider';
      default: return 'Seeker';
    }
  };
  const roleLabel = getRoleLabel(role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col font-sans text-gray-900 antialiased">
      {/* Top Bar */}
      <header className="fixed top-0 inset-x-0 h-[64px] bg-white border-b border-gray-200/60 z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden w-9 h-9 rounded-lg text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`lnr ${sidebarOpen ? 'lnr-cross' : 'lnr-menu'} text-lg`}></i>
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)] flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:block">SkillzLink</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors hidden sm:flex items-center gap-1">
            <i className="lnr lnr-arrow-left text-[11px]"></i> Back to site
          </Link>
          
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <i className="lnr lnr-alarm text-lg"></i>
          </button>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-[12px] font-semibold">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-semibold text-gray-900 leading-tight">{user?.name || 'User'}</div>
              <div className="text-[11px] font-medium text-gray-400">{roleLabel}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="fixed top-[64px] inset-x-0 z-40 bg-amber-400 text-amber-900 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <i className="lnr lnr-enter"></i>
            Viewing as <strong className="ml-1">{user?.name}</strong>
          </div>
          <button
            onClick={handleReturnToAdmin}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/90 text-amber-700 rounded-md font-semibold text-[12px] hover:bg-white transition-colors"
          >
            <i className="lnr lnr-arrow-left text-[10px]"></i> Return
          </button>
        </div>
      )}

      {/* Layout */}
      <div className={`flex-1 flex h-screen overflow-hidden ${isImpersonating ? 'pt-[104px]' : 'pt-[64px]'}`}>
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 pt-[64px] w-[260px] bg-white border-r border-gray-200/60 z-40 transform transition-transform duration-200 ease-out lg:relative lg:translate-x-0 lg:pt-0 ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}>
          <div className="h-full flex flex-col overflow-y-auto">
            
            {/* Sectioned Navigation */}
            <nav className="flex-1 py-4 px-3">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className={sIdx > 0 ? 'mt-6' : ''}>
                  <div className="px-3 mb-1.5">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{section.title}</span>
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.to || (item.to !== '/dashboard/admin/overview' && item.to !== '/dashboard/provider/overview' && item.to !== '/dashboard/seeker/overview' && item.to !== '/dashboard/agent/overview' && item.to !== '/dashboard/affiliate/overview' && location.pathname.startsWith(item.to));
                      return (
                        <Link 
                          key={item.to} 
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                            isActive 
                              ? 'bg-gray-900 text-white' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <i className={`${item.icon} text-[15px] ${isActive ? 'text-rose-400' : 'text-gray-400'} w-5 text-center`}></i>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <i className="lnr lnr-exit text-[15px] w-5 text-center"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f7f7f7]">
          {children}
        </main>
      </div>
      <LiveChatWidget />
    </div>
  );
}
