import { Routes, Route } from 'react-router-dom'
// import { ComponentsShowcase } from './features/showcase'
import { Inicio, QuienesSomos, MapaSitio, TerminosCondiciones, Privacidad } from './features/institucional'
import { Proyecto, ProyectoCategoria, ProyectoDetalle } from './features/proyectos'
import { Contacto } from './features/contacto'
import { TopBar, Header, CallToAction, Footer } from './features/layout'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import './App.css'

function App() {
  return (
    <>
      <TopBar />
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyectos" element={<Proyecto />} />
        <Route path="/proyectos/:categoria" element={<ProyectoCategoria />} />
        <Route path="/proyectos/:categoria/:id" element={<ProyectoDetalle />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/mapa-sitio" element={<MapaSitio />} />
        <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
        <Route path="/privacidad" element={<Privacidad />} />
        {/* <Route path="/elements" element={<ComponentsShowcase />} /> */}
      </Routes>
      <CallToAction />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

export default App
