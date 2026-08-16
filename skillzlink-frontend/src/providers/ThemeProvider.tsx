import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { publicApi } from "../services/api";

interface ThemeContextType {
  settings: Record<string, any>;
  reloadTheme: () => Promise<void>;
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: {},
  reloadTheme: async () => {},
  siteName: "SkillzNet",
  logoUrl: "/images/logo.png",
  faviconUrl: "/favicon.ico",
  accentColor: "#00A843",
});

export const useTheme = () => useContext(ThemeContext);

const CSS_VAR_MAP: Record<string, string> = {
  accentColor: "--accent-color",
  accentHover: "--accent-hover",
  accentLight: "--accent-light",
  textPrimary: "--text-primary",
  textSecondary: "--text-secondary",
  bgPrimary: "--bg-primary",
  bgSecondary: "--bg-secondary",
  bgAuthPanel: "--bg-auth-panel",
  borderColor: "--border-color",
  borderRadius: "--border-radius",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>({});

  const applyThemeToDOM = (themeData: Record<string, any>) => {
    // Apply CSS Variables
    Object.entries(themeData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const varName = CSS_VAR_MAP[key] || `--${key.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/_/g, "-")}`;
      document.documentElement.style.setProperty(varName, String(value));
    });

    // Apply Site Name / Document Title
    if (themeData.siteName) {
      document.title = themeData.siteName;
    }

    // Apply Favicon
    if (themeData.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "shortcut icon";
        document.head.appendChild(link);
      }
      link.href = themeData.faviconUrl;
    }
  };

  const reloadTheme = async () => {
    try {
      const res = await publicApi.getThemeSettings();
      if (res && res.settings) {
        setSettings(res.settings);
        applyThemeToDOM(res.settings);
      }
    } catch (e) {
      console.warn("Theme load failed, using defaults:", e);
    }
  };

  useEffect(() => {
    reloadTheme();

    const handleThemeUpdate = (e: any) => {
      const updated = e.detail || {};
      setSettings((prev) => {
        const next = { ...prev, ...updated };
        applyThemeToDOM(next);
        return next;
      });
    };

    window.addEventListener("theme_updated", handleThemeUpdate);
    return () => window.removeEventListener("theme_updated", handleThemeUpdate);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        settings,
        reloadTheme,
        siteName: settings.siteName || "SkillzNet",
        logoUrl: settings.logoUrl || "/images/logo.png",
        faviconUrl: settings.faviconUrl || "/favicon.ico",
        accentColor: settings.accentColor || "#00A843",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
