import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { publicApi, seekerApi, isLoggedIn, type PublicProvider } from "../services/api"

function normalizePhone(phone?: string): string {
  if (!phone) return ""
  return phone.replace(/[^0-9+]/g, "")
}

export function ProfessionalProfilePage() {
  const { id } = useParams()
  const [pro, setPro] = useState<PublicProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [_error, setError] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [revealingContact, setRevealingContact] = useState(false)
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null)
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

  const handleRevealContact = async () => {
    if (!pro) return
    setRevealingContact(true)
    try {
      const res = await seekerApi.revealContact(pro.id)
      if (res.contact_available && res.contact_number) {
        setRevealedPhone(res.contact_number)
      }
    } catch {}
    setRevealingContact(false)
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
    <div className="bg-white min-h-screen pb-20">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-8">
        
        {/* Top Profile Card - Airbnb style */}
        <div className="mb-8">
          
          {/* Avatar + Name row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200">
                <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
              </div>
              {pro.id_verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" title="ID Verified">
                  <i className="lnr lnr-checkmark-circle text-blue-500 text-lg" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-semibold text-gray-900">{pro.name}</h1>
                {pro.premium_badge && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-md flex items-center gap-1">
                    <i className="lnr lnr-diamond text-[10px]" /> Premium
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{pro.service_category || "General Services"}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1"><i className="lnr lnr-map-marker text-xs" /> {pro.location || "Zimbabwe"}</span>
                <span className="flex items-center gap-1"><i className="lnr lnr-star text-amber-500 text-xs" /> {pro.rating} <span className="text-gray-400">({pro.reviews} reviews)</span></span>
                <span>{pro.member_since || 'Aug 2023'}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100 mb-6">
            <div>
              <span className="text-lg font-semibold text-gray-900">{pro.completed_services ?? 0}</span>
              <span className="text-xs text-gray-500 ml-1">jobs completed</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">{pro.success_rate ?? 100}%</span>
              <span className="text-xs text-gray-500 ml-1">success rate</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">{pro.response_time ?? '2h'}</span>
              <span className="text-xs text-gray-500 ml-1">response time</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">{pro.rate || "$15/hr"}</span>
            </div>
          </div>

          {/* Action buttons - clean, spaced, no overlap */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <i className="lnr lnr-calendar-full" /> Book Appointment
            </button>
            {isLoggedIn() ? (
              (revealedPhone || pro.phone) ? (
                <>
                  <a 
                    href={`https://wa.me/${normalizePhone(revealedPhone || pro.phone).replace(/^\+/, "")}?text=Hi%20${encodeURIComponent(pro.name)},%20I%20found%20you%20on%20SkillzLink.`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <i className="fab fa-whatsapp" /> WhatsApp
                  </a>
                  <a 
                    href={`tel:${normalizePhone(revealedPhone || pro.phone)}`}
                    className="px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <i className="lnr lnr-phone-handset" /> Call
                  </a>
                </>
              ) : (
                <button 
                  onClick={handleRevealContact}
                  disabled={revealingContact}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-900 text-gray-700 text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <i className="lnr lnr-phone-handset" /> {revealingContact ? "Loading..." : "Reveal Contact"}
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-900 text-gray-700 text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <i className="lnr lnr-lock" /> Login to contact
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {pro.name.split(' ')[0]}</h2>
              <p className="text-gray-600 leading-relaxed">
                {pro.description}
              </p>
            </div>

            {/* Dynamic Details Section */}
            {pro.dynamic_data && typeof pro.dynamic_data === 'object' && Object.keys(pro.dynamic_data).length > 0 && (
              <div className="pb-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(pro.dynamic_data).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-gray-800 text-sm">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            <div className="pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services & Pricing</h2>
              {servicesList.length > 0 ? (
                <div className="space-y-3">
                  {servicesList.map((serv, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{serv.name}</h4>
                        <p className="text-gray-500 text-sm mt-0.5">{serv.description}</p>
                      </div>
                      <div className="font-semibold text-gray-900 shrink-0 ml-4">
                        ${serv.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No services listed yet.</p>
              )}
            </div>

            {/* Experience Section */}
            <div className="pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
              {experienceList.length > 0 ? (
                <div className="space-y-5">
                  {experienceList.map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <i className="lnr lnr-briefcase text-gray-500 text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.title}</h4>
                        <p className="text-sm text-gray-500">{exp.company} · {exp.date}</p>
                        <p className="text-sm text-gray-600 mt-1">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No experience details provided yet.</p>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Work</h2>
              {portfoliosList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfoliosList.map((port, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={port.image_url} alt={port.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900">{port.title}</h4>
                        <p className="text-gray-500 text-sm mt-0.5">{port.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No portfolio items yet.</p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              {reviewsList.length > 0 ? (
                <div className="space-y-4">
                  {reviewsList.map((review, i) => (
                    <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
                          {review.reviewer_name?.[0] || '?'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{review.reviewer_name}</h4>
                          <div className="flex text-amber-400 gap-0.5 text-xs">
                            {[...Array(5)].map((_, idx) => (
                              <i key={idx} className={idx < review.rating ? "fa fa-star" : "far fa-star"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet.</p>
              )}
            </div>

          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6">
            
            {/* Skills Widget */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Skills</h3>
              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet.</p>
              )}
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
