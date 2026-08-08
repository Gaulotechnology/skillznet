import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

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
    const map: Record<string, { label: string; bg: string; color: string }> = {
      free: { label: "Free", bg: "bg-[var(--bg-secondary)]", color: "text-[var(--text-primary)]" },
      premium_monthly: { label: "Premium Monthly", bg: "bg-blue-50", color: "text-blue-700" },
      premium_quarterly: { label: "Premium Quarterly ⭐", bg: "bg-amber-50", color: "text-amber-700" },
    };
    return map[tier] || { label: tier, bg: "bg-[var(--bg-secondary)]", color: "text-[var(--text-primary)]" };
  };

  const currentTier = tierBadge(analytics?.subscription_tier || 'free');

  const historyColumns: Column<any>[] = [
    {
      key: "tier",
      label: "Plan",
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
  ];

  return (
    <DashboardLayout>
      <div className="p-8 font-['Inter',sans-serif]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Insights & Performance</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track your profile views, contact reveals, and subscription details.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-[3px] border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-eye"></i>
                </div>
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">{analytics?.profile_views ?? 0}</h3>
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Profile Views</span>
              </div>
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-phone-handset"></i>
                </div>
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">{analytics?.contact_reveals ?? 0}</h3>
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Contact Reveals</span>
              </div>
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-star"></i>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium mb-2 ${currentTier.bg} ${currentTier.color}`}>
                  {currentTier.label}
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Current Plan</span>
              </div>
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-calendar-full"></i>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {analytics?.expiry_date ? new Date(analytics.expiry_date).toLocaleDateString() : 'No Expiry'}
                </h3>
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Subscription Expiry</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Subscription History */}
              <DataTable
                columns={historyColumns}
                data={subscription?.history || []}
                title="Subscription History"
                subtitle="Your past and current billing periods"
                emptyIcon="lnr lnr-history"
                emptyMessage="No subscription history yet."
                exportFileName="subscription-history"
              />

              <div className="space-y-8 flex flex-col">
                {/* Upgrade CTA */}
                <div className="rounded-2xl bg-[var(--accent-light)] border border-[var(--border-color)] p-8 relative overflow-hidden flex-1">
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Ready for more leads?</h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-6">
                      Upgrade your plan to unlock priority placement in search results and get featured on the homepage.
                    </p>
                    <div>
                      <Link to="/dashboard/subscription" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-colors">
                        <i className="lnr lnr-rocket"></i> View Upgrade Options
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Profile Completion Tips */}
                <div className="border border-[var(--border-color)] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Profile Completion Tips</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: 'lnr-picture', text: 'Add a professional photo' },
                      { icon: 'lnr-briefcase', text: 'Upload your CV/certificates' },
                      { icon: 'lnr-star', text: 'Add detailed skills' },
                      { icon: 'lnr-phone-handset', text: 'Enable contact opt-in' },
                    ].map((tip, i) => (
                      <Link to="/dashboard/profile" key={i} className="group flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                          <i className={`lnr ${tip.icon}`}></i>
                        </div>
                        <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{tip.text}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
