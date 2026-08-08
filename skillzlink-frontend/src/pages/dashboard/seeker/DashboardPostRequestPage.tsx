import { useState } from "react";
import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { publicApi, seekerApi } from "../../../services/api";

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);

    const coords = zimbabweCities[city] || { lat: -17.8292, lng: 31.0522 };

    try {
      // Try authenticated seeker search first
      try {
        const data = await seekerApi.search(service, coords.lat, coords.lng, parseInt(radius));
        const mappedResults: LocalSearchResult[] = (data.results || []).map(r => ({
          ...r,
          service_category: service
        }));
        setResults(mappedResults);
      } catch {
        // Fall back to public listing if not logged in as seeker
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
        // Save to contacted history
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto relative">
        
        {/* Toast Notification */}
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            toastType === 'success' ? 'bg-emerald-500' : 
            toastType === 'error' ? 'bg-rose-500' : 'bg-blue-500'
          }`}>
            <i className={`lnr ${
              toastType === 'success' ? 'lnr-checkmark-circle' : 
              toastType === 'error' ? 'lnr-warning' : 'lnr-info-circle'
            }`}></i>
          </div>
          {toastMessage}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Find a Professional</h2>
          <p className="text-slate-500 mt-1 font-medium">Search by service type and location to find the right professional near you.</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Type *</label>
              <div className="relative">
                <i className="lnr lnr-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="e.g. Plumber, Electrician, Cleaner..."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
              <div className="relative">
                <i className="lnr lnr-map-marker absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                >
                  {Object.keys(zimbabweCities).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full md:w-32">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Radius (km)</label>
              <select 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
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
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="lnr lnr-sync animate-spin"></i> Searching...</>
                ) : (
                  <><i className="lnr lnr-magnifier"></i> Search</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {results.length > 0
                  ? `${results.length} Professional${results.length !== 1 ? "s" : ""} Found`
                  : "No Professionals Found"}
              </h3>
              {results.length > 0 && (
                <Link to="/nearby-professionals" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                  Browse All Directory
                </Link>
              )}
            </div>
            
            {results.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <i className="lnr lnr-magnifier text-3xl"></i>
                </div>
                <h4 className="text-xl font-bold text-slate-700 mb-2">No professionals found</h4>
                <p className="text-slate-500 max-w-md mx-auto">We couldn't find any professionals for <strong>{service}</strong> in <strong>{city}</strong> within {radius}km. Try expanding your search radius or using different keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((pro) => (
                  <div key={pro.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200 hover:shadow-md transition-all flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm text-white font-black text-xl">
                        {((pro.name || pro.provider_name) || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg mb-0.5">{pro.name || pro.provider_name}</h4>
                        <div className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-1.5">
                          <i className="lnr lnr-briefcase"></i> {pro.service_category}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pro.premium_badge && (
                            <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <i className="lnr lnr-star"></i> Premium
                            </span>
                          )}
                          {pro.id_verified && (
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <i className="lnr lnr-checkmark-circle"></i> ID Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {(pro.rating !== undefined && pro.rating > 0) && (
                      <div className="flex items-center gap-3 mb-4 text-sm font-medium">
                        <div className="flex items-center gap-1 text-amber-400">
                          <i className="lnr lnr-star font-bold"></i>
                          <span className="text-slate-700">{pro.rating.toFixed(1)} Rating</span>
                        </div>
                        {pro.distance !== undefined && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <div className="text-blue-500 flex items-center gap-1">
                              <i className="lnr lnr-map-marker"></i> {pro.distance} km away
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                    {pro.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {pro.description}
                      </p>
                    )}
                    
                    {pro.contact_number_masked && (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl mb-4 text-sm font-mono text-slate-700 flex items-center gap-2 border border-slate-100">
                        <i className="lnr lnr-phone text-slate-400"></i> {pro.contact_number_masked}
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-slate-50 flex gap-2 flex-wrap sm:flex-nowrap">
                      <Link 
                        to={`/professional-profile/${pro.id}`} 
                        className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs text-center hover:bg-slate-200 transition-colors"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => handleRevealContact(pro.id)}
                        disabled={revealingId === pro.id}
                        className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl bg-emerald-500 text-white font-bold text-xs text-center hover:bg-emerald-600 shadow-sm hover:shadow-emerald-200 transition-all disabled:opacity-70 disabled:hover:shadow-sm"
                      >
                        {revealingId === pro.id ? (
                          <><i className="lnr lnr-sync animate-spin"></i> Loading</>
                        ) : (
                          <><i className="lnr lnr-phone"></i> Get Contact</>
                        )}
                      </button>
                      <button
                        onClick={() => handleSave(pro)}
                        className="w-10 shrink-0 py-2.5 rounded-xl border border-slate-200 text-rose-500 flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-colors"
                        title="Save Professional"
                      >
                        <i className="lnr lnr-heart font-bold"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && !loading && (
          <div className="py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
              <i className="lnr lnr-magnifier text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to find a pro?</h3>
            <p className="text-slate-500 mb-6">Enter a service type and city above to find highly rated professionals near you.</p>
            <Link to="/nearby-professionals" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 bg-white px-5 py-2.5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all">
              Browse Directory <i className="lnr lnr-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </SeekerLayout>
  );
}
