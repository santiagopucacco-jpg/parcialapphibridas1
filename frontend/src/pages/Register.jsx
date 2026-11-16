import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../service/api.js'

const initialUser = { name: '', email: '', password: '', confirmPassword: '' }

function Register() {
  const [user, setUser] = useState(initialUser)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setUser((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMensaje('')
    if (user.password !== user.confirmPassword) {
      setMensaje('Las contraseñas no coinciden')
      return
    }

    setCargando(true)
    try {
      await registrarUsuario(user.name, user.email, user.password)
      navigate('/login', { replace: true })
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="card form-card">
      <h1>Crear una cuenta</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" minLength="3" value={user.name} onChange={handleChange} required />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" name="email" type="email" value={user.email} onChange={handleChange} required />
        <label htmlFor="register-password">Contraseña</label>
        <input id="register-password" name="password" type="password" minLength="6" value={user.password} onChange={handleChange} required />
        <label htmlFor="confirm-password">Repetir contraseña</label>
        <input id="confirm-password" name="confirmPassword" type="password" minLength="6" value={user.confirmPassword} onChange={handleChange} required />
        <button disabled={cargando} type="submit">{cargando ? 'Registrando...' : 'Registrarme'}</button>
      </form>
      {mensaje && <p className="message error" role="alert">{mensaje}</p>}
    </section>
  )
}

export default Register
