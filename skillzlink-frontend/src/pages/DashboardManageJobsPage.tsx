import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardManageJobsPage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Manage Jobs</h2>
              </div>
              <div className="wt-dashboardboxcontent wt-jobdetailsholder">
                <div className="wt-freelancerholder">
                  <div className="wt-tabscontenttitle">
                    <h2>Posted Jobs</h2>
                  </div>
                  <div className="wt-managejobcontent wt-verticalscrollbar">
                    {/* Job Item 1 */}
                    <div className="wt-userlistinghold wt-featured wt-userlistingvtwo">
                      <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                      <div className="wt-userlistingcontent">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <Link to="/profile"><i className="fa fa-check-circle"></i> Louanne Mattioli</Link>
                            <h2>Translation and Proof Reading (Multi Language)</h2>
                          </div>
                          <ul className="wt-saveitem-breadcrumb wt-userlisting-breadcrumb">
                            <li><span className="wt-dashboraddoller"><i className="fa fa-dollar-sign"></i> Professional</span></li>
                            <li><span><img src="/images/flag/img-04.png" alt="img description" /> England</span></li>
                            <li><a href="#!" className="wt-clicksavefolder"><i className="far fa-folder"></i> Type: Per Fixed</a></li>
                            <li><span className="wt-dashboradclock"><i className="far fa-clock"></i> Duration: 15 Days</span></li>
                          </ul>
                        </div>
                        <div className="wt-rightarea">
                          <div className="wt-btnarea">
                            <Link to="/job-single" className="wt-btn">VIEW DETAILS</Link>
                          </div>
                          <div className="wt-hireduserstatus">
                            <h4>01</h4><span>Proposals</span>
                            <ul className="wt-hireduserimgs">
                              <li><figure><img src="/images/user/userlisting/img-05.jpg" alt="img description" /></figure></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Item 2 */}
                    <div className="wt-userlistinghold wt-featured wt-userlistingvtwo">
                      <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                      <div className="wt-userlistingcontent">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <Link to="/profile"><i className="fa fa-check-circle"></i> Louanne Mattioli</Link>
                            <h2>Develop a transportation company website </h2>
                          </div>
                          <ul className="wt-saveitem-breadcrumb wt-userlisting-breadcrumb">
                            <li><span className="wt-dashboraddoller"><i className="fa fa-dollar-sign"></i> Professional</span></li>
                            <li><span><img src="/images/flag/img-04.png" alt="img description" /> England</span></li>
                            <li><a href="#!" className="wt-clicksavefolder"><i className="far fa-folder"></i> Type: Per Fixed</a></li>
                            <li><span className="wt-dashboradclock"><i className="far fa-clock"></i> Duration: 15 Days</span></li>
                          </ul>
                        </div>
                        <div className="wt-rightarea">
                          <div className="wt-btnarea">
                            <Link to="/job-single" className="wt-btn">VIEW DETAILS</Link>
                          </div>
                          <div className="wt-hireduserstatus">
                            <h4>04</h4><span>Proposals</span>
                            <ul className="wt-hireduserimgs">
                              <li><figure><img src="/images/user/userlisting/img-05.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-01.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-02.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-03.jpg" alt="img description" /></figure></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Item 3 */}
                    <div className="wt-userlistinghold wt-featured wt-userlistingvtwo">
                      <div className="wt-userlistingcontent">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <Link to="/profile"><i className="fa fa-check-circle"></i> Louanne Mattioli</Link>
                            <h2>Change temp to Arabic and install on wordpress</h2>
                          </div>
                          <ul className="wt-saveitem-breadcrumb wt-userlisting-breadcrumb">
                            <li><span className="wt-dashboraddoller"><i className="fa fa-dollar-sign"></i> Professional</span></li>
                            <li><span><img src="/images/flag/img-04.png" alt="img description" /> England</span></li>
                            <li><a href="#!" className="wt-clicksavefolder"><i className="far fa-folder"></i> Type: Per Fixed</a></li>
                            <li><span className="wt-dashboradclock"><i className="far fa-clock"></i> Duration: 15 Days</span></li>
                          </ul>
                        </div>
                        <div className="wt-rightarea">
                          <div className="wt-btnarea">
                            <Link to="/job-single" className="wt-btn">VIEW DETAILS</Link>
                          </div>
                          <div className="wt-hireduserstatus">
                            <h4>150</h4><span>Proposals</span>
                            <ul className="wt-hireduserimgs">
                              <li><figure><img src="/images/user/userlisting/img-05.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-01.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-02.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-03.jpg" alt="img description" /></figure></li>
                              <li><figure><img src="/images/user/userlisting/img-01.jpg" alt="img description" /></figure></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <nav className="wt-pagination wt-savepagination">
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
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
            <aside id="wt-sidebar" className="wt-sidebar wt-dashboardsave">
              <div className="wt-proposalsr">
                <div className="wt-proposalsrcontent">
                  <figure>
                    <img src="/images/thumbnail/img-17.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>150</h3>
                    <span>Total Ongoing Jobs</span>
                  </div>
                </div>
              </div>
              <div className="wt-proposalsr">
                <div className="wt-proposalsrcontent wt-componyfolow">
                  <figure>
                    <img src="/images/thumbnail/img-16.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>1406</h3>
                    <span>Total Completed Jobs</span>
                  </div>
                </div>
              </div>
              <div className="wt-proposalsr">
                <div className="wt-proposalsrcontent  wt-freelancelike">
                  <figure>
                    <img src="/images/thumbnail/img-15.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>2075</h3>
                    <span>Total Cancelled Jobs</span>
                  </div>
                </div>
              </div>
            </aside>
            <div className="wt-companyad">
              <figure className="wt-companyadimg"><img src="/images/add-img.jpg" alt="img description" /></figure>
              <span>Advertisement  255px X 255px</span>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
