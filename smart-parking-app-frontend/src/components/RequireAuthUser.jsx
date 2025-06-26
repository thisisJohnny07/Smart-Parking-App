import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuthUser = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null // or spinner

  if (!user) {
    return <Navigate to="/-in" state={{ from: location }} replace />
  }

  if (user.is_superuser) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RequireAuthUser