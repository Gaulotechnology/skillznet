import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { apiBaseUrl, fetchJson } from "../services/api"

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const data = await fetchJson<{ message: string; otp?: string }>(`${apiBaseUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })
      setMessage(data.otp ? `OTP sent: ${data.otp} (dev mode)` : "OTP sent to your phone")
      setStep("otp")
    } catch {
      setError("Could not send OTP. Please check your phone number and try again.")
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
      const data = await fetchJson<{ token: string; user: { name: string } }>(`${apiBaseUrl()}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, otp }),
      })
      localStorage.setItem("skillzlink_token", data.token)
      setMessage(`Welcome back, ${data.user.name}! You are now logged in.`)
    } catch {
      setError("Invalid or expired OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
              <div className="wt-innerbannercontent">
                <div className="wt-title">
                  <h2>Login to SkillzLink</h2>
                </div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">Login</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-xs-12 col-sm-12 col-md-10 col-lg-6">
                <div className="wt-submitreportholder wt-bgwhite p-4">
                  <div className="wt-titlebar">
                    <h2>{step === "phone" ? "Enter Your Phone Number" : "Verify OTP"}</h2>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {message && <div className="alert alert-success">{message}</div>}

                  {step === "phone" ? (
                    <form className="wt-formtheme" onSubmit={handleRequestOtp}>
                      <fieldset>
                        <div className="form-group">
                          <label htmlFor="phoneNumber">Phone number</label>
                          <input
                            id="phoneNumber"
                            type="tel"
                            className="form-control"
                            placeholder="+263 7X XXX XXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                          <small className="form-text text-muted">
                            Enter the phone number you registered with.
                          </small>
                        </div>
                        <div className="form-group">
                          <button className="wt-btn w-100" type="submit" disabled={loading}>
                            {loading ? "Sending OTP..." : "Send OTP"}
                          </button>
                        </div>
                      </fieldset>
                    </form>
                  ) : (
                    <form className="wt-formtheme" onSubmit={handleVerifyOtp}>
                      <fieldset>
                        <div className="form-group">
                          <label htmlFor="otpCode">Enter OTP code</label>
                          <input
                            id="otpCode"
                            type="text"
                            className="form-control"
                            placeholder="6-digit OTP"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                          <small className="form-text text-muted">
                            Check your WhatsApp or SMS for the code.
                          </small>
                        </div>
                        <div className="form-group">
                          <button className="wt-btn w-100" type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify & Login"}
                          </button>
                        </div>
                        <div className="form-group text-center">
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => { setStep("phone"); setOtp(""); setError(null); setMessage(null) }}
                          >
                            ← Change phone number
                          </button>
                        </div>
                      </fieldset>
                    </form>
                  )}

                  <hr />
                  <div className="text-center">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="wt-btn wt-btnactive">
                      Register Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
