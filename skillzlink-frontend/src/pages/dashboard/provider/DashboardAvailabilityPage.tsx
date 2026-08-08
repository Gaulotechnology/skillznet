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
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 relative font-['Inter',sans-serif]">
        
        {/* Success Toast */}
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--accent-color)] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <i className="lnr lnr-checkmark-circle"></i>
          </div>
          Availability updated successfully
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">My Availability</h2>
            <p className="text-[var(--text-secondary)] mt-1">Set your working hours for bookings.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="py-3 px-6 rounded-xl bg-[var(--accent-color)] text-white font-bold hover:bg-[var(--accent-hover)] shadow-lg transition-all active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <i className="lnr lnr-sync animate-spin"></i>
            ) : (
              <i className="lnr lnr-checkmark-circle"></i>
            )}
            Save Changes
          </button>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-3xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Weekly Schedule</h3>
          </div>
          
          <div className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin mb-4" />
                <p className="text-[var(--text-secondary)] font-medium">Loading schedule...</p>
              </div>
            ) : (
              availabilities.map((avail, i) => (
                <div key={avail.day_of_week} className={`p-6 flex flex-col md:flex-row md:items-center gap-6 transition-colors ${avail.is_available ? 'bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]' : 'bg-[var(--bg-secondary)]'}`}>
                  
                  <div className="w-48 flex items-center gap-4">
                    <label className="relative flex items-center justify-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={avail.is_available}
                        onChange={e => handleChange(i, 'is_available', e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] checked:bg-[var(--accent-color)] checked:border-[var(--accent-color)] transition-all outline-none focus:ring-4 focus:ring-[var(--accent-light)]"
                      />
                      <i className="lnr lnr-checkmark text-white text-sm absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></i>
                    </label>
                    <span className={`font-bold ${avail.is_available ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {avail.day_of_week}
                    </span>
                  </div>

                  <div className={`flex-1 flex items-center gap-4 transition-opacity duration-300 ${avail.is_available ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Start Time</label>
                      <input 
                        type="time" 
                        value={avail.start_time}
                        onChange={e => handleChange(i, 'start_time', e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] focus:ring-4 focus:ring-[var(--accent-light)] transition-all font-medium"
                      />
                    </div>
                    
                    <div className="mt-6 text-[var(--text-secondary)]">
                      <i className="lnr lnr-arrow-right font-bold"></i>
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">End Time</label>
                      <input 
                        type="time" 
                        value={avail.end_time}
                        onChange={e => handleChange(i, 'end_time', e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-color)] focus:ring-4 focus:ring-[var(--accent-light)] transition-all font-medium"
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
