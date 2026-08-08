import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi } from "../../../services/api";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Availability {
  day_of_week: string;
  is_available: boolean;
  start_time: string;
  end_time: string;
}

export function DashboardAvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>(
    DAYS_OF_WEEK.map(day => ({
      day_of_week: day,
      is_available: day !== "Sunday",
      start_time: "08:00",
      end_time: "17:00"
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    providerApi.getAvailability()
      .then(res => {
        if (res.availabilities && res.availabilities.length > 0) {
          // Merge with default days to ensure all 7 days are present
          const merged = DAYS_OF_WEEK.map(day => {
            const existing = res.availabilities.find(a => a.day_of_week === day);
            return existing ? {
              day_of_week: existing.day_of_week,
              is_available: !!existing.is_available,
              start_time: existing.start_time.substring(0, 5),
              end_time: existing.end_time.substring(0, 5)
            } : {
              day_of_week: day,
              is_available: false,
              start_time: "08:00",
              end_time: "17:00"
            };
          });
          setAvailabilities(merged);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: keyof Availability, value: any) => {
    const newAvails = [...availabilities];
    newAvails[index] = { ...newAvails[index], [field]: value };
    setAvailabilities(newAvails);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await providerApi.setAvailability({ availabilities });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      alert("Error saving availability: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 relative">
        
        {/* Success Toast */}
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <i className="lnr lnr-checkmark-circle"></i>
          </div>
          Availability updated successfully
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">My Availability</h2>
            <p className="text-slate-500 mt-1">Set your working hours for bookings.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <i className="lnr lnr-sync animate-spin"></i>
            ) : (
              <i className="lnr lnr-checkmark-circle"></i>
            )}
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-lg font-bold text-slate-800">Weekly Schedule</h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading schedule...</p>
              </div>
            ) : (
              availabilities.map((avail, i) => (
                <div key={avail.day_of_week} className={`p-6 flex flex-col md:flex-row md:items-center gap-6 transition-colors ${avail.is_available ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50'}`}>
                  
                  <div className="w-48 flex items-center gap-4">
                    <label className="relative flex items-center justify-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={avail.is_available}
                        onChange={e => handleChange(i, 'is_available', e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg bg-white checked:bg-indigo-500 checked:border-indigo-500 transition-all outline-none focus:ring-4 focus:ring-indigo-100"
                      />
                      <i className="lnr lnr-checkmark text-white text-sm absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></i>
                    </label>
                    <span className={`font-bold ${avail.is_available ? 'text-slate-800' : 'text-slate-400'}`}>
                      {avail.day_of_week}
                    </span>
                  </div>

                  <div className={`flex-1 flex items-center gap-4 transition-opacity duration-300 ${avail.is_available ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Start Time</label>
                      <input 
                        type="time" 
                        value={avail.start_time}
                        onChange={e => handleChange(i, 'start_time', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                      />
                    </div>
                    
                    <div className="mt-6 text-slate-300">
                      <i className="lnr lnr-arrow-right font-bold"></i>
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">End Time</label>
                      <input 
                        type="time" 
                        value={avail.end_time}
                        onChange={e => handleChange(i, 'end_time', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                      />
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
