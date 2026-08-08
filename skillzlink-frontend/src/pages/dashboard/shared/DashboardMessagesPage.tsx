import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { getCurrentUser } from "../../../services/api";

export function DashboardMessagesPage() {
  const user = getCurrentUser();

  const roleColors = {
    admin: 'bg-purple-50 text-purple-600 border-purple-100',
    provider: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    customer: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    default: 'bg-slate-50 text-slate-600 border-slate-100'
  };
  
  const userRole = user?.role as keyof typeof roleColors || 'default';
  const roleColorClass = roleColors[userRole] || roleColors.default;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        
        {/* Main Informational Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.05)] w-full overflow-hidden relative">
          
          {/* Top Graphic Section */}
          <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden flex items-center justify-center">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 mix-blend-overlay blur-3xl translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 mix-blend-overlay blur-2xl -translate-x-1/2 translate-y-1/2 rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl animate-float">
              <i className="lnr lnr-bubble text-5xl text-white"></i>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center pt-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Direct Communication</h2>
            <p className="text-slate-500 font-medium text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              SkillzLink connects you directly with professionals via phone call or WhatsApp.
              Reveal a professional's contact number on their profile to start a conversation off-platform.
            </p>

            {/* Current User Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 max-w-lg mx-auto mb-10 text-left flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                <span className="text-slate-600 font-black text-2xl">
                  {(user?.name || "U")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-800 text-lg">{user?.name || "User"}</h4>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleColorClass}`}>
                    {user?.role || "member"}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Your account's contact information is used when professionals reach out to you. 
                  Keep your phone number updated to ensure you receive calls.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link 
                to="/nearby-professionals" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="lnr lnr-magnifier font-bold text-lg"></i>
                Find Professionals
              </Link>
              
              <Link 
                to="/dashboard/saved" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="lnr lnr-heart font-bold text-lg"></i>
                Saved Professionals
              </Link>

              {user?.role === "provider" && (
                <Link 
                  to="/dashboard/profile" 
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="lnr lnr-phone-handset font-bold text-lg"></i>
                  Enable Contact Opt-in
                </Link>
              )}
            </div>

            {/* Tip */}
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-50 border border-amber-100 max-w-xl text-left">
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
    </DashboardLayout>
  );
}
