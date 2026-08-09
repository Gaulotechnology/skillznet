import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { agentApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardAgentReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, providers: 0, seekers: 0 });
  const [filter, setFilter] = useState<string>("");

  useEffect(() => { fetchReferrals(); }, [filter]);

  const fetchReferrals = () => {
    setLoading(true);
    const role = filter || undefined;
    agentApi.getReferrals(role)
      .then(data => {
        setReferrals(data.referrals || []);
        setStats(data.stats || { total: 0, providers: 0, seekers: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "User",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-sm font-medium text-[var(--accent-color)]">
            {(r.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{r.name}</span>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{r.email || r.phone_number || ""}</div>
          </div>
        </div>
      ),
      exportValue: (r) => r.name,
    },
    {
      key: "role",
      label: "Role",
      render: (r) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${
          r.role === "provider" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
        }`}>
          {r.role}
        </span>
      ),
      exportValue: (r) => r.role,
    },
    {
      key: "service_category",
      label: "Category",
      render: (r) => <span className="text-sm text-[var(--text-secondary)]">{r.service_category || "—"}</span>,
      exportValue: (r) => r.service_category || "",
    },
    {
      key: "registered_at",
      label: "Registered",
      render: (r) => <span className="text-sm text-[var(--text-secondary)]">{new Date(r.registered_at).toLocaleDateString()}</span>,
      exportValue: (r) => r.registered_at,
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (r) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          r.status === "active" ? "text-emerald-600" : "text-amber-600"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${r.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          {r.status}
        </span>
      ),
      exportValue: (r) => r.status,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-['Inter',sans-serif]">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">My Referrals</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track all providers and seekers you've brought to the platform.</p>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[var(--border-color)] text-center">
            <div className="text-2xl font-black text-[var(--text-primary)]">{stats.total}</div>
            <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Total</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[var(--border-color)] text-center">
            <div className="text-2xl font-black text-blue-600">{stats.providers}</div>
            <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Providers</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[var(--border-color)] text-center">
            <div className="text-2xl font-black text-emerald-600">{stats.seekers}</div>
            <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Seekers</div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={referrals}
          loading={loading}
          title="All Referrals"
          emptyIcon="lnr lnr-users"
          emptyMessage="No referrals yet. Share your link to start onboarding users."
          exportFileName="agent-referrals"
          headerActions={
            <div className="flex items-center gap-1 p-1 border border-[var(--border-color)] rounded-lg">
              {[
                { label: "All", value: "" },
                { label: "Providers", value: "provider" },
                { label: "Seekers", value: "seeker" },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f.value ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
}
