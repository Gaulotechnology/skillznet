import { useState } from "react"
import { Link } from "react-router-dom"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

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
                        <Link to="/service-categories" onClick={() => setIsMenuOpen(false)}>
                          Browse Services
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
                  <figure className="wt-userimg">
                    <img src="/images/user-login.png" alt="User" />
                  </figure>
                  <div className="wt-loginoption">
                    <a
                      href="#/"
                      id="wt-loginbtn"
                      className="wt-loginbtn"
                      onClick={(e) => { e.preventDefault(); setIsLoginOpen(!isLoginOpen) }}
                    >
                      Login
                    </a>
                    {isLoginOpen && (
                      <div className="wt-loginformhold" style={{ display: "block" }}>
                        <div className="wt-loginheader">
                          <span>Login</span>
                          <a href="#/" onClick={(e) => { e.preventDefault(); setIsLoginOpen(false) }}>
                            <i className="fa fa-times" />
                          </a>
                        </div>
                        <form className="wt-formtheme wt-loginform">
                          <fieldset>
                            <div className="form-group">
                              <input type="text" name="username" className="form-control" placeholder="Username" />
                            </div>
                            <div className="form-group">
                              <input type="password" name="password" className="form-control" placeholder="Password" />
                            </div>
                            <div className="wt-logininfo">
                              <Link to="/login" className="wt-btn" onClick={() => { setIsLoginOpen(false); setIsMenuOpen(false) }}>
                                Login
                              </Link>
                              <span className="wt-checkbox">
                                <input id="wt-login" type="checkbox" name="rememberme" />
                                <label htmlFor="wt-login">Keep me logged in</label>
                              </span>
                            </div>
                          </fieldset>
                          <div className="wt-loginfooterinfo">
                            <Link to="/login" onClick={() => { setIsLoginOpen(false); setIsMenuOpen(false) }}>
                              Forgot password?
                            </Link>
                            <Link to="/register" onClick={() => { setIsLoginOpen(false); setIsMenuOpen(false) }}>
                              Create account
                            </Link>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                  <Link to="/register" className="wt-btn" onClick={() => setIsMenuOpen(false)}>
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
