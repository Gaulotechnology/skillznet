const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:18080/api"

export function apiBaseUrl(): string {
  return API_BASE_URL
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}
