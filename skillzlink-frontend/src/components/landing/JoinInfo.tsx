import { Link } from "react-router-dom"

export function JoinInfo() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Seeker Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-4">
              <i className="lnr lnr-magnifier text-lg" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hire a Professional</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Need a plumber, electrician, or tutor? Post your service request and get matched with verified, top-rated professionals in your area within minutes.
            </p>
            <Link to="/register" className="inline-block bg-[var(--accent-color)] text-white rounded-lg px-6 py-3 font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors">
              Get Started
            </Link>
          </div>

          {/* Provider Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-4">
              <i className="lnr lnr-briefcase text-lg" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start As Professional</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Are you a skilled plumber, electrician, cleaner, or tutor? Join SkillzLink to grow your client base, manage bookings via WhatsApp, and get premium visibility.
            </p>
            <Link to="/register" className="inline-block border border-gray-900 text-gray-900 rounded-lg px-6 py-3 font-medium text-sm hover:bg-gray-50 transition-colors">
              Join Now
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
