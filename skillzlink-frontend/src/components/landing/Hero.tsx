import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { publicApi } from "../../services/api"

interface HeroProps {
  selectedService: string
  onServiceChange: (service: string) => void
}

export function Hero({ selectedService, onServiceChange }: HeroProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    publicApi.getCategories().then(res => setCategories(res.categories || []))
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedLabel = categories.find(o => o.slug === selectedService)?.name || "All Categories"

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/nearby-professionals?service=${selectedService}&q=${encodeURIComponent(searchText)}`)
  }

  return (
    <div className="wt-haslayout wt-bannerholder">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-5">
            <div className="wt-bannerimages">
              <figure className="wt-bannermanimg">
                <img src="/images/bannerimg/img-01.png" alt="Banner" />
                <img src="/images/bannerimg/img-02.png" className="wt-bannermanimgone" alt="Banner layer one" />
                <img src="/images/bannerimg/img-03.png" className="wt-bannermanimgtwo" alt="Banner layer two" />
              </figure>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7">
            <div className="wt-bannercontent">
              <div className="wt-bannerhead">
                <div className="wt-title">
                  <h1>
                    <span>Hire trusted local professionals</span> near you
                  </h1>
                </div>
                <div className="wt-description">
                  <p>Find top-rated plumbers, electricians, cleaners, tutors, and other service providers in minutes.</p>
                </div>
              </div>
              <form className="wt-formtheme wt-formbanner" onSubmit={handleSearch}>
                <fieldset>
                  <div className="form-group">
                    <input
                      type="text"
                      name="fullname"
                      className="form-control"
                      placeholder="I'm looking for"
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                    />
                    <div className="wt-formoptions">
                      <div className="wt-dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                        <span
                          onClick={() => setDropdownOpen(prev => !prev)}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          In: <em className="selected-search-type">{selectedLabel} </em>
                          <i className="lnr lnr-chevron-down"></i>
                        </span>
                        {dropdownOpen && (
                          <div
                            className="wt-radioholder"
                            style={{
                              display: 'block',
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              background: '#fff',
                              boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
                              borderRadius: '4px',
                              padding: '15px',
                              zIndex: 9999,
                              minWidth: '200px',
                            }}
                          >
                              <span className="wt-radio" key="all">
                                <input
                                  id="service-all"
                                  type="radio"
                                  name="searchtype"
                                  value="all"
                                  checked={selectedService === "all"}
                                  onChange={() => {
                                    onServiceChange("all")
                                    setDropdownOpen(false)
                                  }}
                                />
                                <label htmlFor="service-all">All Categories</label>
                              </span>
                              {categories.map(option => (
                                <span className="wt-radio" key={option.slug}>
                                  <input
                                    id={`service-${option.slug}`}
                                    type="radio"
                                    name="searchtype"
                                    value={option.slug}
                                    checked={selectedService === option.slug}
                                    onChange={() => {
                                      onServiceChange(option.slug)
                                      setDropdownOpen(false)
                                    }}
                                  />
                                  <label htmlFor={`service-${option.slug}`}>{option.name}</label>
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      <button type="submit" className="wt-searchbtn" aria-label="Find professionals">
                        <i className="lnr lnr-magnifier" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
              <div className="wt-videoholder">
                <div className="wt-videoshow">
                  <a href="https://www.youtube.com/watch?v=J37W6DjqT3Q">
                    <i className="fa fa-play" />
                  </a>
                </div>
                <div className="wt-videocontent">
                  <span>See For Yourself!<em>How it works &amp; experience the ultimate joy.</em></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
