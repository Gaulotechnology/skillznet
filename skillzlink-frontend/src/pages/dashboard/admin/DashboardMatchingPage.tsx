import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi, publicApi, type MatchingRequest, type PublicProvider } from "../../../services/api";

export function DashboardMatchingPage() {
  const [requests, setRequests] = useState<MatchingRequest[]>([]);
  const [stats, setStats] = useState<{ total_requests: number; broadcasting: number; matched_today: number; avg_match_time: string }>({
    total_requests: 0,
    broadcasting: 0,
    matched_today: 0,
    avg_match_time: "42s",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "broadcasting" | "matched" | "completed" | "cancelled">("all");

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<MatchingRequest | null>(null);
  const [assigningRequest, setAssigningRequest] = useState<MatchingRequest | null>(null);
  const [availableProviders, setAvailableProviders] = useState<PublicProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number | "">("");
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const fetchMatchingData = () => {
    setLoading(true);
    adminApi.getMatchingRequests()
      .then((data) => {
        setRequests(data.requests || []);
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch matching requests:", err);
        setError("Failed to load matching requests. Please try again later.");
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatchingData();
    // Auto refresh every 15s to maintain live radar
    const interval = setInterval(fetchMatchingData, 15000);
    return () => clearInterval(interval);
  }, []);

  const openAssignModal = async (req: MatchingRequest) => {
    setAssigningRequest(req);
    setSelectedProviderId("");
    try {
      const res = await publicApi.listProviders({ category: req.service_category });
      setAvailableProviders(res.data || []);
    } catch {
      setAvailableProviders([]);
    }
  };

  const handleAssignSubmit = async () => {
    if (!assigningRequest || !selectedProviderId) return;
    setActionLoading(true);
    try {
      await adminApi.assignMatchingProvider(assigningRequest.id, Number(selectedProviderId));
      toast(`Successfully assigned provider to Request #${assigningRequest.id}`);
      setAssigningRequest(null);
      fetchMatchingData();
    } catch (err: any) {
      toast(err.message || "Failed to assign provider", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRebroadcast = async (req: MatchingRequest) => {
    try {
      await adminApi.rebroadcastMatchingRequest(req.id);
      toast(`Request #${req.id} rebroadcasted to nearby ${req.service_category} providers!`);
      fetchMatchingData();
    } catch (err: any) {
      toast(err.message || "Failed to rebroadcast", "error");
    }
  };

  const handleCancel = async (req: MatchingRequest) => {
    if (!confirm(`Are you sure you want to cancel Request #${req.id}?`)) return;
    try {
      await adminApi.cancelAdminMatchingRequest(req.id);
      toast(`Request #${req.id} cancelled.`);
      fetchMatchingData();
    } catch (err: any) {
      toast(err.message || "Failed to cancel request", "error");
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === "all") return true;
    return r.status.toLowerCase() === activeTab;
  });

  const columns: Column<MatchingRequest>[] = [
    {
      key: "id",
      label: "Request ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">#{row.id}</span>
          {row.status === "broadcasting" && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: "service_category",
      label: "Service & Job",
      render: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              row.service_category?.toLowerCase() === 'cleaning' ? 'bg-emerald-50 text-emerald-700' :
              row.service_category?.toLowerCase() === 'plumbing' ? 'bg-blue-50 text-blue-700' :
              row.service_category?.toLowerCase() === 'electrical' ? 'bg-amber-50 text-amber-700' :
              'bg-purple-50 text-purple-700'
            }`}>
              {row.service_category}
            </span>
            {row.urgency === 'immediate' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">URGENT</span>
            )}
          </div>
          <p className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate max-w-[200px]" title={row.title}>
            {row.title}
          </p>
        </div>
      ),
    },
    {
      key: "seeker",
      label: "Seeker & Location",
      render: (row) => (
        <div>
          <div className="text-xs font-bold text-[var(--text-primary)]">{row.seeker || "Seeker"}</div>
          <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
            <i className="lnr lnr-map-marker text-[var(--accent-color)]"></i>
            <span>{row.city || "Harare"}{row.address ? ` · ${row.address}` : ""}</span>
          </div>
        </div>
      ),
    },
    {
      key: "broadcast_count",
      label: "Radar Reach",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <i className="lnr lnr-bullhorn text-indigo-500"></i>
          <span><strong>{row.broadcast_count || 0}</strong> notified</span>
        </div>
      ),
    },
    {
      key: "provider",
      label: "Claimed By / Status",
      render: (row) => {
        if (row.provider) {
          return (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                {row.provider.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{row.provider}</div>
                {row.time_to_match && (
                  <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <i className="lnr lnr-flash"></i> Accepted in {row.time_to_match}
                  </div>
                )}
              </div>
            </div>
          );
        }
        if (row.status === "broadcasting") {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Awaiting First Acceptance
            </span>
          );
        }
        return <span className="text-xs text-[var(--text-secondary)]">Unassigned</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const colors: Record<string, string> = {
          broadcasting: "bg-amber-50 text-amber-700 border-amber-200",
          matched: "bg-emerald-50 text-emerald-700 border-emerald-200",
          in_progress: "bg-blue-50 text-blue-700 border-blue-200",
          completed: "bg-slate-100 text-slate-700 border-slate-200",
          cancelled: "bg-red-50 text-red-700 border-red-200",
        };
        const st = (row.status || "").toLowerCase();
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${colors[st] || "bg-slate-100 text-slate-700"}`}>
            {st === "broadcasting" ? "Live Broadcast" : st}
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "Requested",
      render: (row) => (
        <span className="text-[var(--text-secondary)] text-xs">
          {new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 relative max-w-7xl mx-auto space-y-6">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"} text-base`}></i>
          {toastMessage}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center gap-2">
            <i className="lnr lnr-warning text-base"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-md shadow-[var(--accent-color)]/20">
                <i className="lnr lnr-radar text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">On-Demand Matching</h1>
                <p className="text-xs text-[var(--text-secondary)]">Uber-style instant dispatch system connecting seekers with first-accepting verified providers</p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchMatchingData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-xs font-semibold transition-all"
          >
            <i className={`lnr lnr-sync ${loading ? 'animate-spin' : ''}`}></i>
            <span>Refresh Radar</span>
          </button>
        </div>

        {/* Live Radar KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Live Broadcasts</p>
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
            </div>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.broadcasting}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Active radar searches</p>
          </div>

          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Matched Today</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.matched_today}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Jobs claimed & dispatched</p>
          </div>

          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Avg Match Speed</p>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">{stats.avg_match_time}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">First-to-accept response time</p>
          </div>

          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">{requests.length}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">All-time on-demand requests</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3 overflow-x-auto">
          {[
            { key: "all", label: "All Requests", count: requests.length },
            { key: "broadcasting", label: "Live Broadcasting", count: requests.filter(r => r.status === "broadcasting").length },
            { key: "matched", label: "Matched", count: requests.filter(r => r.status === "matched").length },
            { key: "completed", label: "Completed", count: requests.filter(r => r.status === "completed").length },
            { key: "cancelled", label: "Cancelled", count: requests.filter(r => r.status === "cancelled").length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-[var(--accent-color)] text-white shadow-sm"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-white text-[var(--text-secondary)]"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredRequests}
          loading={loading}
          exportFileName="matching-requests"
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedRequest(row)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                title="View Full Radar Details"
              >
                <i className="lnr lnr-eye text-sm font-bold"></i>
              </button>

              {row.status === "broadcasting" && (
                <>
                  <button
                    onClick={() => openAssignModal(row)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Manual Provider Assignment"
                  >
                    <i className="lnr lnr-user text-sm font-bold"></i>
                  </button>
                  <button
                    onClick={() => handleRebroadcast(row)}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Re-broadcast to Candidates"
                  >
                    <i className="lnr lnr-bullhorn text-sm font-bold"></i>
                  </button>
                  <button
                    onClick={() => handleCancel(row)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Request"
                  >
                    <i className="lnr lnr-cross-circle text-sm font-bold"></i>
                  </button>
                </>
              )}
            </div>
          )}
        />

        {/* Modal: Radar Details */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--accent-color)]">Request #{selectedRequest.id}</span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{selectedRequest.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <i className="lnr lnr-cross text-sm font-bold"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Seeker Details</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedRequest.seeker}</p>
                  <p className="text-xs text-slate-600 mt-1">📞 {selectedRequest.seeker_phone || "Hidden"}</p>
                  <p className="text-xs text-slate-600 mt-0.5">📍 {selectedRequest.address || selectedRequest.city}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Matched Professional</span>
                  {selectedRequest.provider ? (
                    <div>
                      <p className="font-bold text-emerald-800 text-sm">{selectedRequest.provider}</p>
                      <p className="text-xs text-slate-600 mt-1">📞 {selectedRequest.provider_phone || "N/A"}</p>
                      {selectedRequest.time_to_match && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1">⚡ Claimed in {selectedRequest.time_to_match}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700 font-medium">No provider has accepted yet. System is broadcasting to {selectedRequest.broadcast_count || 0} candidate providers.</p>
                  )}
                </div>
              </div>

              {selectedRequest.description && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Job Description</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedRequest.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-semibold text-xs"
                >
                  Close
                </button>
                {selectedRequest.status === "broadcasting" && (
                  <button
                    onClick={() => {
                      const req = selectedRequest;
                      setSelectedRequest(null);
                      openAssignModal(req);
                    }}
                    className="px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-xl font-semibold text-xs hover:bg-[var(--accent-hover)]"
                  >
                    Assign Provider Manually
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Manual Provider Assignment */}
        {assigningRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Assign Professional</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Request #{assigningRequest.id} · {assigningRequest.service_category}</p>
                </div>
                <button
                  onClick={() => setAssigningRequest(null)}
                  className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <i className="lnr lnr-cross text-sm font-bold"></i>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Select Verified {assigningRequest.service_category}
                </label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                >
                  <option value="">-- Choose a professional --</option>
                  {availableProviders.map(pro => (
                    <option key={pro.id} value={pro.id}>
                      {pro.name} ({pro.location || "Zimbabwe"}) - Rating: {pro.rating}★
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={() => setAssigningRequest(null)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignSubmit}
                  disabled={!selectedProviderId || actionLoading}
                  className="px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-xl font-semibold text-xs hover:bg-[var(--accent-hover)] disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <><i className="lnr lnr-sync animate-spin"></i> Assigning...</>
                  ) : (
                    <><i className="lnr lnr-checkmark-circle"></i> Confirm Assignment</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
