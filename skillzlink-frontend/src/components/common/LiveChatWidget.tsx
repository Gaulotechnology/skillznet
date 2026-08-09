import { useEffect } from "react"

const LHC_BASE_URL = import.meta.env.VITE_LHC_BASE_URL || ""
const LHC_WIDGET_ENABLED = import.meta.env.VITE_LHC_WIDGET_ENABLED === "true"

/**
 * Live Helper Chat web widget.
 *
 * Set VITE_LHC_BASE_URL to your LHC installation URL (e.g. http://localhost:18080/lhc)
 * and VITE_LHC_WIDGET_ENABLED=true to activate the widget.
 *
 * After installing Live Helper Chat via the web installer at /lhc/install/,
 * the backend URL should point to your Laravel backend's public path where LHC lives.
 */
export function LiveChatWidget() {
  useEffect(() => {
    if (!LHC_WIDGET_ENABLED || !LHC_BASE_URL) return

    const LHC_API = (window as any).LHC_API || {}
    ;(window as any).LHC_API = LHC_API
    LHC_API.args = {}

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.setAttribute("crossorigin", "anonymous")
    script.async = true
    const d = new Date()
    script.src = `${LHC_BASE_URL}/design/defaulttheme/js/widgetv2/index.js?${d.getFullYear()}${d.getMonth()}${d.getDate()}`

    const firstScript = document.getElementsByTagName("script")[0]
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    } else {
      document.head.appendChild(script)
    }
  }, [])

  return null
}
