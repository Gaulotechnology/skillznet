import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

export function DashboardOngoingServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ongoing: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await providerApi.getServices('ongoing');
        setServices(data.services);
        setStats(data.stats);
      } catch {
        console.error("Failed to load ongoing services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const statItems = [
    { value: stats.ongoing, label: "Ongoing Services", icon: "lnr-sync", color: "text-blue-500", bg: "bg-blue-50" },
    { value: stats.completed, label: "Completed Services", icon: "lnr-checkmark-circle", color: "text-emerald-500", bg: "bg-emerald-50" },
    { value: stats.cancelled, label: "Cancelled Services", icon: "lnr-cross-circle", color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Manage Services</h2>
          <p className="text-slate-500 mt-1 font-medium">Track your active ongoing service engagements.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Ongoing Services</h3>
            </div>
            
            {services.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                <i className="lnr lnr-hourglass text-5xl text-slate-300 mb-4 block"></i>
                <h4 className="text-lg font-bold text-slate-600 mb-1">No Ongoing Services</h4>
                <p className="text-sm text-slate-400">You don't have any active service engagements yet.</p>
              </div>
            ) : (
            <div className="space-y-4">
              {services.map((service: any) => (
                <div key={service.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-indigo-100 transition-all flex flex-col md:flex-row gap-6 relative group">
                  {/* Premium Badge */}
                  {service.isPremium && (
                    <div className="absolute top-0 right-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl rounded-tr-xl shadow-sm">
                        <i className="lnr lnr-star"></i> Premium
                      </span>
                    </div>
                  )}
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-inner mt-2 md:mt-0">
                    {(service.clientName || "S").charAt(0)}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-slate-500">
                      <i className="lnr lnr-user text-indigo-400"></i> {service.clientName}
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <i className="lnr lnr-checkmark-circle text-emerald-500"></i> Verified
                    </div>
                    
                    <h4 className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer mb-4 leading-tight pr-12 md:pr-0">
                      {service.title}
                    </h4>
                    
                    <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <i className="lnr lnr-briefcase text-slate-400"></i> {service.type}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <i className="lnr lnr-clock text-slate-400"></i> {service.duration}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <i className="lnr lnr-map-marker text-slate-400"></i> {service.location}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions & Status */}
                  <div className="md:text-right flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                    {service.hiredName && (
                    <div className="flex items-center gap-3 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 w-full md:w-auto">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                        {service.hiredName.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Hired</div>
                        <div className="text-xs font-bold text-slate-800">{service.hiredName}</div>
                      </div>
                    </div>
                    )}
                    
                    <Link to={`/dashboard/ongoing-single/${service.id}`} className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm text-center hover:bg-slate-800 shadow-md shadow-slate-200 transition-all active:scale-95 whitespace-nowrap mt-auto">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )}
            
            {/* Pagination */}
            {services.length > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 flex items-center justify-center transition-all">
                <i className="lnr lnr-chevron-left"></i>
              </button>
              <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200 flex items-center justify-center transition-all">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 flex items-center justify-center transition-all">
                <i className="lnr lnr-chevron-right"></i>
              </button>
            </div>
            )}
          </div>
          
          {/* Sidebar Stats */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {statItems.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl`}>
                  <i className={`lnr ${stat.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-0.5">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
            
            {/* Ad Placeholder */}
            <div className="bg-slate-100 rounded-3xl border border-slate-200 border-dashed p-6 text-center h-64 flex flex-col items-center justify-center text-slate-400">
              <i className="lnr lnr-bullhorn text-4xl mb-3"></i>
              <p className="font-medium text-sm">Advertisement Space</p>
              <p className="text-xs">255px x 255px</p>
            </div>
          </div>

        </div>
        )}
      </div>
    </DashboardLayout>
  );
}
