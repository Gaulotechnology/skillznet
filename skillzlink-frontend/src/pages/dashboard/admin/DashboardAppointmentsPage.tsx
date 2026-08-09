import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { adminApi } from "../../../services/api";

export function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
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
    adminApi.getAppointments()
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch((err) => {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again later.");
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (apt: any) => {
    setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: "Cancelled" } : a));
    toast(`Appointment ${apt.id} cancelled.`);
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter(a => (a.date || "").startsWith(today)).length;
  const weekStart = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const weekCount = appointments.filter(a => (a.date || "") >= weekStart).length;
  const completed = appointments.filter(a => a.status === "Completed" || a.status === "completed").length;

  const statusColor: Record<string, string> = { Scheduled: "bg-[var(--accent-light)] text-blue-700", scheduled: "bg-[var(--accent-light)] text-blue-700", Completed: "bg-green-50 text-green-700", completed: "bg-green-50 text-green-700", Cancelled: "bg-red-50 text-red-600", cancelled: "bg-red-50 text-red-600", "No-show": "bg-orange-50 text-orange-700", no_show: "bg-orange-50 text-orange-700" };

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (row) => <span className="text-xs font-mono text-[var(--text-primary)]">#{row.id}</span> },
    {
      key: "seeker", label: "Seeker", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.seeker || "S").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.seeker || "-"}</span>
        </div>
      ),
    },
    {
      key: "provider", label: "Provider", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{(row.provider || "P").charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.provider || "-"}</span>
        </div>
      ),
    },
    { key: "date", label: "Date", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.date || "-"}</span> },
    { key: "time", label: "Time", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.time || "-"}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status || "-"}</span> },
    { key: "notes", label: "Notes", render: (row) => <span className="text-[var(--text-secondary)] text-xs truncate max-w-[150px] block">{row.notes || "-"}</span> },
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

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Appointments</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">All bookings across the platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Today</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{todayCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">This Week</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{weekCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Completed Rate</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{appointments.length ? Math.round((completed / appointments.length) * 100) : 0}%</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{appointments.length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        loading={loading}
        exportFileName="appointments"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => toast("View details coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded"><i className="lnr lnr-eye text-sm"></i></button>
            {(row.status === "Scheduled" || row.status === "scheduled") && <>
              <button onClick={() => toast("Reschedule modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-blue-600 rounded"><i className="lnr lnr-calendar-full text-sm"></i></button>
              <button onClick={() => handleCancel(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-600 rounded"><i className="lnr lnr-cross-circle text-sm"></i></button>
            </>}
          </div>
        )}
      />
    </DashboardLayout>
  );
}
