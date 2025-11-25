import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translateProjectName } from '@/shared/lib/projectTranslations';

const sitemap = [
  {
    category: 'Barandillas',
    slug: 'barandillas',
    projects: [
      'Pasamanos',
      'Barandilla en escalera',
      'Barandilla en terraza',
      'Barandilla Orgánica',
      'Barandilla en terraza',
      'Barandilla en escalera de madera',
      'Barandilla en escalera de pierdas',
      'Barandilla de interior',
      'Barandilla en escalera',
      'Barandilla en terraza',
      'Barandilla en escalera',
      'Barandilla',
    ]
  },
  {
    category: 'Barbacoas',
    slug: 'barbacoas',
    projects: [
      'Barbacoa',
      'Barbacoa Rustica',
      'Barbacoa con hierro negro',
      'Barbacoa BBBQ',
      'Barbacoa de acero inoxidable con campana',
      'Barbacoa con mueble incorporado',
      'Barbacoa empotrada',
    ]
  },
  {
    category: 'Carteles',
    slug: 'carteles',
    projects: [
      'Cartel Villa Cupina',
      'Cartel Villa Clara',
      'Cartel Solivera',
      'Cartel Sir Fausto',
      'Cartel San Pedro',
      'Cartel Morena',
      'Cartel Love',
      'Cartel La Tiendita',
      'Cartel Ibiza Campo',
      'Cartel Ferre construcciones',
      'Cartel Es bistro',
      'Cartel El Chiquitin',
      'Cas Furmente',
      'Carteles Minimal',
      'Can Vich de Dalt',
      'Can Lobo',
      'Cartel Can Cuine',
      'Cartel Can California',
      'Cartel Bloom studio',
      'Cartel Berlina',
      'Cartel 2k20',
    ]
  },
  {
    category: 'Cobre',
    slug: 'cobre',
    projects: [
      'Puerta',
      'Puerta',
      'Soporte para elementos de cocina',
      'Repisa en Cobre',
    ]
  },
  {
    category: 'Corte láser',
    slug: 'corte-laser',
    projects: [
      'Mascara para frente local',
      'Simbolo Corte Laser',
      'Piso en Corte Laser',
      'Pieza Corte Laser',
      'Elementos en Corte Laser',
      'Corte Laser',
      'Cartel Corte Laser',
    ]
  },
  {
    category: 'Cristaleras y Cerramientos',
    slug: 'cristaleras',
    projects: [
      'Cristaleras y Cerramientos',
      'Cristalera y Cerramiento',
      'Cristalera y Cerramiento',
      'Cristaleras y Cerramientos',
      'Cristalera y Cerramiento',
      'Cristalera y Cerramiento',
      'Cristalera y Cerramiento',
      'Ventana',
      'Cristalera divisoria',
      'Cristalera repartida',
      'Cristalera y Cerramiento hierro negro',
      'Cristalera Medio punto',
      'Cerramiento',
    ]
  },
  {
    category: 'Escaleras',
    slug: 'escaleras',
    projects: []
  },
  {
    category: 'Espejos',
    slug: 'espejos',
    projects: [
      'Espejo de baño',
      'Espejos gemelos',
      'Espejo Baño',
      'Espejo horizontal',
      'Espejo baño horizontal',
      'Espejo baño horizontal',
      'Espejo baño vertical',
      'Espejo Circular',
      'Espejo Vertical',
    ]
  },
  {
    category: 'Fogoneros',
    slug: 'fogoneros',
    projects: [
      'Fogonero Circular de hojas',
      'Fogonero Circular Can California',
      'Fogonero Circular PC',
    ]
  },
  {
    category: 'Latón',
    slug: 'laton',
    projects: [
      'Riel de latón',
      'Pérgola de Latón',
      'Pared de Latón',
      'Mueble Latón',
      'Mesa Latón',
      'Mampara de Latón',
      'Espejo Latón',
      'Barra de Latón',
      'Barra de Latón',
      'Árbol de Latón',
    ]
  },
  {
    category: 'Mamparas',
    slug: 'mamparas',
    projects: [
      'Mampara baño',
      'Mampara baño',
      'Mampara baño',
      'Mampara baño',
    ]
  },
  {
    category: 'Muebles',
    slug: 'muebles',
    projects: [
      'Silla de Hierro Minimalista',
      'Muebles de baño',
      'Mueble de hierro y madera',
      'Mueble de hierro y madera',
      'Mueble con cerraduras y estantes',
      'Mueble con cerraduras y estantes',
      'Mostrador de hierro',
      'Mueble esquinero hierro y madera',
      'Mostrador de hierro',
      'Mostrador de hierro',
      'Mostrador de hierro',
      'Mostrador de hierro',
      'Mesitas de noche',
      'Mesa de trabajo',
      'Mesa de hierro con madera',
      'Mesa de hierro',
      'Mesa circular exterior',
      'Lampara Moderna de Hierro',
      'Estructura hierro',
      'Estructura hierro',
      'Barra de Cocina',
    ]
  },
  {
    category: 'Pérgolas',
    slug: 'pergolas',
    projects: [
      'Pérgola',
      'Pérgola',
      'Pérgola',
      'Pérgola',
      'Pérgola',
      'Pérgola con madera',
      'Pérgola',
      'Pérgola',
      'Pérgola',
      'Pérgola',
      'Pérgola',
    ]
  },
  {
    category: 'Puertas',
    slug: 'puertas',
    projects: [
      'Puerta',
      'Puerta',
    ]
  },
  {
    category: 'Tarimas',
    slug: 'tarimas',
    projects: [
      'Tarima Rectangular',
      'Tarima Circular',
    ]
  },
];

