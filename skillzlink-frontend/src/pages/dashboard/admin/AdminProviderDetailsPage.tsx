import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { UserAvatar } from "../../../components/shared/UserAvatar";
import { adminApi } from "../../../services/api";

export function AdminProviderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    adminApi.getProvider(Number(id))
      .then((res) => setProvider(res.provider))
      .catch(() => setError("Failed to load provider. They may have been deleted."))
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

  const user = provider?.user;
  const userId = provider?.user_id;

  const handleVerify = () => run(() => adminApi.verifyProvider(Number(id)), "Provider identity verified.");
  const handleToggleActive = () => run(() => adminApi.updateUser(userId, { is_active: !user?.is_active }), user?.is_active ? "Provider suspended." : "Provider activated.");
  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete ${user?.name}? This cannot be undone.`)) return;
    await run(() => adminApi.deleteUser(userId), "Provider deleted.");
    setTimeout(() => navigate("/dashboard/admin/professionals"), 600);
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

  if (error || !provider) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <button onClick={() => navigate("/dashboard/admin/professionals")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-flex items-center gap-1">
            <i className="lnr lnr-arrow-left text-sm"></i> Back
          </button>
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error || "Provider not found"}</div>
        </div>
      </DashboardLayout>
    );
  }

  const name = user?.name || "—";
  const verified = !!provider.identity_verified;

  return (
    <DashboardLayout>
      <div className="p-8 relative max-w-4xl">
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[var(--accent-color)] text-white" : "bg-red-600 text-white"}`}>
            {toast.msg}
          </div>
        )}

        <button onClick={() => navigate("/dashboard/admin/professionals")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-5 inline-flex items-center gap-1">
          <i className="lnr lnr-arrow-left text-sm"></i> Back to professionals
        </button>

        {/* Header */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <UserAvatar src={provider.profile_image || user?.avatar} name={name} size={88} />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-primary)]">{provider.service_category || "General"}</span>
                {verified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending verification</span>
                )}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.is_active ? "bg-green-500" : "bg-red-500"}`}></span>
                  {user?.is_active ? "Active" : "Suspended"}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                #{String(provider.id).padStart(6, "0")} · {provider.subscription_tier || "free"} · Member since {provider.created_at ? new Date(provider.created_at).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-6 pt-5 border-t border-[var(--border-color)]">
            {!verified && (
              <button onClick={handleVerify} disabled={busy} className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50">
                <i className="lnr lnr-checkmark-circle mr-1.5"></i>Verify Identity
              </button>
            )}
            <button onClick={handleToggleActive} disabled={busy} className={`px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50 ${user?.is_active ? "border-orange-200 text-orange-600 hover:bg-orange-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
              <i className={`lnr ${user?.is_active ? "lnr-ban" : "lnr-checkmark-circle"} mr-1.5`}></i>{user?.is_active ? "Suspend" : "Activate"}
            </button>
            <button onClick={handleDelete} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 ml-auto">
              <i className="lnr lnr-trash mr-1.5"></i>Delete
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 mb-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <Detail label="Email" value={user?.email || "—"} />
            <Detail label="Phone" value={provider.phone || user?.phone_number || "—"} />
            <Detail label="Address" value={provider.address || "—"} />
            <Detail label="Hourly Rate" value={provider.hourly_rate ? `$${provider.hourly_rate}/hr` : "—"} />
            <Detail label="Rating" value={provider.rating ? `${provider.rating} (${provider.total_ratings ?? 0} reviews)` : "—"} />
            <Detail label="Completed Services" value={String(provider.completed_services ?? 0)} />
            <Detail label="Success Rate" value={provider.success_rate ? `${provider.success_rate}%` : "—"} />
            <Detail label="Response Time" value={provider.response_time || "—"} />
            <Detail label="Identity Number" value={provider.identity_number || "—"} />
          </div>

          {provider.description && (
            <div className="mt-5">
              <div className="text-xs text-[var(--text-secondary)] mb-1">About</div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{provider.description}</p>
            </div>
          )}

          {Array.isArray(provider.skills) && provider.skills.length > 0 && (
            <div className="mt-5">
              <div className="text-xs text-[var(--text-secondary)] mb-2">Skills</div>
              <div className="flex flex-wrap gap-2">
                {provider.skills.map((s: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-primary)]">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Services */}
        {Array.isArray(provider.services) && provider.services.length > 0 && (
          <Section title="Services">
            {provider.services.map((s: any, i: number) => (
              <div key={i} className="flex items-start justify-between py-2 border-b border-[var(--border-color)]/50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{s.name}</div>
                  {s.description && <div className="text-xs text-[var(--text-secondary)]">{s.description}</div>}
                </div>
                {s.price != null && <div className="text-sm font-semibold text-[var(--text-primary)]">${s.price}</div>}
              </div>
            ))}
          </Section>
        )}

        {/* Portfolios */}
        {Array.isArray(provider.portfolios) && provider.portfolios.length > 0 && (
          <Section title="Portfolio">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {provider.portfolios.map((p: any, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden border border-[var(--border-color)]">
                  {p.image_url && <img src={p.image_url} alt={p.title || ""} className="w-full h-28 object-cover" />}
                  <div className="p-2">
                    <div className="text-xs font-medium text-[var(--text-primary)]">{p.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Reviews */}
        {Array.isArray(provider.ratings) && provider.ratings.length > 0 && (
          <Section title="Client Reviews">
            {provider.ratings.map((r: any, i: number) => (
              <div key={i} className="py-3 border-b border-[var(--border-color)]/50 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{r.seeker?.user?.name || "Anonymous"}</span>
                  <span className="text-xs text-amber-500">{"★".repeat(Math.round(r.rating || 0))}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{r.comment}</p>
              </div>
            ))}
          </Section>
        )}
      </div>
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 mb-6 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
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
