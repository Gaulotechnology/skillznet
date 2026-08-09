import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { publicApi, seekerApi } from "../../services/api"
import type { PublicProvider } from "../../services/api"

export function FeaturedProfessionals() {
  const [professionals, setProfessionals] = useState<PublicProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealedContacts, setRevealedContacts] = useState<Record<number, string>>({})

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

  const handleReveal = async (id: number) => {
    try {
      const res = await seekerApi.revealContact(id)
      if (res.contact_available && res.contact_number) {
        setRevealedContacts((prev) => ({ ...prev, [id]: res.contact_number! }))
      }
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900">Top Professionals Near You</h2>
            <p className="text-gray-500 text-sm mt-1">Loading trusted providers...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-100 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group overflow-hidden"
            >
              {/* Top section */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={pro.image || "https://via.placeholder.com/150"}
                    alt={pro.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/professional-profile/${pro.id}`}
                        className="font-semibold text-gray-900 text-sm truncate hover:text-[var(--accent-color)] transition-colors"
                      >
                        {pro.name}
                      </Link>
                      {pro.id_verified && (
                        <i
                          className="lnr lnr-checkmark-circle text-blue-500 flex-shrink-0 mt-0.5"
                          title="Identity Verified"
                        />
                      )}
                    </div>
                    <p className="text-xs text-[var(--accent-color)] font-medium truncate">
                      {pro.service_category || "General Services"}
                    </p>
                  </div>
                </div>

                {/* Location & Experience */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <i className="lnr lnr-map-marker text-gray-400" />
                    {pro.location || "Zimbabwe"}
                  </span>
                  {pro.years_of_experience != null && (
                    <span className="flex items-center gap-1">
                      <i className="lnr lnr-briefcase text-gray-400" />
                      {pro.years_of_experience} yr{pro.years_of_experience !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {pro.premium_badge && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold">
                      <i className="lnr lnr-diamond text-[10px]" />
                      PREMIUM
                    </span>
                  )}
                  {pro.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold">
                      <i className="lnr lnr-star text-[10px]" />
                      FEATURED
                    </span>
                  )}
                  {pro.level && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                      {pro.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <i className="lnr lnr-star text-amber-400 text-xs" />
                    <span className="font-semibold text-gray-900">{pro.rating || "5.0"}</span>
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="font-medium text-gray-700 text-xs">
                    ${pro.rate || "15"}/hr
                  </span>
                </div>

                {revealedContacts[pro.id] ? (
                  <a
                    href={`https://wa.me/${revealedContacts[pro.id].replace(/[^0-9]/g, "")}?text=Hi ${pro.name}, I found your profile on SkillzLink.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                    title="Chat on WhatsApp"
                  >
                    <i className="fab fa-whatsapp text-sm" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleReveal(pro.id)}
                    className="w-8 h-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center hover:bg-[var(--accent-color)] hover:text-white transition-colors"
                    title="Reveal Contact"
                  >
                    <i className="lnr lnr-phone-handset text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
