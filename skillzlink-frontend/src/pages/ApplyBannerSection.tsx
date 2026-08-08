import { Link } from "react-router-dom"

const cards = [
  {
    icon: "lnr lnr-users",
    title: "Become an Affiliate",
    description: "Earn commissions by referring service seekers and providers to SkillzLink",
    link: "/apply?type=affiliate",
  },
  {
    icon: "lnr lnr-laptop",
    title: "Become an Agent",
    description: "Help connect seekers with the right providers in your area",
    link: "/apply?type=agent",
  },
  {
    icon: "lnr lnr-briefcase",
    title: "Become a Provider",
    description: "Offer your professional services to thousands of seekers",
    link: "/apply?type=provider",
  },
]

export function ApplyBannerSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Join the SkillzLink Network</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Choose how you'd like to partner with us</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 mx-auto mb-3 flex items-center justify-center">
                <i className={card.icon} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{card.description}</p>
              <Link to={card.link} className="text-sm font-medium text-[var(--accent-color)] hover:underline">
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
