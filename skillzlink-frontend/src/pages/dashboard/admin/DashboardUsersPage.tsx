import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi, setToken, setCurrentUser } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "seeker" });
  const [formLoading, setFormLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const fetchUsers = () => {
    setLoading(true);
    adminApi.getUsers().then(res => {
      setUsers(res.users || []);
    }).catch(() => showNotification("Failed to load users.", "error"))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingUserId) {
        await adminApi.updateUser(editingUserId, formData);
        showNotification(`${formData.name} updated successfully.`);
      } else {
        await adminApi.createUser(formData);
        showNotification(`${formData.name} created successfully.`);
      }
      setIsModalOpen(false);
      setEditingUserId(null);
      setFormData({ name: "", email: "", password: "", role: "seeker" });
      fetchUsers();
    } catch (err: any) {
      showNotification(`Failed: ` + (err.message || "Unknown error"), "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUserId(user.id);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user: any) => { setUserToDelete(user); setDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleteModalOpen(false);
    try {
      await adminApi.deleteUser(userToDelete.id);
      showNotification(`${userToDelete.name} deleted.`);
      fetchUsers();
    } catch { showNotification("Failed to delete user.", "error"); }
    finally { setUserToDelete(null); }
  };

  const roleStyle: Record<string, string> = {
    admin: "bg-[var(--accent-light)] text-[var(--accent-color)]",
    super_admin: "bg-[var(--accent-light)] text-[var(--accent-color)]",
    provider: "bg-[var(--accent-light)] text-blue-700",
    agent: "bg-amber-50 text-amber-700",
    seeker: "bg-teal-50 text-teal-700",
  };

  const getRoleLabel = (r: string) => ({
    admin: "Admin", super_admin: "Super Admin", provider: "Provider",
    agent: "Agent", affiliate: "Affiliate", seeker: "Seeker"
  }[r] ?? r);

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{user.name}</span>
            <span className="text-xs text-[var(--text-secondary)] font-normal ml-1.5">#{String(user.id).padStart(6, '0')}</span>
          </div>
        </div>
      ),
      exportValue: (user) => user.name,
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${roleStyle[user.role] || 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'}`}>
          {getRoleLabel(user.role)}
        </span>
      ),
      exportValue: (user) => getRoleLabel(user.role),
    },
    { key: "email", label: "Email", render: (user) => <span className="text-[var(--text-secondary)]">{user.email}</span> },
    {
      key: "is_active",
      label: "Status",
      render: (user) => {
        const isLocked = user.locked_until && new Date(user.locked_until) > new Date();
        if (isLocked) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Locked
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        );
      },
      exportValue: (user) => user.locked_until && new Date(user.locked_until) > new Date() ? "Locked" : "Active",
    },
    {
      key: "created_at",
      label: "Created",
      render: (user) => (
        <span className="text-[var(--text-secondary)] text-sm whitespace-nowrap">
          {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
      exportValue: (user) => new Date(user.created_at).toLocaleDateString(),
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

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative z-10 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="lnr lnr-trash"></i>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-2">Delete User?</h3>
              <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
                Permanently delete <strong>{userToDelete?.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          title="Platform Users"
          subtitle={`${users.length} total registered users`}
          selectable
          exportFileName="users"
          emptyIcon="lnr lnr-users"
          emptyMessage="No users found"
          actions={(user) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => openEditModal(user)} title="Edit User" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <i className="lnr lnr-pencil text-sm"></i>
              </button>
              <button
                onClick={async () => {
                  try {
                    const res: any = await adminApi.impersonateUser(user.id);
                    const prevToken = localStorage.getItem("skillzlink_token") || "";
                    const prevUser = localStorage.getItem("skillzlink_user") || "";
                    localStorage.setItem("skillzlink_prev_token", prevToken);
                    localStorage.setItem("skillzlink_prev_user", prevUser);
                    setToken(res.token);
                    setCurrentUser(res.user);
                    window.dispatchEvent(new Event("auth_change"));
                    showNotification(`Now logged in as ${user.name}`);
                    setTimeout(() => navigate(`/dashboard/${res.user.role === 'admin' ? 'admin' : res.user.role === 'provider' ? 'provider' : 'seeker'}/overview`), 800);
                  } catch {
                    showNotification("Impersonation failed.", "error");
                  }
                }}
                title="Login as this user"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <i className="lnr lnr-enter text-sm"></i>
              </button>
              {user.locked_until && new Date(user.locked_until) > new Date() && (
                <button
                  onClick={async () => {
                    try {
                      await adminApi.unlockUser(user.id);
                      showNotification(`${user.name}'s account has been unlocked.`);
                      fetchUsers();
                    } catch {
                      showNotification("Failed to unlock account.", "error");
                    }
                  }}
                  title="Unlock Account"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <i className="lnr lnr-lock-open text-sm"></i>
                </button>
              )}
              <button title="Suspend User" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <i className="lnr lnr-ban text-sm"></i>
              </button>
              <button onClick={() => openDeleteModal(user)} title="Delete User" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <i className="lnr lnr-trash text-sm"></i>
              </button>
            </div>
          )}
          headerActions={
            <button
              onClick={() => { setEditingUserId(null); setFormData({ name: "", email: "", password: "", role: "seeker" }); setIsModalOpen(true); }}
              className="px-4 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <i className="lnr lnr-plus-circle"></i> Add User
            </button>
          }
        />

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !formLoading && setIsModalOpen(false)} />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{editingUserId ? "Edit User" : "Create New User"}</h3>
                <button onClick={() => !formLoading && setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <i className="lnr lnr-cross text-xs"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={formLoading} placeholder="John Doe" className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={formLoading} placeholder="john@example.com" className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Password {editingUserId && <span className="text-[var(--text-secondary)] font-normal normal-case">(leave blank to keep)</span>}
                  </label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingUserId} disabled={formLoading} placeholder="••••••••" className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} disabled={formLoading} className="w-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors">
                    <option value="seeker">Seeker</option>
                    <option value="provider">Provider</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => !formLoading && setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
                  <button type="submit" disabled={formLoading} className="flex-1 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {formLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving…</> : (editingUserId ? "Update User" : "Create User")}
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
