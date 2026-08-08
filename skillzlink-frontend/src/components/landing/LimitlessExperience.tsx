export function LimitlessExperience() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="/images/whatsapp-mobile.png"
              alt="SkillzLink WhatsApp experience"
              className="w-full h-auto rounded-xl border border-gray-200"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-4">
              <i className="fab fa-whatsapp" />
              WhatsApp Integration
            </div>

            <h2 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
              Connect with professionals instantly
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Find and hire trusted local professionals directly from your phone.
              Whether you need a plumber on a Sunday or a tutor next week, SkillzLink
              connects you instantly via WhatsApp. No new app needed — get updates,
              negotiate rates, and hire right where you already chat.
            </p>

            <a
              href="https://wa.me/263777000000"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-lg px-5 py-3 font-medium text-sm hover:bg-[#1da851] transition-colors mb-6"
            >
              <i className="fab fa-whatsapp text-lg" />
              Chat on WhatsApp
            </a>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Fast & Secure
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Zero Fees
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No App Download Required
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
