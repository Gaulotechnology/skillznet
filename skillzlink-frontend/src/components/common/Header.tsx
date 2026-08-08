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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">SL</span>
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">SkillzLink</span>
        </Link>

        {/* Desktop Navigation */}
        {!location.pathname.startsWith('/dashboard') && (
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-slate-600 font-semibold hover:text-rose-500 transition-colors">
              Home
            </Link>
            <Link to="/nearby-professionals" className="text-slate-600 font-semibold hover:text-rose-500 transition-colors">
              Find Professionals
            </Link>
            <Link to="/how-it-works" className="text-slate-600 font-semibold hover:text-rose-500 transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="text-slate-600 font-semibold hover:text-rose-500 transition-colors">
              About
            </Link>
          </nav>
        )}

        {/* Auth / User Area */}
        <div className="hidden lg:flex items-center gap-4">
          {loggedIn && user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  <i className="lnr lnr-user text-slate-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{user.name}</h3>
                  <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">{user.role}</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <Link to={getDashboardLink()} className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2">
                <i className="lnr lnr-laptop-phone" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-slate-500 hover:text-rose-500 flex items-center gap-2 font-semibold">
                <i className="lnr lnr-exit" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 font-bold hover:text-slate-900 px-4 py-2 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-rose-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 hover:-translate-y-0.5 transition-all">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`lnr ${isMenuOpen ? 'lnr-cross' : 'lnr-menu'} text-2xl`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-4 px-6 flex flex-col gap-4">
          {!location.pathname.startsWith('/dashboard') && (
            <nav className="flex flex-col gap-4 mb-4 border-b border-slate-100 pb-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-rose-500">
                Home
              </Link>
              <Link to="/nearby-professionals" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-rose-500">
                Find Professionals
              </Link>
              <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-rose-500">
                How It Works
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-rose-500">
                About
              </Link>
            </nav>
          )}

          {loggedIn && user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <i className="lnr lnr-user text-slate-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{user.name}</h3>
                  <span className="text-sm font-semibold text-rose-500">{user.role}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="bg-slate-50 text-center py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100 border border-slate-200">
                  Dashboard
                </Link>
                <button onClick={(e) => { handleLogout(e); setIsMenuOpen(false); }} className="bg-rose-50 text-center py-3 rounded-xl font-bold text-rose-600 hover:bg-rose-100 border border-rose-100">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-200">
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
