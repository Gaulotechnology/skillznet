import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-16 pb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent-color)] flex items-center justify-center">
                <span className="text-white font-black text-xs">SL</span>
              </div>
              <span className="font-extrabold text-xl text-[var(--text-primary)] tracking-tight">SkillzLink</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 max-w-sm">
              SkillzLink connects you with trusted, verified local professionals across
              Zimbabwe. From plumbers to tutors, find the right expert near you — fast,
              secure, and integrated with WhatsApp.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: 'fa-facebook-f', label: 'Facebook' },
                { icon: 'fa-twitter', label: 'Twitter' },
                { icon: 'fa-instagram', label: 'Instagram' },
                { icon: 'fa-youtube', label: 'YouTube' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href="#/" 
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-colors"
                >
                  <i className={`fab ${social.icon} text-sm`} />
                </a>
              ))}
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
