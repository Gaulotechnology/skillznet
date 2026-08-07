import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

export function DashboardUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "seeker" });
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminApi.getUsers().then(res => {
      setUsers(res.users || []);
    }).catch(err => {
      console.error(err);
      alert("Failed to load users. Are you logged in as admin?");
    }).finally(() => setLoading(false));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createUser(formData);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "seeker" });
      fetchUsers();
    } catch (err: any) {
      alert("Failed to create user: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await adminApi.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="wt-dashboardbox">
        <div className="wt-dashboardboxtitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Users</h2>
          <button className="wt-btn" onClick={() => setIsModalOpen(true)}>+ Create New User</button>
        </div>
        <div className="wt-dashboardboxcontent">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'provider' ? 'badge-primary' : 'badge-secondary'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Creating User */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>Create User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Email</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Password</label>
                <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Role</label>
                <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="seeker">Seeker</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="wt-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
