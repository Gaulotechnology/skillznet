import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <main id="wt-main" className="wt-main wt-haslayout">
      {/* Sidebar Start */}
      <div id="wt-sidebarwrapper" className={`wt-sidebarwrapper ${sidebarOpen ? 'wt-open' : ''}`}>
        <div id="wt-btnmenutoggle" className="wt-btnmenutoggle" onClick={toggleSidebar}>
          <span className="menu-icon">
            <em></em>
            <em></em>
            <em></em>
          </span>
        </div>
        <div id="wt-verticalscrollbar" className="wt-verticalscrollbar" style={{overflowY: 'auto'}}>
          <div className="wt-companysdetails wt-usersidebar">
            <figure className="wt-companysimg">
              <img src="/images/sidebar/img-01.jpg" alt="img description" />
            </figure>
            <div className="wt-companysinfo">
              <figure><img src="/images/sidebar/img-02.jpg" alt="img description" /></figure>
              <div className="wt-title">
                <h2><Link to="/professional-profile/1"> Tinashe Moyo</Link></h2>
                <span>Professional Plumber</span>
              </div>
              <div className="wt-btnarea"><Link to="/dashboard-profile" className="wt-btn">Edit Profile</Link></div>
            </div>
          </div>
          <nav id="wt-navdashboard" className="wt-navdashboard">
            <ul>
              <li className={location.pathname === '/dashboard-profile' ? 'wt-active' : ''}>
                <Link to="/dashboard-profile">
                  <i className="ti-briefcase"></i>
                  <span>My Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard-messages">
                  <i className="ti-pencil-alt"></i>
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard-jobs">
                  <i className="ti-announcement"></i>
                  <span>Manage Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <i className="ti-shift-right"></i>
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="wt-navdashboard-footer">
            <span>SkillzLink. © 2024 All Rights Reserved.</span>
          </div>
        </div>
      </div>
      {/* Sidebar End */}

      {/* Main Content Start */}
      <section className="wt-haslayout">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9">
            <div className="wt-haslayout wt-dbsectionspace">
              {children}
            </div>
          </div>
        </div>
      </section>
      {/* Main Content End */}
    </main>
  );
}
