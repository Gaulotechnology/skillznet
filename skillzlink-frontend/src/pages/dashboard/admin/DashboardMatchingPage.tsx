import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_REQUESTS = [
  { id: "REQ-001", seeker: "Nomsa Khoza", seekerAvatar: null, category: "Plumbing", location: "Sandton, Johannesburg", budgetRange: "R 500 – R 1,500", urgency: "High", status: "Pending", createdAt: "2026-08-01" },
  { id: "REQ-002", seeker: "David Pillay", seekerAvatar: null, category: "Electrical", location: "Durban North", budgetRange: "R 800 – R 2,000", urgency: "Urgent", status: "Matched", createdAt: "2026-08-02" },
  { id: "REQ-003", seeker: "Fatima Essop", seekerAvatar: null, category: "Cleaning", location: "Cape Town CBD", budgetRange: "R 300 – R 600", urgency: "Low", status: "Completed", createdAt: "2026-07-28" },
  { id: "REQ-004", seeker: "Johan van Wyk", seekerAvatar: null, category: "Gardening", location: "Pretoria East", budgetRange: "R 400 – R 900", urgency: "Medium", status: "Pending", createdAt: "2026-08-03" },
  { id: "REQ-005", seeker: "Amahle Ndlovu", seekerAvatar: null, category: "Painting", location: "Soweto", budgetRange: "R 2,000 – R 5,000", urgency: "Medium", status: "Pending", createdAt: "2026-08-04" },
  { id: "REQ-006", seeker: "Pieter Botha", seekerAvatar: null, category: "Moving", location: "Stellenbosch", budgetRange: "R 3,000 – R 8,000", urgency: "High", status: "Matched", createdAt: "2026-08-01" },
  { id: "REQ-007", seeker: "Thandiwe Miya", seekerAvatar: null, category: "Tutoring", location: "Randburg", budgetRange: "R 200 – R 500", urgency: "Low", status: "Cancelled", createdAt: "2026-07-25" },
  { id: "REQ-008", seeker: "Ravi Naidoo", seekerAvatar: null, category: "IT Support", location: "Umhlanga", budgetRange: "R 600 – R 1,200", urgency: "Urgent", status: "Pending", createdAt: "2026-08-05" },
  { id: "REQ-009", seeker: "Grace Moyo", seekerAvatar: null, category: "Catering", location: "Midrand", budgetRange: "R 5,000 – R 15,000", urgency: "Medium", status: "Matched", createdAt: "2026-07-30" },
  { id: "REQ-010", seeker: "Willem Pretorius", seekerAvatar: null, category: "Security", location: "Centurion", budgetRange: "R 1,500 – R 3,000", urgency: "High", status: "Pending", createdAt: "2026-08-06" },
  { id: "REQ-011", seeker: "Sibongile Mhlongo", seekerAvatar: null, category: "Plumbing", location: "Polokwane", budgetRange: "R 400 – R 1,000", urgency: "Low", status: "Completed", createdAt: "2026-07-20" },
  { id: "REQ-012", seeker: "Ahmed Patel", seekerAvatar: null, category: "Electrical", location: "Lenasia", budgetRange: "R 1,000 – R 2,500", urgency: "Urgent", status: "Pending", createdAt: "2026-08-07" },
  { id: "REQ-013", seeker: "Mpumi Tshabalala", seekerAvatar: null, category: "Beauty", location: "Rosebank", budgetRange: "R 300 – R 800", urgency: "Low", status: "Matched", createdAt: "2026-08-03" },
  { id: "REQ-014", seeker: "Jan Erasmus", seekerAvatar: null, category: "Roofing", location: "Bloemfontein", budgetRange: "R 4,000 – R 12,000", urgency: "High", status: "Pending", createdAt: "2026-08-08" },
  { id: "REQ-015", seeker: "Noluthando Jwara", seekerAvatar: null, category: "Childcare", location: "Kempton Park", budgetRange: "R 2,500 – R 5,000", urgency: "Medium", status: "Pending", createdAt: "2026-08-06" },
  { id: "REQ-016", seeker: "Christo Venter", seekerAvatar: null, category: "HVAC", location: "Sandton", budgetRange: "R 1,200 – R 3,500", urgency: "Medium", status: "Completed", createdAt: "2026-07-15" },
  { id: "REQ-017", seeker: "Zodwa Masina", seekerAvatar: null, category: "Cleaning", location: "Alexandra", budgetRange: "R 250 – R 500", urgency: "Low", status: "Cancelled", createdAt: "2026-07-22" },
  { id: "REQ-018", seeker: "Sanjay Govender", seekerAvatar: null, category: "Landscaping", location: "Ballito", budgetRange: "R 3,000 – R 7,000", urgency: "Medium", status: "Pending", createdAt: "2026-08-07" },
];

export function DashboardMatchingPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    setTimeout(() => { setRequests(MOCK_REQUESTS); setLoading(false); }, 500);
  }, []);

  const handleCancel = (req: any) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Cancelled" } : r));
    toast(`Request ${req.id} cancelled.`);
  };

  const pending = requests.filter(r => r.status === "Pending").length;
  const matchedToday = requests.filter(r => r.status === "Matched" && r.createdAt === "2026-08-08").length;

  const urgencyColor: Record<string, string> = { Low: "bg-[var(--accent-light)] text-blue-700", Medium: "bg-yellow-50 text-yellow-700", High: "bg-orange-50 text-orange-700", Urgent: "bg-red-50 text-red-700" };
  const statusColor: Record<string, string> = { Pending: "bg-yellow-50 text-yellow-700", Matched: "bg-green-50 text-green-700", Completed: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]", Cancelled: "bg-red-50 text-red-600" };

  const columns: Column<any>[] = [
    { key: "id", label: "Request ID", render: (row) => <span className="text-xs font-mono text-[var(--text-primary)]">{row.id}</span> },
    {
      key: "seeker", label: "Seeker", render: (row) => (
        <div className="flex items-center gap-2">
          {row.seekerAvatar ? <img src={row.seekerAvatar} alt="" className="w-7 h-7 rounded-full object-cover" /> : (
            <div className="w-7 h-7 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">{row.seeker.charAt(0)}</div>
          )}
          <span className="text-sm text-[var(--text-primary)]">{row.seeker}</span>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (row) => <span className="text-[var(--text-primary)]">{row.category}</span> },
    { key: "location", label: "Location", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.location}</span> },
    { key: "budgetRange", label: "Budget", render: (row) => <span className="text-[var(--text-primary)] text-xs">{row.budgetRange}</span> },
    { key: "urgency", label: "Urgency", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${urgencyColor[row.urgency] || ""}`}>{row.urgency}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status}</span> },
    { key: "createdAt", label: "Created", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.createdAt}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">On-Demand Matching</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Service requests from seekers awaiting provider matching</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{requests.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{pending}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Matched Today</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{matchedToday}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Avg Match Time</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">2.4h</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        loading={loading}
        exportFileName="matching-requests"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => toast("Match modal coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-green-600 rounded" title="Match"><i className="lnr lnr-sync text-sm"></i></button>
            <button onClick={() => toast("View details coming soon.")} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded" title="View"><i className="lnr lnr-eye text-sm"></i></button>
            {row.status === "Pending" && <button onClick={() => handleCancel(row)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-600 rounded" title="Cancel"><i className="lnr lnr-cross-circle text-sm"></i></button>}
          </div>
        )}
      />
    </DashboardLayout>
  );
}
