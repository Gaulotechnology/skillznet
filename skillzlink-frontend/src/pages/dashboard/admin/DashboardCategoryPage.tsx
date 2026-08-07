import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

export function DashboardCategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", slug: "", icon: "", description: "" });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    adminApi.getCategories().then(res => {
      setCategories(res.categories || []);
    }).catch(err => {
      console.error(err);
      alert("Failed to load categories.");
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
    try {
      if (isEditing) {
        await adminApi.updateCategory(isEditing, formData);
        setIsEditing(null);
      } else {
        await adminApi.createCategory(formData);
      }
      setFormData({ name: "", slug: "", icon: "", description: "" });
      fetchCategories();
    } catch (err: any) {
      alert("Failed to save category: " + (err.message || "Unknown error"));
    }
  };

  const handleEdit = (category: any) => {
    setIsEditing(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "",
      description: category.description || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await adminApi.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert("Failed to delete category.");
      }
    }
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          {/* Add/Edit Category Form */}
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 float-left">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
              </div>
              <div className="wt-dashboardboxcontent">
                <form className="wt-formtheme wt-formprojectinfo wt-formcategory" onSubmit={handleSubmit}>
                  <fieldset>
                    <div className="form-group">
                      <input type="text" name="name" className="form-control" placeholder="Name" required value={formData.name} onChange={handleNameChange} />
                    </div>
                    <div className="form-group">
                      <input type="text" name="slug" className="form-control" placeholder="Slug (auto-generated)" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <div className="form-group wt-btnarea" style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="wt-btn">{isEditing ? 'Update Category' : 'Add New Category'}</button>
                      {isEditing && (
                        <button type="button" className="wt-btn" style={{ backgroundColor: '#ccc' }} onClick={() => { setIsEditing(null); setFormData({ name: "", slug: "", icon: "", description: "" }); }}>Cancel</button>
                      )}
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 float-right">
            <div className="wt-dashboardbox wt-categorys">
              <div className="wt-dashboardboxtitle wt-titlewithsearch">
                <h2>Categories</h2>
              </div>
              <div className="wt-dashboardboxcontent wt-categoriescontentholder">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="wt-tablecategories">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id}>
                          <td>{cat.id}</td>
                          <td>{cat.name}</td>
                          <td>{cat.slug}</td>
                          <td>
                            <div className="wt-actionbtn">
                              <a href="#!" onClick={(e) => { e.preventDefault(); handleEdit(cat); }} className="wt-addinfo wt-skillsaddinfo"><i className="lnr lnr-pencil"></i></a>
                              <a href="#!" onClick={(e) => { e.preventDefault(); handleDelete(cat.id); }} className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center' }}>No categories created yet.</td>
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
