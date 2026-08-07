import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

export function DashboardAdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res))
      .catch(err => console.error("Failed to load stats", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="wt-haslayout wt-dbsectionspace">
        <div className="wt-dashboardboxtitle" style={{ marginBottom: '20px' }}>
          <h2>Super Admin Overview</h2>
        </div>
        
        {loading ? (
          <p>Loading statistics...</p>
        ) : (
          <div className="row">
            {/* Stat Cards */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="wt-insightsitem wt-dashboardbox">
                <div className="wt-insightdetails">
                  <div className="wt-title">
                    <h3>{stats?.total_users || 0}</h3>
                    <span>Total Users</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="wt-insightsitem wt-dashboardbox">
                <div className="wt-insightdetails">
                  <div className="wt-title">
                    <h3>{stats?.total_providers || 0}</h3>
                    <span>Professionals</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="wt-insightsitem wt-dashboardbox">
                <div className="wt-insightdetails">
                  <div className="wt-title">
                    <h3>{stats?.total_seekers || 0}</h3>
                    <span>Seekers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="wt-insightsitem wt-dashboardbox">
                <div className="wt-insightdetails">
                  <div className="wt-title">
                    <h3>${stats?.total_revenue || 0}</h3>
                    <span>Total Revenue</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions / Recent */}
            <div className="col-12 col-md-6 mt-4">
               <div className="wt-dashboardbox">
                 <div className="wt-dashboardboxtitle">
                   <h2>Recent Signups</h2>
                 </div>
                 <div className="wt-dashboardboxcontent">
                   <ul className="list-group list-group-flush">
                     {stats?.recent_users?.map((u: any) => (
                       <li className="list-group-item d-flex justify-content-between align-items-center" key={u.id}>
                         {u.name} ({u.email})
                         <span className="badge badge-primary badge-pill">{u.role}</span>
                       </li>
                     ))}
                   </ul>
                   <div style={{ padding: '15px' }}>
                     <Link to="/dashboard/admin/users" className="wt-btn">View All Users</Link>
                   </div>
                 </div>
               </div>
            </div>

            <div className="col-12 col-md-6 mt-4">
               <div className="wt-dashboardbox">
                 <div className="wt-dashboardboxtitle">
                   <h2>Quick Links</h2>
                 </div>
                 <div className="wt-dashboardboxcontent" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to="/dashboard/admin/users" className="wt-btn" style={{ width: '100%' }}>Manage Users</Link>
                    <Link to="/dashboard/admin/professionals" className="wt-btn" style={{ width: '100%' }}>Manage Professionals</Link>
                    <Link to="/dashboard/categories" className="wt-btn" style={{ width: '100%' }}>Manage Categories</Link>
                    <Link to="/dashboard/packages" className="wt-btn" style={{ width: '100%' }}>Manage Packages</Link>
                 </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
