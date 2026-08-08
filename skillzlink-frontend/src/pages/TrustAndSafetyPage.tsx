import { Link } from "react-router-dom"

export function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Trust & Safety</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your safety is our top priority. Learn how we keep the SkillzLink community secure for both professionals and clients.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid gap-12">
          
          {/* Pillar 1 */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
              <i className="lnr lnr-lock text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Identity Verification</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Every professional on SkillzLink undergoes a rigorous identity verification process before they can offer services. We check national IDs, verify phone numbers, and ensure that the person you hire is exactly who they claim to be.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><i className="lnr lnr-checkmark-circle text-green-500" /> National ID Verification</li>
                <li className="flex items-center gap-2"><i className="lnr lnr-checkmark-circle text-green-500" /> Phone Number Authentication</li>
                <li className="flex items-center gap-2"><i className="lnr lnr-checkmark-circle text-green-500" /> Profile Photo Matching</li>
              </ul>
            </div>
          </section>

          {/* Pillar 2 */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
              <i className="lnr lnr-star text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Reviews & Ratings</h2>
              <p className="text-slate-600 leading-relaxed">
                Accountability is built into our platform. After every job, clients are encouraged to leave honest feedback. This transparent review system helps maintain high standards and empowers you to make informed decisions based on the experiences of others in your community.
              </p>
            </div>
          </section>

          {/* Pillar 3 */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <i className="lnr lnr-flag text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Reporting & Moderation</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If something doesn't feel right, we want to know. Our 24/7 moderation team actively monitors reports of suspicious behavior, poor service, or policy violations. We take swift action, including suspending or permanently banning accounts that violate our community standards.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors">
                Contact our support team <i className="lnr lnr-arrow-right" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
