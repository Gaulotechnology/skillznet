import { MainLayout } from '../components/layout/MainLayout';

export function JobListingPage() {
  return (
    <MainLayout>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Search Result</h2></div>
                <ol className="wt-breadcrumb">
                  <li><a href="/">Home</a></li>
                  <li className="wt-active">Job</li>
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
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Categories</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="form-group">
                                <input type="text" name="Search" className="form-control" placeholder="Search Category" />
                                <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                              </div>
                            </fieldset>
                            <fieldset>
                              <div className="wt-checkboxholder wt-verticalscrollbar">
                                <span className="wt-checkbox">
                                  <input id="wordpress" type="checkbox" name="description" value="company" defaultChecked />
                                  <label htmlFor="wordpress"> WordPress</label>
                                </span>
                                <span className="wt-checkbox">
                                  <input id="graphic" type="checkbox" name="description" value="company" />
                                  <label htmlFor="graphic"> Graphic Design</label>
                                </span>
                                <span className="wt-checkbox">
                                  <input id="website" type="checkbox" name="description" value="company" />
                                  <label htmlFor="website"> Website Design</label>
                                </span>
                                <span className="wt-checkbox">
                                  <input id="article" type="checkbox" name="description" value="company" />
                                  <label htmlFor="article"> Article Writing</label>
                                </span>
                                <span className="wt-checkbox">
                                  <input id="software" type="checkbox" name="description" value="company" />
                                  <label htmlFor="software"> Software Architecture</label>
                                </span>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                      
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Project Type</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="wt-checkboxholder">
                                <span className="wt-radio">
                                  <input id="project" type="radio" name="description" value="company" defaultChecked />
                                  <label htmlFor="project"> Any Project Type</label>
                                </span>
                                <span className="wt-radio">
                                  <input id="hourly" type="radio" name="description" value="company" />
                                  <label htmlFor="hourly"> Hourly Based Project</label>
                                </span>
                                <span className="wt-radio">
                                  <input id="fixed" type="radio" name="description" value="company" />
                                  <label htmlFor="fixed"> Fixed Price Project</label>
                                </span>
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
                        <div className="wt-widgetcontent">
                          <div className="wt-applyfilters">
                            <span>Click “Apply Filter” to apply latest<br/> changes made by you.</span>
                            <a href="#!" className="wt-btn">Apply Filters</a>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                    <div className="wt-userlistingholder wt-haslayout">
                      <div className="wt-userlistingtitle">
                        <span>01 - 48 of 57143 results for <em>"PHP Developer"</em></span>
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
                      
                      {/* Job 1 */}
                      <div className="wt-userlistinghold wt-featured wt-userlistingholdvtwo">
                        <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                        <div className="wt-userlistingcontent">
                          <div className="wt-contenthead">
                            <div className="wt-title">
                              <a href="/user-single"><i className="fa fa-check-circle"></i> Light Bulb Association</a>
                              <h2>I want some customization and installation</h2>
                            </div>
                            <div className="wt-description">
                              <p>Nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit inati voluptate velit esse cillum dolore eutates fugiat nulla pariatur sunt in culpa asequi officia deserunt mollit anim id est laborum ut perspiciatis...</p>
                            </div>
                            <div className="wt-tag wt-widgettag">
                              <a href="#!">PHP</a>
                              <a href="#!">HTML</a>
                              <a href="#!">JQuery</a>
                            </div>
                          </div>
                          <div className="wt-viewjobholder">
                            <ul>
                              <li><span><i className="fa fa-dollar-sign wt-viewjobdollar"></i>Professional</span></li>
                              <li><span><em><img src="/images/flag/img-04.png" alt="img description" /></em>England</span></li>
                              <li><span><i className="far fa-folder wt-viewjobfolder"></i>Type: Per Hour</span></li>
                              <li><span><i className="far fa-clock wt-viewjobclock"></i>Duration: 03 Months</span></li>
                              <li><span><i className="fa fa-tag wt-viewjobtag"></i>Job ID: gy3yV2Vm5u</span></li>
                              <li><a href="#!" className="wt-clicklike wt-clicksave"><i className="fa fa-heart"></i> Save</a></li>
                              <li className="wt-btnarea"><a href="/job-single" className="wt-btn">View Job</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Job 2 */}
                      <div className="wt-userlistinghold wt-featured wt-userlistingholdvtwo">
                        <span className="wt-featuredtag wt-featuredtagcolor1"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                        <div className="wt-userlistingcontent">
                          <div className="wt-contenthead">
                            <div className="wt-title">
                              <a href="/user-single"><i className="fa fa-check-circle"></i> Point Trend Studio</a>
                              <h2>Website changes in HTML &amp; PHP</h2>
                            </div>
                            <div className="wt-description">
                              <p>Nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit inati voluptate velit esse cillum dolore eutates fugiat nulla pariatur sunt in culpa asequi officia deserunt mollit anim id est laborum ut perspiciatis...</p>
                            </div>
                            <div className="wt-tag wt-widgettag">
                              <a href="#!">PHP</a>
                              <a href="#!">HTML</a>
                              <a href="#!">Team Management</a>
                              <a href="#!">JQuery</a>
                            </div>
                          </div>
                          <div className="wt-viewjobholder">
                            <ul>
                              <li><span><i className="fa fa-dollar-sign wt-viewjobdollar"></i>Professional</span></li>
                              <li><span><em><img src="/images/flag/img-02.png" alt="img description" /></em>United States</span></li>
                              <li><span><i className="far fa-folder wt-viewjobfolder"></i>Type: Per Fixed</span></li>
                              <li><span><i className="far fa-clock wt-viewjobclock"></i>Duration: 15 Days</span></li>
                              <li><span><i className="fa fa-tag wt-viewjobtag"></i>Job ID: 5aUQgM2ZbW</span></li>
                              <li><a href="#!" className="wt-clicklike"><i className="fa fa-heart"></i> Click to Save</a></li>
                              <li className="wt-btnarea"><a href="/job-single" className="wt-btn">View Job</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pagination */}
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
