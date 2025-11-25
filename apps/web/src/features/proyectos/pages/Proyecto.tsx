import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Base de datos completa de todos los productos para búsqueda
const allProductsDatabase = [
  // Barandillas
  { id: 'b1', name: 'Pasamanos', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&q=80' },
  { id: 'b2', name: 'Barandilla en escalera', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80' },
  { id: 'b3', name: 'Barandilla en terraza', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200&q=80' },
  { id: 'b4', name: 'Barandilla Orgánica', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=200&q=80' },
  { id: 'b5', name: 'Barandilla en escalera de madera', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80' },
  { id: 'b6', name: 'Barandilla en escalera de pierdas', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&q=80' },
  { id: 'b7', name: 'Barandilla de interior', category: 'barandillas', categoryName: 'Barandillas', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  
  // Barbacoas
  { id: 'bb1', name: 'Barbacoa', category: 'barbacoas', categoryName: 'Barbacoas', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
  { id: 'bb2', name: 'Barbacoa Rustica', category: 'barbacoas', categoryName: 'Barbacoas', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=200&q=80' },
  { id: 'bb3', name: 'Barbacoa con hierro negro', category: 'barbacoas', categoryName: 'Barbacoas', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&q=80' },
  { id: 'bb4', name: 'Barbacoa BBBQ', category: 'barbacoas', categoryName: 'Barbacoas', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&q=80' },
  
  // Carteles
  { id: 'c1', name: 'Cartel Villa Cupina', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { id: 'c2', name: 'Cartel Love', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=200&q=80' },
  { id: 'c3', name: 'Cartel Es bistro', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=200&q=80' },
  { id: 'c4', name: 'Cartel Morena', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  { id: 'c5', name: 'Cartel Berlina', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&q=80' },
  { id: 'c6', name: 'Cartel 2k20', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=200&q=80' },
  { id: 'c7', name: 'Carteles Minimal', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80' },
  { id: 'c8', name: 'Cartel San Pedro', category: 'carteles', categoryName: 'Carteles', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&q=80' },
  
  // Cobre
  { id: 'co1', name: 'Puerta', category: 'cobre', categoryName: 'Cobre', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=200&q=80' },
  { id: 'co2', name: 'Soporte para elementos de cocina', category: 'cobre', categoryName: 'Cobre', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  { id: 'co3', name: 'Repisa en Cobre', category: 'cobre', categoryName: 'Cobre', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&q=80' },
  
  // Corte Laser
  { id: 'cl1', name: 'Mascara para frente local', category: 'corte-laser', categoryName: 'Corte láser', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&q=80' },
  { id: 'cl2', name: 'Simbolo Corte Laser', category: 'corte-laser', categoryName: 'Corte láser', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80' },
  { id: 'cl3', name: 'Piso en Corte Laser', category: 'corte-laser', categoryName: 'Corte láser', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=200&q=80' },
  { id: 'cl4', name: 'Cartel Corte Laser', category: 'corte-laser', categoryName: 'Corte láser', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80' },
  
  // Cristaleras
  { id: 'cr1', name: 'Cristaleras y Cerramientos', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80' },
  { id: 'cr2', name: 'Cristalera y Cerramiento', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&q=80' },
  { id: 'cr3', name: 'Ventana', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  { id: 'cr4', name: 'Cristalera divisoria', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&q=80' },
  { id: 'cr5', name: 'Cristalera repartida', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80' },
  { id: 'cr6', name: 'Cristalera Medio punto', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=200&q=80' },
  { id: 'cr7', name: 'Cerramiento', category: 'cristaleras', categoryName: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&q=80' },
  
  // Espejos
  { id: 'e1', name: 'Espejo de baño', category: 'espejos', categoryName: 'Espejos', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  { id: 'e2', name: 'Espejos gemelos', category: 'espejos', categoryName: 'Espejos', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&q=80' },
  { id: 'e3', name: 'Espejo Baño', category: 'espejos', categoryName: 'Espejos', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80' },
  { id: 'e4', name: 'Espejo Circular', category: 'espejos', categoryName: 'Espejos', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
  
  // Fogoneros
  { id: 'f1', name: 'Fogonero Circular de hojas', category: 'fogoneros', categoryName: 'Fogoneros', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&q=80' },
  { id: 'f2', name: 'Fogonero Circular Can California', category: 'fogoneros', categoryName: 'Fogoneros', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=200&q=80' },
  
  // Latón
  { id: 'l1', name: 'Riel de latón', category: 'laton', categoryName: 'Latón', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=200&q=80' },
  { id: 'l2', name: 'Pérgola de Latón', category: 'laton', categoryName: 'Latón', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80' },
  { id: 'l3', name: 'Mampara de Latón', category: 'laton', categoryName: 'Latón', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=200&q=80' },
  { id: 'l4', name: 'Espejo Latón', category: 'laton', categoryName: 'Latón', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&q=80' },
  
  // Mamparas
  { id: 'm1', name: 'Mampara baño', category: 'mamparas', categoryName: 'Mamparas', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&q=80' },
  { id: 'm2', name: 'Mampara de Latón', category: 'mamparas', categoryName: 'Mamparas', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  
  // Muebles
  { id: 'mu1', name: 'Silla de Hierro Minimalista', category: 'muebles', categoryName: 'Muebles', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=200&q=80' },
  { id: 'mu2', name: 'Muebles de baño', category: 'muebles', categoryName: 'Muebles', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&q=80' },
  { id: 'mu3', name: 'Mueble de hierro y madera', category: 'muebles', categoryName: 'Muebles', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=200&q=80' },
  { id: 'mu4', name: 'Mueble esquinero hierro y madera', category: 'muebles', categoryName: 'Muebles', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=200&q=80' },
  { id: 'mu5', name: 'Mostrador de hierro', category: 'muebles', categoryName: 'Muebles', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  { id: 'mu6', name: 'Mesa de hierro', category: 'muebles', categoryName: 'Muebles', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&q=80' },
  
  // Pérgolas
  { id: 'p1', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80' },
  { id: 'p2', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=200&q=80' },
  { id: 'p3', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&q=80' },
  { id: 'p4', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80' },
  { id: 'p5', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&q=80' },
  { id: 'p6', name: 'Pérgola con madera', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80' },
  { id: 'p7', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=200&q=80' },
  { id: 'p8', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=200&q=80' },
  { id: 'p9', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&q=80' },
  { id: 'p10', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=200&q=80' },
  { id: 'p11', name: 'Pérgola', category: 'pergolas', categoryName: 'Pérgolas', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
  
  // Puertas
  { id: 'pu1', name: 'Puerta', category: 'puertas', categoryName: 'Puertas', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=200&q=80' },
  
  // Tarimas
  { id: 't1', name: 'Tarima Rectangular', category: 'tarimas', categoryName: 'Tarimas', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&q=80' },
  { id: 't2', name: 'Tarima Circular', category: 'tarimas', categoryName: 'Tarimas', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=200&q=80' },
];

export default function Proyecto() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const categories = [
    { 
      id: 'muebles', 
      name: t('categories.muebles.name'), 
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
      description: t('categories.muebles.desc')
    },
    { 
      id: 'carteles', 
      name: t('categories.carteles.name'), 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      description: t('categories.carteles.desc')
    },
    { 
      id: 'cristaleras', 
      name: t('categories.cristaleras.name'), 
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      description: t('categories.cristaleras.desc')
    },
    { 
      id: 'barandillas', 
      name: t('categories.barandillas.name'), 
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      description: t('categories.barandillas.desc')
    },
    { 
      id: 'pergolas', 
      name: t('categories.pergolas.name'), 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      description: t('categories.pergolas.desc')
    },
    { 
      id: 'laton', 
      name: t('categories.laton.name'), 
      image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=800&q=80',
      description: t('categories.laton.desc')
    },
    { 
      id: 'espejos', 
      name: t('categories.espejos.name'), 
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
      description: t('categories.espejos.desc')
    },
    { 
      id: 'barbacoas', 
      name: t('categories.barbacoas.name'), 
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      description: t('categories.barbacoas.desc')
    },
    { 
      id: 'corte-laser', 
      name: t('categories.corte-laser.name'), 
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
      description: t('categories.corte-laser.desc')
    },
    { 
      id: 'cobre', 
      name: t('categories.cobre.name'), 
      image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=800&q=80',
      description: t('categories.cobre.desc')
    },
    { 
      id: 'mamparas', 
      name: t('categories.mamparas.name'), 
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
      description: t('categories.mamparas.desc')
    },
    { 
      id: 'fogoneros', 
      name: t('categories.fogoneros.name'), 
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
      description: t('categories.fogoneros.desc')
    },
    { 
      id: 'tarimas', 
      name: t('categories.tarimas.name'), 
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      description: t('categories.tarimas.desc')
    },
    { 
      id: 'puertas', 
      name: t('categories.puertas.name'), 
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
      description: t('categories.puertas.desc')
    },
  ];

  // Función para normalizar texto (quitar acentos)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar categorías - busca en nombre, id y descripción
  const filteredCategoriesForDropdown = searchTerm.length > 0 
    ? categories.filter(category => {
        const searchNormalized = normalizeText(searchTerm);
        return (
          normalizeText(category.name).includes(searchNormalized) ||
          normalizeText(category.id).includes(searchNormalized) ||
          normalizeText(category.description).includes(searchNormalized)
        );
      })
    : [];
  
  // Para la grilla, mostrar todas si no hay búsqueda, sino filtrar
  const filteredCategories = searchTerm.length > 0 
    ? categories.filter(category => {
        const searchNormalized = normalizeText(searchTerm);
        return (
          normalizeText(category.name).includes(searchNormalized) ||
          normalizeText(category.id).includes(searchNormalized) ||
          normalizeText(category.description).includes(searchNormalized)
        );
      })
    : categories;

  // Filtrar productos con búsqueda mejorada
  const filteredProducts = searchTerm.length > 0
    ? allProductsDatabase.filter(product => {
        const searchNormalized = normalizeText(searchTerm);
        return (
          normalizeText(product.name).includes(searchNormalized) ||
          normalizeText(product.categoryName).includes(searchNormalized)
        );
      }).slice(0, 8) // Limitar a 8 resultados
    : [];

  const hasResults = searchTerm.length > 0 && (filteredCategoriesForDropdown.length > 0 || filteredProducts.length > 0);

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  const handleProductClick = (categoryId: string) => {
    navigate(`/proyectos/${categoryId}`);
    setShowResults(false);
    setSearchTerm('');
  };

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchTerm && setShowResults(true)}
            />
            {searchTerm && (
              <button className="clear-button" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
            <button className="search-button">
              <Search size={20} />
            </button>

            {/* Search Results Dropdown */}
            {showResults && hasResults && (
              <div className="search-results">
                {filteredCategoriesForDropdown.length > 0 && (
                  <div className="results-section">
                    <h3 className="results-title">CATEGORÍAS</h3>
                    {filteredCategoriesForDropdown.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          navigate(`/proyectos/${category.id}`);
                          setShowResults(false);
                          setSearchTerm('');
                        }}
                        className="result-item category-result"
                      >
                        <span className="result-name">{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredProducts.length > 0 && (
                  <div className="results-section">
                    <h3 className="results-title">PRODUCTOS</h3>
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.category)}
                        className="result-item product-result"
                      >
                        <img src={product.image} alt={product.name} className="product-thumb" />
                        <span className="result-name">{product.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <a 
              key={category.id} 
              href={`/proyectos/${category.id}`}
              className="category-card"
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="category-description">{category.description}</span>
                </div>
              </div>
              <h3>{category.name}</h3>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .proyecto-page {
          padding: 64px 0 120px;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .proyecto-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .subtitle {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #000;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .title {
          font-size: 45px;
          font-weight: 700;
          color: #000;
          margin-bottom: 32px;
          line-height: 1.2;
        }

        .search-box {
          max-width: 920px;
          margin: 0 auto;
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 16px 110px 16px 20px;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s;
          background: white;
        }

        .search-box input:focus {
          border-color: #000;
        }

        .search-box input::placeholder {
          color: #aaa;
          font-weight: 300;
        }

        .clear-button {
          position: absolute;
          right: 65px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #bbb;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          border-radius: 50%;
        }

        .clear-button:hover {
          color: #000;
          background: #f5f5f5;
        }

        .search-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #000;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .search-button:hover {
          background: #1a1a1a;
          transform: translateY(-50%) scale(1.05);
        }

        .search-results {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          max-height: 500px;
          overflow-y: auto;
          z-index: 100;
        }

        .results-section {
          padding: 16px 0;
        }

        .results-section:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }

        .results-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #999;
          padding: 0 20px 12px;
          margin: 0;
        }

        .result-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          text-decoration: none;
          color: #000;
          transition: background 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .result-item:hover {
          background: #f9f9f9;
        }

        .category-result {
          font-weight: 500;
        }

        .product-result {
          gap: 12px;
        }

        .product-thumb {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .result-name {
          font-size: 14px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .category-card {
          cursor: pointer;
          transition: transform 0.3s;
          text-decoration: none;
          color: inherit;
        }

        .category-card:hover {
          transform: translateY(-5px);
        }

        .category-image {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
          position: relative;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          display: flex;
          align-items: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .category-description {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .category-card:hover .category-overlay {
          opacity: 1;
        }

        .category-card:hover .category-image img {
          transform: scale(1.05);
        }

        .category-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          text-align: center;
        }

        @media (max-width: 968px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .title {
            font-size: 42px;
          }
        }

        @media (max-width: 640px) {
          .proyecto-page {
            padding: 60px 0 80px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .title {
            font-size: 42px;
          }

          .search-box input {
            font-size: 14px;
            padding: 14px 50px 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}
