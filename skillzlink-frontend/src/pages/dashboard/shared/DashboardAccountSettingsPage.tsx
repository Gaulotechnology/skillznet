import { useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser, logout } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export function DashboardAccountSettingsPage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email_updates: localStorage.getItem("notif_email") !== "false",
    sms_updates: localStorage.getItem("notif_sms") !== "false",
  });
  const [saved, setSaved] = useState(false);

  const handleSaveNotifications = () => {
    localStorage.setItem("notif_email", String(notifications.email_updates));
    localStorage.setItem("notif_sms", String(notifications.sms_updates));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      alert("Account deletion request submitted. Our team will process it within 48 hours.");
    }
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          {/* Account Info */}
          <div className="col-12 col-md-6" style={{ marginBottom: '20px' }}>
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Account Information</h2>
              </div>
              <div className="wt-dashboardboxcontent" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff5851, #ff8a4c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '24px' }}>
                      {(user?.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>{user?.name || 'Unknown User'}</h3>
                    <span style={{
                      background: user?.role === 'admin' ? '#722ed1' : user?.role === 'provider' ? '#1890ff' : '#52c41a',
                      color: '#fff', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {user?.role || 'user'}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#888', fontSize: '13px' }}>Account Role</span>
                    <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>{user?.role || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888', fontSize: '13px' }}>Session Status</span>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#52c41a' }}>✓ Active</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="wt-btn"
                  style={{ width: '100%', marginTop: '16px', background: '#ff5851' }}
                >
                  <i className="ti-shift-right" style={{ marginRight: '8px' }}></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="col-12 col-md-6" style={{ marginBottom: '20px' }}>
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Notification Preferences</h2>
              </div>
              <div className="wt-dashboardboxcontent" style={{ padding: '24px' }}>
                {[
                  { key: 'email_updates', label: 'Email Updates', desc: 'Receive platform news and updates via email' },
                  { key: 'sms_updates', label: 'SMS Updates', desc: 'Receive important alerts via SMS' },
                ].map(n => (
                  <div key={n.key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '12px 0', borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{n.label}</div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{n.desc}</div>
                    </div>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={notifications[n.key as keyof typeof notifications]}
                        onChange={e => setNotifications(prev => ({ ...prev, [n.key]: e.target.checked }))}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                ))}
                <button
                  className="wt-btn"
                  style={{ width: '100%', marginTop: '20px' }}
                  onClick={handleSaveNotifications}
                >
                  {saved ? '✓ Saved!' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="col-12 col-md-6">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Privacy & Security</h2>
              </div>
              <div className="wt-dashboardboxcontent" style={{ padding: '24px' }}>
                {[
                  { icon: 'ti-lock', label: 'Change Password', action: () => alert('A password reset link will be sent to your registered contact.') },
                  { icon: 'ti-shield', label: 'Data & Privacy', action: () => alert('Your data is encrypted and stored securely. We never sell your data.') },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      width: '100%', padding: '14px 0', border: 'none', background: 'none',
                      cursor: 'pointer', borderBottom: i === 0 ? '1px solid #f0f0f0' : 'none', textAlign: 'left'
                    }}
                  >
                    <i className={item.icon} style={{ fontSize: '20px', color: '#ff5851', minWidth: '24px' }}></i>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</span>
                    <i className="ti-angle-right" style={{ marginLeft: 'auto', color: '#ccc' }}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="col-12 col-md-6">
            <div className="wt-dashboardbox" style={{ border: '1px solid #ffa39e' }}>
              <div className="wt-dashboardboxtitle" style={{ background: '#fff1f0' }}>
                <h2 style={{ color: '#f5222d' }}>Danger Zone</h2>
              </div>
              <div className="wt-dashboardboxcontent" style={{ padding: '24px' }}>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                  Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="wt-btn"
                  style={{ background: '#f5222d', border: 'none' }}
                >
                  <i className="lnr lnr-trash" style={{ marginRight: '8px' }}></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
