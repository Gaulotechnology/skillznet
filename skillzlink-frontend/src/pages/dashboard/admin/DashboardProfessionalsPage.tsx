import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi, publicApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardProfessionalsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"verify" | "suspend" | "delete" | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  useEffect(() => { fetchProviders(); }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchProviders = () => {
    setLoading(true);
    publicApi.listProviders({})
      .then(res => setProviders(res.data || []))
      .catch(err => { console.error(err); showNotification("Failed to load professionals.", "error"); })
      .finally(() => setLoading(false));
  };

  const openModal = (provider: any, action: "verify" | "suspend" | "delete") => {
    setSelectedProvider(provider); setModalAction(action); setModalOpen(true);
  };

  const executeAction = async () => {
    if (!selectedProvider || !modalAction) return;
    setModalOpen(false);
    try {
      if (modalAction === "verify") {
        await adminApi.verifyProvider(selectedProvider.id);
        showNotification(`${selectedProvider.name}'s identity has been verified.`);
      } else if (modalAction === "suspend") {
        await adminApi.suspendProvider(selectedProvider.id);
        showNotification(`${selectedProvider.name}'s account has been suspended.`, "error");
      } else if (modalAction === "delete") {
        await adminApi.deleteUser(selectedProvider.id);
        showNotification(`${selectedProvider.name}'s account has been deleted.`);
      }
      fetchProviders();
    } catch (err: any) {
      showNotification(`Failed to ${modalAction}: ` + (err.message || "Unknown error"), "error");
    } finally {
      setSelectedProvider(null); setModalAction(null);
    }
  };

  const columns: Column<any>[] = [
    {
      key: "id",
      label: "ID",
      width: "80px",
      render: (p) => <span className="text-sm text-[var(--text-secondary)] font-medium">#{p.id}</span>,
      exportValue: (p) => p.id,
    },
    {
      key: "name",
      label: "Provider Details",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={p.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=f3f4f6&color=4b5563&bold=true`}
              alt={p.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 bg-[var(--bg-secondary)]"
            />
            {p.id_verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                <i className="lnr lnr-checkmark text-[7px]"></i>
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{p.name}</span>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{p.level} Provider</div>
          </div>
        </div>
      ),
      exportValue: (p) => p.name,
    },
    {
      key: "service_category",
      label: "Specialty",
      render: (p) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-primary)]">
          {p.service_category}
        </span>
      ),
      exportValue: (p) => p.service_category,
    },
    {
      key: "id_verified",
      label: "Trust Status",
      render: (p) => p.id_verified ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
        </span>
      ),
      exportValue: (p) => p.id_verified ? 'Verified' : 'Pending',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-[var(--accent-color)] text-white' : 'bg-red-600 text-white'}`}>
          <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-sm`}></i>
          {toastMessage}
        </div>

        {/* Confirmation Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative z-10 shadow-xl">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${modalAction === 'verify' ? 'bg-emerald-50 text-emerald-500' : 'bg-[var(--accent-light)] text-[var(--accent-color)]'}`}>
                <i className={`lnr ${modalAction === 'verify' ? 'lnr-checkmark-circle' : modalAction === 'delete' ? 'lnr-trash' : 'lnr-warning'}`}></i>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-2">
                {modalAction === 'verify' ? 'Verify Provider?' : modalAction === 'delete' ? 'Delete Provider?' : 'Suspend Provider?'}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
                {modalAction === 'verify'
                  ? `Are you sure you want to verify the identity of ${selectedProvider?.name}?`
                  : modalAction === 'delete'
                  ? `Permanently delete ${selectedProvider?.name}? This cannot be undone.`
                  : `Suspend ${selectedProvider?.name}? They will lose platform access.`
                }
              </p>
              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
                <button onClick={executeAction} className={`flex-1 py-2.5 rounded-lg text-white font-medium text-sm transition-colors ${modalAction === 'verify' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                  Yes, {modalAction === 'verify' ? 'Verify' : modalAction === 'delete' ? 'Delete' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={providers}
          loading={loading}
          title="Professionals Directory"
          subtitle="Review provider profiles, verify identities, and manage accounts."
          exportFileName="professionals"
          emptyIcon="lnr lnr-users"
          emptyMessage="No professionals found"
          actions={(p) => (
            <div className="flex items-center justify-end gap-1">
              {!p.id_verified && (
                <button onClick={() => openModal(p, "verify")} className="px-4 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors">
                  Verify
                </button>
              )}
              <button onClick={() => openModal(p, "suspend")} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors" title="Suspend Account">
                <i className="lnr lnr-warning text-sm"></i>
              </button>
              <button onClick={() => openModal(p, "delete")} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors" title="Delete Account">
                <i className="lnr lnr-trash text-sm"></i>
              </button>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
