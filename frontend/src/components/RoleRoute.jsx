import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function RoleRoute({ rolesPermitidos }) {
  const { autenticado, user } = useAuth()

  if (!autenticado) return <Navigate to="/login" replace />
  if (!rolesPermitidos.includes(user?.role)) return <Navigate to="/acceso-denegado" replace />

  return <Outlet />
}

export default RoleRoute
