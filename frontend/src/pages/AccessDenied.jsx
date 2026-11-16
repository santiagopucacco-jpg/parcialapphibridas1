import { Link } from 'react-router-dom'

function AccessDenied() {
  return (
    <section className="card access-denied">
      <p className="eyebrow">Acceso restringido</p>
      <h1>Esta sección es solo para administración</h1>
      <p>Podés seguir consultando la colección, pero necesitás una cuenta con rol administrador para modificarla.</p>
      <Link to="/cuadros">Volver a la colección</Link>
    </section>
  )
}

export default AccessDenied
