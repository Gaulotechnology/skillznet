import { DashboardLayout } from "../../../components/layout/DashboardLayout";

export function DashboardInsightsPage() {
  return (
    <DashboardLayout>
      {/* Alert Boxes Start */}
      <div className="wt-haslayout wt-jobalertsdashboard">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="wt-jobalerts">
              <div className="alert alert-warning alert-dismissible fade show">
                <em>Alert:</em> <span> You’ve consumed all you points to apply new service,</span>
                <a href="#!" className="wt-alertbtn warning">Buy Now</a>
                <a href="#!" className="close" data-dismiss="alert" aria-label="Close"><i className="fa fa-close"></i></a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="wt-jobalerts">
              <div className="alert alert-primary alert-dismissible fade show">
                <em>info: </em> <span> You’ve no skills of “PHP” but still you can apply for this service.</span>
                <a href="#!" className="wt-alertbtn primary">View</a>
                <a href="#!" className="close" data-dismiss="alert" aria-label="Close"><i className="fa fa-close"></i></a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="wt-jobalerts">
              <div className="alert alert-success alert-dismissible fade show">
                <em>Congratulation!</em> <span> we've received payment against your selected package Congratulation!:  “Extended Plan” and its valid till “Jun 27, 2019”</span>
                <a href="#!" className="wt-alertbtn success">Got It</a>
                <a href="#!" className="close" data-dismiss="alert" aria-label="Close"><i className="fa fa-close"></i></a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="wt-jobalerts">
              <div className="alert alert-danger alert-dismissible fade show">
                <em>You’re Late:</em> <span> We’re sorry but the service you want to apply is no longer available You’re Late:  for public/providers anymore.</span>
                <a href="#!" className="wt-alertbtn danger">Got It</a>
                <a href="#!" className="close" data-dismiss="alert" aria-label="Close"><i className="fa fa-close"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Alert Boxes End */}

      <section className="wt-haslayout wt-jobpostedholder">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div className="wt-haslayout wt-dbsectionspace">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle wt-yeartag">
                  <h2>Service Posted</h2>
                  <div className="wt-tag wt-widgettag">
                    <a href="#!">2019</a>
                    <a href="#!">2018</a>
                    <a href="#!">2017</a>
                  </div>
                </div>
                <div className="wt-dashboardboxcontent">
                  <div id="wt-postedsilder" className="wt-postedsilder owl-carousel">
                    <div className="item">
                      <div className="wt-posteditem">
                        <span><i className="fa fa-check-circle"></i><a href="#!"> Louanne Mattioli</a></span>
                        <h3>I want some customization</h3>
                      </div>
                    </div>
                    {/* Add more items if necessary */}
                  </div>
                  <div className="wt-jobchartholder">
                    <canvas id="wt-jobchart" className="wt-jobchart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
            <div className="wt-haslayout wt-dbsectionspace">
              <div className="wt-dashboardbox">
                <div className="wt-dashboardboxtitle">
                  <h2>Current Hired Providers</h2>
                </div>
                <div className="wt-dashboardboxcontent wt-hiredfreelance">
                  <div className="wt-userlistinghold wt-featured">
                    <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content" /></span>
                    <figure className="wt-userlistingimg">
                      <img src="/images/user/userlisting/img-01.jpg" alt="img description" />
                    </figure>
                    <div className="wt-proposaldetails">
                      <div className="wt-contenthead">
                        <div className="wt-title">
                          <h3><a href="#!">Terrence Tynan</a><span>Project Title Goes Here</span></h3>
                          <a href="#!" className="wt-hiredarrow"><i className="lnr lnr-chevron-right"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="wt-userlistinghold wt-featured">
                    <figure className="wt-userlistingimg">
                      <img src="/images/user/userlisting/img-02.jpg" alt="img description" />
                    </figure>
                    <div className="wt-proposaldetails">
                      <div className="wt-contenthead">
                        <div className="wt-title">
                          <h3><a href="#!">Aileen Remington</a><span>Project Title Goes Here</span></h3>
                          <a href="#!" className="wt-hiredarrow"><i className="lnr lnr-chevron-right"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
            <aside id="wt-sidebar" className="wt-sidebar wt-dashboardsave wt-dbsectionspace">
              <div className="wt-proposalsr wt-box-shadow">
                <div className="wt-proposalsrcontent">
                  <figure>
                    <img src="/images/thumbnail/img-17.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>150</h3>
                    <span>Total Ongoing Services</span>
                  </div>
                </div>
              </div>
              <div className="wt-proposalsr wt-box-shadow">
                <div className="wt-proposalsrcontent wt-componyfolow">
                  <figure>
                    <img src="/images/thumbnail/img-16.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>1406</h3>
                    <span>Total Completed Services</span>
                  </div>
                </div>
              </div>
              <div className="wt-proposalsr wt-box-shadow">
                <div className="wt-proposalsrcontent  wt-freelancelike">
                  <figure>
                    <img src="/images/thumbnail/img-15.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>2075</h3>
                    <span>Total Cancelled Services</span>
                  </div>
                </div>
              </div>
              <div className="wt-proposalsr wt-box-shadow">
                <div className="wt-proposalsrcontent wt-repostjob">
                  <figure>
                    <img src="/images/thumbnail/img-18.png" alt="image" />
                  </figure>
                  <div className="wt-title">
                    <h3>334</h3>
                    <span>Total Repost Services</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      
      <section className="wt-haslayout wt-dbsectionspace wt-padding-add-top wt-moredetailsholder">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
            <div className="wt-insightsitem wt-dashboardbox wt-insightnoticon">
              <figure className="wt-userlistingimg">
                <img src="/images/thumbnail/img-19.png" alt="img description" />
              </figure>
              <div className="wt-insightdetails">
                <div className="wt-title">
                  <h3>New Messages</h3>
                  <a href="#!">Click To View</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
            <div className="wt-insightsitem wt-dashboardbox">
              <figure className="wt-userlistingimg">
                <img src="/images/thumbnail/img-20.png" alt="img description" />
              </figure>
              <div className="wt-insightdetails">
                <div className="wt-title">
                  <h3>Latest Proposals</h3>
                  <a href="#!">Click To View</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
            <div className="wt-insightsitem wt-dashboardbox">
              <span className="wt-pakagespinner"><i className="fa fa-spinner wt-uploading"></i> D29 : H06 : M38 : S42</span>
              <figure className="wt-userlistingimg">
                <img src="/images/thumbnail/img-21.png" alt="img description" />
              </figure>
              <div className="wt-insightdetails">
                <div className="wt-title">
                  <h3>Check Package Expiry</h3>
                  <a href="#!">Click To View</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
            <div className="wt-insightsitem wt-dashboardbox">
              <figure className="wt-userlistingimg">
                <img src="/images/thumbnail/img-22.png" alt="img description" />
              </figure>
              <div className="wt-insightdetails">
                <div className="wt-title">
                  <h3>View Saved Items</h3>
                  <a href="#!">Click To View</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
