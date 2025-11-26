import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export const useLocalizedRoutes = () => {
  const { t, i18n } = useTranslation();
  
  // Obtener slug traducido
  const getRoute = (routeKey: string) => {
    const baseRoute = t(`routes.${routeKey}`);
    return baseRoute ? `/${i18n.language}/${baseRoute}` : `/${i18n.language}`;
  };

  // Obtener ruta sin idioma (para comparaciones)
  const getRouteWithoutLang = (routeKey: string) => {
    return t(`routes.${routeKey}`);
  };

  return { getRoute, getRouteWithoutLang };
};

// Hook para cambiar idioma y redirigir a la ruta correcta
export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (newLang: string) => {
    const currentPath = location.pathname;
    
    // Mapeo de rutas entre idiomas
    const routeMap: Record<string, string> = {
      // Español
      '/es': '',
      '/es/proyectos': 'projects',
      '/es/quienes-somos': 'about',
      '/es/contacto': 'contact',
      '/es/mapa-sitio': 'sitemap',
      '/es/terminos-condiciones': 'terms',
      '/es/privacidad': 'privacy',
      // Inglés
      '/en': '',
      '/en/projects': 'projects',
      '/en/about-us': 'about',
      '/en/contact': 'contact',
      '/en/sitemap': 'sitemap',
      '/en/terms-conditions': 'terms',
      '/en/privacy': 'privacy',
      // Italiano
      '/it': '',
      '/it/progetti': 'projects',
      '/it/chi-siamo': 'about',
      '/it/contatto': 'contact',
      '/it/mappa-sito': 'sitemap',
      '/it/termini-condizioni': 'terms',
      '/it/privacy': 'privacy',
    };

    // Encontrar la clave de ruta actual
    let routeKey = routeMap[currentPath] || '';
    
    // Manejar rutas de proyectos con parámetros
    if (currentPath.includes('/proyectos/') || currentPath.includes('/projects/') || currentPath.includes('/progetti/')) {
      const parts = currentPath.split('/').filter(p => p);
      if (parts.length >= 2) {
        // Es una categoría o detalle de proyecto - mantener estructura
        const restOfPath = parts.slice(2).join('/');
        const translations: Record<string, string> = {
          'es': 'proyectos',
          'en': 'projects',
          'it': 'progetti'
        };
        navigate(`/${newLang}/${translations[newLang]}/${restOfPath}`);
        i18n.changeLanguage(newLang);
        return;
      }
      routeKey = 'projects';
    }

    // Construir nueva ruta
    const translations: Record<string, Record<string, string>> = {
      'es': {
        '': '',
        'projects': 'proyectos',
        'about': 'quienes-somos',
        'contact': 'contacto',
        'sitemap': 'mapa-sitio',
        'terms': 'terminos-condiciones',
        'privacy': 'privacidad'
      },
      'en': {
        '': '',
        'projects': 'projects',
        'about': 'about-us',
        'contact': 'contact',
        'sitemap': 'sitemap',
        'terms': 'terms-conditions',
        'privacy': 'privacy'
      },
      'it': {
        '': '',
        'projects': 'progetti',
        'about': 'chi-siamo',
        'contact': 'contatto',
        'sitemap': 'mappa-sito',
        'terms': 'termini-condizioni',
        'privacy': 'privacy'
      }
    };

    const newRoute = translations[newLang][routeKey];
    const newPath = newRoute ? `/${newLang}/${newRoute}` : `/${newLang}`;
    
    // Cambiar idioma y navegar
    i18n.changeLanguage(newLang);
    navigate(newPath);
  };

  return { changeLanguage };
};
