import { Routes, Route, Navigate, useParams } from 'react-router-dom'
// import { ComponentsShowcase } from './features/showcase'
import { Inicio, QuienesSomos, MapaSitio, TerminosCondiciones, Privacidad } from './features/institucional'
import { Proyecto, ProyectoCategoria, ProyectoDetalle } from './features/proyectos'
import { Contacto } from './features/contacto'
import { CallToAction, Footer } from './features/layout'
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
        <Route path="/" element={<Navigate to={`/${i18n.language || 'es'}`} replace />} />
        
        {/* Spanish routes */}
        <Route path="/es" element={<><LanguageSync /><Inicio /></>} />
        <Route path="/es/proyectos" element={<><LanguageSync /><Proyecto /></>} />
        <Route path="/es/proyectos/:categoria" element={<><LanguageSync /><ProyectoCategoria /></>} />
        <Route path="/es/proyectos/:categoria/:id" element={<><LanguageSync /><ProyectoDetalle /></>} />
        <Route path="/es/quienes-somos" element={<><LanguageSync /><QuienesSomos /></>} />
        <Route path="/es/contacto" element={<><LanguageSync /><Contacto /></>} />
        <Route path="/es/mapa-sitio" element={<><LanguageSync /><MapaSitio /></>} />
        <Route path="/es/terminos-condiciones" element={<><LanguageSync /><TerminosCondiciones /></>} />
        <Route path="/es/privacidad" element={<><LanguageSync /><Privacidad /></>} />

        {/* English routes */}
        <Route path="/en" element={<><LanguageSync /><Inicio /></>} />
        <Route path="/en/projects" element={<><LanguageSync /><Proyecto /></>} />
        <Route path="/en/projects/:categoria" element={<><LanguageSync /><ProyectoCategoria /></>} />
        <Route path="/en/projects/:categoria/:id" element={<><LanguageSync /><ProyectoDetalle /></>} />
        <Route path="/en/about-us" element={<><LanguageSync /><QuienesSomos /></>} />
        <Route path="/en/contact" element={<><LanguageSync /><Contacto /></>} />
        <Route path="/en/sitemap" element={<><LanguageSync /><MapaSitio /></>} />
        <Route path="/en/terms-conditions" element={<><LanguageSync /><TerminosCondiciones /></>} />
        <Route path="/en/privacy" element={<><LanguageSync /><Privacidad /></>} />

        {/* Italian routes */}
        <Route path="/it" element={<><LanguageSync /><Inicio /></>} />
        <Route path="/it/progetti" element={<><LanguageSync /><Proyecto /></>} />
        <Route path="/it/progetti/:categoria" element={<><LanguageSync /><ProyectoCategoria /></>} />
        <Route path="/it/progetti/:categoria/:id" element={<><LanguageSync /><ProyectoDetalle /></>} />
        <Route path="/it/chi-siamo" element={<><LanguageSync /><QuienesSomos /></>} />
        <Route path="/it/contatto" element={<><LanguageSync /><Contacto /></>} />
        <Route path="/it/mappa-sito" element={<><LanguageSync /><MapaSitio /></>} />
        <Route path="/it/termini-condizioni" element={<><LanguageSync /><TerminosCondiciones /></>} />
        <Route path="/it/privacy" element={<><LanguageSync /><Privacidad /></>} />

        {/* Legacy routes redirect to Spanish */}
        <Route path="/proyectos" element={<Navigate to="/es/proyectos" replace />} />
        <Route path="/proyectos/:categoria" element={<CategoryRedirect />} />
        <Route path="/proyectos/:categoria/:id" element={<ProjectDetailRedirect />} />
        <Route path="/quienes-somos" element={<Navigate to="/es/quienes-somos" replace />} />
        <Route path="/contacto" element={<Navigate to="/es/contacto" replace />} />
        <Route path="/mapa-sitio" element={<Navigate to="/es/mapa-sitio" replace />} />
        <Route path="/terminos-condiciones" element={<Navigate to="/es/terminos-condiciones" replace />} />
        <Route path="/privacidad" element={<Navigate to="/es/privacidad" replace />} />
      </Routes>
      <CallToAction />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

export default App
