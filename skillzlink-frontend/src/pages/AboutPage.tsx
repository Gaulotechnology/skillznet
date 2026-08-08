import { Link } from "react-router-dom"

const TEAM = [
  {
    name: "Tinashe Moyo",
    role: "Co-Founder & CEO",
    bio: "Harare native passionate about closing the skills gap in Zimbabwe. Former software engineer turned entrepreneur.",
    img: "/images/team/team-tinashe.jpg",
  },
  {
    name: "Chipo Ndlovu",
    role: "Head of Marketing",
    bio: "Brand strategist with 6 years experience in Zimbabwean digital markets. Leads growth and community.",
    img: "/images/team/team-chipo.jpg",
  },
  {
    name: "Tafadzwa Chigumba",
    role: "Lead Engineer",
    bio: "Full-stack developer from Bulawayo building the technology that powers SkillzLink's WhatsApp integrations.",
    img: "/images/team/team-tafadzwa.jpg",
  },
  {
    name: "Rudo Makoni",
    role: "Head of Operations",
    bio: "Operations expert ensuring every professional on SkillzLink is vetted, verified, and ready to serve Zimbabwe.",
    img: "/images/team/team-rudo.jpg",
  },
]

const VALUES = [
  { icon: "lnr lnr-shield", title: "Trust & Verification", desc: "Every professional is background-checked and ID-verified before joining the platform." },
  { icon: "lnr lnr-map-marker", title: "Proudly Zimbabwean", desc: "Built in Harare for Zimbabwe — we understand local needs, culture, and challenges." },
  { icon: "fab fa-whatsapp", title: "WhatsApp-First", desc: "No extra apps. Hire professionals directly through WhatsApp — where Zimbabwe already connects." },
  { icon: "lnr lnr-star", title: "Quality Always", desc: "Transparent reviews and star ratings keep standards high and professionals accountable." },
]

export function AboutPage() {
  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>About SkillzLink</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">About Us</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">

          {/* Mission Section */}
          <section className="wt-haslayout" style={{ paddingTop: '60px' }}>
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-7 float-left">
                  <div className="wt-greetingcontent">
                    <div className="wt-sectionhead">
                      <div className="wt-sectiontitle">
                        <h2>Connecting Zimbabwe's Talent</h2>
                        <span>Empowering Local Professionals Since 2024</span>
                      </div>
                      <div className="wt-description">
                        <p>
                          SkillzLink was born in Harare with a simple mission: make it easy for Zimbabweans to find
                          trusted, local professionals — and for those professionals to grow their income. Whether you
                          need a plumber in Borrowdale or a tutor in Chitungwiza, we connect you in minutes via WhatsApp.
                        </p>
                        <p>
                          We are building Zimbabwe's first WhatsApp-integrated services marketplace — no app downloads,
                          no complicated sign-ups. Just message, hire, and get the job done.
                        </p>
                      </div>
                    </div>
                    <div id="wt-statistics" className="wt-statistics">
                      <div className="wt-statisticcontent wt-countercolor1">
                        <h3>2,400+</h3>
                        <h4>Verified Pros</h4>
                      </div>
                      <div className="wt-statisticcontent wt-countercolor2">
                        <h3>8</h3>
                        <h4>Cities Covered</h4>
                      </div>
                      <div className="wt-statisticcontent wt-countercolor3">
                        <h3>98%</h3>
                        <h4>Satisfaction Rate</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-5 float-left">
                  <div className="wt-greetingvideo">
                    <figure>
                      <img
                        src="/images/about-hero.jpg"
                        alt="Zimbabwean professional plumber on a job in Harare"
                        style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="wt-haslayout" style={{ padding: '60px 0', background: '#f8f9fa' }}>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
                  <div className="wt-sectionhead wt-textcenter">
                    <div className="wt-sectiontitle">
                      <h2>Our Values</h2>
                      <span>What Drives Every Decision We Make</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: '40px' }}>
                {VALUES.map(v => (
                  <div key={v.title} className="col-12 col-sm-6 col-md-6 col-lg-3" style={{ marginBottom: '30px' }}>
                    <div style={{
                      background: '#fff', borderRadius: '10px', padding: '32px 24px',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.07)', height: '100%', textAlign: 'center',
                    }}>
                      <i className={v.icon} style={{ fontSize: '36px', color: '#ff5851', marginBottom: '16px', display: 'block' }} />
                      <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a2e' }}>{v.title}</h3>
                      <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Meet the Team */}
          <section className="wt-haslayout" style={{ padding: '60px 0' }}>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
                  <div className="wt-sectionhead wt-textcenter">
                    <div className="wt-sectiontitle">
                      <h2>Meet the Team</h2>
                      <span>The Zimbabweans Building SkillzLink</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: '40px' }}>
                {TEAM.map(member => (
                  <div key={member.name} className="col-12 col-sm-6 col-md-6 col-lg-3" style={{ marginBottom: '30px' }}>
                    <div style={{
                      background: '#fff', borderRadius: '10px', overflow: 'hidden',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.08)', textAlign: 'center',
                    }}>
                      <img
                        src={member.img}
                        alt={member.name}
                        style={{ width: '100%', height: '240px', objectFit: 'cover', objectPosition: 'top' }}
                      />
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>{member.name}</h3>
                        <span style={{ fontSize: '13px', color: '#ff5851', fontWeight: 600, display: 'block', marginBottom: '10px' }}>{member.role}</span>
                        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: 0 }}>{member.bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="wt-haslayout" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #764ba2 100%)', padding: '60px 0' }}>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8" style={{ textAlign: 'center' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
                    Ready to Join Zimbabwe's #1 Skills Platform?
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', fontSize: '16px' }}>
                    Whether you're a homeowner needing help or a skilled professional seeking clients — SkillzLink is for you.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <Link to="/register" className="wt-btn" style={{ background: '#ff5851', border: 'none' }}>
                      Join as a Professional
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
