import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

const PLANS = [
  {
    id: "monthly",
    title: "Premium Monthly",
    price: "$10",
    period: "/month",
    color: "#1890ff",
    features: [
      "Priority listing in search results",
      "ID Verified badge on profile",
      "Unlimited contact reveals",
      "Profile analytics dashboard",
    ],
  },
  {
    id: "quarterly",
    title: "Premium Quarterly ⭐",
    price: "$25",
    period: "/3 months",
    color: "#faad14",
    badge: "Best Value",
    features: [
      "Everything in Monthly",
      "Featured professional badge",
      "Top placement in search",
      "Save 17% vs monthly",
    ],
  },
];

export function DashboardSubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("ecocash");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    providerApi.getSubscription()
      .then(res => setSubscription(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planId: string) => {
    setSubscribing(true);
    setError(null);
    setSuccess(null);
    try {
      await providerApi.subscribe(planId as "monthly" | "quarterly", paymentMethod);
      setSuccess(`Successfully upgraded to ${planId === 'monthly' ? 'Premium Monthly' : 'Premium Quarterly'}!`);
      const fresh = await providerApi.getSubscription();
      setSubscription(fresh);
    } catch (err: any) {
      setError(err.message || "Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
      setSelectedPlan(null);
    }
  };

  const isActive = (planId: string) => {
    if (!subscription?.tier) return false;
    return subscription.tier.includes(planId);
  };

  const expiryDate = subscription?.subscription_expiry
    ? new Date(subscription.subscription_expiry).toLocaleDateString()
    : null;

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="wt-dashboardboxtitle" style={{ marginBottom: '24px' }}>
          <h2>Subscription & Plans</h2>
          {subscription && (
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Current Plan: <strong style={{ color: '#333' }}>{subscription.tier?.replace(/_/g, ' ') || 'Free'}</strong>
              {expiryDate && <span> · Expires: <strong>{expiryDate}</strong></span>}
            </p>
          )}
        </div>

        {success && (
          <div className="wt-updatall" style={{ background: '#f6ffed', borderColor: '#b7eb8f', marginBottom: '20px' }}>
            <i className="ti-check" style={{ color: '#52c41a' }}></i>
            <span style={{ color: '#52c41a' }}>{success}</span>
          </div>
        )}
        {error && (
          <div className="wt-updatall" style={{ background: '#fff1f0', borderColor: '#ffa39e', marginBottom: '20px' }}>
            <i className="ti-close" style={{ color: '#f5222d' }}></i>
            <span style={{ color: '#f5222d' }}>{error}</span>
          </div>
        )}

        {/* Free Plan */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-12">
            <div className="wt-dashboardbox" style={{
              border: subscription?.tier === 'free' || !subscription?.tier ? '2px solid #ff5851' : '1px solid #eee',
              borderRadius: '8px'
            }}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px' }}>Free Plan</h3>
                  <span style={{ color: '#888' }}>Basic visibility on the platform</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '28px', fontWeight: 700, color: '#333' }}>$0</span>
                  <span style={{ color: '#888' }}>/forever</span>
                  {(subscription?.tier === 'free' || !subscription?.tier) && (
                    <p style={{ margin: '4px 0 0', color: '#ff5851', fontWeight: 600, fontSize: '13px' }}>✓ Current Plan</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paid Plans */}
        <div className="row">
          {PLANS.map(plan => (
            <div className="col-12 col-md-6" key={plan.id}>
              <div className="wt-dashboardbox" style={{
                border: isActive(plan.id) ? `2px solid ${plan.color}` : '1px solid #eee',
                borderRadius: '8px', overflow: 'hidden', position: 'relative'
              }}>
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: plan.color, color: '#fff',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
                  }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 4px', color: plan.color }}>{plan.title}</h3>
                  <div style={{ margin: '12px 0' }}>
                    <span style={{ fontSize: '36px', fontWeight: 700, color: '#333' }}>{plan.price}</span>
                    <span style={{ color: '#888' }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <span style={{ color: plan.color, fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  {isActive(plan.id) ? (
                    <div style={{ background: plan.color, color: '#fff', padding: '10px 16px', borderRadius: '6px', textAlign: 'center', fontWeight: 600 }}>
                      ✓ Active Plan
                    </div>
                  ) : selectedPlan === plan.id ? (
                    <div>
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Payment Method</label>
                        <span className="wt-select">
                          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <option value="ecocash">EcoCash</option>
                            <option value="onemoney">OneMoney</option>
                            <option value="innbucks">InnBucks</option>
                            <option value="card">Credit/Debit Card</option>
                          </select>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="wt-btn"
                          style={{ flex: 1, background: plan.color }}
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={subscribing}
                        >
                          {subscribing ? 'Processing...' : 'Confirm & Pay'}
                        </button>
                        <button
                          className="wt-btn"
                          style={{ background: '#ccc', color: '#333' }}
                          onClick={() => setSelectedPlan(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="wt-btn"
                      style={{ width: '100%', background: plan.color }}
                      onClick={() => setSelectedPlan(plan.id)}
                      disabled={loading}
                    >
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History */}
        {!loading && subscription?.history?.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle">
                  <h2>Payment History</h2>
                </div>
                <div className="wt-dashboardboxcontent">
                  <table className="wt-tablecategories">
                    <thead>
                      <tr>
                        <th>Plan</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscription.history.map((h: any) => (
                        <tr key={h.id}>
                          <td style={{ textTransform: 'capitalize' }}>{h.tier?.replace(/_/g, ' ')}</td>
                          <td>{h.start_date ? new Date(h.start_date).toLocaleDateString() : '—'}</td>
                          <td>{h.end_date ? new Date(h.end_date).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
