import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_APPOINTMENTS = [
  { id: "APT-001", seeker: "Nomsa Khoza", seekerAvatar: null, provider: "Thabo Molefe", providerAvatar: null, service: "Pipe Repair", dateTime: "2026-08-08 09:00", duration: "1h", status: "Scheduled", amount: 850 },
  { id: "APT-002", seeker: "David Pillay", seekerAvatar: null, provider: "Sipho Nkosi", providerAvatar: null, service: "Wiring Installation", dateTime: "2026-08-08 11:00", duration: "2h", status: "Scheduled", amount: 1600 },
  { id: "APT-003", seeker: "Fatima Essop", seekerAvatar: null, provider: "Lerato Mahlangu", providerAvatar: null, service: "Deep Clean", dateTime: "2026-08-07 14:00", duration: "3h", status: "Completed", amount: 450 },
  { id: "APT-004", seeker: "Johan van Wyk", seekerAvatar: null, provider: "Bongani Zulu", providerAvatar: null, service: "Garden Maintenance", dateTime: "2026-08-07 08:00", duration: "2h", status: "Completed", amount: 600 },
  { id: "APT-005", seeker: "Amahle Ndlovu", seekerAvatar: null, provider: "Ayanda Khumalo", providerAvatar: null, service: "Interior Painting", dateTime: "2026-08-06 10:00", duration: "4h", status: "Completed", amount: 3200 },
  { id: "APT-006", seeker: "Pieter Botha", seekerAvatar: null, provider: "Zanele Mthembu", providerAvatar: null, service: "Office Move", dateTime: "2026-08-09 07:00", duration: "6h", status: "Scheduled", amount: 5500 },
  { id: "APT-007", seeker: "Thandiwe Miya", seekerAvatar: null, provider: "Mandla Sithole", providerAvatar: null, service: "Maths Tutoring", dateTime: "2026-08-05 15:00", duration: "1h", status: "Cancelled", amount: 350 },
  { id: "APT-008", seeker: "Ravi Naidoo", seekerAvatar: null, provider: "Precious Mokoena", providerAvatar: null, service: "Network Setup", dateTime: "2026-08-08 14:00", duration: "2h", status: "Scheduled", amount: 1200 },
  { id: "APT-009", seeker: "Grace Moyo", seekerAvatar: null, provider: "Kagiso Motaung", providerAvatar: null, service: "Event Catering", dateTime: "2026-08-10 12:00", duration: "5h", status: "Scheduled", amount: 8500 },
  { id: "APT-010", seeker: "Willem Pretorius", seekerAvatar: null, provider: "Nomvula Cele", providerAvatar: null, service: "Guard Service", dateTime: "2026-08-04 06:00", duration: "8h", status: "No-show", amount: 2200 },
  { id: "APT-011", seeker: "Sibongile Mhlongo", seekerAvatar: null, provider: "Tshepo Langa", providerAvatar: null, service: "Toilet Repair", dateTime: "2026-08-08 16:00", duration: "1h", status: "Scheduled", amount: 700 },
  { id: "APT-012", seeker: "Ahmed Patel", seekerAvatar: null, provider: "Palesa Ndaba", providerAvatar: null, service: "DB Board Upgrade", dateTime: "2026-08-03 09:00", duration: "3h", status: "Completed", amount: 2400 },
  { id: "APT-013", seeker: "Mpumi Tshabalala", seekerAvatar: null, provider: "Vuyo Jansen", providerAvatar: null, service: "Manicure & Pedicure", dateTime: "2026-08-08 10:30", duration: "1.5h", status: "Scheduled", amount: 550 },
  { id: "APT-014", seeker: "Jan Erasmus", seekerAvatar: null, provider: "Dineo Maseko", providerAvatar: null, service: "Roof Tiles", dateTime: "2026-08-11 08:00", duration: "5h", status: "Scheduled", amount: 7800 },
  { id: "APT-015", seeker: "Noluthando Jwara", seekerAvatar: null, provider: "Kabelo Mosia", providerAvatar: null, service: "Nanny Service", dateTime: "2026-08-02 07:00", duration: "8h", status: "Completed", amount: 4500 },
  { id: "APT-016", seeker: "Christo Venter", seekerAvatar: null, provider: "Lindiwe Shabalala", providerAvatar: null, service: "AC Repair", dateTime: "2026-08-01 13:00", duration: "2h", status: "Completed", amount: 1800 },
];

export function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => { setTimeout(() => { setAppointments(MOCK_APPOINTMENTS); setLoading(false); }, 500); }, []);

  const handleCancel = (apt: any) => {
    setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: "Cancelled" } : a));
    toast(`Appointment ${apt.id} cancelled.`);
  };

  const todayCount = appointments.filter(a => a.dateTime.startsWith("2026-08-08")).length;
  const weekCount = appointments.filter(a => a.dateTime >= "2026-08-04" && a.dateTime <= "2026-08-10").length;
  const completed = appointments.filter(a => a.status === "Completed").length;
  const revenue = appointments.filter(a => a.status === "Completed").reduce((s, a) => s + a.amount, 0);

  const statusColor: Record<string, string> = { Scheduled: "bg-[var(--accent-light)] text-blue-700", Completed: "bg-green-50 text-green-700", Cancelled: "bg-red-50 text-red-600", "No-show": "bg-orange-50 text-orange-700" };

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (row) => <span className="text-xs font-mono text-[var(--text-primary)]">{row.id}</span> },
    {
      key: "seeker", label: "Seeker", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{row.seeker.charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.seeker}</span>
        </div>
      ),
    },
    {
      key: "provider", label: "Provider", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{row.provider.charAt(0)}</div>
          <span className="text-sm text-[var(--text-primary)]">{row.provider}</span>
        </div>
      ),
    },
    { key: "service", label: "Service", render: (row) => <span className="text-[var(--text-primary)]">{row.service}</span> },
    { key: "dateTime", label: "Date & Time", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.dateTime}</span> },
    { key: "duration", label: "Duration", render: (row) => <span className="text-[var(--text-secondary)]">{row.duration}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status}</span> },
    { key: "amount", label: "Amount", render: (row) => <span className="text-[var(--text-primary)]">R {row.amount.toLocaleString()}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>

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
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Revenue</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">R {revenue.toLocaleString()}</p>
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
            {row.status === "Scheduled" && <>
              <button onClick={() => toast("Reschedule modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-blue-600 rounded"><i className="lnr lnr-calendar-full text-sm"></i></button>
              <button onClick={() => handleCancel(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-600 rounded"><i className="lnr lnr-cross-circle text-sm"></i></button>
            </>}
          </div>
        )}
      />
    </DashboardLayout>
  );
}
