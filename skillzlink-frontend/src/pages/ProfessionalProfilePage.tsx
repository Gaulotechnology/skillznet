import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { publicApi, type PublicProvider } from "../services/api"

export function ProfessionalProfilePage() {
  const { id } = useParams()
  const [pro, setPro] = useState<PublicProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [_error, setError] = useState(false)

  useEffect(() => {
    if (!id) return

    publicApi.getProvider(id)
      .then(res => {
        setPro(res.provider)
        setError(false)
      })
      .catch(() => {
        // Fallback to mock data if API fails
        setError(true)
        setPro({
          id: Number(id),
          name: "Tinashe Moyo (Mock)",
          service_category: "Plumbing",
          rate: "$15.00 / hr",
          location: "Harare, Zimbabwe",
          rating: 4.8,
          reviews: 124,
          image: "/images/profile/img-01.jpg",
          description: "I am an experienced plumber serving the Harare region. With over 10 years in the industry, I handle everything from emergency leaks and burst pipes to full bathroom installations and solar geyser maintenance.",
          skills: ["Pipe Fitting", "Geyser Repair", "Drain Unblocking", "Water Tanks"],
          featured: true,
          premium_badge: true,
          id_verified: true,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '40px', color: '#ff5851' }}></i>
          <p style={{ marginTop: '10px', color: '#888' }}>Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!pro) return null

  // Ensure we have fallback data for arrays if not provided by backend
  const experienceList = pro.experience ?? []
  const skillsList = pro.skills ?? []
  const portfoliosList = pro.portfolios ?? []
  const servicesList = pro.services ?? []
  const reviewsList = pro.client_reviews ?? []

  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder wt-innerbannerholdervtwo">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-main-section wt-paddingtopnull wt-haslayout">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 float-left">
                <div className="wt-userprofileholder">
                  <span className="wt-featuredtag"><img src="/images/featured.png" alt="Verified Member" /></span>
                  
                  {/* Avatar & Basic Info */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-3 float-left">
                    <div className="row">
                      <div className="wt-userprofile">
                        <figure>
                          <img src={pro.image} alt={pro.name} style={{width: '100%', borderRadius: '4px'}} />
                          <div className="wt-userdropdown wt-online"></div>
                        </figure>
                        <div className="wt-title">
                          <h3><i className="fa fa-check-circle"></i> {pro.name}</h3>
                          <span>
                            {pro.rating}/5 <Link to="#/">({pro.reviews} Feedback)</Link> <br />
                            Member since {pro.member_since ?? 'Aug 2023'} <br />
                            <Link to="#/">@{pro.name.toLowerCase().replace(/\s+/g, '')}</Link> <Link to="#/" className="wt-reportuser">Report User</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details & Stats */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-9 float-left">
                    <div className="row">
                      <div className="wt-proposalhead wt-userdetails">
                        <h2>{pro.service_category} Expert</h2>
                        <ul className="wt-userlisting-breadcrumb wt-userlisting-breadcrumbvtwo" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <i className="far fa-money-bill-alt"></i> {pro.rate}
                            </span>
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <img src="/images/flag/img-04.png" alt="flag" style={{width: '16px'}}/> 
                              {pro.location ? pro.location.split(',').pop()?.trim() : 'Zimbabwe'}
                            </span>
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to="#/" className="wt-clicksave" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <i className="fa fa-heart"></i> Save
                            </Link>
                          </li>
                        </ul>
                        <div className="wt-description">
                          <p>{pro.description}</p>
                        </div>
                      </div>
                      <div id="wt-statistics" className="wt-statistics wt-profilecounter">
                        <div className="wt-statisticcontent wt-countercolor1">
                          <h3>{pro.completed_services ?? 0}</h3>
                          <h4>Completed <br />Services</h4>
                        </div>
                        <div className="wt-statisticcontent wt-countercolor2">
                          <h3>{pro.success_rate ?? 100}%</h3>
                          <h4>Success <br />Rate</h4>
                        </div>
                        <div className="wt-statisticcontent wt-countercolor3">
                          <h3>{pro.response_time ?? '2h'}</h3>
                          <h4>Response <br />Time</h4>
                        </div>
                        <div className="wt-description" style={{textAlign: 'right'}}>
                          <a 
                            href={`https://wa.me/${(pro.phone ?? '263770000000').replace(/[^0-9]/g, '')}?text=Hi%20${pro.name},%20I%20found%20you%20on%20SkillzLink.`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="wt-btn"
                            style={{background: '#25D366'}}
                          >
                            <i className="fab fa-whatsapp"></i> Contact on WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div id="wt-twocolumns" className="wt-twocolumns wt-haslayout">
                {/* Left Column: Experience */}
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                  <div className="wt-usersingle">
                    <div className="wt-experience">
                      <div className="wt-usertitle">
                        <h2>Experience</h2>
                      </div>
                      <div className="wt-experiencelisting-hold">
                        {experienceList.length > 0 ? experienceList.map((exp, index) => (
                          <div className={`wt-experiencelisting ${index % 2 === 0 ? 'wt-bgcolor' : ''}`} key={index}>
                            <div className="wt-title">
                              <h3>{exp.title}</h3>
                            </div>
                            <div className="wt-experiencecontent">
                              <ul className="wt-userlisting-breadcrumb">
                                <li><span><i className="far fa-building"></i> {exp.company}</span></li>
                                <li><span><i className="far fa-calendar"></i> {exp.date}</span></li>
                              </ul>
                              <div className="wt-description">
                                <p>“ {exp.desc} ”</p>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="wt-experiencelisting wt-bgcolor">
                            <div className="wt-experiencecontent" style={{padding: '20px'}}>
                              <p>No experience details provided yet.</p>
                            </div>
                          </div>
                        )}
                        <div className="divheight"></div>
                      </div>

                      {/* Portfolio Section */}
                      <div className="wt-userexperience">
                        <div className="wt-projecttitle">
                          <h2>Portfolio & Past Work</h2>
                        </div>
                        <div className="wt-experiencelisting-hold">
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px 0' }}>
                            {portfoliosList.length > 0 ? portfoliosList.map((port, index) => (
                              <div key={index} style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                                <img src={port.image_url} alt={port.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <div style={{ padding: '15px' }}>
                                  <h4 style={{ margin: '0 0 10px', fontSize: '16px' }}>{port.title}</h4>
                                  <p style={{ margin: 0, fontSize: '13px', color: '#767676' }}>{port.description}</p>
                                </div>
                              </div>
                            )) : (
                              <p style={{ color: '#999' }}>No portfolio items provided yet.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Services Section */}
                      <div className="wt-userexperience">
                        <div className="wt-projecttitle">
                          <h2>Services & Pricing</h2>
                        </div>
                        <div className="wt-experiencelisting-hold">
                          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                            {servicesList.length > 0 ? servicesList.map((serv, index) => (
                              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #ddd' }}>
                                <div>
                                  <h4 style={{ margin: '0 0 5px' }}>{serv.name}</h4>
                                  <p style={{ margin: 0, fontSize: '13px', color: '#767676' }}>{serv.description}</p>
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff5851' }}>
                                  ${serv.price.toFixed(2)}
                                </div>
                              </li>
                            )) : (
                              <p style={{ padding: '20px 0', color: '#999' }}>No services listed yet.</p>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Client Reviews Section */}
                      <div className="wt-userexperience">
                        <div className="wt-projecttitle">
                          <h2>Client Reviews</h2>
                        </div>
                        <div className="wt-experiencelisting-hold">
                          {reviewsList.length > 0 ? reviewsList.map((review, index) => (
                            <div className={`wt-experiencelisting ${index % 2 === 0 ? 'wt-bgcolor' : ''}`} key={index}>
                              <div className="wt-experiencecontent" style={{ paddingLeft: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <h4 style={{ margin: 0 }}>{review.reviewer_name}</h4>
                                  <span style={{ color: '#fdd304' }}>
                                    {[...Array(review.rating)].map((_, i) => <i key={i} className="fa fa-star"></i>)}
                                    {[...Array(5 - review.rating)].map((_, i) => <i key={i} className="far fa-star"></i>)}
                                  </span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '10px' }}>{review.date}</span>
                                <div className="wt-description">
                                  <p>“ {review.comment} ”</p>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="wt-experiencelisting wt-bgcolor">
                              <div className="wt-experiencecontent" style={{padding: '20px'}}>
                                <p>No reviews yet.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Right Column: Skills */}
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 float-left">
                  <aside id="wt-sidebar" className="wt-sidebar">
                    <div id="wt-ourskill" className="wt-widget">
                      <div className="wt-widgettitle">
                        <h2>My Skills</h2>
                      </div>
                      <div className="wt-widgetcontent wt-skillscontent">
                        {skillsList.length > 0 ? skillsList.map((skill, index) => (
                          <div className="wt-skillholder" data-percent="100%" key={index}>
                            <span>{skill} <em>100%</em></span>
                            <div className="wt-skillbarholder">
                              <div className="wt-skillbar" style={{width: '100%'}}></div>
                            </div>
                          </div>
                        )) : (
                          <p style={{padding: '10px 20px', color: '#999'}}>No skills added yet.</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="wt-widget wt-sharejob">
                      <div className="wt-widgettitle">
                        <h2>Share This Professional</h2>
                      </div>
                      <div className="wt-widgetcontent">
                        <ul className="wt-socialiconssimple">
                          <li className="wt-facebook"><Link to="#/"><i className="fab fa-facebook-f"></i>Share on Facebook</Link></li>
                          <li className="wt-twitter"><Link to="#/"><i className="fab fa-twitter"></i>Share on Twitter</Link></li>
                          <li className="wt-linkedin"><Link to="#/"><i className="fab fa-whatsapp"></i>Share on WhatsApp</Link></li>
                        </ul>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
