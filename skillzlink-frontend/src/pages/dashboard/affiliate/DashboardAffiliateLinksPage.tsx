import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { affiliateApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

export function DashboardAffiliateLinksPage() {
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [recentClicks, setRecentClicks] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_clicks: 0, today_clicks: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    affiliateApi.getLinks().then((data: any) => {
      setReferralLink(data.referral_link || "");
      setReferralCode(data.referral_code || "");
      setRecentClicks(data.recent_clicks || []);
      setStats(data.stats || { total_clicks: 0, today_clicks: 0 });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const qrCodeUrl = referralLink ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
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
      handleCopy();
    }
  };

  const clickColumns: Column<any>[] = [
    {
      key: "clicked_at",
      label: "Date & Time",
      render: (c) => <span className="text-sm text-[var(--text-primary)]">{new Date(c.clicked_at).toLocaleString()}</span>,
      exportValue: (c) => c.clicked_at,
    },
    {
      key: "ip",
      label: "Source",
      render: (c) => <span className="text-sm text-[var(--text-secondary)] font-mono text-xs">{c.ip || "Unknown"}</span>,
      exportValue: (c) => c.ip || "",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-['Inter',sans-serif]">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Referral Links</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Generate and share referral links to attract new users.</p>
        </div>

        {/* Link Card */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* QR Code */}
            <div className="flex flex-col items-center shrink-0">
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-3 inline-block">
                <img src={qrCodeUrl} alt="QR Code" width={180} height={180} />
              </div>
              <span className="text-xs font-bold text-[var(--text-secondary)] mt-2 uppercase tracking-wider">Scan to join</span>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Referral Code</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none font-mono font-bold text-lg text-[var(--text-primary)]"
                    value={referralCode}
                  />
                  <button onClick={() => { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-4 py-3 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] font-bold text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors whitespace-nowrap">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Referral URL</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none font-medium text-[var(--text-secondary)] text-sm"
                    value={referralLink}
                  />
                  <button onClick={handleCopy} className="px-5 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap">
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              <button onClick={handleShare} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                <i className="lnr lnr-share"></i> Share via apps
              </button>
            </div>
          </div>
        </div>

        {/* Click Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] text-center">
            <div className="text-3xl font-black text-[var(--text-primary)]">{stats.total_clicks}</div>
            <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-1">Total Clicks</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] text-center">
            <div className="text-3xl font-black text-emerald-600">{stats.today_clicks}</div>
            <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-1">Today's Clicks</div>
          </div>
        </div>

        {/* Click History */}
        <DataTable
          columns={clickColumns}
          data={recentClicks}
          loading={loading}
          title="Recent Clicks"
          emptyIcon="lnr lnr-pointer"
          emptyMessage="No link clicks recorded yet. Share your link to start tracking."
          exportFileName="affiliate-clicks"
        />
      </div>
    </DashboardLayout>
  );
}
