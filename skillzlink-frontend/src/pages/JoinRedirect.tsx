import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api"

export function JoinRedirect() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (code) {
      localStorage.setItem("skillzlink_referral_code", code)
      // Track the click
      fetch(`${API}/referral-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referral_code: code }),
      }).catch(() => {})
    }
    navigate("/register", { replace: true })
  }, [code, navigate])

  return null
}
