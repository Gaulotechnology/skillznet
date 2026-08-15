import { useState } from "react"
import { useEffect } from "react"
import { Hero } from "./components/landing/Hero"
import { WhatsAppRegistrationBanner } from "./components/landing/WhatsAppRegistrationBanner"
import { FeaturedProfessionals } from "./components/landing/FeaturedProfessionals"
import { PopularServices } from "./components/landing/PopularServices"
import { HowItWorks } from "./components/landing/HowItWorks"
import { JoinInfo } from "./components/landing/JoinInfo"
import { PlatformFeatures } from "./components/landing/PlatformFeatures"
import { SkillsFooter } from "./components/landing/SkillsFooter"
import { ApplyBannerSection } from "./pages/ApplyBannerSection"
import { LiveChatWidget } from "./components/common/LiveChatWidget"
import { publicApi } from "./services/api"

function App() {
  const [showJoinNetwork, setShowJoinNetwork] = useState(true)
  const [showVisibilityLevel, setShowVisibilityLevel] = useState(true)

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

        // Landing section visibility
        if (res.settings.showJoinNetwork !== undefined) {
          setShowJoinNetwork(res.settings.showJoinNetwork !== '0');
        }
        if (res.settings.showVisibilityLevel !== undefined) {
          setShowVisibilityLevel(res.settings.showVisibilityLevel !== '0');
        }
      }
    }).catch(console.error);
  }, []);

  return (
    <>
      <Hero />
      <WhatsAppRegistrationBanner />
      <FeaturedProfessionals />
      <PopularServices />
      <HowItWorks />
      <JoinInfo />
      <PlatformFeatures showPlans={showVisibilityLevel} />
      {showJoinNetwork && <ApplyBannerSection />}
      <SkillsFooter />
      <LiveChatWidget />
    </>
  )
}

export default App
