import { MainLayout } from "../layouts/MainLayout";

export function ServiceQuotePage() {
  return (
    <MainLayout>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Service Proposal</h2></div>
                <ol className="wt-breadcrumb">
                  <li><a href="/">Home</a></li>
                  <li><a href="/services">Services</a></li>
                  <li><a href="/service-single">Service Detail</a></li>
                  <li className="wt-active">Service Proposal</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 push-lg-2">
                <div className="wt-jobalertsholder">
                  <ul className="wt-jobalerts">
                    <li className="alert alert-warning alert-dismissible fade show">
                      <span><em>Alert:</em> You’ve consumed all you points to apply new service,</span>
                      <a href="#!" className="wt-alertbtn warning">Buy Now</a>
                      <a href="#!" className="close" data-dismiss="alert" aria-label="Close"><i className="fa fa-close"></i></a>
                    </li>
                    <li className="alert alert-primary alert-dismissible fade show">
                      <span><em>info: </em> You’ve no skills of “PHP” but still you can apply for this service.</span>
                      <a href="#!" className="wt-alertbtn primary">View</a>
                      <a href="#!" className="close" data-dismiss="alert" aria-label="Close"><i className="fa fa-close"></i></a>
                    </li>
                  </ul>
                </div>
                <div className="wt-proposalholder">
                  <span className="wt-featuredtag"><img src="/images/featured.png" alt="img description" data-tipso="Plus Member" className="template-content tipso_style" /></span>
                  <div className="wt-proposalhead">
                    <h2>Webpage Takes Many Seconds to Load, I Want to Reduce it </h2>
                    <ul className="wt-userlisting-breadcrumb wt-userlisting-breadcrumbvtwo">
                      <li><span><i className="fa fa-dollar-sign"></i><i className="fa fa-dollar-sign"></i><i className="fa fa-dollar-sign"></i> Professional</span></li>
                      <li><span><img src="/images/flag/img-02.png" alt="img description" />  United States</span></li>
                      <li><span><i className="far fa-folder"></i> Type: Fixed</span></li>
                      <li><span><i className="far fa-clock"></i> Duration: 15 Days</span></li>
                    </ul>
                  </div>
                </div>
                <div className="wt-proposalamount-holder">
                  <div className="wt-title">
                    <h2>Proposal Amount</h2>
                  </div>
                  <div className="wt-proposalamount accordion">
                    <div className="form-group">
                      <span>( <i className="fa fa-dollar-sign"></i> )</span>
                      <input type="number" name="amount" className="form-control" placeholder="Enter Your Proposal Amount" />
                      <a href="#!" className="collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"><i className="lnr lnr-chevron-up"></i></a>
                      <em>Total amount the client will see on your proposal</em>
                    </div>
                    <ul className="wt-totalamount collapse show" id="collapseOne">
                      <li>
                        <h3>( <i className="fa fa-dollar-sign"></i> ) <em>- 00.00</em></h3>
                        <span><strong>“ Worktern ”</strong> Service Fee</span>
                      </li>
                      <li>
                        <h3>( <i className="fa fa-dollar-sign"></i> ) <em>- 00.00</em></h3>
                        <span>Amount You’ll Recive after <strong>“ Worktern ”</strong> Service Fee deduction</span>
                      </li>
                    </ul>
                  </div>
                  <form className="wt-formtheme wt-formproposal">
                    <fieldset>
                      <div className="form-group">
                        <span className="wt-select">
                          <select defaultValue="1">
                            <option value="1">I Can Finish This Project In: 01 Months</option>
                            <option value="2">I Can Finish This Project In: 02 Months</option>
                            <option value="3">I Can Finish This Project In: 03 Months</option>
                            <option value="4">I Can Finish This Project In: 04 Months</option>
                          </select>
                        </span>
                      </div>
                      <div className="form-group">
                        <textarea className="form-control" placeholder="Add Description*"></textarea>
                      </div>
                    </fieldset>
                    <fieldset>
                      <div className="wt-attachments wt-attachmentsvtwo">
                        <div className="wt-title">
                          <h3>Upload File (Optional)</h3>
                          <label htmlFor="afile">
                            <span><i className="lnr lnr-link"></i> Attach File(s)</span>
                            <input type="file" name="file" id="afile" />
                          </label>
                        </div>
                        <ul className="wt-attachfile">
                          <li className="wt-uploading">
                            <span>Logo.jpg</span>
                            <em>File size: 300 kb<a href="#!" className="lnr lnr-trash"></a></em>
                          </li>
                          <li>
                            <span>Requirments.pdf</span>
                            <em>File size: 110 kb<a href="#!" className="lnr lnr-trash"></a></em>
                          </li>
                        </ul>
                        <div className="wt-btnarea">
                          <a href="#!" className="wt-btn">Send Now</a>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
