import { useState, useEffect } from "react";
import { publicApi, type MatchingRequest } from "../services/api";

const zimbabweCities = [
  "Harare",
  "Bulawayo",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Masvingo",
  "Chinhoyi",
  "Marondera",
  "Kadoma",
  "Bindura",
  "Hwange",
  "Victoria Falls",
];

const popularCategories = [
  { name: "Plumbing", icon: "fas fa-tint", color: "from-blue-500 to-cyan-500" },
  { name: "Electrical", icon: "fas fa-bolt", color: "from-amber-500 to-yellow-500" },
  { name: "Cleaning", icon: "fas fa-magic", color: "from-emerald-500 to-teal-500" },
  { name: "Carpentry", icon: "fas fa-wrench", color: "from-orange-500 to-amber-600" },
  { name: "Painting", icon: "fas fa-paint-brush", color: "from-purple-500 to-indigo-500" },
  { name: "Tutoring", icon: "fas fa-graduation-cap", color: "from-pink-500 to-rose-500" },
  { name: "Gardening", icon: "fas fa-leaf", color: "from-green-500 to-emerald-600" },
  { name: "Mechanic", icon: "fas fa-cogs", color: "from-slate-600 to-slate-800" },
];

export function OnDemandHirePage() {
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Harare");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState<"immediate" | "same_day" | "flexible">("immediate");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Radar Broadcast State
  const [activeRequest, setActiveRequest] = useState<MatchingRequest | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer for active radar search
  useEffect(() => {
    let timer: any;
    if (activeRequest && activeRequest.status === "broadcasting") {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeRequest]);

  // Polling for instant match confirmation
  useEffect(() => {
    let pollInterval: any;
    if (activeRequest && activeRequest.status === "broadcasting") {
      pollInterval = setInterval(async () => {
        try {
          const res = await publicApi.getGuestMatchingRequest(activeRequest.id);
          if (res.request) {
            setActiveRequest(res.request);
            if (res.request.status === "matched" || res.request.status === "cancelled") {
              clearInterval(pollInterval);
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 2500);
    }
    return () => clearInterval(pollInterval);
  }, [activeRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!guestPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Please specify what you need done.");
      return;
    }
    if (!address.trim()) {
      setError("Please enter your specific address or area.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await publicApi.createGuestMatchingRequest({
        guest_name: guestName,
        guest_phone: guestPhone,
        service_category: category,
        title: jobTitle,
        description: description || undefined,
        city: city,
        address: address,
        urgency: urgency,
        budget: budget ? parseFloat(budget) : undefined,
      });

      // Save token to session so guest has auth access
      if (res.token) {
        localStorage.setItem("auth_token", res.token);
        if (res.user) {
          localStorage.setItem("auth_user", JSON.stringify(res.user));
        }
      }

      setActiveRequest(res.request);
      setElapsedSeconds(0);
    } catch (err: any) {
      setError(err.message || "Failed to start on-demand matching. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    try {
      const res = await publicApi.cancelGuestMatchingRequest(activeRequest.id);
      setActiveRequest(res.request);
    } catch (err: any) {
      alert("Could not cancel request: " + err.message);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-[var(--bg-secondary)] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] text-xs font-black uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-ping" />
            Instant On-Demand Hiring (Uber-Style)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Request an Artisan in Seconds
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xl mx-auto font-medium">
            Post your task now without hassle. Our system broadcasts your request to nearby verified professionals. The first to accept gets the job!
          </p>
        </div>

        {/* ACTIVE RADAR BROADCAST SCREEN */}
        {activeRequest && activeRequest.status === "broadcasting" && (
          <div className="bg-[var(--bg-primary)] border-2 border-[var(--accent-color)] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center space-y-8 animate-fadeIn">
            {/* Concentric Radar Waves */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[var(--accent-color)]/10 animate-ping" />
              <div className="absolute inset-4 rounded-full bg-[var(--accent-color)]/20 animate-pulse" />
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-[var(--accent-color)] animate-spin" style={{ animationDuration: "12s" }} />
              <div className="w-24 h-24 rounded-full bg-[var(--accent-color)] text-white flex flex-col items-center justify-center shadow-lg shadow-[var(--accent-color)]/40 z-10">
                <i className="lnr lnr-sync text-3xl animate-spin" style={{ animationDuration: "4s" }} />
                <span className="text-[11px] font-black mt-1">{formatSeconds(elapsedSeconds)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[var(--text-primary)]">
                Broadcasting to Verified {activeRequest.service_category}s...
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                Notifying top available artisans in <span className="font-bold text-[var(--text-primary)]">{activeRequest.city}</span> ({activeRequest.address}).
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 max-w-md mx-auto text-left flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center shrink-0 text-xl font-bold">
                ⚡
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-[var(--text-primary)]">{activeRequest.title}</div>
                <div className="text-[var(--text-secondary)]">Urgency: <span className="font-semibold text-rose-500 capitalize">{activeRequest.urgency}</span> • Budget: ${activeRequest.budget || "Flexible"}</div>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancelRequest}
                className="px-6 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                Cancel Broadcast
              </button>
            </div>
          </div>
        )}

        {/* MATCH CELEBRATION CARD */}
        {activeRequest && activeRequest.status === "matched" && (
          <div className="bg-[var(--bg-primary)] border-2 border-emerald-500 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20">
              ✓
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
                Artisan Confirmed & Dispatched!
              </span>
              <h2 className="text-3xl font-black text-[var(--text-primary)]">
                {activeRequest.matched_provider?.user?.name || "Verified Professional"} Accepted Your Request
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                Your on-demand service has been locked. Connect directly with your assigned artisan below:
              </p>
            </div>

            {/* Provider Card */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-5 text-left">
              <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-md">
                {activeRequest.matched_provider?.image ? (
                  <img src={activeRequest.matched_provider.image} alt="Artisan" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-600">
                    {(activeRequest.matched_provider?.user?.name || "P")[0]}
                  </div>
                )}
              </div>
              <div className="space-y-1 flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-bold text-[var(--text-primary)]">
                    {activeRequest.matched_provider?.user?.name || "Artisan"}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Verified</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  {activeRequest.matched_provider?.service_category || activeRequest.service_category} Specialist
                </p>
                <div className="text-xs text-amber-500 font-bold flex items-center justify-center sm:justify-start gap-1">
                  ★ {activeRequest.matched_provider?.rating || "4.9"} <span className="text-[var(--text-secondary)]">({activeRequest.matched_provider?.reviews || 24} reviews)</span>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {activeRequest.matched_provider?.user?.phone_number && (
                <>
                  <a
                    href={`https://wa.me/${activeRequest.matched_provider.user.phone_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${activeRequest.matched_provider.user.name}, I posted the on-demand request on SkillzNet: ${activeRequest.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <i className="lnr lnr-bubble text-lg" />
                    <span>WhatsApp Artisan</span>
                  </a>

                  <a
                    href={`tel:${activeRequest.matched_provider.user.phone_number}`}
                    className="px-6 py-3.5 rounded-2xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[var(--accent-color)]/30 transition-all active:scale-95"
                  >
                    <i className="lnr lnr-phone-handset text-lg" />
                    <span>Call ({activeRequest.matched_provider.user.phone_number})</span>
                  </a>
                </>
              )}

              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="px-6 py-3.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] font-bold text-sm"
              >
                Post Another Request
              </button>
            </div>
          </div>
        )}

        {/* CANCELLED STATE */}
        {activeRequest && activeRequest.status === "cancelled" && (
          <div className="bg-[var(--bg-primary)] border border-rose-200 rounded-3xl p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-rose-600">On-Demand Broadcast Cancelled</h3>
            <p className="text-sm text-[var(--text-secondary)]">You cancelled this request. You can create a new broadcast anytime.</p>
            <button
              type="button"
              onClick={() => setActiveRequest(null)}
              className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-bold text-xs"
            >
              Start New Request
            </button>
          </div>
        )}

        {/* ON-DEMAND FORM (WHEN NOT BROADCASTING) */}
        {(!activeRequest || activeRequest.status === "cancelled" || activeRequest.status === "expired") && (
          <form onSubmit={handleSubmit} className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 shadow-sm space-y-8">
            
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
                <i className="lnr lnr-warning text-lg" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Contact Info (Guest) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--accent-color)] text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Your Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Tariro Moyo"
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. 0771234567 or +263771234567"
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Choose Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--accent-color)] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Select Trade / Professional Category</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {popularCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                      category === cat.name
                        ? "border-[var(--accent-color)] bg-[var(--accent-light)] shadow-md"
                        : "border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${cat.color}`}>
                      <i className={`${cat.icon} text-lg`} />
                    </div>
                    <span className={`text-xs font-bold ${category === cat.name ? "text-[var(--accent-color)]" : "text-[var(--text-primary)]"}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Job Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--accent-color)] text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Describe the Job & Location</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Job Title / What needs to be done? <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Emergency pipe leak repair in kitchen"
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    >
                      {zimbabweCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Specific Address / Suburb <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 45 Borrowdale Rd, Harare"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgency("immediate")}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          urgency === "immediate"
                            ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                            : "border-[var(--border-color)] text-[var(--text-secondary)]"
                        }`}
                      >
                        ⚡ Immediate
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency("same_day")}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          urgency === "same_day"
                            ? "bg-amber-50 border-amber-500 text-amber-700 shadow-sm"
                            : "border-[var(--border-color)] text-[var(--text-secondary)]"
                        }`}
                      >
                        📅 Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency("flexible")}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          urgency === "flexible"
                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                            : "border-[var(--border-color)] text-[var(--text-secondary)]"
                        }`}
                      >
                        🕒 Flexible
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Estimated Budget (USD, Optional)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide any specific details or gate code..."
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-black text-base shadow-xl shadow-[var(--accent-color)]/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Broadcasting Request...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Broadcast On-Demand Request Now</span>
                    <i className="lnr lnr-arrow-right text-lg font-black" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[var(--text-secondary)] mt-3">
                No credit card required. Connect directly and settle with the artisan upon completion.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
