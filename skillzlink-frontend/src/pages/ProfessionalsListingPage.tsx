import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { publicApi, seekerApi } from "../services/api"
import type { PublicProvider } from "../services/api"

const ITEMS_PER_PAGE = 6
const zimbabweCities = [
  "Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe",
  "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Bindura",
  "Hwange", "Victoria Falls",
]

export function ProfessionalsListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialCity = searchParams.get("city") || "All"
  const initialService = searchParams.get("service") || "All"

  const [professionals, setProfessionals] = useState<PublicProvider[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealingId, setRevealingId] = useState<number | null>(null)
  const [revealedContacts, setRevealedContacts] = useState<Record<number, string>>({})

  const [searchText, setSearchText] = useState("")
  const [categoryFilter, setCategoryFilter] = useState(initialService)
  const [cityFilter, setCityFilter] = useState(initialCity)
  const [experienceFilter, setExperienceFilter] = useState("All")
  const [hourlyRateFilter, setHourlyRateFilter] = useState("All")
  const [successRateFilter, setSuccessRateFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

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

  const handleRevealContact = async (pro: PublicProvider) => {
    setRevealingId(pro.id)
    try {
      const res = await seekerApi.revealContact(pro.id)
      if (res.contact_available && res.contact_number) {
        setRevealedContacts(prev => ({ ...prev, [pro.id]: res.contact_number! }))
      }
    } catch {}
    setRevealingId(null)
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
    const matchesCity = cityFilter === "All" || loc.toLowerCase().includes(cityFilter.toLowerCase())

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

  const totalPages = Math.ceil(filteredProfessionals.length / ITEMS_PER_PAGE)
  const paginatedProfessionals = filteredProfessionals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const activeFiltersCount = [
    categoryFilter !== "All", cityFilter !== "All", experienceFilter !== "All",
    hourlyRateFilter !== "All", successRateFilter !== "All", !!searchText
  ].filter(Boolean).length

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <Link to="/" className="text-[var(--accent-color)] font-medium text-sm mb-2 block hover:underline">
                ← Back to Home
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Find Professionals
              </h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                {filteredProfessionals.length} verified experts available
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <input 
                type="text" 
                placeholder="Search by name, skill..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all"
              />
              <i className="lnr lnr-magnifier absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filter Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <i className="lnr lnr-funnel text-[var(--accent-color)]" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-[var(--accent-light)] text-[var(--accent-color)] text-xs font-medium px-2 py-0.5 rounded-md">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {/* Location Filter */}
                <div>
                  <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Location</h3>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {["All", ...zimbabweCities].map(city => (
                      <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio" name="city" value={city}
                          checked={cityFilter === city}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-3.5 h-3.5 accent-[var(--accent-color)] cursor-pointer"
                        />
                        <span className={`text-sm ${cityFilter === city ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {city === "All" ? "Anywhere" : city}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-[var(--border-color)]" />

                {/* Category Filter */}
                <div>
                  <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Category</h3>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {["All", ...categories.map(c => c.name)].map(cat => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio" name="category" value={cat}
                          checked={categoryFilter === cat}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-3.5 h-3.5 accent-[var(--accent-color)] cursor-pointer"
                        />
                        <span className={`text-sm ${categoryFilter === cat ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-[var(--border-color)]" />

                {/* Experience Filter */}
                <div>
                  <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Years of Experience</h3>
                  <div className="space-y-1.5">
                    {["All", "0–1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map(opt => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio" name="experience" value={opt}
                          checked={experienceFilter === opt}
                          onChange={(e) => setExperienceFilter(e.target.value)}
                          className="w-3.5 h-3.5 accent-[var(--accent-color)] cursor-pointer"
                        />
                        <span className={`text-sm ${experienceFilter === opt ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {opt === "All" ? "Any experience" : opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <>
                    <hr className="border-[var(--border-color)]" />
                    <button 
                      onClick={() => { setSearchText(""); setCategoryFilter("All"); setCityFilter("All"); setExperienceFilter("All"); setHourlyRateFilter("All"); setSuccessRateFilter("All"); }}
                      className="w-full py-2.5 rounded-lg border border-[var(--accent-color)]/20 text-[var(--accent-color)] font-medium text-sm hover:bg-[var(--accent-light)] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
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
            ) : filteredProfessionals.length === 0 ? (
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
                      
                      {revealedContacts[pro.id] ? (
                        <a 
                          href={`https://wa.me/${revealedContacts[pro.id].replace(/[^0-9]/g, '')}?text=Hi ${pro.name}, I found your profile on SkillzLink.`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <i className="fab fa-whatsapp text-lg" />
                        </a>
                      ) : (
                        <button
                          onClick={() => handleRevealContact(pro)}
                          disabled={revealingId === pro.id}
                          className="w-9 h-9 rounded-lg bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center hover:bg-[var(--accent-color)] hover:text-white transition-colors disabled:opacity-50"
                          title="Reveal Contact"
                        >
                          {revealingId === pro.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <i className="lnr lnr-phone-handset text-lg" />
                          )}
                        </button>
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
                            ? 'bg-[var(--accent-color)] text-white' 
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
    </div>
  )
}
