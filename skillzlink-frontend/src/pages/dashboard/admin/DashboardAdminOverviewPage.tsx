import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

export function DashboardAdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res))
      .catch(err => console.error("Failed to load stats", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Admin Overview</h2>
            <p className="text-slate-500 font-medium">Monitor the health and activity of the SkillzLink platform.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2">
              <i className="lnr lnr-download"></i> Export Report
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin mb-6 shadow-lg shadow-rose-500/20" />
            <p className="text-slate-500 font-bold animate-pulse">Syncing data...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-indigo-500/30">
                    <i className="lnr lnr-users"></i>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{stats?.total_users || 0}</h3>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-blue-500/30">
                    <i className="lnr lnr-briefcase"></i>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{stats?.total_providers || 0}</h3>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Professionals</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-emerald-500/30">
                    <i className="lnr lnr-magnifier"></i>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{stats?.total_seekers || 0}</h3>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Seekers</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-rose-500/30">
                    <i className="lnr lnr-diamond"></i>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1">${stats?.total_revenue || 0}</h3>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                </div>
              </div>

            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Recent Signups */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden flex flex-col h-full">
                  <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Recent Signups</h2>
                      <p className="text-sm text-slate-500 mt-1">Latest users to join the platform.</p>
                    </div>
                    <Link to="/dashboard/admin/users" className="text-rose-500 hover:text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">
                      View All
                    </Link>
                  </div>
                  <div className="flex-1 p-2">
                    {stats?.recent_users?.length > 0 ? (
                      <ul className="space-y-1">
                        {stats.recent_users.map((u: any) => (
                          <li key={u.id} className="p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                              {u.avatar ? (
                                <img src={u.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition-transform" />
                              ) : (
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              )}
                              <div>
                                <h4 className="font-bold text-slate-800">{u.name}</h4>
                                <span className="text-sm text-slate-500">{u.email}</span>
                              </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                              u.role === 'provider' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-100/50' :
                              u.role === 'admin' ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100/50' :
                              'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-100/50'
                            }`}>
                              {u.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                          <i className="lnr lnr-users text-3xl"></i>
                        </div>
                        <p className="text-slate-500 font-medium">No recent signups found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden h-full flex flex-col">
                  <div className="p-6 md:p-8 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Quick Links</h2>
                    <p className="text-sm text-slate-500 mt-1">Jump to management sections.</p>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4 flex-1">
                    <Link to="/dashboard/admin/users" className="p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col items-center justify-center gap-4 text-center transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                        <i className="lnr lnr-users text-2xl text-indigo-500 group-hover:text-white transition-colors"></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Users</span>
                    </Link>
                    
                    <Link to="/dashboard/admin/professionals" className="p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col items-center justify-center gap-4 text-center transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                        <i className="lnr lnr-briefcase text-2xl text-blue-500 group-hover:text-white transition-colors"></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Professionals</span>
                    </Link>

                    <Link to="/dashboard/admin/categories" className="p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col items-center justify-center gap-4 text-center transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <i className="lnr lnr-list text-2xl text-emerald-500 group-hover:text-white transition-colors"></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Categories</span>
                    </Link>

                    <Link to="/dashboard/admin/packages" className="p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 flex flex-col items-center justify-center gap-4 text-center transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                        <i className="lnr lnr-store text-2xl text-rose-500 group-hover:text-white transition-colors"></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Packages</span>
                    </Link>
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
