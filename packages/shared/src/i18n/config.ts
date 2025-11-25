import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones
const resources = {
  es: {
    translation: {
      // Header
      "nav.inicio": "Inicio",
      "nav.proyectos": "Proyectos",
      "nav.quienesSomos": "Quienes somos",
      "nav.contacto": "Contacto",
      "nav.contactanos": "Contáctanos",
      
      // Inicio
      "inicio.subtitle": "Herrería, diseño y corte láser",
      "inicio.title": "Creamos piezas únicas en hierro para todo tus proyectos",
      "inicio.cta": "Ver todos",
      
      // Proyectos
      "proyectos.subtitle": "NUESTROS PROYECTOS",
      "proyectos.title": "Conoce toda nuestra colección",
      "proyectos.search": "Probá buscar: pérgolas, puertas, carteles...",
      
      // Quienes Somos
      "quienesSomos.subtitle": "Quienes somos",
      "quienesSomos.title": "Conoce la historia detrás de nuestra marca",
      
      // Contacto
      "contacto.subtitle": "Contáctanos",
      "contacto.title": "¿Tienes algún proyecto?",
      "contacto.formTitle": "Envíanos un mensaje",
      "contacto.formSubtitle": "Te responderemos lo antes posible",
      "contacto.nombre": "Nombre",
      "contacto.email": "Email",
      "contacto.telefono": "Teléfono",
      "contacto.mensaje": "Mensaje",
      "contacto.enviar": "Enviar mensaje",
    }
  },
  en: {
    translation: {
      // Header
      "nav.inicio": "Home",
      "nav.proyectos": "Projects",
      "nav.quienesSomos": "About us",
      "nav.contacto": "Contact",
      "nav.contactanos": "Contact us",
      
      // Inicio
      "inicio.subtitle": "Metalwork, design and laser cutting",
      "inicio.title": "We create unique iron pieces for all your projects",
      "inicio.cta": "View all",
      
      // Proyectos
      "proyectos.subtitle": "OUR PROJECTS",
      "proyectos.title": "Discover our entire collection",
      "proyectos.search": "Try searching: pergolas, doors, signs...",
      
      // Quienes Somos
      "quienesSomos.subtitle": "About us",
      "quienesSomos.title": "Discover the story behind our brand",
      
      // Contacto
      "contacto.subtitle": "Contact us",
      "contacto.title": "Do you have a project?",
      "contacto.formTitle": "Send us a message",
      "contacto.formSubtitle": "We will respond as soon as possible",
      "contacto.nombre": "Name",
      "contacto.email": "Email",
      "contacto.telefono": "Phone",
      "contacto.mensaje": "Message",
      "contacto.enviar": "Send message",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
