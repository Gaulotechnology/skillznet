import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

export function DashboardQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ongoing: 0, completed: 0, cancelled: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await providerApi.getQuotes();
      setQuotes(data.quotes);
      setStats(data.stats);
    } catch {
      showToastMsg("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, []);

  const showToastMsg = (msg: string, type: "success" | "error") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRespond = async (id: number, action: 'accept' | 'reject') => {
    try {
      await providerApi.respondToQuote(id, action);
      showToastMsg(action === 'accept' ? "Request accepted!" : "Request declined", "success");
      fetchQuotes();
    } catch {
      showToastMsg("Action failed", "error");
    }
  };

  const statItems = [
    { value: stats.ongoing, label: "Ongoing", icon: "lnr-sync", color: "text-blue-500", bg: "bg-blue-50" },
    { value: stats.completed, label: "Completed", icon: "lnr-checkmark-circle", color: "text-emerald-500", bg: "bg-emerald-50" },
    { value: stats.cancelled, label: "Declined", icon: "lnr-cross-circle", color: "text-rose-500", bg: "bg-rose-50" },
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
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Service Requests</h2>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Review and respond to service requests from seekers.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Pending Requests</h3>
              
              {quotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[var(--border-color)] p-12 text-center">
                  <i className="lnr lnr-inbox text-5xl text-[var(--text-secondary)] mb-4 block"></i>
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">No Pending Requests</h4>
                  <p className="text-sm text-[var(--text-secondary)]">You have no service requests awaiting your response.</p>
                </div>
              ) : (
              <div className="space-y-4">
                {quotes.map((quote: any) => (
                  <div key={quote.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 hover:shadow-lg hover:border-[var(--accent-color)] transition-all flex flex-col sm:flex-row gap-6 relative group">
                    {/* Premium Badge */}
                    {quote.isPremium && (
                      <div className="absolute -top-3 -right-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-amber-400 text-white rounded-full shadow-lg">
                          <i className="lnr lnr-star font-bold text-sm"></i>
                        </span>
                      </div>
                    )}
                    
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent-color)] shrink-0 flex items-center justify-center text-white font-black text-2xl">
                      {(quote.name || "C").charAt(0)}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                      <span className="text-lg font-bold text-[var(--text-primary)] inline-block mb-1">
                        {quote.name}
                      </span>
                      
                      <div className="flex items-center gap-1.5 text-sm mb-4">
                        <i className="lnr lnr-user text-[var(--accent-color)]"></i>
                        <span className="text-[var(--text-secondary)] font-medium">Client</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg">
                          <i className="lnr lnr-clock text-[var(--text-secondary)]"></i> {quote.time || "Flexible"}
                        </div>
                        <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg">
                          <i className="lnr lnr-paperclip text-[var(--text-secondary)]"></i> {quote.attachments || 0} Files
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions & Price */}
                    <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-[var(--border-color)] pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
                      <div>
                        <div className="text-2xl font-black text-emerald-500">{quote.amount}</div>
                        <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Budget</div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleRespond(quote.id, 'accept')} className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm shadow-lg transition-all active:scale-95 whitespace-nowrap">
                          Accept
                        </button>
                        <button onClick={() => handleRespond(quote.id, 'reject')} className="px-6 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all active:scale-95 whitespace-nowrap">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
              
              {/* Pagination */}
              {quotes.length > 0 && (
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
