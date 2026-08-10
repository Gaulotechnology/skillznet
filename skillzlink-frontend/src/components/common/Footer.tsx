import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { publicApi } from "../../services/api"

export function Footer() {
  const [contact, setContact] = useState<Record<string, string>>({})

  useEffect(() => {
    publicApi.getThemeSettings().then(res => {
      if (res.settings) setContact(res.settings)
    }).catch(() => {})
  }, [])

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-16 pb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Contact */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent-color)] flex items-center justify-center">
                <span className="text-white font-black text-xs">SL</span>
              </div>
              <span className="font-extrabold text-xl text-[var(--text-primary)] tracking-tight">SkillzLink</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 max-w-sm">
              SkillzLink connects you with trusted, verified local professionals across
              Zimbabwe. From plumbers to tutors, find the right expert near you — fast,
              secure, and integrated with WhatsApp.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 mb-5">
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                  <i className="lnr lnr-phone-handset text-xs" /> {contact.phone}
                </a>
              )}
              {contact.whatsapp && (
                <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-green-600 transition-colors">
                  <i className="fab fa-whatsapp text-xs" /> {contact.whatsapp}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                  <i className="lnr lnr-envelope text-xs" /> {contact.email}
                </a>
              )}
              {contact.address && (
                <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <i className="lnr lnr-map-marker text-xs" /> {contact.address}
                </span>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: 'fa-facebook-f', label: 'Facebook', key: 'facebook' },
                { icon: 'fa-twitter', label: 'Twitter', key: 'twitter' },
                { icon: 'fa-instagram', label: 'Instagram', key: 'instagram' },
                { icon: 'fa-youtube', label: 'YouTube', key: 'youtube' }
              ].map(({ icon, label, key }) => {
                const url = contact[key]
                return url ? (
                  <a 
                    key={key} 
                    href={url} 
                    target="_blank" rel="noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-colors"
                  >
                    <i className={`fab ${icon} text-sm`} />
                  </a>
                ) : (
                  <span key={key} className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)]/30 cursor-default">
                    <i className={`fab ${icon} text-sm`} />
                  </span>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">How It Works</Link></li>
              <li><Link to="/careers" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Careers</Link></li>
              <li><Link to="/terms-and-conditions" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/trust-and-safety" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Trust &amp; Safety</Link></li>
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/nearby-professionals?service=plumbing" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Plumbers Near You</Link></li>
              <li><Link to="/nearby-professionals?service=electrical" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Electricians Near You</Link></li>
              <li><Link to="/nearby-professionals?service=cleaning" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Cleaners Near You</Link></li>
              <li><Link to="/nearby-professionals?service=tutoring" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Tutors Near You</Link></li>
              <li><Link to="/nearby-professionals" className="text-[var(--accent-color)] text-sm font-medium hover:underline transition-colors">View All →</Link></li>
            </ul>
          </div>
        </div>

        {/* Join CTA Strip */}
        <div className="bg-[var(--accent-light)] border border-[var(--accent-color)]/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-base mb-1">New to SkillzLink?</h3>
            <p className="text-[var(--text-secondary)] text-sm">Find trusted professionals or grow your service business today.</p>
          </div>
          <Link to="/register" className="px-6 py-2.5 bg-[var(--accent-color)] text-white font-semibold text-sm rounded-lg hover:bg-[var(--accent-hover)] transition-colors shrink-0">
            Create Free Account
          </Link>
        </div>

        <hr className="border-[var(--border-color)] mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[var(--text-secondary)] text-xs">
          <p>© {new Date().getFullYear()} SkillzLink. All rights reserved.</p>
          <nav className="flex items-center gap-5">
            <Link to="/news" className="hover:text-[var(--accent-color)] transition-colors">News</Link>
            <Link to="/terms-and-conditions" className="hover:text-[var(--accent-color)] transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-[var(--accent-color)] transition-colors">Privacy</Link>
          </nav>
        </div>
        
      </div>
    </footer>
  )
}
