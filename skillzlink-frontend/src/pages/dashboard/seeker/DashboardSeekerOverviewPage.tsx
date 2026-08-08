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
    { label: "Saved Professionals", value: stats.saved_count, icon: "lnr-heart" },
    { label: "Reports Submitted", value: stats.reports_count, icon: "lnr-flag" },
  ];

  if (loading) {
    return (
      <SeekerLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto font-['Inter',sans-serif]">
        
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="rounded-2xl bg-[var(--accent-light)] p-8 md:p-10 relative overflow-hidden border border-[var(--border-color)]">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-bold uppercase tracking-wider mb-4">
                <i className="lnr lnr-user"></i> Seeker Dashboard
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-2">Welcome, {user?.name || 'Explorer'}! 👋</h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl mb-8 font-medium">
                Find and connect with trusted professionals near you. Manage your saved profiles and account settings from here.
              </p>
              <Link 
                to="/nearby-professionals" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all active:scale-95"
              >
                Browse Professionals <i className="lnr lnr-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickStats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--border-color)] flex items-center gap-6 group hover:border-[var(--accent-color)]/30 transition-colors">
              <div className="w-20 h-20 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                <i className={`lnr ${s.icon}`}></i>
              </div>
              <div>
                <h3 className="text-4xl font-black text-[var(--text-primary)] mb-1">{s.value}</h3>
                <span className="text-[var(--text-secondary)] font-bold text-sm tracking-wide uppercase">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Saved Professionals */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Saved Professionals</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Your bookmarked service providers</p>
              </div>
              <Link to="/nearby-professionals" className="text-sm font-bold text-[var(--accent-color)] hover:text-[var(--accent-hover)]">Browse More</Link>
            </div>
            
            <div>
              {savedPros.length === 0 ? (
                <div className="py-12 text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-2xl border border-dashed border-[var(--border-color)]">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
                    <i className="lnr lnr-heart text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">No saved professionals</h4>
                  <p className="text-sm mb-6 max-w-xs mx-auto">You haven't bookmarked any service providers yet.</p>
                  <Link to="/nearby-professionals" className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">
                    Find Professionals
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {savedPros.slice(0, 5).map((p: any, i: number) => (
                    <li key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                        <i className="lnr lnr-user text-xl text-[var(--text-secondary)]"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[var(--text-primary)] truncate">{p.name}</div>
                        <div className="text-xs text-[var(--text-secondary)] font-medium truncate mt-0.5 flex items-center gap-1.5">
                          <i className="lnr lnr-briefcase opacity-70"></i> {p.service_category}
                        </div>
                      </div>
                      <Link 
                        to={`/professional-profile/${p.id}`} 
                        className="px-4 py-2 rounded-lg bg-[var(--accent-light)] text-[var(--accent-color)] font-bold text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--accent-color)] hover:text-white"
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
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--border-color)]">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Quick Actions</h3>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Shortcuts to common tasks</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { to: '/nearby-professionals', icon: 'lnr-magnifier', label: 'Find a Professional', desc: 'Search by category' },
                { to: '/dashboard/seeker/saved', icon: 'lnr-heart', label: 'Saved Pros', desc: 'Your favorites' },
                { to: '/dashboard/seeker/settings', icon: 'lnr-cog', label: 'Account Settings', desc: 'Update profile' },
                { to: '/dashboard/seeker/billing', icon: 'lnr-diamond', label: 'Billing', desc: 'Manage payments' },
              ].map((a, i) => (
                <Link to={a.to} key={i} className="p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-color)]/30 hover:bg-[var(--accent-light)] transition-all group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <i className={`lnr ${a.icon}`}></i>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)] text-sm mb-1">{a.label}</div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">{a.desc}</div>
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
