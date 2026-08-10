import { useState } from "react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Hero } from "./components/landing/Hero"
import { FeaturedProfessionals } from "./components/landing/FeaturedProfessionals"
import { PopularServices } from "./components/landing/PopularServices"
import { HowItWorks } from "./components/landing/HowItWorks"
import { JoinInfo } from "./components/landing/JoinInfo"
import { PlatformFeatures } from "./components/landing/PlatformFeatures"
import { LimitlessExperience } from "./components/landing/LimitlessExperience"
import { SkillsFooter } from "./components/landing/SkillsFooter"
import { ApplyBannerSection } from "./pages/ApplyBannerSection"
import { LiveChatWidget } from "./components/common/LiveChatWidget"
import { publicApi } from "./services/api"

function App() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState("all")

  // Load Global Theme Settings
  useEffect(() => {
    publicApi.getThemeSettings().then(res => {
      if (res.settings) {
        // Map settings keys to CSS variable names
        const keyMap: Record<string, string> = {
          accentColor: '--accent-color',
          accentHover: '--accent-hover',
          accentLight: '--accent-light',
          textPrimary: '--text-primary',
          textSecondary: '--text-secondary',
          bgPrimary: '--bg-primary',
          bgSecondary: '--bg-secondary',
          borderColor: '--border-color',
        };
        Object.entries(res.settings).forEach(([key, value]) => {
          const varName = keyMap[key] || `--${key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/_/g, '-')}`;
          document.documentElement.style.setProperty(varName, value as string);
        });

        // Apply site name as document title
        if (res.settings.siteName) {
          document.title = res.settings.siteName as string;
        }

        // Apply favicon
        if (res.settings.faviconUrl) {
          let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = res.settings.faviconUrl as string;
        }
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
      <FeaturedProfessionals />
      <PopularServices />
      <HowItWorks />
      <JoinInfo />
      <PlatformFeatures />
      <LimitlessExperience />
      <ApplyBannerSection />
      <SkillsFooter />
      <LiveChatWidget />
    </>
  )
}

export default App
