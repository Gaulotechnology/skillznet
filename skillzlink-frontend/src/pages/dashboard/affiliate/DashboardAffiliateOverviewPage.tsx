import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { affiliateApi } from "../../../services/api";

export function DashboardAffiliateOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_clicks: 0, total_signups: 0, total_earnings: 0, pending_payout: 0 });
  const [referralLink, setReferralLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    affiliateApi.getOverview().then((data: any) => {
      setStats(data.stats || { total_clicks: 0, total_signups: 0, total_earnings: 0, pending_payout: 0 });
      setReferralLink(data.referral_link || "");
      setReferralCode(data.referral_code || "");
      setRecentReferrals(data.recent_referrals || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const qrCodeUrl = referralLink ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join SkillzLink",
          text: `Join SkillzLink using my referral link! Use code: ${referralCode}`,
          url: referralLink,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    try {
      await affiliateApi.requestPayout();
      alert("Payout requested successfully!");
      // Refresh
      affiliateApi.getOverview().then((data: any) => {
        setStats(data.stats || stats);
      });
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
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Affiliate Dashboard</h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage your referral links and track your commissions.</p>
          </div>
          <button onClick={handleRequestPayout} disabled={requestingPayout} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors active:scale-95">
            {requestingPayout ? "Requesting..." : "Request Payout"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-pointer"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Total Clicks</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.total_clicks}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-users"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Total Signups</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.total_signups}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-diamond"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Total Earnings</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">${stats.total_earnings.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-clock"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Pending Payout</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">${stats.pending_payout.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code & Referral Link */}
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <i className="lnr lnr-link text-[var(--accent-color)]"></i> Your Referral Link
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Share this link or QR code to attract users. Earn commissions on every signup through your link.
            </p>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 inline-block">
                <img src={qrCodeUrl} alt="QR Code" width={180} height={180} />
              </div>
              <span className="text-xs font-bold text-[var(--text-secondary)] mt-2 uppercase tracking-wider">Scan to join</span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl p-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--text-secondary)] font-medium">Referral Code</span>
                <div className="font-mono font-bold text-[var(--text-primary)] text-lg">{referralCode}</div>
              </div>
              <button onClick={handleCopyCode} className="px-4 py-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] font-bold text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="flex items-center gap-3 mb-0">
              <input 
                type="text" 
                readOnly 
                className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none font-medium text-[var(--text-secondary)] text-sm"
                value={referralLink}
              />
              <button onClick={handleCopyLink} className="px-5 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap">
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <button onClick={handleShare} className="mt-4 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
              <i className="lnr lnr-share"></i> Share Link
            </button>
          </div>

          {/* Recent Referrals */}
          <div className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">Recent Referrals</h3>
            </div>
            
            {recentReferrals.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-secondary)]">
                <i className="lnr lnr-users text-4xl block mb-3"></i>
                <p className="font-medium">No signups yet. Share your link to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {recentReferrals.map((ref: any, i: number) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-sm">{ref.name || ref.email || "User"}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-medium capitalize">{ref.role} · {new Date(ref.date).toLocaleDateString()}</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">{ref.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
