import { DashboardLayout } from "../../../components/layout/DashboardLayout";

export function DashboardOngoingServiceSinglePage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-9">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Service Details</h2>
              </div>
              <div className="wt-dashboardboxcontent wt-jobdetailsholder">
                <div className="wt-freelancerholder wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Hired Provider</h2>
                  </div>
                  <div className="wt-jobdetailscontent">
                    <div className="wt-userlistinghold wt-featured wt-userlistingvtwo">
                      <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                      <div className="wt-userlistingcontent">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <a href="/usersingle"><i className="fa fa-check-circle"></i> Alfredo Bossard</a>
                            <h2>Classifieds Posting, Data Entry, Typing</h2>
                          </div>
                          <ul className="wt-userlisting-breadcrumb">
                            <li><span><i className="far fa-money-bill-alt"></i> $44.00 / hr</span></li>
                            <li><span><img src="/images/flag/img-02.png" alt="img description" />  United States</span></li>
                            <li><a href="#!" className="wt-clicksave"><i className="fa fa-heart"></i> Save</a></li>
                          </ul>
                        </div>
                        <div className="wt-rightarea">
                          <div className="wt-hireduserstatus">
                            <h4>Hired</h4><span>Terrence Tynan</span>
                            <ul className="wt-hireduserimgs">
                              <li><figure><img src="/images/user/userlisting/img-01.jpg" alt="img description" /></figure></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wt-rcvproposalholder wt-hiredfreelancer wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Hired Provider</h2>
                  </div>
                  <div className="wt-jobdetailscontent">
                    <div className="wt-userlistinghold wt-featured wt-proposalitem">
                      <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style mCS_img_loaded" /></span>
                      <figure className="wt-userlistingimg">
                        <img src="/images/user/userlisting/img-01.jpg" alt="image description" className="mCS_img_loaded" />
                      </figure>
                      <div className="wt-proposaldetails">
                        <div className="wt-contenthead">
                          <div className="wt-title">
                            <a href="/usersingle"> Alfredo Bossard</a>
                          </div>
                        </div>
                        <div className="wt-proposalfeedback">
                          <span className="wt-starsvtwo">
                            <i className="fa fa-star fill"></i>
                          </span>
                          <span className="wt-starcontent"> 4.5/<i>5</i> <em> (860 Feedback)</em></span>
                        </div>
                      </div>
                      <div className="wt-rightarea wt-titlewithsearch">
                        <form className="wt-formtheme wt-formsearch">
                          <fieldset>
                            <div className="form-group">
                              <span className="wt-select">
                                <select defaultValue="">
                                  <option value="" disabled>Project Status</option>
                                  <option value="1">Project Status 1</option>
                                  <option value="2">Project Status 2</option>
                                </select>
                              </span>
                              <a href="#!" className="wt-searchgbtn"><i className="fa fa-check"></i></a>
                            </div>
                          </fieldset>
                        </form>
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
                  </div>
                </div>
                <div className="wt-projecthistory">
                  <div className="wt-tabscontenttitle">
                    <h2>Project History</h2>
                  </div>
                  <div className="wt-historycontent">
                    <ul id="accordion" className="wt-historycontentcol">
                      <li className="wt-historycolhead">
                        <h3><span>Date</span><span>Message</span><span>Attachment</span></h3>
                      </li>
                      <li className="collapsed">
                        <div className="wt-dateandmsg">
                          <span><img src="/images/user/ongoing/img-01.jpg" alt="img description" />Jun 27, 2019</span>
                          <span>Consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim sed</span>
                        </div>
                        <div className="wt-rightarea wt-msgbtns">
                          <a href="#!" className="wt-btn wt-msgbtn"><i className="lnr lnr-chevron-up"></i>Message</a>
                          <a href="#!" className="wt-btn wt-attachmentbtn"><i className="lnr lnr-download"></i>Attachment</a>
                        </div>
                      </li>
                    </ul>
                    <form className="wt-formtheme wt-userform">
                      <fieldset>
                        <div className="form-group">
                          <textarea id="wt-tinymceeditor" className="wt-tinymceeditor" placeholder="Add Service Detail Here"></textarea>
                        </div>
                        <div className="form-group form-group-label">
                          <div className="wt-labelgroup">
                            <label htmlFor="file">
                              <span className="wt-btn">Select Files</span>
                              <input type="file" name="file" id="file" />
                            </label>
                            <span>Drop files here to upload</span>
                            <em className="wt-fileuploading">Uploading<i className="fa fa-spinner fa-spin"></i></em>
                          </div>
                        </div>
                        <div className="form-group">
                          <ul className="wt-attachfile">
                            <li className="wt-uploading">
                              <span className="uploadprogressbar"></span>
                              <span>Category Icon.jpg</span>
                              <em>File size: 450 kb<a href="#!" className="lnr lnr-cross"></a></em>
                            </li>
                            <li>
                              <span className="uploadprogressbar"></span>
                              <span>requirments.pdf</span>
                              <em>File size: 300 kb<a href="#!" className="lnr lnr-cross"></a></em>
                            </li>
                          </ul>
                        </div>
                        <div className="form-group wt-btnarea">
                          <a href="#!" className="wt-btn">Send Now</a>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
