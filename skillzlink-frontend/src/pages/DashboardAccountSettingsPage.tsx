import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardAccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('wt-security');

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9">
            <div className="wt-dashboardbox wt-dashboardtabsholder wt-accountsettingholder">
              <div className="wt-dashboardtabs">
                <ul className="wt-tabstitle nav navbar-nav">
                  <li className="nav-item">
                    <a className={activeTab === 'wt-security' ? 'active' : ''} onClick={() => setActiveTab('wt-security')} href="#!">Security &amp; Settings</a>
                  </li>
                  <li className="nav-item">
                    <a className={activeTab === 'wt-password' ? 'active' : ''} onClick={() => setActiveTab('wt-password')} href="#!">Password</a>
                  </li>
                  <li className="nav-item">
                    <a className={activeTab === 'wt-emailnoti' ? 'active' : ''} onClick={() => setActiveTab('wt-emailnoti')} href="#!">Email Notifications</a>
                  </li>
                  <li className="nav-item">
                    <a className={activeTab === 'wt-detailpagedesign' ? 'active' : ''} onClick={() => setActiveTab('wt-detailpagedesign')} href="#!">Detail Page Design</a>
                  </li>
                  <li className="nav-item">
                    <a className={activeTab === 'wt-deleteaccount' ? 'active' : ''} onClick={() => setActiveTab('wt-deleteaccount')} href="#!">Delete Account</a>
                  </li>
                </ul>
              </div>
              <div className="wt-tabscontent tab-content">
                {/* Security Tab */}
                {activeTab === 'wt-security' && (
                  <div className="wt-securityhold tab-pane active fade show" id="wt-security">
                    <div className="wt-securitysettings wt-tabsinfo">
                      <div className="wt-tabscontenttitle">
                        <h2>Account Security &amp; Settings</h2>
                      </div>
                      <div className="wt-settingscontent">
                        <div className="wt-description">
                          <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua aut enim ad minim veniamac quis nostrud exercitation ullamco laboris.</p>
                        </div>
                        <ul className="wt-accountinfo">
                          <li>
                            <div className="wt-on-off">
                              <input type="checkbox" id="hide-on" name="contact_form" />
                              <label htmlFor="hide-on"><i></i></label>
                            </div>
                            <span>Make my profile public</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onone" name="contact_form" />
                              <label htmlFor="hide-onone"><i></i></label>
                            </div>
                            <span>Make my profile searchable</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onthree" name="contact_form" defaultChecked />
                              <label htmlFor="hide-onthree"><i></i></label>
                            </div>
                            <span>Share my profile photo</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onfour" name="contact_form" defaultChecked />
                              <label htmlFor="hide-onfour"><i></i></label>
                            </div>
                            <span>Disable my account temporarily</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onfive" name="contact_form" />
                              <label htmlFor="hide-onfive"><i></i></label>
                            </div>
                            <span>Show my client feedback</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onsix" name="contact_form" />
                              <label htmlFor="hide-onsix"><i></i></label>
                            </div>
                            <span>Enable/ Disable</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="wt-location wt-tabsinfo">
                      <div className="wt-tabscontenttitle">
                        <h2>Language &amp; Currency</h2>
                      </div>
                      <form className="wt-formtheme wt-userform">
                        <fieldset>
                          <div className="form-group form-group-half">
                            <span className="wt-select">
                              <select defaultValue="">
                                <option value="" disabled>Select System Language</option>
                                <option value="english">English</option>
                                <option value="french">French</option>
                                <option value="spanish">Spanish</option>
                                <option value="japanese">Japanese</option>
                                <option value="arabic">Arabic</option>
                              </select>
                            </span>
                          </div>
                          <div className="form-group form-group-half">
                            <span className="wt-select">
                              <select defaultValue="">
                                <option value="" disabled>Select Currency</option>
                                <option value="brl">Brazilian Real</option>
                                <option value="usd">US Dollar</option>
                                <option value="cny">Yuan Renminbi</option>
                                <option value="cop">Colombian Peso</option>
                                <option value="eur">Euro</option>
                                <option value="hkd">Hong Kong Dollar</option>
                              </select>
                            </span>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                    <div className="wt-tabcompanyinfo">
                      <div className="wt-tabscontenttitle">
                        <h2>Dashboard Color Settings</h2>
                      </div>
                      <div className="wt-settingscontent">
                        <div className="wt-description">
                          <p>Incididunt ut labore et dolore magna aliqua aut enim ad exercitation ullamco laboris.</p>
                        </div>
                        <ul className="wt-accountinfo">
                          <li>
                            <div className="wt-on-off">
                              <input type="checkbox" id="hide-on1" name="contact_form" />
                              <label htmlFor="hide-on1"><i></i></label>
                            </div>
                            <span>Use dark version for my dashboard</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Tab */}
                {activeTab === 'wt-password' && (
                  <div className="wt-passwordholder tab-pane active fade show" id="wt-password">
                    <div className="wt-changepassword">
                      <div className="wt-tabscontenttitle">
                        <h2>Change Your Password</h2>
                      </div>
                      <form className="wt-formtheme wt-userform">
                        <fieldset>
                          <div className="form-group form-group-half">
                            <input type="password" name="password" className="form-control" placeholder="Last Remember Password" />
                          </div>
                          <div className="form-group form-group-half">
                            <input type="password" name="new_password" className="form-control" placeholder="New Password" />
                          </div>
                          <div className="form-group">
                            <span className="wt-checkbox">
                              <input id="termsconditions" type="checkbox" name="termsconditions" value="termsconditions" defaultChecked />
                              <label htmlFor="termsconditions"><span>Logout from all other web/mobile session now.</span></label>
                            </span>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                  </div>
                )}

                {/* Email Notifications Tab */}
                {activeTab === 'wt-emailnoti' && (
                  <div className="wt-emailnotiholder tab-pane active fade show" id="wt-emailnoti">
                    <div className="wt-emailnoti">
                      <div className="wt-tabscontenttitle">
                        <h2>Manage Email Notifications</h2>
                      </div>
                      <div className="wt-settingscontent">
                        <div className="wt-description">
                          <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua aut enim ad minim veniamac quis nostrud exercitation ullamco laboris.</p>
                        </div>
                        <form className="wt-formtheme wt-userform">
                          <fieldset>
                            <div className="form-group form-disabeld">
                              <input type="email" name="email" className="form-control" placeholder="youremail@domainurl.com" disabled />
                            </div>
                          </fieldset>
                        </form>
                        <ul className="wt-accountinfo">
                          <li>
                            <div className="wt-on-off">
                              <input type="checkbox" id="hide-onemail" name="contact_form" />
                              <label htmlFor="hide-onemail"><i></i></label>
                            </div>
                            <span>Send me Weekly newsletter alerts</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onemail1" name="contact_form" />
                              <label htmlFor="hide-onemail1"><i></i></label>
                            </div>
                            <span>Forward messages on this ID</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onemail2" name="contact_form" defaultChecked />
                              <label htmlFor="hide-onemail2"><i></i></label>
                            </div>
                            <span>Send me bonus &amp; promo alerts</span>
                          </li>
                          <li>
                            <div className="wt-on-off pull-right">
                              <input type="checkbox" id="hide-onemail3" name="contact_form" defaultChecked />
                              <label htmlFor="hide-onemail3"><i></i></label>
                            </div>
                            <span>Share latest security alerts</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detail Page Design Tab */}
                {activeTab === 'wt-detailpagedesign' && (
                  <div className="wt-pagedesignholder tab-pane active fade show" id="wt-detailpagedesign">
                    <div className="wt-selectdesignholder wt-tabsinfo">
                      <div className="wt-tabscontenttitle">
                        <h2>Choose Your Detail Page Design</h2>
                      </div>
                      <div className="wt-selectdesign">
                        <ul>
                          <li>
                            <div className="wt-templateoption">
                              <div className="wt-designtitle">
                                <span>Template 01</span>
                                <a href="#!" className="wt-btn float-right">Preview</a>
                              </div>
                              <div className="wt-designimg">
                                <input id="demo1" type="radio" name="detail_template" value="1" defaultChecked />
                                <label htmlFor="demo1"><img src="/images/template/img-01.jpg" alt="img description" /><i className="fa fa-check"></i></label>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="wt-templateoption">
                              <div className="wt-designtitle">
                                <span>Template 02</span>
                                <a href="#!" className="wt-btn float-right">Preview</a>
                              </div>
                              <div className="wt-designimg">
                                <input id="demo2" type="radio" name="detail_template" value="2" />
                                <label htmlFor="demo2"><img src="/images/template/img-02.jpg" alt="img description" /><i className="fa fa-check"></i></label>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="wt-templateoption">
                              <div className="wt-designtitle">
                                <span>Template 03</span>
                                <a href="#!" className="wt-btn float-right">Preview</a>
                              </div>
                              <div className="wt-designimg">
                                <input id="demo3" type="radio" name="detail_template" value="3" />
                                <label htmlFor="demo3"><img src="/images/template/img-03.jpg" alt="img description" /><i className="fa fa-check"></i></label>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="wt-templateoption">
                              <div className="wt-designtitle">
                                <span>Template 04</span>
                                <a href="#!" className="wt-btn float-right">Preview</a>
                              </div>
                              <div className="wt-designimg">
                                <input id="demo4" type="radio" name="detail_template" value="4" />
                                <label htmlFor="demo4"><img src="/images/template/img-04.jpg" alt="img description" /><i className="fa fa-check"></i></label>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Account Tab */}
                {activeTab === 'wt-deleteaccount' && (
                  <div className="wt-accountholder tab-pane active fade show" id="wt-deleteaccount">
                    <div className="wt-accountdel">
                      <div className="wt-tabscontenttitle">
                        <h2>Delete Account</h2>
                      </div>
                      <form className="wt-formtheme wt-userform">
                        <fieldset>
                          <div className="form-group form-group-half">
                            <input type="password" name="password" className="form-control" placeholder="Enter Password" />
                          </div>
                          <div className="form-group form-group-half">
                            <input type="password" name="password_confirm" className="form-control" placeholder="Enter Password Again" />
                          </div>
                          <div className="form-group">
                            <span className="wt-select">
                              <select defaultValue="">
                                <option value="" disabled>Select Reason to Leave</option>
                                <option value="reason1">Reason 1</option>
                                <option value="reason2">Reason 2</option>
                              </select>
                            </span>
                          </div>
                          <div className="form-group">
                            <textarea name="message" className="form-control" placeholder="Description (Optional)"></textarea>
                          </div>
                          <div className="form-group form-group-half float-right">
                            <span className="wt-checkbox">
                              <input id="termsconditions1" type="checkbox" name="unsubscribe" value="1" />
                              <label htmlFor="termsconditions1"><span>Unsubscribe me from all newsletter list</span></label>
                            </span>
                          </div>
                          <div className="form-group form-group-half wt-btnarea">
                            <a href="#!" className="wt-btn">Delete Account</a>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="wt-updatall">
              <i className="ti-announcement"></i>
              <span>Update all the latest changes made by you, by just clicking on “Save &amp; Continue” button.</span>
              <a className="wt-btn" href="#!">Save &amp; Continue</a>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3"></div>
        </div>
      </section>
    </DashboardLayout>
  );
}
