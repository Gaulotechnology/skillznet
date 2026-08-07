import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser } from "../../../services/api";

export function DashboardSeekerOverviewPage() {
  const user = getCurrentUser();
  const [savedPros] = useState<any[]>(
    JSON.parse(localStorage.getItem("saved_professionals") || "[]")
  );

  const quickStats = [
    { label: "Saved Professionals", value: savedPros.length, icon: "lnr-heart", color: "#ff5851" },
    { label: "Reports Submitted", value: parseInt(localStorage.getItem("report_count") || "0"), icon: "lnr-flag", color: "#fa8c16" },
  ];

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          {/* Welcome Banner */}
          <div className="col-12" style={{ marginBottom: '24px' }}>
            <div className="wt-dashboardbox" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '28px'
            }}>
              <h2 style={{ color: '#fff', margin: '0 0 8px' }}>Welcome, {user?.name || 'Explorer'}! 👋</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 20px' }}>
                Find and connect with trusted professionals near you.
              </p>
              <Link to="/nearby-professionals" className="wt-btn" style={{ background: '#fff', color: '#764ba2', fontWeight: 600 }}>
                Browse Professionals
              </Link>
            </div>
          </div>

          {/* Stats */}
          {quickStats.map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <i className={`lnr ${s.icon}`} style={{ fontSize: '28px', color: s.color, display: 'block', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '32px', margin: '0', color: s.color }}>{s.value}</h3>
                <span style={{ fontSize: '13px' }}>{s.label}</span>
              </div>
            </div>
          ))}

          {/* Saved Professionals */}
          <div className="col-12 col-md-6 mt-4">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle wt-titlewithsearch">
                <h2>Saved Professionals</h2>
                <Link to="/nearby-professionals" style={{ fontSize: '13px', color: '#ff5851' }}>Browse More</Link>
              </div>
              <div className="wt-dashboardboxcontent">
                {savedPros.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                    <i className="lnr lnr-heart" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
                    <p>No saved professionals yet.</p>
                    <Link to="/nearby-professionals" className="wt-btn">Browse Professionals</Link>
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {savedPros.slice(0, 5).map((p: any, i: number) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="lnr lnr-user" style={{ color: '#888' }}></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
                          <div style={{ color: '#888', fontSize: '12px' }}>{p.service_category} · {p.location}</div>
                        </div>
                        <Link to={`/professional-profile/${p.id}`} style={{ fontSize: '12px', color: '#ff5851' }}>View</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-6 mt-4">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Quick Actions</h2>
              </div>
              <div className="wt-dashboardboxcontent" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { to: '/nearby-professionals', icon: 'ti-search', label: 'Find a Professional', desc: 'Search by category and location' },
                  { to: '/dashboard/saved', icon: 'ti-heart', label: 'Saved Professionals', desc: 'Your saved favorites' },
                  { to: '/dashboard/settings', icon: 'ti-settings', label: 'Account Settings', desc: 'Update your profile & preferences' },
                  { to: '/dashboard/help', icon: 'ti-help', label: 'Help & Support', desc: 'Get help from our team' },
                ].map((a, i) => (
                  <Link to={a.to} key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                    background: '#f8f9fa', borderRadius: '8px', textDecoration: 'none', color: '#333',
                  }}>
                    <i className={a.icon} style={{ fontSize: '22px', color: '#764ba2', minWidth: '28px' }}></i>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{a.label}</div>
                      <div style={{ color: '#888', fontSize: '12px' }}>{a.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
