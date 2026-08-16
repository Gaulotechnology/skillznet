import { useState } from "react"
import { Link } from "react-router-dom"

const primary = "var(--accent-color, #2563eb)"

const seekerSteps = [
  {
    step: "01",
    icon: "lnr lnr-magnifier",
    title: "Search for a Service",
    description: "Browse categories or search for the exact professional you need. Filter by city and service type to find the best match near you.",
  },
  {
    step: "02",
    icon: "lnr lnr-users",
    title: "Compare Providers",
    description: "View profiles, ratings, and reviews. See verified badges and past work to make an informed decision before reaching out.",
  },
  {
    step: "03",
    icon: "lnr lnr-bubble",
    title: "Connect & Hire",
    description: "Reveal the provider's contact and connect instantly via WhatsApp. Negotiate rates, share details, and hire directly — no middleman fees.",
  },
  {
    step: "04",
    icon: "lnr lnr-star",
    title: "Rate & Review",
    description: "After the service is complete, leave a review to help the community. Your feedback raises standards and helps others find great professionals.",
  },
]

const providerSteps = [
  {
    step: "01",
    icon: "lnr lnr-plus-circle",
    title: "Create Your Profile",
    description: "Sign up in minutes with your phone number. Add your skills, service area, rates, and portfolio to stand out from the crowd.",
  },
  {
    step: "02",
    icon: "lnr lnr-checkmark-circle",
    title: "Get Verified",
    description: "Complete identity verification to earn a verified badge. Verified providers appear higher in search results and get more client trust.",
  },
  {
    step: "03",
    icon: "lnr lnr-phone-handset",
    title: "Receive Client Requests",
    description: "Clients find your profile, view your work, and contact you directly through WhatsApp. Respond on your own terms — no app required.",
  },
  {
    step: "04",
    icon: "lnr lnr-chart-bars",
    title: "Grow Your Business",
    description: "Build your reputation with reviews, track your analytics, and subscribe to premium plans for better visibility and more leads.",
  },
]

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"seeker" | "provider">("seeker")

  const steps = activeTab === "seeker" ? seekerSteps : providerSteps

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-[13px] font-bold tracking-wide mb-8" style={{ backgroundColor: primary }}>
            <i className="lnr lnr-checkmark-circle text-sm" />
            Simple 4-step process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#222222] mb-6 tracking-tight leading-[1.1]">
            How SkillzLink Works
          </h2>
          <p className="text-lg text-[#717171] max-w-2xl mx-auto font-normal leading-relaxed">
            Whether you're hiring or offering services, getting started is simple and takes just a few minutes.
          </p>
          <div className="w-12 h-1 mx-auto mt-8 rounded-full" style={{ backgroundColor: primary }} />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex bg-[#F7F7F7] rounded-2xl p-1.5">
            <button
              onClick={() => setActiveTab("seeker")}
              className={`px-7 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "seeker"
                  ? "bg-white text-[#222222] shadow-sm"
                  : "text-[#717171] hover:text-[#222222]"
              }`}
            >
              For Service Seekers
            </button>
            <button
              onClick={() => setActiveTab("provider")}
              className={`px-7 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "provider"
                  ? "bg-white text-[#222222] shadow-sm"
                  : "text-[#717171] hover:text-[#222222]"
              }`}
            >
              For Providers
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="group bg-white border border-[#ebebeb] rounded-[1.5rem] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Step number watermark */}
              <div className="absolute top-4 right-5 text-7xl font-black text-[#F7F7F7] leading-none select-none pointer-events-none">
                {s.step}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                style={{ backgroundColor: `${primary}12` }}
              >
                <i className={`${s.icon} text-2xl`} style={{ color: primary }} />
              </div>

              <h3 className="text-lg font-bold text-[#222222] mb-3 relative z-10">{s.title}</h3>
              <p className="text-[#717171] text-[15px] leading-relaxed relative z-10">{s.description}</p>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: primary }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to={activeTab === "seeker" ? "/nearby-professionals" : "/register"}
            className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-[1rem] font-bold text-[16px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{ backgroundColor: primary, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.4)" }}
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
