import { useState, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { Link } from "react-router-dom"
import { authApi, publicApi, apiBaseUrl } from "../services/api"
import { WhatsAppRegistrationBanner } from "../components/landing/WhatsAppRegistrationBanner"

const zimbabweCities = [
  "Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe",
  "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Bindura",
  "Hwange", "Victoria Falls",
]

type Role = "seeker" | "provider"

interface RegistrationField {
  id: number
  label: string
  name: string
  type: string
  placeholder: string
  is_required: boolean
  sort_order: number
  options?: string[]
}

export function RegisterPage() {
  const [role, setRole] = useState<Role>("seeker")

  // Core fields (always shown)
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [city, setCity] = useState("Harare")

  // Core provider fields (always shown for provider)
  const [identityNumber, setIdentityNumber] = useState("")
  const [address, setAddress] = useState("")
  const [serviceCategory, setServiceCategory] = useState("")
  const [serviceRadius, setServiceRadius] = useState("10")
  const [description, setDescription] = useState("")

  // Dynamic fields from admin form builder
  const [dynamicFields, setDynamicFields] = useState<RegistrationField[]>([])
  const [dynamicValues, setDynamicValues] = useState<Record<string, string | boolean>>({})

  // Auth Steps
  const [step, setStep] = useState<"details" | "otp" | "pin">("details")
  const [otp, setOtp] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)

  // Options
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fieldsLoading, setFieldsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    publicApi.getCategories()
      .then(res => setCategories(res.categories || []))
      .catch(err => console.error("Failed to fetch categories", err));
  }, [])

  useEffect(() => {
    if (role !== "provider") return;
    
    setFieldsLoading(true);
    fetch(`${apiBaseUrl()}/registration-fields?category=${encodeURIComponent(serviceCategory)}`)
      .then(r => r.ok ? r.json() : { fields: [] })
      .then(data => {
        const fields: RegistrationField[] = (data.fields || []).sort(
          (a: RegistrationField, b: RegistrationField) => a.sort_order - b.sort_order
        )
        setDynamicFields(fields)
        const init: Record<string, string | boolean> = {}
        fields.forEach(f => { init[f.name] = f.type === "checkbox" ? false : "" })
        setDynamicValues(init)
      })
      .catch(err => console.error("Failed to fetch registration fields", err))
      .finally(() => setFieldsLoading(false))
  }, [role, serviceCategory])

  const handleDynamicChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setDynamicValues(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const formatPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '')
    if (clean.startsWith('263')) return `+${clean}`
    if (clean.startsWith('0')) return `+263${clean.substring(1)}`
    return `+263${clean}`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const formattedPhone = formatPhone(phoneNumber)

      if (step === "details") {
        const res = await authApi.requestOtp(formattedPhone)
        if (res.otp) {
          setDevOtp(res.otp)
        }
        setStep("otp")
      } else if (step === "otp") {
        await authApi.verifyOtp(formattedPhone, otp)
        setStep("pin")
        setMessage(null)
      } else if (step === "pin") {
        if (pin.length !== 4) {
          setError("PIN must be exactly 4 digits.")
          setLoading(false)
          return
        }
        if (pin !== confirmPin) {
          setError("PINs do not match.")
          setLoading(false)
          return
        }

        if (role === "provider") {
          const dynamicDataPayload: Record<string, any> = {}
          dynamicFields.forEach(f => {
            if (dynamicValues[f.name] !== "" && dynamicValues[f.name] !== false) {
              dynamicDataPayload[f.name] = dynamicValues[f.name];
            }
          })

          await authApi.registerProvider({
            name,
            phone_number: formattedPhone,
            otp,
            pin,
            identity_number: identityNumber,
            address: `${address}, ${city}`,
            service_category: serviceCategory,
            service_radius: parseInt(serviceRadius, 10),
            description: description,
            dynamic_data: Object.keys(dynamicDataPayload).length > 0 ? dynamicDataPayload : undefined,
            referral_code: localStorage.getItem("skillzlink_referral_code") || undefined,
          })
        } else {
          await authApi.registerSeeker({ name, phone_number: formattedPhone, otp, pin, default_latitude: undefined, default_longitude: undefined, referral_code: localStorage.getItem("skillzlink_referral_code") || undefined })
        }
        setMessage("Registration successful! You can now login with your phone number and PIN.")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  const renderDynamicField = (field: RegistrationField) => {
    const val = dynamicValues[field.name]
    const inputClasses = "w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] focus:bg-white"

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            className={inputClasses}
            placeholder={field.placeholder || field.label}
            required={field.is_required}
            value={val as string}
            onChange={handleDynamicChange}
            rows={3}
          />
        )
      case "dropdown":
        return (
          <select
            name={field.name}
            className={inputClasses}
            required={field.is_required}
            value={val as string}
            onChange={handleDynamicChange}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {(field.options || []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )
      case "checkbox":
        return (
          <label className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
            <input
              type="checkbox"
              name={field.name}
              checked={!!val}
              onChange={handleDynamicChange}
              className="w-5 h-5 rounded text-[var(--accent-color)] focus:ring-rose-500"
            />
            <span className="text-sm font-medium text-[var(--text-primary)]">{field.label}</span>
          </label>
        )
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            className={inputClasses}
            placeholder={field.placeholder || field.label}
            required={field.is_required}
            value={val as string}
            onChange={handleDynamicChange}
          />
        )
    }
  }

  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-secondary)]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center border border-[var(--border-color)]">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="lnr lnr-checkmark-circle text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">You're All Set!</h2>
          <p className="text-[var(--text-secondary)] mb-8">{message}</p>
          <Link
            to="/login"
            className="block w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-[var(--text-primary)] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/3 relative overflow-hidden bg-[var(--bg-secondary)] flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-color)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-color)]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)] flex items-center justify-center">
              <span className="text-[var(--text-primary)] font-black text-sm">SL</span>
            </div>
            <span className="text-[var(--text-primary)] font-bold text-xl">SkillzLink</span>
          </Link>

          <h2 className="text-4xl font-bold text-[var(--text-primary)] leading-tight mb-6">
            Join Zimbabwe's<br/>growing talent<br/>network.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-sm">
            Whether you need something fixed or you're the one fixing it, you're in the right place.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)]/50 flex items-center justify-center shrink-0">
                <i className="lnr lnr-magic-wand text-[var(--text-primary)]" />
              </div>
              <div>
                <h4 className="text-[var(--text-primary)] font-semibold mb-1">Simple Setup</h4>
                <p className="text-[var(--text-secondary)] text-sm">Takes less than 2 minutes to create your profile.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                <i className="fab fa-whatsapp text-green-600 text-lg" />
              </div>
              <div>
                <h4 className="text-[var(--text-primary)] font-semibold mb-1">WhatsApp Integrated</h4>
                <p className="text-[var(--text-secondary)] text-sm">Get notifications and connect instantly via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[var(--text-secondary)] text-sm">
          Already have an account? <Link to="/login" className="text-[var(--text-primary)] font-semibold hover:text-[var(--accent-color)] transition-colors">Sign in instead</Link>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 xl:w-2/3 flex items-center justify-center p-6 sm:p-12 bg-[var(--bg-secondary)] overflow-y-auto">
        <div className="w-full max-w-2xl bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 sm:p-10">
          
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
                <span className="text-[var(--text-primary)] font-black text-xs">SL</span>
              </div>
              <span className="font-bold text-[var(--text-primary)]">SkillzLink</span>
            </Link>
            <Link to="/login" className="text-sm font-semibold text-[var(--accent-color)]">Sign In</Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Create your account</h1>
            <p className="text-[var(--text-secondary)]">Choose how you want to use SkillzLink</p>
          </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <i className="lnr lnr-cross-circle text-red-500 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {message && step !== 'pin' && step !== 'details' && (
              <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                <i className="lnr lnr-checkmark-circle text-green-500 mt-0.5" />
                <p className="text-green-700 text-sm font-mono">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === "details" && (
                <>
                  {/* Account Type Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === "seeker" 
                    ? "border-[var(--accent-color)] bg-[var(--bg-secondary)] shadow-sm" 
                    : "border-[var(--border-color)] bg-white hover:border-slate-300 hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="seeker" 
                  className="sr-only" 
                  checked={role === "seeker"} 
                  onChange={() => setRole("seeker")}
                />
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === "seeker" ? "bg-rose-500 text-[var(--text-primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
                    <i className="lnr lnr-user text-xl" />
                  </div>
                  {role === "seeker" && <i className="lnr lnr-checkmark-circle text-[var(--accent-color)] text-xl" />}
                </div>
                <h3 className={`font-bold text-lg mb-1 ${role === "seeker" ? "text-[var(--accent-color)]" : "text-[var(--text-primary)]"}`}>I want to hire</h3>
                <p className="text-sm text-[var(--text-secondary)]">Find professionals for your projects</p>
              </label>

              <label 
                className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === "provider" 
                    ? "border-[var(--accent-color)] bg-[var(--bg-secondary)] shadow-sm" 
                    : "border-[var(--border-color)] bg-white hover:border-slate-300 hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="provider" 
                  className="sr-only" 
                  checked={role === "provider"} 
                  onChange={() => setRole("provider")}
                />
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === "provider" ? "bg-indigo-500 text-[var(--text-primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
                    <i className="lnr lnr-briefcase text-xl" />
                  </div>
                  {role === "provider" && <i className="lnr lnr-checkmark-circle text-[var(--accent-color)] text-xl" />}
                </div>
                <h3 className={`font-bold text-lg mb-1 ${role === "provider" ? "text-[var(--accent-color)]" : "text-[var(--text-primary)]"}`}>I am a professional</h3>
                <p className="text-sm text-[var(--text-secondary)]">Offer your services and get clients</p>
              </label>
            </div>

            <hr className="border-[var(--border-color)]" />

            {/* Core Details (Both Roles) */}
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-xs">1</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Tinashe Moyo"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">WhatsApp Number</label>
                  <div className="flex rounded-xl border border-[var(--border-color)] overflow-hidden focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100 transition-all bg-[var(--bg-secondary)] focus-within:bg-white">
                    <div className="flex items-center gap-2 px-3 border-r border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                      <span>🇿🇼</span><span className="text-[var(--text-secondary)] font-semibold text-sm">+263</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      placeholder="71 234 5678"
                      className="flex-1 px-3 py-3 outline-none bg-transparent text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                <div className={role === "provider" ? "col-span-1 md:col-span-2" : "col-span-1"}>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">City</label>
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm appearance-none"
                    >
                      {zimbabweCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <i className="lnr lnr-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Only Details */}
            {role === "provider" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <hr className="border-[var(--border-color)] my-8" />
                <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] flex items-center justify-center text-xs">2</span>
                  Professional Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">National ID Number</label>
                    <input
                      type="text"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      required
                      placeholder="For verification purposes"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Service Category</label>
                    <div className="relative">
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm appearance-none"
                      >
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <i className="lnr lnr-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="e.g. 123 Samora Machel Ave"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Working Radius (km)</label>
                    <input
                      type="number"
                      value={serviceRadius}
                      onChange={(e) => setServiceRadius(e.target.value)}
                      required
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Bio / Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Tell potential clients about your experience and skills..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] bg-[var(--bg-secondary)] focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                {!fieldsLoading && dynamicFields.length > 0 && (
                  <>
                    <h3 className="font-bold text-[var(--text-primary)] mb-4 mt-8 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] flex items-center justify-center text-xs">3</span>
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {dynamicFields.map(field => (
                        <div key={field.id} className={field.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                            {field.label} {field.is_required && <span className="text-[var(--accent-color)]">*</span>}
                          </label>
                          {renderDynamicField(field)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Submit */}
              {step === "details" && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-8"
                >
                  {loading ? "Please wait..." : "Continue"}
                </button>
              )}
                </>
              )}

              {step === "otp" && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Verify Your Number</h3>
                    <p className="text-[var(--text-secondary)] text-sm">We sent a code to {phoneNumber}</p>
                    {devOtp && (
                      <div className="mt-4 p-3 bg-green-50 rounded">
                        <p className="text-sm font-medium text-green-800">For testing purposes, your OTP is:</p>
                        <p className="text-lg text-green-700 font-mono font-bold tracking-widest">{devOtp}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Enter OTP Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="Enter your 6-digit code"
                      required
                      maxLength={8}
                      className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-lg font-mono tracking-widest text-center placeholder:text-sm placeholder:tracking-normal placeholder:font-sans bg-[var(--bg-secondary)] focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb855] transition-colors disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-full py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    ← Change phone number
                  </button>
                </div>
              )}

              {step === "pin" && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Create a PIN</h3>
                    <p className="text-[var(--text-secondary)] text-sm">Protect your account with a 4-digit PIN.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0,4))}
                      placeholder="Enter 4-digit PIN"
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-center text-xl tracking-[0.5em] font-mono bg-[var(--bg-secondary)] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Confirm PIN</label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0,4))}
                      placeholder="Confirm 4-digit PIN"
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-center text-xl tracking-[0.5em] font-mono bg-[var(--bg-secondary)] focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              )}
            </form>
            
            <p className="text-center text-[var(--text-secondary)] text-xs mt-4">
              By creating an account, you agree to our <Link to="/terms-and-conditions" className="underline hover:text-[var(--text-primary)]">Terms of Service</Link> and <Link to="/privacy-policy" className="underline hover:text-[var(--text-primary)]">Privacy Policy</Link>.
            </p>


        </div>
      </div>
      </div>

      <WhatsAppRegistrationBanner />
    </>
  )
}
