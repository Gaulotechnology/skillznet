import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { publicApi, seekerApi, type PublicProvider } from "../services/api"

export function ProfessionalProfilePage() {
  const { id } = useParams()
  const [pro, setPro] = useState<PublicProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [_error, setError] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [submittingBooking, setSubmittingBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!id) return

    publicApi.getProvider(id)
      .then(res => {
        setPro(res.provider)
        setError(false)
      })
      .catch(() => {
        // Fallback to mock data if API fails
        setError(true)
        setPro({
          id: Number(id),
          name: "Tinashe Moyo (Mock)",
          service_category: "Plumbing",
          rate: "$15.00 / hr",
          location: "Harare, Zimbabwe",
          rating: 4.8,
          reviews: 124,
          image: "/images/profile/img-01.jpg",
          description: "I am an experienced plumber serving the Harare region. With over 10 years in the industry, I handle everything from emergency leaks and burst pipes to full bathroom installations and solar geyser maintenance.",
          skills: ["Pipe Fitting", "Geyser Repair", "Drain Unblocking", "Water Tanks"],
          featured: true,
          premium_badge: true,
          id_verified: true,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (showBookingModal && bookingDate && id) {
      publicApi.getProviderSlots(id, bookingDate)
        .then(res => setAvailableSlots(res.slots || []))
        .catch(err => console.error("Error fetching slots:", err));
    }
  }, [showBookingModal, bookingDate, id])

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !bookingDate || !bookingTime) return;
    
    setSubmittingBooking(true);
    
    const selectedSlot = availableSlots.find(s => s === bookingTime);
    
    try {
      await seekerApi.createBooking({
        provider_id: Number(id),
        booking_date: bookingDate,
        start_time: selectedSlot || bookingTime,
        end_time: selectedSlot ? `${parseInt(selectedSlot.split(':')[0]) + 1}:00:00` : `${parseInt(bookingTime.split(':')[0]) + 1}:00:00`,
        notes: bookingNotes
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setBookingDate("");
        setBookingTime("");
        setBookingNotes("");
      }, 3000);
    } catch (err: any) {
      alert("Failed to book appointment: " + (err.message || "Unknown error"));
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '40px', color: '#ff5851' }}></i>
          <p style={{ marginTop: '10px', color: '#888' }}>Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!pro) return null

  // Ensure we have fallback data for arrays if not provided by backend
  const experienceList = pro.experience ?? []
  const skillsList = pro.skills ?? []
  const portfoliosList = pro.portfolios ?? []
  const servicesList = pro.services ?? []
  const reviewsList = pro.client_reviews ?? []

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Profile Header Banner */}
      <div className="h-64 bg-slate-900 relative overflow-hidden">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-24 relative z-10">
        
        {/* Top Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar */}
          <div className="relative shrink-0 mx-auto md:mx-0 -mt-20 md:-mt-24">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
              <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
            </div>
            {pro.id_verified && (
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white rounded-full p-1 shadow-md" title="ID Verified">
                <i className="lnr lnr-checkmark-circle text-blue-500 text-xl md:text-3xl bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{pro.name}</h1>
                  {pro.premium_badge && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                      <i className="lnr lnr-star" /> Premium
                    </span>
                  )}
                </div>
                <p className="text-xl text-rose-500 font-semibold mb-4">{pro.service_category} Expert</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-slate-600 font-medium text-sm md:text-base">
                  <span className="flex items-center gap-2"><i className="lnr lnr-map-marker text-lg" /> {pro.location || "Zimbabwe"}</span>
                  <span className="flex items-center gap-2"><i className="lnr lnr-tag text-lg" /> {pro.rate || "$15/hr"}</span>
                  <span className="flex items-center gap-2 text-amber-500"><i className="lnr lnr-star text-lg" /> {pro.rating}/5 ({pro.reviews} reviews)</span>
                  <span className="flex items-center gap-2"><i className="lnr lnr-calendar-full text-lg" /> Member since {pro.member_since || 'Aug 2023'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  <i className="lnr lnr-calendar-full text-xl" /> Book Now
                </button>
                <a 
                  href={`https://wa.me/${(pro.phone ?? '263770000000').replace(/[^0-9]/g, '')}?text=Hi%20${pro.name},%20I%20found%20you%20on%20SkillzLink.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                >
                  <i className="fab fa-whatsapp text-xl" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{pro.completed_services ?? 0}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Completed</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{pro.success_rate ?? 100}%</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Success</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{pro.response_time ?? '2h'}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Response Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="lnr lnr-user text-rose-500" /> About {pro.name.split(' ')[0]}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {pro.description}
              </p>
            </div>

            {/* Dynamic Details Section */}
            {pro.dynamic_data && typeof pro.dynamic_data === 'object' && Object.keys(pro.dynamic_data).length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <i className="lnr lnr-magic-wand text-rose-500" /> Professional Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(pro.dynamic_data).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-800 font-medium">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="lnr lnr-layers text-rose-500" /> Services & Pricing
              </h2>
              {servicesList.length > 0 ? (
                <div className="space-y-4">
                  {servicesList.map((serv, i) => (
                    <div key={i} className="flex justify-between items-start p-4 rounded-2xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/50 transition-colors group">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-rose-600 transition-colors">{serv.name}</h4>
                        <p className="text-slate-500 text-sm mt-1">{serv.description}</p>
                      </div>
                      <div className="text-rose-500 font-extrabold text-xl shrink-0 ml-4">
                        ${serv.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 font-medium">No services listed yet.</div>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="lnr lnr-briefcase text-rose-500" /> Experience
              </h2>
              {experienceList.length > 0 ? (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {experienceList.map((exp, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 group-hover:bg-rose-500 text-slate-500 group-hover:text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors z-10">
                        <i className="lnr lnr-star text-sm" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 shadow-sm bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-800 text-lg">{exp.title}</h4>
                        </div>
                        <div className="text-sm text-slate-500 font-medium mb-3 flex items-center gap-2">
                          <i className="lnr lnr-apartment" /> {exp.company} • {exp.date}
                        </div>
                        <p className="text-slate-600 text-sm">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 font-medium">No experience details provided yet.</div>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="lnr lnr-picture text-rose-500" /> Past Work
              </h2>
              {portfoliosList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {portfoliosList.map((port, i) => (
                    <div key={i} className="group rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={port.image_url} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="font-bold text-slate-800">{port.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{port.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 font-medium">No portfolio items provided yet.</div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="lnr lnr-bubble text-rose-500" /> Seeker Reviews
              </h2>
              {reviewsList.length > 0 ? (
                <div className="space-y-6">
                  {reviewsList.map((review, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-800">{review.reviewer_name}</h4>
                          <span className="text-xs font-medium text-slate-500">{review.date}</span>
                        </div>
                        <div className="flex text-amber-400 gap-1 text-sm">
                          {[...Array(5)].map((_, idx) => (
                            <i key={idx} className={idx < review.rating ? "fa fa-star" : "far fa-star"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 font-medium">No reviews yet.</div>
              )}
            </div>

          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-8">
            
            {/* Skills Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="lnr lnr-magic-wand text-rose-500" /> Skills
              </h3>
              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 font-medium text-sm">No skills added yet.</div>
              )}
            </div>

            {/* Share Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Share Profile</h3>
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-slate-100 hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] text-slate-700 font-medium transition-colors">
                  <i className="fab fa-whatsapp text-lg" /> Share on WhatsApp
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-slate-100 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2] hover:text-[#1DA1F2] text-slate-700 font-medium transition-colors">
                  <i className="fab fa-twitter text-lg" /> Share on Twitter
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-slate-100 hover:bg-[#1877F2]/10 hover:border-[#1877F2] hover:text-[#1877F2] text-slate-700 font-medium transition-colors">
                  <i className="fab fa-facebook-f text-lg" /> Share on Facebook
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <i className="lnr lnr-calendar-full text-indigo-500"></i>
                Book Appointment
              </h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <i className="lnr lnr-cross font-bold"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {bookingSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
                    <i className="lnr lnr-checkmark-circle text-3xl"></i>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Booking Confirmed!</h4>
                  <p className="text-slate-500 font-medium">Your request has been sent to {pro.name}. You'll be notified once it's accepted.</p>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} className="space-y-6">
                  
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Date <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i className="lnr lnr-calendar-full"></i>
                      </div>
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Time Selection */}
                  {bookingDate && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                        <span>Select Time <span className="text-rose-500">*</span></span>
                        <span className="text-slate-400 text-xs font-normal">Based on availability</span>
                      </label>
                      
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-1">
                          {availableSlots.map((slot, idx) => {
                            const timeStr = typeof slot === 'string' ? slot.substring(0,5) : (slot as any).start_time?.substring(0,5);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBookingTime(timeStr)}
                                className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all
                                  ${bookingTime === timeStr
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
                                  }`}
                              >
                                {timeStr}
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center justify-center gap-2">
                          <i className="lnr lnr-warning"></i>
                          No available slots for this date
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Details (Optional)</label>
                    <textarea 
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Describe what you need help with..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!bookingDate || !bookingTime || submittingBooking}
                      className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {submittingBooking ? (
                        <i className="lnr lnr-sync animate-spin"></i>
                      ) : (
                        <i className="lnr lnr-calendar-full"></i>
                      )}
                      {submittingBooking ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
