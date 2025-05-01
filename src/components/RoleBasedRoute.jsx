import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleBasedRoute({ children, allowedRoles, requiredPermissions = [] }) {
  const { user, userRole, loading, hasPermission } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check if user has all required permissions
  if (requiredPermissions.length > 0 && !requiredPermissions.every(hasPermission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
} 