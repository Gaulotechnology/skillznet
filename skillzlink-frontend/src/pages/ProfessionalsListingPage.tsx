import { useState, useEffect, useRef } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { publicApi, isLoggedIn } from "../services/api"
import type { PublicProvider } from "../services/api"

function normalizePhone(phone?: string): string {
  if (!phone) return ""
  return phone.replace(/[^0-9+]/g, "")
}

const ITEMS_PER_PAGE = 6
const zimbabweCities = [
  "Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe",
  "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Bindura",
  "Hwange", "Victoria Falls",
]

const experienceOptions = [
  { label: "Any experience", value: "All" },
  { label: "0–1 year", value: "0–1 year" },
  { label: "1–3 years", value: "1–3 years" },
  { label: "3–5 years", value: "3–5 years" },
  { label: "5–10 years", value: "5–10 years" },
  { label: "10+ years", value: "10+ years" },
]

const rateOptions = [
  { label: "Any rate", value: "All" },
  { label: "Under $20/hr", value: "Under $20" },
  { label: "$20 – $50/hr", value: "$20 - $50" },
  { label: "$50 – $100/hr", value: "$50 - $100" },
  { label: "Above $100/hr", value: "Above $100" },
]

const successOptions = [
  { label: "Any success rate", value: "All" },
  { label: "90% & Above", value: "90% & Above" },
  { label: "80% & Above", value: "80% & Above" },
  { label: "70% & Above", value: "70% & Above" },
]

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Highest rated", value: "rating" },
  { label: "Most experienced", value: "experience" },
  { label: "Price: Low to high", value: "price_asc" },
  { label: "Price: High to low", value: "price_desc" },
]

const categoryIcons: Record<string, string> = {
  "Plumber": "lnr lnr-droplet",
  "Electrician": "lnr lnr-bolt",
  "Cleaner": "lnr lnr-broom",
  "Tutor": "lnr lnr-book",
  "Mechanic": "lnr lnr-cog",
  "Painter": "lnr lnr-brush",
  "Carpenter": "lnr lnr-hammer",
  "Gardener": "lnr lnr-leaf",
  "Chef": "lnr lnr-dinner",
  "Driver": "lnr lnr-car",
}

