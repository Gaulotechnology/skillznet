/**
 * SkillzLink API Service Layer
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:18080/api"

export function apiBaseUrl(): string {
  return API_BASE_URL
}

// ─── Auth Token Helpers ───────────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem("skillzlink_token")
}

export function setToken(token: string): void {
  localStorage.setItem("skillzlink_token", token)
}

export function clearToken(): void {
  localStorage.removeItem("skillzlink_token")
  window.dispatchEvent(new Event("auth_change"))
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function getCurrentUser(): { name: string; role: string } | null {
  const raw = localStorage.getItem("skillzlink_user")
  if (!raw) return null
  try { return JSON.parse(raw) as { name: string; role: string } } catch { return null }
}

export function setCurrentUser(user: { name: string; role: string }): void {
  localStorage.setItem("skillzlink_user", JSON.stringify(user))
  window.dispatchEvent(new Event("auth_change"))
}

export function logout(): void {
  clearToken()
  localStorage.removeItem("skillzlink_user")
  window.dispatchEvent(new Event("auth_change"))
}

// ─── Core HTTP helper ─────────────────────────────────────────────────────────
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(init?.headers as Record<string, string>),
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, { ...init, headers })

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    const msg = (errBody as { message?: string }).message ?? `HTTP ${response.status}`
    throw new Error(msg)
  }

  return (await response.json()) as T
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PublicProvider {
  id: number
  name: string
  service_category: string
  rating: number
  reviews: number
  location: string
  rate: string
  description: string
  skills: string[]
  image: string
  featured: boolean
  premium_badge: boolean
  id_verified: boolean
  level?: string
  member_since?: string
  phone?: string
  completed_services?: number
  success_rate?: number
  response_time?: string
  experience?: {
    title: string
    company: string
    date: string
    desc: string
  }[]
  portfolios?: {
    image_url: string
    title: string
    description: string
  }[]
  services?: {
    name: string
    price: number
    description: string
  }[]
  client_reviews?: {
    rating: number
    comment: string
    reviewer_name: string
    date: string
  }[]
}

export interface SearchResult {
  radius_used: number
  results: Array<{
    id: number
    provider_name: string
    rating: number
    premium_badge: boolean
    id_verified: boolean
    distance: number
    contact_number_masked: string
    description: string
  }>
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────
export const authApi = {
  requestOtp: (phone_number: string) =>
    fetchJson<{ message: string; otp?: string }>(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ phone_number }),
    }),

  verifyOtp: (phone_number: string, otp: string) =>
    fetchJson<{ token: string; user: { name: string; role: string } }>(
      `${API_BASE_URL}/auth/verify-otp`,
      { method: "POST", body: JSON.stringify({ phone_number, otp }) }
    ),

  registerSeeker: (payload: {
    name: string; phone_number: string; default_latitude?: number; default_longitude?: number
  }) =>
    fetchJson<{ message: string; user_id: number }>(`${API_BASE_URL}/auth/register-seeker`, {
      method: "POST", body: JSON.stringify(payload),
    }),

  registerProvider: (payload: {
    name: string; phone_number: string; identity_number: string;
    address: string; service_category: string; service_radius: number;
    latitude?: number; longitude?: number; description?: string
  }) =>
    fetchJson<{ message: string; user_id: number; provider_id: number }>(
      `${API_BASE_URL}/auth/register-provider`,
      { method: "POST", body: JSON.stringify(payload) }
    ),
}

// ─── Public endpoints (no auth required) ─────────────────────────────────────
export const publicApi = {
  getThemeSettings: () => fetchJson<{ settings: Record<string, string> }>(`${API_BASE_URL}/theme-settings`),
  getCategories: () => fetchJson<{ categories: any[] }>(`${API_BASE_URL}/categories`),

  listProviders: (params: { category?: string; city?: string; q?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== "All"))
    ).toString()
    return fetchJson<{ data: PublicProvider[]; total: number }>(
      `${API_BASE_URL}/providers${qs ? `?${qs}` : ""}`
    )
  },

  getProvider: (id: string | number) =>
    fetchJson<{ provider: PublicProvider }>(`${API_BASE_URL}/providers/${id}`),
}

// ─── Seeker endpoints (auth required) ────────────────────────────────────────
export const seekerApi = {
  search: (service: string, lat: number, lng: number, radius?: number) => {
    const qs = new URLSearchParams({
      service, lat: String(lat), lng: String(lng), ...(radius ? { radius: String(radius) } : {}),
    })
    return fetchJson<SearchResult>(`${API_BASE_URL}/seeker/search?${qs}`)
  },

  getProviderDetails: (id: string | number) =>
    fetchJson<{ provider: PublicProvider }>(`${API_BASE_URL}/seeker/provider/${id}`),

  revealContact: (id: string | number) =>
    fetchJson<{ contact_number: string | null; contact_available: boolean }>(
      `${API_BASE_URL}/seeker/provider/${id}/contact`, { method: "POST" }
    ),

  reportProvider: (id: string | number, issue: string) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/seeker/provider/${id}/report`, {
      method: "POST", body: JSON.stringify({ issue }),
    }),
}

// ─── Provider endpoints (auth required) ──────────────────────────────────────
export const providerApi = {
  getProfile: () => fetchJson<{ provider: PublicProvider }>(`${API_BASE_URL}/provider/profile`),

  updateProfile: (payload: Partial<{
    address: string; service_category: string; service_radius: number;
    latitude: number; longitude: number; description: string; contact_opt_in: boolean
  }>) =>
    fetchJson<{ message: string; provider: PublicProvider }>(`${API_BASE_URL}/provider/profile`, {
      method: "PUT", body: JSON.stringify(payload),
    }),

  uploadCv: (file: File) => {
    const form = new FormData()
    form.append("file", file)
    const token = getToken()
    return fetch(`${API_BASE_URL}/provider/cv`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(r => r.json())
  },

  getSubscription: () =>
    fetchJson<{ tier: string; subscription_expiry: string; history: unknown[] }>(
      `${API_BASE_URL}/provider/subscription`
    ),

  subscribe: (tier: "monthly" | "quarterly", payment_method: string) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/subscribe`, {
      method: "POST", body: JSON.stringify({ tier, payment_method }),
    }),

  getAnalytics: () =>
    fetchJson<{
      profile_views: number; contact_reveals: number;
      subscription_tier: string; expiry_date: string
    }>(`${API_BASE_URL}/provider/analytics`),
}

// ─── Admin endpoints (auth required) ─────────────────────────────────────────
export const adminApi = {
  getUsers: () => fetchJson<{ users: any[] }>(`${API_BASE_URL}/admin/users`),
  createUser: (payload: any) =>
    fetchJson<{ message: string; user: any }>(`${API_BASE_URL}/admin/users`, {
      method: "POST", body: JSON.stringify(payload)
    }),
  updateUser: (id: number, payload: any) =>
    fetchJson<{ message: string; user: any }>(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PUT", body: JSON.stringify(payload)
    }),
  deleteUser: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE"
    }),

  getCategories: () => fetchJson<{ categories: any[] }>(`${API_BASE_URL}/admin/categories`),
  createCategory: (payload: any) =>
    fetchJson<{ message: string; category: any }>(`${API_BASE_URL}/admin/categories`, {
      method: "POST", body: JSON.stringify(payload)
    }),
  updateCategory: (id: number, payload: any) =>
    fetchJson<{ message: string; category: any }>(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "PUT", body: JSON.stringify(payload)
    }),
  deleteCategory: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "DELETE"
    }),

  getThemeSettings: () => fetchJson<{ settings: any }>(`${API_BASE_URL}/admin/theme-settings`),
  updateThemeSettings: (payload: { settings: Record<string, string> }) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/theme-settings`, {
      method: "POST", body: JSON.stringify(payload)
    }),

  verifyProvider: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/provider/${id}/verify`, { method: "PUT" }),
  suspendProvider: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/provider/${id}/suspend`, { method: "PUT" }),
  getSubscriptions: () => fetchJson<{ subscriptions: any }>(`${API_BASE_URL}/admin/subscriptions`),
  getStats: () => fetchJson<any>(`${API_BASE_URL}/admin/stats`),

  getRegistrationFields: () => fetchJson<{ fields: any[] }>(`${API_BASE_URL}/admin/registration-fields`),
  createRegistrationField: (payload: any) =>
    fetchJson<{ message: string; field: any }>(`${API_BASE_URL}/admin/registration-fields`, {
      method: "POST", body: JSON.stringify(payload)
    }),
  updateRegistrationField: (id: number, payload: any) =>
    fetchJson<{ message: string; field: any }>(`${API_BASE_URL}/admin/registration-fields/${id}`, {
      method: "PUT", body: JSON.stringify(payload)
    }),
  deleteRegistrationField: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/registration-fields/${id}`, {
      method: "DELETE"
    }),

  getApiLogs: (params?: { method?: string; error?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.method) qs.set("method", params.method);
    if (params?.error) qs.set("error", "1");
    return fetchJson<{ logs: any[] }>(`${API_BASE_URL}/admin/api-logs?${qs.toString()}`);
  },
}
