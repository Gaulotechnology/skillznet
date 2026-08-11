import { Navigate, useLocation } from "react-router-dom"
import { isLoggedIn, getCurrentUser } from "../../services/api"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const user = getCurrentUser()
    const role = user?.role
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
