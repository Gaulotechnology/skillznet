import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authApi, setToken, setCurrentUser } from "../services/api"

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const formatPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '')
    // if it already has 263 prefix, just add +, else add +263
    if (clean.startsWith('263')) return `+${clean}`
    if (clean.startsWith('0')) return `+263${clean.substring(1)}`
    return `+263${clean}`
  }

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const formattedPhone = formatPhone(phoneNumber)
      const data = await authApi.requestOtp(formattedPhone)
      setMessage(data.otp ? `Dev OTP: ${data.otp}` : "OTP sent via WhatsApp/SMS")
      setStep("otp")
    } catch {
      setError("Could not send OTP. Please check your phone number.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const formattedPhone = formatPhone(phoneNumber)
      const data = await authApi.verifyOtp(formattedPhone, otp)
      setToken(data.token)
      setCurrentUser(data.user)
      const role = data.user.role
      if (role === "admin") navigate("/dashboard/admin/overview")
      else if (role === "provider") navigate("/dashboard/provider/overview")
      else navigate("/dashboard/seeker/overview")
    } catch {
      setError("Invalid or expired OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col items-center justify-center p-12">
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-pink-600/20 blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-sm">
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">SL</span>
            </div>
            <span className="text-white font-bold text-2xl">SkillzLink</span>
          </Link>

          <div className="mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <i className="fab fa-whatsapp text-4xl text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Zimbabwe's #1<br />Skills Platform</h2>
            <p className="text-white/60 text-base leading-relaxed">
              Connect with 2,400+ verified professionals across Harare, Bulawayo, and 6 other cities — right through WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[["2,400+","Verified Pros"], ["8","Cities"], ["98%","Satisfaction"]].map(([n, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-white font-bold text-xl">{n}</div>
                <div className="text-white/50 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                <span className="text-white font-black">SL</span>
              </div>
              <span className="font-bold text-xl text-slate-800">SkillzLink</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-all duration-300 ${step === "phone" ? "bg-rose-500" : "bg-green-500"}`}>
                <i className={`text-white text-2xl ${step === "phone" ? "lnr lnr-phone" : "fab fa-whatsapp"}`} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                {step === "phone" ? "Sign in to SkillzLink" : "Verify Your Number"}
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                {step === "phone"
                  ? "Enter your phone number to receive a one-time code"
                  : `We sent a code to ${phoneNumber} via WhatsApp`}
              </p>
            </div>

            {/* Error / Message */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                <i className="lnr lnr-cross-circle text-red-500 text-lg mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-start gap-3">
                <i className="lnr lnr-checkmark-circle text-green-500 text-lg mt-0.5" />
                <p className="text-green-700 text-sm font-mono">{message}</p>
              </div>
            )}

            {step === "phone" ? (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <div className="flex rounded-2xl border-2 border-slate-200 overflow-hidden focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100 transition-all">
                    <div className="flex items-center gap-2 px-4 bg-slate-50 border-r border-slate-200">
                      <span className="text-sm">🇿🇼</span>
                      <span className="text-slate-600 font-semibold text-sm">+263</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="71 234 5678"
                      required
                      className="flex-1 px-4 py-4 outline-none bg-white text-slate-800 text-sm placeholder-slate-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold text-base shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:bg-rose-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : "Send OTP via WhatsApp"}
                </button>

                {/* Demo Logins */}
                <div className="pt-6 mt-2 border-t border-slate-100 flex flex-col items-center gap-3">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Demo Logins</p>
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    <button type="button" onClick={() => setPhoneNumber("771111111")} className="flex-1 min-w-[80px] px-3 py-2.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-200 hover:border-slate-300 hover:shadow-sm">Admin</button>
                    <button type="button" onClick={() => setPhoneNumber("772222222")} className="flex-1 min-w-[80px] px-3 py-2.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-200 hover:border-slate-300 hover:shadow-sm">Provider</button>
                    <button type="button" onClick={() => setPhoneNumber("773333333")} className="flex-1 min-w-[80px] px-3 py-2.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-200 hover:border-slate-300 hover:shadow-sm">Seeker</button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Enter OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter your 6-digit code"
                    required
                    maxLength={8}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all text-slate-800 text-lg font-mono tracking-widest text-center placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base shadow-lg shadow-green-200 hover:bg-green-600 hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="w-full py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  ← Change phone number
                </button>
              </form>
            )}

            <p className="text-center text-slate-500 text-sm mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-rose-500 hover:text-rose-600 transition-colors">
                Join SkillzLink
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
