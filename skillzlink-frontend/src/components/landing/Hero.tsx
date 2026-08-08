import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { publicApi } from "../../services/api"

interface HeroProps {
  selectedService: string
  onServiceChange: (service: string) => void
}

const CITIES = [
  "Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe", 
  "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Bindura", 
  "Hwange", "Victoria Falls"
]

export function Hero({ selectedService, onServiceChange }: HeroProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const cityDropdownRef = useRef<HTMLDivElement>(null)
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
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedLabel = categories.find(o => o.slug === selectedService)?.name || "All Categories"

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    let url = `/nearby-professionals?service=${selectedService}&q=${encodeURIComponent(searchText)}`
    if (selectedCity !== "all") {
      url += `&city=${encodeURIComponent(selectedCity.toLowerCase())}`
    }
    navigate(url)
  }

  return (
    <div className="relative min-h-[90vh] bg-slate-900 flex items-center overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-3/5 text-center lg:text-left pt-20 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide text-white/90 uppercase">Zimbabwe's #1 Service Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Hire trusted local <span className="text-rose-400">professionals</span> near you
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Find top-rated plumbers, electricians, cleaners, tutors, and other service providers in minutes. Chat directly on WhatsApp.
            </p>

            {/* Premium Search Form */}
            <div className="bg-white p-2 rounded-3xl md:rounded-full shadow-2xl mt-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100 relative z-20">
                
                {/* 1. What Service */}
                <div className="w-full md:w-1/2 relative flex items-center">
                  <div className="px-6 w-full">
                    <input
                      type="text"
                      placeholder="What do you need?"
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      className="w-full bg-transparent text-slate-600 placeholder-slate-400 outline-none font-medium text-lg !border-none !shadow-none !ring-0 !p-0"
                    />
                  </div>
                </div>

                {/* 2. Category */}
                <div className="w-full md:w-1/4 relative flex items-center" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(p => !p); setCityDropdownOpen(false) }}
                    className="w-full px-6 py-2 md:py-1 text-left hover:bg-slate-50 md:rounded-2xl transition-colors outline-none"
                  >
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 cursor-pointer">Category</label>
                    <div className="text-slate-600 font-medium text-lg truncate">{selectedLabel}</div>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 min-w-[240px] mt-4 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 transform origin-top animate-fade-in">
                      <ul className="max-h-60 overflow-y-auto custom-scrollbar !p-2 !m-0 list-none">
                        <li className="!p-0 !m-0 !list-none">
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-medium transition-colors"
                            onClick={() => { onServiceChange("all"); setDropdownOpen(false) }}
                          >
                            All Categories
                          </button>
                        </li>
                        {categories.map((cat: any) => (
                          <li key={cat.slug} className="!p-0 !m-0 !list-none">
                            <button
                              type="button"
                              className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-medium transition-colors truncate"
                              onClick={() => { onServiceChange(cat.slug); setDropdownOpen(false) }}
                            >
                              {cat.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 3. Location */}
                <div className="w-full md:w-1/4 relative flex items-center" ref={cityDropdownRef}>
                  <button
                    type="button"
                    onClick={() => { setCityDropdownOpen(p => !p); setDropdownOpen(false) }}
                    className="w-full px-6 py-2 md:py-1 text-left hover:bg-slate-50 md:rounded-2xl transition-colors outline-none"
                  >
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 cursor-pointer">Location</label>
                    <div className="text-slate-600 font-medium text-lg truncate">{selectedCity === "all" ? "Anywhere" : selectedCity}</div>
                  </button>
                  {cityDropdownOpen && (
                    <div className="absolute top-full right-0 min-w-[240px] mt-4 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 transform origin-top animate-fade-in">
                      <ul className="max-h-60 overflow-y-auto custom-scrollbar !p-2 !m-0 list-none">
                        <li className="!p-0 !m-0 !list-none">
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-medium transition-colors"
                            onClick={() => { setSelectedCity("all"); setCityDropdownOpen(false) }}
                          >
                            Anywhere
                          </button>
                        </li>
                        {CITIES.map(city => (
                          <li key={city} className="!p-0 !m-0 !list-none">
                            <button
                              type="button"
                              className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-medium transition-colors"
                              onClick={() => { setSelectedCity(city); setCityDropdownOpen(false) }}
                            >
                              {city}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 4. Search Button */}
                <div className="w-full md:w-auto p-1 md:pr-1 flex items-center justify-center">
                  <button 
                    type="submit" 
                    className="w-full md:w-[56px] md:h-[56px] h-[56px] bg-rose-500 hover:bg-rose-600 text-white rounded-2xl md:rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-rose-500/30"
                  >
                    <i className="lnr lnr-magnifier text-2xl font-bold" />
                    <span className="md:hidden ml-3 font-bold text-lg">Search</span>
                  </button>
                </div>
                
              </form>
            </div>
            
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400 justify-center lg:justify-start">
              <span>Popular:</span>
              {['Plumber', 'Electrician', 'Tutor', 'Cleaner'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSearchText(tag)} 
                  className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-2/5 hidden lg:block relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="/images/bannerimg/img-01.png" alt="Happy customer" className="w-full h-auto object-cover" />
            </div>
            {/* Floating Elements */}
            <div className="absolute top-10 -left-10 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-2xl">
                <i className="lnr lnr-checkmark-circle" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Verified Pros</p>
                <p className="text-xs text-slate-500">Identity checked</p>
              </div>
            </div>
            <div className="absolute bottom-10 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">
                <i className="lnr lnr-star" />
              </div>
              <div>
                <p className="font-bold text-slate-800">4.9/5 Rating</p>
                <p className="text-xs text-slate-500">From 10k+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
