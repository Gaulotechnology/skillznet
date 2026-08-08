import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

export function DashboardOngoingServiceSinglePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const fetchService = async () => {
    try {
      const data = await providerApi.getService(Number(id));
      setService(data.service);
      setHistory(data.history);
    } catch {
      showToastMsg("Failed to load service details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchService(); }, [id]);

  const showToastMsg = (msg: string, type: "success" | "error") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);
      await providerApi.sendServiceMessage(Number(id), { message });
      setMessage("");
      showToastMsg("Message sent!", "success");
      fetchService();
    } catch {
      showToastMsg("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-5xl mx-auto text-center py-20">
          <i className="lnr lnr-warning text-5xl text-slate-300 mb-4 block"></i>
          <h4 className="text-lg font-bold text-slate-600">Service not found</h4>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Toast */}
      <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-[13px] shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
        <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-lg`}></i>
        {toastMessage}
      </div>

      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/dashboard/ongoing" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <i className="lnr lnr-arrow-left font-bold"></i> Back to Services
              </Link>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Service Details</h2>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Status: {service.status || "Ongoing"}
          </div>
        </div>

        {/* Hired Provider Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 mb-8 relative overflow-hidden">
          {service.isPremium && (
            <div className="absolute top-0 right-0">
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-black uppercase tracking-wider rounded-bl-2xl shadow-sm">
                <i className="lnr lnr-star"></i> Premium Provider
              </span>
            </div>
          )}
          
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Hired Professional</h3>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shrink-0 flex items-center justify-center text-white font-black text-3xl shadow-inner">
              {(service.providerName || "P").charAt(0)}
            </div>
            
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer mb-2">
                {service.title}
              </h4>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <i className="lnr lnr-user text-indigo-400"></i> {service.providerName}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <div className="flex items-center gap-1 text-sm">
                  <div className="flex text-amber-400"><i className="lnr lnr-star font-bold"></i></div>
                  <span className="font-bold text-slate-700">{service.rating}</span>
                  <span className="text-slate-400">({service.reviews})</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <i className="lnr lnr-tag text-slate-400"></i> {service.rate}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <i className="lnr lnr-map-marker text-slate-400"></i> {service.location}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <i className="lnr lnr-paperclip text-slate-400"></i> {service.attachments || 0} Files Attached
                </div>
              </div>
            </div>
            
            <div className="md:text-right flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
              <div>
                <div className="text-2xl font-black text-emerald-500 mb-1">{service.amount}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{service.time}</div>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-indigo-600 border border-slate-200 font-bold text-xs hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                <i className="lnr lnr-envelope"></i> Cover Letter
              </button>
            </div>
          </div>
        </div>

        {/* Project History */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Project History & Chat</h3>
          
          <div className="space-y-6 mb-8">
            {history.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold shadow-sm ${item.user === service.providerName ? 'bg-indigo-500' : 'bg-rose-400'}`}>
                  {(item.avatar || item.user?.charAt(0) || "?")}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-sm">{item.user}</span>
                      <span className="text-xs font-medium text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {item.message}
                    </p>
                    
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="flex gap-2">
                        {item.attachments.map((file: string, i: number) => (
                          <a href="#!" key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                            <i className="lnr lnr-paperclip text-slate-400"></i> {file}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Reply Form */}
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Send a Message</h4>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
              <textarea 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-none p-4 text-sm text-slate-800 outline-none resize-none placeholder:text-slate-400"
                placeholder="Type your message here..."
              ></textarea>
              
              <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-slate-50" title="Attach Files">
                  <i className="lnr lnr-paperclip text-xl font-bold"></i>
                </button>
                <button type="button" onClick={handleSend} disabled={sending} className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors active:scale-95 flex items-center gap-2 disabled:opacity-50">
                  {sending ? "Sending..." : "Send"} <i className="lnr lnr-location"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
