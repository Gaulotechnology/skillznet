import { Link } from 'react-router-dom';

export function ServiceSinglePage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Breadcrumb */}
      <div className="bg-[var(--bg-secondary)] py-6">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Service Request Detail</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/search">Services</Link></li>
                  <li className="wt-active">Service Detail</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Inner Home End */}

      {/* Main Start */}
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          {/* User Listing Start */}
          <div className="container">
            <div className="row">
              <div id="wt-twocolumns" className="wt-twocolumns wt-haslayout">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 float-left">
                  <div className="wt-proposalholder">
                    <span className="wt-featuredtag">
                      <img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" />
                    </span>
                    <div className="wt-proposalhead">
                      <h2>Geyser element replacement needed immediately</h2>
                      <ul className="wt-userlisting-breadcrumb wt-userlisting-breadcrumbvtwo">
                        <li><span><i className="fa fa-dollar-sign"></i><i className="fa fa-dollar-sign"></i><i className="fa fa-dollar-sign"></i> Professional</span></li>
                        <li><span><img src="/images/flag/img-02.png" alt="img description" /> Harare, Zimbabwe</span></li>
                        <li><span><i className="far fa-folder"></i> Type: Fixed</span></li>
                        <li><span><i className="far fa-clock"></i> Duration: Urgent (1 Day)</span></li>
                      </ul>
                    </div>
                    <div className="wt-btnarea"><a href="#/" className="wt-btn">Send Proposal</a></div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                  <div className="wt-projectdetail-holder">
                    <div className="wt-projectdetail">
                      <div className="wt-title">
                        <h3>Project Detail</h3>
                      </div>
                      <div className="wt-description">
                        <p>I have a 150L Kwikot geyser that has stopped heating water. I suspect the element has blown, but it might also be the thermostat. I need a qualified plumber or electrician to come and inspect it, and replace the necessary parts.</p>
                        <p>The geyser is located in the ceiling, easily accessible through the trapdoor in the hallway. Please bring your own tools and replacement parts if possible, or quote me for the labor and we can discuss the parts cost separately.</p>
                        <ul className="wt-projectliststyle">
                          <li><span><i className="fa fa-check"></i>Diagnosis of the heating issue</span></li>
                          <li><span><i className="fa fa-check"></i>Replacement of element or thermostat</span></li>
                          <li><span><i className="fa fa-check"></i>Testing to ensure water is heating properly</span></li>
                          <li><span><i className="fa fa-check"></i>Cleaning up the workspace</span></li>
                        </ul>
                      </div>
                    </div>
                    <div className="wt-skillsrequired">
                      <div className="wt-title">
                        <h3>Skills Required</h3>
                      </div>
                      <div className="wt-tag wt-widgettag">
                        <a href="#/">Plumbing</a>
                        <a href="#/">Electrical</a>
                        <a href="#/">Geyser Repair</a>
                        <a href="#/">Maintenance</a>
                      </div>
                    </div>
                    <div className="wt-attachments">
                      <div className="wt-title">
                        <h3>Attachments</h3>
                      </div>
                      <ul className="wt-attachfile">
                        <li>
                          <span>Geyser_Photo.jpg</span>
                          <em>File size: 512 kb<a href="#/"><i className="lnr lnr-download"></i></a></em>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 float-left">
                  <aside id="wt-sidebar" className="wt-sidebar">
                    <div className="wt-proposalsr">
                      <div className="wt-proposalsrcontent">
                        <span className="wt-proposalsicon"><i className="fa fa-angle-double-down"></i><i className="fa fa-newspaper"></i></span>
                        <div className="wt-title">
                          <h3>5</h3>
                          <span>Proposals Received Till<em>Today</em></span>
                        </div>
                      </div>
                      <div className="wt-clicksavearea">
                        <span>Service ID: sKz9LP2H4M</span>
                        <a href="#/" className="wt-clicksavebtn"><i className="far fa-heart"></i> Click to save</a>
                      </div>
                    </div>

                    <div className="wt-widget wt-companysinfo-jobsingle">
                      <div className="wt-companysdetails">
                        <figure className="wt-companysimg">
                          <img src="/images/company/img-01.jpg" alt="img description" />
                        </figure>
                        <div className="wt-companysinfo">
                          <figure><img src="/images/company/img-01.png" alt="img description" /></figure>
                          <div className="wt-title">
                            <a href="#/"><i className="fa fa-check-circle"></i> Verified User</a>
                            <h2>Farai Mutasa</h2>
                          </div>
                          <ul className="wt-postarticlemeta">
                            <li>
                              <a href="#/">
                                <span>2 Open Services</span>
                              </a>
                            </li>
                            <li>
                              <a href="#/">
                                <span>Full Profile</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="wt-widget wt-sharejob">
                      <div className="wt-widgettitle">
                        <h2>Share This Service</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <ul className="wt-socialiconssimple">
                          <li className="wt-facebook"><a href="#/"><i className="fab fa-facebook-f"></i>Share on Facebook</a></li>
                          <li className="wt-twitter"><a href="#/"><i className="fab fa-twitter"></i>Share on Twitter</a></li>
                          <li className="wt-linkedin"><a href="#/"><i className="fab fa-linkedin-in"></i>Share on Linkedin</a></li>
                        </ul>
                      </div>
                    </div>

                    <div className="wt-widget wt-reportjob">
                      <div className="wt-widgettitle">
                        <h2>Report This Service</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <form className="wt-formtheme wt-formreport">
                          <fieldset>
                            <div className="form-group">
                              <span className="wt-select">
                                <select defaultValue="Reason">
                                  <option value="Reason" disabled>Select Reason</option>
                                  <option value="Spam">Spam or misleading</option>
                                  <option value="Inappropriate">Inappropriate content</option>
                                </select>
                              </span>
                            </div>
                            <div className="form-group">
                              <textarea className="form-control" placeholder="Description"></textarea>
                            </div>
                            <div className="form-group wt-btnarea">
                              <a href="#/" className="wt-btn">Submit</a>
                            </div>
                          </fieldset>
                        </form>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
          {/* User Listing End */}
        </div>
      </main>
      {/* Main End */}
    </div>
  );
}
