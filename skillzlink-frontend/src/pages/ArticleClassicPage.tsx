import React from 'react';

export const ArticleClassicPage: React.FC = () => {
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
                  <li className="wt-active">Articles Classic</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Inner Home End */}
      
      {/* Main Start */}
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        {/* Two Columns Start */}
        <div className="wt-haslayout wt-main-section">
          <div className="container">
            <div className="row">
              <div id="wt-twocolumns" className="wt-twocolumns wt-haslayout">
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 float-left">
                  <aside id="wt-sidebar" className="wt-sidebar">
                    <div className="wt-widget wt-startsearch">
                      <div className="wt-widgettitle">
                        <h2>Start Your Search</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <form className="wt-formtheme wt-formsearch">
                          <fieldset>
                            <div className="form-group">
                              <input type="text" name="Search" className="form-control" placeholder="Search Company" />
                              <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                            </div>
                          </fieldset>
                        </form>
                      </div>
                    </div>
                    <div className="wt-widget wt-categoriesholder">
                      <div className="wt-widgettitle">
                        <h2>Categories</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <ul className="wt-categoriescontent">
                          <li><a href="#!">PSD Web Template <em>15325</em></a></li>
                          <li><a href="#!">PHP Development <em>562748</em></a></li>
                          <li><a href="#!">HTML Themes <em>3488</em></a></li>
                          <li><a href="#!">Global Networking <em>86452</em></a></li>
                          <li><a href="#!">Online SEO  <em>325</em></a></li>
                          <li><a href="#!">All <em>886548</em></a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="wt-widget wt-widgetarticlesholder">
                      <div className="wt-widgettitle">
                        <h2>Popular Articles</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <div className="wt-particlehold">
                          <figure>
                            <img src="/images/thumbnail/img-01.jpg" alt="img description" />
                          </figure>
                          <div className="wt-particlecontent">
                            <h3><a href="#!">10 Mesmerizing Examples Of Business</a></h3>
                            <span><i className="lnr lnr-clock"></i> Jun 27, 2018</span>
                          </div>
                        </div>
                        <div className="wt-particlehold">
                          <figure>
                            <img src="/images/thumbnail/img-02.jpg" alt="img description" />
                          </figure>
                          <div className="wt-particlecontent">
                            <h3><a href="#!">Introducing The Simple Way To Business</a></h3>
                            <span><i className="lnr lnr-clock"></i> Jun 27, 2018</span>
                          </div>
                        </div>
                        <div className="wt-particlehold">
                          <figure>
                            <img src="/images/thumbnail/img-03.jpg" alt="img description" />
                          </figure>
                          <div className="wt-particlecontent">
                            <h3><a href="#!">7 Practical Tactics to Turn Business Into a Sales Hub</a></h3>
                            <span><i className="lnr lnr-clock"></i> Jun 27, 2018</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="wt-widget wt-widgettagshold">
                      <div className="wt-widgettitle">
                        <h2>Frequent Tags</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <div className="wt-widgettag">
                          <a href="#!">Electronics</a>
                          <a href="#!">DIY</a>
                          <a href="#!">Superism</a>
                          <a href="#!">Business</a>
                          <a href="#!">Development</a>
                          <a href="#!">Collaboration</a>
                          <a href="#!">Decent</a>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
                
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                  <div className="wt-classicaricle-holder">
                    <div className="wt-classicaricle-header">
                      <div className="wt-title">
                        <h2>Our Latest Articles</h2>
                      </div>
                      <div className="wt-description">
                        <p>Consectetur adipisicing elit sed dotem eiusmod tempor incunetion labore etdolore maigna aliqua enim poskina ilukita ylokem lokateise ination.</p>
                      </div>
                    </div>
                    <div className="wt-article-holder">
                      <div className="wt-article">
                        <figure>
                          <img src="/images/article/classic/img-01.jpg" alt="img description" />
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
                      <div className="wt-article">
                        <figure>
                          <img src="/images/article/classic/img-02.jpg" alt="img description" />
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
                      <div className="wt-article">
                        <figure>
                          <img src="/images/article/classic/img-03.jpg" alt="img description" />
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
                                <span>Soraya Roloff</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="wt-article">
                        <figure>
                          <img src="/images/article/classic/img-04.jpg" alt="img description" />
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
                                <span>Florentino Norsworthy</span>
                              </a>
                            </li>
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
        {/* Two Columns End */}
      </main>
      {/* Main End */}
    </>
  );
};
