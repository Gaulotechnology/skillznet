import { useState, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { Link } from "react-router-dom"
import { authApi, publicApi } from "../services/api"

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

  // Options
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fieldsLoading, setFieldsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load categories and dynamic form fields in parallel
    Promise.all([
      publicApi.getCategories().then(res => setCategories(res.categories || [])),
      fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:18080/api"}/registration-fields`)
        .then(r => r.json())
        .then(data => {
          const fields: RegistrationField[] = (data.fields || []).sort(
            (a: RegistrationField, b: RegistrationField) => a.sort_order - b.sort_order
          )
          setDynamicFields(fields)
          // Init values
          const init: Record<string, string | boolean> = {}
          fields.forEach(f => { init[f.name] = f.type === "checkbox" ? false : "" })
          setDynamicValues(init)
        })
    ]).finally(() => setFieldsLoading(false))
  }, [])

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (role === "provider") {
        // Build extended description including dynamic field data
        const extraFields = dynamicFields
          .filter(f => dynamicValues[f.name] !== "" && dynamicValues[f.name] !== false)
          .map(f => `${f.label}: ${dynamicValues[f.name]}`)
          .join(" | ")

        const fullDescription = [description, extraFields].filter(Boolean).join("\n\n")

        await authApi.registerProvider({
          name,
          phone_number: phoneNumber,
          identity_number: identityNumber,
          address: `${address}, ${city}`,
          service_category: serviceCategory,
          service_radius: parseInt(serviceRadius, 10),
          description: fullDescription,
        })
      } else {
        await authApi.registerSeeker({ name, phone_number: phoneNumber })
      }
      setMessage("Registration successful! You can now login with your phone number.")
    } catch {
      setError("Registration failed. The phone number may already be in use.")
    } finally {
      setLoading(false)
    }
  }

  const renderDynamicField = (field: RegistrationField) => {
    const val = dynamicValues[field.name]
    const commonStyle = { height: '44px', fontSize: '14px' }

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            className="form-control"
            placeholder={field.placeholder || field.label}
            required={field.is_required}
            value={val as string}
            onChange={handleDynamicChange}
            rows={3}
            style={{ fontSize: '14px' }}
          />
        )
      case "dropdown":
        return (
          <span className="wt-select">
            <select
              name={field.name}
              required={field.is_required}
              value={val as string}
              onChange={handleDynamicChange}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {(field.options || []).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </span>
        )
      case "checkbox":
        return (
          <span className="wt-radio">
            <input
              type="checkbox"
              id={`dyn_${field.name}`}
              name={field.name}
              checked={!!val}
              onChange={handleDynamicChange}
            />
            <label htmlFor={`dyn_${field.name}`}>{field.label}</label>
          </span>
        )
      case "file":
        return (
          <input
            type="file"
            name={field.name}
            className="form-control"
            required={field.is_required}
            style={{ ...commonStyle, padding: '10px' }}
          />
        )
      case "number":
        return (
          <input
            type="number"
            name={field.name}
            className="form-control"
            placeholder={field.placeholder || field.label}
            required={field.is_required}
            value={val as string}
            onChange={handleDynamicChange}
            style={commonStyle}
          />
        )
      default:
        return (
          <input
            type="text"
            name={field.name}
            className="form-control"
            placeholder={field.placeholder || field.label}
            required={field.is_required}
            value={val as string}
            onChange={handleDynamicChange}
            style={commonStyle}
          />
        )
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
                <div className="wt-title"><h2>Join SkillzLink</h2></div>
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
              <div className="col-xs-12 col-sm-12 col-md-10 col-lg-7">

                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                  overflow: 'hidden',
                }}>

                  {/* Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--primary-color, #ff5851) 0%, #ff8a4c 100%)',
                    padding: '32px 32px 24px',
                    textAlign: 'center',
                  }}>
                    <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '22px', fontWeight: 700 }}>
                      Create Your Account
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '14px' }}>
                      Join thousands of professionals and seekers on SkillzLink
                    </p>
                  </div>

                  {/* Role Toggle */}
                  <div style={{ padding: '0 32px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', gap: 0 }}>
                      {([
                        { value: "seeker", icon: "lnr-magnifier", label: "I Need a Professional" },
                        { value: "provider", icon: "lnr-briefcase", label: "I Am a Professional" },
                      ] as { value: Role; icon: string; label: string }[]).map(tab => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => setRole(tab.value)}
                          style={{
                            flex: 1, padding: '16px 12px', border: 'none', background: 'none',
                            cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                            color: role === tab.value ? 'var(--primary-color, #ff5851)' : '#888',
                            borderBottom: role === tab.value ? '3px solid var(--primary-color, #ff5851)' : '3px solid transparent',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          }}
                        >
                          <i className={`lnr ${tab.icon}`} style={{ fontSize: '16px' }}></i>
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Body */}
                  <div style={{ padding: '28px 32px 32px' }}>
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
                        padding: '16px', marginBottom: '20px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <i className="lnr lnr-checkmark-circle" style={{ color: '#52c41a', fontSize: '20px' }}></i>
                          <span style={{ color: '#52c41a', fontSize: '14px', fontWeight: 600 }}>{message}</span>
                        </div>
                        <Link to="/login" className="wt-btn" style={{ display: 'inline-block', padding: '10px 24px' }}>
                          Go to Login →
                        </Link>
                      </div>
                    )}

                    {!message && (
                      <form className="wt-formtheme" onSubmit={handleSubmit}>
                        <fieldset>
                          {/* ── Section: Basic Info ── */}
                          <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
                              Basic Information
                            </h4>
                          </div>

                          <div className="form-group">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Full Name *</label>
                            <input
                              id="regName" type="text" className="form-control"
                              placeholder="Your full name"
                              value={name} onChange={(e) => setName(e.target.value)}
                              required style={{ height: '44px' }}
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Phone Number *</label>
                            <input
                              id="regPhone" type="tel" className="form-control"
                              placeholder="+263 7X XXX XXXX"
                              value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                              required style={{ height: '44px' }}
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>City *</label>
                            <span className="wt-select">
                              <select id="regCity" value={city} onChange={(e) => setCity(e.target.value)}>
                                {zimbabweCities.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </span>
                          </div>

                          {/* ── Section: Provider Fields ── */}
                          {role === "provider" && (
                            <>
                              <div style={{ margin: '24px 0 16px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                  Professional Details
                                </h4>
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>National ID *</label>
                                <input
                                  id="regIdNumber" type="text" className="form-control"
                                  placeholder="e.g. 63-123456A78"
                                  value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)}
                                  required style={{ height: '44px' }}
                                />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Street Address *</label>
                                <input
                                  id="regAddress" type="text" className="form-control"
                                  placeholder="e.g. 12 Samora Machel Ave"
                                  value={address} onChange={(e) => setAddress(e.target.value)}
                                  required style={{ height: '44px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', gap: '12px' }}>
                                <div className="form-group" style={{ flex: 2 }}>
                                  <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Service Category *</label>
                                  <span className="wt-select">
                                    <select
                                      id="regServiceCategory"
                                      value={serviceCategory}
                                      onChange={(e) => setServiceCategory(e.target.value)}
                                      required
                                    >
                                      <option value="" disabled>Select a category</option>
                                      {categories.map((c) => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                      ))}
                                    </select>
                                  </span>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                  <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Radius (km) *</label>
                                  <input
                                    id="regRadius" type="number" className="form-control"
                                    placeholder="10" min={1} max={200}
                                    value={serviceRadius} onChange={(e) => setServiceRadius(e.target.value)}
                                    required style={{ height: '44px' }}
                                  />
                                </div>
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Brief Description</label>
                                <textarea
                                  id="regDescription" className="form-control" rows={3}
                                  placeholder="Describe your services and experience..."
                                  value={description} onChange={(e) => setDescription(e.target.value)}
                                  style={{ fontSize: '14px' }}
                                />
                              </div>

                              {/* ── Dynamic Fields from Admin Form Builder ── */}
                              {!fieldsLoading && dynamicFields.length > 0 && (
                                <>
                                  <div style={{ margin: '24px 0 16px' }}>
                                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                      Additional Information
                                    </h4>
                                  </div>
                                  {dynamicFields.map(field => (
                                    <div className="form-group" key={field.id}>
                                      {field.type !== "checkbox" && (
                                        <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                                          {field.label} {field.is_required && "*"}
                                        </label>
                                      )}
                                      {renderDynamicField(field)}
                                    </div>
                                  ))}
                                </>
                              )}
                              {fieldsLoading && (
                                <div style={{ textAlign: 'center', padding: '12px', color: '#888', fontSize: '13px' }}>
                                  <i className="fa fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>
                                  Loading additional fields...
                                </div>
                              )}
                            </>
                          )}

                          {/* Submit */}
                          <button
                            type="submit"
                            className="wt-btn"
                            disabled={loading}
                            style={{ width: '100%', height: '50px', fontSize: '15px', fontWeight: 700, marginTop: '16px' }}
                          >
                            {loading ? (
                              <><i className="fa fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Registering...</>
                            ) : role === "provider" ? (
                              <><i className="lnr lnr-briefcase" style={{ marginRight: '8px' }}></i>Register as Professional</>
                            ) : (
                              <><i className="lnr lnr-user" style={{ marginRight: '8px' }}></i>Register as Service Seeker</>
                            )}
                          </button>
                        </fieldset>

                        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                          <span style={{ color: '#888', fontSize: '14px' }}>Already have an account?{" "}</span>
                          <Link to="/login" style={{ color: 'var(--primary-color, #ff5851)', fontWeight: 600, fontSize: '14px' }}>
                            Sign In →
                          </Link>
                        </div>
                      </form>
                    )}
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
