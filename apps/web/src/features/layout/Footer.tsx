import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <footer className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_280px_200px_auto] gap-8 lg:gap-16 mb-12">
          {/* Logo y descripción */}
          <div className="flex flex-col gap-6 items-start">
            <a href="/">
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
                <a href="/contacto" className="hover:text-white transition-colors">
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
                <a href="/quienes-somos" className="hover:text-white transition-colors">
                  {t('footer.whoWeAre')}
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:text-white transition-colors">
                  {t('footer.howToContact')}
                </a>
              </li>
              <li>
                <a href="/mapa-sitio" className="hover:text-white transition-colors">
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
                { name: t('categories.tarimas.name'), slug: "tarimas" },
                { name: t('categories.cristaleras.name'), slug: "cristaleras" },
                { name: t('categories.espejos.name'), slug: "espejos" },
                { name: t('categories.fogoneros.name'), slug: "fogoneros" },
                { name: t('categories.laton.name'), slug: "laton" },
                { name: t('categories.mamparas.name'), slug: "mamparas" },
                { name: t('categories.muebles.name'), slug: "muebles" },
                { name: t('categories.pergolas.name'), slug: "pergolas" },
                { name: t('categories.puertas.name'), slug: "puertas" },
              ].map((proyecto) => (
                <a
                  key={proyecto.slug}
                  href={`/proyectos/${proyecto.slug}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white hover:text-black transition-colors whitespace-nowrap"
                  style={{ fontSize: '12px', borderRadius: '4px' }}
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
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacidad" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </a>
            <span>|</span>
            <a href="/terminos-condiciones" className="hover:text-white transition-colors">
              {t('footer.terms')}
            </a>
            <span>|</span>
            <div className="flex gap-2">
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
