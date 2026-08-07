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

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const data = await authApi.requestOtp(phoneNumber)
      setMessage(data.otp ? `Dev mode OTP: ${data.otp}` : "OTP sent to your phone via WhatsApp/SMS")
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
      const data = await authApi.verifyOtp(phoneNumber, otp)
      setToken(data.token)
      setCurrentUser(data.user)
      // Redirect based on role
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
    <>
      {/* Banner */}
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>Welcome Back</h2></div>
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
              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-5">

                {/* Card */}
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                  overflow: 'hidden',
                }}>
                  {/* Card Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--primary-color, #ff5851) 0%, #ff8a4c 100%)',
                    padding: '36px 32px 28px',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <i className="lnr lnr-user" style={{ fontSize: '28px', color: '#fff' }}></i>
                    </div>
                    <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '22px', fontWeight: 700 }}>
                      {step === "phone" ? "Sign In to SkillzLink" : "Verify Your Number"}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '14px' }}>
                      {step === "phone"
                        ? "Enter your phone number to receive an OTP"
                        : `OTP sent to ${phoneNumber}`
                      }
                    </p>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '32px' }}>
                    {error && (
                      <div style={{
                        background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '8px',
                        padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                      }}>
                        <i className="lnr lnr-cross-circle" style={{ color: '#f5222d', fontSize: '18px' }}></i>
                        <span style={{ color: '#f5222d', fontSize: '14px' }}>{error}</span>
                      </div>
                    )}
                    {message && (
                      <div style={{
                        background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px',
                        padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                      }}>
                        <i className="lnr lnr-checkmark-circle" style={{ color: '#52c41a', fontSize: '18px' }}></i>
                        <span style={{ color: '#52c41a', fontSize: '14px' }}>{message}</span>
                      </div>
                    )}

                    {step === "phone" ? (
                      <form className="wt-formtheme" onSubmit={handleRequestOtp}>
                        <fieldset>
                          <div className="form-group">
                            <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                              Phone Number
                            </label>
                            <input
                              id="loginPhone"
                              type="tel"
                              className="form-control"
                              placeholder="+263 7X XXX XXXX"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                              style={{ height: '48px', fontSize: '15px' }}
                            />
                            <small style={{ color: '#888', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                              Enter the number you registered with
                            </small>
                          </div>
                          <button
                            className="wt-btn"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 600, marginTop: '8px' }}
                          >
                            {loading ? (
                              <><i className="fa fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Sending OTP...</>
                            ) : (
                              <><i className="lnr lnr-smartphone" style={{ marginRight: '8px' }}></i>Send OTP</>
                            )}
                          </button>
                        </fieldset>
                      </form>
                    ) : (
                      <form className="wt-formtheme" onSubmit={handleVerifyOtp}>
                        <fieldset>
                          <div className="form-group">
                            <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                              Enter OTP Code
                            </label>
                            <input
                              id="loginOtp"
                              type="text"
                              className="form-control"
                              placeholder="6-digit code"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              required
                              style={{ height: '48px', fontSize: '24px', letterSpacing: '8px', textAlign: 'center', fontWeight: 700 }}
                            />
                            <small style={{ color: '#888', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                              Check your WhatsApp or SMS
                            </small>
                          </div>
                          <button
                            className="wt-btn"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 600, marginTop: '8px' }}
                          >
                            {loading ? (
                              <><i className="fa fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Verifying...</>
                            ) : (
                              <><i className="lnr lnr-checkmark-circle" style={{ marginRight: '8px' }}></i>Verify & Login</>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setStep("phone"); setOtp(""); setError(null); setMessage(null) }}
                            style={{
                              width: '100%', marginTop: '12px', background: 'none', border: 'none',
                              color: '#888', fontSize: '13px', cursor: 'pointer', padding: '8px'
                            }}
                          >
                            ← Change phone number
                          </button>
                        </fieldset>
                      </form>
                    )}

                    {/* Example Credentials */}
                    <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                      <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#333' }}>
                        Demo Accounts (OTP will auto-fill or use any 6 digits):
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span><strong>Admin:</strong> +263771111111</span>
                          <button onClick={() => setPhoneNumber('+263771111111')} style={{ padding: '4px 10px', fontSize: '11px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Use</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span><strong>Provider:</strong> +263772222222</span>
                          <button onClick={() => setPhoneNumber('+263772222222')} style={{ padding: '4px 10px', fontSize: '11px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Use</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span><strong>Customer:</strong> +263773333333</span>
                          <button onClick={() => setPhoneNumber('+263773333333')} style={{ padding: '4px 10px', fontSize: '11px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Use</button>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
                      <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                      <span style={{ color: '#bbb', fontSize: '12px' }}>OR</span>
                      <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#888', fontSize: '14px', marginBottom: '12px' }}>Don't have an account?</p>
                      <Link
                        to="/register"
                        style={{
                          display: 'inline-block', padding: '12px 32px', borderRadius: '8px',
                          border: '2px solid var(--primary-color, #ff5851)',
                          color: 'var(--primary-color, #ff5851)', fontWeight: 600, fontSize: '14px',
                          textDecoration: 'none', transition: 'all 0.2s'
                        }}
                      >
                        Create an Account
                      </Link>
                    </div>
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
