import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const STATUS_COLORS: Record<string, string> = {
  "2": "bg-emerald-50 text-emerald-700",
  "3": "bg-[var(--accent-light)] text-blue-700",
  "4": "bg-amber-50 text-amber-700",
  "5": "bg-[var(--accent-light)] text-rose-700",
};

function getStatusColor(code: number) {
  const first = String(code)[0];
  return STATUS_COLORS[first] || "bg-[var(--bg-secondary)] text-[var(--text-primary)]";
}

function formatJson(raw: string): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw;
  }
}

export function DashboardApiLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState("");
  const [errorsOnly, setErrorsOnly] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    adminApi.getApiLogs({ method: methodFilter || undefined, error: errorsOnly || undefined })
      .then(res => setLogs(res.logs || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, [methodFilter, errorsOnly]);

  const avgResponse = logs.length
    ? Math.round(logs.reduce((s, l) => s + (l.response_time_ms || 0), 0) / logs.length)
    : 0;
  const errorCount = logs.filter(l => l.status_code >= 400).length;

  const columns: Column<any>[] = [
    {
      key: "created_at",
      label: "Timestamp",
      render: (log) => (
        <span className="text-xs font-mono text-[var(--text-secondary)] whitespace-nowrap">
          {new Date(log.created_at).toLocaleString()}
        </span>
      ),
      exportValue: (log) => new Date(log.created_at).toLocaleString(),
    },
    {
      key: "url",
      label: "Request",
      render: (log) => (
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
            log.method === 'GET' ? 'bg-[var(--accent-light)] text-blue-700' :
            log.method === 'POST' ? 'bg-emerald-50 text-emerald-700' :
            log.method === 'DELETE' ? 'bg-[var(--accent-light)] text-rose-700' :
            'bg-amber-50 text-amber-700'
          }`}>
            {log.method}
          </span>
          <span className="text-sm text-[var(--text-primary)] font-mono max-w-[280px] truncate" title={log.url}>
            {log.url.replace(/^https?:\/\/[^/]+/, '')}
          </span>
          {log.request_body && (
            <i className={`lnr lnr-chevron-down text-[var(--text-secondary)] text-xs ml-auto transition-transform ${expanded === log.id ? 'rotate-180' : ''}`}></i>
          )}
        </div>
      ),
      exportValue: (log) => `${log.method} ${log.url}`,
    },
    {
      key: "status_code",
      label: "Status",
      render: (log) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(log.status_code)}`}>
          {log.status_code}
        </span>
      ),
      exportValue: (log) => log.status_code,
    },
    {
      key: "response_time_ms",
      label: "Time",
      render: (log) => (
        <span className={`text-sm font-mono ${log.response_time_ms > 500 ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
          {log.response_time_ms ?? '-'}ms
        </span>
      ),
      exportValue: (log) => log.response_time_ms ?? 0,
    },
    {
      key: "ip_address",
      label: "IP / User",
      render: (log) => (
        <div className="text-xs font-mono text-[var(--text-secondary)]">
          <div>{log.ip_address}</div>
          <div className="text-[var(--text-secondary)]">UID: {log.user_id ?? 'N/A'}</div>
        </div>
      ),
      exportValue: (log) => `${log.ip_address} (UID: ${log.user_id ?? 'N/A'})`,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">API Health & Logs</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Monitor all incoming and outgoing API requests across the platform.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-xl">
              <i className="lnr lnr-cloud-sync"></i>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-[var(--text-primary)]">{logs.length}</h4>
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Requests</p>
            </div>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xl">
              <i className="lnr lnr-warning"></i>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-[var(--text-primary)]">{errorCount}</h4>
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Errors (4xx/5xx)</p>
            </div>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i className="lnr lnr-hourglass"></i>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-[var(--text-primary)]">{avgResponse}ms</h4>
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Avg Response Time</p>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          title="Request Logs"
          exportFileName="api-logs"
          emptyIcon="lnr lnr-text-align-left"
          emptyMessage="No API logs found matching filters."
          onRowClick={(log) => log.request_body && setExpanded(expanded === log.id ? null : log.id)}
          headerActions={
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={methodFilter}
                onChange={e => setMethodFilter(e.target.value)}
                className="bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors"
              >
                <option value="">All Methods</option>
                {["GET", "POST", "PUT", "DELETE"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-primary)]">
                <input type="checkbox" checked={errorsOnly} onChange={e => setErrorsOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
                Errors Only
              </label>
              <button onClick={fetchLogs} className="px-4 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2">
                <i className={`lnr lnr-sync ${loading ? 'animate-spin' : ''}`}></i> Refresh
              </button>
            </div>
          }
        />

        {/* Expanded request body rows - rendered outside DataTable for expandable detail */}
        {expanded && logs.find(l => l.id === expanded)?.request_body && (
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden -mt-4">
            <div className="px-6 py-4 border-l-4 border-gray-900 bg-[var(--bg-secondary)]">
              <h5 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Request Body</h5>
              <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                {formatJson(logs.find(l => l.id === expanded)?.request_body)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
