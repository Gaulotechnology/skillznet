import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_SMS = [
  { id: 1, recipient: "+27 82 345 6789", type: "OTP", message: "Your SkillzLink verification code is 483921. Valid for 5 minutes.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-08 15:30" },
  { id: 2, recipient: "+27 71 234 5678", type: "Notification", message: "Your booking with Thabo Molefe is confirmed for tomorrow at 09:00.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-08 14:22" },
  { id: 3, recipient: "+27 63 456 7890", type: "OTP", message: "Your SkillzLink verification code is 719384. Valid for 5 minutes.", provider: "Vonage", status: "Failed", cost: 0.0, sentAt: "2026-08-08 13:10" },
  { id: 4, recipient: "+27 84 567 8901", type: "Marketing", message: "🎉 New providers in your area! Book plumbing services at 20% off this week.", provider: "Twilio", status: "Delivered", cost: 0.15, sentAt: "2026-08-08 10:00" },
  { id: 5, recipient: "+27 72 678 9012", type: "Notification", message: "Payment of R850 received. Your booking is now confirmed.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-08 09:45" },
  { id: 6, recipient: "+27 61 789 0123", type: "OTP", message: "Your SkillzLink verification code is 562190. Valid for 5 minutes.", provider: "Vonage", status: "Delivered", cost: 0.11, sentAt: "2026-08-08 08:30" },
  { id: 7, recipient: "+27 83 890 1234", type: "Notification", message: "Reminder: Your appointment with Lerato is in 1 hour.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-07 13:00" },
  { id: 8, recipient: "+27 76 901 2345", type: "OTP", message: "Your SkillzLink verification code is 834756. Valid for 5 minutes.", provider: "Fake", status: "Delivered", cost: 0.0, sentAt: "2026-08-07 11:20" },
  { id: 9, recipient: "+27 65 012 3456", type: "Marketing", message: "Rate your recent service! Leave a review and earn R50 credit.", provider: "Twilio", status: "Delivered", cost: 0.15, sentAt: "2026-08-07 09:00" },
  { id: 10, recipient: "+27 81 123 4567", type: "Notification", message: "Your service request has been matched with a provider.", provider: "Vonage", status: "Pending", cost: 0.11, sentAt: "2026-08-08 15:45" },
  { id: 11, recipient: "+27 73 234 5678", type: "OTP", message: "Your SkillzLink verification code is 291847. Valid for 5 minutes.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-06 16:30" },
  { id: 12, recipient: "+27 64 345 6789", type: "Notification", message: "Thabo Molefe cancelled the appointment. We're finding a replacement.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-06 14:15" },
  { id: 13, recipient: "+27 82 456 7890", type: "OTP", message: "Your SkillzLink verification code is 645312. Valid for 5 minutes.", provider: "Vonage", status: "Failed", cost: 0.0, sentAt: "2026-08-06 12:00" },
  { id: 14, recipient: "+27 71 567 8901", type: "Marketing", message: "Refer a friend and earn R100! Share your code today.", provider: "Twilio", status: "Delivered", cost: 0.15, sentAt: "2026-08-05 10:00" },
  { id: 15, recipient: "+27 63 678 9012", type: "Notification", message: "Your payout of R2,400 has been processed to your bank account.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-05 08:30" },
  { id: 16, recipient: "+27 84 789 0123", type: "OTP", message: "Your SkillzLink verification code is 178493. Valid for 5 minutes.", provider: "Fake", status: "Delivered", cost: 0.0, sentAt: "2026-08-04 19:00" },
  { id: 17, recipient: "+27 72 890 1234", type: "Notification", message: "Your review for Bongani Zulu has been published. Thank you!", provider: "Vonage", status: "Delivered", cost: 0.11, sentAt: "2026-08-04 15:45" },
  { id: 18, recipient: "+27 61 901 2345", type: "OTP", message: "Your SkillzLink verification code is 503826. Valid for 5 minutes.", provider: "Twilio", status: "Delivered", cost: 0.12, sentAt: "2026-08-04 10:20" },
];

export function DashboardSmsLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast] = useState(false);
  const [toastMessage] = useState("");
  const [toastType] = useState<"success" | "error">("success");



  useEffect(() => { setTimeout(() => { setLogs(MOCK_SMS); setLoading(false); }, 500); }, []);

  const delivered = logs.filter(l => l.status === "Delivered").length;
  const failed = logs.filter(l => l.status === "Failed").length;
  const monthlyCost = logs.reduce((s, l) => s + l.cost, 0);

  const typeColor: Record<string, string> = { OTP: "bg-[var(--accent-light)] text-[var(--accent-color)]", Notification: "bg-[var(--accent-light)] text-blue-700", Marketing: "bg-[var(--accent-light)] text-[var(--accent-color)]" };
  const statusColor: Record<string, string> = { Delivered: "bg-green-50 text-green-700", Failed: "bg-red-50 text-red-600", Pending: "bg-yellow-50 text-yellow-700" };

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (row) => <span className="text-xs text-[var(--text-secondary)]">#{row.id}</span> },
    { key: "recipient", label: "Recipient", render: (row) => <span className="text-sm font-mono text-[var(--text-primary)]">{row.recipient}</span> },
    { key: "type", label: "Type", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeColor[row.type] || ""}`}>{row.type}</span> },
    { key: "message", label: "Message", render: (row) => <span className="text-[var(--text-secondary)] text-xs truncate max-w-[200px] block">{row.message.length > 50 ? row.message.slice(0, 50) + "…" : row.message}</span> },
    { key: "provider", label: "Provider", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.provider}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status}</span> },
    { key: "cost", label: "Cost", render: (row) => <span className="text-[var(--text-primary)]">${row.cost.toFixed(2)}</span> },
    { key: "sentAt", label: "Sent At", render: (row) => <span className="text-[var(--text-secondary)] text-xs">{row.sentAt}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">SMS Logs</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">All SMS messages sent from the platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Sent</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{logs.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Delivered Rate</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{logs.length ? Math.round((delivered / logs.length) * 100) : 0}%</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Failed</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{failed}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Monthly Cost</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">${monthlyCost.toFixed(2)}</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} loading={loading} exportFileName="sms-logs" />
    </DashboardLayout>
  );
}
