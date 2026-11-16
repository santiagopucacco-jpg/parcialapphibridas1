import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { iniciarSesion, verificarSesion } from '../service/api.js'

const AuthContext = createContext(null)

function obtenerSesion(token) {
  if (!token) return { token: null, user: null }

  try {
    const payload = jwtDecode(token)
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return { token: null, user: null }

    return {
      token,
      user: { id: payload.id, name: payload.name, email: payload.email, role: payload.role || 'user' },
    }
  } catch {
    return { token: null, user: null }
  }
}

function restaurarSesion() {
  const sesion = obtenerSesion(sessionStorage.getItem('token'))
  if (!sesion.token) sessionStorage.removeItem('token')
  return sesion
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(restaurarSesion)

  useEffect(() => {
    if (!sesion.token) return

    let vigente = true
    verificarSesion(sesion.token)
      .then(({ data }) => {
        if (vigente) setSesion((actual) => ({ ...actual, user: data }))
      })
      .catch(() => {
        if (!vigente) return
        sessionStorage.removeItem('token')
        setSesion({ token: null, user: null })
      })

    return () => { vigente = false }
  }, [sesion.token])

  async function login(email, password) {
    const { token } = await iniciarSesion(email, password)
    const nuevaSesion = obtenerSesion(token)
    if (!nuevaSesion.token) throw new Error('El token recibido es inválido o venció')

    sessionStorage.setItem('token', nuevaSesion.token)
    setSesion(nuevaSesion)
  }

  function logout() {
    sessionStorage.removeItem('token')
    setSesion({ token: null, user: null })
  }

  return (
    <AuthContext.Provider value={{
      token: sesion.token,
      user: sesion.user,
      autenticado: Boolean(sesion.token && sesion.user),
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
