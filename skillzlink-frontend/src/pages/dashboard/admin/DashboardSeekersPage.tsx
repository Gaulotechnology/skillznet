import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardSeekersPage() {
  const [seekers, setSeekers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => { fetchSeekers(); }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const fetchSeekers = () => {
    setLoading(true);
    adminApi.getUsers()
      .then(res => setSeekers((res.users || []).filter((u: any) => u.role === 'seeker')))
      .catch(() => showNotification("Failed to load seekers.", "error"))
      .finally(() => setLoading(false));
  };

  const openDeleteModal = (user: any) => { setUserToDelete(user); setDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleteModalOpen(false);
    try {
      await adminApi.deleteUser(userToDelete.id);
      showNotification(`${userToDelete.name} deleted.`);
      fetchSeekers();
    } catch { showNotification("Failed to delete seeker.", "error"); }
    finally { setUserToDelete(null); }
  };

  const handleSuspend = async (user: any) => {
    try {
      await adminApi.updateUser(user.id, { status: 'suspended' });
      showNotification(`${user.name} suspended.`);
      fetchSeekers();
    } catch { showNotification("Failed to suspend seeker.", "error"); }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
              {(user.name || 'S').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-900">{user.name || '—'}</span>
            <span className="text-xs text-gray-400 font-normal ml-1.5">#{String(user.id).padStart(6, '0')}</span>
          </div>
        </div>
      ),
      exportValue: (user) => user.name || '',
    },
    { key: "email", label: "Email", render: (user) => <span className="text-gray-500">{user.email || '—'}</span> },
    { key: "phone_number", label: "Phone", render: (user) => <span className="text-gray-500">{user.phone_number || '—'}</span> },
    {
      key: "status",
      label: "Status",
      render: (user) => user.status === 'suspended' ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Suspended
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
        </span>
      ),
      exportValue: (user) => user.status === 'suspended' ? 'Suspended' : 'Active',
    },
    {
      key: "created_at",
      label: "Created",
      render: (user) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
        </span>
      ),
      exportValue: (user) => user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
          <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-sm`}></i>
          {toastMessage}
        </div>

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative z-10 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="lnr lnr-trash"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Seeker?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Permanently delete <strong>{userToDelete?.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={seekers}
          loading={loading}
          title="Seekers"
          subtitle={`${seekers.length} total registered seekers`}
          selectable
          exportFileName="seekers"
          emptyIcon="lnr lnr-users"
          emptyMessage="No seekers found"
          actions={(user) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => handleSuspend(user)} title="Suspend Seeker" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <i className="lnr lnr-ban text-sm"></i>
              </button>
              <button onClick={() => openDeleteModal(user)} title="Delete Seeker" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <i className="lnr lnr-trash text-sm"></i>
              </button>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
