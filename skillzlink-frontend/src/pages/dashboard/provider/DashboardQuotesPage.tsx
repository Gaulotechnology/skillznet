import { useState, useEffect } from 'react';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi, type MatchingRequest } from "../../../services/api";

export function DashboardQuotesPage() {
  const [availableJobs, setAvailableJobs] = useState<MatchingRequest[]>([]);
  const [myClaimedJobs, setMyClaimedJobs] = useState<MatchingRequest[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToastMsg = (msg: string, type: "success" | "error") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quotesRes, jobsRes, myJobsRes] = await Promise.all([
        providerApi.getQuotes().catch(() => ({ quotes: [], stats: { ongoing: 0, completed: 0, cancelled: 0 } })),
        providerApi.getAvailableJobs().catch(() => ({ jobs: [] })),
        providerApi.getMyJobs().catch(() => ({ jobs: [] })),
      ]);

      setQuotes(quotesRes.quotes || []);
      setAvailableJobs(jobsRes.jobs || []);
      setMyClaimedJobs(myJobsRes.jobs || []);
    } catch {
      showToastMsg("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for live broadcasts every 8s
    const interval = setInterval(async () => {
      try {
        const [jobsRes, myJobsRes] = await Promise.all([
          providerApi.getAvailableJobs().catch(() => ({ jobs: [] })),
          providerApi.getMyJobs().catch(() => ({ jobs: [] })),
        ]);
        setAvailableJobs(jobsRes.jobs || []);
        setMyClaimedJobs(myJobsRes.jobs || []);
      } catch {}
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptJob = async (jobId: number) => {
    setAcceptingId(jobId);
    try {
      const res = await providerApi.acceptJob(jobId);
      showToastMsg(res.message || "🎉 Job accepted! Seeker details unlocked.", "success");
      fetchData();
    } catch (err: any) {
      showToastMsg(err.message || "Could not claim this job", "error");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleRespond = async (id: number, action: 'accept' | 'reject') => {
    try {
      await providerApi.respondToQuote(id, action);
      showToastMsg(action === 'accept' ? "Request accepted!" : "Request declined", "success");
      fetchData();
    } catch {
      showToastMsg("Action failed", "error");
    }
  };

  return (
    <DashboardLayout>
      {/* Toast */}
      <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-[13px] shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
        <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-lg`}></i>
        {toastMessage}
      </div>

      <div className="p-6 md:p-8 max-w-7xl mx-auto font-['Inter',sans-serif] space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">On-Demand Job Radar & Requests</h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Claim instant job offers matching your trade and manage client quote requests.</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-bold rounded-xl text-[var(--text-primary)] transition-all"
          >
            <i className={`lnr lnr-sync ${loading ? 'animate-spin' : ''}`}></i>
            <span>Refresh Radar</span>
          </button>
        </div>

        {/* 1. LIVE ON-DEMAND RADAR BROADCASTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-md shadow-amber-500/20">
                <i className="lnr lnr-radar"></i>
              </span>
              <span>Live On-Demand Job Offers</span>
            </h3>
            {availableJobs.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse">
                ⚡ {availableJobs.length} Available (First to accept claims job)
              </span>
            )}
          </div>

          {availableJobs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <i className="lnr lnr-radar text-4xl text-slate-400 block"></i>
              <p className="font-bold text-slate-800 text-sm">Radar is Listening for Nearby Jobs</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Whenever a client in your area requests your trade, an instant alert will appear here. Be the first to accept to claim it!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {availableJobs.map(job => (
                <div key={job.id} className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-lg shadow-amber-500/5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400 transition-all">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    ⚡ Live Broadcast
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {job.service_category}
                      </span>
                      {job.urgency === 'immediate' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          🚨 IMMEDIATE
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-black text-slate-900">{job.title}</h4>
                    {job.description && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{job.description}</p>
                    )}

                    <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <i className="lnr lnr-map-marker text-[var(--accent-color)]"></i>
                        <span>{job.address || job.city || "Harare"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="lnr lnr-user text-slate-400"></i>
                        <span>Client: {job.seeker_name || "Seeker"}</span>
                      </div>
                      {job.budget && (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <i className="lnr lnr-tag"></i>
                          <span>Budget: ${job.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Dispatched {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAcceptJob(job.id)}
                      disabled={acceptingId === job.id}
                      className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-600/25 flex items-center gap-2"
                    >
                      {acceptingId === job.id ? (
                        <><i className="lnr lnr-sync animate-spin"></i> Claiming...</>
                      ) : (
                        <><i className="lnr lnr-checkmark-circle"></i> Accept Job Now</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. MY CLAIMED ON-DEMAND JOBS */}
        {myClaimedJobs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-md">
                <i className="lnr lnr-briefcase"></i>
              </span>
              <span>My Claimed Jobs ({myClaimedJobs.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myClaimedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-3xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {job.service_category}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        ✓ Assigned to You
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{job.title}</h4>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Client Contact Details</p>
                      <p className="font-bold text-slate-900">{(job.seeker as any)?.user?.name || job.seeker_name || (typeof job.seeker === 'string' ? job.seeker : 'Client')}</p>
                      <p className="text-slate-600">📞 {(job.seeker as any)?.user?.phone_number || job.seeker_phone || "Phone Available"}</p>
                      <p className="text-slate-600">📍 {job.address || job.city}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex gap-3">
                    <a
                      href={`tel:${(job.seeker as any)?.user?.phone_number || job.seeker_phone}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold text-center hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      <i className="lnr lnr-phone"></i>
                      <span>Call Client</span>
                    </a>
                    <a
                      href={`https://wa.me/${((job.seeker as any)?.user?.phone_number || job.seeker_phone || '').replace(/\+/g, '')}?text=Hi%20${encodeURIComponent((job.seeker as any)?.user?.name || job.seeker_name || (typeof job.seeker === 'string' ? job.seeker : 'Client'))},%20I%20accepted%20your%20${encodeURIComponent(job.service_category)}%20request%20on%20SkillzNet.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <i className="lnr lnr-bubble"></i>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. STANDARD QUOTE REQUESTS */}
        {quotes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Direct Client Quote Inquiries</h3>
            <div className="space-y-4">
              {quotes.map((quote: any) => (
                <div key={quote.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)] text-white font-black text-xl flex items-center justify-center shrink-0">
                    {(quote.name || "C").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-slate-900 text-base">{quote.title}</h4>
                    <p className="text-xs text-slate-500">{quote.description}</p>
                    <p className="text-xs text-slate-400">Client: {quote.name} · {quote.location}</p>
                  </div>
                  <div className="flex sm:flex-col justify-end gap-2">
                    <button
                      onClick={() => handleRespond(quote.id, 'accept')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(quote.id, 'reject')}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
