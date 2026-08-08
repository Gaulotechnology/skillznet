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
          <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-5xl mx-auto text-center py-20">
          <i className="lnr lnr-warning text-5xl text-[var(--text-secondary)] mb-4 block"></i>
          <h4 className="text-lg font-bold text-[var(--text-primary)]">Service not found</h4>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Toast */}
      <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-[13px] shadow-lg transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
        <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-lg`}></i>
        {toastMessage}
      </div>

      <div className="p-6 md:p-8 max-w-5xl mx-auto font-['Inter',sans-serif]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/dashboard/ongoing" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                <i className="lnr lnr-arrow-left font-bold"></i> Back to Services
              </Link>
            </div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Service Details</h2>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Status: {service.status || "Ongoing"}
          </div>
        </div>

        {/* Hired Provider Card */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 md:p-8 mb-8 relative overflow-hidden">
          {service.isPremium && (
            <div className="absolute top-0 right-0">
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-bl-2xl shadow-sm">
                <i className="lnr lnr-star"></i> Premium Provider
              </span>
            </div>
          )}
          
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-6">Hired Professional</h3>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="w-20 h-20 rounded-2xl bg-[var(--accent-color)] shrink-0 flex items-center justify-center text-white font-black text-3xl">
              {(service.providerName || "P").charAt(0)}
            </div>
            
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors cursor-pointer mb-2">
                {service.title}
              </h4>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
                  <i className="lnr lnr-user text-[var(--accent-color)]"></i> {service.providerName}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--border-color)]"></span>
                <div className="flex items-center gap-1 text-sm">
                  <div className="flex text-amber-400"><i className="lnr lnr-star font-bold"></i></div>
                  <span className="font-bold text-[var(--text-primary)]">{service.rating}</span>
                  <span className="text-[var(--text-secondary)]">({service.reviews})</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 text-sm font-medium text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                  <i className="lnr lnr-tag text-[var(--text-secondary)]"></i> {service.rate}
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                  <i className="lnr lnr-map-marker text-[var(--text-secondary)]"></i> {service.location}
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                  <i className="lnr lnr-paperclip text-[var(--text-secondary)]"></i> {service.attachments || 0} Files Attached
                </div>
              </div>
            </div>
            
            <div className="md:text-right flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-4 md:pt-0 md:pl-6 min-w-[140px]">
              <div>
                <div className="text-2xl font-black text-emerald-500 mb-1">{service.amount}</div>
                <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{service.time}</div>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--accent-color)] border border-[var(--border-color)] font-bold text-xs hover:bg-[var(--accent-light)] hover:border-[var(--accent-color)] transition-colors">
                <i className="lnr lnr-envelope"></i> Cover Letter
              </button>
            </div>
          </div>
        </div>

        {/* Project History */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 md:p-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Project History & Chat</h3>
          
          <div className="space-y-6 mb-8">
            {history.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold shadow-sm ${item.user === service.providerName ? 'bg-[var(--accent-color)]' : 'bg-rose-400'}`}>
                  {(item.avatar || item.user?.charAt(0) || "?")}
                </div>
                <div className="flex-1">
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-color)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary)] text-sm">{item.user}</span>
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{item.date}</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3">
                      {item.message}
                    </p>
                    
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="flex gap-2">
                        {item.attachments.map((file: string, i: number) => (
                          <a href="#!" key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors">
                            <i className="lnr lnr-paperclip text-[var(--text-secondary)]"></i> {file}
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
          <div className="pt-6 border-t border-[var(--border-color)]">
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Send a Message</h4>
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden focus-within:border-[var(--accent-color)] focus-within:ring-4 focus-within:ring-[var(--accent-light)] transition-all">
              <textarea 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-none p-4 text-sm text-[var(--text-primary)] outline-none resize-none placeholder:text-[var(--text-secondary)]"
                placeholder="Type your message here..."
              ></textarea>
              
              <div className="bg-white px-4 py-3 border-t border-[var(--border-color)] flex items-center justify-between">
                <button type="button" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-secondary)]" title="Attach Files">
                  <i className="lnr lnr-paperclip text-xl font-bold"></i>
                </button>
                <button type="button" onClick={handleSend} disabled={sending} className="px-6 py-2 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm transition-colors active:scale-95 flex items-center gap-2 disabled:opacity-50">
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
