import { Link } from "react-router-dom"

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

export function PlatformFeatures() {
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

        {/* Provider Plans */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-color)] bg-[var(--accent-light)] rounded-full px-4 py-1.5 mb-3">
            <i className="lnr lnr-diamond" />
            Provider Plans
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Visibility Level</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            Start free and upgrade anytime. Premium providers get priority placement and more client visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.accent
                  ? "border-[var(--accent-color)] bg-white shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--accent-color)] text-white text-xs font-bold rounded-full">
                  RECOMMENDED
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.accent
                    ? "bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]"
                    : "border-2 border-gray-900 text-gray-900 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
