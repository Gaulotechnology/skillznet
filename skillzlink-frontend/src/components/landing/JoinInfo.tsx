import { Link } from "react-router-dom"

export function JoinInfo() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Seeker Card */}
          <div className="bg-rose-50 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-rose-200">
                <i className="lnr lnr-magnifier text-3xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Hire a Professional</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-md">
                Need a plumber, electrician, or tutor? Post your service request and get matched with verified, top-rated professionals in your area within minutes.
              </p>
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 hover:shadow-lg hover:-translate-y-1 transition-all shadow-rose-200 gap-2">
                Get Started <i className="lnr lnr-arrow-right" />
              </Link>
            </div>
          </div>

          {/* Provider Card */}
          <div className="bg-indigo-50 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
                <i className="lnr lnr-briefcase text-3xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Start As Professional</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-md">
                Are you a skilled plumber, electrician, cleaner, or tutor? Join SkillzLink to grow your client base, manage bookings via WhatsApp, and get premium visibility.
              </p>
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-1 transition-all shadow-indigo-200 gap-2">
                Join Now <i className="lnr lnr-arrow-right" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
