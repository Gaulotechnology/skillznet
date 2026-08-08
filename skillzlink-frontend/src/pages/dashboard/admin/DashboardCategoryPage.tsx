import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";
import { DataTable } from "../../../components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

export function DashboardCategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", icon: "", description: "" });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Modal and Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchCategories = () => {
    setLoading(true);
    adminApi.getCategories().then(res => {
      setCategories(res.categories || []);
    }).catch(err => {
      console.error(err);
      showNotification("Failed to load categories.", "error");
    }).finally(() => setLoading(false));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditing) {
      setFormData({ ...formData, name, slug: generateSlug(name) });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (isEditing) {
        await adminApi.updateCategory(isEditing, formData);
        showNotification("Category updated successfully");
        setIsEditing(null);
      } else {
        await adminApi.createCategory(formData);
        showNotification("Category created successfully");
      }
      setFormData({ name: "", slug: "", icon: "", description: "" });
      fetchCategories();
    } catch (err: any) {
      showNotification("Failed to save category: " + (err.message || "Unknown error"), "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (id: number) => {
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: any }) => (
        <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
          #{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Details",
      cell: ({ row }: { row: any }) => (
        <div>
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            {row.original.name}
            <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md">
              /{row.original.slug}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-[200px] truncate">
            {row.original.description || "No description provided."}
          </p>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => {
              setIsEditing(row.original.id);
              setFormData({
                name: row.original.name,
                slug: row.original.slug,
                icon: row.original.icon || "",
                description: row.original.description || ""
              });
            }}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 font-bold flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-500 transition-colors shadow-sm"
            title="Edit Category"
          >
            <i className="lnr lnr-pencil text-xs"></i>
          </button>
          <button 
            onClick={() => openDeleteModal(row.original.id)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 font-bold flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-colors shadow-sm"
            title="Delete Category"
          >
            <i className="lnr lnr-trash text-xs"></i>
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteModalOpen(false);
    try {
      await adminApi.deleteCategory(categoryToDelete);
      showNotification("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      showNotification("Failed to delete category.", "error");
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto relative">
        
        {/* Toast Notification */}
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'}`}></i>
          </div>
          {toastMessage}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)}></div>
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-4">
                <i className="lnr lnr-trash"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 text-center mb-2">Delete Category?</h3>
              <p className="text-slate-500 text-center mb-8">This action cannot be undone. Any services tied to this category may be affected.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Service Categories</h2>
          <p className="text-slate-500 mt-1">Manage the types of services professionals can offer.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i className={`lnr ${isEditing ? 'lnr-pencil text-indigo-500' : 'lnr-file-add text-emerald-500'}`}></i>
                  {isEditing ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={handleNameChange} 
                    required 
                    disabled={formLoading}
                    placeholder="e.g. Plumbing"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">URL Slug</label>
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    required 
                    disabled={formLoading}
                    placeholder="e.g. plumbing"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-mono placeholder:text-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description (Optional)</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    disabled={formLoading}
                    rows={3}
                    placeholder="Brief description of the service category..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit" 
                    disabled={formLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-sm"
                  >
                    {formLoading ? (
                      <><i className="lnr lnr-sync animate-spin mr-2"></i> Saving...</>
                    ) : isEditing ? "Update Category" : "Add Category"}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" 
                      disabled={formLoading}
                      onClick={() => { setIsEditing(null); setFormData({ name: "", slug: "", icon: "", description: "" }); }}
                      className="py-3 px-4 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">Loading categories...</p>
                </div>
              ) : (
                <DataTable columns={columns} data={categories} />
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
