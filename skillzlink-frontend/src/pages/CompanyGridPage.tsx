import { MainLayout } from '../components/layout/MainLayout';

export function CompanyGridPage() {
  return (
    <MainLayout>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Company Grid</h2></div>
                <ol className="wt-breadcrumb">
                  <li><a href="/">Home</a></li>
                  <li className="wt-active">Company Grid</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          <div className="wt-haslayout">
            <div className="container">
              <div className="row">
                <div id="wt-twocolumns" className="wt-twocolumns wt-haslayout">
                  <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 float-left">
                    <aside id="wt-sidebar" className="wt-sidebar">
                      <div className="wt-widget wt-startsearch">
                        <div className="wt-widgettitle">
                          <h2>Start Your Search</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="form-group">
                                <input type="text" name="Search" className="form-control" placeholder="Search Company" />
                                <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                      
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Location</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="form-group">
                                <input type="text" name="fullname" className="form-control" placeholder="Search Location" />
                                <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                              </div>
                            </fieldset>
                            <fieldset>
                              <div className="wt-checkboxholder wt-verticalscrollbar">
                                <span className="wt-checkbox">
                                  <input id="wt-description" type="checkbox" name="description" value="company" defaultChecked />
                                  <label htmlFor="wt-description"> <img src="/images/flag/img-01.png" alt="img description" /> Australia</label>
                                </span>
                                <span className="wt-checkbox">
                                  <input id="us" type="checkbox" name="description" value="company" />
                                  <label htmlFor="us"> <img src="/images/flag/img-02.png" alt="img description" /> United States</label>
                                </span>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                      
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>No. Of Employee</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="wt-checkboxholder">
                                <span className="wt-checkbox">
                                  <input id="rate1" type="checkbox" name="description" value="company" defaultChecked />
                                  <label htmlFor="rate1">Less Than 02</label>
                                </span>
                                <span className="wt-checkbox">
                                  <input id="rate2" type="checkbox" name="description" value="company" />
                                  <label htmlFor="rate2"> 02 - 09 Employees</label>
                                </span>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                    </aside>
                  </div>
                  
                  <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                    <div className="wt-userlistingholder wt-haslayout">
                      <div className="wt-userlistingtitle">
                        <span>01 - 48 of 57143 results for <em>"Software House"</em></span>
                      </div>
                      <div className="wt-filterholder">
                        <ul className="wt-filtertag">
                          <li className="wt-filtertagclear">
                            <a href="#!"><i className="fa fa-times"></i> <span>Clear All Filter</span></a>
                          </li>
                          <li className="alert alert-dismissable fade in">
                            <a href="#!"><i className="fa fa-times close" data-dismiss="alert" aria-label="close"></i> <span>Graphic Design</span></a>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="wt-companysinfoholder">
                        <div className="row">
                          {/* Company 1 */}
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                            <div className="wt-companysdetails">
                              <figure className="wt-companysimg">
                                <img src="/images/company/img-01.jpg" alt="img description" />
                              </figure>
                              <div className="wt-companysinfo">
                                <figure><img src="/images/company/img-01.png" alt="img description" /></figure>
                                <div className="wt-title">
                                  <a href="/company-single"><i className="fa fa-check-circle"></i> Verified Company</a>
                                  <h2>Angry Creative Studio</h2>
                                </div>
                                <ul className="wt-postarticlemeta">
                                  <li>
                                    <a href="#!">
                                      <span>Open Jobs</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/company-single">
                                      <span>Full Profile</span>
                                    </a>
                                  </li>
                                  <li className="wt-following">
                                    <a href="#!">
                                      <span>Following</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          {/* Company 2 */}
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                            <div className="wt-companysdetails">
                              <figure className="wt-companysimg">
                                <img src="/images/company/img-02.jpg" alt="img description" />
                              </figure>
                              <div className="wt-companysinfo">
                                <figure><img src="/images/company/img-02.png" alt="img description" /></figure>
                                <div className="wt-title">
                                  <a href="/company-single"><i className="fa fa-check-circle"></i> Verified Company</a>
                                  <h2>Aviato Care Company</h2>
                                </div>
                                <ul className="wt-postarticlemeta">
                                  <li>
                                    <a href="#!">
                                      <span>Open Jobs</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/company-single">
                                      <span>Full Profile</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#!">
                                      <span>Click To Follow</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                      
                      <nav className="wt-pagination">
                        <ul>
                          <li className="wt-prevpage"><a href="#!"><i className="lnr lnr-chevron-left"></i></a></li>
                          <li><a href="#!">1</a></li>
                          <li><a href="#!">2</a></li>
                          <li><a href="#!">3</a></li>
                          <li><a href="#!">4</a></li>
                          <li><a href="#!">...</a></li>
                          <li><a href="#!">50</a></li>
                          <li className="wt-nextpage"><a href="#!"><i className="lnr lnr-chevron-right"></i></a></li>
                        </ul>
                      </nav>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
