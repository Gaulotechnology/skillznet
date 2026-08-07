import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { apiBaseUrl, fetchJson } from "../services/api"

const serviceCategories = [
  "plumbing",
  "electrical",
  "tutoring",
  "cleaning",
  "carpentry",
  "painting",
  "gardening",
  "appliance-repair",
]

const zimbabweCities = [
  "Harare",
  "Bulawayo",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Masvingo",
  "Chinhoyi",
  "Marondera",
  "Kadoma",
  "Bindura",
  "Hwange",
  "Victoria Falls",
]

type Role = "seeker" | "provider"

export function RegisterPage() {
  const [role, setRole] = useState<Role>("seeker")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [city, setCity] = useState("Harare")

  // Provider-specific
  const [identityNumber, setIdentityNumber] = useState("")
  const [address, setAddress] = useState("")
  const [serviceCategory, setServiceCategory] = useState("plumbing")
  const [serviceRadius, setServiceRadius] = useState("10")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const endpoint = role === "provider"
      ? `${apiBaseUrl()}/auth/register-provider`
      : `${apiBaseUrl()}/auth/register-seeker`

    const body = role === "provider"
      ? {
          name,
          phone_number: phoneNumber,
          identity_number: identityNumber,
          address: `${address}, ${city}`,
          service_category: serviceCategory,
          service_radius: parseInt(serviceRadius, 10),
          description,
        }
      : {
          name,
          phone_number: phoneNumber,
        }

    try {
      await fetchJson(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      setMessage("Registration successful! You can now login with your phone number.")
    } catch {
      setError("Registration failed. The phone number may already be in use.")
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
                  <h2>Join SkillzLink</h2>
                </div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">Register</li>
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
              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
                <div className="wt-haslayout wt-bgwhite" style={{ borderRadius: '4px', border: '1px solid #e2e2e2' }}>
                  <div className="wt-loginheader">
                    <span>Create Your Account</span>
                  </div>
                  
                  {error && <div className="alert alert-danger" style={{margin: '20px'}}>{error}</div>}
                  {message && (
                    <div className="alert alert-success" style={{margin: '20px'}}>
                      {message}{" "}
                      <Link to="/login" className="alert-link">Go to Login →</Link>
                    </div>
                  )}

                  <div className="wt-tabscontenttitle" style={{padding: '20px 20px 0'}}>
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${role === "seeker" ? "active" : ""}`}
                          onClick={() => setRole("seeker")}
                          style={{ cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: role === 'seeker' ? '2px solid #ff5851' : 'none', padding: '10px 15px', color: role === 'seeker' ? '#ff5851' : '#323232', fontWeight: role === 'seeker' ? '600' : 'normal' }}
                        >
                          I Need a Professional
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${role === "provider" ? "active" : ""}`}
                          onClick={() => setRole("provider")}
                          style={{ cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: role === 'provider' ? '2px solid #ff5851' : 'none', padding: '10px 15px', color: role === 'provider' ? '#ff5851' : '#323232', fontWeight: role === 'provider' ? '600' : 'normal' }}
                        >
                          I Am a Professional
                        </button>
                      </li>
                    </ul>
                  </div>

                  <form className="wt-formtheme wt-loginform" onSubmit={handleSubmit} style={{paddingTop: '20px'}}>
                    <fieldset>
                      <div className="form-group">
                        <input
                          id="regName"
                          type="text"
                          className="form-control"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <input
                          id="regPhone"
                          type="tel"
                          className="form-control"
                          placeholder="Phone number (+263 7X XXX XXXX)"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <span className="wt-select">
                          <select
                            id="regCity"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          >
                            {zimbabweCities.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </span>
                      </div>

                      {role === "provider" && (
                        <>
                          <div className="wt-loginheader" style={{padding: '20px 0 10px', margin: 0, borderTop: '1px solid #eee', background: 'none'}}>
                            <span>Professional Details</span>
                          </div>

                          <div className="form-group">
                            <input
                              id="regIdNumber"
                              type="text"
                              className="form-control"
                              placeholder="National ID (e.g. 63-123456A78)"
                              value={identityNumber}
                              onChange={(e) => setIdentityNumber(e.target.value)}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <input
                              id="regAddress"
                              type="text"
                              className="form-control"
                              placeholder="Street address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required
                            />
                          </div>

                          <div className="form-group form-group-half">
                            <span className="wt-select">
                              <select
                                id="regServiceCategory"
                                value={serviceCategory}
                                onChange={(e) => setServiceCategory(e.target.value)}
                              >
                                {serviceCategories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat.replace("-", " ")}
                                  </option>
                                ))}
                              </select>
                            </span>
                          </div>
                          <div className="form-group form-group-half">
                            <input
                              id="regRadius"
                              type="number"
                              className="form-control"
                              placeholder="Service radius (km)"
                              min={1}
                              max={200}
                              value={serviceRadius}
                              onChange={(e) => setServiceRadius(e.target.value)}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <textarea
                              id="regDescription"
                              className="form-control"
                              placeholder="Brief description of your services"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      <div className="wt-logininfo">
                        <button type="submit" className="wt-btn" disabled={loading} style={{width: '100%', marginBottom: '10px'}}>
                          {loading
                            ? "Registering..."
                            : role === "provider"
                              ? "Register as Professional"
                              : "Register as Service Seeker"}
                        </button>
                      </div>
                    </fieldset>
                    <div className="wt-loginfooterinfo">
                      <Link to="/login">Already have an account? Login</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
