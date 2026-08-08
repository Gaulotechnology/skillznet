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
      <div className="max-w-6xl mx-auto relative space-y-8 font-['Inter',sans-serif]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Saved Professionals</h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Keep track of your favorite service providers.</p>
          </div>
          <Link 
            to="/nearby-professionals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-white transition-colors"
          >
            <i className="lnr lnr-plus-circle"></i> Find More
          </Link>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">Loading saved professionals...</p>
            </div>
          ) : saved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] text-5xl mb-6">
                <i className="lnr lnr-heart"></i>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No saved professionals yet</h3>
              <p className="text-[var(--text-secondary)] font-medium mb-8 max-w-md">
                Browse professionals and click the heart icon to save them here for quick access later.
              </p>
              <Link 
                to="/nearby-professionals" 
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-95"
              >
                Browse Professionals
              </Link>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {saved.map((pro) => (
                  <div key={pro.id} className="group rounded-3xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent-color)]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 p-6 relative overflow-hidden flex flex-col h-full">
                    
                    <div className="flex gap-5 mb-5">
                      <div className="w-16 h-16 rounded-3xl bg-[var(--bg-secondary)] overflow-hidden shrink-0 border border-[var(--border-color)]">
                        {pro.image ? (
                          <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] text-2xl bg-[var(--bg-secondary)]">
                            <i className="lnr lnr-user"></i>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{pro.name}</h4>
                            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{pro.service_category}</p>
                            {pro.rating > 0 && (
                              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                                <i className="fa fa-star"></i>
                                <span>{pro.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => removeSaved(pro.id)}
                            className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center shrink-0"
                            title="Remove from saved"
                          >
                            <i className="lnr lnr-trash font-bold"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pro.premium_badge && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-wider">
                          <i className="fa fa-crown"></i> Premium
                        </span>
                      )}
                      {pro.id_verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                          <i className="fa fa-check-circle"></i> Verified
                        </span>
                      )}
                    </div>

                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                      {pro.description || "No description provided."}
                    </p>
                    
                    <div className="flex gap-3 mt-auto pt-5 border-t border-[var(--border-color)]">
                      <Link 
                        to={`/professional-profile/${pro.id}`} 
                        className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-sm text-center hover:bg-[var(--accent-light)] hover:text-[var(--accent-color)] transition-colors"
                      >
                        View Profile
                      </Link>
                      <button
                        className="flex-1 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-bold text-sm hover:bg-[var(--accent-hover)] transition-colors active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
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
