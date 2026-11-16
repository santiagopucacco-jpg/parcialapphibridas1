import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute() {
  const { autenticado } = useAuth()
  const location = useLocation()
  return autenticado ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export default ProtectedRoute
