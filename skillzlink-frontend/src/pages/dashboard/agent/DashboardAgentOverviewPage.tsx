import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { agentApi } from "../../../services/api";

export function DashboardAgentOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_onboarded: 0, commission_earned: 0, active_providers: 0 });
  const [onboardingLink, setOnboardingLink] = useState("");
  const [onboardedProviders, setOnboardedProviders] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    agentApi.getOverview().then((data: any) => {
      setStats(data.stats || { total_onboarded: 0, commission_earned: 0, active_providers: 0 });
      setOnboardingLink(data.onboarding_link || "");
      setOnboardedProviders(data.onboarded_providers || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(onboardingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Agent Overview</h2>
          <p className="text-slate-500 mt-1">Manage your onboarded professionals and field operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-users"></i>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Total Onboarded</h3>
            <div className="text-3xl font-black text-slate-800">{stats.total_onboarded}</div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-chart-bars"></i>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Commission Earned</h3>
            <div className="text-3xl font-black text-slate-800">${stats.commission_earned.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mb-4">
              <i className="lnr lnr-briefcase"></i>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Active Providers</h3>
            <div className="text-3xl font-black text-slate-800">{stats.active_providers}</div>
          </div>
        </div>

        {/* Onboarding Link */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="lnr lnr-link text-amber-500"></i> Your Onboarding Link
          </h3>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              readOnly 
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-600"
              value={onboardingLink}
            />
            <button onClick={handleCopy} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-sm shadow-amber-200">
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Onboarded Providers */}
        {onboardedProviders.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Onboarded Providers</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {onboardedProviders.map((p: any, i: number) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {(p.name || "P")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{p.service_category || p.category || ""}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${p.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
                    {p.status || "onboarded"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
