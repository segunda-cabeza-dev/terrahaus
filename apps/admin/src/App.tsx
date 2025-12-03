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
import { WPImporter } from './features/wp-importer'
import { 
  ProyectosList, 
  CategoriasList, 
  ProyectoEditorPage, 
  CategoriaEditorPage, 
  CategoriaNuevaPage 
} from './features/proyectos'
import { AdminLayout } from './shared'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
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
            <ProtectedRoute requiredRoles={['owner', 'admin']}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="recordatorios"
          element={
            <ProtectedRoute requiredRoles={['owner', 'admin']}>
              <Recordatorios />
            </ProtectedRoute>
          }
        />
        <Route path="contenido" element={<Contenido />} />
        <Route path="whatsapp" element={<WhatsAppConfig />} />
        <Route path="imagenes" element={<Imagenes />} />
        <Route path="contactos" element={<Contactos />} />
        <Route path="productos" element={<ProductosSimple />} />
        <Route path="proyectos">
          <Route index element={<ProyectosList />} />
          <Route path="nuevo" element={<ProyectoEditorPage />} />
          <Route path=":id" element={<ProyectoEditorPage />} />
          <Route path="categorias" element={<CategoriasList />} />
          <Route path="categorias/nueva" element={<CategoriaNuevaPage />} />
          <Route path="categorias/:id" element={<CategoriaEditorPage />} />
        </Route>
        <Route path="wp-importer" element={<WPImporter />} />
      </Route>
    </Routes>
  )
}

export default App
