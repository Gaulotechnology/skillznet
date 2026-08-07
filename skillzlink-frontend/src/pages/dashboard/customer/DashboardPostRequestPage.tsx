import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
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
  const [error, setError] = useState<string | null>(null);
  const [revealingId, setRevealingId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
      setError(err.message || "Search failed. Please try again.");
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
      alert(`${pro.name || pro.provider_name} saved to your list!`);
    } else {
      alert("Already saved!");
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
        alert(`Contact Number: ${res.contact_number}`);
      } else {
        alert("This professional has not enabled contact sharing.");
      }
    } catch {
      alert("Please log in as a seeker to reveal contact details.");
    } finally {
      setRevealingId(null);
    }
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        {/* Search Form */}
        <div className="wt-dashboardbox" style={{ marginBottom: "24px" }}>
          <div className="wt-dashboardboxtitle">
            <h2>Find a Professional</h2>
            <span style={{ fontSize: "13px", color: "#888" }}>
              Search by service type and location to find the right professional near you
            </span>
          </div>
          <div className="wt-dashboardboxcontent" style={{ padding: "24px" }}>
            <form className="wt-formtheme" onSubmit={handleSearch}>
              <fieldset>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ flex: "2 1 200px" }}>
                    <label style={{ fontWeight: 600, fontSize: "13px", marginBottom: "6px", display: "block" }}>
                      Service Type *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Plumber, Electrician, Cleaner..."
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                      style={{ height: "44px" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 150px" }}>
                    <label style={{ fontWeight: 600, fontSize: "13px", marginBottom: "6px", display: "block" }}>
                      City
                    </label>
                    <span className="wt-select">
                      <select value={city} onChange={(e) => setCity(e.target.value)}>
                        {Object.keys(zimbabweCities).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </span>
                  </div>
                  <div style={{ flex: "1 1 130px" }}>
                    <label style={{ fontWeight: 600, fontSize: "13px", marginBottom: "6px", display: "block" }}>
                      Radius (km)
                    </label>
                    <span className="wt-select">
                      <select value={radius} onChange={(e) => setRadius(e.target.value)}>
                        {["5", "10", "25", "50", "100"].map((r) => (
                          <option key={r} value={r}>{r} km</option>
                        ))}
                      </select>
                    </span>
                  </div>
                  <div style={{ flex: "0 0 auto", display: "flex", alignItems: "flex-end" }}>
                    <button
                      type="submit"
                      className="wt-btn"
                      disabled={loading}
                      style={{ height: "44px", padding: "0 28px", whiteSpace: "nowrap" }}
                    >
                      {loading ? (
                        <><i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>Searching...</>
                      ) : (
                        <><i className="lnr lnr-magnifier" style={{ marginRight: "8px" }}></i>Search</>
                      )}
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", color: "#f5222d" }}>
            <i className="lnr lnr-cross-circle" style={{ marginRight: "8px" }}></i>{error}
          </div>
        )}

        {/* Results */}
        {searched && (
          <div className="wt-dashboardbox">
            <div className="wt-dashboardboxtitle wt-titlewithsearch">
              <h2>
                {results.length > 0
                  ? `${results.length} Professional${results.length !== 1 ? "s" : ""} Found`
                  : "No Professionals Found"}
              </h2>
              <Link to="/nearby-professionals" style={{ fontSize: "13px", color: "#ff5851" }}>
                Browse All →
              </Link>
            </div>
            <div className="wt-dashboardboxcontent">
              {results.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                  <i className="lnr lnr-magnifier" style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}></i>
                  <p>No professionals found for <strong>{service}</strong> in <strong>{city}</strong>.</p>
                  <p style={{ fontSize: "13px" }}>Try a broader search radius or different service type.</p>
                </div>
              ) : (
                <div className="row" style={{ padding: "16px" }}>
                  {results.map((pro) => (
                    <div className="col-12 col-md-6" key={pro.id} style={{ marginBottom: "16px" }}>
                      <div style={{
                        border: "1px solid #f0f0f0", borderRadius: "10px", padding: "18px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)", height: "100%",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                          <div style={{
                            width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg, #ff5851, #ff8a4c)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ color: "#fff", fontWeight: 700, fontSize: "20px" }}>
                              {((pro.name || pro.provider_name) || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 2px", fontSize: "15px" }}>{pro.name || pro.provider_name}</h4>
                            <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>{pro.service_category}</p>
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                            {pro.premium_badge && (
                              <span style={{ background: "#faad14", color: "#fff", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>★ Premium</span>
                            )}
                            {pro.id_verified && (
                              <span style={{ background: "#52c41a", color: "#fff", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>✓ ID</span>
                            )}
                          </div>
                        </div>
                        {pro.rating !== undefined && pro.rating > 0 && (
                          <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#faad14" }}>
                            {"★".repeat(Math.round(pro.rating))} <span style={{ color: "#888" }}>({pro.rating.toFixed(1)})</span>
                            {pro.distance !== undefined && (
                              <span style={{ color: "#1890ff", marginLeft: "10px" }}>{pro.distance} km away</span>
                            )}
                          </p>
                        )}
                        {pro.description && (
                          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#555", lineHeight: 1.5 }}>
                            {pro.description.substring(0, 90)}{pro.description.length > 90 ? "..." : ""}
                          </p>
                        )}
                        {pro.contact_number_masked && (
                          <p style={{ margin: "0 0 12px", fontSize: "13px", fontFamily: "monospace", color: "#333" }}>
                            📞 {pro.contact_number_masked}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <Link to={`/professional-profile/${pro.id}`} className="wt-btn" style={{ padding: "6px 14px", fontSize: "12px" }}>
                            View Profile
                          </Link>
                          <button
                            className="wt-btn"
                            style={{ padding: "6px 14px", fontSize: "12px", background: "#52c41a" }}
                            onClick={() => handleRevealContact(pro.id)}
                            disabled={revealingId === pro.id}
                          >
                            {revealingId === pro.id ? "..." : "📞 Get Contact"}
                          </button>
                          <button
                            onClick={() => handleSave(pro)}
                            style={{ padding: "6px 12px", fontSize: "12px", background: "none", border: "1px solid #ff5851", color: "#ff5851", borderRadius: "4px", cursor: "pointer" }}
                          >
                            ♡ Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#bbb" }}>
            <i className="lnr lnr-magnifier" style={{ fontSize: "64px", display: "block", marginBottom: "16px" }}></i>
            <p style={{ fontSize: "16px" }}>Enter a service type and city above to find professionals near you</p>
            <Link to="/nearby-professionals" style={{ color: "#ff5851", fontSize: "14px" }}>
              Or browse all professionals →
            </Link>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
