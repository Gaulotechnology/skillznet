import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { getCurrentUser, seekerApi } from "../../../services/api";

export function DashboardSeekerOverviewPage() {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ saved_count: 0, reports_count: 0, bookings_count: 0 });
  const [savedPros, setSavedPros] = useState<any[]>([]);

  useEffect(() => {
    seekerApi.getOverview().then((data: any) => {
      setStats(data.stats);
      setSavedPros(data.recent_saved || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const quickStats = [
    { label: "Saved Professionals", value: stats.saved_count, icon: "lnr-heart", color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Reports Submitted", value: stats.reports_count, icon: "lnr-flag", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <SeekerLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 md:p-10 relative overflow-hidden shadow-xl shadow-indigo-200">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
            <div className="absolute bottom-0 right-32 -mb-20 w-40 h-40 rounded-full bg-white opacity-10 mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                <i className="lnr lnr-user"></i> Seeker Dashboard
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Welcome, {user?.name || 'Explorer'}! 👋</h2>
              <p className="text-indigo-100 text-lg max-w-xl mb-8 font-medium">
                Find and connect with trusted professionals near you. Manage your saved profiles and account settings from here.
              </p>
              <Link 
                to="/nearby-professionals" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Browse Professionals <i className="lnr lnr-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickStats.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 group hover:border-slate-200 transition-colors">
              <div className={`w-20 h-20 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
                <i className={`lnr ${s.icon}`}></i>
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-800 mb-1">{s.value}</h3>
                <span className="text-slate-500 font-bold text-sm tracking-wide uppercase">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Saved Professionals */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Saved Professionals</h3>
                <p className="text-slate-500 text-sm mt-1">Your bookmarked service providers</p>
              </div>
              <Link to="/nearby-professionals" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Browse More</Link>
            </div>
            
            <div>
              {savedPros.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <i className="lnr lnr-heart text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">No saved professionals</h4>
                  <p className="text-sm mb-6 max-w-xs mx-auto">You haven't bookmarked any service providers yet.</p>
                  <Link to="/nearby-professionals" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                    Find Professionals
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {savedPros.slice(0, 5).map((p: any, i: number) => (
                    <li key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                        <i className="lnr lnr-user text-xl text-slate-500"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{p.name}</div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
                          <i className="lnr lnr-briefcase opacity-70"></i> {p.service_category}
                        </div>
                      </div>
                      <Link 
                        to={`/professional-profile/${p.id}`} 
                        className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-100"
                      >
                        View Profile
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
              <p className="text-slate-500 text-sm mt-1">Shortcuts to common tasks</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { to: '/nearby-professionals', icon: 'lnr-magnifier', label: 'Find a Professional', desc: 'Search by category', color: 'text-blue-500', bg: 'bg-blue-50' },
                { to: '/dashboard/seeker/saved', icon: 'lnr-heart', label: 'Saved Pros', desc: 'Your favorites', color: 'text-rose-500', bg: 'bg-rose-50' },
                { to: '/dashboard/seeker/settings', icon: 'lnr-cog', label: 'Account Settings', desc: 'Update profile', color: 'text-slate-600', bg: 'bg-slate-100' },
                { to: '/dashboard/seeker/billing', icon: 'lnr-diamond', label: 'Billing', desc: 'Manage payments', color: 'text-emerald-500', bg: 'bg-emerald-50' },
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

        </div>
      </div>
    </SeekerLayout>
  );
}
