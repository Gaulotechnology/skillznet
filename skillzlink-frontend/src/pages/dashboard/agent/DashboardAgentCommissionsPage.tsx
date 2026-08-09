import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { agentApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardAgentCommissionsPage() {
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_earned: 0, total_pending: 0, total_paid: 0 });

  useEffect(() => {
    agentApi.getCommissions()
      .then(data => {
        setCommissions(data.commissions || []);
        setStats(data.stats || { total_earned: 0, total_pending: 0, total_paid: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<any>[] = [
    {
      key: "description",
      label: "Description",
      render: (c) => (
        <div>
          <span className="text-sm font-medium text-[var(--text-primary)]">{c.description}</span>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">Referred: {c.referred_user}</div>
        </div>
      ),
      exportValue: (c) => c.description,
    },
    {
      key: "amount",
      label: "Amount",
      render: (c) => <span className="text-sm font-semibold text-[var(--text-primary)]">${c.amount.toFixed(2)}</span>,
      exportValue: (c) => c.amount.toFixed(2),
    },
    {
      key: "created_at",
      label: "Date",
      render: (c) => <span className="text-sm text-[var(--text-secondary)]">{new Date(c.created_at).toLocaleDateString()}</span>,
      exportValue: (c) => c.created_at,
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (c) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          c.status === "paid" ? "text-emerald-600" : "text-amber-600"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.status === "paid" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          {c.status}
        </span>
      ),
      exportValue: (c) => c.status,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-['Inter',sans-serif]">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">My Commissions</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track your earnings from referrals.</p>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl">
              <i className="lnr lnr-diamond"></i>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Total Earned</div>
              <div className="text-xl font-black text-[var(--text-primary)]">${stats.total_earned.toFixed(2)}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i className="lnr lnr-checkmark-circle"></i>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Paid Out</div>
              <div className="text-xl font-black text-emerald-600">${stats.total_paid.toFixed(2)}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <i className="lnr lnr-clock"></i>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Pending</div>
              <div className="text-xl font-black text-amber-600">${stats.total_pending.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={commissions}
          loading={loading}
          title="Commission History"
          emptyIcon="lnr lnr-diamond"
          emptyMessage="No commissions earned yet. Referrals must complete transactions to generate commissions."
          exportFileName="agent-commissions"
        />
      </div>
    </DashboardLayout>
  );
}
