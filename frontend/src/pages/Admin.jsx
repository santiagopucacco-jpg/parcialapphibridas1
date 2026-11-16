import { Link } from 'react-router-dom'

function Admin() {
  return (
    <section className="card admin-panel">
      <p className="eyebrow">Administración</p>
      <h1>Gestión de la colección</h1>
      <p>Desde estas secciones podés incorporar, modificar o eliminar los datos visibles de la galería.</p>
      <div className="admin-links">
        <Link to="/pintores">Administrar pintores</Link>
        <Link to="/cuadros">Administrar cuadros</Link>
      </div>
    </section>
  )
}

export default Admin
