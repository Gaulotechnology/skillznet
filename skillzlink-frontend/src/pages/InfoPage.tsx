import { Link } from "react-router-dom"

interface InfoPageProps {
  title: string
  breadcrumb: string
  subtitle: string
  sections: Array<{
    heading: string
    content: string[]
  }>
  quickLinks?: Array<{
    label: string
    to: string
  }>
}

export function InfoPage({ title, breadcrumb, subtitle, sections, quickLinks = [] }: InfoPageProps) {
  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title">
                  <h2>{title}</h2>
                </div>
                <ol className="wt-breadcrumb">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li className="wt-active">{breadcrumb}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                <div className="wt-submitreportholder wt-bgwhite">
                  <div className="wt-titlebar">
                    <h2>{subtitle}</h2>
                  </div>
                  <div className="wt-reportdescription">
                    {sections.map((section) => (
                      <div key={section.heading}>
                        <div className="wt-title">
                          <h3>{section.heading}</h3>
                        </div>
                        <div className="wt-description">
                          {section.content.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                <aside className="wt-sidebar">
                  <div className="wt-widget wt-effectiveholder">
                    <div className="wt-widgettitle">
                      <h2>Quick Navigation</h2>
                    </div>
                    <div className="wt-widgetcontent">
                      <ul className="wt-effectivecontent">
                        {quickLinks.map((link) => (
                          <li key={link.to}>
                            <Link to={link.to}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
