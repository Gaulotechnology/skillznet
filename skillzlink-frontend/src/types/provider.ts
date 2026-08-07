export interface ProviderResult {
  id: number
  provider_name: string
  rating: number
  premium_badge: boolean
  id_verified: boolean
  distance: number
  contact_number_masked: string | null
  description: string | null
}
