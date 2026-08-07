import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isLoggedIn, getCurrentUser, logout } from "../../services/api"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [_isLoginOpen, _setIsLoginOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<{name: string, role: string} | null>(null)
  const navigate = useNavigate()

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

  return (
    <header id="wt-header" className="wt-header wt-haslayout">
      <div className="wt-navigationarea">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <strong className="wt-logo">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <img src="/images/logo.png" alt="SkillzLink logo" />
                </Link>
              </strong>
              <div className="wt-rightarea">
                <nav id="wt-nav" className="wt-nav navbar-expand-lg">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    aria-controls="navbarNav"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                  >
                    <i className="lnr lnr-menu" />
                  </button>
                  <div className={`wt-navigation ${isMenuOpen ? "is-open" : ""}`} id="navbarNav">
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>
                          Home
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link to="/nearby-professionals" onClick={() => setIsMenuOpen(false)}>
                          Find Professionals
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)}>
                          How It Works
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                          About
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>

                <div className="wt-loginarea">
                  {loggedIn && user ? (
                    <div className="wt-userlogedin">
                      <figure className="wt-userimg">
                        <img src="/images/user-avatar.png" alt="User Avatar" style={{width: '40px', borderRadius: '50%'}} />
                      </figure>
                      <div className="wt-username">
                        <h3>{user.name}</h3>
                        <span>{user.role}</span>
                      </div>
                      <nav className="wt-usernav">
                        <ul>
                          <li>
                            <Link to="/dashboard-profile">
                              <i className="ti-dashboard"></i>
                              <span>Dashboard</span>
                            </Link>
                          </li>
                          <li>
                            <a href="#/" onClick={handleLogout}>
                              <i className="ti-shift-right"></i>
                              <span>Logout</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  ) : (
                    <>
                      <figure className="wt-userimg">
                        <img src="/images/user-login.png" alt="User" />
                      </figure>
                      <div className="wt-loginoption">
                        <Link to="/login" className="wt-loginbtn" onClick={() => setIsMenuOpen(false)}>
                          Login
                        </Link>
                      </div>
                      <Link to="/register" className="wt-btn" onClick={() => setIsMenuOpen(false)}>
                        Join Now
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

