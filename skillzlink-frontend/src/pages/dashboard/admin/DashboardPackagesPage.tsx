import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

export function DashboardPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", period: "/ Month", popular: false, features: "" });
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPackages();
      setPackages(res.packages || []);
    } catch (err) {
      showToast("Failed to load packages", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPkg(null);
    setForm({ name: "", description: "", price: "", period: "/ Month", popular: false, features: "" });
    setModalOpen(true);
  };

  const openEdit = (pkg: any) => {
    setEditingPkg(pkg);
    setForm({
      name: pkg.name || "",
      description: pkg.description || "",
      price: String(pkg.price || ""),
      period: pkg.period || "/ Month",
      popular: !!pkg.popular,
      features: JSON.stringify(pkg.features || [], null, 2),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let features: any[] = [];
      try { features = JSON.parse(form.features); } catch { features = []; }
      const payload = { ...form, features };
      if (editingPkg) {
        await adminApi.updatePackage(editingPkg.id, payload);
        showToast("Package updated!", "success");
      } else {
        await adminApi.createPackage(payload);
        showToast("Package created!", "success");
      }
      setModalOpen(false);
      fetchPackages();
    } catch (err) {
      showToast("Failed to save package", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this package?")) return;
    try {
      await adminApi.deletePackage(id);
      showToast("Package deleted!", "success");
      fetchPackages();
    } catch (err) {
      showToast("Failed to delete package", "error");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Subscription Packages</h2>
          <p className="text-[var(--text-secondary)] mt-2">Manage pricing plans and subscription tiers available to service providers.</p>
          <button onClick={openCreate} className="mt-4 px-6 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
            + Create Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {packages.map((pkg: any, idx: number) => (
            <div 
              key={pkg.id || idx} 
              className={`relative bg-white rounded-3xl p-8 border ${
                pkg.popular 
                  ? 'border-[var(--accent-color)] shadow-2xl shadow-lg scale-105 z-10' 
                  : 'border-[var(--border-color)] shadow-xl shadow-slate-200/50'
              } flex flex-col`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-[var(--accent-light)]0 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full flex items-center gap-1.5 shadow-md">
                    <i className="lnr lnr-star"></i> Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8 pt-4">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{pkg.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 h-10">{pkg.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-black text-[var(--text-primary)] tracking-tight">${pkg.price}</span>
                  <span className="text-[var(--text-secondary)] font-medium mb-1">{pkg.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {(pkg.features || []).map((feature: any, fIdx: number) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm">
                    {feature.value === true ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <i className="lnr lnr-checkmark-circle"></i>
                      </div>
                    ) : feature.value === false ? (
                      <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] text-slate-300 flex items-center justify-center shrink-0">
                        <i className="lnr lnr-cross-circle"></i>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center shrink-0 font-bold text-xs">
                        {feature.value}
                      </div>
                    )}
                    <span className={feature.value === false ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)] font-medium"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <button 
                  onClick={() => openEdit(pkg)}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    pkg.popular 
                      ? 'bg-[var(--accent-light)]0 text-white hover:bg-rose-600 shadow-lg shadow-lg' 
                      : 'bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]'
                  }`}
                >
                  Edit Package
                </button>
                <button 
                  onClick={() => handleDelete(pkg.id)}
                  className="px-4 py-4 rounded-xl font-bold text-sm bg-[var(--accent-light)] text-[var(--accent-color)] hover:bg-rose-100 transition-colors"
                >
                  <i className="lnr lnr-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{editingPkg ? "Edit Package" : "Create Package"}</h3>
            <div className="space-y-4">
              <input className="w-full border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)]" placeholder="Package Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input className="w-full border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)]" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <input className="w-full border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)]" placeholder="Price (e.g. 37)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <input className="w-full border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)]" placeholder="Period (e.g. / Month)" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="checkbox" checked={form.popular} onChange={e => setForm({...form, popular: e.target.checked})} /> Mark as Popular
              </label>
              <textarea className="w-full border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)] h-32 font-mono" placeholder='Features JSON array e.g. [{"name":"...", "value": true}]' value={form.features} onChange={e => setForm({...form, features: e.target.value})} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-sm hover:bg-[var(--bg-secondary)]">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-xl text-sm shadow-sm">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-[var(--accent-color)] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-up z-50">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-emerald-500' : 'bg-[var(--accent-light)]0'}`}>
            <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'}`}></i>
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
