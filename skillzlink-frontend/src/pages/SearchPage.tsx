import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { publicApi } from "../services/api"
import { SeekerSearch } from "../components/seeker/SeekerSearch"

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState("plumbing")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    publicApi.getCategories().then(data => {
      const names = (data.categories || []).map((c: any) => c.name || c.category || "")
      setCategories(names)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam) {
      setSelectedService(serviceParam)
    }
  }, [searchParams])

  return (
    <div className="wt-haslayout wt-main-section">
      <SeekerSearch service={selectedService} onServiceChange={setSelectedService} categories={categories} />
    </div>
  )
}
