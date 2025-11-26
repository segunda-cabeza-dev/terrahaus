import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '../../shared/hooks/useLocalizedRoutes';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguageSwitcher();
  
  // Función para construir rutas localizadas
  const getLocalizedPath = (route: string) => {
    const translations: Record<string, Record<string, string>> = {
      'es': {
        'home': '',
        'projects': 'proyectos',
        'about': 'quienes-somos',
        'contact': 'contacto',
        'sitemap': 'mapa-sitio',
        'privacy': 'privacidad',
        'terms': 'terminos-condiciones',
      },
      'en': {
        'home': '',
        'projects': 'projects',
        'about': 'about-us',
        'contact': 'contact',
        'sitemap': 'sitemap',
        'privacy': 'privacy',
        'terms': 'terms-conditions',
      },
      'it': {
        'home': '',
        'projects': 'progetti',
        'about': 'chi-siamo',
        'contact': 'contatto',
        'sitemap': 'mappa-sito',
        'privacy': 'privacy',
        'terms': 'termini-condizioni',
      }
    };
    
    const translatedRoute = translations[i18n.language]?.[route] || translations['es'][route];
    return translatedRoute ? `/${i18n.language}/${translatedRoute}` : `/${i18n.language}`;
  };
  
  return (
    <footer className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_280px_200px_auto] gap-8 lg:gap-16 mb-12">
          {/* Logo y descripción */}
          <div className="flex flex-col gap-6 items-start">
            <a href={getLocalizedPath('home')}>
              <img
                src="/assets/icons/Logo Beltrame Blanco.png"
                alt="Beltrame"
                className="w-44 h-auto hover:opacity-80 transition-opacity"
              />
            </a>
            <p className="text-white leading-relaxed" style={{ fontSize: '15px', maxWidth: '240px' }}>
              {t('footer.description')}
            </p>
          </div>

          {/* Atención al cliente */}
          <div className="md:pl-8">
            <h3 className="font-semibold mb-6 uppercase tracking-wider whitespace-nowrap" style={{ fontSize: '14px' }}>
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-3 text-gray-300" style={{ fontSize: '15px' }}>
              <li className="leading-relaxed" style={{ maxWidth: '200px' }}>
                <a 
                  href="https://maps.google.com/?q=Carrer+Riu+Arno+17+Santa+Eulalia+del+Río+Illes+Balears"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Carrer Riu Arno, 17, Santa Eulalia del Río, Illes Balears
                </a>
              </li>
              <li className="font-semibold text-white text-base">
                <a href="tel:+34688860838" className="hover:opacity-80 transition-opacity">
                  +34 688 860 838
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/34688860838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('footer.whatsapp')}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/beltramehierro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('footer.instagram')}
                </a>
              </li>
              <li>
                <a href={getLocalizedPath('contact')} className="hover:text-white transition-colors">
                  {t('footer.writeMessage')}
                </a>
              </li>
            </ul>
          </div>

          {/* Sobre Beltrame */}
          <div className="md:pl-8">
            <h3 className="font-semibold mb-6 uppercase tracking-wider whitespace-nowrap" style={{ fontSize: '14px' }}>
              {t('footer.aboutBeltrame')}
            </h3>
            <ul className="space-y-3 text-gray-300" style={{ fontSize: '15px' }}>
              <li>
                <a href={getLocalizedPath('about')} className="hover:text-white transition-colors">
                  {t('footer.whoWeAre')}
                </a>
              </li>
              <li>
                <a href={getLocalizedPath('contact')} className="hover:text-white transition-colors">
                  {t('footer.howToContact')}
                </a>
              </li>
              <li>
                <a href={getLocalizedPath('sitemap')} className="hover:text-white transition-colors">
                  {t('footer.sitemap')}
                </a>
              </li>
            </ul>
          </div>

          {/* Proyectos */}
          <div className="md:justify-self-end">
            <h3 className="font-semibold mb-6 uppercase tracking-wider" style={{ fontSize: '14px' }}>
              {t('footer.projects')}
            </h3>
            <div className="flex flex-wrap gap-2" style={{ maxWidth: '480px' }}>
              {[
                { name: t('categories.barandillas.name'), slug: "barandillas" },
                { name: t('categories.barbacoas.name'), slug: "barbacoas" },
                { name: t('categories.carteles.name'), slug: "carteles" },
                { name: t('categories.cobre.name'), slug: "cobre" },
                { name: t('categories.corte-laser.name'), slug: "corte-laser" },
                { name: t('categories.cristaleras.name'), slug: "cristaleras" },
                { name: t('categories.espejos.name'), slug: "espejos" },
                { name: t('categories.fogoneros.name'), slug: "fogoneros" },
                { name: t('categories.laton.name'), slug: "laton" },
                { name: t('categories.mamparas.name'), slug: "mamparas" },
                { name: t('categories.muebles.name'), slug: "muebles" },
                { name: t('categories.pergolas.name'), slug: "pergolas" },
                { name: t('categories.puertas.name'), slug: "puertas" },
                { name: t('categories.tarimas.name'), slug: "tarimas" },
              ].map((proyecto) => (
                <a
                  key={proyecto.slug}
                  href={`/${i18n.language}/${t('routes.projects')}/${proyecto.slug}`}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black transition-colors border border-white/20"
                  style={{ fontSize: '13px' }}
                >
                  {proyecto.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-300/50 my-10"></div>

        {/* Footer inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <a href={getLocalizedPath('privacy')} className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </a>
            <span className="hidden md:inline">|</span>
            <a href={getLocalizedPath('terms')} className="hover:text-white transition-colors">
              {t('footer.terms')}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span>Acá estuvo</span>
            <a 
              href="https://segundacabeza.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/assets/icons/logo-blanco-segundacabeza.png"
                alt="Segunda Cabeza"
                className="h-8"
              />
            </a>
            <div className="flex gap-2 ml-2">
              <button 
                onClick={() => changeLanguage('es')}
                className="hover:opacity-80 transition-opacity"
                title="Español"
              >
                <img
                  src="https://flagcdn.com/w40/es.png"
                  alt="Español"
                  className="w-7 h-5 object-cover rounded shadow-sm"
                />
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className="hover:opacity-80 transition-opacity"
                title="English"
              >
                <img
                  src="https://flagcdn.com/w40/gb.png"
                  alt="English"
                  className="w-7 h-5 object-cover rounded shadow-sm"
                />
              </button>
              <button 
                onClick={() => changeLanguage('it')}
                className="hover:opacity-80 transition-opacity"
                title="Italiano"
              >
                <img
                  src="https://flagcdn.com/w40/it.png"
                  alt="Italiano"
                  className="w-7 h-5 object-cover rounded shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
