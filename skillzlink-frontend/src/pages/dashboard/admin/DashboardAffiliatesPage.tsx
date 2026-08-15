import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { UserAvatar } from "../../../components/shared/UserAvatar";
import { adminApi } from "../../../services/api";

export function DashboardAffiliatesPage() {
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState<any[]>([]);
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
    adminApi.getAffiliates()
      .then((data) => {
        setAffiliates(data.users || []);
      })
      .catch((err) => {
        console.error("Failed to fetch affiliates:", err);
        setError("Failed to load affiliates. Please try again later.");
        setAffiliates([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSuspend = (aff: any) => {
    setAffiliates(prev => prev.map(a => a.id === aff.id ? { ...a, is_active: a.is_active ? false : true } : a));
    toast(`${aff.name} ${aff.is_active ? "suspended" : "activated"}.`);
  };

  const columns: Column<any>[] = [
    {
      key: "name", label: "Affiliate", render: (row) => (
        <div className="flex items-center gap-3">
          <UserAvatar src={row.avatar} name={row.name} size={32} />
          <span className="text-sm font-medium text-[var(--text-primary)]">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => <span className="text-[var(--text-secondary)]">{row.email}</span> },
    { key: "role", label: "Role", render: (row) => <span className="text-[var(--text-secondary)] text-xs capitalize">{row.role}</span> },
    {
      key: "status", label: "Status", render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.is_active ? "bg-green-50 text-green-700" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
          {row.is_active ? "active" : "inactive"}
        </span>
      ),
    },
    { key: "created_at", label: "Joined", render: (row) => <span className="text-[var(--text-secondary)]">{row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "-"}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
          <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
          {toastMessage}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <DataTable
          columns={columns}
          data={affiliates}
          loading={loading}
          title="Affiliates"
          subtitle="Manage affiliate partners and referrals"
          exportFileName="affiliates"
          headerActions={
            <button className="px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-hover)] transition-colors" onClick={() => toast("Add Affiliate modal coming soon.")}>
              Add Affiliate
            </button>
          }
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(`/dashboard/admin/affiliates/${row.id}`)} title="View details" className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-color)] rounded"><i className="lnr lnr-eye text-sm"></i></button>
              <button onClick={() => toast("Edit modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded"><i className="lnr lnr-pencil text-sm"></i></button>
              <button onClick={() => handleSuspend(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-orange-600 rounded"><i className="lnr lnr-power-switch text-sm"></i></button>
            </div>
          )}
        />

      </div>
    </DashboardLayout>
  );
}
