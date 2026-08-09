import { useState } from "react"
import { Link } from "react-router-dom"

const seekerSteps = [
  {
    step: "01",
    icon: "lnr lnr-magnifier",
    title: "Search for a Service",
    description: "Browse categories or search for the exact professional you need. Filter by city and service type to find the best match near you.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    step: "02",
    icon: "lnr lnr-users",
    title: "Compare Providers",
    description: "View profiles, ratings, and reviews. See verified badges and past work to make an informed decision before reaching out.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    step: "03",
    icon: "lnr lnr-bubble",
    title: "Connect & Hire",
    description: "Reveal the provider's contact and connect instantly via WhatsApp. Negotiate rates, share details, and hire directly — no middleman fees.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    step: "04",
    icon: "lnr lnr-star",
    title: "Rate & Review",
    description: "After the service is complete, leave a review to help the community. Your feedback raises standards and helps others find great professionals.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

const providerSteps = [
  {
    step: "01",
    icon: "lnr lnr-plus-circle",
    title: "Create Your Profile",
    description: "Sign up in minutes with your phone number. Add your skills, service area, rates, and portfolio to stand out from the crowd.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    step: "02",
    icon: "lnr lnr-checkmark-circle",
    title: "Get Verified",
    description: "Complete identity verification to earn a verified badge. Verified providers appear higher in search results and get more client trust.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    step: "03",
    icon: "lnr lnr-phone-handset",
    title: "Receive Client Requests",
    description: "Clients find your profile, view your work, and contact you directly through WhatsApp. Respond on your own terms — no app required.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    step: "04",
    icon: "lnr lnr-chart-bars",
    title: "Grow Your Business",
    description: "Build your reputation with reviews, track your analytics, and subscribe to premium plans for better visibility and more leads.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"seeker" | "provider">("seeker")

  const steps = activeTab === "seeker" ? seekerSteps : providerSteps

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">How SkillzLink Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you're hiring or offering services, getting started is simple and takes just a few minutes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("seeker")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "seeker"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              For Service Seekers
            </button>
            <button
              onClick={() => setActiveTab("provider")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "provider"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              For Providers
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="relative group">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <i className={`${s.icon} text-xl ${s.color}`} />
                  </div>
                  <span className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to={activeTab === "seeker" ? "/register" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--accent-color)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            {activeTab === "seeker" ? "Find a Professional" : "Join as a Provider"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
