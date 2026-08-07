import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

const FIELD_TYPES = ["text", "textarea", "dropdown", "number", "file", "checkbox"];

const emptyForm = {
  label: "", name: "", type: "text", placeholder: "", is_required: false,
  sort_order: 0, options_raw: ""
};

export function DashboardFormBuilderPage() {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { fetchFields(); }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      label: form.label, name: form.name, type: form.type,
      placeholder: form.placeholder, is_required: form.is_required,
      sort_order: form.sort_order,
    };
    if (form.type === "dropdown" && form.options_raw) {
      payload.options = form.options_raw.split(",").map((o: string) => o.trim()).filter(Boolean);
    }
    try {
      if (editingId) {
        await adminApi.updateRegistrationField(editingId, payload);
        setEditingId(null);
      } else {
        await adminApi.createRegistrationField(payload);
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
      sort_order: f.sort_order, options_raw: (f.options || []).join(", ")
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this field?")) return;
    await adminApi.deleteRegistrationField(id);
    fetchFields();
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          {/* Form */}
          <div className="col-12 col-xl-4 float-left">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>{editingId ? "Edit Field" : "Add New Field"}</h2>
              </div>
              <div className="wt-dashboardboxcontent">
                <form className="wt-formtheme wt-formprojectinfo" onSubmit={handleSubmit}>
                  <fieldset>
                    <div className="form-group">
                      <label>Label</label>
                      <input type="text" className="form-control" required
                        value={form.label} onChange={handleLabelChange} placeholder="e.g. Years of Experience" />
                    </div>
                    <div className="form-group">
                      <label>Field Name (key)</label>
                      <input type="text" className="form-control" required
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. years_experience" />
                    </div>
                    <div className="form-group">
                      <label>Field Type</label>
                      <span className="wt-select">
                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                          {FIELD_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                      </span>
                    </div>
                    <div className="form-group">
                      <label>Placeholder</label>
                      <input type="text" className="form-control"
                        value={form.placeholder} onChange={e => setForm(f => ({ ...f, placeholder: e.target.value }))} />
                    </div>
                    {form.type === "dropdown" && (
                      <div className="form-group">
                        <label>Options (comma-separated)</label>
                        <input type="text" className="form-control" placeholder="e.g. Option 1, Option 2"
                          value={form.options_raw} onChange={e => setForm(f => ({ ...f, options_raw: e.target.value }))} />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Sort Order</label>
                      <input type="number" className="form-control" min={0}
                        value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))} />
                    </div>
                    <div className="form-group">
                      <span className="wt-radio">
                        <input type="checkbox" id="is_required" checked={form.is_required}
                          onChange={e => setForm(f => ({ ...f, is_required: e.target.checked }))} />
                        <label htmlFor="is_required"> Required Field</label>
                      </span>
                    </div>
                    <div className="form-group wt-btnarea" style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="wt-btn">{editingId ? "Update Field" : "Add Field"}</button>
                      {editingId && (
                        <button type="button" className="wt-btn" style={{ backgroundColor: '#ccc' }}
                          onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }}>Cancel</button>
                      )}
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>

          {/* Fields List */}
          <div className="col-12 col-xl-8 float-right">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Registration Form Fields</h2>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  These fields will appear on the professional registration form.
                </span>
              </div>
              <div className="wt-dashboardboxcontent">
                {loading ? <p>Loading...</p> : (
                  <table className="wt-tablecategories">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Label</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map(f => (
                        <tr key={f.id}>
                          <td>{f.sort_order}</td>
                          <td>
                            <strong>{f.label}</strong>
                            <br />
                            <small style={{ color: '#888' }}>{f.name}</small>
                          </td>
                          <td>
                            <span className="badge" style={{
                              background: '#e8f4fd', color: '#1890ff',
                              padding: '3px 8px', borderRadius: '4px', fontSize: '12px'
                            }}>
                              {f.type}
                            </span>
                          </td>
                          <td>
                            {f.is_required ? (
                              <span style={{ color: '#f5222d', fontWeight: 600 }}>Yes</span>
                            ) : (
                              <span style={{ color: '#999' }}>No</span>
                            )}
                          </td>
                          <td>
                            <div className="wt-actionbtn">
                              <a href="#!" onClick={e => { e.preventDefault(); handleEdit(f); }} className="wt-addinfo wt-skillsaddinfo">
                                <i className="lnr lnr-pencil"></i>
                              </a>
                              <a href="#!" onClick={e => { e.preventDefault(); handleDelete(f.id); }} className="wt-deleteinfo">
                                <i className="lnr lnr-trash"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {fields.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                            No fields added yet. Use the form on the left to add your first field.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
