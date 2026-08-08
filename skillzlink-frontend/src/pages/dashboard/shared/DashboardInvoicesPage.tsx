import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser, providerApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardInvoicesPage() {
  const user = getCurrentUser();
  const role = user?.role || "seeker";
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "provider") {
      providerApi.getSubscription()
        .then((data) => setInvoices(data.history || []))
        .catch(() => setInvoices([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [role]);

  const columns: Column<any>[] = [
    {
      key: "id",
      label: "Invoice ID",
      render: (invoice, index) => (
        <span className="text-sm font-medium text-[var(--text-primary)]">
          #{invoice.id || `INV-${Date.now().toString().slice(-6)}-${index}`}
        </span>
      ),
      exportValue: (invoice) => invoice.id || '',
    },
    {
      key: "date",
      label: "Date",
      render: (invoice) => (
        <span className="text-sm text-[var(--text-secondary)]">
          {new Date(invoice.date || invoice.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
      exportValue: (invoice) => new Date(invoice.date || invoice.created_at || Date.now()).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (invoice) => {
        const isPaid = (invoice.status || 'paid').toLowerCase() === 'paid';
        return isPaid ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Paid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
          </span>
        );
      },
      exportValue: (invoice) => (invoice.status || 'paid').toLowerCase() === 'paid' ? 'Paid' : 'Pending',
    },
    {
      key: "amount",
      label: "Amount",
      render: (invoice) => <span className="text-sm font-semibold text-[var(--text-primary)]">${invoice.amount || "19.00"}</span>,
      exportValue: (invoice) => invoice.amount || "19.00",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 font-['Inter',sans-serif]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Billing & Invoices</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your billing history and view past invoices.</p>
          </div>
          {role === "provider" && (
            <Link to="/dashboard/subscription" className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2">
              <i className="lnr lnr-rocket"></i> Manage Subscription
            </Link>
          )}
        </div>

        {role !== "provider" ? (
          <div className="border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-3xl overflow-hidden shadow-sm">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <i className="lnr lnr-file-empty text-4xl text-[var(--text-secondary)] block mb-3"></i>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Not Applicable</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                Invoices are only applicable to Professional accounts with active subscriptions.
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={invoices}
            loading={loading}
            emptyIcon="lnr lnr-file-empty"
            emptyMessage="You have no past invoices or billing history."
            exportFileName="invoices"
            actions={() => (
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-light)] transition-colors">
                <i className="lnr lnr-download text-sm"></i>
              </button>
            )}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
