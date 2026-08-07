import { Link } from "react-router-dom"

export function AboutPage() {
  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>A Brief Intro</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">About</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          {/* Greetings & Welcome Start */}
          <section className="wt-haslayout">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="wt-greeting-holder">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-7 float-left">
                        <div className="wt-greetingcontent">
                          <div className="wt-sectionhead">
                            <div className="wt-sectiontitle">
                              <h2>Greetings &amp; Welcome</h2>
                              <span>Start Today For a Great Future</span>
                            </div>
                            <div className="wt-description">
                              <p>Welcome to SkillzLink, the premier platform connecting skilled professionals with clients who need their expertise. We believe in empowering local talent and providing a seamless, reliable experience for both service providers and seekers.</p>
                              <p>Our mission is to create a community where quality work is recognized and rewarded, making it easier than ever to find the right person for the job, right in your neighborhood.</p>
                            </div>
                          </div>
                          <div id="wt-statistics" className="wt-statistics">
                            <div className="wt-statisticcontent wt-countercolor1">
                              <h3>1500</h3>
                              <h4>Active Projects</h4>
                            </div>
                            <div className="wt-statisticcontent wt-countercolor2">
                              <h3>99%</h3>
                              <h4>Great Feedback</h4>
                            </div>
                            <div className="wt-statisticcontent wt-countercolor3">
                              <h3>5000</h3>
                              <h4>Active Professionals</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-5 float-left">
                        <div className="wt-greetingvideo">
                          <figure>
                            <a data-rel="prettyPhoto[video]" href="#/"><img src="/images/video-img.png" alt="video" />
                            </a>
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Signup Start */}
          <section className="wt-haslayout">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="wt-signupholder">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 pull-right">
                      <div className="wt-signupcontent">
                        <div className="wt-title">
                          <h2><span>Signup as</span>SkillzLink Pro</h2>
                        </div>
                        <div className="wt-description">
                          <p>Join our growing community of professionals and start finding clients today. Showcase your skills, get hired, and build your reputation.</p>
                        </div>
                        <div className="wt-btnarea">
                          <Link to="/register" className="wt-btn wt-btnvtwo">Join Now</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Team Start */}
          <section className="wt-haslayout" style={{ marginTop: '40px' }}>
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="wt-ourteamhold wt-haslayout wt-bgwhite">
                    <div id="filter-masonry" className="wt-teamfilter wt-haslayout">
                      <div className="wt-sectionhead">
                        <div className="wt-sectiontitle">
                          <h2>Our Professionals</h2>
                          <span>Team Behind The Curtain</span>
                        </div>
                      </div>
                      <div className="wt-teamholder">
                        <figure className="wt-speakerimg">
                          <img src="/images/team/img-01.jpg" alt="image description" />
                        </figure>
                        <div className="wt-teamcontent">
                          <div className="wt-title">
                            <h2><Link to="#/">Luisa Moxley</Link></h2>
                            <span>Marketing Manager</span>
                          </div>
                        </div>
                      </div>
                      <div className="wt-teamholder">
                        <figure className="wt-speakerimg">
                          <img src="/images/team/img-02.jpg" alt="image description" />
                        </figure>
                        <div className="wt-teamcontent">
                          <div className="wt-title">
                            <h2><Link to="#/">Guadalupe</Link></h2>
                            <span>Marketing Administrator</span>
                          </div>
                        </div>
                      </div>
                      <div className="wt-teamholder">
                        <figure className="wt-speakerimg">
                          <img src="/images/team/img-03.jpg" alt="image description" />
                        </figure>
                        <div className="wt-teamcontent">
                          <div className="wt-title">
                            <h2><Link to="#/">Brande Feeley</Link></h2>
                            <span>Marketing Director</span>
                          </div>
                        </div>
                      </div>
                      <div className="wt-teamholder">
                        <figure className="wt-speakerimg">
                          <img src="/images/team/img-04.jpg" alt="image description" />
                        </figure>
                        <div className="wt-teamcontent">
                          <div className="wt-title">
                            <h2><Link to="#/">Joseph Farner</Link></h2>
                            <span>VP Marketing</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
