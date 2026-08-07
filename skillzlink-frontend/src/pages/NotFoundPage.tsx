import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <>
      {/* Inner Home Banner Start */}
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>404 Error</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">404 Error</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Inner Home End */}

      {/* Main Start */}
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-xs-12 col-sm-12 col-md-10 push-md-1 col-lg-8 push-lg-2">
                <div className="wt-404errorpage">
                  <figure className="wt-404errorimg">
                    <img src="/images/404-img.jpg" alt="404 Error" />
                  </figure>
                  <div className="wt-404errorcontent">
                    <div className="wt-title">
                      <h3>Link Might Crashed or Not Working!</h3>
                    </div>
                    <div className="wt-description">
                      <p>
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
                        Go back to <Link to="/">Homepage</Link>
                      </p>
                    </div>
                    <form className="wt-formtheme wt-formhelpsearch" action="/search">
                      <fieldset>
                        <div className="form-group">
                          <input type="text" name="q" className="form-control" placeholder="Searching Might Help" />
                          <button type="submit" className="wt-btnsearch">Search Now</button>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Main End */}
    </>
  );
}
