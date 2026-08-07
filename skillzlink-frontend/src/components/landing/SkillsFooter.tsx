import { Link } from "react-router-dom"

export function SkillsFooter() {
  return (
    <section className="wt-haslayaout wt-main-section wt-footeraboutus">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <div className="wt-widgetskills">
              <div className="wt-fwidgettitle">
                <h3>By Services</h3>
              </div>
              <ul className="wt-fwidgetcontent">
                <li><Link to="/?service=plumbing#find-providers">Plumber</Link></li>
                <li><Link to="/?service=electrical#find-providers">Electrician</Link></li>
                <li><Link to="/?service=cleaning#find-providers">Cleaner</Link></li>
                <li><Link to="/?service=tutoring#find-providers">Tutor</Link></li>
                <li><Link to="/?service=carpentry#find-providers">Carpenter</Link></li>
                <li><Link to="/?service=painting#find-providers">Painter</Link></li>
                <li><Link to="/?service=gardening#find-providers">Gardener</Link></li>
                <li><Link to="/?service=appliance-repair#find-providers">Appliance Repair</Link></li>
                <li className="wt-viewmore"><Link to="/service-categories">+ View All</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <div className="wt-widgetskill">
              <div className="wt-fwidgettitle">
                <h3>Services In Zimbabwe</h3>
              </div>
              <ul className="wt-fwidgetcontent">
                <li><Link to="/?service=plumbing#find-providers">Plumbers in Harare</Link></li>
                <li><Link to="/?service=electrical#find-providers">Electricians in Bulawayo</Link></li>
                <li><Link to="/?service=cleaning#find-providers">Cleaners in Mutare</Link></li>
                <li><Link to="/?service=tutoring#find-providers">Tutors in Gweru</Link></li>
                <li><Link to="/?service=carpentry#find-providers">Carpenters in Masvingo</Link></li>
                <li><Link to="/?service=painting#find-providers">Painters in Chinhoyi</Link></li>
                <li><Link to="/?service=gardening#find-providers">Gardeners in Kadoma</Link></li>
                <li><Link to="/?service=appliance-repair#find-providers">Repairs in Marondera</Link></li>
                <li className="wt-viewmore"><Link to="/service-categories">+ View All</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <div className="wt-footercol wt-widgetcategories">
              <div className="wt-fwidgettitle">
                <h3>By Categories</h3>
              </div>
              <ul className="wt-fwidgetcontent">
                <li><Link to="/?service=plumbing#find-providers">Plumbing &amp; Pipes</Link></li>
                <li><Link to="/?service=electrical#find-providers">Electrical &amp; Wiring</Link></li>
                <li><Link to="/?service=cleaning#find-providers">Cleaning &amp; Housekeeping</Link></li>
                <li><Link to="/?service=tutoring#find-providers">Tutoring &amp; Education</Link></li>
                <li><Link to="/?service=carpentry#find-providers">Carpentry &amp; Woodwork</Link></li>
                <li><Link to="/?service=painting#find-providers">Painting &amp; Decorating</Link></li>
                <li><Link to="/?service=gardening#find-providers">Gardening &amp; Landscaping</Link></li>
                <li><Link to="/?service=appliance-repair#find-providers">Appliance Repair</Link></li>
                <li className="wt-viewmore"><Link to="/service-categories">+ View All</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <div className="wt-widgetbylocation">
              <div className="wt-fwidgettitle">
                <h3>By Location</h3>
              </div>
              <ul className="wt-fwidgetcontent">
                <li><Link to="/#find-providers">Harare</Link></li>
                <li><Link to="/#find-providers">Bulawayo</Link></li>
                <li><Link to="/#find-providers">Mutare</Link></li>
                <li><Link to="/#find-providers">Gweru</Link></li>
                <li><Link to="/#find-providers">Masvingo</Link></li>
                <li><Link to="/#find-providers">Kwekwe</Link></li>
                <li><Link to="/#find-providers">Chinhoyi</Link></li>
                <li><Link to="/#find-providers">Victoria Falls</Link></li>
                <li className="wt-viewmore"><Link to="/#find-providers">+ View All</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
