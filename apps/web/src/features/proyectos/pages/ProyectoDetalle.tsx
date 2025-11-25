import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ZoomIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateProjectName } from '@/shared/lib/projectTranslations';

// Datos de ejemplo de proyectos con múltiples imágenes
const projectsByCategory: Record<string, any[]> = {
  laton: [
    { 
      id: 1, 
      name: 'Riel de latón', 
      images: [
        'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=1200&q=80',
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80',
      ],
      description: 'Riel de latón pulido con acabado brillante, perfecto para cortinas de alta gama.'
    },
    { 
      id: 2, 
      name: 'Pérgola de Latón', 
      images: [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      ],
      description: 'Estructura de pérgola en latón, diseño moderno y elegante.'
    },
    { 
      id: 3, 
      name: 'Pared de Latón', 
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
      ],
      description: 'Revestimiento de pared en latón con diseño personalizado.'
    },
    { 
      id: 4, 
      name: 'Mueble Latón', 
      images: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
      ],
      description: 'Mueble contemporáneo con estructura de latón.'
    },
    { 
      id: 5, 
      name: 'Mesa Latón', 
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
      ],
      description: 'Mesa de diseño con detalles en latón pulido.'
    },
    { 
      id: 6, 
      name: 'Mampara de Latón', 
      images: [
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      ],
      description: 'Mampara divisoria en latón con cristal templado.'
    },
    { 
      id: 7, 
      name: 'Espejo Latón', 
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
        'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80',
      ],
      description: 'Espejo con marco de latón artesanal.'
    },
    { 
      id: 8, 
      name: 'Barra de Latón', 
      images: [
        'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80',
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80',
      ],
      description: 'Barra moderna de latón con acabado pulido, ideal para espacios comerciales y residenciales de alta gama.'
    },
    { 
      id: 9, 
      name: 'Barra de Latón', 
      images: [
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
      ],
      description: 'Barra de bar en latón con iluminación integrada.'
    },
    { 
      id: 10, 
      name: 'Árbol de Latón', 
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
        'https://images.unsplash.com/photo-1565183928294-7d22f2d8ab3d?w=1200&q=80',
      ],
      description: 'Escultura decorativa en forma de árbol, elaborada en latón.'
    },
  ],
  // Puedes agregar más categorías aquí
};

