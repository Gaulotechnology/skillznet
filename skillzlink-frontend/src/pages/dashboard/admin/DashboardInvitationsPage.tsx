import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { DataTable, type Column } from '../../../components/shared/DataTable';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:18080/api';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'affiliate' | 'agent' | 'provider';
  company: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function DashboardInvitationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);

  const token = localStorage.getItem('skillzlink_token');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplications(data.applications || []);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch {
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`${API}/admin/applications/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Application approved successfully', 'success');
      fetchApplications();
    } catch {
      showToast('Failed to approve application', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`${API}/admin/applications/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Application rejected', 'success');
      fetchApplications();
    } catch {
      showToast('Failed to reject application', 'error');
    } finally {
      setRejectModal(null);
    }
  };

  const typeBadge = (type: string) => {
    const styles: Record<string, string> = {
      affiliate: 'bg-purple-50 text-purple-700',
      agent: 'bg-amber-50 text-amber-700',
      provider: 'bg-blue-50 text-blue-700',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[type] || ''}`}>
        {type}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const dots: Record<string, string> = {
      pending: 'bg-amber-400',
      approved: 'bg-green-400',
      rejected: 'bg-red-400',
    };
    return (
      <span className="inline-flex items-center gap-1.5 text-sm capitalize">
        <span className={`w-2 h-2 rounded-full ${dots[status] || ''}`} />
        {status}
      </span>
    );
  };

  const columns: Column<Application>[] = [
    { key: 'name', label: 'Name', sortable: true, searchable: true },
    { key: 'email', label: 'Email', sortable: true, searchable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'type', label: 'Type', sortable: true, render: (row) => typeBadge(row.type) },
    { key: 'company', label: 'Company', sortable: true, searchable: true },
    { key: 'message', label: 'Message', render: (row) => (
      <span title={row.message}>{row.message?.length > 40 ? row.message.slice(0, 40) + '…' : row.message}</span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (row) => statusBadge(row.status) },
    { key: 'applied_at', label: 'Applied Date', sortable: true, render: (row) => new Date(row.applied_at).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions', render: (row) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <button onClick={() => handleApprove(row.id)} className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
            Approve
          </button>
          <button onClick={() => setRejectModal(row.id)} className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
            Reject
          </button>
        </div>
      ) : null,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Invitations & Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">Manage incoming applications from affiliates, agents, and providers.</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'border-gray-200' },
            { label: 'Pending', value: stats.pending, color: 'border-amber-400' },
            { label: 'Approved', value: stats.approved, color: 'border-green-400' },
            { label: 'Rejected', value: stats.rejected, color: 'border-red-400' },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-lg border-l-4 ${s.color} border border-gray-100 p-4`}>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={applications} loading={loading} title="Applications" pageSize={10} />
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Rejection</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to reject this application? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={() => handleReject(rejectModal)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </DashboardLayout>
  );
}
