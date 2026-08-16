import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { publicApi, seekerApi, type MatchingRequest } from "../../../services/api";

interface LocalSearchResult {
  id: number;
  name?: string;
  provider_name?: string;
  service_category: string;
  rating?: number;
  distance?: number;
  description?: string;
  contact_number_masked?: string;
  premium_badge?: boolean;
  id_verified?: boolean;
}

const zimbabweCities: Record<string, { lat: number; lng: number }> = {
  Harare: { lat: -17.8292, lng: 31.0522 },
  Bulawayo: { lat: -20.1503, lng: 28.5808 },
  Mutare: { lat: -18.9707, lng: 32.6709 },
  Gweru: { lat: -19.4567, lng: 29.8162 },
  Kwekwe: { lat: -18.9282, lng: 29.8149 },
  Masvingo: { lat: -20.0724, lng: 30.8322 },
  Chinhoyi: { lat: -17.3591, lng: 30.1991 },
  Marondera: { lat: -18.1850, lng: 31.5519 },
};

export function DashboardPostRequestPage() {
  const [activeMode, setActiveMode] = useState<"on_demand" | "search">("on_demand");

  // On-Demand Form State
  const [category, setCategory] = useState("Plumbing");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [odCity, setOdCity] = useState("Harare");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState("immediate");
  const [budget, setBudget] = useState("");
  const [submittingOd, setSubmittingOd] = useState(false);

  // Active Radar State
  const [activeRequest, setActiveRequest] = useState<MatchingRequest | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Search Form State
  const [service, setService] = useState("");
  const [city, setCity] = useState("Harare");
  const [radius, setRadius] = useState("25");
  const [results, setResults] = useState<LocalSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revealingId, setRevealingId] = useState<number | null>(null);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const showNotification = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Timer for active radar
  useEffect(() => {
    let timer: any;
    if (activeRequest && activeRequest.status === "broadcasting") {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeRequest?.status]);

  // Polling for active radar request status
  useEffect(() => {
    let poller: any;
    if (activeRequest && activeRequest.status === "broadcasting") {
      poller = setInterval(async () => {
        try {
          const res = await seekerApi.getMatchingRequest(activeRequest.id);
          if (res.request) {
            setActiveRequest(res.request);
            if (res.request.status === "matched") {
              showNotification("🎉 Professional matched and dispatched!", "success");
            }
          }
        } catch {
          // ignore transient poll error
        }
      }, 2500);
    }
    return () => clearInterval(poller);
  }, [activeRequest?.id, activeRequest?.status]);

  const handleCreateOnDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOd(true);
    setElapsedSeconds(0);
    try {
      const res = await seekerApi.createMatchingRequest({
        service_category: category,
        title: jobTitle,
        description,
        city: odCity,
        address,
        urgency,
        budget: budget ? Number(budget) : undefined,
      });
      setActiveRequest(res.request);
      showNotification(`Broadcast dispatched to ${res.request.broadcast_count || 0} verified ${category} providers!`, "success");
    } catch (err: any) {
      showNotification(err.message || "Failed to create request", "error");
    } finally {
      setSubmittingOd(false);
    }
  };

  const handleCancelActiveRequest = async () => {
    if (!activeRequest) return;
    try {
      await seekerApi.cancelMatchingRequest(activeRequest.id);
      setActiveRequest(null);
      showNotification("Request cancelled.", "info");
    } catch (err: any) {
      showNotification(err.message || "Failed to cancel request", "error");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);

    const coords = zimbabweCities[city] || { lat: -17.8292, lng: 31.0522 };

    try {
      try {
        const data = await seekerApi.search(service, coords.lat, coords.lng, parseInt(radius));
        const mappedResults: LocalSearchResult[] = (data.results || []).map(r => ({
          ...r,
          service_category: service
        }));
        setResults(mappedResults);
      } catch {
        const data = await publicApi.listProviders({ category: service });
        const mappedResults: LocalSearchResult[] = data.data.slice(0, 10).map(r => ({
          ...r,
          provider_name: r.name,
          contact_number_masked: r.phone ? r.phone.substring(0, 3) + "****" : undefined
        }));
        setResults(mappedResults);
      }
      setSearched(true);
    } catch (err: any) {
      showNotification(err.message || "Search failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (pro: LocalSearchResult) => {
    const saved = JSON.parse(localStorage.getItem("saved_professionals") || "[]");
    const exists = saved.find((p: any) => p.id === pro.id);
    if (!exists) {
      saved.push({ id: pro.id, name: pro.name || pro.provider_name, service_category: pro.service_category });
      localStorage.setItem("saved_professionals", JSON.stringify(saved));
      showNotification(`${pro.name || pro.provider_name} saved to your list!`, "success");
    } else {
      showNotification("Already saved to your list!", "info");
    }
  };

  const handleRevealContact = async (id: number) => {
    setRevealingId(id);
    try {
      const res = await seekerApi.revealContact(id);
      if (res.contact_available && res.contact_number) {
        const history = JSON.parse(localStorage.getItem("contacted_professionals") || "[]");
        const pro = results.find(r => r.id === id);
        if (pro && !history.find((h: any) => h.id === id)) {
          history.push({
            id, name: pro.name || pro.provider_name,
            service_category: pro.service_category,
            contact_revealed_at: new Date().toISOString(),
            contact_number: res.contact_number,
          });
          localStorage.setItem("contacted_professionals", JSON.stringify(history));
        }
        showNotification(`Contact Number: ${res.contact_number}`, "success");
      } else {
        showNotification("This professional has not enabled contact sharing.", "error");
      }
    } catch {
      showNotification("Please log in as a seeker to reveal contact details.", "error");
    } finally {
      setRevealingId(null);
    }
  };

  return (
    <SeekerLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto relative font-['Inter',sans-serif] space-y-8">
        
        {/* Toast Notification */}
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--text-primary)] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            toastType === 'success' ? 'bg-emerald-500' : 
            toastType === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            <i className={`lnr ${
              toastType === 'success' ? 'lnr-checkmark-circle' : 
              toastType === 'error' ? 'lnr-warning' : 'lnr-info-circle'
            }`}></i>
          </div>
          {toastMessage}
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Request a Professional</h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Use Uber-style instant matching to connect with the first available pro, or browse manually.</p>
          </div>
          <Link
            to="/dashboard/seeker/requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition-all"
          >
            <i className="lnr lnr-list"></i>
            <span>View All Requests</span>
          </Link>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-3 bg-[var(--bg-secondary)] p-1.5 rounded-2xl w-fit border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setActiveMode("on_demand")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === "on_demand"
                ? "bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-color)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <i className="lnr lnr-radar text-base"></i>
            <span>Instant On-Demand Match (Uber Style)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("search")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === "search"
                ? "bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-color)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <i className="lnr lnr-magnifier text-base"></i>
            <span>Browse & Search Manually</span>
          </button>
        </div>

        {/* MODE 1: ON-DEMAND UBER MATCHING */}
        {activeMode === "on_demand" && (
          <div className="space-y-6">
            
            {/* If Active Request Exists: Show Live Radar Screen */}
            {activeRequest ? (
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--border-color)] shadow-xl text-center max-w-3xl mx-auto space-y-8 animate-fade-in">
                
                {activeRequest.status === "broadcasting" ? (
                  <>
                    {/* Pulsing Radar Graphic */}
                    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-[var(--accent-color)]/10 animate-ping"></div>
                      <div className="absolute inset-3 rounded-full bg-[var(--accent-color)]/20 animate-pulse"></div>
                      <div className="w-20 h-20 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center text-3xl shadow-xl shadow-[var(--accent-color)]/30 z-10">
                        <i className="lnr lnr-radar animate-spin" style={{ animationDuration: '4s' }}></i>
                      </div>
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Radar Broadcasting Live
                      </span>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                        Looking for Available {activeRequest.service_category} Professionals...
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
                        Alert dispatched to <strong>{activeRequest.broadcast_count || 1}</strong> verified providers in {activeRequest.city || "your area"}. The first professional to accept gets your job!
                      </p>
                      <div className="mt-4 text-xs font-mono font-bold text-slate-500">
                        Searching: {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:{String(elapsedSeconds % 60).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-left space-y-1">
                      <p className="text-xs font-bold text-slate-900">{activeRequest.title}</p>
                      <p className="text-xs text-slate-500">📍 {activeRequest.address || activeRequest.city} · Urgency: {activeRequest.urgency}</p>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleCancelActiveRequest}
                        className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </>
                ) : activeRequest.status === "matched" ? (
                  <>
                    {/* Match Celebration Screen */}
                    <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                      <i className="lnr lnr-checkmark-circle"></i>
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
                        ⚡ Match Confirmed!
                      </span>
                      <h3 className="text-2xl font-black text-[var(--text-primary)]">
                        {activeRequest.matched_provider?.user?.name || "Your Professional"} Accepted the Job!
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Direct contact details have been unlocked. Call or chat on WhatsApp below to coordinate:
                      </p>
                    </div>

                    {/* Provider Contact Card */}
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)] text-white flex items-center justify-center text-lg font-black shrink-0">
                          {(activeRequest.matched_provider?.user?.name || "P").charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{activeRequest.matched_provider?.user?.name || "Professional"}</h4>
                          <p className="text-xs font-semibold text-emerald-600">Verified {activeRequest.service_category} Specialist</p>
                          <p className="text-xs text-slate-500">📍 {activeRequest.matched_provider?.address || activeRequest.city}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${activeRequest.matched_provider?.phone || activeRequest.matched_provider?.user?.phone_number}`}
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow"
                        >
                          <i className="lnr lnr-phone text-sm"></i>
                          <span>Call Now</span>
                        </a>
                        <a
                          href={`https://wa.me/${(activeRequest.matched_provider?.phone || activeRequest.matched_provider?.user?.phone_number || '').replace(/\+/g, '')}?text=Hi%20${encodeURIComponent(activeRequest.matched_provider?.user?.name || '')},%20I%20requested%20a%20${encodeURIComponent(activeRequest.service_category)}%20service%20on%20SkillzNet.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow"
                        >
                          <i className="lnr lnr-bubble text-sm"></i>
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveRequest(null)}
                        className="px-6 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-xs font-bold transition-all"
                      >
                        Start Another Request
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Request {activeRequest.status}</h3>
                    <button
                      type="button"
                      onClick={() => setActiveRequest(null)}
                      className="mt-4 px-6 py-2.5 bg-[var(--accent-color)] text-white rounded-xl text-xs font-bold"
                    >
                      Create New Request
                    </button>
                  </div>
                )}

              </div>
            ) : (
              /* On-Demand Request Creation Form */
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--border-color)] shadow-sm max-w-3xl mx-auto">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">Instant Dispatch</span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">Post a Service Request to Nearby Providers</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Our matching radar will alert all verified professionals in your area. The first one to accept takes the job.
                  </p>
                </div>

                <form onSubmit={handleCreateOnDemand} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                        Service Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                      >
                        <option value="Plumbing">Plumbing</option>
                        <option value="Cleaning">Cleaning & Housekeeping</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Painting">Painting</option>
                        <option value="Gardening">Gardening</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                        City / Town *
                      </label>
                      <select
                        value={odCity}
                        onChange={(e) => setOdCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                      >
                        {Object.keys(zimbabweCities).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                      Job Title / Short Summary *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Emergency burst pipe in kitchen, or Deep house cleaning"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                        Neighborhood / Street Address *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 24 Samora Machel Ave, Avondale"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                        Urgency Level
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                      >
                        <option value="immediate">⚡ Immediate / ASAP (Emergency)</option>
                        <option value="same_day">📅 Today (Same Day)</option>
                        <option value="flexible">🕒 Flexible / Within this week</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                      Details / Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the issue, specific tools needed, or access instructions..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                      Estimated Budget (USD $, Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] font-medium text-sm outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submittingOd}
                      className="w-full py-4 rounded-2xl bg-[var(--accent-color)] text-white font-bold text-sm hover:bg-[var(--accent-hover)] transition-all active:scale-98 shadow-lg shadow-[var(--accent-color)]/25 flex items-center justify-center gap-2.5"
                    >
                      {submittingOd ? (
                        <><i className="lnr lnr-sync animate-spin text-base"></i> Broadcasting Request...</>
                      ) : (
                        <><i className="lnr lnr-radar text-lg"></i> Find Professional Now (Broadcast Job)</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* MODE 2: MANUAL SEARCH & DIRECTORY */}
        {activeMode === "search" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--border-color)]">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Service Type *</label>
                  <div className="relative">
                    <i className="lnr lnr-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
                    <input
                      type="text"
                      placeholder="e.g. Plumber, Electrician, Cleaner..."
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:bg-white focus:border-[var(--accent-color)] font-medium"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">City</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--accent-color)] font-medium"
                  >
                    {Object.keys(zimbabweCities).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Radius</label>
                  <select 
                    value={radius} 
                    onChange={(e) => setRadius(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--accent-color)] font-medium"
                  >
                    {["5", "10", "25", "50", "100"].map((r) => (
                      <option key={r} value={r}>{r} km</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-auto flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? <i className="lnr lnr-sync animate-spin"></i> : <i className="lnr lnr-magnifier"></i>}
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Results Grid */}
            {searched && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  {results.length} Professionals Found in {city}
                </h3>
                {results.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[var(--border-color)]">
                    <i className="lnr lnr-warning text-4xl text-[var(--accent-color)] mb-3 block"></i>
                    <p className="font-bold text-slate-800">No professionals found matching your search</p>
                    <p className="text-xs text-slate-500 mt-1">Try broadening your search or use Instant On-Demand matching.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((pro) => (
                      <div key={pro.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                              {pro.service_category}
                            </span>
                            {pro.rating && (
                              <span className="text-xs font-bold text-amber-500">★ {pro.rating}</span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{pro.name || pro.provider_name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pro.description || "Experienced trade professional in Zimbabwe."}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                          <Link
                            to={`/professional-profile/${pro.id}`}
                            className="text-xs font-bold text-[var(--accent-color)] hover:underline"
                          >
                            View Profile
                          </Link>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(pro)}
                              className="p-2 rounded-lg bg-[var(--bg-secondary)] text-slate-600 hover:text-slate-900"
                              title="Save to list"
                            >
                              <i className="lnr lnr-heart text-sm"></i>
                            </button>
                            <button
                              onClick={() => handleRevealContact(pro.id)}
                              disabled={revealingId === pro.id}
                              className="px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] text-white text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
                            >
                              {revealingId === pro.id ? "Loading..." : "Get Contact"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </SeekerLayout>
  );
}
