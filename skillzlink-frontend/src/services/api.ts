/**
 * SkillzLink API Service Layer
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:18080/api"

export interface RegistrationField {
  id: number;
  label: string;
  name: string;
  type: string;
  required: boolean;
  options?: any;
  category_name: string | null;
  sort_order: number;
}

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

export function getCurrentUser(): { name: string; role: string; id?: number; email?: string } | null {
  const raw = localStorage.getItem("skillzlink_user")
  if (!raw) return null
  try { return JSON.parse(raw) as { name: string; role: string; id?: number; email?: string } } catch { return null }
}

export function setCurrentUser(user: { name: string; role: string; id?: number; email?: string }): void {
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
  dynamic_data?: Record<string, any>
  response_time?: string
  years_of_experience?: number
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
    fetchJson<{ message: string; otp?: string }>(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST",
      body: JSON.stringify({ phone_number }),
    }),

  verifyOtp: (phone_number: string, otp: string) =>
    fetchJson<{ message: string }>(
      `${API_BASE_URL}/auth/verify-otp`,
      { method: "POST", body: JSON.stringify({ phone_number, otp }) }
    ),

  loginWithPin: (phone_number: string, pin: string) =>
    fetchJson<{ token: string; user: { name: string; role: string } }>(
      `${API_BASE_URL}/auth/login`,
      { method: "POST", body: JSON.stringify({ phone_number, pin }) }
    ),
    
  requestPinReset: (phone_number: string) =>
    fetchJson<{ message: string; otp?: string }>(`${API_BASE_URL}/auth/request-pin-reset`, {
      method: "POST",
      body: JSON.stringify({ phone_number }),
    }),
    
  resetPin: (phone_number: string, otp: string, pin: string) =>
    fetchJson<{ token: string; user: { name: string; role: string } }>(`${API_BASE_URL}/auth/reset-pin`, {
      method: "POST",
      body: JSON.stringify({ phone_number, otp, pin }),
    }),

  registerSeeker: (payload: {
    name: string; phone_number: string; otp: string; pin: string; default_latitude?: number; default_longitude?: number
  }) =>
    fetchJson<{ message: string; user_id: number }>(`${API_BASE_URL}/auth/register-seeker`, {
      method: "POST", body: JSON.stringify(payload),
    }),

  registerProvider: (payload: {
    name: string; phone_number: string; otp: string; pin: string; identity_number: string;
    address: string; service_category: string; service_radius: number;
    latitude?: number; longitude?: number; description?: string;
    dynamic_data?: Record<string, any>;
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

  getCareers: () => fetchJson<{ jobs: JobPosting[] }>(`${API_BASE_URL}/careers`),

  getProviderSlots: (id: string | number, date: string) => 
    fetchJson<{ slots: string[] }>(`${API_BASE_URL}/providers/${id}/slots?date=${date}`),
    
  getProviderRegistrationFields: (category_slug: string) => 
    fetchJson<{ fields: RegistrationField[] }>(`${API_BASE_URL}/fields/provider/${category_slug}`),
}


export interface JobPosting {
  id: number
  title: string
  department: string
  location: string
  type: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
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

  getBookings: () => fetchJson<{ bookings: any[] }>(`${API_BASE_URL}/seeker/bookings`),
  
  createBooking: (payload: { provider_id: number; booking_date: string; start_time: string; end_time: string; notes?: string }) =>
    fetchJson<{ message: string; booking: any }>(`${API_BASE_URL}/seeker/bookings`, {
      method: "POST", body: JSON.stringify(payload),
    }),

  getOverview: () => fetchJson<{ stats: { saved_count: number; reports_count: number; bookings_count: number }; recent_saved: any[] }>(`${API_BASE_URL}/seeker/overview`),

  getReviews: () => fetchJson<{ reviews: any[] }>(`${API_BASE_URL}/seeker/reviews`),
  createReview: (payload: { provider_id: number; rating: number; comment: string }) =>
    fetchJson<{ message: string; review: any }>(`${API_BASE_URL}/seeker/reviews`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  updateReview: (id: number, payload: { rating: number; comment: string }) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/seeker/reviews/${id}`, {
      method: "PUT", body: JSON.stringify(payload),
    }),
  deleteReview: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/seeker/reviews/${id}`, { method: "DELETE" }),

  getBilling: () => fetchJson<{ payment_methods: any[]; transactions: any[] }>(`${API_BASE_URL}/seeker/billing`),
  addPaymentMethod: (payload: { type: string; details: Record<string, string> }) =>
    fetchJson<{ message: string; payment_method: any }>(`${API_BASE_URL}/seeker/billing/payment-methods`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  deletePaymentMethod: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/seeker/billing/payment-methods/${id}`, { method: "DELETE" }),

  getSettings: () => fetchJson<{ settings: { email_updates: boolean; sms_updates: boolean } }>(`${API_BASE_URL}/seeker/settings`),
  updateSettings: (payload: { email_updates: boolean; sms_updates: boolean }) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/seeker/settings`, {
      method: "PUT", body: JSON.stringify(payload),
    }),
  deleteAccount: () => fetchJson<{ message: string }>(`${API_BASE_URL}/seeker/account`, { method: "DELETE" }),
  requestPasswordReset: () => fetchJson<{ message: string }>(`${API_BASE_URL}/auth/password-reset`, { method: "POST" }),
}

// ─── Provider endpoints (auth required) ──────────────────────────────────────
export const providerApi = {
  getProfile: () => fetchJson<{ provider: PublicProvider }>(`${API_BASE_URL}/provider/profile`),

  updateProfile: (payload: Partial<{
    address: string; service_category: string; service_radius: number;
    latitude: number; longitude: number; description: string; contact_opt_in: boolean;
    dynamic_data: Record<string, any>;
    skills: string[];
    portfolios: any[];
    services: any[];
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

  getAvailability: () => fetchJson<{ availabilities: any[] }>(`${API_BASE_URL}/provider/availability`),
  
  setAvailability: (payload: { availabilities: any[] }) => 
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/availability`, {
      method: "POST", body: JSON.stringify(payload)
    }),

  getBookings: () => fetchJson<{ bookings: any[] }>(`${API_BASE_URL}/provider/bookings`),
  
  updateBookingStatus: (id: number, status: string) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/bookings/${id}/status`, {
      method: "PUT", body: JSON.stringify({ status })
    }),

  getServices: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return fetchJson<{ services: any[]; stats: { ongoing: number; completed: number; cancelled: number } }>(`${API_BASE_URL}/provider/services${qs}`);
  },
  getService: (id: number) =>
    fetchJson<{ service: any; history: any[] }>(`${API_BASE_URL}/provider/services/${id}`),
  sendServiceMessage: (id: number, payload: { message: string }) =>
    fetchJson<{ message: string; entry: any }>(`${API_BASE_URL}/provider/services/${id}/messages`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  cancelService: (id: number, reason?: string) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/services/${id}/cancel`, {
      method: "POST", body: JSON.stringify({ reason }),
    }),
  completeService: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/services/${id}/complete`, { method: "POST" }),
  repostService: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/services/${id}/repost`, { method: "POST" }),
  deleteService: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/services/${id}`, { method: "DELETE" }),

  getQuotes: () =>
    fetchJson<{ quotes: any[]; stats: { ongoing: number; completed: number; cancelled: number } }>(`${API_BASE_URL}/provider/quotes`),
  respondToQuote: (id: number, action: 'accept' | 'reject') =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/provider/quotes/${id}/respond`, {
      method: "POST", body: JSON.stringify({ action }),
    }),
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
  impersonateUser: (id: number) =>
    fetchJson<{ token: string; user: { name: string; role: string } }>(`${API_BASE_URL}/admin/users/${id}/impersonate`, {
      method: "POST"
    }),
  unlockUser: (id: number) =>
    fetchJson<{ message: string; user: any }>(`${API_BASE_URL}/admin/users/${id}/unlock`, {
      method: "POST"
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
  getProviderRegistrationFields: (category?: string) => {
    const url = category 
      ? `${API_BASE_URL}/registration-fields?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/registration-fields`;
    return fetchJson<{ fields: any[] }>(url);
  },
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

  getConversations: () =>
    fetchJson<{ conversations: any[] }>(`${API_BASE_URL}/admin/conversations/all`),
  getConversation: (id: number) =>
    fetchJson<{ conversation: any; messages: any[] }>(`${API_BASE_URL}/conversations/${id}`),
  sendMessage: (conversationId: number, payload: { content: string }) =>
    fetchJson<{ message: any }>(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  startConversation: (payload: { recipient_id: number; content: string }) =>
    fetchJson<{ message: string; conversation: any }>(`${API_BASE_URL}/conversations`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  getUserList: () =>
    fetchJson<{ users: any[] }>(`${API_BASE_URL}/users/list`),

  getInsights: (period?: string) => {
    const qs = period ? `?period=${period}` : '';
    return fetchJson<{ stats: { ongoing: number; completed: number; cancelled: number; reposted: number; revenue?: number; active_users?: number; completion_rate?: number }; hired_providers: any[]; chart_data: any[] }>(`${API_BASE_URL}/admin/insights${qs}`);
  },

  getPackages: () => fetchJson<{ packages: any[] }>(`${API_BASE_URL}/admin/packages`),
  createPackage: (payload: any) =>
    fetchJson<{ message: string; package: any }>(`${API_BASE_URL}/admin/packages`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  updatePackage: (id: number, payload: any) =>
    fetchJson<{ message: string; package: any }>(`${API_BASE_URL}/admin/packages/${id}`, {
      method: "PUT", body: JSON.stringify(payload),
    }),
  deletePackage: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/packages/${id}`, { method: "DELETE" }),

  getRoles: () => fetchJson<{ roles: any[] }>(`${API_BASE_URL}/admin/roles`),
  createRole: (payload: { name: string; description?: string }) =>
    fetchJson<{ message: string; role: any }>(`${API_BASE_URL}/admin/roles`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  updateRole: (id: number, payload: { name: string; description?: string }) =>
    fetchJson<{ message: string; role: any }>(`${API_BASE_URL}/admin/roles/${id}`, {
      method: "PUT", body: JSON.stringify(payload),
    }),
  deleteRole: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/admin/roles/${id}`, { method: "DELETE" }),
}

// ─── Affiliate endpoints (auth required) ─────────────────────────────────────
export const affiliateApi = {
  getOverview: () =>
    fetchJson<{ stats: { total_clicks: number; total_signups: number; total_earnings: number; pending_payout: number }; referral_code: string; referral_link: string; recent_referrals: any[] }>(`${API_BASE_URL}/affiliate/overview`),
  requestPayout: () =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/affiliate/payout`, { method: "POST" }),
}

// ─── Agent endpoints (auth required) ─────────────────────────────────────────
export const agentApi = {
  getOverview: () =>
    fetchJson<{ stats: { total_onboarded: number; commission_earned: number; active_providers: number }; onboarded_providers: any[]; onboarding_link: string }>(`${API_BASE_URL}/agent/overview`),
  getOnboardedProviders: () =>
    fetchJson<{ providers: any[] }>(`${API_BASE_URL}/agent/providers`),
}

// ─── Shared account endpoints (auth required) ────────────────────────────────
export const accountApi = {
  getSettings: () =>
    fetchJson<{ settings: { email_updates: boolean; sms_updates: boolean } }>(`${API_BASE_URL}/account/settings`),
  updateSettings: (payload: { email_updates: boolean; sms_updates: boolean }) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/account/settings`, {
      method: "PUT", body: JSON.stringify(payload),
    }),
  deleteAccount: () =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/account`, { method: "DELETE" }),
  requestPasswordReset: () =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/auth/password-reset`, { method: "POST" }),
  submitSupportTicket: (payload: { category: string; description: string }) =>
    fetchJson<{ message: string; ticket_id: number }>(`${API_BASE_URL}/support/tickets`, {
      method: "POST", body: JSON.stringify(payload),
    }),
  saveExperience: (payload: { title: string; description: string }) =>
    fetchJson<{ message: string }>(`${API_BASE_URL}/account/experience`, {
      method: "POST", body: JSON.stringify(payload),
    }),
}
