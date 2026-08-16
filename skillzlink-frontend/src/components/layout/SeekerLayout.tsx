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
    <div className="bg-[var(--bg-secondary)] min-h-[calc(100vh-72px)] pt-8 pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Banner Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-color)] text-white flex items-center justify-center text-2xl font-black shadow-md shadow-[var(--accent-color)]/20 shrink-0">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{user?.name || "User"}</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[var(--accent-color)] bg-[var(--accent-light)]">
              Customer Account
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Non-overflowing responsive grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-2 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] shadow-sm">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                  isActive
                    ? "bg-[var(--accent-color)] text-white shadow-sm shadow-[var(--accent-color)]/25"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <i className={`lnr ${tab.icon} text-sm shrink-0`}></i>
                <span className="truncate">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      
    </div>
  );
}
