import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardSaveItemsPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'companies' | 'freelancers'>('jobs');

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9">
            <div className="wt-dashboardbox wt-dashboardtabsholder wt-saveitemholder">
              <div className="wt-dashboardtabs">
                <ul className="wt-tabstitle nav navbar-nav">
                  <li className="nav-item">
                    <a 
                      href="#!"
                      className={activeTab === 'jobs' ? 'active' : ''} 
                      onClick={(e) => { e.preventDefault(); setActiveTab('jobs'); }}
                    >
                      Saved Jobs
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      href="#!"
                      className={activeTab === 'companies' ? 'active' : ''} 
                      onClick={(e) => { e.preventDefault(); setActiveTab('companies'); }}
                    >
                      Followed Companies
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      href="#!"
                      className={activeTab === 'freelancers' ? 'active' : ''} 
                      onClick={(e) => { e.preventDefault(); setActiveTab('freelancers'); }}
                    >
                      Liked Freelancers
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className="wt-tabscontent tab-content tab-savecontent">
                {activeTab === 'jobs' && (
                  <div className="wt-personalskillshold tab-pane active fade show">
                    <div className="wt-yourdetails">
                      <div className="wt-tabscontenttitle">
                        <h2>Saved Jobs</h2>
                      </div>
                      <div className="wt-dashboradsaveitem">
                        {/* Saved Job Item */}
                        <div className="wt-userlistinghold wt-featured wt-dashboradsaveditems">
                          <span className="wt-dashboardsavetag wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                          <div className="wt-userlistingcontent">
                            <div className="wt-contenthead wt-dashboardsavehead">
                              <div className="wt-title">
                                <Link to="/profile"><i className="fa fa-check-circle"></i> Choosen Design</Link>
                                <h2>Translation and Proof Reading (Multi Language)</h2>
                              </div>
                              <ul className="wt-saveitem-breadcrumb wt-userlisting-breadcrumb">
                                <li><span className="wt-dashboraddoller"><i className="fa fa-dollar-sign"></i> Professional</span></li>
                                <li><span><img src="/images/flag/img-04.png" alt="img description" /> England</span></li>
                                <li><a href="#!" className="wt-clicksavefolder"><i className="far fa-folder"></i> Type: Per Fixed</a></li>
                                <li><span className="wt-dashboradclock"><i className="far fa-clock"></i> Duration: 15 Days</span></li>
                                <li><a href="#!" className="wt-clicksave"><i className="fa fa-heart"></i> Saved</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* Saved Job Item 2 */}
                        <div className="wt-userlistinghold wt-dashboradsavebg">
                          <div className="wt-userlistingcontent">
                            <div className="wt-contenthead wt-dashboardsavehead">
                              <div className="wt-title">
                                <Link to="/profile"><i className="fa fa-check-circle"></i> Light Bulb Association</Link>
                                <h2>I want some customization and installation on wordpress</h2>
                              </div>
                              <ul className="wt-saveitem-breadcrumb wt-userlisting-breadcrumb">
                                <li><span className="wt-dashboraddoller"><i className="fa fa-dollar-sign"></i> Professional</span></li>
                                <li><span><img src="/images/flag/img-04.png" alt="img description" /> England</span></li>
                                <li><a href="#!" className="wt-clicksavefolder"><i className="far fa-folder"></i> Type: Per Fixed</a></li>
                                <li><span className="wt-dashboradclock"><i className="far fa-clock"></i> Duration: 15 Days</span></li>
                                <li><a href="#!" className="wt-clicksave"><i className="fa fa-heart"></i> Saved</a></li>
                              </ul>
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
                )}
                
                {activeTab === 'companies' && (
                  <div className="wt-educationholder tab-pane active fade show">
                    <div className="wt-userexperience wt-followcompomy">
                      <div className="wt-tabscontenttitle">
                        <h2>Followed Companies</h2>
                      </div>
                      <div className="wt-focomponylist">
                        {/* Followed Company Item */}
                        <div className="wt-followedcompnies">
                          <div className="wt-userlistinghold wt-userlistingsingle">
                            <figure className="wt-userlistingimg">
                              <img src="/images/company/img-01.png" alt="image description" />
                            </figure>
                            <div className="wt-userlistingcontent">
                              <div className="wt-contenthead wt-followcomhead">
                                <div className="wt-title">
                                  <a href="#!"><i className="fa fa-check-circle"></i> Verified Company</a>
                                  <h3>Angry Creative Studio</h3>
                                </div>
                                <ul className="wt-followcompomy-breadcrumb wt-userlisting-breadcrumb">
                                  <li><a href="#!"> Open Jobs </a></li>
                                  <li><a href="#!"> Full Profile</a></li>
                                  <li><a href="#!" className="wt-savefollow"> Following</a></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'freelancers' && (
                  <div className="wt-awardsholder tab-pane active fade show">
                    <div className="wt-addprojectsholder wt-likefreelan">
                      <div className="wt-tabscontenttitle">
                        <h2>Liked Freelancers</h2>
                      </div>
                      <div className="wt-likedfreelancers wt-haslayout">
                        {/* Liked Freelancer Item */}
                        <div className="wt-userlistinghold wt-featured">
                          <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                          <figure className="wt-userlistingimg">
                            <img src="/images/user/userlisting/img-01.jpg" alt="image description" />
                          </figure>
                          <div className="wt-userlistingcontent">
                            <div className="wt-contenthead">
                              <div className="wt-title">
                                <Link to="/profile"><i className="fa fa-check-circle"></i> Alfredo Bossard</Link>
                                <h2>Classifieds Posting, Data Entry, Typing</h2>
                              </div>
                              <ul className="wt-userlisting-breadcrumb">
                                <li><span><i className="far fa-money-bill-alt"></i> $44.00 / hr</span></li>
                                <li><span><img src="/images/flag/img-02.png" alt="img description" /> United States</span></li>
                                <li><a href="#!" className="wt-clicksave"><i className="fa fa-heart"></i> Save</a></li>
                              </ul>
                            </div>
                            <div className="wt-rightarea">
                              <span className="wt-starsvtwo">
                                <i className="fa fa-star fill"></i>
                                <i className="fa fa-star fill"></i>
                                <i className="fa fa-star fill"></i>
                                <i className="fa fa-star fill"></i>
                                <i className="fa fa-star fill"></i>
                              </span>
                              <span className="wt-starcontent">4.5/<sub>5</sub> <em>(860 Feedback)</em></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
