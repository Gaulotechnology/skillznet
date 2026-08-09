import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api";

export function DashboardSmsLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("skillzlink_token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API}/admin/sms-logs`, { headers })
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch SMS logs:", err);
        setError("Failed to load SMS logs. Please try again later.");
        setLogs([]);
        setLoading(false);
      });
  }, []);

  const delivered = logs.filter(l => l.status === "Delivered" || l.status === "delivered").length;
  const failed = logs.filter(l => l.status === "Failed" || l.status === "failed").length;
  const monthlyCost = logs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  const typeColor: Record<string, string> = { OTP: "bg-[var(--accent-light)] text-[var(--accent-color)]", otp: "bg-[var(--accent-light)] text-[var(--accent-color)]", Notification: "bg-[var(--accent-light)] text-blue-700", notification: "bg-[var(--accent-light)] text-blue-700", Marketing: "bg-[var(--accent-light)] text-[var(--accent-color)]", marketing: "bg-[var(--accent-light)] text-[var(--accent-color)]" };
  const statusColor: Record<string, string> = { Delivered: "bg-green-50 text-green-700", delivered: "bg-green-50 text-green-700", Failed: "bg-red-50 text-red-600", failed: "bg-red-50 text-red-600", Pending: "bg-yellow-50 text-yellow-700", pending: "bg-yellow-50 text-yellow-700" };

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (row) => <span className="text-xs text-[var(--text-secondary)]">#{row.id}</span> },
    { key: "recipient", label: "Recipient", render: (row) => <span className="text-sm font-mono text-[var(--text-primary)]">{row.recipient || "-"}</span> },
    { key: "type", label: "Type", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeColor[row.type] || ""}`}>{row.type || "-"}</span> },
    { key: "message", label: "Message", render: (row) => <span className="text-[var(--text-secondary)] text-xs truncate max-w-[200px] block">{row.message ? (row.message.length > 50 ? row.message.slice(0, 50) + "\u2026" : row.message) : "-"}</span> },
    { key: "provider", label: "Provider", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.provider || "-"}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status || "-"}</span> },
    { key: "cost", label: "Cost", render: (row) => <span className="text-[var(--text-primary)]">${(Number(row.cost) || 0).toFixed(2)}</span> },
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
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">SMS Logs</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">All SMS messages sent from the platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Sent</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{logs.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Delivered Rate</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{logs.length ? Math.round((delivered / logs.length) * 100) : 0}%</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Failed</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{failed}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Monthly Cost</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">${monthlyCost.toFixed(2)}</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} loading={loading} exportFileName="sms-logs" />
    </DashboardLayout>
  );
}
