import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { publicApi } from "../../services/api"
import { SkillzNetLogo } from "./SkillzNetLogo"

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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Newsletter & Brand Area */}
        <div className="py-12 border-b border-[#dddddd]/60 flex flex-col lg:flex-row gap-10 items-start justify-between">
          <div className="max-w-md space-y-4">
            <div className="mb-2">
              <SkillzNetLogo logoUrl={contact.logoUrl || undefined} onClick={scrollTop} />
            </div>
            <p className="text-[#222222] font-semibold text-lg tracking-tight">Stay in the loop</p>
            <p className="text-[#717171] text-[14px] leading-relaxed">
              Subscribe for the latest service insights, trusted professionals, and platform updates across Zimbabwe.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto lg:min-w-[400px]">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Flex-wrapper: icon + input as siblings — avoids main.css padding override */}
              <div
                className="flex-1 flex items-center gap-3 bg-white border border-[#dddddd] rounded-xl px-4 transition-all duration-300 focus-within:border-[var(--accent-color)] focus-within:shadow-[0_0_0_3px_rgba(255,56,92,0.12)]"
                style={{ height: '52px' }}
              >
                <MailIcon size={16} className="shrink-0 text-[#717171]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, height: '100%', width: '100%', fontSize: '14px', color: '#222222' }}
                  className="placeholder-[#717171]"
                />
              </div>
              <button
                type="submit"
                className="text-white px-8 rounded-xl font-bold text-[14px] transition-all active:scale-95 whitespace-nowrap hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: primary, height: '52px' }}
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
            <div className="flex flex-col gap-3">
              {[
                { name: "Home", path: "/" },
                { name: "How it works", path: "/how-it-works" },
                { name: "About", path: "/about" },
                { name: "Careers", path: "/careers" },
              ].map((l) => (
                <div key={l.name}>
                  <Link to={l.path} onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors text-[14px] font-medium">
                    {l.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Discovery</h4>
            <div className="flex flex-col gap-3">
              {cityLinks.map((city) => (
                <div key={city}>
                  <Link to={`/nearby-professionals?city=${encodeURIComponent(city.toLowerCase())}`} onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors text-[14px] font-medium">
                    {city}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Explore</h4>
            <div className="flex flex-col gap-3">
              {serviceLinks.map((s) => (
                <div key={s.slug}>
                  <Link to={`/nearby-professionals?service=${s.slug}`} onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors text-[14px] font-medium">
                    {s.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-[#222222] font-semibold text-[14px]">Support</h4>
            <div className="flex flex-col gap-3 text-[14px] font-medium">
              {contact.phone && (
                <div>
                  <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.email && (
                <div>
                  <a href={`mailto:${contact.email}`} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline transition-colors">
                    {contact.email}
                  </a>
                </div>
              )}
              <div>
                <span className="text-[#717171]">Zimbabwe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#dddddd]/60 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: copyright & legal */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 text-[#222222] text-[14px] font-medium leading-none">
            <span>© {year} SkillzLink</span>
            <span className="hidden md:inline text-[16px] leading-[0]">·</span>
            <Link to="/terms-and-conditions" onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline leading-none">
              Terms
            </Link>
            <span className="hidden md:inline text-[16px] leading-[0]">·</span>
            <Link to="/privacy-policy" onClick={scrollTop} className="text-[#717171] hover:text-[var(--accent-color)] hover:underline leading-none">
              Privacy
            </Link>
          </div>

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
