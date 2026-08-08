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
      setPermissions(permRes.permissions);
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Roles & Permissions</h2>
            <p className="text-slate-500 mt-1">Control access rights across the platform.</p>
          </div>
          <button onClick={openCreateRole} className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
            + Create Role
          </button>
        </div>

        {/* Roles List */}
        {roles.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Managed Roles</h3>
            </div>
            <div className="p-4 space-y-2">
              {roles.map((role: any) => (
                <div key={role.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-bold text-slate-800 capitalize">{role.name}</span>
                    {role.description && <span className="text-sm text-slate-500 ml-3">{role.description}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditRole(role)} className="px-3 py-1.5 text-xs font-bold text-fuchsia-600 bg-fuchsia-50 rounded-lg hover:bg-fuchsia-100">Edit</button>
                    <button onClick={() => handleDeleteRole(role.id)} className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {roleNames.map(role => (
              <div key={role} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center">
                      <i className="lnr lnr-shield text-xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 capitalize">{role}</h3>
                  </div>
                  <button 
                    onClick={() => handleSave(role)}
                    disabled={saving}
                    className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl transition-colors text-sm shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
                
                <div className="p-6 space-y-8">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {perms.map(perm => {
                          const isChecked = (rolePermissions[role] || []).includes(perm.id);
                          return (
                            <label key={perm.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                              <div className="pt-1">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isChecked ? 'bg-fuchsia-500 border-fuchsia-500' : 'border border-slate-300'}`}>
                                  {isChecked && <i className="lnr lnr-checkmark-circle text-white text-xs font-bold"></i>}
                                </div>
                                <input 
                                  type="checkbox" 
                                  className="hidden" 
                                  checked={isChecked}
                                  onChange={() => handleToggle(role, perm.id)}
                                />
                              </div>
                              <div>
                                <div className="font-bold text-slate-700 text-sm">{perm.label}</div>
                                <div className="text-xs text-slate-400 font-mono mt-0.5">{perm.key}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {permissions.length === 0 && (
                    <div className="text-center py-8 text-slate-400 font-medium">
                      No permissions defined in the database.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-5">
            <h3 className="text-xl font-bold text-slate-800">{editingRole ? "Edit Role" : "Create Role"}</h3>
            <div className="space-y-4">
              <input className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fuchsia-400" placeholder="Role Name" value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} />
              <input className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fuchsia-400" placeholder="Description (optional)" value={roleForm.description} onChange={e => setRoleForm({...roleForm, description: e.target.value})} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRoleModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleSaveRole} disabled={saving} className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl text-sm shadow-sm">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-up z-50">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'}`}></i>
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
