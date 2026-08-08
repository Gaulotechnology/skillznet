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
    <section className="bg-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
          Find trusted professionals near you
        </h1>
        <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto">
          Connect with verified local experts for any service you need
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
          <div className="flex items-center rounded-full bg-white border border-gray-200 shadow-md relative focus-within:ring-2 focus-within:ring-[var(--accent-light)] focus-within:border-[var(--accent-color)] transition-all">
            
            {/* Category */}
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => { setDropdownOpen(p => !p); setCityDropdownOpen(false) }}
                className="w-full text-left px-5 py-3"
              >
                <span className="block text-xs font-semibold text-gray-900">Category</span>
                <span className="block text-sm text-gray-500 truncate">{selectedLabel}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-sm z-50 max-h-60 overflow-y-auto">
                  <button type="button" onClick={() => { onServiceChange("all"); setDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">All Categories</button>
                  {categories.map(cat => (
                    <button key={cat.slug} type="button" onClick={() => { onServiceChange(cat.slug); setDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{cat.name}</button>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div className="relative flex-1" ref={cityDropdownRef}>
              <button
                type="button"
                onClick={() => { setCityDropdownOpen(p => !p); setDropdownOpen(false) }}
                className="w-full text-left px-5 py-3"
              >
                <span className="block text-xs font-semibold text-gray-900">City</span>
                <span className="block text-sm text-gray-500 truncate">{selectedCity === "all" ? "All Cities" : selectedCity}</span>
              </button>
              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-sm z-50 max-h-60 overflow-y-auto">
                  <button type="button" onClick={() => { setSelectedCity("all"); setCityDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">All Cities</button>
                  {CITIES.map(city => (
                    <button key={city} type="button" onClick={() => { setSelectedCity(city); setCityDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{city}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Search text */}
            <div className="flex-1 px-5 py-3">
              <span className="block text-xs font-semibold text-gray-900">Search</span>
              <input
                type="text"
                placeholder="What do you need?"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent border-0 focus:border-0 focus:ring-0 p-0 shadow-none"
              />
            </div>

            {/* Search button */}
            <div className="pr-2">
              <button type="submit" className="w-12 h-12 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Popular searches */}
        <div className="mt-6 text-sm text-gray-500">
          Popular:{" "}
          {["Plumbing", "Electrical", "Cleaning", "Tutoring"].map((term, i) => (
            <button
              key={term}
              type="button"
              onClick={() => { setSearchText(term); }}
              className="text-gray-700 hover:text-[var(--accent-color)] font-medium transition-colors"
            >
              {term}{i < 3 ? ", " : ""}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
