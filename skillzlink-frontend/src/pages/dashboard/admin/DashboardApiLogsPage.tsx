import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

const STATUS_COLORS: Record<string, string> = {
  "2": "#52c41a", // 2xx green
  "3": "#1890ff", // 3xx blue
  "4": "#fa8c16", // 4xx orange
  "5": "#f5222d", // 5xx red
};

function getStatusColor(code: number) {
  const first = String(code)[0];
  return STATUS_COLORS[first] || "#999";
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

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        {/* Summary Cards */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-12 col-sm-4">
            <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', margin: '0', color: '#1890ff' }}>{logs.length}</h3>
              <span>Total Requests</span>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', margin: '0', color: '#f5222d' }}>{errorCount}</h3>
              <span>Errors (4xx / 5xx)</span>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="wt-insightsitem wt-dashboardbox" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', margin: '0', color: '#52c41a' }}>{avgResponse}ms</h3>
              <span>Avg Response Time</span>
            </div>
          </div>
        </div>

        <div className="wt-dashboardbox">
          <div className="wt-dashboardboxtitle wt-titlewithsearch">
            <h2>API Request Logs</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="wt-select" style={{ minWidth: '130px' }}>
                <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
                  <option value="">All Methods</option>
                  {["GET", "POST", "PUT", "DELETE"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </span>
              <span className="wt-radio">
                <input type="checkbox" id="err-only" checked={errorsOnly}
                  onChange={e => setErrorsOnly(e.target.checked)} />
                <label htmlFor="err-only"> Errors Only</label>
              </span>
              <button className="wt-btn" onClick={fetchLogs} style={{ padding: '8px 16px' }}>
                <i className="lnr lnr-sync"></i> Refresh
              </button>
            </div>
          </div>
          <div className="wt-dashboardboxcontent">
            {loading ? <p style={{ padding: '20px' }}>Loading logs...</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table className="wt-tablecategories" style={{ minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Method</th>
                      <th>URL</th>
                      <th>Status</th>
                      <th>Time (ms)</th>
                      <th>IP</th>
                      <th>User ID</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <>
                        <tr key={log.id} style={{ cursor: log.request_body ? 'pointer' : 'default' }}
                          onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                          <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td>
                            <span style={{
                              background: log.method === 'GET' ? '#e6f7ff' : log.method === 'DELETE' ? '#fff1f0' : '#fffbe6',
                              color: log.method === 'GET' ? '#1890ff' : log.method === 'DELETE' ? '#f5222d' : '#faad14',
                              padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                            }}>
                              {log.method}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.url.replace(/^https?:\/\/[^/]+/, '')}
                          </td>
                          <td>
                            <span style={{
                              color: '#fff', background: getStatusColor(log.status_code),
                              padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                            }}>
                              {log.status_code}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px' }}>
                            <span style={{ color: log.response_time_ms > 500 ? '#f5222d' : '#52c41a', fontWeight: 600 }}>
                              {log.response_time_ms ?? '-'}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px' }}>{log.ip_address}</td>
                          <td style={{ fontSize: '12px' }}>{log.user_id ?? '—'}</td>
                          <td>{log.request_body && <i className="lnr lnr-chevron-down" style={{ fontSize: '10px' }}></i>}</td>
                        </tr>
                        {expanded === log.id && log.request_body && (
                          <tr key={`${log.id}-body`}>
                            <td colSpan={8} style={{ background: '#f8f9fa', fontSize: '12px' }}>
                              <pre style={{ margin: 0, padding: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {log.request_body}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                          No API logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
