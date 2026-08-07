import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { publicApi } from "../../../services/api";

interface ContactedPro {
  id: number;
  name: string;
  service_category: string;
  contact_revealed_at: string;
  contact_number?: string;
  rating?: number;
}

export function DashboardManageRequestsPage() {
  const [contacted, setContacted] = useState<ContactedPro[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [tab, setTab] = useState<"contacted" | "saved">("contacted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load contacted history from localStorage (set by reveal contact actions)
    const contactedRaw: ContactedPro[] = JSON.parse(
      localStorage.getItem("contacted_professionals") || "[]"
    );
    const savedRaw: any[] = JSON.parse(
      localStorage.getItem("saved_professionals") || "[]"
    );

    // Refresh saved from API for fresh data
    if (savedRaw.length > 0) {
      Promise.all(
        savedRaw.map((p: any) =>
          publicApi.getProvider(p.id).then((r) => r.provider).catch(() => p)
        )
      ).then((results) => {
        setSaved(results);
        setContacted(contactedRaw);
        setLoading(false);
      });
    } else {
      setContacted(contactedRaw);
      setLoading(false);
    }
  }, []);

  const removeContacted = (id: number) => {
    const updated = contacted.filter((p) => p.id !== id);
    setContacted(updated);
    localStorage.setItem("contacted_professionals", JSON.stringify(updated));
  };

  const removeSaved = (id: number) => {
    const updated = saved.filter((p: any) => p.id !== id);
    setSaved(updated);
    localStorage.setItem("saved_professionals", JSON.stringify(updated));
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        {/* Header */}
        <div className="wt-dashboardboxtitle" style={{ marginBottom: "20px" }}>
          <h2>My Professional Contacts</h2>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {(["contacted", "saved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                background: tab === t ? "#ff5851" : "#f0f0f0",
                color: tab === t ? "#fff" : "#555",
                transition: "all 0.2s",
              }}
            >
              {t === "contacted" ? `📞 Contacted (${contacted.length})` : `❤️ Saved (${saved.length})`}
            </button>
          ))}
          <Link
            to="/nearby-professionals"
            className="wt-btn"
            style={{ marginLeft: "auto", padding: "8px 16px", fontSize: "13px" }}
          >
            + Find Professionals
          </Link>
        </div>

        <div className="wt-dashboardbox">
          <div className="wt-dashboardboxcontent">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <i className="fa fa-spinner fa-spin" style={{ fontSize: "28px", color: "#ff5851" }}></i>
              </div>
            ) : tab === "contacted" ? (
              contacted.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                  <i className="lnr lnr-phone-handset" style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}></i>
                  <p>You haven't contacted any professionals yet.</p>
                  <Link to="/nearby-professionals" className="wt-btn">
                    Browse Professionals
                  </Link>
                </div>
              ) : (
                <table className="wt-tablecategories">
                  <thead>
                    <tr>
                      <th>Professional</th>
                      <th>Category</th>
                      <th>Contacted</th>
                      <th>Phone</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacted.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link to={`/professional-profile/${p.id}`} style={{ color: "#ff5851", fontWeight: 600 }}>
                            {p.name}
                          </Link>
                        </td>
                        <td>{p.service_category}</td>
                        <td style={{ fontSize: "12px", color: "#888" }}>
                          {new Date(p.contact_revealed_at).toLocaleDateString()}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, fontFamily: "monospace" }}>
                            {p.contact_number || "Hidden"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => removeContacted(p.id)}
                            style={{
                              background: "none",
                              border: "1px solid #f5222d",
                              color: "#f5222d",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : saved.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                <i className="lnr lnr-heart" style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}></i>
                <p>No saved professionals yet.</p>
                <Link to="/nearby-professionals" className="wt-btn">
                  Browse Professionals
                </Link>
              </div>
            ) : (
              <div className="row" style={{ padding: "16px" }}>
                {saved.map((pro: any) => (
                  <div className="col-12 col-md-6" key={pro.id} style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        border: "1px solid #f0f0f0",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ff5851, #ff8a4c)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "20px" }}>
                          {(pro.name || "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 2px", fontSize: "14px" }}>{pro.name}</h4>
                        <p style={{ margin: "0 0 8px", color: "#888", fontSize: "12px" }}>
                          {pro.service_category} · {pro.location || "Zimbabwe"}
                        </p>
                        {pro.premium_badge && (
                          <span style={{ background: "#faad14", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, marginRight: "6px" }}>
                            Premium
                          </span>
                        )}
                        {pro.id_verified && (
                          <span style={{ background: "#52c41a", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                            ✓ Verified
                          </span>
                        )}
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          <Link
                            to={`/professional-profile/${pro.id}`}
                            className="wt-btn"
                            style={{ padding: "5px 12px", fontSize: "12px" }}
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => removeSaved(pro.id)}
                            style={{
                              padding: "5px 12px",
                              fontSize: "12px",
                              background: "none",
                              border: "1px solid #f5222d",
                              color: "#f5222d",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
