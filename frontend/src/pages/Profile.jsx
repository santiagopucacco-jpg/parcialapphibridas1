import { useAuth } from '../context/AuthContext.jsx'

function Profile() {
  const { user } = useAuth()
  return (
    <section className="card">
      <h1>Mi perfil</h1>
      <dl>
        <dt>Nombre</dt><dd>{user?.name}</dd>
        <dt>Email</dt><dd>{user?.email}</dd>
        <dt>Rol</dt><dd>{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</dd>
      </dl>
    </section>
  )
}

export default Profile
