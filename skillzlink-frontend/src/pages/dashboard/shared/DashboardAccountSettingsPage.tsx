import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser, logout, accountApi } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export function DashboardAccountSettingsPage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email_updates: true,
    sms_updates: true,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{title: string, message: string} | null>(null);

  useEffect(() => {
    accountApi.getSettings().then((data: any) => {
      setNotifications(data.settings || { email_updates: true, sms_updates: true });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await accountApi.updateSettings(notifications);
      showToast("Preferences Saved", "Your notification preferences have been updated.");
    } catch {
      showToast("Error", "Failed to save preferences.");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? All your data will be permanently removed. This action cannot be undone.');
    if (confirmed) {
      try {
        await accountApi.deleteAccount();
        logout();
        navigate("/login");
      } catch {
        showToast("Error", "Failed to delete account.");
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await accountApi.requestPasswordReset();
      showToast("Email Sent", "A password reset link has been sent to your registered email address.");
    } catch {
      showToast("Error", "Failed to send reset email.");
    }
  };

  const handlePrivacyData = () => {
    window.alert('Your data is encrypted and stored securely following industry standards. We never sell your personal data to third parties. You can download a copy of your data at any time from this page.');
  };

  const roleColors = {
    admin: 'bg-[var(--accent-light)] text-[var(--accent-color)] border-[var(--border-color)]',
    provider: 'bg-[var(--accent-light)] text-[var(--accent-color)] border-[var(--border-color)]',
    customer: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    default: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
  };
  
  const userRole = user?.role as keyof typeof roleColors || 'default';
  const roleColorClass = roleColors[userRole] || roleColors.default;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto relative font-['Inter',sans-serif]">
        {/* Toast Notification */}
        {toast && (
          <div className="absolute top-0 right-8 z-50 animate-fade-in bg-[var(--text-primary)] text-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <i className="lnr lnr-checkmark-circle text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm">{toast.title}</h4>
              <p className="text-gray-300 text-xs font-medium">{toast.message}</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Account Settings</h2>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage your security preferences and account details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Account Info */}
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <i className="lnr lnr-user text-[var(--accent-color)]"></i> Account Information
                </h3>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-[var(--accent-light)] flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                    <span className="text-[var(--accent-color)] font-black text-3xl">
                      {(user?.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[var(--text-primary)] mb-1">{user?.name || 'Unknown User'}</h4>
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${roleColorClass}`}>
                      {user?.role || 'user'}
                    </span>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-3xl p-5 border border-[var(--border-color)] mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[var(--text-secondary)] font-medium text-sm">Account Role</span>
                    <span className="font-bold text-[var(--text-primary)] capitalize">{user?.role || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] font-medium text-sm">Session Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold hover:bg-[var(--border-color)] transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="lnr lnr-exit"></i> Sign Out
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[var(--bg-primary)] rounded-3xl shadow-sm border border-red-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-red-100 bg-red-50/50">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <i className="lnr lnr-warning"></i> Danger Zone
                </h3>
              </div>
              
              <div className="p-6 md:p-8">
                <p className="text-[var(--text-secondary)] font-medium text-sm mb-6 leading-relaxed">
                  Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-3.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold hover:bg-red-100 hover:border-red-300 transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="lnr lnr-trash"></i> Delete Account
                </button>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Notification Preferences */}
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <i className="lnr lnr-bullhorn text-amber-500"></i> Notification Preferences
                </h3>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="space-y-6 mb-8">
                  {[
                    { key: 'email_updates', label: 'Email Updates', desc: 'Receive platform news and updates via email' },
                    { key: 'sms_updates', label: 'SMS Updates', desc: 'Receive important alerts via SMS' },
                  ].map(n => (
                    <div key={n.key} className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-[var(--text-primary)] mb-1">{n.label}</div>
                        <div className="text-[var(--text-secondary)] text-sm font-medium">{n.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications[n.key as keyof typeof notifications]}
                          onChange={e => setNotifications(prev => ({ ...prev, [n.key]: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-primary)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)] transition-colors"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><i className="lnr lnr-sync animate-spin"></i> Saving...</>
                  ) : (
                    <><i className="lnr lnr-checkmark-circle"></i> Save Preferences</>
                  )}
                </button>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <i className="lnr lnr-lock text-emerald-500"></i> Privacy & Security
                </h3>
              </div>
              
              <div className="p-6 md:p-8 space-y-3">
                <button
                  onClick={handlePasswordReset}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/30 hover:bg-[var(--accent-light)] transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center shadow-sm text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors shrink-0">
                    <i className="lnr lnr-keyboard text-xl"></i>
                  </div>
                  <span className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] flex-1">Change Password</span>
                  <i className="lnr lnr-chevron-right text-[var(--text-secondary)]"></i>
                </button>
                
                <button
                  onClick={handlePrivacyData}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-emerald-200 hover:bg-emerald-50 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center shadow-sm text-[var(--text-secondary)] group-hover:text-emerald-600 transition-colors shrink-0">
                    <i className="lnr lnr-shield text-xl"></i>
                  </div>
                  <span className="font-bold text-[var(--text-primary)] group-hover:text-emerald-600 flex-1">Data & Privacy</span>
                  <i className="lnr lnr-chevron-right text-[var(--text-secondary)]"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
