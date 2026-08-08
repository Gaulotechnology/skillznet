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

  const tierStyle = (tier: string) => {
    if (tier?.includes('quarterly')) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (tier?.includes('monthly')) return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    return { color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-secondary)]', border: 'border-[var(--border-color)]' };
  };

  const currentTier = tierStyle(analytics?.subscription_tier);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto font-['Inter',sans-serif]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-secondary)] font-medium">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Welcome Header */}
            <div>
              <div className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] p-8 md:p-12 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-light)] rounded-bl-[100px] opacity-50 -z-0 translate-x-12 -translate-y-12"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider mb-6 border border-[var(--border-color)]">
                    <i className="lnr lnr-briefcase text-[var(--accent-color)]"></i> Provider Dashboard
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">Welcome back, {profile?.name || 'Professional'}! 👋</h2>
                  <p className="text-[var(--text-secondary)] text-lg max-w-xl mb-10 font-medium">
                    Here's an overview of your account performance and quick actions to manage your profile.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/dashboard/profile" 
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-all active:scale-95"
                    >
                      <i className="lnr lnr-pencil"></i> Edit Profile
                    </Link>
                    {!profile?.identity_verified && (
                      <Link 
                        to="/dashboard/profile" 
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-secondary)] transition-all active:scale-95"
                      >
                        <i className="lnr lnr-shield"></i> Verify ID
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border-color)] group hover:border-[var(--accent-color)] transition-colors shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <i className="lnr lnr-eye"></i>
                </div>
                <h3 className="text-4xl font-semibold text-[var(--text-primary)] mb-2 tracking-tight">{analytics?.profile_views ?? 0}</h3>
                <span className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wider">Profile Views</span>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border-color)] group hover:border-[var(--accent-color)] transition-colors shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <i className="lnr lnr-phone-handset"></i>
                </div>
                <h3 className="text-4xl font-semibold text-[var(--text-primary)] mb-2 tracking-tight">{analytics?.contact_reveals ?? 0}</h3>
                <span className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wider">Contact Reveals</span>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border-color)] group hover:border-[var(--accent-color)] transition-colors flex flex-col justify-between shadow-sm">
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${currentTier.bg} ${currentTier.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <i className="lnr lnr-star"></i>
                  </div>
                  <h3 className={`text-2xl font-semibold mb-2 tracking-tight capitalize ${currentTier.color}`}>
                    {analytics?.subscription_tier?.replace(/_/g, ' ') || 'Free'}
                  </h3>
                </div>
                <span className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wider">Current Plan</span>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border-color)] group hover:border-[var(--accent-color)] transition-colors flex flex-col justify-between shadow-sm">
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform ${profile?.identity_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <i className={`lnr ${profile?.identity_verified ? 'lnr-checkmark-circle' : 'lnr-warning'}`}></i>
                  </div>
                  <h3 className={`text-2xl font-semibold mb-2 tracking-tight ${profile?.identity_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {profile?.identity_verified ? 'Verified' : 'Pending'}
                  </h3>
                </div>
                <span className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wider">ID Verification</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-[var(--bg-primary)] rounded-3xl p-8 md:p-10 border border-[var(--border-color)] shadow-sm">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Quick Actions</h3>
                  <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage your professional presence</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { to: '/dashboard/profile', icon: 'lnr-user', label: 'Edit Profile', desc: 'Update bio & skills', color: 'text-[var(--accent-color)]', bg: 'bg-[var(--accent-light)]' },
                    { to: '/dashboard/subscription', icon: 'lnr-star', label: 'Subscription', desc: 'Upgrade visibility', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { to: '/dashboard/insights', icon: 'lnr-chart-bars', label: 'Insights', desc: 'View analytics', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { to: '/dashboard/settings', icon: 'lnr-cog', label: 'Settings', desc: 'Account preferences', color: 'text-[var(--text-primary)]', bg: 'bg-[var(--bg-secondary)]' },
                  ].map((a, i) => (
                    <Link to={a.to} key={i} className="p-6 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-all group flex flex-col gap-4 shadow-sm hover:shadow-md">
                      <div className={`w-12 h-12 rounded-xl ${a.bg} ${a.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                        <i className={`lnr ${a.icon}`}></i>
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-[15px] mb-1">{a.label}</div>
                        <div className="text-xs text-[var(--text-secondary)] font-medium">{a.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Profile Completeness */}
              <div className="bg-[var(--bg-primary)] rounded-3xl p-8 md:p-10 border border-[var(--border-color)] flex flex-col shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Profile Strength</h3>
                    <p className="text-[var(--text-secondary)] mt-1 font-medium">Complete profiles get more views</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--border-color)] border-t-[var(--accent-color)] flex items-center justify-center font-bold text-[var(--accent-color)] text-lg">
                    {Math.round(
                      ([
                        !!profile?.description, !!profile?.service_category, !!profile?.location,
                        !!profile?.image, !!profile?.identity_verified, !!profile?.contact_opt_in
                      ].filter(Boolean).length / 6) * 100
                    )}%
                  </div>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                  {[
                    { label: 'Description', done: !!profile?.description },
                    { label: 'Service Category', done: !!profile?.service_category },
                    { label: 'Location / Address', done: !!profile?.location },
                    { label: 'Profile Photo', done: !!profile?.image },
                    { label: 'ID Verified', done: !!profile?.identity_verified },
                    { label: 'Contact Opt-in', done: !!profile?.contact_opt_in },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <span className="text-[15px] font-semibold text-[var(--text-primary)]">{item.label}</span>
                      {item.done ? (
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                          <i className="lnr lnr-checkmark-circle text-base"></i> Complete
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                          <i className="lnr lnr-warning text-base"></i> Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <Link to="/dashboard/profile" className="w-full py-4 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm text-center transition-colors active:scale-95 block shadow-sm">
                  Complete My Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
