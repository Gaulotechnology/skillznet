import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer id="wt-footer" className="wt-footer wt-haslayout">
      <div className="wt-footerholder wt-haslayout">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div className="wt-footerlogohold">
                <strong className="wt-logo">
                  <Link to="/">
                    <img src="/images/flogo.png" alt="SkillzLink footer logo" />
                  </Link>
                </strong>
                <div className="wt-description">
                  <p>
                    SkillzLink connects you with trusted, verified local professionals across
                    Zimbabwe. From plumbers to tutors, find the right expert near you — fast,
                    secure, and integrated with WhatsApp.{" "}
                    <Link to="/about">more...</Link>
                  </p>
                </div>
                <ul className="wt-socialiconssimple wt-socialiconfooter">
                  <li className="wt-facebook">
                    <a href="#/">
                      <i className="fa fa-facebook-f" />
                    </a>
                  </li>
                  <li className="wt-twitter">
                    <a href="#/">
                      <i className="fab fa-twitter" />
                    </a>
                  </li>
                  <li className="wt-youtube">
                    <a href="#/">
                      <i className="fab fa-youtube" />
                    </a>
                  </li>
                  <li className="wt-instagram">
                    <a href="#/">
                      <i className="fab fa-instagram" />
                    </a>
                  </li>
                  <li className="wt-googleplus">
                    <a href="#/">
                      <i className="fab fa-google-plus-g" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <div className="wt-footercol wt-widgetcompany">
                <div className="wt-fwidgettitle">
                  <h3>Company</h3>
                </div>
                <ul className="wt-fwidgetcontent">
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/how-it-works">How It Works</Link>
                  </li>
                  <li>
                    <Link to="/careers">Careers</Link>
                  </li>
                  <li>
                    <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                  </li>
                  <li>
                    <Link to="/trust-and-safety">Trust &amp; Safety</Link>
                  </li>
                  <li className="wt-viewmore">
                    <Link to="/about">+ View All</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <div className="wt-footercol wt-widgetexplore">
                <div className="wt-fwidgettitle">
                  <h3>Explore More</h3>
                </div>
                <ul className="wt-fwidgetcontent">
                  <li>
                    <Link to="/?service=plumbing#find-providers">Plumbers Near You</Link>
                  </li>
                  <li>
                    <Link to="/?service=electrical#find-providers">Electricians Near You</Link>
                  </li>
                  <li>
                    <Link to="/?service=cleaning#find-providers">Cleaners Near You</Link>
                  </li>
                  <li>
                    <Link to="/?service=tutoring#find-providers">Tutors Near You</Link>
                  </li>
                  <li>
                    <Link to="/?service=plumbing#find-providers">Find Professionals</Link>
                  </li>
                  <li className="wt-viewmore">
                    <Link to="/service-categories">+ View All</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wt-haslayout wt-joininfo">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 push-lg-1">
              <div className="wt-companyinfo">
                <span>
                  <Link to="/register">New to SkillzLink?</Link> Find trusted professionals or grow
                  your service business today.
                </span>
              </div>
              <div className="wt-fbtnarea">
                <Link to="/register" className="wt-btn">Join Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wt-haslayout wt-footerbottom">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <p className="wt-copyrights">SkillzLink &copy; {new Date().getFullYear()}</p>
              <nav className="wt-addnav">
                <ul>
                  <li>
                    <Link to="/news">News</Link>
                  </li>
                  <li>
                    <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/careers">Career</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
