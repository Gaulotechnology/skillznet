import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { fetchJson, apiBaseUrl, adminApi } from "../../../services/api";

interface Permission {
  id: number;
  key: string;
  label: string;
  category: string;
}

export function DashboardRolesPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, number[]>>({});
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [permRes, rolesRes] = await Promise.all([
        fetchJson<any>(apiBaseUrl() + '/admin/permissions'),
        adminApi.getRoles(),
      ]);
      setPermissions(permRes.permissions || []);
      setRolePermissions(permRes.role_permissions || {});
      setRoles(rolesRes.roles || []);
    } catch (err) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (role: string, permissionId: number) => {
    setRolePermissions(prev => {
      const current = prev[role] || [];
      const updated = current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId];
      return { ...prev, [role]: updated };
    });
  };

  const handleSave = async (role: string) => {
    setSaving(true);
    try {
      await fetchJson<any>(apiBaseUrl() + '/admin/permissions/sync', {
        method: 'POST',
        body: JSON.stringify({
          role,
          permissions: rolePermissions[role] || []
        })
      });
      showToast(`${role.charAt(0).toUpperCase() + role.slice(1)} permissions updated!`, "success");
    } catch (err) {
      showToast(`Failed to update ${role} permissions`, "error");
    } finally {
      setSaving(false);
    }
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: "", description: "" });
    setRoleModalOpen(true);
  };

  const openEditRole = (role: any) => {
    setEditingRole(role);
    setRoleForm({ name: role.name || "", description: role.description || "" });
    setRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    setSaving(true);
    try {
      if (editingRole) {
        await adminApi.updateRole(editingRole.id, roleForm);
        showToast("Role updated!", "success");
      } else {
        await adminApi.createRole(roleForm);
        showToast("Role created!", "success");
      }
      setRoleModalOpen(false);
      fetchData();
    } catch (err) {
      showToast("Failed to save role", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm("Delete this role?")) return;
    try {
      await adminApi.deleteRole(id);
      showToast("Role deleted!", "success");
      fetchData();
    } catch (err) {
      showToast("Failed to delete role", "error");
    }
  };

  const roleNames = roles.length > 0 ? roles.map((r: any) => r.name) : ['admin', 'agent', 'affiliate', 'provider', 'seeker'];

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <DashboardLayout>
      <div className="p-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-color)] mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">Roles &amp; Permissions</h1>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">Control access rights across the platform</p>
          </div>
          <button onClick={openCreateRole} className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-colors text-sm">
            Create Role
          </button>
        </div>

        {/* Roles List */}
        {roles.length > 0 && (
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Managed Roles</h3>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {roles.map((role: any) => (
                <div key={role.id} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div>
                    <span className="font-medium text-sm text-[var(--text-primary)] capitalize">{role.name}</span>
                    {role.description && <span className="text-xs text-[var(--text-secondary)] ml-3">{role.description}</span>}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => openEditRole(role)} className="text-xs font-medium text-[var(--text-primary)] underline hover:text-[var(--accent-color)]">Edit</button>
                    <button onClick={() => handleDeleteRole(role.id)} className="text-xs font-medium text-rose-600 underline hover:text-rose-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-10 h-10 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-5">
            {roleNames.map(role => (
              <div key={role} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                <div className="px-5 py-3.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/40">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center">
                      <i className="lnr lnr-user text-sm"></i>
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] capitalize">{role}</h3>
                  </div>
                  <button
                    onClick={() => handleSave(role)}
                    disabled={saving}
                    className="px-4 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-lg transition-colors text-xs"
                  >
                    Save
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 pb-1.5 border-b border-[var(--border-color)]">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-3">
                        {perms.map(perm => {
                          const isChecked = (rolePermissions[role] || []).includes(perm.id);
                          return (
                            <label key={perm.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
                              <div className="pt-0.5 shrink-0">
                                <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${isChecked ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-transparent border-2 border-[var(--border-color)]'}`}>
                                  {isChecked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input type="checkbox" className="hidden" checked={isChecked} onChange={() => handleToggle(role, perm.id)} />
                              </div>
                              <div>
                                <div className="font-medium text-[var(--text-primary)] text-xs leading-tight">{perm.label}</div>
                                <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">{perm.key}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {permissions.length === 0 && (
                    <div className="text-center py-6 text-sm text-[var(--text-secondary)]">No permissions defined in the database.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg-primary)] rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{editingRole ? "Edit Role" : "Create Role"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Role Name</label>
                <input className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]" placeholder="e.g. manager" value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description (optional)</label>
                <input className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]" placeholder="Brief description" value={roleForm.description} onChange={e => setRoleForm({...roleForm, description: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={() => setRoleModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
              <button onClick={handleSaveRole} disabled={saving} className="flex-1 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl text-sm transition-colors">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up z-50">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'}`}></i>
          </div>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