export function ProfessionalsListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialCity = searchParams.get("city") || "All"
  const initialService = searchParams.get("service") || "All"
  const initialSearch = searchParams.get("q") || ""

  const [professionals, setProfessionals] = useState<PublicProvider[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contactError, setContactError] = useState<string | null>(null)

  const [searchText, setSearchText] = useState(initialSearch)
  const [categoryFilter, setCategoryFilter] = useState(initialService)
  const [cityFilter, setCityFilter] = useState(initialCity)
  const [experienceFilter, setExperienceFilter] = useState("All")
  const [hourlyRateFilter, setHourlyRateFilter] = useState("All")
  const [successRateFilter, setSuccessRateFilter] = useState("All")
  const [sortBy, setSortBy] = useState("recommended")
  const [currentPage, setCurrentPage] = useState(1)

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [categoryScrollOpen, setCategoryScrollOpen] = useState(false)

  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const cityRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (cityRef.current && !cityRef.current.contains(target)) setCityDropdownOpen(false)
      if (moreRef.current && !moreRef.current.contains(target)) setMoreFiltersOpen(false)
      if (sortRef.current && !sortRef.current.contains(target)) setSortDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    Promise.all([
      publicApi.listProviders({}),
      publicApi.getCategories()
    ]).then(([proRes, catRes]) => {
      setProfessionals(proRes.data || [])
      setCategories(catRes.categories || [])
    }).catch(() => {
      setError("Failed to load data. Please try again later.")
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported")
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      () => {
        setCityFilter("Near Me")
        setGeoLoading(false)
        setCityDropdownOpen(false)
      },
      () => {
        setGeoError("Unable to get your location. Please select a city manually.")
        setGeoLoading(false)
      }
    )
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (cityFilter !== "All") params.set("city", cityFilter)
    if (categoryFilter !== "All") params.set("service", categoryFilter)
    setSearchParams(params, { replace: true })
    setCurrentPage(1)
  }, [categoryFilter, cityFilter, searchText, experienceFilter, hourlyRateFilter, successRateFilter, setSearchParams])

  const filteredProfessionals = professionals.filter(pro => {
    const cat = pro.service_category ?? ""
    const loc = pro.location ?? ""
    const yoe = Number(pro.years_of_experience ?? 0)

    const matchesCategory = categoryFilter === "All" || cat.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesCity = cityFilter === "All" || cityFilter === "Near Me" || loc.toLowerCase().includes(cityFilter.toLowerCase())

    let matchesExperience = true
    if (experienceFilter !== "All") {
      if (experienceFilter === "0–1 year") matchesExperience = yoe <= 1
      else if (experienceFilter === "1–3 years") matchesExperience = yoe >= 1 && yoe <= 3
      else if (experienceFilter === "3–5 years") matchesExperience = yoe >= 3 && yoe <= 5
      else if (experienceFilter === "5–10 years") matchesExperience = yoe >= 5 && yoe <= 10
      else if (experienceFilter === "10+ years") matchesExperience = yoe > 10
    }

    let matchesRate = true
    if (hourlyRateFilter !== "All") {
      const rateStr = String(pro.rate || "0").replace(/[^0-9.]/g, '')
      const r = parseFloat(rateStr)
      if (hourlyRateFilter === "Under $20") matchesRate = r < 20
      else if (hourlyRateFilter === "$20 - $50") matchesRate = r >= 20 && r <= 50
      else if (hourlyRateFilter === "$50 - $100") matchesRate = r > 50 && r <= 100
      else if (hourlyRateFilter === "Above $100") matchesRate = r > 100
    }

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

    return matchesCategory && matchesCity && matchesExperience && matchesRate && matchesSuccess && matchesSearch
  })

  // Sort
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case "rating": return (b.success_rate || 0) - (a.success_rate || 0)
      case "experience": return (Number(b.years_of_experience) || 0) - (Number(a.years_of_experience) || 0)
      case "price_asc": return (parseFloat(String(a.rate || "0").replace(/[^0-9.]/g, "")) || 0) - (parseFloat(String(b.rate || "0").replace(/[^0-9.]/g, "")) || 0)
      case "price_desc": return (parseFloat(String(b.rate || "0").replace(/[^0-9.]/g, "")) || 0) - (parseFloat(String(a.rate || "0").replace(/[^0-9.]/g, "")) || 0)
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedProfessionals.length / ITEMS_PER_PAGE)
  const paginatedProfessionals = sortedProfessionals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const activeFiltersCount = [
    categoryFilter !== "All", cityFilter !== "All", experienceFilter !== "All",
    hourlyRateFilter !== "All", successRateFilter !== "All", !!searchText
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchText("")
    setCategoryFilter("All")
    setCityFilter("All")
    setExperienceFilter("All")
    setHourlyRateFilter("All")
    setSuccessRateFilter("All")
  }

  // Shared dropdown menu style
  const dropdownPanel = "absolute top-full right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-xl shadow-black/5 py-2 z-50 backdrop-blur-sm"

  const primaryChip = (active: boolean) =>
    `px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none border flex items-center gap-2 ${
      active
        ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)] border-[var(--accent-color)]/30 shadow-sm"
        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-transparent hover:bg-[var(--bg-secondary)] hover:border-[var(--border-color)]"
    }`

  const secondaryChip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none border ${
      active
        ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-sm"
        : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    }`

  const categoryChip = (active: boolean) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none border shrink-0 ${
      active
        ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-md shadow-[var(--accent-color)]/20"
        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-color)]/50 hover:text-[var(--text-primary)] hover:shadow-sm"
    }`

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="relative z-30 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-[var(--accent-light)]/20 border-b border-[var(--border-color)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--accent-rgb,99,102,241),0.08),transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <Link to="/" className="text-[var(--accent-color)] font-medium text-sm mb-3 inline-block hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Find Professionals <span className="text-[var(--accent-color)]">Near You</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-base mt-2 max-w-lg">
            Discover trusted, verified experts in your area. Filter by location, category, experience, and more.
          </p>
          
          {/* Inline Search + Location */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl">
            <div className="relative flex-1">
              <i className="lnr lnr-magnifier absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input 
                type="text" 
                placeholder="Search by name, skill, or keyword..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)] outline-none focus:border-[var(--accent-color)] focus:ring-4 focus:ring-[var(--accent-light)]/50 transition-all shadow-sm"
              />
            </div>
            <div className="relative" ref={cityRef}>
              <button
                onClick={() => { setCityDropdownOpen(prev => !prev); setMoreFiltersOpen(false); setSortDropdownOpen(false) }}
                className={primaryChip(cityFilter !== "All")}
              >
                <i className={`text-sm ${cityFilter === "Near Me" ? "lnr lnr-pointer" : "lnr lnr-map-marker"}`} />
                <span>{cityFilter === "All" ? "Location" : cityFilter === "Near Me" ? "Near Me" : cityFilter}</span>
                <i className={`lnr lnr-chevron-down text-[10px] transition-transform duration-200 ${cityDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`${dropdownPanel} ${cityDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} transition-all duration-200 origin-top-right`}>
                <button
                  onClick={handleNearMe}
                  disabled={geoLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[var(--bg-secondary)] text-[var(--accent-color)] font-semibold disabled:opacity-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
                    <i className={`text-sm ${geoLoading ? "lnr lnr-sync animate-spin" : "lnr lnr-pointer"}`} />
                  </span>
                  {geoLoading ? "Detecting your location..." : "Use My Location"}
                </button>
                <div className="mx-3 border-t border-[var(--border-color)]" />
                <button
                  onClick={() => { setCityFilter("All"); setCityDropdownOpen(false) }}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-[var(--bg-secondary)] transition-colors ${cityFilter === "All" ? "font-semibold text-[var(--accent-color)]" : "text-[var(--text-primary)]"}`}
                >
                  Anywhere
                </button>
                {zimbabweCities.map(city => (
                  <button
                    key={city}
                    onClick={() => { setCityFilter(city); setCityDropdownOpen(false) }}
                    className={`w-full px-4 py-2.5 text-sm text-left hover:bg-[var(--bg-secondary)] transition-colors ${cityFilter === city ? "font-semibold text-[var(--accent-color)]" : "text-[var(--text-primary)]"}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3 overflow-visible">
            {/* Category Chips - Horizontal Scroll */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
              <button
                onClick={() => setCategoryFilter("All")}
                className={categoryChip(categoryFilter === "All")}
              >
                <i className="lnr lnr-grid text-sm" />
                All
              </button>
              {categories.slice(0, categoryScrollOpen ? categories.length : 8).map((c: any) => {
                const count = professionals.filter(p => (p.service_category || "").toLowerCase().includes(c.name.toLowerCase())).length
                return (
                  <button
                    key={c.name}
                    onClick={() => setCategoryFilter(c.name === categoryFilter ? "All" : c.name)}
                    className={categoryChip(categoryFilter === c.name)}
                  >
                    <i className={`${categoryIcons[c.name] || "lnr lnr-tag"} text-sm`} />
                    {c.name}
                    <span className={`text-[10px] ml-0.5 font-normal ${categoryFilter === c.name ? "text-white/70" : "text-[var(--text-secondary)]"}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
              {categories.length > 8 && !categoryScrollOpen && (
                <button
                  onClick={() => setCategoryScrollOpen(true)}
                  className="shrink-0 px-3 py-2 text-xs text-[var(--accent-color)] font-medium hover:underline"
                >
                  +{categories.length - 8} more
                </button>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* More Filters */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => { setMoreFiltersOpen(prev => !prev); setCityDropdownOpen(false); setSortDropdownOpen(false) }}
                  className={secondaryChip(moreFiltersOpen || activeFiltersCount > 0)}
                >
                  <i className="lnr lnr-funnel text-xs" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent-color)] text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <div className={`${dropdownPanel} w-64 ${moreFiltersOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} transition-all duration-200 origin-top-right`}>
                  {/* Inside more filters panel */}
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Refine results</span>
                      {activeFiltersCount > 0 && (
                        <button onClick={clearAllFilters} className="text-xs text-[var(--accent-color)] font-medium hover:underline">Reset</button>
                      )}
                    </div>
                  </div>
                  
                  {/* Experience */}
                  <div className="px-4 py-2">
                    <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Experience</p>
                    <div className="flex flex-wrap gap-1.5">
                      {experienceOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setExperienceFilter(experienceFilter === opt.value ? "All" : opt.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                            experienceFilter === opt.value
                              ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                              : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                          }`}
                        >
                          {opt.label === "Any experience" ? "Any" : opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div className="px-4 py-2">
                    <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Rate</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rateOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setHourlyRateFilter(hourlyRateFilter === opt.value ? "All" : opt.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                            hourlyRateFilter === opt.value
                              ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                              : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                          }`}
                        >
                          {opt.label === "Any rate" ? "Any" : opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="px-4 py-2">
                    <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Success Rate</p>
                    <div className="flex flex-wrap gap-1.5">
                      {successOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSuccessRateFilter(successRateFilter === opt.value ? "All" : opt.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                            successRateFilter === opt.value
                              ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                              : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                          }`}
                        >
                          {opt.label === "Any success rate" ? "Any" : opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => { setSortDropdownOpen(prev => !prev); setCityDropdownOpen(false); setMoreFiltersOpen(false) }}
                  className={secondaryChip(false)}
                >
                  <i className="lnr lnr-sort-amount-dsc text-xs" />
                  <span className="hidden sm:inline">{sortOptions.find(o => o.value === sortBy)?.label ?? "Sort"}</span>
                  <span className="sm:hidden">Sort</span>
                </button>
                <div className={`${dropdownPanel} ${sortDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} transition-all duration-200 origin-top-right`}>
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-[var(--bg-secondary)] transition-colors ${sortBy === opt.value ? "font-semibold text-[var(--accent-color)]" : "text-[var(--text-primary)]"}`}
                    >
                      {opt.label}
                      {sortBy === opt.value && <i className="lnr lnr-check text-[var(--accent-color)] ml-auto text-xs" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Geo error toast */}
        {geoError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <i className="lnr lnr-warning" />
            <span>{geoError}</span>
            <button onClick={() => setGeoError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <i className="lnr lnr-cross text-xs" />
            </button>
          </div>
        )}

        {/* Contact/reveal error toast */}
        {contactError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
            <i className="lnr lnr-warning" />
            <span>{contactError}</span>
            <button onClick={() => setContactError(null)} className="ml-auto text-amber-500 hover:text-amber-700">
              <i className="lnr lnr-cross text-xs" />
            </button>
          </div>
        )}

        {/* Results header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing <span className="font-medium text-[var(--text-primary)]">{paginatedProfessionals.length}</span> of <span className="font-medium text-[var(--text-primary)]">{sortedProfessionals.length}</span> professionals
              {cityFilter !== "All" && cityFilter !== "Near Me" && <> in <span className="font-medium text-[var(--text-primary)]">{cityFilter}</span></>}
            </p>
          </div>
        )}

        {/* Results */}
        <div>
          {loading ? (
            <div className="grid md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-[var(--bg-primary)] rounded-xl p-5 border border-[var(--border-color)] animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[var(--bg-secondary)]" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-[var(--bg-secondary)] rounded w-2/3" />
                      <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-[var(--bg-primary)] rounded-xl p-12 text-center border border-[var(--border-color)]">
              <i className="lnr lnr-warning text-4xl text-[var(--accent-color)] mb-4 block" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Something went wrong</h3>
              <p className="text-[var(--text-secondary)] text-sm">{error}</p>
            </div>
          ) : sortedProfessionals.length === 0 ? (
            <div className="bg-[var(--bg-primary)] rounded-xl p-12 text-center border border-[var(--border-color)]">
              <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="lnr lnr-magnifier text-2xl text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No professionals found</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-4">Try adjusting your filters.</p>
              <button 
                onClick={() => { setCategoryFilter("All"); setCityFilter("All"); setSearchText(""); }}
                className="px-5 py-2.5 bg-[var(--accent-light)] text-[var(--accent-color)] font-medium text-sm rounded-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {paginatedProfessionals.map(pro => (
                <div key={pro.id} className="bg-[var(--bg-primary)] rounded-xl p-5 border border-[var(--border-color)] hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-4">
                    <img 
                      src={pro.image || "https://via.placeholder.com/150"} 
                      alt={pro.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[var(--border-color)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[var(--text-primary)] truncate">
                          <Link to={`/professional-profile/${pro.id}`} className="hover:text-[var(--accent-color)] transition-colors">
                            {pro.name}
                          </Link>
                        </h3>
                        {pro.id_verified && (
                          <i className="lnr lnr-checkmark-circle text-blue-500 flex-shrink-0" title="Verified" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--accent-color)] font-medium truncate">
                        {pro.service_category || "General Services"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-1.5">
                        <span className="flex items-center gap-1"><i className="lnr lnr-map-marker" /> {pro.location || "Zimbabwe"}</span>
                        {(pro as any).years_of_experience != null && (
                          <span className="flex items-center gap-1"><i className="lnr lnr-briefcase" /> {(pro as any).years_of_experience} yr{(pro as any).years_of_experience !== 1 ? 's' : ''} exp</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[var(--border-color)] my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-[var(--text-primary)]">
                      <span className="flex items-center gap-1">
                        <i className="lnr lnr-star text-amber-400" />
                        <span className="font-medium">5.0</span>
                        <span className="text-[var(--text-secondary)] text-xs">({pro.success_rate || 98}%)</span>
                      </span>
                      <span className="font-medium">${pro.rate || "15"}/hr</span>
                    </div>
                    
                    {isLoggedIn() && pro.phone ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${normalizePhone(pro.phone).replace(/^\+/, "")}?text=Hi ${encodeURIComponent(pro.name)}, I found your profile on SkillzLink.`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <i className="fab fa-whatsapp text-lg" />
                        </a>
                        <a
                          href={`tel:${normalizePhone(pro.phone)}`}
                          className="w-9 h-9 rounded-lg bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center hover:bg-[var(--accent-color)] hover:text-white transition-colors"
                          title="Call"
                        >
                          <i className="lnr lnr-phone-handset text-lg" />
                        </a>
                      </div>
                    ) : isLoggedIn() ? (
                      <span className="text-xs text-[var(--text-secondary)]">No contact available</span>
                    ) : (
                      <Link
                        to="/login"
                        className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        Login to contact
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (() => {
            const visiblePages: (number | "...")[] = [];
            if (totalPages <= 5) {
              for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
            } else {
              visiblePages.push(1);
              if (currentPage > 3) visiblePages.push("...");
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              for (let i = start; i <= end; i++) visiblePages.push(i);
              if (currentPage < totalPages - 2) visiblePages.push("...");
              visiblePages.push(totalPages);
            }
            return (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-10">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-9 h-9 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 transition-colors shrink-0"
                >
                  <i className="lnr lnr-chevron-left text-xs" />
                </button>
                
                {visiblePages.map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-[var(--text-secondary)] shrink-0">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg font-medium text-sm transition-all shrink-0 ${
                        currentPage === page 
                          ? 'bg-[var(--accent-color)] text-white shadow-sm' 
                          : 'border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-9 h-9 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 transition-colors shrink-0"
                >
                  <i className="lnr lnr-chevron-right text-xs" />
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  )
}
