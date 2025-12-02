import { createClient } from '@supabase/supabase-js';
const url = 'https://tnaosrxydvlvkaznzsfg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYW9zcnh5ZHZsdmthem56c2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTMxOTksImV4cCI6MjA3OTgyOTE5OX0.NeCb-Q6MAL4VPOiJudIVJqLrCilXBgSgAbVtaW4uroQ';
const supabase = createClient(url, key);

(async () => {
  try {
    // Buscar todos los proyectos existentes
    const { data: allProjects } = await supabase
      .from('projects')
      .select('id');
    
    const existingIds = allProjects.map(p => p.id);
    console.log(`📊 Proyectos activos en DB: ${existingIds.length}`);
    
    // Buscar todas las traducciones de proyectos
    const { data: orphanTranslations } = await supabase
      .from('translations')
      .select('*')
      .eq('entity_type', 'project')
      .eq('language_code', 'es')
      .eq('field_name', 'name')
      .order('entity_id');
    
    const orphans = orphanTranslations.filter(t => !existingIds.includes(t.entity_id));
    
    console.log(`\n🔍 Proyectos huérfanos (solo traducciones): ${orphans.length}`);
    
    // Ver si alguno es Cristaleras o Latón
    const cristaleras = orphans.filter(t => t.value.toLowerCase().includes('cristalera'));
    const laton = orphans.filter(t => t.value.toLowerCase().includes('latón') || t.value.toLowerCase().includes('laton'));
    
    console.log(`\n✨ Cristaleras: ${cristaleras.length} proyectos`);
    cristaleras.forEach(t => console.log(`  ID ${t.entity_id}: ${t.value}`));
    
    console.log(`\n✨ Latón: ${laton.length} proyectos`);
    laton.forEach(t => console.log(`  ID ${t.entity_id}: ${t.value}`));
    
    console.log(`\n📋 TODOS LOS HUÉRFANOS:`);
    orphans.forEach(t => console.log(`  ID ${t.entity_id}: ${t.value}`));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
