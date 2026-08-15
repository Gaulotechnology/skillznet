import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi } from "../../../services/api";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: "affiliate" | "agent" | "provider";
  company: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const typeStyles: Record<string, string> = {
  affiliate: "bg-[var(--accent-light)] text-[var(--accent-color)]",
  agent: "bg-amber-50 text-amber-700",
  provider: "bg-blue-50 text-blue-700",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

export function DashboardInvitationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [rejectModal, setRejectModal] = useState<number | null>(null);

  const toast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getApplications();
      setApplications(data.applications || []);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch {
      toast("Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await adminApi.approveApplication(id);
      toast("Application approved successfully", "success");
      fetchApplications();
    } catch {
      toast("Failed to approve application", "error");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminApi.rejectApplication(id);
      toast("Application rejected", "success");
      fetchApplications();
    } catch {
      toast("Failed to reject application", "error");
    } finally {
      setRejectModal(null);
    }
  };

  const columns: Column<Application>[] = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">
            {row.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => <span className="text-[var(--text-secondary)]">{row.email}</span> },
    { key: "phone", label: "Phone", render: (row) => <span className="text-[var(--text-secondary)]">{row.phone || "-"}</span> },
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${typeStyles[row.type] || ""}`}>
          {row.type}
        </span>
      ),
    },
    { key: "company", label: "Company", render: (row) => <span className="text-[var(--text-secondary)]">{row.company || "-"}</span> },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <span className="text-[var(--text-secondary)] text-xs block truncate max-w-[240px]" title={row.message}>
          {row.message || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusStyles[row.status] || ""}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Applied",
      render: (row) => (
        <span className="text-[var(--text-secondary)]">{row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "-"}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">
        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
          <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
          {toastMessage}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Approved", value: stats.approved },
            { label: "Rejected", value: stats.rejected },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[var(--border-color)] rounded-lg p-4">
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={applications}
          loading={loading}
          title="Invitations & Applications"
          subtitle="Manage incoming applications from affiliates, agents, and providers"
          exportFileName="invitations"
          headerActions={
            <button
              onClick={fetchApplications}
              className="px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2"
            >
              <i className={`lnr lnr-sync ${loading ? "animate-spin" : ""}`}></i>
              Refresh
            </button>
          }
          actions={(row) =>
            row.status === "pending" ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleApprove(row.id)}
                  title="Approve"
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                >
                  <i className="lnr lnr-checkmark-circle text-sm"></i>
                </button>
                <button
                  onClick={() => setRejectModal(row.id)}
                  title="Reject"
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <i className="lnr lnr-cross-circle text-sm"></i>
                </button>
              </div>
            ) : (
              <span className="text-[var(--text-secondary)] text-xs">—</span>
            )
          }
        />
      </div>

      {/* Reject Confirmation Modal */}
      {rejectModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl border border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Confirm Rejection</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Are you sure you want to reject this application? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--border-color)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectModal)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
