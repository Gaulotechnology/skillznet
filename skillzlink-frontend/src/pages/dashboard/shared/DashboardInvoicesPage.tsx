import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser, providerApi } from "../../../services/api";

export function DashboardInvoicesPage() {
  const user = getCurrentUser();
  const role = user?.role || "seeker";
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "provider") {
      providerApi.getSubscription()
        .then((data) => {
          setInvoices(data.history || []);
        })
        .catch(() => {
          setInvoices([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [role]);

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="wt-dashboardbox wt-dashboardinvocies">
          <div className="wt-dashboardboxtitle">
            <h2>Billing &amp; Invoices</h2>
          </div>
          <div className="wt-dashboardboxcontent" style={{ padding: "30px" }}>
            {role !== "provider" ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                <i className="lnr lnr-file-empty" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></i>
                <p>Invoices are only applicable to Professional accounts with active subscriptions.</p>
              </div>
            ) : loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <i className="fa fa-spinner fa-spin" style={{ fontSize: "32px", color: "#ff5851" }}></i>
                <p style={{ marginTop: "16px" }}>Loading your billing history...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                <i className="lnr lnr-file-empty" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></i>
                <p>You have no past invoices or billing history.</p>
                <Link to="/dashboard/subscription" className="wt-btn" style={{ marginTop: "16px", padding: "10px 20px" }}>
                  View Subscription Plans
                </Link>
              </div>
            ) : (
              <table className="wt-tablecategories" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eee" }}>
                    <th style={{ padding: "12px" }}>Invoice ID</th>
                    <th style={{ padding: "12px" }}>Date</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "12px" }}>#{invoice.id || `INV-${Date.now().toString().slice(-6)}-${index}`}</td>
                      <td style={{ padding: "12px" }}>{new Date(invoice.date || invoice.created_at || Date.now()).toLocaleDateString()}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ 
                          background: invoice.status === 'paid' ? '#f6ffed' : '#e6f7ff', 
                          color: invoice.status === 'paid' ? '#52c41a' : '#1890ff', 
                          border: `1px solid ${invoice.status === 'paid' ? '#b7eb8f' : '#91d5ff'}`,
                          padding: '2px 8px', borderRadius: '4px', fontSize: '12px' 
                        }}>
                          {invoice.status?.toUpperCase() || 'PAID'}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>${invoice.amount || "19.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
