import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { publicApi, type PublicProvider } from "../services/api"

const MOCK_PROVIDERS: PublicProvider[] = [
  {
    id: 1, name: "Tinashe Moyo", service_category: "Plumbing",
    rate: "$15.00 / hr", location: "Harare", rating: 4.8, reviews: 124,
    image: "/images/user/userlisting/img-01.jpg",
    description: "Experienced plumber serving Harare. I handle emergency leaks, installations, and general maintenance with quick response times.",
    skills: ["Pipe Fitting", "Geyser Repair", "Drain Unblocking"],
    featured: true, premium_badge: true, id_verified: true,
  },
  {
    id: 2, name: "Chipo Ndlovu", service_category: "Electrical",
    rate: "$20.00 / hr", location: "Bulawayo", rating: 4.9, reviews: 86,
    image: "/images/user/userlisting/img-02.jpg",
    description: "Certified electrician for residential and commercial wiring, fault finding, and solar installations.",
    skills: ["Wiring", "Solar", "Fault Finding", "Appliance Repair"],
    featured: true, premium_badge: true, id_verified: true,
  },
  {
    id: 3, name: "Tafadzwa Chigumba", service_category: "Carpentry",
    rate: "$12.00 / hr", location: "Mutare", rating: 4.5, reviews: 42,
    image: "/images/user/userlisting/img-03.jpg",
    description: "Custom furniture making, roof timbering, and general woodwork. High quality finishes guaranteed.",
    skills: ["Furniture", "Roofing", "Cabinet Making"],
    featured: false, premium_badge: false, id_verified: false,
  },
]

