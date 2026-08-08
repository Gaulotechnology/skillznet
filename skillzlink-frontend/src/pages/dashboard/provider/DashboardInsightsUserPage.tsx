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
      free: { label: "Free", bg: "bg-gray-100", color: "text-gray-700" },
      premium_monthly: { label: "Premium Monthly", bg: "bg-blue-50", color: "text-blue-700" },
      premium_quarterly: { label: "Premium Quarterly ⭐", bg: "bg-amber-50", color: "text-amber-700" },
    };
    return map[tier] || { label: tier, bg: "bg-gray-100", color: "text-gray-700" };
  };

  const currentTier = tierBadge(analytics?.subscription_tier || 'free');

  const historyColumns: Column<any>[] = [
    {
      key: "tier",
      label: "Plan",
      render: (h) => <span className="text-sm font-medium text-gray-900 capitalize">{h.tier?.replace(/_/g, ' ')}</span>,
      exportValue: (h) => h.tier?.replace(/_/g, ' ') || '',
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (h) => <span className="text-sm text-gray-500">{h.start_date ? new Date(h.start_date).toLocaleDateString() : '—'}</span>,
      exportValue: (h) => h.start_date ? new Date(h.start_date).toLocaleDateString() : '',
    },
    {
      key: "end_date",
      label: "End Date",
      render: (h) => <span className="text-sm text-gray-500">{h.end_date ? new Date(h.end_date).toLocaleDateString() : '—'}</span>,
      exportValue: (h) => h.end_date ? new Date(h.end_date).toLocaleDateString() : '',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Insights & Performance</h2>
          <p className="text-sm text-gray-500 mt-1">Track your profile views, contact reveals, and subscription details.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-eye"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">{analytics?.profile_views ?? 0}</h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Views</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-phone-handset"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">{analytics?.contact_reveals ?? 0}</h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Reveals</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-star"></i>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium mb-2 ${currentTier.bg} ${currentTier.color}`}>
                  {currentTier.label}
                </span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Plan</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xl mb-4">
                  <i className="lnr lnr-calendar-full"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {analytics?.expiry_date ? new Date(analytics.expiry_date).toLocaleDateString() : 'No Expiry'}
                </h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Expiry</span>
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
                <div className="rounded-lg bg-gray-900 p-8 relative overflow-hidden flex-1">
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-white mb-2">Ready for more leads?</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Upgrade your plan to unlock priority placement in search results and get featured on the homepage.
                    </p>
                    <div>
                      <Link to="/dashboard/subscription" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-colors">
                        <i className="lnr lnr-rocket"></i> View Upgrade Options
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Profile Completion Tips */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Completion Tips</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: 'lnr-picture', text: 'Add a professional photo' },
                      { icon: 'lnr-briefcase', text: 'Upload your CV/certificates' },
                      { icon: 'lnr-star', text: 'Add detailed skills' },
                      { icon: 'lnr-phone-handset', text: 'Enable contact opt-in' },
                    ].map((tip, i) => (
                      <Link to="/dashboard/profile" key={i} className="group flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                          <i className={`lnr ${tip.icon}`}></i>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tip.text}</span>
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
