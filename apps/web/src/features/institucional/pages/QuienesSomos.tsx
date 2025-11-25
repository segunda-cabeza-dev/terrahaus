import { useTranslation } from 'react-i18next';

export default function QuienesSomos() {
  const { t } = useTranslation();
  
  return (
    <div className="quienes-somos-page">
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-medium tracking-wider uppercase mb-4 text-black" style={{ fontSize: '16px' }}>
            {t('about.subtitle')}
          </p>
          <h1 className="font-bold mb-8 text-[30px] md:text-[45px]" style={{ lineHeight: '1.1' }}>
            {t('about.title').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
        </div>
      </section>

      {/* Content Section - Texto e Imagen lado a lado */}
      <section className="pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Columna de texto - TODO JUNTO */}
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="font-semibold text-xl">
                {t('about.p1')}
              </p>
              
              <p>
                {t('about.p2')}
              </p>
              
              <p>
                {t('about.p3')}
              </p>
              
              <p>
                {t('about.p4')}
              </p>
              
              <p>
                {t('about.p5')}
              </p>
              
              <p className="font-semibold">
                {t('about.p6')}
              </p>
              
              <p>
                {t('about.p7')}
              </p>
            </div>

            {/* Columna de imagen */}
            <div className="sticky top-8">
              <img 
                src="/assets/images/Quienes somos/Quienes-somos1.jpg" 
                alt="Beltrame - Herrería y diseño"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
