import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { SeekerSearch } from "../components/seeker/SeekerSearch"

const allowedServices = new Set([
  "plumbing",
  "electrical",
  "tutoring",
  "cleaning",
  "carpentry",
  "painting",
  "gardening",
  "appliance-repair",
])

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState("plumbing")

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam && allowedServices.has(serviceParam)) {
      setSelectedService(serviceParam)
    }
  }, [searchParams])

  return (
    <div className="wt-haslayout wt-main-section">
      <SeekerSearch service={selectedService} onServiceChange={setSelectedService} />
    </div>
  )
}
