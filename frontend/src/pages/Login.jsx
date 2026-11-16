import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(event) {
    event.preventDefault()
    setMensaje('')
    setCargando(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/perfil', { replace: true })
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="card form-card">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button disabled={cargando} type="submit">{cargando ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      {mensaje && <p className="message error" role="alert">{mensaje}</p>}
    </section>
  )
}

export default Login
