import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ScrollToTop from './components/ScrollToTop'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { PageLoader } from './components/LoadingSpinner'
import './App.css'

// Lazy loading de páginas para mejor rendimiento
const Home = lazy(() => import('./pages/Home'))
const AlpinaBlanca = lazy(() => import('./pages/AlpinaBlanca'))
const Gracias = lazy(() => import('./pages/Gracias'))
const CasaCuadrante = lazy(() => import('./pages/CasaCuadrante'))
const CasaHorizonte = lazy(() => import('./pages/CasaHorizonte'))
const Glamping = lazy(() => import('./pages/Glamping'))
const PequenaAndina = lazy(() => import('./pages/PequenaAndina'))
const Proyectos = lazy(() => import('./pages/Proyectos'))

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/es" replace />} />
          <Route path="/es" element={<Home />} />
          <Route path="/es/proyectos/alpinablanca" element={<AlpinaBlanca />} />
          <Route path="/es/proyectos/casacuadrante" element={<CasaCuadrante />} />
          <Route path="/es/proyectos/casahorizonte" element={<CasaHorizonte />} />
          <Route path="/es/glamping" element={<Glamping />} />
          <Route path="/es/pequenaandina" element={<PequenaAndina />} />
          <Route path="/es/proyectos-todos" element={<Proyectos />} />
          <Route path="/es/gracias" element={<Gracias />} />
        </Routes>
      </Suspense>
      <WhatsAppFloat />
    </>
  )
}

export default App
