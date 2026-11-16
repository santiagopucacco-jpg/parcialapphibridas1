import { useEffect, useState } from 'react'
import { actualizarCuadro, crearCuadro, eliminarCuadro, obtenerCuadros, obtenerPintores } from '../service/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyPainting = { titulo: '', anio: '', estilo: '', pintorId: '', precioEstimado: '' }

function Paintings() {
  const [cuadros, setCuadros] = useState([])
  const [pintores, setPintores] = useState([])
  const [estilos, setEstilos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [estilo, setEstilo] = useState('')
  const [pintorFiltro, setPintorFiltro] = useState('')
  const [formulario, setFormulario] = useState(emptyPainting)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [erroresFormulario, setErroresFormulario] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const { autenticado, user, token } = useAuth()
  const esAdmin = user?.role === 'admin'

  async function cargarCuadros(titulo = '') {
    setCargando(true)
    setError('')
    try {
      const resultado = await obtenerCuadros(titulo)
      setCuadros(resultado.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function cargarPintores() {
    try {
      const resultado = await obtenerPintores()
      setPintores(resultado.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    cargarCuadros()
    cargarPintores()
  }, [autenticado])

  useEffect(() => {
    async function cargarEstilos() {
      try {
        const resultado = await obtenerCuadros()
        setEstilos([...new Set((resultado.data || []).map((cuadro) => cuadro.estilo).filter(Boolean))].sort())
      } catch { /* el mensaje se informa desde la consulta principal */ }
    }
    cargarEstilos()
  }, [])

  function buscar(event) {
    event.preventDefault()
    cargarCuadros({ titulo: busqueda.trim(), estilo: estilo.trim(), pintorId: pintorFiltro })
  }

  function cambiarCampo(event) {
    const { name, value } = event.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  async function guardar(event) {
    event.preventDefault()
    setError('')
    setMensaje('')
    const errores = {}
    if (formulario.titulo.trim().length < 2) errores.titulo = 'Ingresá al menos 2 caracteres.'
    if (!formulario.anio || Number(formulario.anio) < 1000 || Number(formulario.anio) > new Date().getFullYear()) errores.anio = 'Ingresá un año válido.'
    if (!formulario.pintorId) errores.pintorId = 'Seleccioná un pintor.'
    if (formulario.precioEstimado !== '' && Number(formulario.precioEstimado) < 0) errores.precioEstimado = 'El precio no puede ser negativo.'
    setErroresFormulario(errores)
    if (Object.keys(errores).length) return
    setGuardando(true)
    const datos = { ...formulario, anio: Number(formulario.anio), precioEstimado: formulario.precioEstimado === '' ? undefined : Number(formulario.precioEstimado) }
    try {
      if (editandoId) {
        await actualizarCuadro(editandoId, datos, token)
        setMensaje('Cuadro actualizado correctamente.')
      } else {
        await crearCuadro(datos, token)
        setMensaje('Cuadro registrado correctamente.')
      }
      setFormulario(emptyPainting)
      setEditandoId(null)
      cargarCuadros({ titulo: busqueda.trim(), estilo: estilo.trim(), pintorId: pintorFiltro })
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  function editar(cuadro) {
    setFormulario({ titulo: cuadro.titulo, anio: cuadro.anio, estilo: cuadro.estilo || '', pintorId: cuadro.pintorId?._id || cuadro.pintorId || '', precioEstimado: cuadro.precioEstimado ?? '' })
    setErroresFormulario({})
    setEditandoId(cuadro._id)
    setError('')
    setMensaje('')
  }

  async function borrar(id) {
    if (!window.confirm('¿Eliminar este cuadro?')) return
    setError('')
    try {
      await eliminarCuadro(id, token)
      setMensaje('Cuadro eliminado correctamente.')
      cargarCuadros({ titulo: busqueda.trim(), estilo: estilo.trim(), pintorId: pintorFiltro })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="page-heading collection-heading"><div><p className="eyebrow">Colección</p><h1>Cuadros</h1></div><p>Obras, autores y estilos que forman parte de la colección de la galería.</p></div>
      <form className="search-form" onSubmit={buscar}>
        <label htmlFor="buscar-cuadro">Buscar en la colección</label>
        <input id="buscar-cuadro" placeholder="Título" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
        <select aria-label="Filtrar por estilo" value={estilo} onChange={(event) => setEstilo(event.target.value)}>
          <option value="">Todos los estilos</option>
          {estilos.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
        </select>
        <select aria-label="Filtrar por pintor" value={pintorFiltro} onChange={(event) => setPintorFiltro(event.target.value)}>
          <option value="">Todos los pintores</option>
          {pintores.map((pintor) => <option key={pintor._id} value={pintor._id}>{pintor.nombre}</option>)}
        </select>
        <button type="submit">Buscar</button>
        <button className="secondary-button filter-reset" type="button" onClick={() => { setBusqueda(''); setEstilo(''); setPintorFiltro(''); cargarCuadros() }}>Limpiar</button>
      </form>
      {esAdmin && (
        <form className="card admin-form painting-form" onSubmit={guardar}>
          <div className="form-title"><p className="eyebrow">Administración</p><h2>{editandoId ? 'Editar cuadro' : 'Incorporar cuadro'}</h2></div>
          <div className="form-fields">
            <label htmlFor="titulo">Título<input id="titulo" name="titulo" minLength="2" value={formulario.titulo} onChange={cambiarCampo} required />{erroresFormulario.titulo && <small className="field-error">{erroresFormulario.titulo}</small>}</label>
            <label htmlFor="anio">Año<input id="anio" name="anio" type="number" min="1000" max={new Date().getFullYear()} value={formulario.anio} onChange={cambiarCampo} required />{erroresFormulario.anio && <small className="field-error">{erroresFormulario.anio}</small>}</label>
            <label htmlFor="estilo">Estilo<input id="estilo" name="estilo" value={formulario.estilo} onChange={cambiarCampo} /></label>
            <label htmlFor="precioEstimado">Precio estimado<input id="precioEstimado" name="precioEstimado" type="number" min="0" step="0.01" value={formulario.precioEstimado} onChange={cambiarCampo} />{erroresFormulario.precioEstimado && <small className="field-error">{erroresFormulario.precioEstimado}</small>}</label>
            <label className="wide-field" htmlFor="pintorId">Pintor<select id="pintorId" name="pintorId" value={formulario.pintorId} onChange={cambiarCampo} required><option value="">Seleccionar pintor</option>{pintores.map((pintor) => <option key={pintor._id} value={pintor._id}>{pintor.nombre}</option>)}</select>{erroresFormulario.pintorId && <small className="field-error">{erroresFormulario.pintorId}</small>}</label>
          </div>
          {!pintores.length && <p className="message error">Primero debés registrar al menos un pintor.</p>}
          <div className="form-actions"><button disabled={guardando || !pintores.length} type="submit">{guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Registrar cuadro'}</button>{editandoId && <button className="secondary-button" type="button" onClick={() => { setEditandoId(null); setFormulario(emptyPainting) }}>Cancelar</button>}</div>
        </form>
      )}
      {mensaje && <p className="message success">{mensaje}</p>}
      {error && <p className="message error" role="alert">{error}</p>}
      {cargando ? <p className="loading-text">Cargando cuadros...</p> : (
        <div className="art-grid">
          {cuadros.map((cuadro, index) => (
            <article className={'art-card art-card--' + ((index % 3) + 1)} key={cuadro._id}>
              <span className="art-number">Obra {String(index + 1).padStart(2, '0')}</span>
              <h2>{cuadro.titulo}</h2><p className="artist-name">{cuadro.pintorId?.nombre || 'Autor no disponible'}</p>
              <dl><dt>Año</dt><dd>{cuadro.anio}</dd><dt>Estilo</dt><dd>{cuadro.estilo || 'Sin especificar'}</dd>{cuadro.precioEstimado !== undefined && <><dt>Estimación</dt><dd>{'$'}{cuadro.precioEstimado}</dd></>}</dl>
              {esAdmin && <div className="card-actions"><button onClick={() => editar(cuadro)}>Editar</button><button className="danger-button" onClick={() => borrar(cuadro._id)}>Eliminar</button></div>}
            </article>
          ))}
          {!cuadros.length && <p className="empty-state">No se encontraron cuadros con esa búsqueda.</p>}
        </div>
      )}
    </section>
  )
}

export default Paintings
