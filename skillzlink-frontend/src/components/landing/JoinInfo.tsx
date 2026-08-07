import { Link } from "react-router-dom"

export function JoinInfo() {
  return (
    <section className="wt-haslayout wt-main-section wt-paddingnull wt-companyinfohold">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12">
            <div className="wt-companydetails">
              <div className="wt-companycontent">
                <div className="wt-companyinfotitle">
                  <h2>Hire a Professional</h2>
                </div>
                <div className="wt-description">
                  <p>
                    Need a plumber, electrician, or tutor? Post your service request and get matched
                    with verified, top-rated professionals in your area within minutes.
                  </p>
                </div>
                <div className="wt-btnarea">
                  <Link to="/register" className="wt-btn">Get Started</Link>
                </div>
              </div>
              <div className="wt-companycontent">
                <div className="wt-companyinfotitle">
                  <h2>Start As Professional</h2>
                </div>
                <div className="wt-description">
                  <p>
                    Are you a skilled plumber, electrician, cleaner, or tutor? Join SkillzLink to
                    grow your client base, manage bookings via WhatsApp, and get premium visibility.
                  </p>
                </div>
                <div className="wt-btnarea">
                  <Link to="/register" className="wt-btn">Join Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
