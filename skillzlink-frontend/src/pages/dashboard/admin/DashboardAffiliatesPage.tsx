import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const MOCK_AFFILIATES = [
  { id: 1, name: "Kabelo Mosia", email: "kabelo.m@gmail.com", avatar: null, referralCode: "AFF-KM2024", totalReferrals: 34, earnings: 12500, status: "active", joinedAt: "2025-06-15" },
  { id: 2, name: "Lindiwe Shabalala", email: "lindiwe.s@outlook.com", avatar: null, referralCode: "AFF-LS2024", totalReferrals: 21, earnings: 7800, status: "active", joinedAt: "2025-07-22" },
  { id: 3, name: "Thandi Ngcobo", email: "thandi.n@yahoo.com", avatar: null, referralCode: "AFF-TN2025", totalReferrals: 45, earnings: 18200, status: "active", joinedAt: "2025-03-10" },
  { id: 4, name: "Sifiso Mabena", email: "sifiso.m@gmail.com", avatar: null, referralCode: "AFF-SM2025", totalReferrals: 8, earnings: 2400, status: "inactive", joinedAt: "2025-11-01" },
  { id: 5, name: "Nokuthula Dube", email: "nokuthula.d@hotmail.com", avatar: null, referralCode: "AFF-ND2024", totalReferrals: 56, earnings: 22100, status: "active", joinedAt: "2025-02-14" },
  { id: 6, name: "Mpho Radebe", email: "mpho.r@gmail.com", avatar: null, referralCode: "AFF-MR2025", totalReferrals: 12, earnings: 4500, status: "active", joinedAt: "2025-09-30" },
  { id: 7, name: "Buhle Mkhize", email: "buhle.mk@outlook.com", avatar: null, referralCode: "AFF-BM2025", totalReferrals: 3, earnings: 900, status: "inactive", joinedAt: "2026-01-05" },
  { id: 8, name: "Thabiso Nene", email: "thabiso.n@gmail.com", avatar: null, referralCode: "AFF-TN2024", totalReferrals: 29, earnings: 10800, status: "active", joinedAt: "2025-05-18" },
  { id: 9, name: "Zinhle Buthelezi", email: "zinhle.b@yahoo.com", avatar: null, referralCode: "AFF-ZB2025", totalReferrals: 17, earnings: 6300, status: "active", joinedAt: "2025-08-25" },
  { id: 10, name: "Lwazi Mthethwa", email: "lwazi.m@gmail.com", avatar: null, referralCode: "AFF-LM2025", totalReferrals: 41, earnings: 15600, status: "active", joinedAt: "2025-04-02" },
  { id: 11, name: "Nompilo Zwane", email: "nompilo.z@outlook.com", avatar: null, referralCode: "AFF-NZ2025", totalReferrals: 6, earnings: 1800, status: "inactive", joinedAt: "2026-03-11" },
  { id: 12, name: "Sandile Gumede", email: "sandile.g@gmail.com", avatar: null, referralCode: "AFF-SG2024", totalReferrals: 38, earnings: 14200, status: "active", joinedAt: "2025-01-20" },
  { id: 13, name: "Busisiwe Koza", email: "busisiwe.k@hotmail.com", avatar: null, referralCode: "AFF-BK2025", totalReferrals: 22, earnings: 8400, status: "active", joinedAt: "2025-10-07" },
  { id: 14, name: "Mfundo Vilakazi", email: "mfundo.v@gmail.com", avatar: null, referralCode: "AFF-MV2025", totalReferrals: 15, earnings: 5700, status: "active", joinedAt: "2025-12-15" },
  { id: 15, name: "Anele Majola", email: "anele.maj@yahoo.com", avatar: null, referralCode: "AFF-AM2025", totalReferrals: 9, earnings: 3200, status: "inactive", joinedAt: "2026-02-28" },
];

export function DashboardAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    setTimeout(() => { setAffiliates(MOCK_AFFILIATES); setLoading(false); }, 500);
  }, []);

  const handleSuspend = (aff: any) => {
    setAffiliates(prev => prev.map(a => a.id === aff.id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a));
    toast(`${aff.name} ${aff.status === "active" ? "suspended" : "activated"}.`);
  };

  const columns: Column<any>[] = [
    {
      key: "name", label: "Affiliate", render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar ? <img src={row.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /> : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">{(row.name || "A").charAt(0)}</div>
          )}
          <span className="text-sm font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => <span className="text-gray-500">{row.email}</span> },
    { key: "referralCode", label: "Referral Code", render: (row) => <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded text-gray-700">{row.referralCode}</code> },
    { key: "totalReferrals", label: "Referrals", render: (row) => <span className="text-gray-700">{row.totalReferrals}</span> },
    { key: "earnings", label: "Earnings", render: (row) => <span className="text-gray-700">R {row.earnings.toLocaleString()}</span> },
    {
      key: "status", label: "Status", render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {row.status}
        </span>
      ),
    },
    { key: "joinedAt", label: "Joined", render: (row) => <span className="text-gray-500">{row.joinedAt}</span> },
  ];

  return (
    <DashboardLayout>
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${toastType === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}>
        <i className={`lnr ${toastType === "success" ? "lnr-checkmark-circle" : "lnr-warning"}`}></i>
        {toastMessage}
      </div>
      <DataTable
        columns={columns}
        data={affiliates}
        loading={loading}
        title="Affiliates"
        subtitle="Manage affiliate partners and referrals"
        exportFileName="affiliates"
        headerActions={
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors" onClick={() => toast("Add Affiliate modal coming soon.")}>
            Add Affiliate
          </button>
        }
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => toast("View details coming soon.")} className="p-1.5 text-gray-400 hover:text-gray-700 rounded"><i className="lnr lnr-eye text-sm"></i></button>
            <button onClick={() => toast("Edit modal coming soon.")} className="p-1.5 text-gray-400 hover:text-gray-700 rounded"><i className="lnr lnr-pencil text-sm"></i></button>
            <button onClick={() => handleSuspend(row)} className="p-1.5 text-gray-400 hover:text-orange-600 rounded"><i className="lnr lnr-power-switch text-sm"></i></button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
