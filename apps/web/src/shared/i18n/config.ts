import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import es from './locales/es.json'
import en from './locales/en.json'
import it from './locales/it.json'

const resources = {
  es: { translation: es },
  en: { translation: en },
  it: { translation: it }
}

// Detectar idioma del navegador o localStorage
const savedLanguage = localStorage.getItem('language')
const browserLanguage = navigator.language.split('-')[0] // 'es-ES' -> 'es'
const defaultLanguage = savedLanguage || (resources[browserLanguage as keyof typeof resources] ? browserLanguage : 'es')

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  })

// Guardar idioma cuando cambie
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
