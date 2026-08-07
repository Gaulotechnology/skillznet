import React from 'react';

export const ArticleGridPage: React.FC = () => {
  return (
    <>
      {/* Inner Home Banner Start */}
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>New Articles</h2></div>
                <ol className="wt-breadcrumb">
                  <li><a href="/">Home</a></li>
                  <li className="wt-active">Articles Grid</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Inner Home End */}
      
      {/* Main Start */}
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        {/* Categories Start */}
        <div className="wt-haslayout wt-main-section">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 float-left">
                <div className="wt-articletabshold">
                  <ul className="wt-navarticletab nav navbar-nav">
                    <li className="nav-item">
                      <a className="active" id="all-tab" data-toggle="tab" href="#alltab">All</a>
                    </li>
                    <li className="nav-item">
                      <a id="business-tab" data-toggle="tab" href="#business">Business</a>
                    </li>
                    <li className="nav-item">
                      <a id="trading-tab" data-toggle="tab" href="#trading">Trading</a>
                    </li>
                    <li className="nav-item">
                      <a id="economics-tab" data-toggle="tab" href="#economics">Economics</a>
                    </li>
                    <li className="nav-item">
                      <a id="marketing-tab" data-toggle="tab" href="#marketing">Marketing</a>
                    </li>
                  </ul>
                  <div className="tab-content wt-haslayout">
                    <div className="wt-contentarticle tab-pane active fade show" id="alltab">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div className="wt-article">
                            <figure>
                              <img src="/images/article/img-01.jpg" alt="img description" />
                            </figure>
                            <div className="wt-articlecontent">
                              <div className="wt-title">
                                <h2>Who Else Wants To Be Successful With Business</h2>
                              </div>
                              <ul className="wt-postarticlemeta">
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-clock"></i>
                                    <span>June 27, 2018</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-user"></i>
                                    <span>Marina Groth</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div className="wt-article">
                            <figure>
                              <img src="/images/article/img-02.jpg" alt="img description" />
                            </figure>
                            <div className="wt-articlecontent">
                              <div className="wt-title">
                                <h2>20 Top Tips For Business</h2>
                              </div>
                              <ul className="wt-postarticlemeta">
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-clock"></i>
                                    <span>June 27, 2018</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-user"></i>
                                    <span>Louanne Mattioli</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div className="wt-article">
                            <figure>
                              <img src="/images/article/img-03.jpg" alt="img description" />
                            </figure>
                            <div className="wt-articlecontent">
                              <div className="wt-title">
                                <h2>7 Ways To Keep Your Business Growing Without Burning The Midnight Oil</h2>
                              </div>
                              <ul className="wt-postarticlemeta">
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-clock"></i>
                                    <span>June 27, 2018</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-user"></i>
                                    <span>Soraya Roloff</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div className="wt-article">
                            <figure>
                              <img src="/images/article/img-04.jpg" alt="img description" />
                            </figure>
                            <div className="wt-articlecontent">
                              <div className="wt-title">
                                <h2>Clear And Unbiased Facts About Business (Without All the Hype)</h2>
                              </div>
                              <ul className="wt-postarticlemeta">
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-clock"></i>
                                    <span>June 27, 2018</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-user"></i>
                                    <span>Florentino Norsworthy</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div className="wt-article">
                            <figure>
                              <img src="/images/article/img-05.jpg" alt="img description" />
                            </figure>
                            <div className="wt-articlecontent">
                              <div className="wt-title">
                                <h2>Business And Love Have 4 Things In Common</h2>
                              </div>
                              <ul className="wt-postarticlemeta">
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-clock"></i>
                                    <span>June 27, 2018</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-user"></i>
                                    <span>Jasper Kinney</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div className="wt-article">
                            <figure>
                              <img src="/images/article/img-06.jpg" alt="img description" />
                            </figure>
                            <div className="wt-articlecontent">
                              <div className="wt-title">
                                <h2>BUSINESS 2.0 - The Next Step</h2>
                              </div>
                              <ul className="wt-postarticlemeta">
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-clock"></i>
                                    <span>June 27, 2018</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#!">
                                    <i className="lnr lnr-user"></i>
                                    <span>Kaye Medley</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <nav className="wt-pagination">
                      <ul>
                        <li className="wt-prevpage"><a href="#!"><i className="lnr lnr-chevron-left"></i></a></li>
                        <li><a href="#!"><i className="fa fa-th"></i></a></li>
                        <li className="wt-nextpage"><a href="#!"><i className="lnr lnr-chevron-right"></i></a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Categories End */}
      </main>
      {/* Main End */}
    </>
  );
};
