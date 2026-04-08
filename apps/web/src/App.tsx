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
const L1ReformasIntegrales = lazy(() => import('./pages/L1ReformasIntegrales'))
const L1PinturaAlisado = lazy(() => import('./pages/L1PinturaAlisado'))

const L2ReformasCocina = lazy(() => import('./pages/L2ReformasCocina'))
const L2Electricidad = lazy(() => import('./pages/L2Electricidad'))
const L2AireAcondicionado = lazy(() => import('./pages/L2AireAcondicionado'))
const L2Fontaneria = lazy(() => import('./pages/L2Fontaneria'))

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos/alpinablanca" element={<AlpinaBlanca />} />
          <Route path="/proyectos/casacuadrante" element={<CasaCuadrante />} />
          <Route path="/proyectos/casahorizonte" element={<CasaHorizonte />} />
          <Route path="/glamping" element={<Glamping />} />
          <Route path="/pequenaandina" element={<PequenaAndina />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/l1-reformas-integrales" element={<L1ReformasIntegrales />} />
          <Route path="/l1-pintura-alisado" element={<L1PinturaAlisado />} />
          <Route path="/reformas-cocina" element={<L2ReformasCocina />} />
          <Route path="/l1-electricista-alicante" element={<L2Electricidad />} />
          <Route path="/l1-tecnico-aire-acondicionado-alicante" element={<L2AireAcondicionado />} />
          <Route path="/l1-fontanero-alicante" element={<L2Fontaneria />} />
          <Route path="/electricista-alicante" element={<Navigate to="/l1-electricista-alicante" replace />} />
          <Route path="/l1-aire-acondicionado-alicante" element={<Navigate to="/l1-tecnico-aire-acondicionado-alicante" replace />} />
          <Route path="/l1-fontaneria-alicante" element={<Navigate to="/l1-fontanero-alicante" replace />} />
          {/* Redirecciones desde rutas antiguas con /es */}
          <Route path="/es" element={<Navigate to="/" replace />} />
          <Route path="/es/*" element={<Navigate to="/" replace />} />
          {/* Fallback para rutas no definidas (evita página en blanco) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <WhatsAppFloat />
    </>
  )
}

export default App
