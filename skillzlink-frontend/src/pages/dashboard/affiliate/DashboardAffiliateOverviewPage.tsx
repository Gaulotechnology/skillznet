import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { affiliateApi } from "../../../services/api";

export function DashboardAffiliateOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_clicks: 0, total_signups: 0, total_earnings: 0, pending_payout: 0 });
  const [referralLink, setReferralLink] = useState("");
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    affiliateApi.getOverview().then((data: any) => {
      setStats(data.stats || { total_clicks: 0, total_signups: 0, total_earnings: 0, pending_payout: 0 });
      setReferralLink(data.referral_link || "");
      setRecentReferrals(data.recent_referrals || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    try {
      await affiliateApi.requestPayout();
      alert("Payout requested successfully!");
    } catch {
      alert("Failed to request payout.");
    }
    setRequestingPayout(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-['Inter',sans-serif]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Affiliate Overview</h2>
            <p className="text-[var(--text-secondary)] mt-1">Manage your referral links and track your commissions.</p>
          </div>
          <button onClick={handleRequestPayout} disabled={requestingPayout} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors active:scale-95">
            {requestingPayout ? "Requesting..." : "Request Payout"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-pointer"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium mb-1">Total Clicks</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.total_clicks}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-users"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium mb-1">Total Signups</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.total_signups}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-diamond"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium mb-1">Total Earnings</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">${stats.total_earnings.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <i className="lnr lnr-link text-[var(--accent-color)]"></i> Your Referral Link
          </h3>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              readOnly 
              className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none font-medium text-[var(--text-secondary)]"
              value={referralLink}
            />
            <button onClick={handleCopy} className="px-5 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-colors">
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Recent Referrals */}
        {recentReferrals.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">Recent Referrals</h3>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {recentReferrals.map((ref: any, i: number) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                  <div>
                    <div className="font-bold text-[var(--text-primary)] text-sm">{ref.name || ref.email || "User"}</div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">{ref.date || ref.created_at || ""}</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{ref.status || "Signed up"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
