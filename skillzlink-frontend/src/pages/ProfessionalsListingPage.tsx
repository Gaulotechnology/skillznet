import { useState } from "react"
import { Link } from "react-router-dom"

export function ProfessionalsListingPage() {
  const [cityFilter, setCityFilter] = useState<string>("All")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")

  const professionals = [
    {
      id: "1",
      name: "Tinashe Moyo",
      category: "Plumbing",
      rate: "$15.00 / hr",
      location: "Harare",
      rating: 4.8,
      reviews: 124,
      image: "/images/user/userlisting/img-01.jpg",
      description: "Experienced plumber serving Harare. I handle emergency leaks, installations, and general maintenance with quick response times.",
      skills: ["Pipe Fitting", "Geyser Repair", "Drain Unblocking"],
      featured: true,
    },
    {
      id: "2",
      name: "Chipo Ndlovu",
      category: "Electrical",
      rate: "$20.00 / hr",
      location: "Bulawayo",
      rating: 4.9,
      reviews: 86,
      image: "/images/user/userlisting/img-02.jpg",
      description: "Certified electrician for residential and commercial wiring, fault finding, and solar installations.",
      skills: ["Wiring", "Solar", "Fault Finding", "Appliance Repair"],
      featured: true,
    },
    {
      id: "3",
      name: "Tafadzwa Chigumba",
      category: "Carpentry",
      rate: "$12.00 / hr",
      location: "Mutare",
      rating: 4.5,
      reviews: 42,
      image: "/images/user/userlisting/img-03.jpg",
      description: "Custom furniture making, roof timbering, and general woodwork. High quality finishes guaranteed.",
      skills: ["Furniture", "Roofing", "Cabinet Making"],
      featured: false,
    },
  ]

  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Find Professionals</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">Professionals</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-main-section wt-haslayout">
          <div className="wt-haslayout">
            <div className="container">
              <div className="row">
                <div id="wt-twocolumns" className="wt-twocolumns wt-haslayout">
                  {/* Sidebar */}
                  <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 float-left">
                    <aside id="wt-sidebar" className="wt-sidebar wt-usersidebar">
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Categories</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="form-group">
                                <input type="text" name="Search" className="form-control" placeholder="Search Category" />
                                <a href="#/" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                              </div>
                            </fieldset>
                            <fieldset>
                              <div className="wt-checkboxholder wt-verticalscrollbar" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                {["All", "Plumbing", "Electrical", "Carpentry", "Cleaning", "Tutoring"].map(cat => (
                                  <span className="wt-checkbox" key={cat}>
                                    <input 
                                      id={`cat-${cat}`} 
                                      type="radio" 
                                      name="category" 
                                      checked={categoryFilter === cat} 
                                      onChange={() => setCategoryFilter(cat)} 
                                    />
                                    <label htmlFor={`cat-${cat}`}> {cat}</label>
                                  </span>
                                ))}
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>

                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Location</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="form-group">
                                <input type="text" name="fullname" className="form-control" placeholder="Search Location" />
                                <a href="#/" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                              </div>
                            </fieldset>
                            <fieldset>
                              <div className="wt-checkboxholder wt-verticalscrollbar" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                {["All", "Harare", "Bulawayo", "Mutare", "Gweru"].map(city => (
                                  <span className="wt-checkbox" key={city}>
                                    <input 
                                      id={`city-${city}`} 
                                      type="radio" 
                                      name="city" 
                                      checked={cityFilter === city} 
                                      onChange={() => setCityFilter(city)} 
                                    />
                                    <label htmlFor={`city-${city}`}> {city}</label>
                                  </span>
                                ))}
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                    </aside>
                  </div>

                  {/* Main Content */}
                  <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-8 float-left">
                    <div className="wt-userlistingholder wt-userlisting wt-haslayout">
                      <div className="wt-userlistingtitle">
                        <span>{professionals.length} results found</span>
                      </div>

                      {professionals.map(pro => (
                        <div className={`wt-userlistinghold ${pro.featured ? "wt-featured" : ""}`} key={pro.id}>
                          {pro.featured && (
                            <span className="wt-featuredtag"><img src="/images/featured.png" alt="Featured" /></span>
                          )}
                          <figure className="wt-userlistingimg">
                            <img src={pro.image} alt={pro.name} style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%'}} />
                          </figure>
                          <div className="wt-userlistingcontent">
                            <div className="wt-contenthead">
                              <div className="wt-title">
                                <Link to={`/professional-profile/${pro.id}`}><i className="fa fa-check-circle"></i> {pro.name}</Link>
                                <h2>{pro.category} Professional</h2>
                              </div>
                              <ul className="wt-userlisting-breadcrumb">
                                <li><span><i className="far fa-money-bill-alt"></i> {pro.rate}</span></li>
                                <li><span><i className="lnr lnr-map-marker"></i> {pro.location}</span></li>
                              </ul>
                            </div>
                            <div className="wt-rightarea">
                              <span className="wt-starsvtwo">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fa fa-star ${i < Math.floor(pro.rating) ? 'fill' : ''}`}></i>
                                ))}
                              </span>
                              <span className="wt-starcontent">{pro.rating}/<sub>5</sub> <em>({pro.reviews} Feedback)</em></span>
                            </div>
                          </div>
                          <div className="wt-description">
                            <p>{pro.description}</p>
                          </div>
                          <div className="wt-tag wt-widgettag">
                            {pro.skills.map(skill => (
                              <Link to="#/" key={skill}>{skill}</Link>
                            ))}
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
