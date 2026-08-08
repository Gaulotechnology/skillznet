import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { isLoggedIn, getCurrentUser, logout } from "../../services/api"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<{name: string, role: string} | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      setLoggedIn(isLoggedIn())
      setUser(getCurrentUser())
    }
    
    checkAuth()
    
    window.addEventListener("auth_change", checkAuth)
    return () => window.removeEventListener("auth_change", checkAuth)
  }, [])

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
    setLoggedIn(false)
    setUser(null)
    navigate("/")
  }

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
      case 'super_admin':
      case 'employee':
        return '/dashboard/admin';
      case 'provider':
        return '/dashboard/provider';
      case 'seeker':
        return '/dashboard/seeker';
      case 'affiliate':
        return '/dashboard/affiliate';
      case 'agent':
        return '/dashboard/agent';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-color)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xs">SL</span>
          </div>
          <span className="font-extrabold text-xl text-[var(--text-primary)] tracking-tight">SkillzLink</span>
        </Link>

        {/* Desktop Navigation */}
        {!location.pathname.startsWith('/dashboard') && (
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/nearby-professionals", label: "Find Professionals" },
              { to: "/how-it-works", label: "How It Works" },
              { to: "/about", label: "About" },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-[var(--accent-light)] text-[var(--accent-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth / User Area */}
        <div className="hidden lg:flex items-center gap-3">
          {loggedIn && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[var(--accent-light)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0">
                  <span className="text-[var(--accent-color)] font-bold text-xs">{user.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)] leading-tight">{user.name}</p>
                  <span className="text-[11px] font-medium text-[var(--accent-color)] uppercase tracking-wide">{user.role}</span>
                </div>
              </div>
              <div className="h-7 w-px bg-[var(--border-color)]" />
              <Link to={getDashboardLink()} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <i className="lnr lnr-laptop-phone text-xs" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--accent-light)] transition-colors">
                <i className="lnr lnr-exit text-xs" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-[var(--text-secondary)] font-medium text-sm hover:text-[var(--text-primary)] px-4 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-[var(--accent-color)] text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`lnr ${isMenuOpen ? 'lnr-cross' : 'lnr-menu'} text-xl`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-lg py-4 px-6 flex flex-col gap-3">
          {!location.pathname.startsWith('/dashboard') && (
            <nav className="flex flex-col gap-1 mb-3 border-b border-[var(--border-color)] pb-3">
              {[
                { to: "/", label: "Home" },
                { to: "/nearby-professionals", label: "Find Professionals" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/about", label: "About" },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[var(--text-primary)] font-medium py-2.5 px-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {loggedIn && user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] border border-[var(--border-color)] flex items-center justify-center">
                  <span className="text-[var(--accent-color)] font-bold text-sm">{user.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                  <span className="text-xs font-medium text-[var(--accent-color)]">{user.role}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="bg-[var(--bg-secondary)] text-center py-2.5 rounded-lg font-medium text-[var(--text-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-sm">
                  Dashboard
                </Link>
                <button onClick={(e) => { handleLogout(e); setIsMenuOpen(false); }} className="bg-[var(--accent-light)] text-center py-2.5 rounded-lg font-medium text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white border border-[var(--accent-color)]/20 text-sm transition-colors">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] text-sm">
                Log in
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-semibold hover:bg-[var(--accent-hover)] text-sm transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
