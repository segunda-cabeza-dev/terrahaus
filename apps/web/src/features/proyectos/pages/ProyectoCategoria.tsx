import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { projectsService, type ProjectItem } from '@beltrame/shared';
import { setCategoryProjectsCache } from './ProyectoDetalle';

// Cache local para evitar spinner en navegación
const localCache: Map<string, { projects: ProjectItem[]; categoryName: string }> = new Map();

export default function ProyectoCategoria() {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'es';
  const cacheKey = `${categoria}_${lang}`;

  // Inicializar con cache si existe
  const cached = localCache.get(cacheKey);
  const [projects, setProjects] = useState<ProjectItem[]>(cached?.projects || []);
  const [categoryName, setCategoryName] = useState(cached?.categoryName || '');
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    const loadProjects = async () => {
      if (!categoria) return;
      // Solo mostrar loading si no hay datos cacheados
      if (projects.length === 0) {
        setLoading(true);
      }
      try {
        const data = await projectsService.getProjectsByCategory(categoria, lang);
        setProjects(data);
        
        let catName = '';
        if (data.length > 0) {
          catName = data[0].category_name;
        } else {
          // Si no hay proyectos, obtener nombre de categoría de otra forma
          const categories = await projectsService.getCategories(lang);
          const cat = categories.find(c => c.slug === categoria);
          catName = cat?.name || categoria;
        }
        setCategoryName(catName);
        
        // Guardar en cache local
        localCache.set(cacheKey, { projects: data, categoryName: catName });
        // También llenar el cache compartido con ProyectoDetalle
        if (categoria) {
          setCategoryProjectsCache(categoria, lang, data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [categoria, lang, cacheKey]);

  if (loading) {
    return (
      <div className="proyecto-categoria-page">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 0' }}>
            <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: '#999' }} />
            <span style={{ marginLeft: 8, color: '#666' }}>Cargando proyectos...</span>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="proyecto-categoria-page">
      <div className="header-section">
        <div className="container">
          <div className="back-breadcrumb-wrapper">
            <button onClick={() => navigate('/proyectos')} className="back-btn">
              <ChevronLeft size={20} />
            </button>
            
            <div className="breadcrumb-content">
              <button onClick={() => navigate('/')} className="breadcrumb-link">{t('header.home')}</button>
              <span className="separator">›</span>
              <button onClick={() => navigate('/proyectos')} className="breadcrumb-link">{t('projects.breadcrumbTitle')}</button>
              <span className="separator">›</span>
              <span className="current">{categoryName}</span>
            </div>
          </div>
          <h1 className="title">{categoryName}</h1>
        </div>
      </div>

      <div className="projects-section">
        <div className="container">
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
              No hay proyectos en esta categoría
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => navigate('/proyectos/' + categoria + '/' + project.slug)}
                >
                  <div className="project-image">
                    <img 
                      src={project.image_urls[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'} 
                      alt={project.name} 
                    />
                    <div className="project-overlay">
                      <button className="view-button">{t('projects.viewProject')}</button>
                    </div>
                  </div>
                  <h3 className="project-name">{project.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.proyecto-categoria-page { min-height: 100vh; background: white; padding-top: 0; padding-bottom: 80px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.back-breadcrumb-wrapper { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.back-btn { width: 48px; height: 48px; border-radius: 50%; background: white; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.back-btn:hover { background: #000; color: white; border-color: #000; }
.breadcrumb-content { display: flex; align-items: center; gap: 8px; font-size: 14px; flex-wrap: wrap; }
.breadcrumb-link { background: none; border: none; color: #000; cursor: pointer; font-weight: 500; transition: opacity 0.2s; padding: 0; font-size: 14px; }
.breadcrumb-link:hover { opacity: 0.6; }
.separator { color: #9ca3af; font-weight: 400; }
.current { color: #9ca3af; font-weight: 400; }
.header-section { padding: 12px 0 16px; background: white; padding-top: 70px; }
.title { font-size: 40px; font-weight: 700; color: #000; line-height: 1.2; text-align: left; }
.projects-section { padding: 0 0 40px; background: white; }
.projects-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.project-card { cursor: pointer; }
.project-image { width: 100%; aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; margin-bottom: 16px; position: relative; background: #f0f0f0; }
.project-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.project-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.project-card:hover .project-overlay { opacity: 1; }
.project-card:hover .project-image img { transform: scale(1.05); }
.view-button { background: white; color: black; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
.view-button:hover { transform: scale(1.05); }
.project-name { font-size: 15px; font-weight: 500; color: #000; text-align: center; }
@media (max-width: 968px) { .projects-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } .title { font-size: 32px; } }
@media (max-width: 640px) { .projects-grid { grid-template-columns: 1fr; } .title { font-size: 28px; } }
`;
