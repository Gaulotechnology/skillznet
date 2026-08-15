import { Link } from "react-router-dom"

// ─── Inline icons (lucide-equivalent, no extra deps) ─────────────────────────
function Icon({ children, size = 15, className = "", filled = false }: { children: React.ReactNode; size?: number; className?: string; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

const Zap = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className} filled>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
)
const Clock = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
)
const Shield = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
)
const CheckCircle = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>
)
const ChevronRight = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><polyline points="9 18 15 12 9 6" /></Icon>
)
const Search = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>
)
const User = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>
)
const MapPin = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>
)
const Star = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className} filled><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
)
const Heart = ({ size, className }: { size?: number; className?: string }) => (
  <Icon size={size} className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>
)

const primary = "var(--accent-color, #2563eb)"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>
      {/* Full-bleed background photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-home-helpers.png"
          className="w-full h-full object-cover object-center"
          alt="Trusted local professionals"
        />
        {/* Bottom fade into white so the page flows naturally */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" style={{ top: "40%" }} />
        {/* Subtle left overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* Hero text — top left */}
      <div className="relative z-10 container mx-auto px-6 lg:px-10 pt-28 md:pt-36 lg:pt-44 xl:pt-52">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-[1.08] tracking-tight drop-shadow-sm">
            Trusted pros,<br />right where you need them.
          </h1>
          <p className="mt-4 text-white/90 text-lg md:text-xl font-medium drop-shadow-sm">
            Verified plumbers, electricians, cleaners &amp; more across Zimbabwe.
          </p>
        </div>
      </div>

      {/* ── Hero CTA Cards ── */}
      <div className="relative z-10 w-full mt-10 md:mt-14 pb-16">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
            {/* ── Book a Service Card ── */}
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-[2rem] p-8 flex flex-col gap-6 cursor-pointer hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: primary,
                boxShadow: "0 20px 60px -10px rgba(0,0,0,0.35)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Zap size={28} className="text-white" />
                </div>
                <span className="text-[13px] font-bold text-white/80 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full tracking-wide">
                  INSTANT
                </span>
              </div>

              <div className="relative z-10 flex-1">
                <h2 className="text-3xl font-bold text-white leading-tight tracking-tight mb-2">
                  Book a<br />Service
                </h2>
                <p className="text-white/80 text-[16px] leading-relaxed font-medium">
                  Tell us what you need and get matched with a verified pro today.
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-2.5">
                {[
                  { icon: <Clock size={15} />, text: "Book in under 60 seconds" },
                  { icon: <Shield size={15} />, text: "Background-checked pros" },
                  { icon: <CheckCircle size={15} />, text: "Pay only on completion" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-white/90 text-[14px] font-medium">
                    {f.icon}<span>{f.text}</span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-white font-bold text-[16px]">Post a Request</span>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ChevronRight size={20} className="text-gray-900" />
                </div>
              </div>
            </Link>

            {/* ── Browse Professionals Card ── */}
            <Link
              to="/nearby-professionals"
              className="group relative overflow-hidden bg-white rounded-[2rem] p-8 flex flex-col gap-6 cursor-pointer border border-[#dddddd] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.10)] hover:shadow-[0_28px_70px_-10px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-slate-100 rounded-full pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-slate-50 rounded-full pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black/5">
                  <Search size={28} className="text-[#222222]" />
                </div>
                <span className="text-[13px] font-bold text-[#717171] bg-[#F7F7F7] px-3 py-1.5 rounded-full tracking-wide">
                  DIRECTORY
                </span>
              </div>

              <div className="relative z-10 flex-1">
                <h2 className="text-3xl font-bold text-[#222222] leading-tight tracking-tight mb-2">
                  Browse<br />Professionals
                </h2>
                <p className="text-[#717171] text-[16px] leading-relaxed font-medium">
                  Find, compare and contact verified pros near you.
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-2.5">
                {[
                  { icon: <User size={15} />, text: "Full profiles & reviews" },
                  { icon: <MapPin size={15} />, text: "Filter by city & skills" },
                  { icon: <Star size={15} />, text: "Rated & verified pros" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[#444] text-[14px] font-medium">
                    {f.icon}<span>{f.text}</span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#ebebeb]">
                <span className="text-[#222222] font-bold text-[16px]">View Professionals</span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md"
                  style={{ backgroundColor: primary }}
                >
                  <ChevronRight size={20} className="text-white" />
                </div>
              </div>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-6 mt-6">
            {[
              { icon: <Star size={14} className="text-white" />, text: "Top-rated professionals" },
              { icon: <CheckCircle size={14} className="text-white" />, text: "Background checked" },
              { icon: <Heart size={14} className="text-white" />, text: "500+ active pros" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white drop-shadow-sm">
                {item.icon}
                <span className="text-[14px] font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
