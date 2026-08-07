import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardPostJobPage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-6 float-left">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Post a Job</h2>
              </div>
              <div className="wt-dashboardboxcontent">
                <div className="wt-jobdescription wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Job Description</h2>
                  </div>
                  <form className="wt-formtheme wt-userform wt-userformvtwo">
                    <fieldset>
                      <div className="form-group">
                        <input type="text" name="title" className="form-control" placeholder="Job Title" />
                      </div>
                      <div className="form-group form-group-half wt-formwithlabel">
                        <span className="wt-select">
                          <label htmlFor="serviceLevel">Service Level:</label>
                          <select id="serviceLevel" defaultValue="">
                            <option value="">Professional</option>
                            <option value="entry">Entry Level</option>
                          </select>
                        </span>
                      </div>
                      <div className="form-group form-group-half wt-formwithlabel">
                        <span className="wt-select">
                          <label htmlFor="jobType">Job Type:</label>
                          <select id="jobType" defaultValue="">
                            <option value="">Fixed</option>
                            <option value="hourly">Hourly</option>
                          </select>
                        </span>
                      </div>
                      <div className="form-group form-group-half wt-formwithlabel">
                        <span className="wt-select">
                          <label htmlFor="jobDuration">Job Duration:</label>
                          <select id="jobDuration" defaultValue="">
                            <option value="">02 Weeks</option>
                            <option value="3w">03 Weeks</option>
                          </select>
                        </span>
                      </div>
                      <div className="form-group form-group-half wt-formwithlabel">
                        <span className="wt-select">
                          <label htmlFor="featuredJob">Featured Job:</label>
                          <select id="featuredJob" defaultValue="">
                            <option value="">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </span>
                      </div>
                    </fieldset>
                  </form>
                </div>
                <div className="wt-jobdetails wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Job Details</h2>
                  </div>
                  <form className="wt-formtheme wt-userform wt-userformvtwo">
                    <fieldset>
                      <div className="form-group">
                        <textarea className="wt-tinymceeditor" placeholder="Add Job Detail Here"></textarea>
                      </div>
                    </fieldset>
                  </form>
                </div>
                <div className="wt-jobskills wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Skills Required</h2>
                  </div>
                  <form className="wt-formtheme wt-userform wt-userformvtwo">
                    <fieldset>
                      <div className="form-group">
                        <span className="wt-select">
                          <select defaultValue="">
                            <option value="" disabled>Skills</option>
                            <option value="Website Design">Website Design</option>
                            <option value="PHP">PHP</option>
                            <option value="HTML 5">HTML 5</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="SEO">SEO</option>
                            <option value="Bootstrap">Bootstrap</option>
                          </select>
                        </span>
                      </div>
                      <div className="form-group wt-btnarea">
                        <a href="#!" className="wt-btn">Add Skills</a>
                      </div>
                      <div className="form-group wt-myskills">
                        <ul>
                          <li>
                            <div className="wt-dragdroptool">
                              <a href="#!" className="lnr lnr-menu"></a>
                            </div>
                            <span className="skill-dynamic-html">PHP (<em className="skill-val">90</em>%)</span>
                            <span className="skill-dynamic-field">
                              <input type="text" name="skills[1][percentage]" defaultValue="90" />
                            </span>
                            <div className="wt-rightarea">
                              <a href="#!" className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
                            </div>
                          </li>
                          <li>
                            <div className="wt-dragdroptool"><a href="#!" className="lnr lnr-menu"></a></div>
                            <span className="skill-dynamic-html">Website Design (<em className="skill-val">90</em>%)</span>
                            <span className="skill-dynamic-field">
                              <input type="text" name="skills[1][percentage]" defaultValue="90" />
                            </span>
                            <div className="wt-rightarea">
                              <a href="#!" className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
                            </div>
                          </li>
                          <li>
                            <div className="wt-dragdroptool handle"><a href="#!" className="lnr lnr-menu"></a></div>
                            <span className="skill-dynamic-html">HTML 5 (<em className="skill-val">90</em>%)</span>
                            <span className="skill-dynamic-field">
                              <input type="text" name="skills[1][percentage]" defaultValue="90" />
                            </span>
                            <div className="wt-rightarea">
                              <a href="#!" className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </fieldset>
                  </form>
                </div>
                <div className="wt-attachmentsholder">
                  <div className="wt-tabscontenttitle">
                    <h2>Attachments</h2>
                    <div className="wt-rightarea">
                      <span>Show “Attachments” after hiring</span>
                      <div className="wt-on-off float-right">
                        <input type="checkbox" id="hide-on" name="contact_form" />
                        <label htmlFor="hide-on"><i></i></label>
                      </div>
                    </div>
                  </div>
                  <form className="wt-formtheme wt-formprojectinfo wt-formcategory">
                    <fieldset>
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
                            <span>Wireframe Document.doc</span>
                            <em>File size: 512 kb<a href="#!" className="lnr lnr-cross"></a></em>
                          </li>
                          <li>
                            <span className="uploadprogressbar"></span>
                            <span>Requirments.pdf</span>
                            <em>File size: 110 kb<a href="#!" className="lnr lnr-cross"></a></em>
                          </li>
                          <li className="wt-uploaded">
                            <span className="uploadprogressbar"></span>
                            <span>Company Intro.docx</span>
                            <em>File size: 224 kb<a href="#!" className="lnr lnr-cross"></a></em>
                          </li>
                        </ul>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
            <div className="wt-updatall">
              <i className="ti-announcement"></i>
              <span>Post job by just clicking on “Post Job Now” button.</span>
              <a className="wt-btn" href="#!">Post Job Now</a>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
