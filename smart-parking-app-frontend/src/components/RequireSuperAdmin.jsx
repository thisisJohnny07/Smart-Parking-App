import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireSuperAdmin = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    // You can render a loading spinner here or null to avoid flashing redirect
    return <div className="text-center mt-10">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/admin/sign-in" replace />
  }

  if (!user.is_superuser) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RequireSuperAdmin