import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser } from "../../../services/api";

export function DashboardMessagesPage() {
  const user = getCurrentUser();

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="wt-dashboardbox">
          <div className="wt-dashboardboxtitle">
            <h2>Messages</h2>
          </div>
          <div className="wt-dashboardboxcontent" style={{ padding: "40px", textAlign: "center" }}>
            {/* Messaging Info Card */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              padding: "32px",
              color: "#fff",
              maxWidth: "520px",
              margin: "0 auto 28px",
            }}>
              <i className="lnr lnr-bubble" style={{ fontSize: "48px", display: "block", marginBottom: "16px", opacity: 0.9 }}></i>
              <h3 style={{ color: "#fff", margin: "0 0 10px", fontSize: "20px" }}>Direct Communication</h3>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                SkillzLink connects you directly with professionals via phone call or WhatsApp.
                Reveal a professional's contact number on their profile to start a conversation.
              </p>
            </div>

            {/* Logged-in user info */}
            <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px", maxWidth: "520px", margin: "0 auto 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff5851, #ff8a4c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "20px" }}>
                    {(user?.name || "U")[0].toUpperCase()}
                  </span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{user?.name || "User"}</div>
                  <div style={{ color: "#888", fontSize: "12px", textTransform: "capitalize" }}>{user?.role || "member"}</div>
                </div>
              </div>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.6, textAlign: "left", margin: 0 }}>
                Your account's contact information is used when professionals reach out to you. 
                Keep your phone number updated to ensure you receive calls.
              </p>
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", maxWidth: "520px", margin: "0 auto" }}>
              <Link to="/nearby-professionals" className="wt-btn" style={{ padding: "12px 24px" }}>
                <i className="lnr lnr-magnifier" style={{ marginRight: "8px" }}></i>
                Find Professionals
              </Link>
              <Link to="/dashboard/saved" className="wt-btn" style={{ padding: "12px 24px", background: "#764ba2" }}>
                <i className="lnr lnr-heart" style={{ marginRight: "8px" }}></i>
                Saved Professionals
              </Link>
              {user?.role === "provider" && (
                <Link to="/dashboard/profile" className="wt-btn" style={{ padding: "12px 24px", background: "#52c41a" }}>
                  <i className="lnr lnr-phone-handset" style={{ marginRight: "8px" }}></i>
                  Enable Contact Opt-in
                </Link>
              )}
            </div>

            {/* Contact tip */}
            <div style={{ marginTop: "28px", padding: "16px", background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: "8px", maxWidth: "520px", margin: "28px auto 0" }}>
              <p style={{ color: "#d48806", fontSize: "13px", margin: 0 }}>
                <i className="lnr lnr-star" style={{ marginRight: "8px" }}></i>
                <strong>Tip:</strong> Premium professionals have their contact details readily available. 
                Verified providers with the ✓ badge are identity-checked for your safety.
              </p>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
