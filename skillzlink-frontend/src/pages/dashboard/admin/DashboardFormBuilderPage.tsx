import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { publicApi, adminApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

const FIELD_TYPES = ["text", "textarea", "dropdown", "number", "file", "checkbox"];

const emptyForm = {
  label: "", name: "", type: "text", placeholder: "", is_required: false,
  sort_order: 0, options_raw: "", category_name: ""
};

export function DashboardFormBuilderPage() {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");

  useEffect(() => {
    fetchFields();
    publicApi.getCategories().then(res => setCategories(res.categories || []));
  }, []);

  const fetchFields = () => {
    setLoading(true);
    adminApi.getRegistrationFields()
      .then(res => setFields(res.fields || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const autoName = (label: string) =>
    label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    if (!editingId) setForm(f => ({ ...f, label, name: autoName(label) }));
    else setForm(f => ({ ...f, label }));
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCategoryTabChange = (catName: string) => {
    setSelectedCategoryTab(catName);
    if (!editingId) {
      setForm(f => ({
        ...f,
        category_name: catName === "all" || catName === "global" ? "" : catName
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      label: form.label, name: form.name, type: form.type,
      placeholder: form.placeholder, is_required: form.is_required,
      sort_order: form.sort_order, category_name: form.category_name || null
    };
    if (form.type === "dropdown" && form.options_raw) {
      payload.options = form.options_raw.split(",").map((o: string) => o.trim()).filter(Boolean);
    }
    try {
      if (editingId) {
        await adminApi.updateRegistrationField(editingId, payload);
        setEditingId(null);
        showNotification("Field updated successfully");
      } else {
        await adminApi.createRegistrationField(payload);
        showNotification("Field created successfully");
      }
      setForm({ ...emptyForm, category_name: selectedCategoryTab === "all" || selectedCategoryTab === "global" ? "" : selectedCategoryTab });
      fetchFields();
    } catch (err: any) {
      alert("Error: " + (err.message || "Unknown"));
    }
  };

  const handleEdit = (f: any) => {
    setEditingId(f.id);
    setForm({
      label: f.label, name: f.name, type: f.type,
      placeholder: f.placeholder || "", is_required: f.is_required,
      sort_order: f.sort_order, options_raw: (f.options || []).join(", "),
      category_name: f.category_name || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this field? This might affect existing professional profiles.")) return;
    try {
      await adminApi.deleteRegistrationField(id);
      showNotification("Field deleted successfully");
      fetchFields();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter fields based on active tab
  const filteredFields = useMemo(() => {
    if (selectedCategoryTab === "all") return fields;
    if (selectedCategoryTab === "global") return fields.filter(f => !f.category_name);
    return fields.filter(f => f.category_name && f.category_name.toLowerCase() === selectedCategoryTab.toLowerCase());
  }, [fields, selectedCategoryTab]);

  // Counts per category for pills
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: fields.length, global: 0 };
    fields.forEach(f => {
      if (!f.category_name) {
        map.global += 1;
      } else {
        const key = f.category_name.toLowerCase();
        map[key] = (map[key] || 0) + 1;
      }
    });
    return map;
  }, [fields]);

  const columns: Column<any>[] = [
    {
      key: "sort_order",
      label: "Order",
      align: "center",
      width: "70px",
      render: (f) => <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{f.sort_order}</span>,
      exportValue: (f) => f.sort_order,
    },
    {
      key: "label",
      label: "Field Details",
      render: (f) => (
        <div>
          <div className="text-sm font-semibold text-gray-900">{f.label}</div>
          <div className="text-xs text-gray-400 font-mono mt-0.5">{f.name}</div>
          {f.options && f.options.length > 0 && (
            <div className="text-[11px] text-gray-500 mt-1 line-clamp-1">
              Options: {f.options.join(", ")}
            </div>
          )}
        </div>
      ),
      exportValue: (f) => `${f.label} (${f.name})`,
    },
    {
      key: "category_name",
      label: "Category Journey",
      render: (f) => f.category_name ? (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
          f.category_name.toLowerCase() === 'cleaning' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          f.category_name.toLowerCase() === 'plumbing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
          f.category_name.toLowerCase() === 'electrical' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
          'bg-purple-50 text-purple-700 border border-purple-200'
        }`}>
          {f.category_name}
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Global (All)
        </span>
      ),
      exportValue: (f) => f.category_name || 'Global',
    },
    {
      key: "type",
      label: "Type",
      render: (f) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 uppercase tracking-wider text-[10px]">
          {f.type}
        </span>
      ),
      exportValue: (f) => f.type,
    },
    {
      key: "is_required",
      label: "Required",
      align: "center",
      render: (f) => f.is_required ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
          Required
        </span>
      ) : (
        <span className="text-xs text-gray-400">Optional</span>
      ),
      exportValue: (f) => f.is_required ? 'Yes' : 'No',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 relative">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-[var(--accent-color)] text-white transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <i className="lnr lnr-checkmark-circle text-sm"></i>
          {toastMessage}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Professional Journey & Form Builder</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure custom question journeys per profession (e.g. Cleaners/Nannies, Plumbers, Electricians, Dog Trainers). Zero coding required to add new category journeys.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => handleCategoryTabChange("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategoryTab === "all"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>All Categories</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategoryTab === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
              {counts.all || 0}
            </span>
          </button>

          {categories.map(c => {
            const catKey = c.name.toLowerCase();
            const count = counts[catKey] || 0;
            const isActive = selectedCategoryTab.toLowerCase() === catKey;
            return (
              <button
                key={c.id || c.name}
                onClick={() => handleCategoryTabChange(c.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[var(--accent-color)] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span>{c.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => handleCategoryTabChange("global")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategoryTab === "global"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>Global (All Pros)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategoryTab === "global" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
              {counts.global || 0}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

          {/* Builder Form */}
          <div className="xl:col-span-1 bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <i className={`lnr ${editingId ? 'lnr-pencil' : 'lnr-plus-circle'} text-[var(--accent-color)]`}></i>
                {editingId ? "Edit Journey Question" : "Add Journey Question"}
              </h3>
              {selectedCategoryTab !== "all" && !editingId && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                  For: {selectedCategoryTab}
                </span>
              )}
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Question / Field Label *</label>
                  <input
                    type="text"
                    required
                    value={form.label}
                    onChange={handleLabelChange}
                    placeholder="e.g. Solar Sizing Certification"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]/10 transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Field Key (API identifier) *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. solar_certified"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Category Journey Assignment</label>
                  <select
                    value={form.category_name}
                    onChange={e => setForm(f => ({ ...f, category_name: e.target.value }))}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors"
                  >
                    <option value="">Global (Applies to all categories)</option>
                    {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    When assigned, this question only appears during the signup journey for this specific category.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Input Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors"
                    >
                      {FIELD_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sort Order</label>
                    <input
                      type="number"
                      min={0}
                      value={form.sort_order}
                      onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Placeholder / Helper Text</label>
                  <input
                    type="text"
                    value={form.placeholder}
                    onChange={e => setForm(f => ({ ...f, placeholder: e.target.value }))}
                    placeholder="e.g. Select options or type answer..."
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-gray-400"
                  />
                </div>
                {form.type === "dropdown" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Dropdown Choices <span className="text-gray-400 normal-case">(comma-separated)</span> *</label>
                    <textarea
                      rows={2}
                      value={form.options_raw}
                      onChange={e => setForm(f => ({ ...f, options_raw: e.target.value }))}
                      placeholder="Choice 1, Choice 2, Choice 3"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-gray-400 text-xs"
                    />
                  </div>
                )}
                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.is_required}
                      onChange={e => setForm(f => ({ ...f, is_required: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                    />
                    <span className="text-xs font-semibold text-gray-800">Mandatory (Required to complete registration)</span>
                  </label>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    {editingId ? "Update Journey Question" : "Save Question to Journey"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }}
                      className="py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Fields List */}
          <div className="xl:col-span-2">
            <DataTable
              columns={columns}
              data={filteredFields}
              loading={loading}
              title={`${selectedCategoryTab === "all" ? "All Configured Questions" : `${selectedCategoryTab} Journey Questions`} (${filteredFields.length})`}
              subtitle="Questions asked to professionals when they sign up under this category."
              exportFileName="registration-fields"
              emptyIcon="lnr lnr-layers"
              emptyMessage={`No custom journey questions configured for ${selectedCategoryTab === "all" ? "this selection" : selectedCategoryTab}. Add one using the form on the left.`}
              actions={(f) => (
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEdit(f)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    title="Edit Field"
                  >
                    <i className="lnr lnr-pencil text-sm"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Field"
                  >
                    <i className="lnr lnr-trash text-sm"></i>
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
