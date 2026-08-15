import { Link } from "react-router-dom"

const primary = "var(--accent-color, #2563eb)"

const CheckIcon = () => (
  <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const features = [
  {
    icon: "lnr lnr-checkmark-circle",
    title: "Verified Professionals",
    description: "All providers undergo identity verification. Look for the verified badge on profiles to know you're hiring a trusted expert.",
  },
  {
    icon: "lnr lnr-smartphone",
    title: "No App Download",
    description: "Connect directly through WhatsApp — no new apps to install. Get updates, negotiate, and hire right where you already chat.",
  },
  {
    icon: "lnr lnr-diamond",
    title: "Zero Commission Fees",
    description: "We don't take a cut from your bookings. Providers keep 100% of their earnings. Service seekers pay no platform fees.",
  },
  {
    icon: "lnr lnr-map-marker",
    title: "Location-Based Matching",
    description: "Find professionals near you. Filter by city and service radius to get the most relevant results in your area.",
  },
  {
    icon: "lnr lnr-star",
    title: "Real Reviews & Ratings",
    description: "Every review is from a verified client. Transparent ratings help you choose the right professional with confidence.",
  },
  {
    icon: "lnr lnr-clock",
    title: "Fast & Simple Setup",
    description: "Create an account in under 2 minutes using just your phone number and a 4-digit PIN. No lengthy forms or paperwork.",
  },
]

const plans = [
  {
    name: "Free Visibility",
    price: "$0",
    period: "forever",
    features: [
      "Public profile listing",
      "Appear in search results",
      "Receive direct WhatsApp inquiries",
      "Basic analytics dashboard",
      "Manage your availability",
    ],
    cta: "Get Started Free",
    accent: false,
  },
  {
    name: "Premium Plan",
    price: "$5",
    period: "per month",
    features: [
      "Everything in Free",
      "Priority placement in search",
      "Premium badge on your profile",
      "Featured in category highlights",
      "Advanced analytics & insights",
      "Priority support",
      "Higher contact reveal rate",
    ],
    cta: "Upgrade to Premium",
    accent: true,
  },
]

export function PlatformFeatures({ showPlans = true }: { showPlans?: boolean }) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Why Choose SkillzLink */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Why Choose SkillzLink</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We've built a platform that puts trust, simplicity, and local expertise first.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f) => (
            <div key={f.title} className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:border-[var(--accent-light)] group-hover:text-[var(--accent-color)] transition-colors">
                <i className={`${f.icon} text-xl text-gray-600 group-hover:text-[var(--accent-color)] transition-colors`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {showPlans && (
          <>
            {/* Provider Plans */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-[13px] font-bold tracking-wide mb-8" style={{ backgroundColor: primary }}>
                <i className="lnr lnr-diamond text-sm" />
                Provider Plans
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#222222] mb-6 tracking-tight leading-[1.1]">
                Choose Your Visibility Level
              </h2>
              <p className="text-lg text-[#717171] max-w-2xl mx-auto font-normal leading-relaxed">
                Start free and upgrade anytime. Premium providers get priority placement and more client visibility.
              </p>
              <div className="w-12 h-1 mx-auto mt-8 rounded-full" style={{ backgroundColor: primary }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-[2rem] flex flex-col h-full bg-white transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${
                    plan.accent ? "shadow-lg" : "border-2 border-[#ebebeb]"
                  }`}
                  style={plan.accent ? { border: `2px solid ${primary}` } : undefined}
                >
                  {plan.accent && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent-light)] to-transparent rounded-bl-full pointer-events-none" />
                  )}

                  <div className="mb-6 relative z-10">
                    {plan.accent && (
                      <span className="inline-block text-white text-[13px] font-bold px-3 py-1 rounded-full mb-4" style={{ backgroundColor: primary }}>
                        RECOMMENDED
                      </span>
                    )}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${primary}15` }}>
                      <i className={`${plan.accent ? "lnr lnr-star" : "lnr lnr-diamond"} text-2xl`} style={{ color: primary }} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#222222] mb-2">{plan.name}</h3>
                    <p className="text-[#717171] font-medium leading-relaxed mb-6">
                      {plan.accent
                        ? "Everything in Free, plus priority placement and advanced visibility tools to win more clients."
                        : "Create a public profile and start receiving client inquiries at no cost."}
                    </p>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-black text-[#222222] tracking-tight">{plan.price}</span>
                      <span className="text-[15px] text-[#717171] ml-2 font-medium">/ {plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 flex-1 my-8 border-t border-[#ebebeb] pt-8 relative z-10">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start">
                        <span style={{ color: primary }}><CheckIcon /></span>
                        <span className="text-[15px] text-[#222222] font-medium leading-tight ml-3">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto relative z-10">
                    <Link
                      to="/register"
                      className={`block w-full text-center py-4 rounded-xl text-[16px] font-bold transition-all active:scale-95 ${
                        plan.accent
                          ? "text-white shadow-md hover:shadow-lg"
                          : "bg-white hover:bg-[#F7F7F7] text-[#222222] border-2 border-[#ebebeb]"
                      }`}
                      style={plan.accent ? { backgroundColor: primary } : undefined}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
