import { Link } from "react-router-dom"

export function HowItWorksPage() {
  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>How It Works</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">How It Works</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">

          {/* For Seekers / Customers */}
          <section className="wt-haslayout" style={{ paddingTop: '60px' }}>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
                  <div className="wt-sectionhead wt-textcenter">
                    <div className="wt-sectiontitle">
                      <h2>I Need a Professional</h2>
                      <span>Hire the best talent in your city in 3 simple steps</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row" style={{ marginTop: '40px' }}>
                {/* Step 1 */}
                <div className="col-12 col-sm-12 col-md-4 col-lg-4" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="lnr lnr-magnifier" style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>1. Search & Filter</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Browse our directory of verified professionals. Filter by city, service category, or price range to find the perfect match.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="col-12 col-sm-12 col-md-4 col-lg-4" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="lnr lnr-user" style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>2. Review Profiles</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Check out their past work, read reviews from other Zimbabweans, and verify their ID status before making contact.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="col-12 col-sm-12 col-md-4 col-lg-4" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="fab fa-whatsapp" style={{ fontSize: '36px', color: '#25D366', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>3. Chat on WhatsApp</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Click the WhatsApp button to instantly message the professional. Negotiate, share photos, and get the job done.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WhatsApp Banner */}
          <section className="wt-haslayout" style={{ padding: '60px 0', background: '#f8f9fa' }}>
            <div className="container">
              <div className="row items-center">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 float-left">
                  <div className="wt-greetingcontent">
                    <div className="wt-sectionhead">
                      <div className="wt-sectiontitle">
                        <h2>No App Required</h2>
                        <span style={{ color: '#25D366' }}>Connect seamlessly on WhatsApp</span>
                      </div>
                      <div className="wt-description">
                        <p>
                          We believe getting things done shouldn't require downloading another app. That's why SkillzLink connects you directly to professionals via WhatsApp — the app you already use every day.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="lnr lnr-checkmark" style={{ color: '#25D366', fontWeight: 'bold' }} /> Instant notifications and messages
                          </li>
                          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="lnr lnr-checkmark" style={{ color: '#25D366', fontWeight: 'bold' }} /> Share location and photos easily
                          </li>
                          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="lnr lnr-checkmark" style={{ color: '#25D366', fontWeight: 'bold' }} /> Save data by using WhatsApp bundles
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="lnr lnr-checkmark" style={{ color: '#25D366', fontWeight: 'bold' }} /> Keep all your conversations in one place
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 float-left" style={{ textAlign: 'center' }}>
                  <img
                    src="/images/whatsapp-mobile.png"
                    alt="WhatsApp Integration"
                    style={{ maxWidth: '300px', display: 'inline-block' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* For Professionals */}
          <section className="wt-haslayout" style={{ padding: '60px 0' }}>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
                  <div className="wt-sectionhead wt-textcenter">
                    <div className="wt-sectiontitle">
                      <h2>I am a Professional</h2>
                      <span>Grow your business and get more clients on SkillzLink</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row" style={{ marginTop: '40px' }}>
                {/* Step A */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-3" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="lnr lnr-laptop-phone" style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>1. Create Profile</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Sign up with your phone number, add your service category, set your radius, and write a bio.
                    </p>
                  </div>
                </div>

                {/* Step B */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-3" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="lnr lnr-license" style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>2. Get Verified</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Provide your National ID. Once verified, you'll receive a badge that boosts trust.
                    </p>
                  </div>
                </div>

                {/* Step C */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-3" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="lnr lnr-bubble" style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>3. Receive Leads</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Clients find you in the directory and message you directly on WhatsApp to negotiate.
                    </p>
                  </div>
                </div>

                {/* Step D */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-3" style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#fff', borderRadius: '10px', padding: '32px 24px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                  }}>
                    <i className="lnr lnr-star" style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>4. Build Reputation</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                      Complete jobs successfully, collect 5-star reviews, and rank higher in search results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="wt-haslayout" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #764ba2 100%)', padding: '60px 0' }}>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8" style={{ textAlign: 'center' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
                    Ready to get started?
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', fontSize: '16px' }}>
                    Join thousands of Zimbabweans already using SkillzLink to get things done.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <Link to="/register" className="wt-btn" style={{ background: '#ff5851', border: 'none' }}>
                      Create Free Account
                    </Link>
                    <Link to="/nearby-professionals" className="wt-btn" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)' }}>
                      Find a Professional
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
