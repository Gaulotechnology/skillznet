import { useState, useEffect } from "react"; // useEffect needed for API refresh
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { seekerApi, publicApi } from "../../../services/api";

export function DashboardSaveItemsPage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState<number | null>(null);

  useEffect(() => {
    // Load from localStorage (saved by the ProfessionalProfilePage)
    const raw = JSON.parse(localStorage.getItem("saved_professionals") || "[]");
    // Refresh each one from the API to get fresh data
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
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="wt-dashboardbox">
          <div className="wt-dashboardboxtitle wt-titlewithsearch">
            <h2>Saved Professionals</h2>
            <Link to="/nearby-professionals" className="wt-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
              + Find More
            </Link>
          </div>
          <div className="wt-dashboardboxcontent">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px', color: '#ff5851' }}></i>
              </div>
            ) : saved.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                <i className="lnr lnr-heart" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
                <h3 style={{ color: '#ccc' }}>No saved professionals yet</h3>
                <p>Browse professionals and click the heart icon to save them here.</p>
                <Link to="/nearby-professionals" className="wt-btn">Browse Professionals</Link>
              </div>
            ) : (
              <div className="row">
                {saved.map((pro) => (
                  <div className="col-12 col-md-6" key={pro.id} style={{ marginBottom: '20px' }}>
                    <div style={{
                      border: '1px solid #f0f0f0', borderRadius: '10px', padding: '20px',
                      display: 'flex', gap: '16px', alignItems: 'flex-start',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: '#f5f5f5', overflow: 'hidden', flexShrink: 0
                      }}>
                        {pro.image
                          ? <img src={pro.image} alt={pro.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="lnr lnr-user" style={{ fontSize: '28px', color: '#ccc' }}></i>
                            </div>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 2px', fontSize: '15px' }}>{pro.name}</h4>
                            <p style={{ margin: '0 0 4px', color: '#888', fontSize: '13px' }}>{pro.service_category}</p>
                            {pro.rating > 0 && (
                              <span style={{ fontSize: '12px', color: '#faad14' }}>
                                {'★'.repeat(Math.round(pro.rating))} ({pro.rating.toFixed(1)})
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {pro.premium_badge && (
                              <span style={{ background: '#faad14', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                Premium
                              </span>
                            )}
                            {pro.id_verified && (
                              <span style={{ background: '#52c41a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <p style={{ margin: '8px 0', fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
                          {pro.description?.substring(0, 100)}{pro.description?.length > 100 ? '...' : ''}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                          <Link to={`/professional-profile/${pro.id}`} className="wt-btn" style={{ padding: '6px 14px', fontSize: '12px' }}>
                            View Profile
                          </Link>
                          <button
                            className="wt-btn"
                            style={{ padding: '6px 14px', fontSize: '12px', background: '#52c41a' }}
                            onClick={() => handleRevealContact(pro.id)}
                            disabled={revealing === pro.id}
                          >
                            {revealing === pro.id ? '...' : '📞 Contact'}
                          </button>
                          <button
                            onClick={() => removeSaved(pro.id)}
                            style={{ padding: '6px 14px', fontSize: '12px', background: 'none', border: '1px solid #f5222d', color: '#f5222d', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
