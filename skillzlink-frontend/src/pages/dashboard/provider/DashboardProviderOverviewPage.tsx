import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

export function DashboardProviderOverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      providerApi.getAnalytics(),
      providerApi.getProfile(),
    ]).then(([a, p]) => {
      setAnalytics(a);
      setProfile(p.provider);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tierColor = (tier: string) => {
    if (tier?.includes('quarterly')) return '#faad14';
    if (tier?.includes('monthly')) return '#1890ff';
    return '#888';
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '30px', color: '#ff5851' }}></i>
          </div>
        ) : (
          <div className="row">
            {/* Welcome Header */}
            <div className="col-12" style={{ marginBottom: '24px' }}>
              <div className="wt-dashboardbox" style={{ background: 'linear-gradient(135deg, #ff5851 0%, #ff8a4c 100%)', color: '#fff', padding: '24px' }}>
                <h2 style={{ color: '#fff', margin: '0 0 4px' }}>Welcome back, {profile?.name || 'Professional'}! 👋</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                  Here's an overview of your account performance.
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="col-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '36px', margin: '0', color: '#1890ff' }}>{analytics?.profile_views ?? 0}</h3>
                <span>Profile Views</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '36px', margin: '0', color: '#52c41a' }}>{analytics?.contact_reveals ?? 0}</h3>
                <span>Contact Reveals</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', margin: '0', color: tierColor(analytics?.subscription_tier) }}>
                  {analytics?.subscription_tier?.replace(/_/g, ' ') || 'Free'}
                </h3>
                <span>Current Plan</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', margin: '0', color: profile?.identity_verified ? '#52c41a' : '#fa8c16' }}>
                  {profile?.identity_verified ? '✓ Verified' : 'Pending'}
                </h3>
                <span>ID Verification</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-12 col-md-6 mt-4">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle">
                  <h2>Quick Actions</h2>
                </div>
                <div className="wt-dashboardboxcontent" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { to: '/dashboard/profile', icon: 'ti-user', label: 'Edit My Profile', desc: 'Update your bio, skills, and photos' },
                    { to: '/dashboard/subscription', icon: 'ti-star', label: 'Manage Subscription', desc: 'Upgrade for more visibility' },
                    { to: '/dashboard/insights', icon: 'ti-bar-chart', label: 'View Insights', desc: 'Detailed performance analytics' },
                    { to: '/dashboard/settings', icon: 'ti-settings', label: 'Account Settings', desc: 'Privacy and notification preferences' },
                  ].map((a, i) => (
                    <Link to={a.to} key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                      background: '#f8f9fa', borderRadius: '8px', textDecoration: 'none', color: '#333',
                      transition: 'background 0.2s'
                    }}>
                      <i className={a.icon} style={{ fontSize: '22px', color: '#ff5851', minWidth: '28px' }}></i>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{a.label}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{a.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Completeness */}
            <div className="col-12 col-md-6 mt-4">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle">
                  <h2>Profile Strength</h2>
                </div>
                <div className="wt-dashboardboxcontent" style={{ padding: '20px' }}>
                  {[
                    { label: 'Description', done: !!profile?.description },
                    { label: 'Service Category', done: !!profile?.service_category },
                    { label: 'Location / Address', done: !!profile?.location },
                    { label: 'Profile Photo', done: !!profile?.image },
                    { label: 'ID Verified', done: !!profile?.identity_verified },
                    { label: 'Contact Opt-in', done: !!profile?.contact_opt_in },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0', borderBottom: i < 5 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <span style={{ fontSize: '14px' }}>{item.label}</span>
                      <span style={{
                        color: item.done ? '#52c41a' : '#fa8c16',
                        fontWeight: 600, fontSize: '13px'
                      }}>
                        {item.done ? '✓ Complete' : '○ Incomplete'}
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: '16px' }}>
                    <Link to="/dashboard/profile" className="wt-btn" style={{ width: '100%', textAlign: 'center' }}>
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
