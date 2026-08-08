import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_COMMS = [
  { id: 1, from: "Nomsa Khoza", fromAvatar: null, to: "Thabo Molefe", toAvatar: null, channel: "In-App", subject: "Hi, are you available for a pipe repair tomorrow morning?", status: "Read", sentAt: "2026-08-08 15:20" },
  { id: 2, from: "David Pillay", fromAvatar: null, to: "Sipho Nkosi", toAvatar: null, channel: "SMS", subject: "Please confirm the wiring job for Saturday.", status: "Delivered", sentAt: "2026-08-08 14:10" },
  { id: 3, from: "System", fromAvatar: null, to: "Fatima Essop", toAvatar: null, channel: "Email", subject: "Your booking has been confirmed - Deep Clean service", status: "Delivered", sentAt: "2026-08-08 13:45" },
  { id: 4, from: "Johan van Wyk", fromAvatar: null, to: "Bongani Zulu", toAvatar: null, channel: "In-App", subject: "Can you bring your own lawnmower? Mine is broken.", status: "Read", sentAt: "2026-08-08 12:30" },
  { id: 5, from: "Amahle Ndlovu", fromAvatar: null, to: "Ayanda Khumalo", toAvatar: null, channel: "In-App", subject: "What paint brands do you use? I prefer Plascon.", status: "Unread", sentAt: "2026-08-08 11:55" },
  { id: 6, from: "System", fromAvatar: null, to: "Pieter Botha", toAvatar: null, channel: "Email", subject: "Invoice #INV-006 for Office Move - R5,500", status: "Delivered", sentAt: "2026-08-08 10:20" },
  { id: 7, from: "Thandiwe Miya", fromAvatar: null, to: "Mandla Sithole", toAvatar: null, channel: "In-App", subject: "Sorry, I need to cancel. Something came up.", status: "Read", sentAt: "2026-08-07 16:00" },
  { id: 8, from: "Ravi Naidoo", fromAvatar: null, to: "Precious Mokoena", toAvatar: null, channel: "In-App", subject: "Do you support MacOS and Windows networking?", status: "Unread", sentAt: "2026-08-08 09:30" },
  { id: 9, from: "Grace Moyo", fromAvatar: null, to: "Kagiso Motaung", toAvatar: null, channel: "SMS", subject: "Menu confirmed. 50 guests. Please include vegetarian.", status: "Delivered", sentAt: "2026-08-07 18:00" },
  { id: 10, from: "System", fromAvatar: null, to: "Willem Pretorius", toAvatar: null, channel: "Email", subject: "No-show recorded for your appointment on Aug 4", status: "Delivered", sentAt: "2026-08-05 08:00" },
  { id: 11, from: "Sibongile Mhlongo", fromAvatar: null, to: "Tshepo Langa", toAvatar: null, channel: "In-App", subject: "Thanks for fixing the toilet! Great work.", status: "Read", sentAt: "2026-08-07 17:30" },
  { id: 12, from: "Ahmed Patel", fromAvatar: null, to: "Palesa Ndaba", toAvatar: null, channel: "In-App", subject: "Is the DB board upgrade complete? Can I use power?", status: "Read", sentAt: "2026-08-03 12:00" },
  { id: 13, from: "System", fromAvatar: null, to: "Mpumi Tshabalala", toAvatar: null, channel: "Email", subject: "Rate your experience with Vuyo Jansen", status: "Unread", sentAt: "2026-08-08 11:00" },
  { id: 14, from: "Jan Erasmus", fromAvatar: null, to: "Dineo Maseko", toAvatar: null, channel: "In-App", subject: "What warranty do you offer on roof repairs?", status: "Unread", sentAt: "2026-08-08 08:15" },
  { id: 15, from: "Noluthando Jwara", fromAvatar: null, to: "Kabelo Mosia", toAvatar: null, channel: "SMS", subject: "The kids loved you! Same time next week?", status: "Delivered", sentAt: "2026-08-02 18:30" },
  { id: 16, from: "System", fromAvatar: null, to: "Christo Venter", toAvatar: null, channel: "Email", subject: "Payment receipt - R1,800 for AC Repair", status: "Delivered", sentAt: "2026-08-01 14:00" },
  { id: 17, from: "Bongani Zulu", fromAvatar: null, to: "Johan van Wyk", toAvatar: null, channel: "In-App", subject: "Yes, I'll bring my own equipment. See you at 8am.", status: "Read", sentAt: "2026-08-08 12:45" },
  { id: 18, from: "Lerato Mahlangu", fromAvatar: null, to: "Fatima Essop", toAvatar: null, channel: "In-App", subject: "I'll arrive 10 min early with supplies. Any allergies?", status: "Read", sentAt: "2026-08-07 09:00" },
];

export function DashboardCommLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => { setTimeout(() => { setLogs(MOCK_COMMS); setLoading(false); }, 500); }, []);

  const today = logs.filter(l => l.sentAt.startsWith("2026-08-08")).length;
  const unread = logs.filter(l => l.status === "Unread").length;
  const activeThreads = new Set(logs.map(l => [l.from, l.to].sort().join("-"))).size;

  const channelColor: Record<string, string> = { "In-App": "bg-blue-50 text-blue-700", SMS: "bg-purple-50 text-purple-700", Email: "bg-gray-100 text-gray-700" };
  const statusColor: Record<string, string> = { Read: "bg-green-50 text-green-700", Unread: "bg-yellow-50 text-yellow-700", Delivered: "bg-gray-100 text-gray-600" };

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (row) => <span className="text-xs text-gray-500">#{row.id}</span> },
    {
      key: "from", label: "From", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">{row.from.charAt(0)}</div>
          <span className="text-sm text-gray-900">{row.from}</span>
        </div>
      ),
    },
    {
      key: "to", label: "To", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">{row.to.charAt(0)}</div>
          <span className="text-sm text-gray-900">{row.to}</span>
        </div>
      ),
    },
    { key: "channel", label: "Channel", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${channelColor[row.channel] || ""}`}>{row.channel}</span> },
    { key: "subject", label: "Preview", render: (row) => <span className="text-gray-500 text-xs truncate max-w-[200px] block">{row.subject.length > 45 ? row.subject.slice(0, 45) + "…" : row.subject}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status}</span> },
    { key: "sentAt", label: "Sent At", render: (row) => <span className="text-gray-500 text-xs">{row.sentAt}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Communication Logs</h1>
        <p className="text-sm text-gray-500 mt-1">All messages between users on the platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Messages</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{today}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Unread</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{unread}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Threads</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{activeThreads}</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} loading={loading} exportFileName="comm-logs" />
    </DashboardLayout>
  );
}
