import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projectsService, type ProjectCategory, type ProjectItem } from '@beltrame/shared';

export default function Proyecto() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const lang = i18n.language || 'es';
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [searchResults, setSearchResults] = useState<{ categories: ProjectCategory[], projects: ProjectItem[] }>({ categories: [], projects: [] });
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await projectsService.getCategories(lang);
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [lang]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (searchTerm.length < 2) {
      setSearchResults({ categories: [], projects: [] });
      return;
    }
    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await projectsService.search(searchTerm, lang);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchTerm, lang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = searchTerm.length > 0
    ? categories.filter(cat => {
        const s = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const n = cat.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const d = cat.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return n.includes(s) || d.includes(s);
      })
    : categories;

  const hasResults = searchTerm.length > 1 && (searchResults.categories.length > 0 || searchResults.projects.length > 0);

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    setSearchResults({ categories: [], projects: [] });
  };

  const handleCategoryClick = (slug: string) => {
    navigate('/proyectos/' + slug);
    setShowResults(false);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="proyecto-page">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: '#999' }} />
            <span style={{ marginLeft: 8, color: '#666' }}>Cargando proyectos...</span>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="proyecto-page">
      <div className="container">
        <div className="proyecto-header">
          <p className="subtitle">{t('projects.subtitle').toUpperCase()}</p>
          <h1 className="title">{t('projects.title')}</h1>
          
          <div className="search-box" ref={searchRef}>
            <input
              type="text"
              placeholder={t('projects.search')}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
              onFocus={() => searchTerm && setShowResults(true)}
            />
            {searchTerm && (
              <button className="clear-button" onClick={clearSearch}><X size={18} /></button>
            )}
            <button className="search-button">
              {searching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>

            {showResults && (hasResults || searching) && (
              <div className="search-results">
                {searching && (
                  <div className="results-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <Loader2 className="animate-spin" style={{ width: 20, height: 20, color: '#999' }} />
                    <span style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>Buscando...</span>
                  </div>
                )}
                {!searching && searchResults.categories.length > 0 && (
                  <div className="results-section">
                    <h3 className="results-title">CATEGORÍAS</h3>
                    {searchResults.categories.map((cat) => (
                      <button key={cat.id} onClick={() => handleCategoryClick(cat.slug)} className="result-item category-result">
                        <span className="result-name">{cat.name}</span>
                        {cat.project_count !== undefined && <span className="result-count">{cat.project_count} proyectos</span>}
                      </button>
                    ))}
                  </div>
                )}
                {!searching && searchResults.projects.length > 0 && (
                  <div className="results-section">
                    <h3 className="results-title">PROYECTOS</h3>
                    {searchResults.projects.map((proj) => (
                      <button key={proj.id} onClick={() => handleCategoryClick(proj.category_slug)} className="result-item product-result">
                        {proj.image_urls[0] && <img src={proj.image_urls[0]} alt={proj.name} className="product-thumb" />}
                        <span className="result-name">{proj.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="categories-grid">
          {filteredCategories.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#999' }}>No se encontraron categorías</div>
          ) : (
            filteredCategories.map((cat) => (
              <a key={cat.id} href={'/proyectos/' + cat.slug} className="category-card">
                <div className="category-image">
                  <img src={cat.cover_image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'} alt={cat.name} />
                  <div className="category-overlay"><span className="category-description">{cat.description}</span></div>
                </div>
                <h3>{cat.name}</h3>
              </a>
            ))
          )}
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
}

const styles = `
.proyecto-page { padding: 70px 0 120px; background: white; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.proyecto-header { text-align: center; margin-bottom: 64px; }
.subtitle { font-size: 16px; font-weight: 500; letter-spacing: 0.1em; color: #000; margin-bottom: 16px; text-transform: uppercase; }
.title { font-size: 35px; font-weight: 700; color: #000; margin-bottom: 32px; line-height: 1.2; }
@media (min-width: 768px) { .title { font-size: 50px; } }
.search-box { max-width: 920px; margin: 0 auto; position: relative; }
.search-box input { width: 100%; padding: 16px 110px 16px 20px; border: 1px solid #d0d0d0; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s; background: white; }
.search-box input:focus { border-color: #000; }
.search-box input::placeholder { color: #aaa; font-weight: 300; }
.clear-button { position: absolute; right: 65px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #bbb; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border-radius: 50%; }
.clear-button:hover { color: #000; background: #f5f5f5; }
.search-button { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #000; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
.search-button:hover { background: #1a1a1a; transform: translateY(-50%) scale(1.05); }
.search-results { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-height: 500px; overflow-y: auto; z-index: 100; }
.results-section { padding: 16px 0; }
.results-section:not(:last-child) { border-bottom: 1px solid #f0f0f0; }
.results-title { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: #999; padding: 0 20px 12px; margin: 0; }
.result-item { display: flex; align-items: center; padding: 12px 20px; text-decoration: none; color: #000; transition: background 0.2s; border: none; background: none; width: 100%; text-align: left; cursor: pointer; }
.result-item:hover { background: #f9f9f9; }
.category-result { font-weight: 500; justify-content: space-between; }
.result-count { font-size: 12px; color: #999; font-weight: 400; }
.product-result { gap: 12px; }
.product-thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.result-name { font-size: 14px; }
.categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.category-card { cursor: pointer; transition: transform 0.3s; text-decoration: none; color: inherit; }
.category-card:hover { transform: translateY(-5px); }
.category-image { width: 100%; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; margin-bottom: 12px; position: relative; background: #f0f0f0; }
.category-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.category-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 20px; opacity: 0; transition: opacity 0.3s; }
.category-description { color: white; font-size: 14px; font-weight: 500; }
.category-card:hover .category-overlay { opacity: 1; }
.category-card:hover .category-image img { transform: scale(1.05); }
.category-card h3 { font-size: 16px; font-weight: 600; color: #000; text-align: center; }
@media (max-width: 968px) { .categories-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
@media (max-width: 640px) { .proyecto-page { padding: 60px 0 80px; } .categories-grid { grid-template-columns: 1fr; } .search-box input { font-size: 14px; padding: 14px 50px 14px 16px; } }
`;
