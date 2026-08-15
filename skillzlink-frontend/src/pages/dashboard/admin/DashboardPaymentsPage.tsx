import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi } from "../../../services/api";

export function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
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
    adminApi.getPayments()
      .then((data) => {
        setPayments(data.payments || []);
      })
      .catch((err) => {
        console.error("Failed to fetch payments:", err);
        setError("Failed to load payments. Please try again later.");
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.filter(p => p.status === "Completed" || p.status === "completed").reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const thisMonth = payments.filter(p => {
    if (p.status !== "Completed" && p.status !== "completed") return false;
    const d = p.date || "";
    const now = new Date().toISOString().slice(0, 7);
    return d.startsWith(now);
  }).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const pendingPayouts = payments.filter(p => p.status === "Pending" || p.status === "pending").reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const refunds = payments.filter(p => p.status === "Refunded" || p.status === "refunded").reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const statusColor: Record<string, string> = { Completed: "bg-green-50 text-green-700", completed: "bg-green-50 text-green-700", Pending: "bg-yellow-50 text-yellow-700", pending: "bg-yellow-50 text-yellow-700", Failed: "bg-red-50 text-red-600", failed: "bg-red-50 text-red-600", Refunded: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]", refunded: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]" };

  const columns: Column<any>[] = [
    { key: "id", label: "Transaction ID", render: (row) => <span className="text-xs font-mono text-[var(--text-primary)]">{row.id}</span> },
    {
      key: "user", label: "User", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.user || "U").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.user || "-"}</span>
        </div>
      ),
    },
    { key: "amount", label: "Amount", render: (row) => <span className="text-[var(--text-primary)] font-medium">R {(Number(row.amount) || 0).toLocaleString()}</span> },
    { key: "method", label: "Method", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.method || "-"}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status || "-"}</span> },
    { key: "transaction", label: "Transaction", render: (row) => <span className="text-[var(--text-secondary)] text-xs font-mono">{row.transaction || "-"}</span> },
    { key: "date", label: "Date", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.date || "-"}</span> },
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

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Payments</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">All payment transactions</p>
          </div>
          <button className="px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-hover)] transition-colors" onClick={() => toast("Payout modal coming soon.")}>
            Payout
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">R {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">This Month</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">R {thisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Pending Payouts</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">R {pendingPayouts.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Refunds</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">R {refunds.toLocaleString()}</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={payments}
          loading={loading}
          exportFileName="payments"
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={() => toast("View receipt coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded"><i className="lnr lnr-file-empty text-sm"></i></button>
              {(row.status === "Completed" || row.status === "completed") && <button onClick={() => toast("Refund modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-orange-600 rounded"><i className="lnr lnr-undo text-sm"></i></button>}
            </div>
          )}
        />

      </div>
    </DashboardLayout>
  );
}
