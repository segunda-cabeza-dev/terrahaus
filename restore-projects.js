import { createClient } from '@supabase/supabase-js';
const url = 'https://tnaosrxydvlvkaznzsfg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYW9zcnh5ZHZsdmthem56c2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTMxOTksImV4cCI6MjA3OTgyOTE5OX0.NeCb-Q6MAL4VPOiJudIVJqLrCilXBgSgAbVtaW4uroQ';
const supabase = createClient(url, key);

const toSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

(async () => {
  try {
    console.log('🔄 Restaurando proyectos huérfanos...\n');
    
    // IDs de Cristaleras y Latón
    const cristalerasIds = [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13];
    const latonIds = [34, 62, 63, 64, 65, 66, 67, 68, 69, 70];
    const allIds = [...cristalerasIds, ...latonIds];
    
    // Buscar todas las traducciones de estos proyectos
    const { data: translations } = await supabase
      .from('translations')
      .select('*')
      .eq('entity_type', 'project')
      .in('entity_id', allIds);
    
    console.log(`📚 Traducciones encontradas: ${translations.length}`);
    
    // Agrupar por proyecto
    const projectsData = {};
    translations.forEach(t => {
      if (!projectsData[t.entity_id]) {
        projectsData[t.entity_id] = { id: t.entity_id, translations: {} };
      }
      if (!projectsData[t.entity_id].translations[t.language_code]) {
        projectsData[t.entity_id].translations[t.language_code] = {};
      }
      projectsData[t.entity_id].translations[t.language_code][t.field_name] = t.value;
    });
    
    // Determinar categoría según el nombre
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug')
      .order('id');
    
    console.log('\n📂 Categorías disponibles:', categories.map(c => `${c.id}:${c.slug}`).join(', '));
    
    // Crear/restaurar proyectos
    let restored = 0;
    for (const [id, data] of Object.entries(projectsData)) {
      const nameES = data.translations.es?.name || '';
      const slug = toSlug(nameES);
      
      // Determinar categoría basándose en el nombre
      let categoryId = null;
      if (nameES.toLowerCase().includes('cristalera') || nameES.toLowerCase().includes('cerramiento') || nameES.toLowerCase().includes('ventana')) {
        // Buscar categoría "Cristaleras" o similar - si no existe, usar la primera
        const cristalerasCat = categories.find(c => c.slug.includes('cristalera') || c.slug.includes('cerramiento'));
        categoryId = cristalerasCat?.id || 1;
      } else if (nameES.toLowerCase().includes('latón') || nameES.toLowerCase().includes('laton')) {
        // Buscar categoría "Latón" - si no existe, usar la primera
        const latonCat = categories.find(c => c.slug.includes('laton'));
        categoryId = latonCat?.id || 1;
      }
      
      // Insertar proyecto en la tabla projects
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: parseInt(id),
          slug: slug,
          category_id: categoryId,
          is_active: true,
          image_urls: [], // Las imágenes se tendrán que subir manualmente
          display_order: parseInt(id)
        });
      
      if (projectError) {
        console.error(`❌ Error restaurando ID ${id} (${nameES}):`, projectError.message);
      } else {
        console.log(`✅ Restaurado ID ${id}: ${nameES} (slug: ${slug}, cat: ${categoryId})`);
        restored++;
      }
    }
    
    console.log(`\n🎉 Total restaurados: ${restored} de ${allIds.length}`);
    console.log('\n⚠️  NOTA: Las imágenes deberás subirlas manualmente desde el admin');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
