// El frontend de desarrollo se abre en 127.0.0.1:5173. Mantener el mismo
// host para la API evita que una sesión o una política CORS difiera de la
// que usa el navegador.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    // options.headers trae Authorization en las acciones protegidas. Se debe
    // combinar, no reemplazar Content-Type: sin él Express no interpreta el
    // JSON del formulario y el CRUD recibe un body vacío.
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(data.message || 'Tu sesión no permite realizar esta acción. Volvé a iniciar sesión.')
    }
    throw new Error(data.errores?.join('. ') || data.message || 'No se pudo completar la operación')
  }

  return data
}

export function registrarUsuario(name, email, password) {
  return request('/api/usuarios/registro', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function iniciarSesion(email, password) {
  return request('/api/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function verificarSesion(token) {
  return request('/api/usuarios/sesion', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function obtenerPintores(filtros = {}) {
  const valores = typeof filtros === 'string' ? { nombre: filtros } : filtros
  const query = new URLSearchParams(Object.entries(valores).filter(([, valor]) => valor !== '')).toString()
  return request(`/pintores${query ? `?${query}` : ''}`)
}

export function obtenerCuadros(filtros = {}) {
  const valores = typeof filtros === 'string' ? { titulo: filtros } : filtros
  const query = new URLSearchParams(Object.entries(valores).filter(([, valor]) => valor !== '')).toString()
  return request(`/cuadros${query ? `?${query}` : ''}`)
}

export function crearPintor(pintor, token) {
  return request('/pintores', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(pintor),
  })
}

export function actualizarPintor(id, pintor, token) {
  return request(`/pintores/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(pintor),
  })
}

export function eliminarPintor(id, token) {
  return request(`/pintores/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function crearCuadro(cuadro, token) {
  return request('/cuadros', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(cuadro) })
}

export function actualizarCuadro(id, cuadro, token) {
  return request(`/cuadros/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(cuadro) })
}

export function eliminarCuadro(id, token) {
  return request(`/cuadros/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
}
