import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { seekerApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardMyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    setLoading(true);
    seekerApi.getBookings()
      .then(res => setBookings(res.bookings || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending</span>;
      case 'confirmed': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Confirmed</span>;
      case 'completed': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Completed</span>;
      case 'cancelled':
      case 'rejected': return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{status}</span>;
      default: return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>{status}</span>;
    }
  };

  const columns: Column<any>[] = [
    {
      key: "provider",
      label: "Professional",
      render: (b) => (
        <div className="flex items-center gap-3">
          {b.provider?.avatar ? (
            <img src={b.provider.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-sm font-medium text-[var(--accent-color)]">
              {b.provider?.name?.charAt(0) || "P"}
            </div>
          )}
          <div>
            <Link to={`/professional-profile/${b.provider_id}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
              {b.provider?.name || "Professional"}
            </Link>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{b.provider?.service_category}</div>
          </div>
        </div>
      ),
      exportValue: (b) => b.provider?.name || "Professional",
    },
    {
      key: "booking_date",
      label: "Date & Time",
      render: (b) => (
        <div>
          <div className="text-sm text-[var(--text-primary)]">{b.booking_date}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">{b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}</div>
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
      render: (b) => <p className="text-sm text-[var(--text-secondary)] max-w-xs truncate" title={b.notes}>{b.notes || '-'}</p>,
      exportValue: (b) => b.notes || '',
    },
  ];

  return (
    <SeekerLayout>
      <div className="max-w-6xl mx-auto space-y-6 font-['Inter',sans-serif]">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">My Bookings</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Track your requested services and appointments.</p>
          </div>
          <Link to="/search" className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2">
            <i className="lnr lnr-magnifier"></i> Find Professionals
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={bookings}
          loading={loading}
          emptyIcon="lnr lnr-calendar-full"
          emptyMessage="You haven't booked any professionals yet."
          exportFileName="my-bookings"
          actions={(b) => (
            <div className="flex items-center justify-end">
              <Link to={`/professional-profile/${b.provider_id}`} className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-color)] transition-colors">
                View Profile
              </Link>
            </div>
          )}
        />
      </div>
    </SeekerLayout>
  );
}
