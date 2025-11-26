import { useTranslation } from 'react-i18next';

export default function CallToAction() {
  const { t, i18n } = useTranslation();
  
  const getLocalizedPath = (route: string) => {
    const translations: Record<string, Record<string, string>> = {
      'es': { 'contact': 'contacto' },
      'en': { 'contact': 'contact' },
      'it': { 'contact': 'contatto' }
    };
    const translatedRoute = translations[i18n.language]?.[route] || translations['es'][route];
    return `/${i18n.language}/${translatedRoute}`;
  };
  
  return (
    <section className="relative py-20 px-6 bg-gray-200 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-bold mb-6 text-black" style={{ fontSize: '35px', lineHeight: '1.1' }}>
            {t('cta.title')}
          </h2>
          <p className="text-black mb-4" style={{ fontSize: '17px' }}>
            {t('cta.description1')}
          </p>
          <p className="text-black mb-8" style={{ fontSize: '17px' }}>
            {t('cta.description2')}
          </p>
          <a
            href={getLocalizedPath('contact')}
            className="inline-block bg-black text-white px-10 py-4 rounded-md hover:bg-white hover:text-black hover:ring-2 hover:ring-black transition-all font-medium"
            style={{ fontSize: '16px' }}
          >
            {t('cta.button')}
          </a>
        </div>
      </div>
    </section>
  );
}
