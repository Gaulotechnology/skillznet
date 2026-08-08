import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { publicApi } from "../services/api"
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

  const [searchText, setSearchText] = useState("")
  const [categoryFilter, setCategoryFilter] = useState(initialService)
  const [cityFilter, setCityFilter] = useState(initialCity)
  const [levelFilter, setLevelFilter] = useState("All")
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

  useEffect(() => {
    const params = new URLSearchParams()
    if (cityFilter !== "All") params.set("city", cityFilter)
    if (categoryFilter !== "All") params.set("service", categoryFilter)
    setSearchParams(params, { replace: true })
    setCurrentPage(1)
  }, [categoryFilter, cityFilter, searchText, levelFilter, hourlyRateFilter, successRateFilter, setSearchParams])

  const filteredProfessionals = professionals.filter(pro => {
    const cat = pro.service_category ?? ""
    const loc = pro.location ?? ""
    const lvl = pro.level ?? "Junior"
    const matchesCategory = categoryFilter === "All" || cat.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesCity = cityFilter === "All" || loc.toLowerCase().includes(cityFilter.toLowerCase())
    const matchesLevel = levelFilter === "All" || lvl === levelFilter

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

    return matchesCategory && matchesCity && matchesLevel && matchesRate && matchesSuccess && matchesSearch
  })

  const totalPages = Math.ceil(filteredProfessionals.length / ITEMS_PER_PAGE)
  const paginatedProfessionals = filteredProfessionals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const activeFiltersCount = [
    categoryFilter !== "All", cityFilter !== "All", levelFilter !== "All",
    hourlyRateFilter !== "All", successRateFilter !== "All", !!searchText
  ].filter(Boolean).length

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Header - Solid Background */}
      <div className="relative bg-slate-900 pt-16 pb-24 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Link to="/" className="text-rose-400 font-semibold text-sm tracking-wide uppercase mb-2 block hover:text-rose-300">
                ← Back to Home
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Find Professionals
              </h1>
              <p className="text-slate-300 text-lg">
                Discover {filteredProfessionals.length} verified experts ready to work.
              </p>
            </div>
            
            {/* Search Input in Header */}
            <div className="w-full md:w-96 relative">
              <input 
                type="text" 
                placeholder="Search by name, skill, or keyword..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 outline-none focus:bg-white/20 focus:border-white/40 transition-all shadow-xl"
              />
              <i className="lnr lnr-magnifier absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i className="lnr lnr-funnel text-rose-500" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-lg">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Location</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {["All", ...zimbabweCities].map(city => (
                      <label key={city} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="city"
                          value={city}
                          checked={cityFilter === city}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className={`text-sm group-hover:text-slate-800 transition-colors ${cityFilter === city ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                          {city === "All" ? "Anywhere in Zimbabwe" : city}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Category</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {["All", ...categories.map(c => c.name)].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={categoryFilter === cat}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className={`text-sm group-hover:text-slate-800 transition-colors ${categoryFilter === cat ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Level Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Professional Level</h3>
                  <div className="space-y-2">
                    {["All", "Junior", "Intermediate", "Senior", "Expert"].map(lvl => (
                      <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="level"
                          value={lvl}
                          checked={levelFilter === lvl}
                          onChange={(e) => setLevelFilter(e.target.value)}
                          className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className={`text-sm group-hover:text-slate-800 transition-colors ${levelFilter === lvl ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                          {lvl}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={() => {
                      setSearchText("")
                      setCategoryFilter("All")
                      setCityFilter("All")
                      setLevelFilter("All")
                      setHourlyRateFilter("All")
                      setSuccessRateFilter("All")
                    }}
                    className="w-full py-3 rounded-xl border border-rose-200 text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">
            
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-5 bg-slate-200 rounded w-2/3" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm mt-4">
                <i className="lnr lnr-warning text-5xl text-rose-500 mb-4 block" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Oops! Something went wrong.</h3>
                <p className="text-slate-500">{error}</p>
              </div>
            ) : filteredProfessionals.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm mt-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="lnr lnr-magnifier text-4xl text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No professionals found</h3>
                <p className="text-slate-500 mb-6">We couldn't find anyone matching your exact filters.</p>
                <button 
                  onClick={() => {
                    setCategoryFilter("All")
                    setCityFilter("All")
                    setSearchText("")
                  }}
                  className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                {paginatedProfessionals.map(pro => (
                  <div key={pro.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl shadow-slate-200/50 transition-all group relative">
                    
                    <div className="flex items-start gap-5">
                      <img 
                        src={pro.image || "https://via.placeholder.com/150"} 
                        alt={pro.name} 
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-lg text-slate-800 truncate mb-1">
                            <Link to={`/professional-profile/${pro.id}`} className="hover:text-rose-500 transition-colors">
                              {pro.name}
                            </Link>
                          </h3>
                          {pro.id_verified && (
                            <i className="lnr lnr-checkmark-circle text-blue-500 text-lg flex-shrink-0" title="Verified Professional" />
                          )}
                        </div>
                        <p className="text-sm text-indigo-600 font-semibold mb-2 truncate">
                          {pro.service_category || "General Services"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1.5"><i className="lnr lnr-map-marker" /> {pro.location || "Zimbabwe"}</span>
                          <span className="flex items-center gap-1.5"><i className="lnr lnr-briefcase" /> {pro.level || "Junior"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 my-4" />

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm font-semibold text-slate-700">
                        <div className="flex items-center gap-1">
                          <i className="lnr lnr-star text-orange-400" />
                          <span>5.0 <span className="text-slate-400 font-normal">({pro.success_rate || 98}%)</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="lnr lnr-tag text-slate-400" />
                          <span>${pro.rate || "15"}/hr</span>
                        </div>
                      </div>
                      
                      <a 
                        href={`https://wa.me/${pro.phone?.replace(/\+/g, '')}?text=Hi ${pro.name}, I found your profile on SkillzLink and would like to discuss a job.`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm"
                        title="Chat on WhatsApp"
                      >
                        <i className="fab fa-whatsapp text-xl" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <i className="lnr lnr-chevron-left" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <i className="lnr lnr-chevron-right" />
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}
