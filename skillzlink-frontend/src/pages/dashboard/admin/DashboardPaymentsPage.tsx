import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_PAYMENTS = [
  { id: "TXN-001", payer: "Nomsa Khoza", payerAvatar: null, recipient: "Thabo Molefe", recipientAvatar: null, amount: 850, method: "Card", status: "Completed", date: "2026-08-08 09:15" },
  { id: "TXN-002", payer: "David Pillay", payerAvatar: null, recipient: "Sipho Nkosi", recipientAvatar: null, amount: 1600, method: "Bank", status: "Pending", date: "2026-08-08 11:30" },
  { id: "TXN-003", payer: "Fatima Essop", payerAvatar: null, recipient: "Lerato Mahlangu", recipientAvatar: null, amount: 450, method: "Mobile Money", status: "Completed", date: "2026-08-07 14:45" },
  { id: "TXN-004", payer: "Johan van Wyk", payerAvatar: null, recipient: "Bongani Zulu", recipientAvatar: null, amount: 600, method: "Card", status: "Completed", date: "2026-08-07 08:20" },
  { id: "TXN-005", payer: "Amahle Ndlovu", payerAvatar: null, recipient: "Ayanda Khumalo", recipientAvatar: null, amount: 3200, method: "Bank", status: "Completed", date: "2026-08-06 10:50" },
  { id: "TXN-006", payer: "Pieter Botha", payerAvatar: null, recipient: "Zanele Mthembu", recipientAvatar: null, amount: 5500, method: "Card", status: "Pending", date: "2026-08-09 07:00" },
  { id: "TXN-007", payer: "Thandiwe Miya", payerAvatar: null, recipient: "Mandla Sithole", recipientAvatar: null, amount: 350, method: "Mobile Money", status: "Refunded", date: "2026-08-05 15:30" },
  { id: "TXN-008", payer: "Ravi Naidoo", payerAvatar: null, recipient: "Precious Mokoena", recipientAvatar: null, amount: 1200, method: "Card", status: "Completed", date: "2026-08-08 14:10" },
  { id: "TXN-009", payer: "Grace Moyo", payerAvatar: null, recipient: "Kagiso Motaung", recipientAvatar: null, amount: 8500, method: "Bank", status: "Pending", date: "2026-08-10 12:00" },
  { id: "TXN-010", payer: "Willem Pretorius", payerAvatar: null, recipient: "Nomvula Cele", recipientAvatar: null, amount: 2200, method: "Card", status: "Failed", date: "2026-08-04 06:30" },
  { id: "TXN-011", payer: "Sibongile Mhlongo", payerAvatar: null, recipient: "Tshepo Langa", recipientAvatar: null, amount: 700, method: "Mobile Money", status: "Completed", date: "2026-08-08 16:20" },
  { id: "TXN-012", payer: "Ahmed Patel", payerAvatar: null, recipient: "Palesa Ndaba", recipientAvatar: null, amount: 2400, method: "Bank", status: "Completed", date: "2026-08-03 09:45" },
  { id: "TXN-013", payer: "Mpumi Tshabalala", payerAvatar: null, recipient: "Vuyo Jansen", recipientAvatar: null, amount: 550, method: "Card", status: "Completed", date: "2026-08-08 10:55" },
  { id: "TXN-014", payer: "Jan Erasmus", payerAvatar: null, recipient: "Dineo Maseko", recipientAvatar: null, amount: 7800, method: "Bank", status: "Pending", date: "2026-08-11 08:00" },
  { id: "TXN-015", payer: "Noluthando Jwara", payerAvatar: null, recipient: "Kabelo Mosia", recipientAvatar: null, amount: 4500, method: "Card", status: "Completed", date: "2026-08-02 07:30" },
  { id: "TXN-016", payer: "Christo Venter", payerAvatar: null, recipient: "Lindiwe Shabalala", recipientAvatar: null, amount: 1800, method: "Mobile Money", status: "Completed", date: "2026-08-01 13:25" },
];

export function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => { setTimeout(() => { setPayments(MOCK_PAYMENTS); setLoading(false); }, 500); }, []);

  const totalRevenue = payments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);
  const thisMonth = payments.filter(p => p.date.startsWith("2026-08") && p.status === "Completed").reduce((s, p) => s + p.amount, 0);
  const pendingPayouts = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const refunds = payments.filter(p => p.status === "Refunded").reduce((s, p) => s + p.amount, 0);

  const statusColor: Record<string, string> = { Completed: "bg-green-50 text-green-700", Pending: "bg-yellow-50 text-yellow-700", Failed: "bg-red-50 text-red-600", Refunded: "bg-gray-100 text-gray-600" };

  const columns: Column<any>[] = [
    { key: "id", label: "Transaction ID", render: (row) => <span className="text-xs font-mono text-gray-700">{row.id}</span> },
    {
      key: "payer", label: "Payer", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">{row.payer.charAt(0)}</div>
          <span className="text-sm text-gray-900">{row.payer}</span>
        </div>
      ),
    },
    {
      key: "recipient", label: "Recipient", render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">{row.recipient.charAt(0)}</div>
          <span className="text-sm text-gray-900">{row.recipient}</span>
        </div>
      ),
    },
    { key: "amount", label: "Amount", render: (row) => <span className="text-gray-900 font-medium">R {row.amount.toLocaleString()}</span> },
    { key: "method", label: "Method", render: (row) => <span className="text-gray-500 text-xs">{row.method}</span> },
    { key: "status", label: "Status", render: (row) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status] || ""}`}>{row.status}</span> },
    { key: "date", label: "Date", render: (row) => <span className="text-gray-500 text-xs">{row.date}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">All payment transactions</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors" onClick={() => toast("Payout modal coming soon.")}>
          Payout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">R {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Month</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">R {thisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Payouts</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">R {pendingPayouts.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Refunds</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">R {refunds.toLocaleString()}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        exportFileName="payments"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => toast("View receipt coming soon.")} className="p-1.5 text-gray-400 hover:text-gray-700 rounded"><i className="lnr lnr-file-empty text-sm"></i></button>
            {row.status === "Completed" && <button onClick={() => toast("Refund modal coming soon.")} className="p-1.5 text-gray-400 hover:text-orange-600 rounded"><i className="lnr lnr-undo text-sm"></i></button>}
          </div>
        )}
      />
    </DashboardLayout>
  );
}
