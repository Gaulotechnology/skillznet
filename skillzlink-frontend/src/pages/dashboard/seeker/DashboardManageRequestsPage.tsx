import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { publicApi } from "../../../services/api";
import { DataTable, type Column } from "../../../components/shared/DataTable";

interface ContactedPro {
  id: number;
  name: string;
  service_category: string;
  contact_revealed_at: string;
  contact_number?: string;
  rating?: number;
}

export function DashboardManageRequestsPage() {
  const [contacted, setContacted] = useState<ContactedPro[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [tab, setTab] = useState<"contacted" | "saved">("contacted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const contactedRaw: ContactedPro[] = JSON.parse(
      localStorage.getItem("contacted_professionals") || "[]"
    );
    const savedRaw: any[] = JSON.parse(
      localStorage.getItem("saved_professionals") || "[]"
    );

    if (savedRaw.length > 0) {
      Promise.all(
        savedRaw.map((p: any) =>
          publicApi.getProvider(p.id).then((r) => r.provider).catch(() => p)
        )
      ).then((results) => {
        setSaved(results);
        setContacted(contactedRaw);
        setLoading(false);
      });
    } else {
      setContacted(contactedRaw);
      setLoading(false);
    }
  }, []);

  const removeContacted = (id: number) => {
    const updated = contacted.filter((p) => p.id !== id);
    setContacted(updated);
    localStorage.setItem("contacted_professionals", JSON.stringify(updated));
  };

  const removeSaved = (id: number) => {
    const updated = saved.filter((p: any) => p.id !== id);
    setSaved(updated);
    localStorage.setItem("saved_professionals", JSON.stringify(updated));
  };

  const contactedColumns: Column<ContactedPro>[] = [
    {
      key: "name",
      label: "Professional",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
            {(p.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <Link to={`/professional-profile/${p.id}`} className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              {p.name}
            </Link>
            <div className="text-xs text-gray-400 mt-0.5">{p.service_category}</div>
          </div>
        </div>
      ),
      exportValue: (p) => p.name,
    },
    {
      key: "contact_number",
      label: "Contact Details",
      render: (p) => (
        <div>
          <div className="text-sm text-gray-900 font-mono">{p.contact_number || "Hidden"}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Revealed {new Date(p.contact_revealed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      ),
      exportValue: (p) => p.contact_number || "Hidden",
    },
  ];

  return (
    <SeekerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Manage Requests</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage your posted service requests.</p>
          </div>
          <Link
            to="/dashboard/seeker/post-request"
            className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <i className="lnr lnr-plus-circle"></i> Post New Request
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 border border-gray-200 rounded-lg w-fit">
          <button onClick={() => setTab("contacted")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${tab === 'contacted' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <i className="lnr lnr-phone-handset"></i> Contacted ({contacted.length})
          </button>
          <button onClick={() => setTab("saved")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${tab === 'saved' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <i className="lnr lnr-heart"></i> Saved ({saved.length})
          </button>
        </div>

        {tab === "contacted" ? (
          <DataTable
            columns={contactedColumns}
            data={contacted}
            loading={loading}
            emptyIcon="lnr lnr-phone-handset"
            emptyMessage="You haven't revealed the contact details of any professionals yet."
            exportFileName="contacted-professionals"
            actions={(p) => (
              <button onClick={() => removeContacted(p.id)} className="w-8 h-8 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Remove from history">
                <i className="lnr lnr-trash text-sm"></i>
              </button>
            )}
          />
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              </div>
            ) : saved.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center px-4">
                <i className="lnr lnr-heart text-4xl text-gray-300 block mb-3"></i>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">No saved professionals</h4>
                <p className="text-sm text-gray-400 mb-6 max-w-sm">You haven't saved any professionals to your favorites list yet.</p>
                <Link to="/nearby-professionals" className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">
                  Browse Directory
                </Link>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {saved.map((pro: any) => (
                    <div key={pro.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-all flex flex-col group">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                          {(pro.name || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{pro.name}</h4>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                            {pro.service_category}
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            {pro.location || "Zimbabwe"}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {pro.premium_badge && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">Premium</span>}
                            {pro.id_verified && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">Verified</span>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
                        <Link to={`/professional-profile/${pro.id}`} className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm text-center hover:bg-gray-200 transition-colors">
                          View Profile
                        </Link>
                        <button onClick={() => removeSaved(pro.id)} className="w-8 h-8 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Remove from saved">
                          <i className="lnr lnr-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SeekerLayout>
  );
}
