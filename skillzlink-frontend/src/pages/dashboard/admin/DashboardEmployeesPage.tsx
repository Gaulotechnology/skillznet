import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi, setToken, setCurrentUser } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/shared/DataTable";
import { UserAvatar } from "../../../components/shared/UserAvatar";

export function DashboardEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const fetchEmployees = () => {
    setLoading(true);
    adminApi.getUsers()
      .then(res => setEmployees((res.users || []).filter((u: any) => u.role === 'admin')))
      .catch(() => showNotification("Failed to load employees.", "error"))
      .finally(() => setLoading(false));
  };

  const openEditModal = (u: any) => {
    setEditingId(u.id);
    setFormData({ name: u.name, email: u.email, password: "" });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", password: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await adminApi.updateUser(editingId, formData);
        showNotification(`${formData.name} updated.`);
      } else {
        await adminApi.createUser({ ...formData, role: "admin" });
        showNotification(`${formData.name} added as employee.`);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err: any) {
      showNotification("Failed: " + (err.message || "Unknown error"), "error");
    } finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleteModalOpen(false);
    try {
      await adminApi.deleteUser(userToDelete.id);
      showNotification(`${userToDelete.name} removed.`);
      fetchEmployees();
    } catch { showNotification("Failed to delete.", "error"); }
    finally { setUserToDelete(null); }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Employee",
      render: (u) => (
        <div className="flex items-center gap-3">
          <UserAvatar src={u.avatar} name={u.name} size={32} />
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{u.name}</span>
            <span className="text-xs text-[var(--text-secondary)] font-normal ml-1.5">#{String(u.id).padStart(6, '0')}</span>
          </div>
        </div>
      ),
      exportValue: (u) => u.name,
    },
    { key: "email", label: "Email", render: (u) => <span className="text-[var(--text-secondary)]">{u.email}</span> },
    {
      key: "status",
      label: "Status",
      render: () => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
        </span>
      ),
      exportValue: () => "Active",
    },
    {
      key: "created_at",
      label: "Joined",
      render: (u) => (
        <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
          {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
      exportValue: (u) => new Date(u.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-[var(--accent-color)] text-white' : 'bg-red-600 text-white'}`}>
          <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-sm`}></i>
          {toastMessage}
        </div>

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative z-10 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="lnr lnr-trash"></i>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-2">Remove Employee?</h3>
              <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
                Remove <strong>{userToDelete?.name}</strong> from the admin team? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors">Remove</button>
              </div>
            </div>
          </div>
        )}

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          title="Employees"
          subtitle="Admin team members (non-super-admin staff)"
          selectable
          exportFileName="employees"
          emptyIcon="lnr lnr-users"
          emptyMessage="No employees found"
          actions={(u) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => openEditModal(u)} title="Edit" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <i className="lnr lnr-pencil text-sm"></i>
              </button>
              <button
                title="Login as Employee"
                onClick={async () => {
                  try {
                    const res: any = await adminApi.impersonateUser(u.id);
                    const prevToken = localStorage.getItem("skillzlink_token") || "";
                    const prevUser = localStorage.getItem("skillzlink_user") || "";
                    localStorage.setItem("skillzlink_prev_token", prevToken);
                    localStorage.setItem("skillzlink_prev_user", prevUser);
                    setToken(res.token);
                    setCurrentUser(res.user);
                    window.dispatchEvent(new Event("auth_change"));
                    showNotification(`Now logged in as ${u.name}`);
                    setTimeout(() => navigate('/dashboard/admin/overview'), 800);
                  } catch { showNotification("Impersonation failed.", "error"); }
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <i className="lnr lnr-enter text-sm"></i>
              </button>
              <button onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }} title="Remove" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <i className="lnr lnr-trash text-sm"></i>
              </button>
            </div>
          )}
          headerActions={
            <button onClick={openCreateModal} className="px-4 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2 whitespace-nowrap">
              <i className="lnr lnr-plus-circle"></i> Add Employee
            </button>
          }
        />

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !formLoading && setIsModalOpen(false)} />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{editingId ? "Edit Employee" : "Add New Employee"}</h3>
                <button onClick={() => !formLoading && setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <i className="lnr lnr-cross text-xs"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={formLoading} placeholder="Jane Doe" className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={formLoading} placeholder="jane@company.com" className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Password {editingId && <span className="text-[var(--text-secondary)] font-normal normal-case">(leave blank to keep)</span>}
                  </label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} disabled={formLoading} placeholder="••••••••" className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors" />
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-3 flex items-start gap-2 text-sm text-[var(--text-primary)]">
                  <i className="lnr lnr-information-circle mt-0.5 shrink-0"></i>
                  Employees are granted <strong>admin</strong> access to the dashboard.
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => !formLoading && setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
                  <button type="submit" disabled={formLoading} className="flex-1 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {formLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving…</> : (editingId ? "Update" : "Add Employee")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
