import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi, publicApi } from "../../../services/api";

export function DashboardProfessionalsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = () => {
    setLoading(true);
    publicApi.listProviders({})
      .then(res => {
        setProviders(res.data || []);
      }).catch(err => {
        console.error(err);
        alert("Failed to load professionals.");
      }).finally(() => setLoading(false));
  };

  const handleVerify = async (id: number) => {
    if (confirm("Are you sure you want to verify this provider?")) {
      try {
        await adminApi.verifyProvider(id);
        fetchProviders();
      } catch (err: any) {
        alert("Failed to verify: " + (err.message || "Unknown error"));
      }
    }
  };

  const handleSuspend = async (id: number) => {
    if (confirm("Are you sure you want to suspend this provider's account?")) {
      try {
        await adminApi.suspendProvider(id);
        fetchProviders();
      } catch (err: any) {
        alert("Failed to suspend: " + (err.message || "Unknown error"));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="wt-dashboardbox">
        <div className="wt-dashboardboxtitle">
          <h2>Manage Professionals</h2>
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
                  <th>Category</th>
                  <th>Verified</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.service_category}</td>
                    <td>
                      {p.id_verified ? (
                        <span className="badge badge-success" style={{ backgroundColor: '#28a745', color: '#fff' }}>Yes</span>
                      ) : (
                        <span className="badge badge-warning" style={{ backgroundColor: '#ffc107', color: '#000' }}>No</span>
                      )}
                    </td>
                    <td>{p.level}</td>
                    <td>
                      {!p.id_verified && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleVerify(p.id)} style={{ marginRight: '5px' }}>Verify ID</button>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => handleSuspend(p.id)}>Suspend</button>
                    </td>
                  </tr>
                ))}
                {providers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No professionals found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
