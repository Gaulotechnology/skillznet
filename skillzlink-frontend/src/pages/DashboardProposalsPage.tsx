import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardProposalsPage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace wt-proposals">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-9">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Manage Jobs</h2>
              </div>
              <div className="wt-dashboardboxcontent wt-rcvproposala">
                <div className="wt-userlistinghold wt-featured wt-userlistingvtwo">
                  <span className="wt-featuredtag wt-featuredtagcolor3"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                  <div className="wt-userlistingcontent">
                    <div className="wt-contenthead">
                      <div className="wt-title">
                        <Link to="/profile"><i className="fa fa-check-circle"></i> Terrence Tynan</Link>
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
                      <div className="wt-hireduserstatus">
                        <h4>06</h4><span>Proposals Received</span>
                        <ul className="wt-hireduserimgs">
                          <li><figure><img src="/images/user/userlisting/img-02.jpg" alt="img description" /></figure></li>
                          <li><figure><img src="/images/user/userlisting/img-03.jpg" alt="img description" /></figure></li>
                          <li><figure><img src="/images/user/userlisting/img-01.jpg" alt="img description" /></figure></li>
                          <li><figure><img src="/images/user/userlisting/img-02.jpg" alt="img description" /></figure></li>
                          <li><figure><img src="/images/user/userlisting/img-05.jpg" alt="img description" /></figure></li>
                          <li><figure><img src="/images/user/userlisting/img-01.jpg" alt="img description" /></figure></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wt-freelancerholder wt-rcvproposalholder">
                  <div className="wt-tabscontenttitle">
                    <h2>Received Proposals</h2>
                  </div>
                  <div className="wt-managejobcontent">
                    {/* Proposal Item 1 */}
                    <div className="wt-userlistinghold wt-featured wt-proposalitem">
                      <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                      <figure className="wt-userlistingimg">
                        <img src="/images/user/userlisting/img-01.jpg" alt="image description" />
                      </figure>
                      <div className="wt-proposaldetails">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <Link to="/profile"> Alfredo Bossard</Link>
                          </div>
                        </div>
                        <div className="wt-proposalfeedback">
                          <span className="wt-starsvtwo">
                            <i className="fa fa-star fill"></i>
                          </span>
                          <span className="wt-starcontent"> 4.5/<i>5</i> <em> (860 Feedback)</em></span>
                        </div>
                      </div>
                      <div className="wt-rightarea">
                        <div className="wt-btnarea">
                          <a href="#!" className="wt-btn">Hire Now</a>
                        </div>
                        <div className="wt-hireduserstatus">
                          <h5>$30</h5>
                          <span>In 02 Months</span>
                        </div>
                        <div className="wt-hireduserstatus">
                          <i className="far fa-envelope"></i>
                          <span>Cover Letter</span>
                        </div>
                        <div className="wt-hireduserstatus">
                          <i className="fa fa-paperclip"></i>
                          <span>03 file attached</span>
                        </div>
                      </div>
                    </div>
                    {/* Proposal Item 2 */}
                    <div className="wt-userlistinghold wt-featured wt-proposalitem">
                      <span className="wt-featuredtag wt-featuredtagcolor1"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                      <figure className="wt-userlistingimg">
                        <img src="/images/user/userlisting/img-02.jpg" alt="image description" />
                      </figure>
                      <div className="wt-proposaldetails">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <Link to="/profile"> Alfredo Bossard</Link>
                          </div>
                        </div>
                        <div className="wt-proposalfeedback">
                          <span className="wt-starsvtwo">
                            <i className="fa fa-star fill"></i>
                          </span>
                          <span className="wt-starcontent"> 4.5/<i>5</i> <em> (860 Feedback)</em></span>
                        </div>
                      </div>
                      <div className="wt-rightarea">
                        <div className="wt-btnarea">
                          <a href="#!" className="wt-btn">Hire Now</a>
                        </div>
                        <div className="wt-hireduserstatus">
                          <h5>$06</h5>
                          <span>In 02 Months</span>
                        </div>
                        <div className="wt-hireduserstatus">
                          <i className="far fa-envelope"></i>
                          <span>Cover Letter</span>
                        </div>
                        <div className="wt-hireduserstatus">
                          <i className="fa fa-paperclip"></i>
                          <span>03 file attached</span>
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
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-5 col-xl-3">
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
