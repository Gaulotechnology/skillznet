import { useState } from "react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Hero } from "./components/landing/Hero"
import { PopularServices } from "./components/landing/PopularServices"
import { JoinInfo } from "./components/landing/JoinInfo"
import { LimitlessExperience } from "./components/landing/LimitlessExperience"
import { SkillsFooter } from "./components/landing/SkillsFooter"
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

function App() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState("plumbing")

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam && allowedServices.has(serviceParam)) {
      setSelectedService(serviceParam)
    }
  }, [searchParams])

  return (
    <>
      <Hero selectedService={selectedService} onServiceChange={setSelectedService} />
      <PopularServices />
      <JoinInfo />
      <LimitlessExperience />
      <SkillsFooter />
    </>
  )
}

export default App
