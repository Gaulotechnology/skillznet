import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { UserAvatar } from "../../../components/shared/UserAvatar";
import { adminApi, setToken, setCurrentUser } from "../../../services/api";

function backPath(role: string): string {
  switch (role) {
    case "seeker": return "/dashboard/admin/seekers";
    case "agent": return "/dashboard/admin/agents";
    case "affiliate": return "/dashboard/admin/affiliates";
    case "provider": return "/dashboard/admin/professionals";
    default: return "/dashboard/admin/users";
  }
}

export function AdminUserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    adminApi.getUser(Number(id))
      .then((res) => {
        setUser(res.user);
        setName(res.user.name || "");
        setEmail(res.user.email || "");
      })
      .catch(() => setError("Failed to load user. They may have been deleted."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const run = async (fn: () => Promise<any>, success: string) => {
    setBusy(true);
    try {
      await fn();
      notify(success);
      load();
    } catch (e: any) {
      notify(e.message || "Action failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () =>
    run(() => adminApi.updateUser(Number(id), { name, email }), "Profile updated.").then(() => setEditing(false));

  const handleToggleActive = () =>
    run(() => adminApi.updateUser(Number(id), { is_active: !user.is_active }), user.is_active ? "User suspended." : "User activated.");

  const handleUnlock = () => run(() => adminApi.unlockUser(Number(id)), "User unlocked.");

  const handleImpersonate = async () => {
    setBusy(true);
    try {
      const res = await adminApi.impersonateUser(Number(id));
      setToken(res.token);
      setCurrentUser(res.user);
      notify(`Impersonating ${res.user.name}.`);
      setTimeout(() => navigate(`/dashboard/${res.user.role}/overview`), 600);
    } catch (e: any) {
      notify(e.message || "Impersonation failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete ${user?.name}? This cannot be undone.`)) return;
    await run(() => adminApi.deleteUser(Number(id)), "User deleted.");
    setTimeout(() => navigate(backPath(user?.role)), 600);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center py-24">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <button onClick={() => navigate("/dashboard/admin")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-flex items-center gap-1">
            <i className="lnr lnr-arrow-left text-sm"></i> Back
          </button>
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error || "User not found"}</div>
        </div>
      </DashboardLayout>
    );
  }

  const role = user.role || "user";

  return (
    <DashboardLayout>
      <div className="p-8 relative max-w-4xl">
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
            {toast.msg}
          </div>
        )}

        <button onClick={() => navigate(backPath(role))} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-5 inline-flex items-center gap-1">
          <i className="lnr lnr-arrow-left text-sm"></i> Back to {role}s
        </button>

        {/* Profile header */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <UserAvatar src={user.avatar} name={user.name} size={88} />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{user.name || "—"}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-light)] text-[var(--accent-color)] capitalize">{role}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-500"}`}></span>
                  {user.is_active ? "Active" : "Suspended"}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">#{String(user.id).padStart(6, "0")} · Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap mt-6 pt-5 border-t border-[var(--border-color)]">
            <button onClick={() => setEditing(!editing)} disabled={busy} className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50">
              <i className="lnr lnr-pencil mr-1.5"></i>Edit
            </button>
            <button onClick={handleToggleActive} disabled={busy} className={`px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50 ${user.is_active ? "border-orange-200 text-orange-600 hover:bg-orange-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
              <i className={`lnr ${user.is_active ? "lnr-ban" : "lnr-checkmark-circle"} mr-1.5`}></i>{user.is_active ? "Suspend" : "Activate"}
            </button>
            <button onClick={handleUnlock} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50">
              <i className="lnr lnr-lock mr-1.5"></i>Unlock
            </button>
            <button onClick={handleImpersonate} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50">
              <i className="lnr lnr-user mr-1.5"></i>Impersonate
            </button>
            <button onClick={handleDelete} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 ml-auto">
              <i className="lnr lnr-trash mr-1.5"></i>Delete
            </button>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} disabled={busy} className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50">Save</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium">Cancel</button>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <Detail label="Email" value={user.email || "—"} />
            <Detail label="Phone" value={user.phone_number || "—"} />
            <Detail label="Role" value={role} />
            <Detail label="Status" value={user.is_active ? "Active" : "Suspended"} />
            <Detail label="Referral Code" value={user.referral_code || "—"} />
            <Detail label="Referred By" value={user.referred_by || "—"} />
            <Detail label="Failed PIN attempts" value={String(user.failed_pin_attempts ?? 0)} />
            <Detail label="Locked until" value={user.locked_until ? new Date(user.locked_until).toLocaleString() : "—"} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-secondary)] mb-0.5">{label}</div>
      <div className="text-sm font-medium text-[var(--text-primary)]">{value}</div>
    </div>
  );
}
