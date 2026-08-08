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
    <div className="bg-[var(--bg-secondary)] min-h-[calc(100vh-72px)] pt-10 pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Banner Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent-color)] text-2xl font-bold border-2 border-[var(--border-color)]">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user?.name || "User"}</h1>
            <span className="inline-block mt-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[var(--accent-color)] bg-[var(--accent-light)]">
              Customer Account
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-x-auto">
          <nav className="flex min-w-max p-1.5 gap-1">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--accent-color)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <i className={`lnr ${tab.icon} text-xs`}></i>
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
