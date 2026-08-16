import { Link } from "react-router-dom"

const seekerSteps = [
  {
    num: "1",
    icon: "lnr lnr-magnifier",
    title: "Search & Filter",
    desc: "Browse our directory of verified professionals. Filter by city, service category, or price range to find the perfect match for your needs.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    num: "2",
    icon: "lnr lnr-user",
    title: "Review Profiles",
    desc: "Check out their past work, read reviews from other Zimbabweans, and verify their ID status before making contact.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
  },
  {
    num: "3",
    icon: "fab fa-whatsapp",
    title: "Chat & Hire on WhatsApp",
    desc: "Click the WhatsApp button to instantly message the professional. Negotiate, share photos, and get the job done — no extra app needed.",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
  },
]

const providerSteps = [
  {
    num: "1",
    icon: "lnr lnr-laptop-phone",
    title: "Create Your Profile",
    desc: "Sign up with your phone number, pick your service category, set your working radius, and write a compelling bio that attracts clients.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    num: "2",
    icon: "lnr lnr-license",
    title: "Get ID Verified",
    desc: "Provide your National ID for verification. Once approved, you'll earn a verified badge that builds instant trust with potential clients.",
    color: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
  },
  {
    num: "3",
    icon: "lnr lnr-bubble",
    title: "Receive Client Leads",
    desc: "Clients find you through the directory and message you directly on WhatsApp to discuss their project and negotiate terms.",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    num: "4",
    icon: "lnr lnr-star",
    title: "Build Your Reputation",
    desc: "Complete jobs successfully, collect 5-star reviews, and climb the rankings. Better reviews mean more visibility and more clients.",
    color: "from-yellow-500 to-amber-500",
    bg: "bg-yellow-50",
  },
]

const trustItems = [
  { icon: "fas fa-id-card", title: "ID Verified Professionals", desc: "Every provider is verified with their National ID before being listed." },
  { icon: "lnr lnr-history", title: "Real Reviews", desc: "Ratings and reviews come from real clients who have actually hired the professional." },
  { icon: "fab fa-whatsapp", title: "WhatsApp First", desc: "No app to download. Communicate, share media, and negotiate all on WhatsApp." },
  { icon: "lnr lnr-map-marker", title: "Local to You", desc: "Find professionals in your city — Harare, Bulawayo, Mutare, and across Zimbabwe." },
]

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-[var(--accent-light)]/20 border-b border-[var(--border-color)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--accent-rgb,99,102,241),0.08),transparent_60%)]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--accent-color)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[var(--accent-color)]/3 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="text-[var(--accent-color)] font-semibold text-sm tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-5 tracking-tight leading-tight">
            Hire a trusted professional<br />
            <span className="text-[var(--accent-color)]">in just a few steps.</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Whether you need a plumber, electrician, or tutor — or you're a professional looking for more clients — 
            SkillzLink makes it quick, simple, and WhatsApp-friendly.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/nearby-professionals" className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--accent-color)]/20">
              Find a Professional
            </Link>
            <Link to="/register" className="px-6 py-3 border-2 border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-semibold text-sm hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* For Seekers */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] text-xs font-semibold tracking-wider uppercase mb-4">
              For Clients
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">I need a professional</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Find and hire trusted, verified experts near you in three simple steps.
            </p>
          </div>

          {/* Steps with connectors */}
          <div className="grid md:grid-cols-3 gap-6 relative">
            {seekerSteps.map((step, i) => (
              <div key={step.num} className="relative group">
                <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Step number badge */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold text-lg flex items-center justify-center mb-5 shadow-lg`}>
                    {step.num}
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${step.icon} text-2xl`} style={{ 
                      background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
                {/* Connector arrow (desktop only) */}
                {i < seekerSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center">
                    <i className="lnr lnr-chevron-right text-2xl text-[var(--border-color)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wider uppercase mb-4">
              Why SkillzLink
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">Built for trust & simplicity</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Every feature is designed to make hiring professionals safe, fast, and effortless.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustItems.map(item => (
              <div key={item.title} className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 text-center hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-xl text-[var(--accent-color)]`} />
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Banner */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-200/50 text-green-800 text-xs font-semibold mb-4">
                  <i className="fab fa-whatsapp" /> Powered by WhatsApp
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">No app required.</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  SkillzLink connects you directly to professionals via WhatsApp — the app you already use every day. 
                  No downloads, no learning curve, just instant communication.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: "lnr lnr-bubble", text: "Instant messaging and notifications" },
                    { icon: "lnr lnr-camera", text: "Share photos, locations, and documents" },
                    { icon: "lnr lnr-phone-handset", text: "Voice calls directly from chat" },
                    { icon: "lnr lnr-clock", text: "Save data by using WhatsApp bundles" },
                  ].map(item => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center shrink-0 mt-0.5">
                        <i className={`${item.icon} text-green-700 text-sm`} />
                      </span>
                      <span className="text-gray-700 text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-emerald-400 rounded-3xl blur-2xl opacity-20" />
                  <div className="relative bg-white rounded-3xl border border-green-100 p-6 shadow-lg">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <i className="fab fa-whatsapp text-white text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Tafadzwa (Plumber)</p>
                        <p className="text-xs text-gray-500">online</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-green-50 rounded-xl p-3 ml-6">
                        <p className="text-sm text-gray-700">Hi! I saw your profile on SkillzLink. Can you fix a leaking pipe in Mabelreign?</p>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-3 mr-6">
                        <p className="text-sm text-gray-700">Sure! I'm available tomorrow morning. Can you send a photo of the pipe?</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 ml-6">
                        <p className="text-sm text-gray-700">Yes, here it is 📸</p>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-3 mr-6">
                        <p className="text-sm text-gray-700">I see the issue. I'll bring the parts. My rate is $25 for the repair.</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 ml-6">
                        <p className="text-sm text-gray-700">Perfect! See you at 9am 👍</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="py-16 md:py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] text-xs font-semibold tracking-wider uppercase mb-4">
              For Professionals
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">I am a professional</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Grow your business and get more local clients on SkillzLink.
            </p>
          </div>

          {/* Timeline-style for providers */}
          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border-color)] -translate-x-1/2" />
            
            {providerSteps.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={step.num} className={`relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 mb-12 last:mb-0 ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Connector dot */}
                  <div className={`hidden lg:flex absolute left-1/2 top-8 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold text-sm items-center justify-center -translate-x-1/2 shadow-lg z-10`}>
                    {step.num}
                  </div>
                  
                  {/* Content card */}
                  <div className={`flex-1 ${isLeft ? 'lg:pr-20 lg:text-right' : 'lg:pl-20'}`}>
                    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold text-lg flex items-center justify-center mb-4 lg:hidden`}>
                        {step.num}
                      </div>
                      <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mb-4 ${isLeft ? 'lg:ml-auto' : ''} group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`${step.icon} text-2xl`} />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden lg:block flex-1" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent-color)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Join thousands of Zimbabweans already using SkillzLink to find work and get things done.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-7 py-3.5 bg-white text-[var(--accent-color)] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg">
              Create Free Account
            </Link>
            <Link to="/nearby-professionals" className="px-7 py-3.5 bg-white/15 text-white border-2 border-white/30 rounded-xl font-semibold text-sm hover:bg-white/25 transition-all backdrop-blur-sm">
              Browse Professionals
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
