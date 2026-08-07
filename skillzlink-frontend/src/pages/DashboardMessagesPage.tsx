import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';

export function DashboardMessagesPage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9">
            <div className="wt-dashboardbox wt-messages-holder">
              <div className="wt-dashboardboxtitle">
                <h2>Messages</h2>
              </div>
              <div className="wt-dashboardboxtitle wt-titlemessages">
                <a href="#!" className="wt-back"><i className="ti-arrow-left"></i></a>
                <div className="wt-userlogedin">
                  <figure className="wt-userimg">
                    <img src="/images/user-img.jpg" alt="image description" />
                  </figure>
                  <div className="wt-username">
                    <h3><i className="fa fa-check-circle"></i> Louanne Mattioli</h3>
                    <span>Amento Tech</span>
                  </div>
                </div>
                <Link to="/profile" className="wt-viewprofile">View Profile</Link>
              </div>
              <div className="wt-dashboardboxcontent wt-dashboardholder wt-offersmessages">
                <ul>
                  <li>
                    <form className="wt-formtheme wt-formsearch">
                      <fieldset>
                        <div className="form-group">
                          <input type="text" name="Location" className="form-control" placeholder="Search Here" />
                          <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                        </div>
                      </fieldset>
                    </form>
                    <div className="wt-verticalscrollbar wt-dashboardscrollbar">
                      <div className="wt-ad wt-dotnotification wt-active">
                        <figure><img src="/images/messages/img-01.jpg" alt="image description" /></figure>
                        <div className="wt-adcontent">
                          <h3>Reta Milnes </h3>
                          <span>Consectetur adipisicing elit sed do...</span>
                        </div>
                      </div>
                      <div className="wt-ad wt-dotnotification">
                        <figure><img src="/images/messages/img-02.jpg" alt="image description" /></figure>
                        <div className="wt-adcontent">
                          <h3>Jed Loeffler</h3>
                          <span>Consectetur adipisicing elit sed do...</span>
                        </div>
                      </div>
                      <div className="wt-ad wt-dotnotification">
                        <figure><img src="/images/messages/img-03.jpg" alt="image description" /></figure>
                        <div className="wt-adcontent">
                          <h3>Jovan Mery</h3>
                          <span>Consectetur adipisicing elit sed do...</span>
                        </div>
                      </div>
                      <div className="wt-ad">
                        <figure><img src="/images/messages/img-04.jpg" alt="image description" /></figure>
                        <div className="wt-adcontent">
                          <h3>Nichelle Yelvington</h3>
                          <span>Consectetur adipisicing elit sed do...</span>
                        </div>
                      </div>
                      <div className="wt-ad">
                        <figure><img src="/images/messages/img-05.jpg" alt="image description" /></figure>
                        <div className="wt-adcontent">
                          <h3>Tonisha Plata</h3>
                          <span>Consectetur adipisicing elit sed do...</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="wt-chatarea">
                      <div className="wt-messages wt-verticalscrollbar wt-dashboardscrollbar">
                        <div className="wt-offerermessage">
                          <figure><img src="/images/messages/img-12.jpg" alt="image description" /></figure>
                          <div className="wt-description">
                            <p>Consectetur adipisicing elit sei do eiusmod tempor incididunt labore et dolore.</p>
                            <div className="clearfix"></div>
                            <time dateTime="2017-08-08">January 12th, 2011</time>
                          </div>
                        </div>
                        <div className="wt-memessage wt-readmessage">
                          <figure><img src="/images/messages/img-11.jpg" alt="image description" /></figure>
                          <div className="wt-description">
                            <p>Eiusmod tempor incididunt labore et dolore magna aliqiu enim ad minim veniam qiuisru exercitation ullamco laborisen nisi ut aliquip exea.</p>
                            <div className="clearfix"></div>
                            <p><a href="https://themeforest.net/" target="_blank" rel="noopener noreferrer">https://themeforest.net</a></p>
                            <div className="clearfix"></div>
                            <p>Is that ok?</p>
                            <div className="clearfix"></div>
                            <time dateTime="2017-08-08">Jun 28, 2017 09:30</time>
                            <div className="clearfix"></div>
                          </div>
                        </div>
                      </div>
                      <div className="wt-replaybox">
                        <div className="form-group">
                          <textarea className="form-control" name="reply" placeholder="Type message here"></textarea>
                        </div>
                        <div className="wt-iconbox">
                          <i className="lnr lnr-thumbs-up"></i>
                          <i className="lnr lnr-thumbs-down"></i>
                          <i className="lnr lnr-smile"></i>
                          <a href="#!" className="wt-btnsendmsg">Send</a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
            <div className="wt-dashboardbox wt-messagebox">
              <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
              <div className="wt-dashboardboxcontent">
                <div className="wt-userprofile">
                  <figure>
                    <img src="/images/profile/img-02.jpg" alt="img description" />
                    <div className="wt-userdropdown wt-online">
                    </div>
                  </figure>
                  <div className="wt-title">
                    <h3><i className="fa fa-check-circle"></i> Valentine Mehring</h3>
                    <span>5.0/5 <a>(860 Feedback)</a> <br />Member since May 30, 2013 <br /><a href="#!">@valentine20658</a></span>
                  </div>
                </div>
                <div className="wt-applyfilters">
                  <span>Adpsicing elit sed do eiusmod tempor<br /> incididunt ut labore et dolore.</span>
                  <Link to="/profile" className="wt-btn">View Profile</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
