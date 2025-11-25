import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { i18n, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile: Hamburger + Logo on Left */}
          <div className="flex items-center gap-4 md:gap-0">
            {/* Mobile Menu Button - Left */}
            <button 
              className="md:hidden text-gray-900 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src="/assets/icons/Logo Beltrame Negro.png"
                alt="Beltrame"
                className="h-10 md:h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </a>
          </div>

          {/* Navigation - Centrado */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="/"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium relative group"
              style={{ fontSize: '15px' }}
            >
              {t('header.home')}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/proyectos"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium relative group"
              style={{ fontSize: '15px' }}
            >
              {t('header.projects')}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/quienes-somos"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium relative group"
              style={{ fontSize: '15px' }}
            >
              {t('header.about')}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/contacto"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium relative group"
              style={{ fontSize: '15px' }}
            >
              {t('header.contact')}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Language & CTA */}
          <div className="flex items-center gap-6 md:ml-auto">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => changeLanguage('es')}
                className={`transition-all ${i18n.language === 'es' ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
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
                className={`transition-all ${i18n.language === 'en' ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
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
                className={`transition-all ${i18n.language === 'it' ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
                title="Italiano"
              >
                <img
                  src="https://flagcdn.com/w40/it.png"
                  alt="Italiano"
                  className="w-7 h-5 object-cover rounded shadow-sm"
                />
              </button>
            </div>

            {/* CTA Button */}
            <a
              href="/contacto"
              className="bg-black text-white px-6 py-2.5 rounded-md hover:bg-white hover:text-black hover:ring-2 hover:ring-black transition-all font-medium"
              style={{ fontSize: '15px' }}
            >
              {t('header.quote')}
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4 pt-4">
              <a
                href="/"
                className="text-gray-900 hover:bg-black hover:text-white transition-all font-medium py-2 px-4 rounded"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.home')}
              </a>
              <a
                href="/proyectos"
                className="text-gray-900 hover:bg-black hover:text-white transition-all font-medium py-2 px-4 rounded"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.projects')}
              </a>
              <a
                href="/quienes-somos"
                className="text-gray-900 hover:bg-black hover:text-white transition-all font-medium py-2 px-4 rounded"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.about')}
              </a>
              <a
                href="/contacto"
                className="text-gray-900 hover:bg-black hover:text-white transition-all font-medium py-2 px-4 rounded"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.contact')}
              </a>
              
              {/* Language Switcher Mobile */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => changeLanguage('es')}
                  className={`transition-all ${i18n.language === 'es' ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
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
                  className={`transition-all ${i18n.language === 'en' ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
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
                  className={`transition-all ${i18n.language === 'it' ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
                  title="Italiano"
                >
                  <img
                    src="https://flagcdn.com/w40/it.png"
                    alt="Italiano"
                    className="w-7 h-5 object-cover rounded shadow-sm"
                  />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
