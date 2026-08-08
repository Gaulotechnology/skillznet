export function LimitlessExperience() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative group">
            {/* Decorative background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-100 rounded-[3rem] -z-10 group-hover:scale-105 transition-transform duration-700 blur-2xl opacity-50" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
              <img 
                src="/images/whatsapp-mobile.png" 
                alt="SkillzLink WhatsApp experience" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 font-bold text-sm mb-6">
              <i className="fab fa-whatsapp text-lg" />
              WhatsApp Integration
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
              Connect With Professionals <span className="text-green-500">Instantly</span>
            </h2>
            
            <div className="space-y-6 text-lg text-slate-600 mb-10">
              <p className="leading-relaxed">
                Find and hire trusted local professionals directly from your phone.
                Whether you need a plumber on a Sunday or a tutor next week, SkillzLink
                connects you instantly via WhatsApp.
              </p>
              <p className="leading-relaxed font-medium">
                No need to download a new app! Get instant updates, negotiate rates, 
                and hire pros right where you already chat with friends and family.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <a 
                href="https://wa.me/263777000000" 
                className="inline-flex items-center gap-3 bg-green-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-green-600 shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <i className="fab fa-whatsapp text-2xl" />
                <span>Chat on WhatsApp</span>
              </a>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <i className="lnr lnr-checkmark-circle text-green-500 text-xl" /> Fast & Secure
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <i className="lnr lnr-checkmark-circle text-green-500 text-xl" /> Zero Fees
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