export function ProfessionalsListingPage() {
  const [searchParams] = useSearchParams()
  const [cityFilter, setCityFilter] = useState<string>("All")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [searchText, setSearchText] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("All")
  const [hourlyRateFilter, setHourlyRateFilter] = useState<string>("All")
  const [successRateFilter, setSuccessRateFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [professionals, setProfessionals] = useState<PublicProvider[]>(MOCK_PROVIDERS)
  const ITEMS_PER_PAGE = 10
  const [loading, setLoading] = useState(false)
  const [_apiError, setApiError] = useState(false)
  const [dbCategories, setDbCategories] = useState<any[]>([])

  // Fetch dynamic categories
  useEffect(() => {
    publicApi.getCategories().then(res => setDbCategories(res.categories || []))
  }, [])

  // Sync filters from URL params (coming from homepage search)
  useEffect(() => {
    const service = searchParams.get("service")
    const q = searchParams.get("q")
    if (service && service !== "all") {
      const capitalised = service.charAt(0).toUpperCase() + service.slice(1).replace(/-/g, " ")
      setCategoryFilter(capitalised)
    }
    if (q) setSearchText(q)
  }, [searchParams])

  // Fetch from real API
  useEffect(() => {
    setLoading(true)
    publicApi.listProviders({
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      city: cityFilter !== "All" ? cityFilter : undefined,
      q: searchText || undefined,
    })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProfessionals(res.data)
          setApiError(false)
        } else {
          // API returned empty — show mock so UI isn't empty
          setProfessionals(MOCK_PROVIDERS)
        }
      })
      .catch(() => {
        // API unreachable — fall back to mock data silently
        setApiError(true)
        setProfessionals(MOCK_PROVIDERS)
      })
      .finally(() => setLoading(false))
  }, [categoryFilter, cityFilter, searchText])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, cityFilter, searchText, levelFilter, hourlyRateFilter, successRateFilter])

  // Client-side filter on top of API results (for instant sidebar interaction)
  const filteredProfessionals = professionals.filter(pro => {
    const cat = pro.service_category ?? ""
    const loc = pro.location ?? ""
    const lvl = pro.level ?? "Junior"
    const matchesCategory = categoryFilter === "All" || cat.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesCity = cityFilter === "All" || loc.toLowerCase().includes(cityFilter.toLowerCase())
    const matchesLevel = levelFilter === "All" || lvl === levelFilter

    // Hourly rate filter
    let matchesRate = true
    if (hourlyRateFilter !== "All") {
      const rateStr = String(pro.rate || "0").replace(/[^0-9.]/g, '')
      const r = parseFloat(rateStr)
      if (hourlyRateFilter === "Under $20") matchesRate = r < 20
      else if (hourlyRateFilter === "$20 - $50") matchesRate = r >= 20 && r <= 50
      else if (hourlyRateFilter === "$50 - $100") matchesRate = r > 50 && r <= 100
      else if (hourlyRateFilter === "Above $100") matchesRate = r > 100
    }

    // Success rate filter
    let matchesSuccess = true
    if (successRateFilter !== "All") {
      const sr = pro.success_rate || 0
      if (successRateFilter === "90% & Above") matchesSuccess = sr >= 90
      else if (successRateFilter === "80% & Above") matchesSuccess = sr >= 80
      else if (successRateFilter === "70% & Above") matchesSuccess = sr >= 70
    }

    const matchesSearch = !searchText ||
      pro.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cat.toLowerCase().includes(searchText.toLowerCase()) ||
      (pro.skills ?? []).some(s => s.toLowerCase().includes(searchText.toLowerCase()))

    return matchesCategory && matchesCity && matchesLevel && matchesRate && matchesSuccess && matchesSearch
  })

  const totalPages = Math.ceil(filteredProfessionals.length / ITEMS_PER_PAGE)
  const paginatedProfessionals = filteredProfessionals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)



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
                      
                      {/* Keyword Search */}
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Keyword Search</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch" onSubmit={(e) => e.preventDefault()}>
                            <fieldset>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Search by name or skill..." 
                                  value={searchText}
                                  onChange={(e) => setSearchText(e.target.value)}
                                />
                                <a href="#/" className="wt-searchgbtn" onClick={(e) => e.preventDefault()}><i className="lnr lnr-magnifier"></i></a>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
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
                                <span className="wt-radio" key="All">
                                  <input 
                                    id={`cat-All`} 
                                    type="radio" 
                                    name="category" 
                                    checked={categoryFilter === "All"} 
                                    onChange={() => setCategoryFilter("All")} 
                                  />
                                  <label htmlFor={`cat-All`}> All</label>
                                </span>
                                {dbCategories.map(cat => (
                                  <span className="wt-radio" key={cat.id}>
                                    <input 
                                      id={`cat-${cat.id}`} 
                                      type="radio" 
                                      name="category" 
                                      checked={categoryFilter === cat.name} 
                                      onChange={() => setCategoryFilter(cat.name)} 
                                    />
                                    <label htmlFor={`cat-${cat.id}`}> {cat.name}</label>
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
                                  <span className="wt-radio" key={city}>
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
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Expert Level</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="wt-checkboxholder wt-verticalscrollbar" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                {["All", "Expert", "Intermediate", "Junior"].map(lvl => (
                                  <span className="wt-radio" key={lvl}>
                                    <input 
                                      id={`lvl-${lvl}`} 
                                      type="radio" 
                                      name="level" 
                                      checked={levelFilter === lvl} 
                                      onChange={() => setLevelFilter(lvl)} 
                                    />
                                    <label htmlFor={`lvl-${lvl}`}> {lvl}</label>
                                  </span>
                                ))}
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>
                    </aside>
                    
                    <aside id="wt-sidebar" className="wt-sidebar wt-usersidebar" style={{ marginTop: '30px' }}>
                      {/* Hourly Rate */}
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Hourly Rate</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="wt-checkboxholder">
                                {["All", "Under $20", "$20 - $50", "$50 - $100", "Above $100"].map(rate => (
                                  <span className="wt-radio" key={rate}>
                                    <input 
                                      id={`rate-${rate}`} 
                                      type="radio" 
                                      name="hourlyRate" 
                                      checked={hourlyRateFilter === rate} 
                                      onChange={() => setHourlyRateFilter(rate)} 
                                    />
                                    <label htmlFor={`rate-${rate}`}> {rate}</label>
                                  </span>
                                ))}
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </div>

                      {/* Success Rate */}
                      <div className="wt-widget wt-effectiveholder">
                        <div className="wt-widgettitle">
                          <h2>Success Rate</h2>
                        </div>
                        <div className="wt-widgetcontent">
                          <form className="wt-formtheme wt-formsearch">
                            <fieldset>
                              <div className="wt-checkboxholder">
                                {["All", "90% & Above", "80% & Above", "70% & Above"].map(sr => (
                                  <span className="wt-radio" key={sr}>
                                    <input 
                                      id={`sr-${sr}`} 
                                      type="radio" 
                                      name="successRate" 
                                      checked={successRateFilter === sr} 
                                      onChange={() => setSuccessRateFilter(sr)} 
                                    />
                                    <label htmlFor={`sr-${sr}`}> {sr}</label>
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
                        <span>{filteredProfessionals.length} results found{categoryFilter !== 'All' ? ` in "${categoryFilter}"` : ''}</span>
                      </div>

                      {loading && (
                        <div style={{ padding: '30px', textAlign: 'center' }}>
                          <i className="fa fa-spinner fa-spin" style={{ fontSize: '30px', color: '#ff5851' }}></i>
                          <p style={{ marginTop: '10px', color: '#888' }}>Loading professionals...</p>
                        </div>
                      )}

                      {filteredProfessionals.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                          <i className="lnr lnr-sad" style={{ fontSize: '40px', display: 'block', marginBottom: '15px' }}></i>
                          <p>No professionals found for <strong>{categoryFilter}</strong>. Try a different category or clear the filter.</p>
                        </div>
                      )}
                      {paginatedProfessionals.map(pro => (
                        <div className={`wt-userlistinghold ${pro.featured ? "wt-featured" : ""}`} key={pro.id}>
                          {pro.featured && (
                            <span className="wt-featuredtag"><img src="/images/featured.png" alt="Featured" /></span>
                          )}
                          <figure className="wt-userlistingimg">
                            <Link to={`/professional-profile/${pro.id}`}>
                              <img src={pro.image} alt={pro.name} style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%'}} />
                            </Link>
                          </figure>
                          <div className="wt-userlistingcontent">
                            <div className="wt-contenthead">
                              <div className="wt-title">
                                <Link to={`/professional-profile/${pro.id}`}><i className="fa fa-check-circle"></i> {pro.name}</Link>
                                <h2>{pro.service_category} Professional</h2>
                              </div>
                              <ul className="wt-userlisting-breadcrumb" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', margin: '5px 0', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', padding: 0, margin: 0, border: 'none' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="far fa-money-bill-alt"></i> {pro.rate}
                                  </span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', padding: 0, margin: 0, border: 'none' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="lnr lnr-map-marker"></i> {pro.location ? pro.location.split(',').pop()?.trim() : 'Zimbabwe'}
                                  </span>
                                </li>
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
                            {(pro.skills ?? []).map(skill => (
                              <Link to="#/" key={skill}>{skill}</Link>
                            ))}
                          </div>
                          <div className="wt-btnarea" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{color: '#999', fontSize: '13px'}}>{pro.level} Level</span>
                            <Link to={`/professional-profile/${pro.id}`} className="wt-btn">View Profile</Link>
                          </div>
                        </div>
                      ))}

                      {totalPages > 1 && (
                        <nav className="wt-pagination">
                          <ul>
                            <li className={`wt-prevpage ${currentPage === 1 ? 'd-none' : ''}`}>
                              <a href="#/" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo(0, 0); }}><i className="lnr lnr-chevron-left"></i></a>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                              <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
                                <a href="#/" onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); window.scrollTo(0, 0); }}>{i + 1}</a>
                              </li>
                            ))}
                            <li className={`wt-nextpage ${currentPage === totalPages ? 'd-none' : ''}`}>
                              <a href="#/" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo(0, 0); }}><i className="lnr lnr-chevron-right"></i></a>
                            </li>
                          </ul>
                        </nav>
                      )}

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
