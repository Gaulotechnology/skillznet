import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api";

export function DashboardCommLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("skillzlink_token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API}/admin/comm-logs`, { headers })
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch communication logs:", err);
        setError("Failed to load communication logs. Please try again later.");
        setLogs([]);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = logs.filter(l => (l.sentAt || l.sent_at || "").startsWith(today)).length;
  const unread = logs.filter(l => l.status === "Unread" || l.status === "unread").length;
  const activeThreads = new Set(logs.filter(l => l.from && l.to).map(l => [l.from, l.to].sort().join("-"))).size;

  const channelColor: Record<string, string> = { "In-App": "bg-[var(--accent-light)] text-blue-700", "in-app": "bg-[var(--accent-light)] text-blue-700", SMS: "bg-[var(--accent-light)] text-[var(--accent-color)]", sms: "bg-[var(--accent-light)] text-[var(--accent-color)]", Email: "bg-[var(--bg-secondary)] text-[var(--text-primary)]", email: "bg-[var(--bg-secondary)] text-[var(--text-primary)]" };
  const statusColor: Record<string, string> = { Read: "bg-green-50 text-green-700", read: "bg-green-50 text-green-700", Unread: "bg-yellow-50 text-yellow-700", unread: "bg-yellow-50 text-yellow-700", Delivered: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]", delivered: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]" };

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (row) => <span className="text-xs text-[var(--text-secondary)]">#{row.id}</span> },
    {
      key: "from", label: "From", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.from || "?").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.from || "-"}</span>
        </div>
      ),
    },
    {
      key: "to", label: "To", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.to || "?").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.to || "-"}</span>
        </div>
      ),
    },
    { key: "channel", label: "Channel", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${channelColor[row.channel] || ""}`}>{row.channel || "-"}</span> },
    { key: "subject", label: "Preview", render: (row) => <span className="text-[var(--text-secondary)] text-xs truncate max-w-[200px] block">{row.subject ? (row.subject.length > 45 ? row.subject.slice(0, 45) + "\u2026" : row.subject) : "-"}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status || "-"}</span> },
    { key: "sentAt", label: "Sent At", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.sentAt || row.sent_at || "-"}</span> },
  ];

  return (
    <DashboardLayout>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Communication Logs</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">All messages between users on the platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Messages</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{logs.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Today</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{todayCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Unread</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{unread}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Active Threads</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{activeThreads}</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} loading={loading} exportFileName="comm-logs" />
    </DashboardLayout>
  );
}
