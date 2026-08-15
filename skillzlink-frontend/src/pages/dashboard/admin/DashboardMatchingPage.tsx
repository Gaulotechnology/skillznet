import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi } from "../../../services/api";

export function DashboardMatchingPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    adminApi.getMatchingRequests()
      .then((data) => {
        setRequests(data.requests || []);
      })
      .catch((err) => {
        console.error("Failed to fetch matching requests:", err);
        setError("Failed to load matching requests. Please try again later.");
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (req: any) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Cancelled" } : r));
    toast(`Request ${req.id} cancelled.`);
  };

  const pending = requests.filter(r => r.status === "Pending" || r.status === "pending").length;
  const today = new Date().toISOString().slice(0, 10);
  const matchedToday = requests.filter(r => (r.status === "Matched" || r.status === "matched") && (r.created_at || "").startsWith(today)).length;

  const statusColor: Record<string, string> = { Pending: "bg-yellow-50 text-yellow-700", pending: "bg-yellow-50 text-yellow-700", Matched: "bg-green-50 text-green-700", matched: "bg-green-50 text-green-700", Completed: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]", completed: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]", Cancelled: "bg-red-50 text-red-600", cancelled: "bg-red-50 text-red-600" };

  const columns: Column<any>[] = [
    { key: "id", label: "Request ID", render: (row) => <span className="text-xs font-mono text-[var(--text-primary)]">#{row.id}</span> },
    {
      key: "seeker", label: "Seeker", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.seeker || "S").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.seeker || "-"}</span>
        </div>
      ),
    },
    {
      key: "provider", label: "Provider", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.provider || "P").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.provider || "-"}</span>
        </div>
      ),
    },
    { key: "title", label: "Title", render: (row) => <span className="text-[var(--text-primary)]">{row.title || "-"}</span> },
    { key: "amount", label: "Amount", render: (row) => <span className="text-[var(--text-primary)] text-xs">{row.amount != null ? `R ${Number(row.amount).toLocaleString()}` : "-"}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status || "-"}</span> },
    { key: "created_at", label: "Created", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "-"}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">

        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
          <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
          {toastMessage}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">On-Demand Matching</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Service requests from seekers awaiting provider matching</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{requests.length}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{pending}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Matched Today</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{matchedToday}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Avg Match Time</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">2.4h</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          exportFileName="matching-requests"
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={() => toast("Match modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-green-600 rounded" title="Match"><i className="lnr lnr-sync text-sm"></i></button>
              <button onClick={() => toast("View details coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded" title="View"><i className="lnr lnr-eye text-sm"></i></button>
              {(row.status === "Pending" || row.status === "pending") && <button onClick={() => handleCancel(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-600 rounded" title="Cancel"><i className="lnr lnr-cross-circle text-sm"></i></button>}
            </div>
          )}
        />

      </div>
    </DashboardLayout>
  );
}
