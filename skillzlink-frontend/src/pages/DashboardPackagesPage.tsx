import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardPackagesPage() {
  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 float-left">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Packages</h2>
              </div>
              <div className="wt-dashboardboxcontent wt-packages">
                <div className="wt-package wt-packagedetails">
                  <div className="wt-packagehead">
                  </div>
                  <div className="wt-packagecontent">
                    <ul className="wt-packageinfo">
                      <li className="wt-packageprices"><span>Price</span></li>
                      <li><span>No. Of Offer To Post</span></li>
                      <li><span>No. Of Featured Jobs</span></li>
                      <li><span>Package Duration</span></li>
                      <li><span>Best Freelancer Search</span></li>
                      <li><span>Professional Offer Template</span></li>
                      <li><span>Free 07 Days Extension</span></li>
                    </ul>
                  </div>
                </div>
                <div className="wt-package wt-baiscpackage">
                  <div className="wt-packagehead">
                    <h3>Basic Plan</h3>
                    <span>Starter Plan For Newbie</span>
                  </div>
                  <div className="wt-packagecontent">
                    <ul className="wt-packageinfo">
                      <li className="wt-packageprice"><span><sup>$</sup>37<sub>\ Month</sub></span></li>
                      <li><span>10</span></li>
                      <li><span><i className="ti-na"></i></span></li>
                      <li><span>30 Days</span></li>
                      <li><span><i className="ti-check"></i></span></li>
                      <li><span><i className="ti-na"></i></span></li>
                      <li><span><i className="ti-na"></i></span></li>
                    </ul>
                    <a className="wt-btn" href="#!"><span>Buy Now</span></a>
                  </div>
                </div>
                <div className="wt-package wt-standardpackage">
                  <div className="wt-packagehead">
                    <span className="wt-featuredtag"><i className="fa fa-star"></i></span>
                    <h3>Standard</h3>
                    <span>Popular Plan For Professionals</span>
                    <em>24 Days Left</em>
                  </div>
                  <div className="wt-packagecontent">
                    <ul className="wt-packageinfo">
                      <li className="wt-packageprice"><span><sup>$</sup>79<sub>\ Month</sub></span></li>
                      <li><span>30</span></li>
                      <li><span><i className="ti-check"></i></span></li>
                      <li><span>30 Days</span></li>
                      <li><span><i className="ti-check"></i></span></li>
                      <li><span><i className="ti-na"></i></span></li>
                      <li><span><i className="ti-na"></i></span></li>
                    </ul>
                    <a className="wt-btn" href="#!"><span>Buy Now</span></a>
                  </div>
                </div>
                <div className="wt-package wt-extendedpackage">
                  <div className="wt-packagehead">
                    <h3>Extended</h3>
                    <span>Extended Plan For Managerial</span>
                  </div>
                  <div className="wt-packagecontent">
                    <ul className="wt-packageinfo">
                      <li className="wt-packageprice"><span><sup>$</sup>199<sub>\ Month</sub></span></li>
                      <li><span>Unlimited</span></li>
                      <li><span><i className="ti-check"></i></span></li>
                      <li><span>30 Days</span></li>
                      <li><span><i className="ti-check"></i></span></li>
                      <li><span><i className="ti-check"></i></span></li>
                      <li><span><i className="ti-check"></i></span></li>
                    </ul>
                    <a className="wt-btn" href="#!"><span>Buy Now</span></a>
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
