import { Link } from "react-router-dom"

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">How It Works</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Hire the best talent in your city or grow your business — in just a few simple steps.
          </p>
        </div>
      </section>

      {/* For Seekers */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">I Need a Professional</h2>
            <p className="text-[var(--text-secondary)]">Hire the best talent in your city in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "1", icon: "lnr lnr-magnifier", title: "Search & Filter", desc: "Browse our directory of verified professionals. Filter by city, service category, or price range to find the perfect match." },
              { num: "2", icon: "lnr lnr-user", title: "Review Profiles", desc: "Check out their past work, read reviews from other Zimbabweans, and verify their ID status before making contact." },
              { num: "3", icon: "fab fa-whatsapp", title: "Chat on WhatsApp", desc: "Click the WhatsApp button to instantly message the professional. Negotiate, share photos, and get the job done." },
            ].map(step => (
              <div key={step.num} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <i className={step.icon + " text-3xl text-[var(--accent-color)] mb-4 block"} />
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">No App Required</h2>
              <p className="text-[var(--accent-color)] font-medium mb-6">Connect seamlessly on WhatsApp</p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                We believe getting things done shouldn't require downloading another app. That's why SkillzLink connects you directly to professionals via WhatsApp — the app you already use every day.
              </p>
              <ul className="space-y-3">
                {[
                  "Instant notifications and messages",
                  "Share location and photos easily",
                  "Save data by using WhatsApp bundles",
                  "Keep all your conversations in one place",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <i className="lnr lnr-checkmark text-[var(--accent-color)] font-bold" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <img
                src="/images/whatsapp-mobile.png"
                alt="WhatsApp Integration"
                className="max-w-[300px] inline-block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">I am a Professional</h2>
            <p className="text-[var(--text-secondary)]">Grow your business and get more clients on SkillzLink</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", icon: "lnr lnr-laptop-phone", title: "Create Profile", desc: "Sign up with your phone number, add your service category, set your radius, and write a bio." },
              { num: "2", icon: "lnr lnr-license", title: "Get Verified", desc: "Provide your National ID. Once verified, you'll receive a badge that boosts trust." },
              { num: "3", icon: "lnr lnr-bubble", title: "Receive Leads", desc: "Clients find you in the directory and message you directly on WhatsApp to negotiate." },
              { num: "4", icon: "lnr lnr-star", title: "Build Reputation", desc: "Complete jobs successfully, collect 5-star reviews, and rank higher in search results." },
            ].map(step => (
              <div key={step.num} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <i className={step.icon + " text-3xl text-[var(--accent-color)] mb-4 block"} />
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--accent-color)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of Zimbabweans already using SkillzLink to get things done.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="bg-white text-[var(--accent-color)] hover:bg-gray-100 rounded-xl px-6 py-3 font-semibold transition">
              Create Free Account
            </Link>
            <Link to="/nearby-professionals" className="bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 rounded-xl px-6 py-3 font-semibold transition">
              Find a Professional
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
