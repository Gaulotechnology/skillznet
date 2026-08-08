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
    if (tier?.includes('quarterly')) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
    if (tier?.includes('monthly')) return { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
    return { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' };
  };

  const currentTier = tierStyle(analytics?.subscription_tier);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-8 md:p-10 relative overflow-hidden shadow-xl shadow-rose-200/50">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 mix-blend-overlay blur-2xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-32 w-40 h-40 rounded-full bg-white opacity-20 mix-blend-overlay blur-xl translate-y-1/3"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                    <i className="lnr lnr-briefcase"></i> Provider Dashboard
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Welcome back, {profile?.name || 'Professional'}! 👋</h2>
                  <p className="text-rose-50 text-lg max-w-xl mb-8 font-medium">
                    Here's an overview of your account performance and quick actions to manage your profile.
                  </p>
                  
                  <div className="flex gap-4">
                    <Link 
                      to="/dashboard/profile" 
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-rose-600 font-bold hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <i className="lnr lnr-pencil"></i> Edit Profile
                    </Link>
                    {!profile?.identity_verified && (
                      <Link 
                        to="/dashboard/profile" 
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/40 text-white font-bold hover:bg-slate-900/60 backdrop-blur-md transition-all active:scale-95 border border-white/10"
                      >
                        <i className="lnr lnr-shield"></i> Verify ID
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-slate-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  <i className="lnr lnr-eye"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-1">{analytics?.profile_views ?? 0}</h3>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Profile Views</span>
              </div>
              
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-slate-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  <i className="lnr lnr-phone-handset"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-1">{analytics?.contact_reveals ?? 0}</h3>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Contact Reveals</span>
              </div>
              
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-slate-200 transition-colors flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl ${currentTier.bg} ${currentTier.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                    <i className="lnr lnr-star"></i>
                  </div>
                  <h3 className={`text-xl font-black mb-1 capitalize ${currentTier.color}`}>
                    {analytics?.subscription_tier?.replace(/_/g, ' ') || 'Free'}
                  </h3>
                </div>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Current Plan</span>
              </div>
              
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-slate-200 transition-colors flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform ${profile?.identity_verified ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                    <i className={`lnr ${profile?.identity_verified ? 'lnr-checkmark-circle' : 'lnr-warning'}`}></i>
                  </div>
                  <h3 className={`text-xl font-black mb-1 ${profile?.identity_verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {profile?.identity_verified ? 'Verified' : 'Pending'}
                  </h3>
                </div>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">ID Verification</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage your professional presence</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { to: '/dashboard/profile', icon: 'lnr-user', label: 'Edit Profile', desc: 'Update bio & skills', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { to: '/dashboard/subscription', icon: 'lnr-star', label: 'Subscription', desc: 'Upgrade visibility', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { to: '/dashboard/insights', icon: 'lnr-chart-bars', label: 'Insights', desc: 'View analytics', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { to: '/dashboard/settings', icon: 'lnr-cog', label: 'Settings', desc: 'Account preferences', color: 'text-slate-600', bg: 'bg-slate-100' },
                  ].map((a, i) => (
                    <Link to={a.to} key={i} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group flex flex-col gap-4">
                      <div className={`w-12 h-12 rounded-xl ${a.bg} ${a.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                        <i className={`lnr ${a.icon}`}></i>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm mb-1">{a.label}</div>
                        <div className="text-xs text-slate-500 font-medium">{a.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Profile Completeness */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Profile Strength</h3>
                    <p className="text-slate-500 text-sm mt-1">Complete profiles get more views</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-emerald-500 flex items-center justify-center font-bold text-emerald-500 text-sm">
                    {Math.round(
                      ([
                        !!profile?.description, !!profile?.service_category, !!profile?.location,
                        !!profile?.image, !!profile?.identity_verified, !!profile?.contact_opt_in
                      ].filter(Boolean).length / 6) * 100
                    )}%
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  {[
                    { label: 'Description', done: !!profile?.description },
                    { label: 'Service Category', done: !!profile?.service_category },
                    { label: 'Location / Address', done: !!profile?.location },
                    { label: 'Profile Photo', done: !!profile?.image },
                    { label: 'ID Verified', done: !!profile?.identity_verified },
                    { label: 'Contact Opt-in', done: !!profile?.contact_opt_in },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      {item.done ? (
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-500">
                          <i className="lnr lnr-checkmark-circle"></i> Complete
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-500">
                          <i className="lnr lnr-warning"></i> Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <Link to="/dashboard/profile" className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm text-center hover:bg-slate-800 transition-colors active:scale-95">
                  Complete My Profile
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
