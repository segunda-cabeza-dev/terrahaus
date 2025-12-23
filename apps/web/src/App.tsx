import { Routes, Route, Navigate, useParams } from 'react-router-dom'
// import { ComponentsShowcase } from './features/showcase'
// import { Inicio, QuienesSomos, MapaSitio, TerminosCondiciones, Privacidad } from './features/institucional'
import { Proyecto, ProyectoCategoria, ProyectoDetalle } from './features/proyectos'
import Home from './pages/Home'
import AlpinaBlanca from './pages/AlpinaBlanca'
import CasaCuadrante from './pages/CasaCuadrante'
import CasaHorizonte from './pages/CasaHorizonte'
import Glamping from './pages/Glamping'
import PequenaAndina from './pages/PequenaAndina'
import Proyectos from './pages/Proyectos'
import { Contacto } from './features/contacto'
// import { CallToAction } from './features/layout'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import './App.css'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Componente para sincronizar el idioma con la URL
function LanguageSync() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ['es', 'en', 'it'].includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return null;
}

// Componente para redirigir rutas legacy con parámetros
function CategoryRedirect() {
  const { categoria } = useParams<{ categoria: string }>();
  return <Navigate to={`/es/proyectos/${categoria}`} replace />;
}

function ProjectDetailRedirect() {
  const { categoria, id } = useParams<{ categoria: string; id: string }>();
  return <Navigate to={`/es/proyectos/${categoria}/${id}`} replace />;
}

function App() {
  const { i18n } = useTranslation();
  
  return (
    <>
      <Routes>
        {/* Redirect root to default language */}
        <Route path="/" element={<Navigate to="/es/proyectos" replace />} />
        {/* Solo rutas de proyectos y contacto si existen */}
  <Route path="/es" element={<Home />} />
  <Route path="/es/proyectos" element={<Proyecto />} />
  <Route path="/es/proyectos/:categoria" element={<ProyectoCategoria />} />
  <Route path="/es/proyectos/:categoria/:id" element={<ProyectoDetalle />} />
  <Route path="/es/contacto" element={<Contacto />} />
  <Route path="/es/proyectos/alpinablanca" element={<AlpinaBlanca />} />
  <Route path="/es/casacuadrante" element={<CasaCuadrante />} />
  <Route path="/es/casahorizonte" element={<CasaHorizonte />} />
  <Route path="/es/glamping" element={<Glamping />} />
  <Route path="/es/pequenaandina" element={<PequenaAndina />} />
  <Route path="/es/proyectos-todos" element={<Proyectos />} />
        {/* Puedes agregar aquí más rutas válidas según tus componentes existentes */}
      </Routes>
      <WhatsAppFloat />
    </>
  )
}

export default App
