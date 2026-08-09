import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi } from "../../../services/api";

export function DashboardAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
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
    adminApi.getAgents()
      .then((data) => {
        setAgents(data.users || []);
      })
      .catch((err) => {
        console.error("Failed to fetch agents:", err);
        setError("Failed to load agents. Please try again later.");
        setAgents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSuspend = (agent: any) => {
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_active: a.is_active ? false : true } : a));
    toast(`${agent.name} ${agent.is_active ? "suspended" : "activated"}.`);
  };

  const handleDelete = (agent: any) => {
    setAgents(prev => prev.filter(a => a.id !== agent.id));
    toast(`${agent.name} deleted.`);
  };

  const columns: Column<any>[] = [
    {
      key: "name", label: "Agent", render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar ? <img src={row.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /> : (
            <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">{(row.name || "A").charAt(0)}</div>
          )}
          <span className="text-sm font-medium text-[var(--text-primary)]">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => <span className="text-[var(--text-secondary)]">{row.email}</span> },
    {
      key: "status", label: "Status", render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.is_active ? "bg-green-50 text-green-700" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
          {row.is_active ? "active" : "inactive"}
        </span>
      ),
    },
    { key: "created_at", label: "Created", render: (row) => <span className="text-[var(--text-secondary)]">{row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "-"}</span> },
  ];

  return (
    <DashboardLayout>
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
        data={agents}
        loading={loading}
        title="Agents"
        subtitle="Manage agents assigned to seekers"
        exportFileName="agents"
        headerActions={
          <button className="px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-hover)] transition-colors" onClick={() => toast("Add Agent modal coming soon.")}>
            Add Agent
          </button>
        }
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => toast("Edit modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded"><i className="lnr lnr-pencil text-sm"></i></button>
            <button onClick={() => handleSuspend(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-orange-600 rounded"><i className="lnr lnr-power-switch text-sm"></i></button>
            <button onClick={() => handleDelete(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-600 rounded"><i className="lnr lnr-trash2 text-sm"></i></button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
