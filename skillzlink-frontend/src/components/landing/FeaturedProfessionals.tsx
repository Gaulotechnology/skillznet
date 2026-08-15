import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { publicApi, isLoggedIn } from "../../services/api"
import type { PublicProvider } from "../../services/api"

const primary = "var(--accent-color, #2563eb)"

function extractCity(location: string): string {
  const parts = location.split(",")
  return parts[parts.length - 1]?.trim() || location
}

function maskFullName(name: string): string {
  const parts = name.trim().split(" ")
  return parts[0] + " " + (parts[1] ? parts[1][0] + "." : "")
}

// ─── Inline icons ─────────────────────────────────────────────────────────────
const Star = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
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

const Heart = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ChevronRight = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export function FeaturedProfessionals() {
  const [professionals, setProfessionals] = useState<PublicProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loggedIn = isLoggedIn()

  useEffect(() => {
    publicApi.listProviders({})
      .then((res) => {
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
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="h-3 w-40 bg-gray-100 rounded mb-4" />
            <div className="h-8 w-96 bg-gray-100 rounded mb-3" />
            <div className="h-8 w-72 bg-gray-100 rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-square rounded-[1.25rem] bg-gray-200 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || professionals.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: primary }} />
              <span className="font-bold tracking-widest text-[12px] uppercase" style={{ color: primary }}>
                Trusted Experts
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222222] tracking-tight leading-[1.1]">
              Top professionals <br className="hidden md:block" />
              ready to <span className="italic" style={{ color: primary }}>help you.</span>
            </h2>
          </div>

          <Link
            to="/nearby-professionals"
            className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-black hover:bg-black hover:text-white rounded-2xl px-8 py-4 font-bold transition-all text-base group shadow-sm w-fit"
          >
            Browse all professionals
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {professionals.map((pro) => (
            <div key={pro.id} className="group">
              <Link to={`/professional-profile/${pro.id}`} className="block no-underline">
                {/* Image Container */}
                <div className="relative aspect-square rounded-[1.25rem] overflow-hidden bg-slate-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={pro.image || "https://via.placeholder.com/400x400"}
                    alt={pro.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Save overlay */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Heart size={20} className="text-slate-400" />
                    </span>
                  </div>

                  {/* Verified badge */}
                  {pro.id_verified && (
                    <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 border border-white/50">
                      <ShieldCheck size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Verified</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[15px] text-[#222222] truncate pr-2">
                      {loggedIn ? pro.name : maskFullName(pro.name)}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={14} className="text-[#222222]" />
                      <span className="text-[14px] font-normal text-[#222222]">
                        {pro.rating ? Number(pro.rating).toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[15px] text-slate-500 font-medium leading-tight truncate">
                    {loggedIn ? (pro.location || "Zimbabwe") : extractCity(pro.location || "Zimbabwe")}
                  </p>

                  <p className="text-[15px] text-slate-500 font-medium leading-tight">
                    {pro.years_of_experience != null ? `${pro.years_of_experience}+ years experience` : pro.service_category || "General Services"}
                  </p>

                  <div className="pt-1.5 flex items-baseline justify-between gap-1.5">
                    <div className="flex items-baseline gap-1">
                      {loggedIn ? (
                        <>
                          <span className="text-[15px] font-bold text-[#222222]">{pro.rate || "$15/hr"}</span>
                          <span className="text-[15px] font-medium text-slate-500">/ hr</span>
                        </>
                      ) : (
                        <span className="text-[13px] font-medium text-slate-400">Login to see rate</span>
                      )}
                    </div>

                    <div className="text-[13px] font-bold flex items-center gap-0.5" style={{ color: primary }}>
                      View profile
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
