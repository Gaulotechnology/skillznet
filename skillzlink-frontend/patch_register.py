import re

with open("src/pages/RegisterPage.tsx", "r") as f:
    content = f.read()

# 1. Add new state variables for OTP and PIN
state_repl = """  const [dynamicValues, setDynamicValues] = useState<Record<string, string | boolean>>({})

  // New Registration Steps
  const [step, setStep] = useState<"details" | "otp" | "pin">("details")
  const [otp, setOtp] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
"""
content = content.replace('  const [dynamicValues, setDynamicValues] = useState<Record<string, string | boolean>>({})', state_repl)

# 2. Update handleSubmit to handle the steps
handle_submit_repl = """  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const formattedPhone = formatPhone(phoneNumber)

      if (step === "details") {
        // Step 1: Send OTP
        const res = await authApi.requestOtp(formattedPhone)
        setMessage(res.otp ? `Dev OTP: ${res.otp}` : "OTP sent via WhatsApp/SMS")
        setStep("otp")
      } else if (step === "otp") {
        // Step 2: Verify OTP
        await authApi.verifyOtp(formattedPhone, otp)
        setStep("pin")
        setMessage(null)
      } else if (step === "pin") {
        // Step 3: Create PIN and Register
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
          })
        } else {
          await authApi.registerSeeker({ name, phone_number: formattedPhone, otp, pin })
        }
        setMessage("Registration successful! You can now login with your phone number and PIN.")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }"""

# Find handleSubmit function block and replace it
# Use regex to find everything from 'const handleSubmit = async (e: FormEvent) => {' to the closing brace of handleSubmit.
pattern = re.compile(r'  const handleSubmit = async \(e: FormEvent\) => \{.*?\n  \}', re.DOTALL)
content = pattern.sub(handle_submit_repl, content)

# 3. Update the form UI to show the different steps
form_ui_repl = """            {error && (
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
                  {/* Account Type Selection */}"""

content = content.replace("""            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <i className="lnr lnr-cross-circle text-red-500 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type Selection */}""", form_ui_repl)

# Add closing tags for details step and add OTP/PIN steps
submit_button_pattern = re.compile(r'(              {/\* Submit \*/}.*?              </button>)', re.DOTALL)

submit_button_repl = """              {/* Submit */}
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
              )}"""

content = submit_button_pattern.sub(submit_button_repl, content)

with open("src/pages/RegisterPage.tsx", "w") as f:
    f.write(content)

