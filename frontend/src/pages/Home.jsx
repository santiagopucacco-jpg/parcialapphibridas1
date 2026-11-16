import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <section className="hero">
        <span className="hero-disc" aria-hidden="true" />
        <span className="hero-square" aria-hidden="true" />
        <span className="hero-rule" aria-hidden="true" />
        <p className="eyebrow">Colección digital</p>
        <h1>Galería<br /><em>de</em> Arte</h1>
        <p>Un archivo vivo de artistas y obras: recorré movimientos, países y miradas que siguen dialogando entre sí.</p>
        <div className="hero-actions">
          <Link to="/cuadros">Explorar obras</Link>
          <Link to="/pintores">Conocer artistas</Link>
        </div>
      </section>
      <section className="home-note">
        <div>
          <p className="eyebrow">Sobre la galería</p>
          <h2>Una colección para recorrer y administrar</h2>
        </div>
        <div>
          <p>La galería reúne obras y artistas de distintas corrientes. Podés navegar la colección, cruzar filtros y detenerte en la información de cada registro.</p>
          <p>Con una sesión iniciada, la colección deja de ser estática: podés sumar artistas y obras, corregir datos y mantener el archivo actualizado.</p>
        </div>
      </section>
    </>
  )
}

export default Home
