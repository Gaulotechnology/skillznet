import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_AGENTS = [
  { id: 1, name: "Thabo Molefe", email: "thabo.molefe@skillzlink.co.za", phone: "+27 82 345 6789", avatar: null, status: "active", assignedSeekers: 12, createdAt: "2025-11-15" },
  { id: 2, name: "Naledi Dlamini", email: "naledi.d@skillzlink.co.za", phone: "+27 71 234 5678", avatar: null, status: "active", assignedSeekers: 8, createdAt: "2025-12-02" },
  { id: 3, name: "Sipho Nkosi", email: "sipho.nkosi@skillzlink.co.za", phone: "+27 63 456 7890", avatar: null, status: "inactive", assignedSeekers: 0, createdAt: "2026-01-10" },
  { id: 4, name: "Lerato Mahlangu", email: "lerato.m@skillzlink.co.za", phone: "+27 84 567 8901", avatar: null, status: "active", assignedSeekers: 15, createdAt: "2025-10-20" },
  { id: 5, name: "Bongani Zulu", email: "bongani.z@skillzlink.co.za", phone: "+27 72 678 9012", avatar: null, status: "active", assignedSeekers: 6, createdAt: "2026-02-05" },
  { id: 6, name: "Ayanda Khumalo", email: "ayanda.k@skillzlink.co.za", phone: "+27 61 789 0123", avatar: null, status: "inactive", assignedSeekers: 0, createdAt: "2026-03-18" },
  { id: 7, name: "Zanele Mthembu", email: "zanele.m@skillzlink.co.za", phone: "+27 83 890 1234", avatar: null, status: "active", assignedSeekers: 9, createdAt: "2025-09-01" },
  { id: 8, name: "Mandla Sithole", email: "mandla.s@skillzlink.co.za", phone: "+27 76 901 2345", avatar: null, status: "active", assignedSeekers: 11, createdAt: "2026-01-25" },
  { id: 9, name: "Precious Mokoena", email: "precious.m@skillzlink.co.za", phone: "+27 65 012 3456", avatar: null, status: "active", assignedSeekers: 4, createdAt: "2026-04-12" },
  { id: 10, name: "Kagiso Motaung", email: "kagiso.mot@skillzlink.co.za", phone: "+27 81 123 4567", avatar: null, status: "inactive", assignedSeekers: 0, createdAt: "2026-05-30" },
  { id: 11, name: "Nomvula Cele", email: "nomvula.c@skillzlink.co.za", phone: "+27 73 234 5678", avatar: null, status: "active", assignedSeekers: 7, createdAt: "2025-08-14" },
  { id: 12, name: "Tshepo Langa", email: "tshepo.l@skillzlink.co.za", phone: "+27 64 345 6789", avatar: null, status: "active", assignedSeekers: 13, createdAt: "2026-06-01" },
  { id: 13, name: "Palesa Ndaba", email: "palesa.n@skillzlink.co.za", phone: "+27 82 456 7890", avatar: null, status: "active", assignedSeekers: 5, createdAt: "2026-02-20" },
  { id: 14, name: "Vuyo Jansen", email: "vuyo.j@skillzlink.co.za", phone: "+27 71 567 8901", avatar: null, status: "inactive", assignedSeekers: 0, createdAt: "2026-07-03" },
  { id: 15, name: "Dineo Maseko", email: "dineo.mas@skillzlink.co.za", phone: "+27 63 678 9012", avatar: null, status: "active", assignedSeekers: 10, createdAt: "2025-12-28" },
];

export function DashboardAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    setTimeout(() => { setAgents(MOCK_AGENTS); setLoading(false); }, 500);
  }, []);

  const handleSuspend = (agent: any) => {
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a));
    toast(`${agent.name} ${agent.status === "active" ? "suspended" : "activated"}.`);
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
    { key: "phone", label: "Phone", render: (row) => <span className="text-[var(--text-secondary)]">{row.phone}</span> },
    {
      key: "status", label: "Status", render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status === "active" ? "bg-green-50 text-green-700" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
          {row.status}
        </span>
      ),
    },
    { key: "assignedSeekers", label: "Assigned Seekers", render: (row) => <span className="text-[var(--text-primary)]">{row.assignedSeekers}</span> },
    { key: "createdAt", label: "Created", render: (row) => <span className="text-[var(--text-secondary)]">{row.createdAt}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>
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
