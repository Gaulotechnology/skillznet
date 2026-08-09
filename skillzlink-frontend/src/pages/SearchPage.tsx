import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { SeekerSearch } from "../components/seeker/SeekerSearch"

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState("plumbing")

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam) {
      setSelectedService(serviceParam)
    }
  }, [searchParams])

  return (
    <div className="wt-haslayout wt-main-section">
      <SeekerSearch service={selectedService} onServiceChange={setSelectedService} />
    </div>
  )
}
