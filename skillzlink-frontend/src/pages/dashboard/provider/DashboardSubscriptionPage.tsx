import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const PLANS = [
  {
    id: "monthly",
    title: "Premium Monthly",
    price: "$10",
    period: "/month",
    features: [
      "Priority listing in search results",
      "ID Verified badge on profile",
      "Unlimited contact reveals",
      "Profile analytics dashboard",
    ],
  },
  {
    id: "quarterly",
    title: "Premium Quarterly",
    price: "$25",
    period: "/3 months",
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
    setSubscribing(true); setError(null); setSuccess(null);
    try {
      await providerApi.subscribe(planId as "monthly" | "quarterly", paymentMethod);
      setSuccess(`Successfully upgraded to ${planId === 'monthly' ? 'Premium Monthly' : 'Premium Quarterly'}!`);
      const fresh = await providerApi.getSubscription();
      setSubscription(fresh);
    } catch (err: any) {
      setError(err.message || "Subscription failed. Please try again.");
    } finally {
      setSubscribing(false); setSelectedPlan(null);
    }
  };

  const isActive = (planId: string) => {
    if (!subscription?.tier) return false;
    return subscription.tier.includes(planId);
  };

  const expiryDate = subscription?.subscription_expiry
    ? new Date(subscription.subscription_expiry).toLocaleDateString()
    : null;

  const historyColumns: Column<any>[] = [
    {
      key: "tier",
      label: "Plan Details",
      render: (h) => <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{h.tier?.replace(/_/g, ' ')}</span>,
      exportValue: (h) => h.tier?.replace(/_/g, ' ') || '',
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (h) => <span className="text-sm text-[var(--text-secondary)]">{h.start_date ? new Date(h.start_date).toLocaleDateString() : '—'}</span>,
      exportValue: (h) => h.start_date ? new Date(h.start_date).toLocaleDateString() : '',
    },
    {
      key: "end_date",
      label: "End Date",
      render: (h) => <span className="text-sm text-[var(--text-secondary)]">{h.end_date ? new Date(h.end_date).toLocaleDateString() : '—'}</span>,
      exportValue: (h) => h.end_date ? new Date(h.end_date).toLocaleDateString() : '',
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (h, index) => {
        const isLatest = index === 0;
        return isLatest && isActive(h.tier) ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">Expired</span>
        );
      },
      exportValue: (h) => isActive(h.tier) ? 'Active' : 'Expired',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 font-['Inter',sans-serif]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Subscription & Plans</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your subscription to unlock premium features and visibility.</p>
        </div>

        {/* Notifications */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <i className="lnr lnr-checkmark-circle text-emerald-600"></i>
            <p className="text-sm text-emerald-700 font-medium">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
            <i className="lnr lnr-warning text-red-600"></i>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Current Plan Summary */}
        {subscription && (
          <div className="mb-8 bg-[var(--accent-light)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center text-2xl">
                  {subscription.tier === 'free' || !subscription.tier ? '🌟' : '👑'}
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Current Plan</p>
                  <h3 className="text-xl font-semibold capitalize text-[var(--text-primary)]">
                    {subscription.tier?.replace(/_/g, ' ') || 'Free Plan'}
                  </h3>
                  {expiryDate && <p className="text-sm text-[var(--text-secondary)] mt-0.5">Expires on {expiryDate}</p>}
                </div>
              </div>
              {(!subscription.tier || subscription.tier === 'free') && (
                <span className="px-3 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)]">Basic visibility</span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {PLANS.map(plan => {
            const isPlanActive = isActive(plan.id);
            const isSelected = selectedPlan === plan.id;
            return (
              <div key={plan.id} className={`bg-[var(--bg-primary)] rounded-3xl overflow-hidden transition-all duration-300 relative ${isPlanActive ? 'ring-2 ring-[var(--accent-color)] shadow-sm' : 'border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} flex flex-col`}>
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">{plan.badge}</span>
                  </div>
                )}
                <div className="p-6 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{plan.title}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-semibold text-[var(--text-primary)] tracking-tight">{plan.price}</span>
                    <span className="text-sm text-[var(--text-secondary)] mb-1">{plan.period}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] mt-1.5 shrink-0"></span>
                        <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isPlanActive ? (
                    <div className="w-full py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm text-center flex items-center justify-center gap-2">
                      <i className="lnr lnr-checkmark-circle"></i> Active Plan
                    </div>
                  ) : isSelected ? (
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Payment Method</label>
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors">
                          <option value="ecocash">EcoCash</option>
                          <option value="onemoney">OneMoney</option>
                          <option value="innbucks">InnBucks</option>
                          <option value="card">Credit/Debit Card</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSubscribe(plan.id)} disabled={subscribing || loading} className="flex-1 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors flex items-center justify-center">
                          {subscribing ? <i className="lnr lnr-sync animate-spin"></i> : 'Pay Now'}
                        </button>
                        <button onClick={() => setSelectedPlan(null)} disabled={subscribing} className="py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors">
                          <i className="lnr lnr-cross"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedPlan(plan.id)} disabled={loading} className="w-full py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors">
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* History */}
        {!loading && subscription?.history?.length > 0 && (
          <DataTable
            columns={historyColumns}
            data={subscription.history}
            title="Billing History"
            subtitle="Record of your past subscription payments"
            exportFileName="billing-history"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
