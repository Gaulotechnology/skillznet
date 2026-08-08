import { useState, useEffect } from 'react';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

export function DashboardCancelServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ongoing: 0, completed: 0, cancelled: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await providerApi.getServices('cancelled');
      setServices(data.services);
      setStats(data.stats);
    } catch {
      console.error("Failed to load cancelled services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const showToastMsg = (msg: string, type: "success" | "error") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRepost = async (id: number) => {
    try {
      await providerApi.repostService(id);
      showToastMsg("Service reposted successfully!", "success");
      fetchServices();
    } catch {
      showToastMsg("Failed to repost service", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await providerApi.deleteService(id);
      showToastMsg("Service deleted", "success");
      fetchServices();
    } catch {
      showToastMsg("Failed to delete service", "error");
    }
  };

  const statItems = [
    { value: stats.ongoing, label: "Ongoing Services", icon: "lnr-sync", color: "text-blue-500", bg: "bg-blue-50" },
    { value: stats.completed, label: "Completed Services", icon: "lnr-checkmark-circle", color: "text-emerald-500", bg: "bg-emerald-50" },
    { value: stats.cancelled, label: "Cancelled Services", icon: "lnr-cross-circle", color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <DashboardLayout>
      {/* Toast */}
      <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-[13px] shadow-lg transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
        <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-lg`}></i>
        {toastMessage}
      </div>

      <div className="p-6 md:p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Manage Services</h2>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Review your history of cancelled service requests.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <i className="lnr lnr-cross-circle text-rose-500"></i> Cancelled Services
              </h3>
            </div>
            
            {services.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-12 text-center">
                <i className="lnr lnr-cross-circle text-5xl text-[var(--text-secondary)] mb-4 block"></i>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">No Cancelled Services</h4>
                <p className="text-sm text-[var(--text-secondary)]">You don't have any cancelled services.</p>
              </div>
            ) : (
            <div className="space-y-4">
              {services.map((service: any) => (
                <div key={service.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 hover:border-[var(--accent-color)] transition-all flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                  
                  {/* Premium Badge */}
                  {service.isPremium && (
                    <div className="absolute top-0 right-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-sm">
                        <i className="lnr lnr-star"></i> Premium
                      </span>
                    </div>
                  )}
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] shrink-0 flex items-center justify-center text-[var(--text-secondary)] font-black text-2xl mt-2 md:mt-0 relative grayscale">
                    {(service.clientName || "S").charAt(0)}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs shadow-sm">
                      <i className="lnr lnr-cross font-bold"></i>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-[var(--text-secondary)]">
                      <i className="lnr lnr-user text-[var(--accent-color)]"></i> {service.clientName}
                    </div>
                    
                    <h4 className="text-xl font-bold text-[var(--text-primary)] hover:text-rose-600 transition-colors cursor-pointer mb-4 leading-tight pr-12 md:pr-0">
                      {service.title}
                    </h4>
                    
                    <div className="flex flex-wrap gap-3 text-sm font-medium text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                        <i className="lnr lnr-briefcase text-[var(--text-secondary)]"></i> {service.type}
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                        <i className="lnr lnr-clock text-[var(--text-secondary)]"></i> {service.duration}
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                        <i className="lnr lnr-map-marker text-[var(--text-secondary)]"></i> {service.location}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions & Status */}
                  <div className="md:text-right flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm bg-rose-50 px-4 py-2 rounded-xl">
                      <i className="lnr lnr-cross-circle"></i> Project Cancelled
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-auto">
                      <button onClick={() => handleRepost(service.id)} className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold text-sm text-center hover:bg-gray-200 transition-colors active:scale-95 whitespace-nowrap">
                        <i className="lnr lnr-sync"></i> Repost
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="w-10 md:w-auto px-0 md:px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-sm text-center hover:bg-rose-50 transition-colors active:scale-95 whitespace-nowrap flex items-center justify-center">
                        <i className="lnr lnr-trash"></i> <span className="hidden md:inline ml-1">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
            
            {/* Pagination */}
            {services.length > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-white border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-light)] flex items-center justify-center transition-all">
                <i className="lnr lnr-chevron-left"></i>
              </button>
              <button className="w-10 h-10 rounded-xl bg-[var(--accent-color)] text-white font-bold shadow-lg flex items-center justify-center transition-all">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-light)] flex items-center justify-center transition-all">
                <i className="lnr lnr-chevron-right"></i>
              </button>
            </div>
            )}
          </div>
          
          {/* Sidebar Stats */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {statItems.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--border-color)] flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl`}>
                  <i className={`lnr ${stat.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-0.5">{stat.value}</h3>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
            
            {/* Ad Placeholder */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] border-dashed p-6 text-center h-64 flex flex-col items-center justify-center text-[var(--text-secondary)]">
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
