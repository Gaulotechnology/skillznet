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
      showToastMsg("Failed to load quotes", "error");
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
      showToastMsg(action === 'accept' ? "Quote accepted!" : "Quote rejected", "success");
      fetchQuotes();
    } catch {
      showToastMsg("Action failed", "error");
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
      <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-[13px] shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
        <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-lg`}></i>
        {toastMessage}
      </div>

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Manage Services</h2>
          <p className="text-slate-500 mt-1 font-medium">Review and manage proposals for your active service requests.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Received Proposals List */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Received Quotes</h3>
              
              {quotes.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                  <i className="lnr lnr-inbox text-5xl text-slate-300 mb-4 block"></i>
                  <h4 className="text-lg font-bold text-slate-600 mb-1">No Quotes Yet</h4>
                  <p className="text-sm text-slate-400">You haven't received any quotes for your services.</p>
                </div>
              ) : (
              <div className="space-y-4">
                {quotes.map((quote: any) => (
                  <div key={quote.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col sm:flex-row gap-6 relative group">
                    {/* Premium Badge */}
                    {quote.isPremium && (
                      <div className="absolute -top-3 -right-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-amber-400 text-white rounded-full shadow-lg shadow-amber-200">
                          <i className="lnr lnr-star font-bold text-sm"></i>
                        </span>
                      </div>
                    )}
                    
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                      {(quote.name || "Q").charAt(0)}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                      <Link to="/profile" className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors inline-block mb-1">
                        {quote.name}
                      </Link>
                      
                      <div className="flex items-center gap-1.5 text-sm mb-4">
                        <div className="flex text-amber-400">
                          <i className="lnr lnr-star font-bold"></i>
                        </div>
                        <span className="font-bold text-slate-700">{quote.rating}</span>
                        <span className="text-slate-400">({quote.reviews} Reviews)</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <i className="lnr lnr-envelope text-slate-400"></i> Cover Letter Included
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <i className="lnr lnr-paperclip text-slate-400"></i> {quote.attachments || 0} Attachments
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions & Price */}
                    <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
                      <div>
                        <div className="text-2xl font-black text-emerald-500">{quote.amount}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{quote.time}</div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleRespond(quote.id, 'accept')} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95 whitespace-nowrap">
                          Hire Now
                        </button>
                        <button onClick={() => handleRespond(quote.id, 'reject')} className="px-6 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all active:scale-95 whitespace-nowrap">
                          Reject
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
