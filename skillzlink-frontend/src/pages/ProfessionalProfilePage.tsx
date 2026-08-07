import { useParams, Link } from "react-router-dom"

export function ProfessionalProfilePage() {
  const { id } = useParams()

  // Mock data for the profile
  const pro = {
    id: id || "1",
    name: "Tinashe Moyo",
    category: "Plumbing",
    rate: "$15.00 / hr",
    location: "Harare, Zimbabwe",
    rating: 4.8,
    reviews: 124,
    memberSince: "Aug 2023",
    username: "@tinashemoyo",
    image: "/images/profile/img-01.jpg",
    description: "I am an experienced plumber serving the Harare region. With over 10 years in the industry, I handle everything from emergency leaks and burst pipes to full bathroom installations and solar geyser maintenance.",
    skills: [
      { name: "Pipe Fitting", percent: "90%" },
      { name: "Geyser Repair", percent: "95%" },
      { name: "Drain Unblocking", percent: "85%" },
      { name: "Water Tanks", percent: "80%" },
    ],
    experience: [
      {
        title: "Senior Plumber",
        company: "Moyo Plumbing Solutions",
        date: "Jan 2018 - Present",
        desc: "Running a successful independent plumbing business covering residential and commercial properties in Harare."
      },
      {
        title: "Maintenance Technician",
        company: "City Properties",
        date: "Mar 2015 - Dec 2017",
        desc: "Responsible for preventative and emergency maintenance of water systems in large residential complexes."
      }
    ]
  }

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
                            Member since {pro.memberSince} <br />
                            <Link to="#/">{pro.username}</Link> <Link to="#/" className="wt-reportuser">Report User</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details & Stats */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-9 float-left">
                    <div className="row">
                      <div className="wt-proposalhead wt-userdetails">
                        <h2>{pro.category} Expert</h2>
                        <ul className="wt-userlisting-breadcrumb wt-userlisting-breadcrumbvtwo">
                          <li><span><i className="far fa-money-bill-alt"></i> {pro.rate}</span></li>
                          <li><span><img src="/images/flag/img-04.png" alt="flag" style={{width: '16px', marginRight: '5px'}}/> {pro.location}</span></li>
                          <li><Link to="#/" className="wt-clicksave"><i className="fa fa-heart"></i> Save</Link></li>
                        </ul>
                        <div className="wt-description">
                          <p>{pro.description}</p>
                        </div>
                      </div>
                      <div id="wt-statistics" className="wt-statistics wt-profilecounter">
                        <div className="wt-statisticcontent wt-countercolor1">
                          <h3>42</h3>
                          <h4>Completed <br />Jobs</h4>
                        </div>
                        <div className="wt-statisticcontent wt-countercolor2">
                          <h3>98%</h3>
                          <h4>Success <br />Rate</h4>
                        </div>
                        <div className="wt-statisticcontent wt-countercolor3">
                          <h3>2h</h3>
                          <h4>Response <br />Time</h4>
                        </div>
                        <div className="wt-description" style={{textAlign: 'right'}}>
                          <a 
                            href={`https://wa.me/263770000000?text=Hi%20${pro.name},%20I%20found%20you%20on%20SkillzLink.`} 
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
                        {pro.experience.map((exp, index) => (
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
                        ))}
                        <div className="divheight"></div>
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
                        {pro.skills.map((skill, index) => (
                          <div className="wt-skillholder" data-percent={skill.percent} key={index}>
                            <span>{skill.name} <em>{skill.percent}</em></span>
                            <div className="wt-skillbarholder">
                              <div className="wt-skillbar" style={{width: skill.percent}}></div>
                            </div>
                          </div>
                        ))}
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
