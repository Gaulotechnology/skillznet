import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { apiBaseUrl, fetchJson } from "../../services/api"
import type { ProviderResult } from "../../types/provider"

const categories = [
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
  { city: "Harare", province: "Harare", lat: -17.8292, lng: 31.0522 },
  { city: "Bulawayo", province: "Bulawayo", lat: -20.1325, lng: 28.6265 },
  { city: "Mutare", province: "Manicaland", lat: -18.9707, lng: 32.6709 },
  { city: "Gweru", province: "Midlands", lat: -19.4553, lng: 29.8152 },
  { city: "Kwekwe", province: "Midlands", lat: -18.9281, lng: 29.8149 },
  { city: "Masvingo", province: "Masvingo", lat: -20.0744, lng: 30.8327 },
  { city: "Chinhoyi", province: "Mashonaland West", lat: -17.3667, lng: 30.2 },
  { city: "Marondera", province: "Mashonaland East", lat: -18.1853, lng: 31.5519 },
  { city: "Kadoma", province: "Mashonaland West", lat: -18.3333, lng: 29.9167 },
  { city: "Bindura", province: "Mashonaland Central", lat: -17.3019, lng: 31.3306 },
  { city: "Hwange", province: "Matabeleland North", lat: -18.3647, lng: 26.4988 },
  { city: "Victoria Falls", province: "Matabeleland North", lat: -17.9243, lng: 25.856 },
]

interface SearchResponse {
  radius_used: number
  results: ProviderResult[]
}

interface SeekerSearchProps {
  service: string
  onServiceChange: (service: string) => void
}

const mockProviders: ProviderResult[] = [
  {
    id: 1,
    provider_name: "Sipho Plumbing Services",
    rating: 4.8,
    premium_badge: true,
    id_verified: true,
    distance: 2.1,
    contact_number_masked: "*******1290",
    description: "Emergency and home plumbing repairs available 7 days a week.",
  },
  {
    id: 2,
    provider_name: "Nomsa Home Electrical",
    rating: 4.7,
    premium_badge: false,
    id_verified: true,
    distance: 3.4,
    contact_number_masked: "*******4491",
    description: "Certified domestic electrical installations and repairs.",
  },
  {
    id: 3,
    provider_name: "BrightFix Pro",
    rating: 4.5,
    premium_badge: true,
    id_verified: false,
    distance: 5.2,
    contact_number_masked: "*******3362",
    description: "Quick response team for maintenance, pipes, and fittings.",
  },
]

export function SeekerSearch({ service, onServiceChange }: SeekerSearchProps) {
  const [city, setCity] = useState("Harare")
  const [radius, setRadius] = useState("10")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ProviderResult[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  const selectedProvider = useMemo(
    () => results.find((provider) => provider.id === selectedProviderId) ?? null,
    [results, selectedProviderId],
  )

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setUsingMockData(false)

    const selectedCity = zimbabweCities.find((item) => item.city === city) ?? zimbabweCities[0]

    const params = new URLSearchParams({
      service,
      lat: String(selectedCity.lat),
      lng: String(selectedCity.lng),
      radius,
    })

    try {
      const token = localStorage.getItem("skillzlink_token")
      const data = await fetchJson<SearchResponse>(`${apiBaseUrl()}/seeker/search?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setResults(data.results)
      setSelectedProviderId(data.results[0]?.id ?? null)
    } catch {
      setUsingMockData(true)
      setErrorMessage("Live API requires login token. Showing demo providers for hiring flow.")
      const fallbackResults = mockProviders.map((provider) => ({
        ...provider,
        description: `${provider.description} Category: ${service}. City: ${city}.`,
      }))
      setResults(fallbackResults)
      setSelectedProviderId(fallbackResults[0]?.id ?? null)
    } finally {
      setLoading(false)
    }
  }

  const handleNextProvider = () => {
    if (results.length === 0 || selectedProviderId === null) return
    const currentIndex = results.findIndex((provider) => provider.id === selectedProviderId)
    const nextIndex = currentIndex === results.length - 1 ? 0 : currentIndex + 1
    setSelectedProviderId(results[nextIndex].id)
  }

  return (
    <section id="find-providers" className="wt-haslayout wt-main-section">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10">
            <div className="wt-sectionhead wt-textcenter">
              <div className="wt-sectiontitle">
                <h2>Find Trusted Local Professionals</h2>
                <span>Plumbers, electricians, cleaners, tutors and more across Zimbabwe</span>
              </div>
            </div>

            <div className="wt-service-provider-search card p-4">
              <form className="wt-formtheme" onSubmit={handleSearch}>
                <fieldset>
                  <div className="form-row align-items-end">
                    <div className="form-group col-md-3">
                      <label htmlFor="serviceCategory">Service category</label>
                      <select
                        id="serviceCategory"
                        className="form-control"
                        value={service}
                        onChange={(event) => onServiceChange(event.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="cityFilter">Zimbabwean city</label>
                      <select
                        id="cityFilter"
                        className="form-control"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                      >
                        {zimbabweCities.map((item) => (
                          <option key={item.city} value={item.city}>
                            {item.city} ({item.province})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-3">
                      <label htmlFor="radiusKm">Radius (km)</label>
                      <input
                        id="radiusKm"
                        className="form-control"
                        type="number"
                        min={1}
                        max={50}
                        value={radius}
                        onChange={(event) => setRadius(event.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group col-md-2">
                      <button className="wt-btn w-100 seeker-search-btn" type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Find Providers"}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>

              {errorMessage && (
                <div className="alert alert-warning mt-3 mb-0" role="alert">
                  {errorMessage}
                </div>
              )}

              {results.length > 0 && selectedProvider && (
                <div className="wt-provider-results-info mt-4">
                  <div className="wt-profile">
                    <div className="wt-title">
                      <h3>{selectedProvider.provider_name}</h3>
                    </div>
                    <ul className="wt-userlisting-breadcrumb">
                      <li>
                        <span>⭐ {selectedProvider.rating.toFixed(1)}</span>
                      </li>
                      <li>
                        <span>📏 {selectedProvider.distance} km away</span>
                      </li>
                      {selectedProvider.premium_badge && (
                        <li>
                          <span>🏅 Premium</span>
                        </li>
                      )}
                      {selectedProvider.id_verified && (
                        <li>
                          <span>✅ ID Verified</span>
                        </li>
                      )}
                    </ul>
                    <div className="wt-description">
                      <p>{selectedProvider.description ?? "Specialist available for your requested service."}</p>
                    </div>
                    <div className="wt-btnarea">
                      <button type="button" className="wt-btn mr-2" onClick={handleNextProvider}>
                        Next Provider
                      </button>
                      <button type="button" className="wt-btn mr-2">
                        Contact Provider ({selectedProvider.contact_number_masked ?? "Hidden"})
                      </button>
                      <button type="button" className="wt-btn wt-btnactive">
                        View CV
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5>Top matches ({results.length})</h5>
                    <ul className="list-group">
                      {results.map((provider) => (
                        <li
                          key={provider.id}
                          className={`list-group-item d-flex justify-content-between align-items-center ${
                            provider.id === selectedProviderId ? "active text-white" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="btn btn-link p-0 text-left"
                            onClick={() => setSelectedProviderId(provider.id)}
                            style={{ color: provider.id === selectedProviderId ? "white" : "inherit" }}
                          >
                            {provider.provider_name}
                          </button>
                          <span>{provider.distance} km</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {usingMockData && (
                <p className="text-muted mt-3 mb-0">
                  Tip: Save a seeker API token in <code>localStorage.skillzlink_token</code> to use live backend search.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
