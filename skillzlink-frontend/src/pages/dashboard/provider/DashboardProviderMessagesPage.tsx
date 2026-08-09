import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser } from "../../../services/api";

export function DashboardProviderMessagesPage() {
  const user = getCurrentUser();

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] font-['Inter',sans-serif]">
        
        {/* Main Informational Card */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] w-full overflow-hidden relative">
          
          {/* Top Graphic Section */}
          <div className="h-48 bg-[var(--accent-light)] relative overflow-hidden flex items-center justify-center">
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center">
              <i className="lnr lnr-bubble text-5xl text-[var(--accent-color)]"></i>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center pt-10">
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-4">Client Communication</h2>
            <p className="text-[var(--text-secondary)] font-medium text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Clients reach you directly via phone or WhatsApp. Keep your contact details up to date so you never miss an opportunity.
            </p>

            {/* Current User Card */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-color)] max-w-lg mx-auto mb-10 text-left flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                <span className="text-emerald-600 font-black text-2xl">
                  {(user?.name || "P")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-[var(--text-primary)] text-lg">{user?.name || "Provider"}</h4>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-200">
                    Provider
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                  When seekers are interested in your services, they will contact you using the phone number on your profile.
                  Make sure your contact details are always current.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link 
                to="/dashboard/provider/bookings" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--accent-color)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="lnr lnr-calendar-full font-bold text-lg"></i>
                View Bookings
              </Link>
              
              <Link 
                to="/dashboard/profile" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="lnr lnr-phone-handset font-bold text-lg"></i>
                Update Contact Details
              </Link>
            </div>

            {/* Tip */}
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-50 border border-amber-100 max-w-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                <i className="lnr lnr-star text-xl"></i>
              </div>
              <p className="text-amber-700 font-medium text-sm">
                <strong>Tip:</strong> Premium subscription unlocks verified contact options and increased visibility.
                Upgrade your plan to get more leads.
              </p>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
