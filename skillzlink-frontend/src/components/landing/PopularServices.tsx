import { Link } from "react-router-dom"

const primary = "var(--accent-color, #2563eb)"

const services = [
  { name: "Plumbing", icon: "lnr-drop", slug: "plumbing", description: "Leak repairs, pipe installations, and emergency plumbing services." },
  { name: "Electrical", icon: "lnr-power-switch", slug: "electrical", description: "Wiring, fault finding, and certified electrical repairs." },
  { name: "Cleaning", icon: "lnr-magic-wand", slug: "cleaning", description: "Home and office cleaning professionals near you." },
  { name: "Tutoring", icon: "lnr-graduation-hat", slug: "tutoring", description: "Qualified tutors for school subjects and exam support." },
  { name: "Carpentry", icon: "lnr-construction", slug: "carpentry", description: "Custom furniture, fittings, and wood repairs." },
  { name: "Painting", icon: "lnr-highlight", slug: "painting", description: "Interior and exterior painting for homes and offices." },
  { name: "Gardening", icon: "lnr-leaf", slug: "gardening", description: "Lawn care, landscaping, and garden maintenance." },
  { name: "Appliance Repair", icon: "lnr-cog", slug: "appliance-repair", description: "Fixes for fridges, washers, stoves, and other appliances." },
]

export function PopularServices() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: primary }} />
              <span className="font-bold tracking-widest text-[12px] uppercase" style={{ color: primary }}>
                Browse Services
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222222] tracking-tight leading-[1.1]">
              Explore Categories
            </h2>
            <p className="text-[#717171] text-lg mt-3">Find the right professional for your needs</p>
          </div>

          <Link
            to="/nearby-professionals"
            className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-black hover:bg-black hover:text-white rounded-2xl px-8 py-4 font-bold transition-all text-base group shadow-sm w-fit"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/nearby-professionals?service=${service.slug}`}
              className="group bg-white border border-[#ebebeb] rounded-[1.5rem] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden block"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                style={{ backgroundColor: `${primary}12` }}
              >
                <i className={`lnr ${service.icon} text-2xl`} style={{ color: primary }} />
              </div>
              <h3 className="text-lg font-bold text-[#222222] mb-2 relative z-10">{service.name}</h3>
              <p className="text-[#717171] text-[15px] leading-relaxed relative z-10 line-clamp-2">{service.description}</p>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: primary }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
