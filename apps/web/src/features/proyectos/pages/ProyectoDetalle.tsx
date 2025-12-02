import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ZoomIn, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projectsService, type ProjectItem } from '@beltrame/shared';

// Cache compartido - se llena cuando el usuario visita la categoría o el detalle
const categoryProjectsCache: Map<string, ProjectItem[]> = new Map();

// Función para buscar proyecto en el cache de categoría
const findProjectInCache = (slug: string, categoria: string, lang: string): ProjectItem | null => {
  const cacheKey = `${categoria}_${lang}`;
  const projects = categoryProjectsCache.get(cacheKey);
  if (projects) {
    return projects.find(p => p.slug === slug) || null;
  }
  return null;
};

export default function ProyectoDetalle() {
  const { t, i18n } = useTranslation();
  const { categoria, id } = useParams<{ categoria: string; id: string }>();
  const navigate = useNavigate();
  const lang = i18n.language || 'es';
  const categoryCacheKey = `${categoria}_${lang}`;

  // Buscar proyecto en cache inmediatamente (síncrono)
  const cachedProject = useMemo(() => {
    if (!id || !categoria) return null;
    return findProjectInCache(id, categoria, lang);
  }, [id, categoria, lang]);

  // Obtener proyectos relacionados del cache
  const cachedRelated = useMemo(() => {
    if (!categoria || !id) return [];
    const projects = categoryProjectsCache.get(categoryCacheKey);
    if (projects) {
      return projects.filter(p => p.slug !== id).slice(0, 4);
    }
    return [];
  }, [categoria, id, categoryCacheKey]);

  const [project, setProject] = useState<ProjectItem | null>(cachedProject);
  const [relatedProjects, setRelatedProjects] = useState<ProjectItem[]>(cachedRelated);
  const [loading, setLoading] = useState(!cachedProject);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Cuando cambia el id, actualizar inmediatamente desde cache si existe
  useEffect(() => {
    if (!id || !categoria) return;
    
    const cached = findProjectInCache(id, categoria, lang);
    if (cached) {
      setProject(cached);
      setLoading(false);
      const projects = categoryProjectsCache.get(categoryCacheKey);
      if (projects) {
        setRelatedProjects(projects.filter(p => p.slug !== id).slice(0, 4));
      }
    } else {
      setLoading(true);
    }
    setSelectedImage(0);
  }, [id, categoria, lang, categoryCacheKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, categoria]);

  // Cargar datos si no están en cache
  useEffect(() => {
    const loadData = async () => {
      if (!id || !categoria) return;
      
      // Si ya tenemos el proyecto en cache, no hacer fetch
      const cached = findProjectInCache(id, categoria, lang);
      if (cached && project?.slug === id) {
        setLoading(false);
        return;
      }

      try {
        // Cargar los proyectos de la categoría (incluye todos los datos del proyecto)
        const allProjects = await projectsService.getProjectsByCategory(categoria, lang);
        
        // Guardar en cache
        categoryProjectsCache.set(categoryCacheKey, allProjects);
        
        // Buscar el proyecto actual
        const foundProject = allProjects.find(p => p.slug === id);
        
        if (foundProject) {
          setProject(foundProject);
          setRelatedProjects(allProjects.filter(p => p.slug !== id).slice(0, 4));
        } else {
          // Si no está en la categoría, intentar cargarlo directamente
          const proj = await projectsService.getProject(id, lang);
          if (proj) {
            setProject(proj);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, categoria, lang, categoryCacheKey, project?.slug]);

  if (loading) {
    return (
      <div className="proyecto-detalle-page">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 0' }}>
            <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: '#999' }} />
            <span style={{ marginLeft: 8, color: '#666' }}>Cargando proyecto...</span>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="not-found">
        <div className="container">
          <h1>{t('projects.notFound')}</h1>
          <button onClick={() => navigate('/proyectos')} className="back-button">
            {t('projects.backToProjects')}
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  const images = project.image_urls.length > 0 
    ? project.image_urls 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'];

  return (
    <div className="proyecto-detalle-page">
      <div className="main-content">
        <div className="container">
          <div className="back-breadcrumb-wrapper">
            <button onClick={() => navigate('/proyectos/' + categoria)} className="back-btn">
              <ChevronLeft size={18} />
            </button>
            
            <div className="breadcrumb-content">
              <button onClick={() => navigate('/')} className="breadcrumb-link">{t('header.home')}</button>
              <span className="separator">›</span>
              <button onClick={() => navigate('/proyectos')} className="breadcrumb-link">{t('projects.breadcrumbTitle')}</button>
              <span className="separator">›</span>
              <button onClick={() => navigate('/proyectos/' + categoria)} className="breadcrumb-link">{project.category_name}</button>
              <span className="separator">›</span>
              <span className="current">{project.name}</span>
            </div>
          </div>
          
          <div className="content-grid">
            <div className="info-column">
              
              <h1 className="project-title">{project.name}</h1>
              {project.description && <p className="project-description">{project.description}</p>}
            </div>

            <div className="images-column">
              <div className="image-grid">
                {images.slice(0, 4).map((img, index) => (
                  <div 
                    key={index}
                    className="grid-image-container"
                    onClick={() => { setSelectedImage(index); setIsZoomed(true); }}
                  >
                    <img src={img} alt={project.name + ' ' + (index + 1)} />
                    <div className="image-overlay"><ZoomIn size={24} color="white" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="related-projects-section">
          <div className="container">
            <h2 className="related-title">{t('projects.otherPieces')}</h2>
            <div className="related-grid">
              {relatedProjects.map((rel) => (
                <div key={rel.id} className="related-card" onClick={() => navigate('/proyectos/' + categoria + '/' + rel.slug)}>
                  <div className="related-image">
                    <img src={rel.image_urls[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'} alt={rel.name} />
                  </div>
                  <h3 className="related-name">{rel.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isZoomed && (
        <div className="zoom-modal" onClick={() => setIsZoomed(false)}>
          <div className="zoom-modal-content">
            <img src={images[selectedImage]} alt={project.name} />
            <button className="close-zoom" onClick={() => setIsZoomed(false)}>✕</button>
          </div>
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
}

// Exportar la función para llenar el cache desde ProyectoCategoria
export const setCategoryProjectsCache = (categoria: string, lang: string, projects: ProjectItem[]) => {
  categoryProjectsCache.set(`${categoria}_${lang}`, projects);
};

const styles = `
.proyecto-detalle-page { min-height: 100vh; background: white; padding-top: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.main-content { padding: 40px 0 60px; background: white; padding-top: 70px; }
.back-breadcrumb-wrapper { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.back-btn { width: 40px; height: 40px; border-radius: 50%; background: white; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.back-btn:hover { background: #000; color: white; border-color: #000; }
.breadcrumb-content { display: flex; align-items: center; gap: 8px; font-size: 14px; flex-wrap: wrap; }
.breadcrumb-link { background: none; border: none; color: #000; cursor: pointer; font-weight: 500; transition: opacity 0.2s; padding: 0; font-size: 14px; }
.breadcrumb-link:hover { opacity: 0.6; }
.separator { color: #9ca3af; }
.current { color: #9ca3af; font-weight: 400; }
.content-grid { display: grid; grid-template-columns: 350px 1fr; gap: 50px; align-items: start; }
.info-column { position: sticky; top: 100px; }
.project-title { font-size: 30px; font-weight: 700; color: #000; line-height: 1.1; margin-bottom: 20px; }
.project-description { font-size: 15px; line-height: 1.6; color: #6b7280; }
.images-column { width: 100%; max-width: 700px; }
.image-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.grid-image-container { aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; background: #f0f0f0; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); }
.grid-image-container img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.grid-image-container:hover img { transform: scale(1.05); }
.image-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.grid-image-container:hover .image-overlay { opacity: 1; }
.related-projects-section { background: white; padding: 80px 0; border-top: 1px solid #e5e7eb; }
.related-title { font-size: 28px; font-weight: 700; color: #000; text-align: center; margin-bottom: 40px; }
.related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.related-card { cursor: pointer; transition: transform 0.2s; }
.related-card:hover { transform: translateY(-4px); }
.related-image { width: 100%; aspect-ratio: 4/3; border-radius: 10px; overflow: hidden; margin-bottom: 12px; background: #f3f4f6; }
.related-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.related-card:hover .related-image img { transform: scale(1.05); }
.related-name { font-size: 14px; font-weight: 500; color: #000; text-align: center; }
.zoom-modal { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 40px; cursor: zoom-out; }
.zoom-modal-content { position: relative; max-width: 95vw; max-height: 95vh; }
.zoom-modal img { max-width: 100%; max-height: 95vh; object-fit: contain; border-radius: 8px; }
.close-zoom { position: absolute; top: -40px; right: -40px; width: 44px; height: 44px; border-radius: 50%; background: white; border: none; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.close-zoom:hover { background: #f3f4f6; transform: scale(1.1); }
.not-found { min-height: 50vh; display: flex; align-items: center; justify-content: center; text-align: center; }
.not-found h1 { font-size: 32px; margin-bottom: 24px; }
.back-button { background: #000; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; }
@media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; gap: 40px; } .info-column { position: relative; top: 0; } .project-title { font-size: 32px; } .container { padding: 0 24px; } .related-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .main-content { padding: 30px 0 40px; } .project-title { font-size: 26px; } .related-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } .related-projects-section { padding: 50px 0; } .related-title { font-size: 22px; margin-bottom: 30px; } .close-zoom { top: 20px; right: 20px; } }
`;