import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Painters from './pages/Painters.jsx'
import Paintings from './pages/Paintings.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import NotFound from './pages/NotFound.jsx'
import AccessDenied from './pages/AccessDenied.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <div className="app-shell">
      <Nav />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/pintores" element={<Painters />} />
          <Route path="/cuadros" element={<Paintings />} />
          <Route path="/acceso-denegado" element={<AccessDenied />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Profile />} />
            <Route element={<RoleRoute rolesPermitidos={['admin']} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
