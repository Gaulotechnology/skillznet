import { MainLayout } from "../layouts/MainLayout";

export function CompanySinglePage() {
  return (
    <MainLayout>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Company Detail</h2></div>
                <ol className="wt-breadcrumb">
                  <li><a href="/">Home</a></li>
                  <li><a href="/companies">Company Grid</a></li>
                  <li className="wt-active">Company Detail</li>
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
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 float-left">
                    <div className="wt-comsingleimg">
                      <figure><img src="/images/bannerimg/banner.jpg" alt="img description" /></figure>
                    </div>
                  </div>
                  
                  <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 float-left">
                    <aside id="wt-sidebar" className="wt-sidebar">
                      <div className="wt-proposalsr wt-proposalsrvtwo">
                        <div className="wt-widgetcontent wt-companysinfo">
                          <figure><img src="/images/company/img-01.png" alt="img description" /></figure>
                          <div className="wt-title">
                            <a href="#!"><i className="fa fa-check-circle"></i> Verified Company</a>
                            <h2>Angry Creative Studio</h2>
                          </div>
                        </div>
                        <div className="tg-authorcodescan">
                          <figure className="tg-qrcodeimg">
                            <img src="/images/qrcode.png" alt="img description" />
                          </figure>
                          <div className="tg-qrcodedetail">
                            <span className="lnr lnr-laptop-phone"></span>
                            <div className="tg-qrcodefeat">
                              <h3>Scan with your <span>Smart Phone </span> To Get It Handy.</h3>
                            </div>
                          </div>
                        </div>
                        <div className="wt-clicksavearea">
                          <span>Service ID: tQu5DW9F2G</span>
                          <a href="#!" className="wt-clicksavebtn"><i className="far fa-heart"></i> Click to Follow</a>
                        </div>
                      </div>
                      
                      <div className="wt-widget">
                        <div className="wt-widgettitle">
                          <h2>Company Followers</h2>
                        </div>
                        <div className="wt-widgetcontent wt-comfollowers wt-verticalscrollbar">
                          <ul>
                            <li>
                              <a href="#!">
                                <span><img src="/images/followers/img-01.jpg" alt="img description" /></span>
                                <span>Ramona Acedo</span>
                              </a>
                            </li>
                            <li>
                              <a href="#!">
                                <span><img src="/images/followers/img-02.jpg" alt="img description" /></span>
                                <span>Bruna Perera</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="wt-widget wt-sharejob">
                        <div className="wt-widgettitle">
                          <h2>Share This Company</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <ul className="wt-socialiconssimple">
                            <li className="wt-facebook"><a href="#!"><i className="fab fa-facebook-f"></i>Share on Facebook</a></li>
                            <li className="wt-twitter"><a href="#!"><i className="fab fa-twitter"></i>Share on Twitter</a></li>
                            <li className="wt-linkedin"><a href="#!"><i className="fab fa-linkedin-in"></i>Share on Linkedin</a></li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="wt-widget wt-reportjob">
                        <div className="wt-widgettitle">
                          <h2>Report This Company</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formreport">
                            <fieldset>
                              <div className="form-group">
                                <span className="wt-select">
                                  <select defaultValue="1">
                                    <option value="1">Select Reason</option>
                                  </select>
                                </span>
                              </div>
                              <div className="form-group">
                                <textarea className="form-control" placeholder="Description"></textarea>
                              </div>
                              <div className="form-group wt-btnarea">
                                <a href="#!" className="wt-btn">Submit</a>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                    </aside>
                  </div>
                  
                  <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                    <div className="wt-userlistingholder wt-haslayout">
                      <div className="wt-comcontent">
                        <div className="wt-title">
                          <h3>About “Angry Crative Studio”</h3>
                        </div>
                        <div className="wt-description">
                          <p>Excepteur sint occaecat cupidatat non proident, saeunt in culpa qui officia deserunt mollit anim laborum. Seden utem perspiciatis undesieu omnis voluptatem accusantium doque laudantium, totam rem aiam eaqueiu ipsa quae ab illoion inventore veritatisetm quasitea architecto beataea dictaed quia couuntur magni dolores eos aquist ratione vtatem seque nesnt. Neque porro quamest quioremas ipsum quiatem dolor sitem ameteism conctetur adipisci velit sedate quianon.</p>
                        </div>
                      </div>
                      
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
                              <li><span><i className="fa fa-tag wt-viewjobtag"></i>Service ID: gy3yV2Vm5u</span></li>
                              <li><a href="#!" className="wt-clicklike wt-clicksave"><i className="fa fa-heart"></i> Save</a></li>
                              <li className="wt-btnarea"><a href="/service-single" className="wt-btn">View Service</a></li>
                            </ul>
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
