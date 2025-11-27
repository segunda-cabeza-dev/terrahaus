import { Routes, Route } from 'react-router-dom'
import { Login, ProtectedRoute } from './features/auth'
import { Galeria } from './features/galeria'
import { Usuarios } from './features/usuarios'
import { Contenido } from './features/contenido'
import WhatsAppConfig from './features/contenido/WhatsAppConfig'
import { Imagenes } from './features/imagenes'
import { Contactos } from './features/contactos'
import { ProductosSimple } from './features/productos'
import { Recordatorios } from './features/recordatorios'
import { AdminLayout } from './shared'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Galeria />} />
        <Route path="galeria" element={<Galeria />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredRoles={['dueño', 'admin']}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="recordatorios"
          element={
            <ProtectedRoute requiredRoles={['dueño', 'admin']}>
              <Recordatorios />
            </ProtectedRoute>
          }
        />
  <Route path="contenido" element={<Contenido />} />
  <Route path="whatsapp" element={<WhatsAppConfig />} />
        <Route path="imagenes" element={<Imagenes />} />
        <Route path="contactos" element={<Contactos />} />
        <Route path="productos" element={<ProductosSimple />} />
      </Route>
    </Routes>
  )
}

export default App
