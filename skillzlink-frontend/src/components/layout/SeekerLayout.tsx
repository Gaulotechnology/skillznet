import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

interface SeekerLayoutProps {
  children: ReactNode;
}

export function SeekerLayout({ children }: SeekerLayoutProps) {
  const location = useLocation();
  const user = getCurrentUser();

  const tabs = [
    { to: "/dashboard/seeker/overview", label: "Overview", icon: "lnr-home" },
    { to: "/dashboard/seeker/bookings", label: "My Bookings", icon: "lnr-calendar-full" },
    { to: "/dashboard/seeker/manage-requests", label: "Service Requests", icon: "lnr-pushpin" },
    { to: "/dashboard/seeker/saved", label: "Saved Pros", icon: "lnr-heart" },
    { to: "/dashboard/seeker/messages", label: "Messages", icon: "lnr-bubble" },
    { to: "/dashboard/seeker/reviews", label: "Reviews", icon: "lnr-star" },
    { to: "/dashboard/seeker/billing", label: "Billing", icon: "lnr-diamond" },
    { to: "/dashboard/seeker/settings", label: "Settings", icon: "lnr-cog" },
  ];

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] pt-12 pb-24 font-sans text-slate-800">
      
      {/* Top Banner Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg border-4 border-white">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900">{user?.name || "User"}</h1>
            <span className="inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100">
              Customer Account
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto custom-scrollbar">
          <nav className="flex min-w-max p-2 gap-2">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <i className={`lnr ${tab.icon} ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}></i>
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      
    </div>
  );
}
