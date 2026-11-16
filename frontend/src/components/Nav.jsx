import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Nav() {
  const { autenticado, user, logout } = useAuth()
  const navigate = useNavigate()

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <header className="nav-bar">
      <Link className="brand" to="/">Galería de Arte</Link>
      <nav aria-label="Navegación principal">
        <Link to="/pintores">Pintores</Link>
        <Link to="/cuadros">Cuadros</Link>
        {autenticado ? (
          <>
            <span className="welcome">Hola, {user.name}</span>
            <span className="role-badge">{user.role === 'admin' ? 'Admin' : 'Usuario'}</span>
            <Link to="/perfil">Mi perfil</Link>
            {user.role === 'admin' && <Link to="/admin">Administración</Link>}
            <button className="link-button" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/registro">Registrarme</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Nav
