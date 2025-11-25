import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth, type UserRole } from '@beltrame/shared'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await auth.getCurrentUser()
      
      if (!user) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)

      // Si se especificaron roles requeridos, verificar
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = await auth.hasRole(user.id, requiredRoles)
        setHasPermission(hasRole)
      } else {
        // Si no se especificaron roles, cualquier usuario autenticado tiene permiso
        setHasPermission(true)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAuthenticated(false)
      setHasPermission(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verificando permisos...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección
          </p>
          <a
            href="/admin/dashboard"
            className="text-blue-600 hover:underline"
          >
            Volver al Dashboard
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
