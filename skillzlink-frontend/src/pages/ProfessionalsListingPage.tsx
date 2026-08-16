import { useState, useEffect, useRef } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { publicApi, isLoggedIn } from "../services/api"
import type { PublicProvider } from "../services/api"

const primary = "var(--accent-color, #2563eb)"

const Star = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const ShieldCheck = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const Heart = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ChevronRight = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const MapPin = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

function extractCity(location: string): string {
  const parts = location.split(",")
  return parts[parts.length - 1]?.trim() || location
}

function maskFullName(name: string): string {
  const parts = name.trim().split(" ")
  return parts[0] + " " + (parts[1] ? parts[1][0] + "." : "")
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
  "Electrician": "lnr lnr-power-switch",
  "Cleaner": "lnr lnr-broom",
  "Tutor": "lnr lnr-book",
  "Mechanic": "lnr lnr-cog",
  "Painter": "lnr lnr-brush",
  "Carpenter": "lnr lnr-hammer",
  "Gardener": "lnr lnr-leaf",
  "Chef": "lnr lnr-dinner",
  "Driver": "lnr lnr-car",
}

function normalizeSearch(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()
}

// Map category slug → common terms people actually type when searching
const CATEGORY_ALIASES: Record<string, string[]> = {
  "plumbing": ["plumber", "plumbers", "pipe", "leak", "drain", "toilet"],
  "electrical": ["electrician", "electricians", "wiring", "power"],
  "cleaning": ["cleaner", "cleaners", "maid", "housekeeping"],
  "tutoring": ["tutor", "tutors", "teacher", "lessons"],
  "carpentry": ["carpenter", "carpenters", "woodwork", "furniture"],
  "painting": ["painter", "painters"],
  "gardening": ["gardener", "gardeners", "landscaping", "lawn"],
  "appliance-repair": ["appliance", "appliances", "repair", "repairs", "technician"],
  "mechanic": ["mechanic", "mechanics", "car", "auto", "motor"],
  "roofing": ["roofer", "roofers", "roof"],
}

function categoryNameFor(slug: string, categories: any[]): string {
  return categories.find(c => c.slug === slug)?.name ?? ""
}

