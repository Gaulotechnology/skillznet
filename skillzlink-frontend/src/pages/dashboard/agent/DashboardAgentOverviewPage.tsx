import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { agentApi } from "../../../services/api";

export function DashboardAgentOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_onboarded: 0, commission_earned: 0, active_providers: 0, pending_commission: 0 });
  const [onboardingLink, setOnboardingLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    agentApi.getOverview().then((data: any) => {
      setStats(data.stats || { total_onboarded: 0, commission_earned: 0, active_providers: 0, pending_commission: 0 });
      setOnboardingLink(data.onboarding_link || "");
      setReferralCode(data.referral_code || "");
      setRecentReferrals(data.recent_referrals || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const qrCodeUrl = onboardingLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(onboardingLink)}`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(onboardingLink);
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
          url: onboardingLink,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
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
        <div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Agent Dashboard</h2>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Grow your network and track your referrals and commissions.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-users"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Total Referrals</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.total_onboarded}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-briefcase"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Active Providers</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.active_providers}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-diamond"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Commission Earned</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">${stats.commission_earned.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-clock"></i>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium text-sm mb-1">Pending</h3>
            <div className="text-3xl font-black text-[var(--text-primary)]">${stats.pending_commission.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code & Referral Link */}
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <i className="lnr lnr-link text-[var(--accent-color)]"></i> Your Referral Link
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Share this link or QR code to onboard providers and seekers. You earn commissions on every successful referral.
            </p>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 inline-block">
                <img src={qrCodeUrl} alt="QR Code" width={180} height={180} />
              </div>
              <span className="text-xs font-bold text-[var(--text-secondary)] mt-2 uppercase tracking-wider">Scan to join</span>
            </div>

            {/* Referral Code */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--text-secondary)] font-medium">Referral Code</span>
                <div className="font-mono font-bold text-[var(--text-primary)] text-lg">{referralCode}</div>
              </div>
              <button onClick={handleCopyCode} className="px-4 py-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] font-bold text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Link */}
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                readOnly 
                className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none font-medium text-[var(--text-secondary)] text-sm"
                value={onboardingLink}
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
                <p className="font-medium">No referrals yet. Share your link to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {recentReferrals.map((r: any, i: number) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center font-bold text-[var(--accent-color)]">
                        {(r.name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)] text-sm">{r.name}</div>
                        <div className="text-xs text-[var(--text-secondary)] font-medium capitalize">
                          {r.role} {r.service_category ? `· ${r.service_category}` : ""}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${r.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      {r.status}
                    </span>
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
