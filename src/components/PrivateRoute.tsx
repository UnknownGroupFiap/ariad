import { Navigate, useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'

export default function PrivateRoute({
  children,
  requerPerfilCompleto = true,
}: {
  children: ReactNode
  requerPerfilCompleto?: boolean
}) {
  const { isAuthenticated, isLoading, perfilCompleto } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  if (requerPerfilCompleto && !perfilCompleto) {
    return <Navigate to={ROUTES.COMPLETAR_PERFIL} replace />
  }

  return <>{children}</>
}
