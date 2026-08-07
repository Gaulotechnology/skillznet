import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

export function DashboardInsightsUserPage() {
  const [analytics, setAnalytics] = useState<{
    profile_views: number;
    contact_reveals: number;
    subscription_tier: string;
    expiry_date: string;
  } | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      providerApi.getAnalytics(),
      providerApi.getSubscription(),
    ]).then(([a, s]) => {
      setAnalytics(a);
      setSubscription(s);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tierBadge = (tier: string) => {
    const map: Record<string, { label: string; color: string }> = {
      free: { label: "Free", color: "#888" },
      premium_monthly: { label: "Premium Monthly", color: "#1890ff" },
      premium_quarterly: { label: "Premium Quarterly ⭐", color: "#faad14" },
    };
    return map[tier] || { label: tier, color: "#888" };
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace wt-insightuser">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '30px', color: '#ff5851' }}></i>
            <p>Loading your insights...</p>
          </div>
        ) : (
          <div className="row">
            {/* Stat Cards */}
            <div className="col-12 col-sm-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <i className="lnr lnr-eye" style={{ fontSize: '28px', color: '#1890ff', display: 'block', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '32px', margin: '0', color: '#1890ff' }}>{analytics?.profile_views ?? 0}</h3>
                <span>Profile Views</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <i className="lnr lnr-phone-handset" style={{ fontSize: '28px', color: '#52c41a', display: 'block', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '32px', margin: '0', color: '#52c41a' }}>{analytics?.contact_reveals ?? 0}</h3>
                <span>Contact Reveals</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <i className="lnr lnr-star" style={{ fontSize: '28px', color: '#faad14', display: 'block', marginBottom: '8px' }}></i>
                <span style={{
                  background: tierBadge(analytics?.subscription_tier || 'free').color,
                  color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600
                }}>
                  {tierBadge(analytics?.subscription_tier || 'free').label}
                </span>
                <p style={{ marginTop: '6px', fontSize: '12px', color: '#888' }}>Current Plan</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
                <i className="lnr lnr-calendar-full" style={{ fontSize: '28px', color: '#ff5851', display: 'block', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '14px', margin: '0' }}>
                  {analytics?.expiry_date
                    ? new Date(analytics.expiry_date).toLocaleDateString()
                    : 'No Expiry'}
                </h3>
                <span>Subscription Expiry</span>
              </div>
            </div>

            {/* Subscription History */}
            <div className="col-12 col-md-6 mt-4">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle">
                  <h2>Subscription History</h2>
                </div>
                <div className="wt-dashboardboxcontent">
                  {subscription?.history?.length > 0 ? (
                    <table className="wt-tablecategories">
                      <thead>
                        <tr>
                          <th>Plan</th>
                          <th>Start</th>
                          <th>End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.history.map((h: any) => (
                          <tr key={h.id}>
                            <td><span style={{ textTransform: 'capitalize' }}>{h.tier?.replace(/_/g, ' ')}</span></td>
                            <td>{h.start_date ? new Date(h.start_date).toLocaleDateString() : '—'}</td>
                            <td>{h.end_date ? new Date(h.end_date).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>No subscription history yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="col-12 col-md-6 mt-4">
              <div className="wt-dashboardbox" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                <div className="wt-dashboardboxtitle" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <h2 style={{ color: '#fff' }}>Upgrade Your Plan</h2>
                </div>
                <div className="wt-dashboardboxcontent" style={{ padding: '20px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
                    Get more profile views and priority placement by upgrading your subscription.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/dashboard/subscription" className="wt-btn" style={{ background: '#fff', color: '#764ba2' }}>
                      View Plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="col-12 mt-4">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle">
                  <h2>Profile Completion Tips</h2>
                </div>
                <div className="wt-dashboardboxcontent" style={{ padding: '20px' }}>
                  <div className="row">
                    {[
                      { icon: 'lnr-picture', text: 'Add a professional profile photo', link: '/dashboard/profile' },
                      { icon: 'lnr-briefcase', text: 'Upload your CV or certificates', link: '/dashboard/profile' },
                      { icon: 'lnr-star', text: 'Add your skills and experience', link: '/dashboard/profile' },
                      { icon: 'lnr-phone-handset', text: 'Enable contact opt-in to get more leads', link: '/dashboard/profile' },
                    ].map((tip, i) => (
                      <div className="col-12 col-sm-6" key={i} style={{ marginBottom: '12px' }}>
                        <Link to={tip.link} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px',
                          textDecoration: 'none', color: '#333', transition: 'all 0.2s'
                        }}>
                          <i className={`lnr ${tip.icon}`} style={{ color: '#ff5851', fontSize: '20px', minWidth: '24px' }}></i>
                          <span style={{ fontSize: '14px' }}>{tip.text}</span>
                        </Link>
                      </div>
                    ))}
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
