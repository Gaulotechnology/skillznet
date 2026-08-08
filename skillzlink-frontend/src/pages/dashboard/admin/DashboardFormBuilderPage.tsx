import { useState, useEffect } from "react";
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
      setForm({ ...emptyForm });
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

  const columns: Column<any>[] = [
    {
      key: "sort_order",
      label: "Order",
      align: "center",
      width: "80px",
      render: (f) => <span className="text-sm font-medium text-gray-500">{f.sort_order}</span>,
      exportValue: (f) => f.sort_order,
    },
    {
      key: "label",
      label: "Field Details",
      render: (f) => (
        <div>
          <span className="text-sm font-medium text-gray-900">{f.label}</span>
          <span className="text-xs text-gray-400 font-mono ml-2">{f.name}</span>
        </div>
      ),
      exportValue: (f) => `${f.label} (${f.name})`,
    },
    {
      key: "category_name",
      label: "Category",
      render: (f) => f.category_name ? (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
          {f.category_name}
        </span>
      ) : (
        <span className="text-xs text-gray-400">Global</span>
      ),
      exportValue: (f) => f.category_name || 'Global',
    },
    {
      key: "type",
      label: "Type",
      render: (f) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 uppercase">
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
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Yes
        </span>
      ) : (
        <span className="text-xs text-gray-400">No</span>
      ),
      exportValue: (f) => f.is_required ? 'Yes' : 'No',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 relative">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-gray-900 text-white transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <i className="lnr lnr-checkmark-circle text-sm"></i>
          {toastMessage}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Registration Form Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Customize the fields required when professionals register on the platform.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

          {/* Builder Form */}
          <div className="xl:col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <i className={`lnr ${editingId ? 'lnr-pencil' : 'lnr-file-add'} text-gray-500`}></i>
                {editingId ? "Edit Field" : "Add New Field"}
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Label</label>
                  <input type="text" required value={form.label} onChange={handleLabelChange} placeholder="e.g. Years of Experience" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Field Name (API Key)</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. years_experience" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Category Assignment</label>
                  <select value={form.category_name} onChange={e => setForm(f => ({ ...f, category_name: e.target.value }))} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors">
                    <option value="">All Categories (Global Field)</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1.5">If selected, this field will only be shown to professionals registering under this category.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Field Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors">
                      {FIELD_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                    <input type="number" min={0} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Placeholder</label>
                  <input type="text" value={form.placeholder} onChange={e => setForm(f => ({ ...f, placeholder: e.target.value }))} placeholder="Hint text inside the input" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400" />
                </div>
                {form.type === "dropdown" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Options <span className="text-gray-400 normal-case">(comma-separated)</span></label>
                    <input type="text" value={form.options_raw} onChange={e => setForm(f => ({ ...f, options_raw: e.target.value }))} placeholder="e.g. Option 1, Option 2, Option 3" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400" />
                  </div>
                )}
                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.is_required} onChange={e => setForm(f => ({ ...f, is_required: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
                    <span className="text-sm font-medium text-gray-900">Required Field</span>
                  </label>
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">
                    {editingId ? "Update Field" : "Add Field"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }} className="py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors">
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
              data={fields}
              loading={loading}
              title="Configured Fields"
              subtitle="Fields displayed on the professional registration page."
              exportFileName="registration-fields"
              emptyIcon="lnr lnr-layers"
              emptyMessage="No custom fields added yet."
              actions={(f) => (
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => handleEdit(f)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Edit Field">
                    <i className="lnr lnr-pencil text-sm"></i>
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Delete Field">
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
