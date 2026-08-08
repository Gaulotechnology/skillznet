import { Link } from "react-router-dom";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { getCurrentUser } from "../../../services/api";

export function SeekerMessagesPage() {
  const user = getCurrentUser();

  const roleColors = {
    admin: 'bg-[var(--accent-light)] text-[var(--accent-color)] border-[var(--border-color)]',
    provider: 'bg-[var(--accent-light)] text-[var(--accent-color)] border-[var(--border-color)]',
    customer: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    default: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
  };
  
  const userRole = user?.role as keyof typeof roleColors || 'default';
  const roleColorClass = roleColors[userRole] || roleColors.default;

  return (
    <SeekerLayout>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh] font-['Inter',sans-serif]">
        
        {/* Main Informational Card */}
        <div className="bg-[var(--bg-primary)] rounded-3xl shadow-sm border border-[var(--border-color)] w-full overflow-hidden relative">
          
          {/* Top Graphic Section */}
          <div className="h-48 bg-[var(--accent-light)] relative overflow-hidden flex items-center justify-center">
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center">
              <i className="lnr lnr-bubble text-5xl text-[var(--accent-color)]"></i>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center pt-10">
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-4">Direct Communication</h2>
            <p className="text-[var(--text-secondary)] font-medium text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              SkillzLink connects you directly with professionals via phone call or WhatsApp.
              Reveal a professional's contact number on their profile to start a conversation off-platform.
            </p>

            {/* Current User Card */}
            <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-color)] max-w-lg mx-auto mb-10 text-left flex items-start gap-5">
              <div className="w-14 h-14 rounded-3xl bg-[var(--accent-light)] flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                <span className="text-[var(--accent-color)] font-black text-2xl">
                  {(user?.name || "U")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-[var(--text-primary)] text-lg">{user?.name || "User"}</h4>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleColorClass}`}>
                    {user?.role || "member"}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                  Your account's contact information is used when professionals reach out to you. 
                  Keep your phone number updated to ensure you receive calls.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link 
                to="/nearby-professionals" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--accent-color)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="lnr lnr-magnifier font-bold text-lg"></i>
                Find Professionals
              </Link>
              
              <Link 
                to="/dashboard/seeker/saved" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 border border-[var(--border-color)]"
              >
                <i className="lnr lnr-heart font-bold text-lg"></i>
                Saved Professionals
              </Link>
            </div>

            {/* Tip */}
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-3xl bg-amber-50 border border-amber-100 max-w-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                <i className="lnr lnr-star text-xl"></i>
              </div>
              <p className="text-amber-700 font-medium text-sm">
                <strong>Tip:</strong> Premium professionals have their contact details readily available. 
                Verified providers with the ✓ badge are identity-checked for your safety.
              </p>
            </div>

          </div>
        </div>
      </div>
    </SeekerLayout>
  );
}
