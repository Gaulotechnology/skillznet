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

  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">SkillzLink</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link to="/news" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li><Link to="/trust-and-safety" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Trust & Safety</Link></li>
              <li><Link to="/terms-and-conditions" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link to="/nearby-professionals?service=plumbing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Plumbers</Link></li>
              <li><Link to="/nearby-professionals?service=electrical" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Electricians</Link></li>
              <li><Link to="/nearby-professionals?service=cleaning" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Cleaners</Link></li>
              <li><Link to="/nearby-professionals?service=tutoring" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Tutors</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2.5">
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.whatsapp && (
                <li>
                  <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    WhatsApp
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && (
                <li>
                  <span className="text-sm text-gray-400">{contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>© {year} SkillzLink</span>
            <span className="hidden sm:inline">·</span>
            <Link to="/privacy-policy" className="hover:text-gray-600 transition-colors hidden sm:inline">Privacy</Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/terms-and-conditions" className="hover:text-gray-600 transition-colors hidden sm:inline">Terms</Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { icon: 'fa-facebook-f', key: 'facebook' },
              { icon: 'fa-twitter', key: 'twitter' },
              { icon: 'fa-instagram', key: 'instagram' },
            ].map(({ icon, key }) => {
              const url = contact[key]
              if (!url) return null
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fab ${icon} text-sm`} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
