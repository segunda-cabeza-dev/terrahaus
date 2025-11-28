import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService, type ProjectItem } from '@beltrame/shared';

export default function Inicio() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const lang = i18n.language || 'es';
  
  const getLocalizedPath = (route: string) => {
    const translations: Record<string, Record<string, string>> = {
      'es': { 'projects': 'proyectos', 'contact': 'contacto' },
      'en': { 'projects': 'projects', 'contact': 'contact' },
      'it': { 'projects': 'progetti', 'contact': 'contatto' }
    };
    const translatedRoute = translations[i18n.language]?.[route] || translations['es'][route];
    return `/${i18n.language}/${translatedRoute}`;
  };

  const getProjectDetailPath = (categorySlug: string, projectSlug: string) => {
    const projectsPath: Record<string, string> = {
      'es': 'proyectos',
      'en': 'projects',
      'it': 'progetti'
    };
    const basePath = projectsPath[i18n.language] || 'proyectos';
    return `/${i18n.language}/${basePath}/${categorySlug}/${projectSlug}`;
  };

  useEffect(() => {
    const loadRecentProjects = async () => {
      setLoadingProjects(true);
      try {
        const projects = await projectsService.getRecentProjects(lang, 6);
        setRecentProjects(projects);
      } catch (error) {
        console.error('Error loading recent projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };
    loadRecentProjects();
  }, [lang]);
  
  return (
    <div className="inicio-page">
      {/* ATF Hero Section */}
      <section className="pt-16 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtítulo */}
          <p className="font-medium tracking-wider uppercase mb-4 text-black" style={{ fontSize: '16px' }}>
            {t('inicio.subtitle')}
          </p>

          {/* Título principal */}
          <h1 className="font-bold mb-8 text-[35px] md:text-[50px]" style={{ lineHeight: '1.1' }}>
            {t('inicio.title')}
          </h1>

          {/* CTA Button */}
          <a
            href={getLocalizedPath('projects')}
            className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-white hover:text-black hover:ring-2 hover:ring-black transition-all font-medium"
          >
            {t('inicio.cta')}
          </a>
        </div>
      </section>

      {/* Marquee Section - Fila 1 */}
      <div className="bg-white py-4">
        <div className="w-full overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap will-change-transform">
            {/* Primera serie de imágenes - orden estético */}
            {[1, 5, 9, 3, 7, 2, 10, 4, 8, 6, 1, 5, 9, 3, 7, 2, 10, 4, 8, 6].map((num, index) => (
              <div
                key={`img1-${index}`}
                className="inline-block mx-2 h-32 w-56 flex-shrink-0"
              >
                <img
                  src={`/assets/images/Marquee/${num}.jpg`}
                  alt={`Proyecto ${num}`}
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Section - Fila 2 (dirección inversa) */}
      <div className="bg-white pb-12">
        <div className="w-full overflow-hidden">
          <div className="flex animate-marquee-reverse whitespace-nowrap will-change-transform">
            {/* Segunda serie de imágenes - orden estético */}
            {[11, 15, 19, 13, 17, 12, 20, 14, 18, 16, 11, 15, 19, 13, 17, 12, 20, 14, 18, 16].map((num, index) => (
              <div
                key={`img2-${index}`}
                className="inline-block mx-2 h-32 w-56 flex-shrink-0"
              >
                <img
                  src={`/assets/images/Marquee/${num}.jpg`}
                  alt={`Proyecto ${num}`}
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Nuestros Servicios */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Título alternativo */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gray-200 text-black font-medium tracking-wider uppercase rounded-full mb-3" style={{ fontSize: '12px' }}>
              {t('inicio.services.badge')}
            </span>
            <h2 className="font-bold text-black text-[28px] md:text-[38px]" style={{ lineHeight: '1.1' }}>
              {t('inicio.services.title')}
            </h2>
          </div>

          {/* Grid alternativo con cards elevadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden h-64">
                <img
                  src="/assets/images/Servicios/Piezasunicas.jpg"
                  alt={t('inicio.services.unique.title')}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="w-10 h-1 bg-black mb-3"></div>
                <h3 className="font-bold mb-3 text-black" style={{ fontSize: '20px' }}>{t('inicio.services.unique.title')}</h3>
                <p className="text-black leading-relaxed mb-4" style={{ fontSize: '17px' }}>
                  {t('inicio.services.unique.description')}
                </p>
                <a href={getLocalizedPath('projects')} className="text-black font-semibold hover:underline inline-flex items-center gap-2" style={{ fontSize: '15px' }}>
                  {t('inicio.services.unique.cta')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden h-64">
                <img
                  src="/assets/images/Servicios/CorteLaser.jpg"
                  alt={t('inicio.services.laser.title')}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="w-10 h-1 bg-black mb-3"></div>
                <h3 className="font-bold mb-3 text-black" style={{ fontSize: '20px' }}>{t('inicio.services.laser.title')}</h3>
                <p className="text-black leading-relaxed mb-4" style={{ fontSize: '17px' }}>
                  {t('inicio.services.laser.description')}
                </p>
                <a href={getLocalizedPath('projects')} className="text-black font-semibold hover:underline inline-flex items-center gap-2" style={{ fontSize: '15px' }}>
                  {t('inicio.services.laser.cta')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden h-64">
                <img
                  src="/assets/images/Servicios/Asesoramientopersonalizado.jpg"
                  alt={t('inicio.services.advisory.title')}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="w-10 h-1 bg-black mb-3"></div>
                <h3 className="font-bold mb-3 text-black" style={{ fontSize: '20px' }}>{t('inicio.services.advisory.title')}</h3>
                <p className="text-black leading-relaxed mb-4" style={{ fontSize: '17px' }}>
                  {t('inicio.services.advisory.description')}
                </p>
                <a href={getLocalizedPath('contact')} className="text-black font-semibold hover:underline inline-flex items-center gap-2" style={{ fontSize: '15px' }}>
                  {t('inicio.services.advisory.cta')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Materiales - Con fondo contenido */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Contenedor con fondo oscuro */}
          <div className="bg-black p-12 md:p-16 relative overflow-hidden" style={{
            borderRadius: '50px 10px 50px 10px'
          }}>
            {/* Patrón decorativo de fondo */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Lado izquierdo - Texto */}
                <div>
                  <span className="inline-block px-4 py-2 bg-white text-black font-medium tracking-wider uppercase rounded-full mb-4" style={{ fontSize: '12px' }}>
                    {t('inicio.materials.badge')}
                  </span>
                  <h2 className="font-bold mb-4 text-white text-[28px] md:text-[38px]" style={{ lineHeight: '1.1' }}>
                    {t('inicio.materials.title')}
                  </h2>
                  <p className="text-gray-300" style={{ fontSize: '17px' }}>
                    {t('inicio.materials.description')}
                  </p>
                </div>

                {/* Lado derecho - Grid de materiales */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Latón */}
                  <div className="group cursor-pointer">
                    <div className="h-32 rounded-lg overflow-hidden mb-3 shadow-lg transition-all">
                      <img 
                        src="/assets/images/materiales/Latón.jpg" 
                        alt={t('inicio.materials.brass')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-center font-medium">{t('inicio.materials.brass')}</p>
                  </div>

                  {/* Galvanizado */}
                  <div className="group cursor-pointer">
                    <div className="h-32 rounded-lg overflow-hidden mb-3 shadow-lg transition-all">
                      <img 
                        src="/assets/images/materiales/Galvanizado.jpg" 
                        alt={t('inicio.materials.galvanized')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-center font-medium">{t('inicio.materials.galvanized')}</p>
                  </div>

                  {/* Acero Inoxidable */}
                  <div className="group cursor-pointer">
                    <div className="h-32 rounded-lg overflow-hidden mb-3 shadow-lg transition-all">
                      <img 
                        src="/assets/images/materiales/Acero Inoxidable.jpg" 
                        alt={t('inicio.materials.stainless')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-center font-medium">{t('inicio.materials.stainless')}</p>
                  </div>

                  {/* Corten */}
                  <div className="group cursor-pointer">
                    <div className="h-32 rounded-lg overflow-hidden mb-3 shadow-lg transition-all">
                      <img 
                        src="/assets/images/materiales/Corten.jpg" 
                        alt={t('inicio.materials.corten')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-center font-medium">{t('inicio.materials.corten')}</p>
                  </div>

                  {/* Hierro Negro */}
                  <div className="group cursor-pointer">
                    <div className="h-32 rounded-lg overflow-hidden mb-3 shadow-lg transition-all">
                      <img 
                        src="/assets/images/materiales/Hierro Negro.jpg" 
                        alt={t('inicio.materials.black')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-center font-medium">{t('inicio.materials.black')}</p>
                  </div>

                  {/* Cobre */}
                  <div className="group cursor-pointer">
                    <div className="h-32 rounded-lg overflow-hidden mb-3 shadow-lg transition-all">
                      <img 
                        src="/assets/images/materiales/Cobre.jpg" 
                        alt={t('inicio.materials.copper')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-center font-medium">{t('inicio.materials.copper')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Proyectos - VERSIÓN 1: Moderna con efectos */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gray-200 text-black font-medium tracking-wider uppercase rounded-full mb-3" style={{ fontSize: '12px' }}>
              {t('inicio.recentProjects.badge')}
            </span>
            <h2 className="font-bold text-black text-[28px] md:text-[38px]" style={{ lineHeight: '1.1' }}>
              {t('inicio.recentProjects.title')}
            </h2>
          </div>

          {/* Grid de proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {loadingProjects ? (
              // Skeleton loader mientras carga
              [...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 rounded-lg mb-4 h-72"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
              ))
            ) : recentProjects.length > 0 ? (
              // Proyectos reales de la base de datos
              recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group cursor-pointer"
                  onClick={() => navigate(getProjectDetailPath(project.category_slug, project.slug))}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4 h-72 shadow-lg">
                    <img
                      src={project.image_urls?.[0] || 'https://picsum.photos/600/800?random=1'}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                  <h3 className="text-center font-semibold text-black" style={{ fontSize: '16px' }}>
                    {project.name}
                  </h3>
                </div>
              ))
            ) : (
              // Mensaje si no hay proyectos
              <div className="col-span-3 text-center py-12 text-gray-500">
                {t('inicio.recentProjects.noProjects', 'No hay proyectos disponibles')}
              </div>
            )}
          </div>

          {/* Botón Ver todos */}
          <div className="text-center">
            <a
              href={getLocalizedPath('projects')}
              className="inline-block bg-black text-white px-10 py-3 rounded-md hover:bg-white hover:text-black hover:ring-2 hover:ring-black transition-all font-medium"
              style={{ fontSize: '15px' }}
            >
              {t('inicio.recentProjects.viewAll')}
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes float-services {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        @keyframes float-services-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(45deg);
          }
          50% {
            transform: translateY(30px) translateX(-20px) rotate(45deg);
          }
        }

        @keyframes float-services-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(-25px);
          }
        }

        @keyframes float-services-fast {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-35px) translateX(25px);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }

        @media (min-width: 768px) {
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }

          .animate-marquee-reverse {
            animation: marquee-reverse 40s linear infinite;
          }
        }

        .animate-float-services {
          animation: float-services 7s ease-in-out infinite;
        }

        .animate-float-services-delayed {
          animation: float-services-delayed 9s ease-in-out infinite;
        }

        .animate-float-services-slow {
          animation: float-services-slow 11s ease-in-out infinite;
        }

        .animate-float-services-fast {
          animation: float-services-fast 6s ease-in-out infinite;
        }

        @keyframes line-slide {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes line-slide-delayed {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes line-slide-slow {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }

        @keyframes pulse-subtle-delayed {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }

        .animate-line-slide {
          animation: line-slide 15s ease-in-out infinite;
        }

        .animate-line-slide-delayed {
          animation: line-slide-delayed 18s ease-in-out infinite 3s;
        }

        .animate-line-slide-slow {
          animation: line-slide-slow 20s ease-in-out infinite 6s;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }

        .animate-pulse-subtle-delayed {
          animation: pulse-subtle-delayed 5s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
}
