import { useEffect, useState } from 'react'
import { actualizarPintor, crearPintor, eliminarPintor, obtenerPintores } from '../service/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyPainter = { nombre: '', nacionalidad: '', anioNacimiento: '', activo: true }

function Painters() {
  const [pintores, setPintores] = useState([])
  const [nacionalidades, setNacionalidades] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [nacionalidad, setNacionalidad] = useState('')
  const [estado, setEstado] = useState('')
  const [formulario, setFormulario] = useState(emptyPainter)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [erroresFormulario, setErroresFormulario] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const { user, token } = useAuth()
  const esAdmin = user?.role === 'admin'

  async function cargarPintores(filtros = {}) {
    setCargando(true)
    setError('')
    try {
      const resultado = await obtenerPintores(filtros)
      setPintores(resultado.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarPintores() }, [])

  useEffect(() => {
    async function cargarNacionalidades() {
      try {
        const resultado = await obtenerPintores()
        setNacionalidades([...new Set((resultado.data || []).map((pintor) => pintor.nacionalidad).filter(Boolean))].sort())
      } catch { /* el mensaje se informa desde la consulta principal */ }
    }
    cargarNacionalidades()
  }, [])

  function buscar(event) {
    event.preventDefault()
    cargarPintores({ nombre: busqueda.trim(), nacionalidad: nacionalidad.trim(), activo: estado })
  }

  function cambiarCampo(event) {
    const { name, value, type, checked } = event.target
    setFormulario((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }))
  }

  async function guardar(event) {
    event.preventDefault()
    setError('')
    setMensaje('')
    const errores = {}
    if (formulario.nombre.trim().length < 3) errores.nombre = 'Ingresá al menos 3 caracteres.'
    if (!formulario.nacionalidad.trim()) errores.nacionalidad = 'La nacionalidad es obligatoria.'
    if (!formulario.anioNacimiento || Number(formulario.anioNacimiento) < 1000 || Number(formulario.anioNacimiento) > new Date().getFullYear()) errores.anioNacimiento = 'Ingresá un año válido.'
    setErroresFormulario(errores)
    if (Object.keys(errores).length) return
    setGuardando(true)
    const datos = { ...formulario, anioNacimiento: Number(formulario.anioNacimiento) }
    try {
      if (editandoId) {
        await actualizarPintor(editandoId, datos, token)
        setMensaje('Pintor actualizado correctamente.')
      } else {
        await crearPintor(datos, token)
        setMensaje('Pintor creado correctamente.')
      }
      setFormulario(emptyPainter)
      setEditandoId(null)
      cargarPintores({ nombre: busqueda.trim(), nacionalidad: nacionalidad.trim(), activo: estado })
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  function editar(pintor) {
    setFormulario({ nombre: pintor.nombre, nacionalidad: pintor.nacionalidad, anioNacimiento: pintor.anioNacimiento, activo: pintor.activo })
    setErroresFormulario({})
    setEditandoId(pintor._id)
    setMensaje('')
    setError('')
  }

  async function borrar(id) {
    if (!window.confirm('¿Eliminar este pintor?')) return
    setError('')
    try {
      await eliminarPintor(id, token)
      setMensaje('Pintor eliminado correctamente.')
      cargarPintores({ nombre: busqueda.trim(), nacionalidad: nacionalidad.trim(), activo: estado })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Artistas</p><h1>Pintores</h1></div>
        <p>Consulta la colección y, si iniciaste sesión, administrá los artistas.</p>
      </div>
      <form className="search-form" onSubmit={buscar}>
        <label htmlFor="buscar-pintor">Buscar por nombre</label>
        <input id="buscar-pintor" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
        <select aria-label="Filtrar por nacionalidad" value={nacionalidad} onChange={(event) => setNacionalidad(event.target.value)}>
          <option value="">Todas las nacionalidades</option>
          {nacionalidades.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
        </select>
        <select aria-label="Filtrar por estado" value={estado} onChange={(event) => setEstado(event.target.value)}>
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button type="submit">Buscar</button>
        <button className="secondary-button filter-reset" type="button" onClick={() => { setBusqueda(''); setNacionalidad(''); setEstado(''); cargarPintores() }}>Limpiar</button>
      </form>
      {esAdmin && (
        <form className="card admin-form" onSubmit={guardar}>
          <h2>{editandoId ? 'Editar pintor' : 'Agregar pintor'}</h2>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" minLength="3" value={formulario.nombre} onChange={cambiarCampo} required />
          {erroresFormulario.nombre && <small className="field-error">{erroresFormulario.nombre}</small>}
          <label htmlFor="nacionalidad">Nacionalidad</label>
          <input id="nacionalidad" name="nacionalidad" value={formulario.nacionalidad} onChange={cambiarCampo} required />
          {erroresFormulario.nacionalidad && <small className="field-error">{erroresFormulario.nacionalidad}</small>}
          <label htmlFor="anioNacimiento">Año de nacimiento</label>
          <input id="anioNacimiento" name="anioNacimiento" type="number" min="1000" max={new Date().getFullYear()} value={formulario.anioNacimiento} onChange={cambiarCampo} required />
          {erroresFormulario.anioNacimiento && <small className="field-error">{erroresFormulario.anioNacimiento}</small>}
          <label className="check-label" htmlFor="activo"><input id="activo" name="activo" type="checkbox" checked={formulario.activo} onChange={cambiarCampo} /> Activo</label>
          <div className="form-actions">
            <button disabled={guardando} type="submit">{guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Crear pintor'}</button>
            {editandoId && <button className="secondary-button" type="button" onClick={() => { setEditandoId(null); setFormulario(emptyPainter) }}>Cancelar</button>}
          </div>
        </form>
      )}
      {mensaje && <p className="message success">{mensaje}</p>}
      {error && <p className="message error" role="alert">{error}</p>}
      {cargando ? <p>Cargando pintores...</p> : (
        <div className="card-grid">
          {pintores.map((pintor) => (
            <article className="card" key={pintor._id}>
              <h2>{pintor.nombre}</h2>
              <p><strong>Nacionalidad:</strong> {pintor.nacionalidad}</p>
              <p><strong>Nacimiento:</strong> {pintor.anioNacimiento}</p>
              <p><strong>Estado:</strong> {pintor.activo ? 'Activo' : 'Inactivo'}</p>
              {esAdmin && <div className="card-actions"><button onClick={() => editar(pintor)}>Editar</button><button className="danger-button" onClick={() => borrar(pintor._id)}>Eliminar</button></div>}
            </article>
          ))}
          {!pintores.length && <p>No se encontraron pintores.</p>}
        </div>
      )}
    </section>
  )
}

export default Painters
