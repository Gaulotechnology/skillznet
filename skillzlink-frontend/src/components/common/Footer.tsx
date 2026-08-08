import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <span className="text-slate-900 font-black text-sm">SL</span>
              </div>
              <span className="font-extrabold text-3xl text-white tracking-tight">SkillzLink</span>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              SkillzLink connects you with trusted, verified local professionals across
              Zimbabwe. From plumbers to tutors, find the right expert near you — fast,
              secure, and integrated with WhatsApp.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
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
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
                >
                  <i className={`fab ${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/terms-and-conditions" className="text-slate-400 hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/trust-and-safety" className="text-slate-400 hover:text-white transition-colors">Trust &amp; Safety</Link></li>
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Explore More</h3>
            <ul className="space-y-4">
              <li><Link to="/nearby-professionals?service=plumbing" className="text-slate-400 hover:text-white transition-colors">Plumbers Near You</Link></li>
              <li><Link to="/nearby-professionals?service=electrical" className="text-slate-400 hover:text-white transition-colors">Electricians Near You</Link></li>
              <li><Link to="/nearby-professionals?service=cleaning" className="text-slate-400 hover:text-white transition-colors">Cleaners Near You</Link></li>
              <li><Link to="/nearby-professionals?service=tutoring" className="text-slate-400 hover:text-white transition-colors">Tutors Near You</Link></li>
              <li><Link to="/nearby-professionals" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">View All Pros <i className="lnr lnr-arrow-right ml-1" /></Link></li>
            </ul>
          </div>
        </div>

        {/* Join CTA Strip */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-white font-bold text-2xl mb-2">New to SkillzLink?</h3>
            <p className="text-slate-400 text-lg">Find trusted professionals or grow your service business today.</p>
          </div>
          <Link to="/register" className="px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-colors shrink-0">
            Create Free Account
          </Link>
        </div>

        <hr className="border-white/10 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm font-medium">
          <p>SkillzLink &copy; {new Date().getFullYear()}. All rights reserved.</p>
          <nav className="flex items-center gap-6">
            <Link to="/news" className="hover:text-slate-300 transition-colors">News</Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </nav>
        </div>
        
      </div>
    </footer>
  )
}
