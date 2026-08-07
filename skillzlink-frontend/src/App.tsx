import { useState } from "react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Hero } from "./components/landing/Hero"
import { PopularServices } from "./components/landing/PopularServices"
import { JoinInfo } from "./components/landing/JoinInfo"
import { LimitlessExperience } from "./components/landing/LimitlessExperience"
import { SkillsFooter } from "./components/landing/SkillsFooter"
import { publicApi } from "./services/api"

function App() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState("all")

  // Load Global Theme Settings
  useEffect(() => {
    publicApi.getThemeSettings().then(res => {
      if (res.settings) {
        Object.entries(res.settings).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value as string);
        });
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam) {
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
