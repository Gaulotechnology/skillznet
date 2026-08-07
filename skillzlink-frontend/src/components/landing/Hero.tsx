import { Link } from "react-router-dom"

const serviceOptions = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "cleaning", label: "Cleaning" },
  { value: "tutoring", label: "Tutoring" },
  { value: "carpentry", label: "Carpentry" },
  { value: "painting", label: "Painting" },
  { value: "gardening", label: "Gardening" },
  { value: "appliance-repair", label: "Appliance Repair" },
]

interface HeroProps {
  selectedService: string
  onServiceChange: (service: string) => void
}

export function Hero({ selectedService, onServiceChange }: HeroProps) {
  return (
    <div className="wt-haslayout wt-bannerholder">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-5">
            <div className="wt-bannerimages">
              <figure className="wt-bannermanimg">
                <img src="/images/bannerimg/img-01.png" alt="Banner" />
                <img
                  src="/images/bannerimg/img-02.png"
                  className="wt-bannermanimgone"
                  alt="Banner layer one"
                />
                <img
                  src="/images/bannerimg/img-03.png"
                  className="wt-bannermanimgtwo"
                  alt="Banner layer two"
                />
              </figure>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7">
            <div className="wt-bannercontent">
              <div className="wt-bannerhead">
                <div className="wt-title">
                  <h1>
                    <span>Hire trusted local professionals</span> near you
                  </h1>
                </div>
                <div className="wt-description">
                  <p>
                    Find top-rated plumbers, electricians, cleaners, tutors, and other service
                    providers in minutes.
                  </p>
                </div>
              </div>
              <form className="wt-formtheme wt-formbanner">
                <fieldset>
                  <div className="form-group">
                    <input type="text" name="fullname" className="form-control" placeholder="I’m looking for" />
                    <div className="wt-formoptions">
                      <div className="wt-dropdown">
                        <span>In: <em className="selected-search-type">Freelancers </em><i className="lnr lnr-chevron-down"></i></span>
                      </div>
                      <div className="wt-radioholder">
                        <span className="wt-radio">
                          <input id="wt-freelancers" data-title="Freelancers" type="radio" name="searchtype" value="freelancer" defaultChecked />
                          <label htmlFor="wt-freelancers">Freelancers</label>
                        </span>
                        <span className="wt-radio">
                          <input id="wt-jobs" data-title="Jobs" type="radio" name="searchtype" value="job" />
                          <label htmlFor="wt-jobs">Jobs</label>
                        </span>
                        <span className="wt-radio">
                          <input id="wt-company" data-title="Companies" type="radio" name="searchtype" value="job" />
                          <label htmlFor="wt-company">Companies</label>
                        </span>
                      </div>
                      <Link to={`/search`} className="wt-searchbtn" aria-label="Find professionals">
                        <i className="lnr lnr-magnifier" />
                      </Link>
                    </div>
                  </div>
                </fieldset>
              </form>
              <div className="wt-videoholder">
                <div className="wt-videoshow">
                  <a href="https://www.youtube.com/watch?v=J37W6DjqT3Q">
                    <i className="fa fa-play" />
                  </a>
                </div>
                <div className="wt-videocontent">
                  <span>
                    See For Yourself!<em>How it works &amp; experience the ultimate joy.</em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
