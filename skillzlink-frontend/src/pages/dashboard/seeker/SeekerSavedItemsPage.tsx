import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { seekerApi, publicApi } from "../../../services/api";

export function SeekerSavedItemsPage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState<number | null>(null);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("saved_professionals") || "[]");
    if (raw.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(raw.map((p: any) =>
      publicApi.getProvider(p.id).then(r => r.provider).catch(() => p)
    )).then(results => {
      setSaved(results);
    }).finally(() => setLoading(false));
  }, []);

  const removeSaved = (id: number) => {
    const raw = JSON.parse(localStorage.getItem("saved_professionals") || "[]");
    const updated = raw.filter((p: any) => p.id !== id);
    localStorage.setItem("saved_professionals", JSON.stringify(updated));
    setSaved(prev => prev.filter(p => p.id !== id));
  };

  const handleRevealContact = async (id: number) => {
    setRevealing(id);
    try {
      const res = await seekerApi.revealContact(id);
      if (res.contact_available && res.contact_number) {
        alert(`Contact Number: ${res.contact_number}`);
      } else {
        alert("This professional has not enabled contact sharing.");
      }
    } catch {
      alert("You must be logged in as a seeker to reveal contact info.");
    } finally {
      setRevealing(null);
    }
  };

  return (
    <SeekerLayout>
      <div className="max-w-6xl mx-auto relative space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Saved Professionals</h2>
            <p className="text-slate-500 mt-1 font-medium">Keep track of your favorite service providers.</p>
          </div>
          <Link 
            to="/nearby-professionals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-colors"
          >
            <i className="lnr lnr-plus-circle"></i> Find More
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading saved professionals...</p>
            </div>
          ) : saved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 text-5xl mb-6">
                <i className="lnr lnr-heart"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No saved professionals yet</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-md">
                Browse professionals and click the heart icon to save them here for quick access later.
              </p>
              <Link 
                to="/nearby-professionals" 
                className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                Browse Professionals
              </Link>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {saved.map((pro) => (
                  <div key={pro.id} className="group rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all p-6 relative overflow-hidden flex flex-col h-full">
                    
                    <div className="flex gap-5 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {pro.image ? (
                          <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl bg-slate-50">
                            <i className="lnr lnr-user"></i>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{pro.name}</h4>
                            <p className="text-sm font-medium text-slate-500 mb-1">{pro.service_category}</p>
                            {pro.rating > 0 && (
                              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                                <i className="fa fa-star"></i>
                                <span>{pro.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => removeSaved(pro.id)}
                            className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors flex items-center justify-center shrink-0"
                            title="Remove from saved"
                          >
                            <i className="lnr lnr-trash font-bold"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pro.premium_badge && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
                          <i className="fa fa-crown"></i> Premium
                        </span>
                      )}
                      {pro.id_verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                          <i className="fa fa-check-circle"></i> Verified
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                      {pro.description || "No description provided."}
                    </p>
                    
                    <div className="flex gap-3 mt-auto pt-5 border-t border-slate-100">
                      <Link 
                        to={`/professional-profile/${pro.id}`} 
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm text-center hover:bg-slate-50 hover:text-slate-800 transition-colors"
                      >
                        View Profile
                      </Link>
                      <button
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                        onClick={() => handleRevealContact(pro.id)}
                        disabled={revealing === pro.id}
                      >
                        {revealing === pro.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <i className="lnr lnr-phone-handset"></i> Contact
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SeekerLayout>
  );
}
