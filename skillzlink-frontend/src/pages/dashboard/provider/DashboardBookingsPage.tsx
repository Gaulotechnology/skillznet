import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    setLoading(true);
    providerApi.getBookings()
      .then(res => setBookings(res.bookings || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await providerApi.updateBookingStatus(id, status);
      showNotification(`Booking ${status}`);
      fetchBookings();
    } catch (err: any) {
      alert("Error updating booking: " + (err.message || "Unknown error"));
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending</span>;
      case 'accepted': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Accepted</span>;
      case 'completed': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Completed</span>;
      case 'cancelled':
      case 'rejected': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{status}</span>;
      default: return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>{status}</span>;
    }
  };

  const columns: Column<any>[] = [
    {
      key: "seeker",
      label: "Client",
      render: (b) => (
        <div className="flex items-center gap-3">
          {b.seeker?.avatar ? (
            <img src={b.seeker.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
              {b.seeker?.name?.charAt(0) || "C"}
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-900">{b.seeker?.name || "Client"}</span>
            {b.status === "accepted" && b.seeker?.phone_number && (
              <div className="text-xs text-gray-400 mt-0.5">{b.seeker.phone_number}</div>
            )}
          </div>
        </div>
      ),
      exportValue: (b) => b.seeker?.name || "Client",
    },
    {
      key: "booking_date",
      label: "Date & Time",
      render: (b) => (
        <div>
          <div className="text-sm text-gray-900">{b.booking_date}</div>
          <div className="text-xs text-gray-500 mt-0.5">{b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}</div>
        </div>
      ),
      exportValue: (b) => `${b.booking_date} ${b.start_time}-${b.end_time}`,
    },
    {
      key: "status",
      label: "Status",
      render: (b) => getStatusBadge(b.status),
      exportValue: (b) => b.status,
    },
    {
      key: "notes",
      label: "Notes",
      render: (b) => <p className="text-sm text-gray-500 max-w-xs truncate" title={b.notes}>{b.notes || '-'}</p>,
      exportValue: (b) => b.notes || '',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 relative">

        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-gray-900 text-white transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <i className="lnr lnr-checkmark-circle text-sm"></i>
          {toastMessage}
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredBookings}
          loading={loading}
          title="My Bookings"
          subtitle="Manage your service appointments."
          exportFileName="bookings"
          emptyIcon="lnr lnr-calendar-full"
          emptyMessage={`No ${filter !== 'all' ? filter : ''} bookings found.`}
          actions={(b) => (
            <div className="flex items-center justify-end gap-2">
              {b.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(b.id, 'accepted')} className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">
                    Accept
                  </button>
                  <button onClick={() => updateStatus(b.id, 'rejected')} className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors">
                    Reject
                  </button>
                </>
              )}
              {b.status === 'accepted' && (
                <button onClick={() => updateStatus(b.id, 'completed')} className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">
                  Mark Completed
                </button>
              )}
            </div>
          )}
          headerActions={
            <div className="flex items-center gap-1 p-1 border border-gray-200 rounded-lg">
              {['all', 'pending', 'accepted'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
}
