import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { publicApi } from "../../services/api"

const primary = "var(--accent-color, #2563eb)"

// ─── Inline icons ─────────────────────────────────────────────────────────────
const MailIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const GlobeIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export function Footer() {
  const [contact, setContact] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    publicApi.getThemeSettings().then(res => {
      if (res.settings) setContact(res.settings)
    }).catch(() => {})
  }, [])

  const year = new Date().getFullYear()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 4000)
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const socials = [
    { key: "facebook", icon: "fab fa-facebook-f", label: "Facebook" },
    { key: "twitter", icon: "fab fa-twitter", label: "Twitter" },
    { key: "instagram", icon: "fab fa-instagram", label: "Instagram" },
    { key: "linkedin", icon: "fab fa-linkedin-in", label: "LinkedIn" },
  ].filter(s => contact[s.key])

  const cityLinks = ["Harare", "Bulawayo", "Mutare", "Gweru"]

  const serviceLinks = [
    { name: "Plumbers", slug: "plumbing" },
    { name: "Electricians", slug: "electrical" },
    { name: "Cleaners", slug: "cleaning" },
    { name: "Tutors", slug: "tutoring" },
  ]

  return (
    <footer className="w-full clear-both bg-[#F7F7F7] border-t border-[#ebebeb] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Newsletter & Brand Area */}
        <div className="py-12 border-b border-[#dddddd]/60 flex flex-col lg:flex-row gap-10 items-start justify-between">
          <div className="max-w-md space-y-4">
            <Link to="/" onClick={scrollTop} className="inline-block transition-transform hover:scale-105 mb-2">
              <span className="text-[#222222] font-bold text-xl tracking-tight">
                Skillz<span style={{ color: primary }}>Link</span>
              </span>
            </Link>
            <p className="text-[#222222] font-semibold text-lg tracking-tight">Stay in the loop</p>
            <p className="text-[#717171] text-[14px] leading-relaxed">
              Subscribe for the latest service insights, trusted professionals, and platform updates across Zimbabwe.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto lg:min-w-[400px]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MailIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#dddddd] rounded-xl pl-12 pr-4 py-3.5 text-[#222222] placeholder:text-[#717171] focus:outline-none focus:border-[var(--accent-color)] text-[14px] transition-colors duration-300"
                />
              </div>
              <button
                type="submit"
                className="text-white px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all active:scale-95 whitespace-nowrap hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: primary }}
              >
                Subscribe
              </button>
            </div>
            {subscribed && (
              <p className="text-sm mt-3 font-semibold text-center sm:text-left" style={{ color: primary }}>
                ✓ Successfully subscribed!
              </p>
            )}
          </form>
        </div>

        {/* Main Links Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Company</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {[
                { name: "Home", path: "/" },
                { name: "How it works", path: "/how-it-works" },
                { name: "About", path: "/about" },
                { name: "Careers", path: "/careers" },
              ].map((l) => (
                <li key={l.name}>
                  <Link to={l.path} onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors text-[14px] font-medium block">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discovery */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Discovery</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {cityLinks.map((city) => (
                <li key={city}>
                  <Link to={`/nearby-professionals?city=${encodeURIComponent(city.toLowerCase())}`} onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors text-[14px] font-medium block">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Explore</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {serviceLinks.map((s) => (
                <li key={s.slug}>
                  <Link to={`/nearby-professionals?service=${s.slug}`} onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors text-[14px] font-medium block">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Support</h4>
            <ul className="space-y-3 text-[14px] font-medium list-none p-0 m-0">
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors block">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors block">
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <span className="text-[#717171] block">Zimbabwe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#dddddd]/60 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: copyright & legal */}
          <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 text-[#222222] text-[14px] font-medium list-none p-0 m-0 leading-none">
            <li>© {year} SkillzLink</li>
            <li className="hidden md:inline text-[16px] leading-[0]">·</li>
            <li>
              <Link to="/terms-and-conditions" onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline block leading-none">
                Terms
              </Link>
            </li>
            <li className="hidden md:inline text-[16px] leading-[0]">·</li>
            <li>
              <Link to="/privacy-policy" onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline block leading-none">
                Privacy
              </Link>
            </li>
          </ul>

          {/* Right: location & socials */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#222222] text-[14px] font-medium">
              <GlobeIcon size={16} />
              <span>Zimbabwe</span>
            </div>

            {socials.length > 0 && (
              <div className="flex items-center gap-5">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={contact[s.key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="text-[#222222] hover:text-[var(--accent-color)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                  >
                    <i className={`${s.icon} text-base`} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