export default function MapaSitio() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mapa-sitio-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('common.home')}
          </button>
          <span className="separator">›</span>
          <span className="current">{t('common.sitemap')}</span>
        </div>
      </div>

      {/* Header */}
      <div className="header-section">
        <div className="container">
          <h1 className="title">{t('common.projectsByCategory')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        <div className="container">
          {sitemap.map((section, index) => (
            <div key={index} className="category-section">
              <h2 
                className="category-title"
                onClick={() => navigate(`/proyectos/${section.slug}`)}
              >
                {t(`categories.${section.slug}.name`)}
              </h2>
              
              {section.projects.length > 0 ? (
                <div className="projects-list">
                  {section.projects.map((project, projectIndex) => (
                    <div 
                      key={projectIndex} 
                      className="project-item"
                      onClick={() => navigate(`/proyectos/${section.slug}`)}
                    >
                      {translateProjectName(project)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-category">Sin proyectos disponibles</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .mapa-sitio-page {
          min-height: 100vh;
          background: white;
          padding-top: 0;
          padding-bottom: 80px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Breadcrumb */
        .breadcrumb {
          background: white;
          padding: 16px 0;
          padding-top: 96px;
          border-bottom: 1px solid #e5e7eb;
        }

        .breadcrumb .container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          color: #000;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
          padding: 0;
          font-size: 14px;
        }

        .breadcrumb-link:hover {
          opacity: 0.6;
        }

        .separator {
          color: #9ca3af;
          font-weight: 400;
        }

        .current {
          color: #9ca3af;
          font-weight: 400;
        }

        /* Header */
        .header-section {
          padding: 30px 0 30px;
          background: white;
        }

        .title {
          font-size: 36px;
          font-weight: 700;
          color: #000;
          line-height: 1.2;
          margin: 0;
        }

        /* Content */
        .content-section {
          padding: 40px 0;
          background: white;
        }

        .category-section {
          margin-bottom: 40px;
        }

        .category-section:last-child {
          margin-bottom: 0;
        }

        .category-title {
          font-size: 24px;
          font-weight: 700;
          color: #000;
          margin-bottom: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .category-title:hover {
          opacity: 0.7;
        }

        .projects-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px 24px;
        }

        .project-item {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.5;
          transition: color 0.2s;
          cursor: pointer;
        }

        .project-item:hover {
          color: #000;
        }

        .empty-category {
          font-size: 15px;
          color: #9ca3af;
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .title {
            font-size: 36px;
          }

          .category-title {
            font-size: 28px;
          }

          .projects-list {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 32px;
          }

          .category-title {
            font-size: 24px;
          }

          .projects-list {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 20px;
          }

          .header-section {
            padding: 40px 0 30px;
          }

          .content-section {
            padding: 40px 0;
          }

          .category-section {
            margin-bottom: 50px;
          }
        }

        @media (max-width: 640px) {
          .container {
            padding: 0 24px;
          }

          .title {
            font-size: 28px;
          }

          .category-title {
            font-size: 22px;
          }

          .projects-list {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
