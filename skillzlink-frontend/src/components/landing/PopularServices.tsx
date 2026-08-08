import { Link } from "react-router-dom"

const services = [
  { name: "Plumbing", img: "/images/categories/img-01.png", icon: "lnr-drop", slug: "plumbing", description: "Leak repairs, pipe installations, and emergency plumbing services." },
  { name: "Electrical", img: "/images/categories/img-02.png", icon: "lnr-lightning-bolt", slug: "electrical", description: "Wiring, fault finding, and certified electrical repairs." },
  { name: "Cleaning", img: "/images/categories/img-03.png", icon: "lnr-magic-wand", slug: "cleaning", description: "Home and office cleaning professionals near you." },
  { name: "Tutoring", img: "/images/categories/img-04.png", icon: "lnr-graduation-hat", slug: "tutoring", description: "Qualified tutors for school subjects and exam support." },
  { name: "Carpentry", img: "/images/categories/img-05.png", icon: "lnr-construction", slug: "carpentry", description: "Custom furniture, fittings, and wood repairs." },
  { name: "Painting", img: "/images/categories/img-06.png", icon: "lnr-highlight", slug: "painting", description: "Interior and exterior painting for homes and offices." },
  { name: "Gardening", img: "/images/categories/img-07.png", icon: "lnr-leaf", slug: "gardening", description: "Lawn care, landscaping, and garden maintenance." },
  { name: "Appliance Repair", img: "/images/categories/img-08.png", icon: "lnr-cog", slug: "appliance-repair", description: "Fixes for fridges, washers, stoves, and other appliances." },
]

export function PopularServices() {
  return (
    <section className="py-24 bg-slate-50 relative z-20 -mt-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Explore Categories</h2>
          <p className="text-lg text-slate-500">Find the right professional for your needs from our top-rated service categories.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link 
              key={service.slug} 
              to={`/nearby-professionals?service=${service.slug}`}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                <i className={`lnr ${service.icon} text-2xl`} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-rose-500 transition-colors">
                {service.name}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm flex-1 mb-4">
                {service.description}
              </p>
              <div className="flex items-center text-rose-500 font-semibold text-sm mt-auto opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                Explore pros <i className="lnr lnr-arrow-right ml-1" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/nearby-professionals" className="inline-flex items-center justify-center px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-lg hover:bg-slate-50 hover:text-rose-500 transition-colors shadow-sm">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}
