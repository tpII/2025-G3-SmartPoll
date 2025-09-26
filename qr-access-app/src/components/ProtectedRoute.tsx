import { Outlet, Navigate } from "react-router-dom"

interface IProtectedRouteProps {
  allowed: boolean
  loading: boolean
  redirectPath?: string
}

const ProtectedRoute = ({ allowed, loading, redirectPath = "/" } : IProtectedRouteProps) => {
  if (loading) {
    return "loading..."
    // return <Loader />
  }

  if (!allowed) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute