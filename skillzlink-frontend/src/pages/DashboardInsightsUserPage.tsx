import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardInsightsUserPage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace wt-insightuser">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle wt-yeartag">
                <h2>Total Earnings</h2>
                <div className="wt-tag wt-widgettag">
                  <a href="#!">2019</a>
                  <a href="#!">2018</a>
                  <a href="#!">2017</a>
                </div>
              </div>
              <div className="wt-dashboardboxcontent">
                <div className="wt-jobchartholder">
                  <canvas id="wt-jobchart" className="wt-jobchart"></canvas>
                </div>
              </div>
            </div>
            <div className="wt-dashboardbox wt-earningsholder">
              <div className="wt-dashboardboxtitle wt-titlewithsearch">
                <h2>Past Earnings</h2>
                <form className="wt-formtheme wt-formsearch">
                  <fieldset>
                    <div className="form-group">
                      <input type="text" name="Search" className="form-control" placeholder="Search Here" />
                      <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="wt-dashboardboxcontent">
                <table className="wt-tablecategories">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Date</th>
                      <th>Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>I want some customization and installation on wordpress</td>
                      <td>February 3, 2019</td>
                      <td>$19.00</td>
                    </tr>
                    <tr>
                      <td>Develop a transportation company website</td>
                      <td>January 12, 2019</td>
                      <td>$350.00</td>
                    </tr>
                    <tr>
                      <td>Change temp to Arabic and install on wordpress</td>
                      <td>December 16, 2018</td>
                      <td>$120.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div className="row">
              <div className="wt-insightsitemholder">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 float-left">
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
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 float-left">
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
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 float-left">
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
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 float-left">
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
              <div className="wt-insightsongoing">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 float-left">
                  <div className="wt-dashboardbox wt-ongoingproject">
                    <div className="wt-dashboardboxtitle">
                      <h2>Ongoing Projects</h2>
                    </div>
                    <div className="wt-dashboardboxcontent wt-hiredfreelance">
                      <div className="wt-userlistinghold wt-featured">
                        <span className="wt-smallfeaturedtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                        <div className="wt-proposaldetails">
                          <div className="wt-contenthead">
                            <div className="wt-title">
                              <h3>I want some customization &amp; installation on wordpress <span>Louanne Mattioli</span></h3>
                              <a href="#!" className="wt-hiredarrow"><i className="lnr lnr-chevron-right"></i></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="wt-dashboardsaveholder wt-dashboardsave">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 float-left">
                  <div className="wt-proposalsr wt-dashboardbox">
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
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 float-left">
                  <div className="wt-proposalsr wt-dashboardbox">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
