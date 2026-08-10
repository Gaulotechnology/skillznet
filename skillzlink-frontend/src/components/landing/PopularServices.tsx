import { Link } from "react-router-dom"

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
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Explore Categories</h2>
            <p className="text-gray-500 text-sm mt-1">Find the right professional for your needs</p>
          </div>
          <Link to="/nearby-professionals" className="text-sm font-medium text-[var(--accent-color)] hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/nearby-professionals?service=${service.slug}`}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mb-3">
                <i className={`lnr ${service.icon} text-lg`} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{service.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
