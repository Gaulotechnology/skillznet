import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { publicApi, isLoggedIn } from "../../services/api"
import type { PublicProvider } from "../../services/api"

function extractCity(location: string): string {
  const parts = location.split(",")
  return parts[parts.length - 1]?.trim() || location
}

function maskFullName(name: string): string {
  const parts = name.trim().split(" ")
  return parts[0] + " " + (parts[1] ? parts[1][0] + "." : "")
}

export function FeaturedProfessionals() {
  const [professionals, setProfessionals] = useState<PublicProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loggedIn = isLoggedIn()

  useEffect(() => {
    publicApi.listProviders({})
      .then((res) => {
        // Take top 4 that are either featured, verified, or premium
        const data = res.data || []
        const sorted = [...data].sort((a, b) => {
          const scoreA = (a.featured ? 3 : 0) + (a.premium_badge ? 2 : 0) + (a.id_verified ? 1 : 0) + (a.rating || 0)
          const scoreB = (b.featured ? 3 : 0) + (b.premium_badge ? 2 : 0) + (b.id_verified ? 1 : 0) + (b.rating || 0)
          return scoreB - scoreA
        })
        setProfessionals(sorted.slice(0, 4))
      })
      .catch(() => setError("Failed to load professionals"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900">Top Professionals Near You</h2>
            <p className="text-gray-500 text-sm mt-1">Loading trusted providers...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-[4/3] rounded-xl bg-gray-200 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || professionals.length === 0) {
    return null // Don't show if no data
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Top Professionals Near You</h2>
            <p className="text-gray-500 text-sm mt-1">Trusted, verified experts ready to help</p>
          </div>
          <Link
            to="/nearby-professionals"
            className="text-sm font-medium text-[var(--accent-color)] hover:underline flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((pro) => (
            <Link
              key={pro.id}
              to={`/professional-profile/${pro.id}`}
              className="group cursor-pointer"
            >
              {/* Image section */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img
                  src={pro.image || "https://via.placeholder.com/400x300"}
                  alt={pro.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rating overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <i className="lnr lnr-star text-amber-500 text-xs" />
                  <span className="text-xs font-semibold text-gray-900">{pro.rating || "5.0"}</span>
                </div>
                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {pro.premium_badge && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-semibold shadow-sm">
                      PREMIUM
                    </span>
                  )}
                  {pro.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-semibold shadow-sm">
                      FEATURED
                    </span>
                  )}
                </div>
              </div>

              {/* Info section - Airbnb style */}
              <div className="px-0.5">
                <p className="text-xs font-medium text-gray-500 mb-0.5">
                  {pro.service_category || "General Services"}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {loggedIn ? pro.name : maskFullName(pro.name)}
                  {pro.id_verified && (
                    <i className="lnr lnr-checkmark-circle text-blue-500 inline-block ml-1 text-xs" title="Verified" />
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {loggedIn ? (pro.location || "Zimbabwe") : extractCity(pro.location || "Zimbabwe")}
                </p>
                <p className="text-xs text-gray-500">
                  {pro.years_of_experience != null && (
                    <span>{pro.years_of_experience} yrs exp</span>
                  )}
                  {pro.years_of_experience != null && pro.completed_services != null && pro.completed_services > 0 && (
                    <span className="mx-1.5">·</span>
                  )}
                  {pro.completed_services != null && pro.completed_services > 0 && (
                    <span>{pro.completed_services} jobs</span>
                  )}
                  {((pro.years_of_experience != null || (pro.completed_services != null && pro.completed_services > 0)) && pro.response_time) && (
                    <span className="mx-1.5">·</span>
                  )}
                  {pro.response_time && (
                    <span>responds in {pro.response_time}</span>
                  )}
                </p>
                <p className="text-sm mt-1.5">
                  {loggedIn ? (
                    <span className="font-semibold text-gray-900">
                      ${pro.rate || "15"}<span className="text-xs font-normal text-gray-500">/hr</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Login to see rate</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
