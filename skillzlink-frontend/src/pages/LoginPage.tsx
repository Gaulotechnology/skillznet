import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authApi, setToken, setCurrentUser } from "../services/api"

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState("")
  const [otp, setOtp] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmNewPin, setConfirmNewPin] = useState("")
  const [step, setStep] = useState<"login" | "forgot_pin" | "forgot_pin_otp">("login")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const formatPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '')
    if (clean.startsWith('263')) return `+${clean}`
    if (clean.startsWith('0')) return `+263${clean.substring(1)}`
    return `+263${clean}`
  }

  const executeLogin = async (phone: string, pinCode: string) => {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const formattedPhone = formatPhone(phone)
      const data = await authApi.loginWithPin(formattedPhone, pinCode)
      setToken(data.token)
      setCurrentUser(data.user)
      const role = data.user.role
      if (role === "admin") navigate("/dashboard/admin/overview")
      else if (role === "provider") navigate("/dashboard/provider/overview")
      else navigate("/dashboard/seeker/overview")
    } catch {
      setError("Invalid phone number or PIN.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    await executeLogin(phoneNumber, pin)
  }

  const handleDemoLogin = (phone: string) => {
    setPhoneNumber(phone)
    setPin("1234")
    executeLogin(phone, "1234")
  }

  const handleRequestPinReset = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const formattedPhone = formatPhone(phoneNumber)
      const data = await authApi.requestPinReset(formattedPhone)
      setMessage(data.otp ? `Dev OTP: ${data.otp}` : "OTP sent via WhatsApp/SMS")
      setStep("forgot_pin_otp")
    } catch {
      setError("Could not send OTP. Please check your phone number.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPin = async (e: FormEvent) => {
    e.preventDefault()
    if (newPin !== confirmNewPin) {
      setError("New PINs do not match.")
      return
    }
    if (newPin.length !== 4) {
      setError("PIN must be exactly 4 digits.")
      return
    }
    
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const formattedPhone = formatPhone(phoneNumber)
      const data = await authApi.resetPin(formattedPhone, otp, newPin)
      setToken(data.token)
      setCurrentUser(data.user)
      const role = data.user.role
      if (role === "admin") navigate("/dashboard/admin/overview")
      else if (role === "provider") navigate("/dashboard/provider/overview")
      else navigate("/dashboard/seeker/overview")
    } catch {
      setError("Invalid or expired OTP, or could not reset PIN.")
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
            Welcome back to<br/>your dashboard.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-sm">
            Sign in to manage your bookings, connect with professionals, and grow your business.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)]/50 flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                <i className="lnr lnr-lock text-[var(--text-primary)] text-lg" />
              </div>
              <div>
                <h4 className="text-[var(--text-primary)] font-semibold mb-1">Secure Access</h4>
                <p className="text-[var(--text-secondary)] text-sm">PIN-based authentication keeps your account safe.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                <i className="fab fa-whatsapp text-green-600 text-lg" />
              </div>
              <div>
                <h4 className="text-[var(--text-primary)] font-semibold mb-1">WhatsApp Recovery</h4>
                <p className="text-[var(--text-secondary)] text-sm">Forgot your PIN? Easily reset it via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[var(--text-secondary)] text-sm">
          Don't have an account? <Link to="/register" className="text-[var(--text-primary)] font-semibold hover:text-[var(--accent-color)] transition-colors">Join SkillzLink</Link>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-7/12 xl:w-2/3 flex items-center justify-center p-6 sm:p-12 bg-[var(--bg-secondary)] overflow-y-auto">
        <div className="w-full max-w-xl bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 sm:p-10">
          
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)] flex items-center justify-center">
                <span className="text-[var(--text-primary)] font-black text-sm">SL</span>
              </div>
              <span className="font-bold text-xl text-[var(--text-primary)]">SkillzLink</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${step === "login" ? "bg-[var(--accent-color)]" : "bg-[#25D366]"}`}>
              <i className={`text-[var(--text-primary)] text-xl ${step === "login" ? "lnr lnr-user" : "fab fa-whatsapp"}`} />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {step === "login" ? "Sign in to SkillzLink" : step === "forgot_pin" ? "Reset your PIN" : "Verify & New PIN"}
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              {step === "login"
                ? "Enter your phone number and PIN to access your account"
                : step === "forgot_pin" 
                ? "Enter your phone number to receive a reset code"
                : `We sent a code to ${phoneNumber} via WhatsApp`}
            </p>
          </div>

          {/* Error / Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <i className="lnr lnr-cross-circle text-red-500 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
              <i className="lnr lnr-checkmark-circle text-green-500 mt-0.5" />
              <p className="text-green-700 text-sm font-mono">{message}</p>
            </div>
          )}

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Phone Number</label>
                <div className="flex rounded-xl border border-[var(--border-color)] overflow-hidden focus-within:border-[var(--accent-color)] focus-within:ring-2 focus-within:ring-[var(--accent-light)] transition-all">
                  <div className="flex items-center gap-2 px-4 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]">
                    <span className="text-sm">🇿🇼</span>
                    <span className="text-[var(--text-secondary)] font-medium text-sm">+263</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="71 234 5678"
                    required
                    className="flex-1 px-4 py-3.5 outline-none bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)]"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">PIN</label>
                  <button type="button" onClick={() => {setStep("forgot_pin"); setError(null); setMessage(null);}} className="text-sm font-medium text-[var(--accent-color)] hover:underline">Forgot PIN?</button>
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0,4))}
                  placeholder="••••"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-center text-xl tracking-[0.5em] font-mono bg-[var(--bg-primary)]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-[var(--text-primary)] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* Demo Logins */}
              <div className="pt-5 mt-2 border-t border-[var(--border-color)] flex flex-col items-center gap-3">
                <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Demo Logins <span className="lowercase normal-case font-normal ml-1 opacity-75">(PIN: 1234)</span></p>
                <div className="flex flex-wrap justify-center gap-2 w-full">
                  <button type="button" onClick={() => handleDemoLogin("771111111")} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] rounded-lg transition-all border border-[var(--border-color)]">Admin</button>
                  <button type="button" onClick={() => handleDemoLogin("772222222")} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] rounded-lg transition-all border border-[var(--border-color)]">Provider</button>
                  <button type="button" onClick={() => handleDemoLogin("773333333")} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] rounded-lg transition-all border border-[var(--border-color)]">Seeker</button>
                </div>
              </div>
            </form>
          )}

          {step === "forgot_pin" && (
            <form onSubmit={handleRequestPinReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Phone Number</label>
                <div className="flex rounded-xl border border-[var(--border-color)] overflow-hidden focus-within:border-[var(--accent-color)] focus-within:ring-2 focus-within:ring-[var(--accent-light)] transition-all">
                  <div className="flex items-center gap-2 px-4 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]">
                    <span className="text-sm">🇿🇼</span>
                    <span className="text-[var(--text-secondary)] font-medium text-sm">+263</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="71 234 5678"
                    required
                    className="flex-1 px-4 py-3.5 outline-none bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-[var(--text-primary)] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Code..." : "Send Reset Code"}
              </button>
              <button
                type="button"
                onClick={() => {setStep("login"); setError(null); setMessage(null);}}
                className="w-full py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {step === "forgot_pin_otp" && (
            <form onSubmit={handleResetPin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Enter OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter your 6-digit code"
                  required
                  maxLength={8}
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-lg font-mono tracking-widest text-center placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0,4))}
                    placeholder="••••"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-center text-xl tracking-[0.5em] font-mono bg-[var(--bg-primary)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Confirm PIN</label>
                  <input
                    type="password"
                    value={confirmNewPin}
                    onChange={e => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0,4))}
                    placeholder="••••"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all text-[var(--text-primary)] text-center text-xl tracking-[0.5em] font-mono bg-[var(--bg-primary)]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb855] transition-colors disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset PIN & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => {setStep("forgot_pin"); setError(null); setMessage(null);}}
                className="w-full py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-medium text-sm hover:bg-[var(--bg-secondary)] transition-colors"
              >
                ← Resend code to different number
              </button>
            </form>
          )}

          <p className="text-center text-[var(--text-secondary)] text-sm mt-8 lg:hidden">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[var(--accent-color)] hover:opacity-80 transition-opacity">
              Join SkillzLink
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