export function ProfessionalsListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCity = searchParams.get("city") || "All"
  const rawService = searchParams.get("service") || "All"
  const initialService = rawService.toLowerCase() === "all" ? "All" : rawService
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
    const catSlug = (pro.service_category ?? "").toLowerCase()
    const catName = categoryNameFor(catSlug, categories)
    const aliases = CATEGORY_ALIASES[catSlug] ?? []
    const loc = pro.location ?? ""
    const yoe = Number(pro.years_of_experience ?? 0)

    // Everything a user might search for on this provider (slug + name + aliases + free text + location)
    const searchIndex = normalizeSearch([
      pro.service_category, catName, pro.name, pro.description,
      (pro.skills ?? []).join(" "), loc, ...aliases,
    ].join(" "))

    let matchesCategory = true
    if (categoryFilter !== "All") {
      const f = normalizeSearch(categoryFilter)
      if (f) {
        const catIndex = normalizeSearch([pro.service_category, catName, ...aliases].join(" "))
        matchesCategory = f.split(" ").filter(Boolean).every(t => catIndex.includes(t))
          || catIndex.replace(/\s+/g, "").includes(f.replace(/\s+/g, ""))
      }
    }

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

    let matchesSearch = true
    if (searchText) {
      const tokens = normalizeSearch(searchText).split(" ").filter(Boolean)
      matchesSearch = tokens.length > 0 && tokens.every(t => searchIndex.includes(t))
    }

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
    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none border ${
      active
        ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-sm"
        : "bg-white text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--text-primary)] shadow-sm"
    }`

  const categoryChip = (active: boolean) =>
    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 ${
      active
        ? "bg-[var(--accent-color)] text-white font-semibold shadow-sm"
        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
    }`

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="relative z-30 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-[var(--accent-light)]/20 border-b border-[var(--border-color)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--accent-rgb,99,102,241),0.08),transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <Link to="/" className="text-[var(--accent-color)] font-medium text-sm mb-2 inline-block hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Find Professionals <span className="text-[var(--accent-color)]">Near You</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1 max-w-lg">
            Discover trusted, verified experts in your area. Filter by location, category, experience, and more.
          </p>
          
          {/* Inline Search + Location */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 max-w-2xl">
            {/* Search — flex wrapper avoids absolute-icon + main.css padding conflict */}
            <div
              className="flex-1 flex items-center gap-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 shadow-sm transition-all focus-within:border-[var(--accent-color)] focus-within:ring-4 focus-within:ring-[var(--accent-light)]/50"
              style={{ height: '44px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--text-secondary)]">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, skill, or keyword..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, height: '100%', width: '100%', fontSize: '14px', color: 'var(--text-primary)' }}
                className="placeholder-[var(--text-secondary)]"
              />
            </div>
            <div className="relative" ref={cityRef}>
              <button
                onClick={() => { setCityDropdownOpen(prev => !prev); setMoreFiltersOpen(false); setSortDropdownOpen(false) }}
                className={primaryChip(cityFilter !== "All")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>{cityFilter === "All" ? "Location" : cityFilter === "Near Me" ? "Near Me" : cityFilter}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${cityDropdownOpen ? "rotate-180" : ""}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
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
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[var(--border-color)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-2 overflow-visible">
            {/* Category Chips - Horizontal Scroll */}
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
              <button
                onClick={() => setCategoryFilter("All")}
                className={categoryChip(categoryFilter === "All")}
              >
                <i className="lnr lnr-grid text-xs" />
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
                    {categoryIcons[c.name] && <i className={`${categoryIcons[c.name]} text-xs opacity-75`} />}
                    <span>{c.name}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ml-0.5 ${categoryFilter === c.name ? "bg-white/25 text-white" : "bg-black/5 text-[var(--text-secondary)]"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
              {categories.length > 8 && !categoryScrollOpen && (
                <button
                  onClick={() => setCategoryScrollOpen(true)}
                  className="shrink-0 px-3 py-1.5 text-xs text-[var(--accent-color)] font-medium hover:underline"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProfessionals.map(pro => (
                <Link
                  key={pro.id}
                  to={`/professional-profile/${pro.id}`}
                  className="group block no-underline"
                >
                  <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden flex flex-col h-full relative hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 border-b border-slate-50">
                      <img
                        src={pro.image || "https://via.placeholder.com/400x300"}
                        alt={pro.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Verified badge */}
                      {pro.id_verified && (
                        <div className="absolute top-4 left-4 z-10 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-emerald-400/20">
                          <ShieldCheck size={14} className="text-white" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-white">Verified</span>
                        </div>
                      )}

                      {/* Favorite button */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/50 shadow-md flex items-center justify-center">
                          <Heart size={16} className="text-slate-400" />
                        </span>
                      </div>

                      {/* Experience badge */}
                      {pro.years_of_experience != null && (
                        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white/40">
                          <span className="text-[11px] font-bold text-slate-800">{pro.years_of_experience}+ Yrs Exp</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      {/* Category / badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {pro.service_category && (
                          <span className="bg-slate-50 text-slate-600 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase border border-slate-100">
                            {pro.service_category}
                          </span>
                        )}
                        {pro.premium_badge && (
                          <span className="bg-amber-50 text-amber-600 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase border border-amber-100">
                            Premium
                          </span>
                        )}
                        {pro.featured && (
                          <span className="bg-purple-50 text-purple-600 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase border border-purple-100">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Name + rating */}
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="font-semibold text-lg text-slate-900 truncate">
                          {isLoggedIn() ? pro.name : maskFullName(pro.name)}
                        </h4>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5 shrink-0">
                          <Star size={12} className="text-amber-500" />
                          <span className="text-[12px] font-black text-amber-700">
                            {pro.rating ? Number(pro.rating).toFixed(1) : "New"}
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      {pro.description && (
                        <p className="text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-2 min-h-[40px]">
                          {pro.description}
                        </p>
                      )}

                      {/* Details row */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[13px] text-slate-500 font-semibold mt-auto">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{isLoggedIn() ? (pro.location || "Zimbabwe") : extractCity(pro.location || "Zimbabwe")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate justify-end">
                          <span className="truncate">
                            {pro.completed_services != null && pro.completed_services > 0
                              ? `${pro.completed_services} jobs`
                              : pro.success_rate ? `${pro.success_rate}% success` : "Available"}
                          </span>
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</span>
                          {isLoggedIn() ? (
                            <span className="text-xl font-black text-slate-900">{pro.rate || "$15/hr"}</span>
                          ) : (
                            <span className="text-[12px] font-bold text-slate-400">Login to view</span>
                          )}
                        </div>

                        <div className="px-5 py-2.5 rounded-xl text-white text-[12px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md" style={{ backgroundColor: primary }}>
                          View Profile
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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
