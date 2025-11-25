import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translateProjectName } from '@/shared/lib/projectTranslations';
import { ChevronLeft } from 'lucide-react';

// Datos de ejemplo de proyectos por categoría
const projectsByCategory: Record<string, any[]> = {
  barandillas: [
    { id: 1, name: 'Pasamanos', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
    { id: 2, name: 'Barandilla en escalera', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
    { id: 3, name: 'Barandilla en terraza', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80' },
    { id: 4, name: 'Barandilla Orgánica', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
    { id: 5, name: 'Barandilla en terraza', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=800&q=80' },
    { id: 6, name: 'Barandilla en escalera de madera', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80' },
    { id: 7, name: 'Barandilla en escalera de pierdas', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 8, name: 'Barandilla de interior', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 9, name: 'Barandilla en escalera', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 10, name: 'Barandilla en terraza', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id: 11, name: 'Barandilla en escalera', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80' },
    { id: 12, name: 'Barandilla', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80' },
  ],
  barbacoas: [
    { id: 1, name: 'Barbacoa', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
    { id: 2, name: 'Barbacoa Rustica', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=800&q=80' },
    { id: 3, name: 'Barbacoa con hierro negro', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
    { id: 4, name: 'Barbacoa BBBQ', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
    { id: 5, name: 'Barbacoa de acero inoxidable con campana', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80' },
    { id: 6, name: 'Barbacoa con mueble incorporado', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
    { id: 7, name: 'Barbacoa empotrada', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80' },
  ],
  carteles: [
    { id: 1, name: 'Cartel Villa Cupina', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    { id: 2, name: 'Cartel Villa Clara', image: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=800&q=80' },
    { id: 3, name: 'Cartel Solivera', image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&q=80' },
    { id: 4, name: 'Cartel Sir Fausto', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=800&q=80' },
    { id: 5, name: 'Cartel San Pedro', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 6, name: 'Cartel Morena', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 7, name: 'Cartel Love', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 8, name: 'Cartel La Tiendita', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id: 9, name: 'Cartel Ibiza Campo', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80' },
    { id: 10, name: 'Cartel Ferre construcciones', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80' },
    { id: 11, name: 'Cartel Es bistro', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=800&q=80' },
    { id: 12, name: 'Cartel El Chiquitin', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80' },
    { id: 13, name: 'Cas Furmente', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
    { id: 14, name: 'Carteles Minimal', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
    { id: 15, name: 'Can Vich de Dalt', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80' },
    { id: 16, name: 'Can Lobo', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
    { id: 17, name: 'Cartel Can Cuine', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
    { id: 18, name: 'Cartel Can California', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=800&q=80' },
    { id: 19, name: 'Cartel Bloom studio', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
    { id: 20, name: 'Cartel Berlina', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
    { id: 21, name: 'Cartel 2k20', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80' },
  ],
  cobre: [
    { id: 1, name: 'Puerta', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=800&q=80' },
    { id: 2, name: 'Puerta', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 3, name: 'Soporte para elementos de cocina', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 4, name: 'Repisa en Cobre', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
  ],
  'corte-laser': [
    { id: 1, name: 'Mascara para frente local', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80' },
    { id: 2, name: 'Simbolo Corte Laser', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
    { id: 3, name: 'Piso en Corte Laser', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=800&q=80' },
    { id: 4, name: 'Pieza Corte Laser', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 5, name: 'Elementos en Corte Laser', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 6, name: 'Corte Laser', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 7, name: 'Cartel Corte Laser', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
  ],
  cristaleras: [
    { id: 1, name: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
    { id: 2, name: 'Cristalera y Cerramiento', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
    { id: 3, name: 'Cristalera y Cerramiento', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80' },
    { id: 4, name: 'Cristaleras y Cerramientos', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
    { id: 5, name: 'Cristalera y Cerramiento', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=800&q=80' },
    { id: 6, name: 'Cristalera y Cerramiento', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80' },
    { id: 7, name: 'Cristalera y Cerramiento', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 8, name: 'Ventana', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 9, name: 'Cristalera divisoria', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 10, name: 'Cristalera repartida', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id: 11, name: 'Cristalera y Cerramiento hierro negro', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80' },
    { id: 12, name: 'Cristalera Medio punto', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80' },
    { id: 13, name: 'Cerramiento', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
  ],
  espejos: [
    { id: 1, name: 'Espejo de baño', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 2, name: 'Espejos gemelos', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 3, name: 'Espejo Baño', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id: 4, name: 'Espejo horizontal', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80' },
    { id: 5, name: 'Espejo baño horizontal', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80' },
    { id: 6, name: 'Espejo baño horizontal', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
    { id: 7, name: 'Espejo baño vertical', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=800&q=80' },
    { id: 8, name: 'Espejo Circular', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
    { id: 9, name: 'Espejo Vertical', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  ],
  fogoneros: [
    { id: 1, name: 'Fogonero Circular de hojas', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
    { id: 2, name: 'Fogonero Circular Can California', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=800&q=80' },
    { id: 3, name: 'Fogonero Circular PC', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
  ],
  laton: [
    { id: 1, name: 'Riel de latón', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=800&q=80' },
    { id: 2, name: 'Pérgola de Latón', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80' },
    { id: 3, name: 'Pared de Latón', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
    { id: 4, name: 'Mueble Latón', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
    { id: 5, name: 'Mesa Latón', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80' },
    { id: 6, name: 'Mampara de Latón', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
    { id: 7, name: 'Espejo Latón', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 8, name: 'Barra de Latón', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 9, name: 'Barra de Latón', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 10, name: 'Árbol de Latón', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
  ],
  mamparas: [
    { id: 1, name: 'Mampara baño', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 2, name: 'Mampara baño', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 3, name: 'Mampara baño', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 4, name: 'Mampara baño', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
  ],
  muebles: [
    { id: 1, name: 'Silla de Hierro Minimalista', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80' },
    { id: 2, name: 'Muebles de baño', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80' },
    { id: 3, name: 'Mueble de hierro y madera', image: 'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=800&q=80' },
    { id: 4, name: 'Mueble de hierro y madera', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80' },
    { id: 5, name: 'Mueble con cerraduras y estantes', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 6, name: 'Mueble con cerraduras y estantes', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id: 7, name: 'Mostrador de hierro', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 8, name: 'Mueble esquinero hierro y madera', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80' },
    { id: 9, name: 'Mostrador de hierro', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 10, name: 'Mostrador de hierro', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
    { id: 11, name: 'Mostrador de hierro', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80' },
    { id: 12, name: 'Mostrador de hierro', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
    { id: 13, name: 'Mesitas de noche', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
    { id: 14, name: 'Mesa de trabajo', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=800&q=80' },
    { id: 15, name: 'Mesa de hierro con madera', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
    { id: 16, name: 'Mesa de hierro', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
    { id: 17, name: 'Mesa circular exterior', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80' },
    { id: 18, name: 'Lampara Moderna de Hierro', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80' },
    { id: 19, name: 'Estructura hierro', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
    { id: 20, name: 'Estructura hierro', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80' },
    { id: 21, name: 'Barra de Cocina', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=800&q=80' },
  ],
  pergolas: [
    { id: 1, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
    { id: 2, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1565183997392-2f8d9328d518?w=800&q=80' },
    { id: 3, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id: 4, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' },
    { id: 5, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80' },
    { id: 6, name: 'Pérgola con madera', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id: 7, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80' },
    { id: 8, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80' },
    { id: 9, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
    { id: 10, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1574116294853-341e68e34ae7?w=800&q=80' },
    { id: 11, name: 'Pérgola', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
  ],
  puertas: [
    { id: 1, name: 'Puerta', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80' },
    { id: 2, name: 'Puerta', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80' },
  ],
  tarimas: [
    { id: 1, name: 'Tarima Rectangular', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
    { id: 2, name: 'Tarima Circular', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80' },
  ],
};

export default function ProyectoCategoria() {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categoryNames: Record<string, string> = {
    muebles: t('categories.muebles.name'),
    barandillas: t('categories.barandillas.name'),
    carteles: t('categories.carteles.name'),
    cristaleras: t('categories.cristaleras.name'),
    pergolas: t('categories.pergolas.name'),
    laton: t('categories.laton.name'),
    espejos: t('categories.espejos.name'),
    barbacoas: t('categories.barbacoas.name'),
    'corte-laser': t('categories.corte-laser.name'),
    cobre: t('categories.cobre.name'),
    mamparas: t('categories.mamparas.name'),
    fogoneros: t('categories.fogoneros.name'),
    tarimas: t('categories.tarimas.name'),
    puertas: t('categories.puertas.name'),
  };

  const projects = categoria ? projectsByCategory[categoria] || [] : [];
  const categoryName = categoria ? categoryNames[categoria] || categoria : '';

  return (
    <div className="proyecto-categoria-page">
      {/* Header */}
      <div className="header-section">
        <div className="container">
          {/* Back Button */}
          <button onClick={() => navigate('/proyectos')} className="back-btn">
            <ChevronLeft size={20} />
          </button>
          
          {/* Breadcrumb */}
          <div className="breadcrumb-content">
            <button onClick={() => navigate('/')} className="breadcrumb-link">
              {t('header.home')}
            </button>
            <span className="separator">›</span>
            <button onClick={() => navigate('/proyectos')} className="breadcrumb-link">
              {t('projects.breadcrumbTitle')}
            </button>
            <span className="separator">›</span>
            <span className="current">{categoryName}</span>
          </div>
          <h1 className="title">{categoryName}</h1>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => navigate(`/proyectos/${categoria}/${project.id}`)}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.name} />
                  <div className="project-overlay">
                    <button className="view-button">{t('projects.viewProject')}</button>
                  </div>
                </div>
                <h3 className="project-name">{translateProjectName(project.name)}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .proyecto-categoria-page {
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

        .back-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .back-btn:hover {
          background: #000;
          color: white;
          border-color: #000;
        }

        .breadcrumb-content {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 16px;
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

        .header-section {
          padding: 12px 0 16px;
          background: white;
          padding-top: 70px;
        }

        .title {
          font-size: 40px;
          font-weight: 700;
          color: #000;
          line-height: 1.2;
          text-align: left;
        }

        .projects-section {
          padding: 0 0 40px;
          background: white;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .project-card {
          cursor: pointer;
        }

        .project-image {
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          position: relative;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .project-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .project-card:hover .project-overlay {
          opacity: 1;
        }

        .project-card:hover .project-image img {
          transform: scale(1.05);
        }

        .view-button {
          background: white;
          color: black;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .view-button:hover {
          transform: scale(1.05);
        }

        .project-name {
          font-size: 15px;
          font-weight: 500;
          color: #000;
          text-align: center;
        }

        @media (max-width: 968px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .title {
            font-size: 32px;
          }
        }

        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }

          .title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
