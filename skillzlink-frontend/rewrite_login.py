import re

with open("src/pages/LoginPage.tsx", "r") as f:
    content = f.read()

# I will replace the state variables, the API handlers, and the form render sections using regex.
state_pattern = re.compile(r'  const \[phoneNumber, setPhoneNumber\] = useState\(""\).*?const navigate = useNavigate\(\)\n', re.DOTALL)
state_repl = """  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState("")
  const [otp, setOtp] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmNewPin, setConfirmNewPin] = useState("")
  const [step, setStep] = useState<"login" | "forgot_pin" | "forgot_pin_otp">("login")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
"""

handlers_pattern = re.compile(r'  const handleRequestOtp = async.*?finally \{\n      setLoading\(false\)\n    \}\n  \}\n', re.DOTALL)
handlers_repl = """  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const formattedPhone = formatPhone(phoneNumber)
      const data = await authApi.loginWithPin(formattedPhone, pin)
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
"""

content = state_pattern.sub(state_repl, content)
content = handlers_pattern.sub(handlers_repl, content)

header_pattern = re.compile(r'              <h1 className="text-xl font-bold text-\[var\(--text-primary\)\]">\n.*?We sent a code to \$\{phoneNumber\} via WhatsApp\`\}\n              </p>\n            </div>', re.DOTALL)
header_repl = """              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                {step === "login" ? "Sign in to SkillzLink" : step === "forgot_pin" ? "Reset your PIN" : "Verify & New PIN"}
              </h1>
              <p className="text-[var(--text-secondary)] mt-2 text-sm">
                {step === "login"
                  ? "Enter your phone number and PIN to access your account"
                  : step === "forgot_pin" 
                  ? "Enter your phone number to receive a reset code"
                  : `We sent a code to ${phoneNumber} via WhatsApp`}
              </p>
            </div>"""

content = header_pattern.sub(header_repl, content)

forms_pattern = re.compile(r'            \{step === "phone" \? \(\n              <form onSubmit=\{handleRequestOtp\}.*?            \)\}', re.DOTALL)
forms_repl = """            {step === "login" && (
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
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                {/* Demo Logins */}
                <div className="pt-5 mt-2 border-t border-[var(--border-color)] flex flex-col items-center gap-3">
                  <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Demo Logins</p>
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    <button type="button" onClick={() => {setPhoneNumber("771111111"); setPin("1234");}} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] rounded-lg transition-all border border-[var(--border-color)]">Admin</button>
                    <button type="button" onClick={() => {setPhoneNumber("772222222"); setPin("1234");}} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] rounded-lg transition-all border border-[var(--border-color)]">Provider</button>
                    <button type="button" onClick={() => {setPhoneNumber("773333333"); setPin("1234");}} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] rounded-lg transition-all border border-[var(--border-color)]">Seeker</button>
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
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
            )}"""
            
# fix the replace of \D manually because of the warning earlier
forms_repl = forms_repl.replace('\\D', '\\\\D')

content = forms_pattern.sub(forms_repl, content)

with open("src/pages/LoginPage.tsx", "w") as f:
    f.write(content)