export default function ProyectoDetalle() {
  const { t } = useTranslation();
  const { categoria, id } = useParams<{ categoria: string; id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Scroll al tope cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, categoria]);

  // Obtener el proyecto desde ProyectoCategoria
  const allProjects: Record<string, any[]> = {
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

  // Buscar el proyecto en todas las categorías o en la específica
  const projects = categoria ? allProjects[categoria] || [] : [];
  let project = projects.find((p) => p.id === Number(id));

  // Si tiene imágenes definidas en projectsByCategory, usarlas
  const projectWithImages = categoria ? projectsByCategory[categoria]?.find((p) => p.id === Number(id)) : null;
  
  const categoryName = categoria ? t(`categories.${categoria}.name`) : '';

  if (!project) {
    return (
      <div className="not-found">
        <div className="container">
          <h1>{t('projects.notFound')}</h1>
          <button onClick={() => navigate('/proyectos')} className="back-button">
            {t('projects.backToProjects')}
          </button>
        </div>
      </div>
    );
  }

  // Generar galería de imágenes: si existe projectWithImages usar sus imágenes, 
  // sino generar 3 variaciones de la imagen principal
  const baseImage = project.image;
  const images = projectWithImages?.images || [
    baseImage,
    baseImage.replace('w=800', 'w=1200'),
    baseImage.replace('q=80', 'q=90')
  ];

  const description = projectWithImages?.description || `${t('projects.projectOf')} ${translateProjectName(project.name)} ${t('projects.madeWith')}`;

  // Obtener proyectos relacionados (otros proyectos de la misma categoría, excluyendo el actual)
  const relatedProjects = projects
    .filter(p => p.id !== Number(id))
    .slice(0, 4); // Mostrar máximo 4 proyectos relacionados

  return (
    <div className="proyecto-detalle-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <div className="container">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('header.home')}
          </button>
          <span className="separator">›</span>
          <button onClick={() => navigate('/proyectos')} className="breadcrumb-link">
            {t('projects.title')}
          </button>
          <span className="separator">›</span>
          <button onClick={() => navigate(`/proyectos/${categoria}`)} className="breadcrumb-link">
            {categoryName}
          </button>
          <span className="separator">›</span>
          <span className="current">{translateProjectName(project.name)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Project Info */}
            <div className="info-column">
              <button onClick={() => navigate(`/proyectos/${categoria}`)} className="back-btn">
                <ChevronLeft size={20} />
              </button>
              
              <h1 className="project-title">{translateProjectName(project.name)}</h1>
              
              <p className="project-description">{description}</p>
            </div>

            {/* Right Column - Images */}
            <div className="images-column">
              {/* Main Image */}
              <div className="main-image-container">
                <img 
                  src={images[selectedImage]} 
                  alt={project.name}
                  className="main-image"
                  onClick={() => setIsZoomed(true)}
                />
                <button 
                  className="zoom-button"
                  onClick={() => setIsZoomed(true)}
                >
                  <ZoomIn size={20} />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="thumbnail-gallery">
                  {images.map((img: string, index: number) => (
                    <div 
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt={`${project.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Otras piezas que podrían interesarte */}
      {relatedProjects.length > 0 && (
        <div className="related-projects-section">
          <div className="container">
            <h2 className="related-title">{t('projects.otherPieces')}</h2>
            <div className="related-grid">
              {relatedProjects.map((relatedProject) => (
                <div 
                  key={relatedProject.id}
                  className="related-card"
                  onClick={() => navigate(`/proyectos/${categoria}/${relatedProject.id}`)}
                >
                  <div className="related-image">
                    <img src={relatedProject.image} alt={relatedProject.name} />
                  </div>
                  <h3 className="related-name">{translateProjectName(relatedProject.name)}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isZoomed && (
        <div className="zoom-modal" onClick={() => setIsZoomed(false)}>
          <div className="zoom-modal-content">
            <img src={images[selectedImage]} alt={project.name} />
            <button className="close-zoom" onClick={() => setIsZoomed(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        .proyecto-detalle-page {
          min-height: 100vh;
          background: white;
          padding-top: 80px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Breadcrumb */
        .breadcrumb {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 0;
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
        }

        .breadcrumb-link:hover {
          opacity: 0.6;
        }

        .separator {
          color: #9ca3af;
        }

        .current {
          color: #9ca3af;
          font-weight: 400;
        }

        /* Main Content */
        .main-content {
          padding: 40px 0 60px;
          background: white;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 50px;
          align-items: start;
        }

        /* Left Column */
        .info-column {
          position: sticky;
          top: 100px;
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
          margin-bottom: 32px;
        }

        .back-btn:hover {
          background: #000;
          color: white;
          border-color: #000;
        }

        .project-title {
          font-size: 40px;
          font-weight: 700;
          color: #000;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .project-description {
          font-size: 15px;
          line-height: 1.6;
          color: #6b7280;
        }

        /* Right Column - Images */
        .images-column {
          width: 100%;
          max-width: 700px;
        }

        .main-image-container {
          width: 100%;
          aspect-ratio: 4/3;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          cursor: zoom-in;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .main-image-container:hover .main-image {
          transform: scale(1.02);
        }

        .zoom-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0;
        }

        .main-image-container:hover .zoom-button {
          opacity: 1;
        }

        .zoom-button:hover {
          background: white;
          transform: scale(1.1);
        }

        /* Thumbnail Gallery */
        .thumbnail-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }

        .thumbnail {
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          background: white;
        }

        .thumbnail:hover {
          border-color: #d1d5db;
        }

        .thumbnail.active {
          border-color: #000;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s;
        }

        .thumbnail:hover img {
          transform: scale(1.05);
        }

        /* Related Projects Section */
        .related-projects-section {
          background: white;
          padding: 80px 0;
          border-top: 1px solid #e5e7eb;
        }

        .related-title {
          font-size: 28px;
          font-weight: 700;
          color: #000;
          text-align: center;
          margin-bottom: 40px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .related-card {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .related-card:hover {
          transform: translateY(-4px);
        }

        .related-image {
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 12px;
          background: #f3f4f6;
        }

        .related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .related-card:hover .related-image img {
          transform: scale(1.05);
        }

        .related-name {
          font-size: 14px;
          font-weight: 500;
          color: #000;
          text-align: center;
        }

        /* Zoom Modal */
        .zoom-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 40px;
          cursor: zoom-out;
        }

        .zoom-modal-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
        }

        .zoom-modal img {
          max-width: 100%;
          max-height: 95vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .close-zoom {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-zoom:hover {
          background: #f3f4f6;
          transform: scale(1.1);
        }

        /* Not Found */
        .not-found {
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .not-found h1 {
          font-size: 32px;
          margin-bottom: 24px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .info-column {
            position: relative;
            top: 0;
          }

          .project-title {
            font-size: 32px;
          }

          .container {
            padding: 0 24px;
          }

          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .main-content {
            padding: 30px 0 40px;
          }

          .project-title {
            font-size: 26px;
          }

          .thumbnail-gallery {
            grid-template-columns: repeat(3, 1fr);
          }

          .related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .related-projects-section {
            padding: 50px 0;
          }

          .related-title {
            font-size: 22px;
            margin-bottom: 30px;
          }

          .close-zoom {
            top: 20px;
            right: 20px;
          }

          .breadcrumb .container {
            font-size: 12px;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
