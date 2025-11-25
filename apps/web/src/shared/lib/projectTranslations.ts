import i18n from '../i18n/config';

/**
 * Traduce el nombre de un proyecto usando términos comunes
 * Si no encuentra traducción, devuelve el nombre original
 */
export function translateProjectName(name: string): string {
  if (!name) return '';
  
  const lowerName = name.toLowerCase();
  const t = i18n.t.bind(i18n);
  
  // Mapeo de términos españoles a claves de traducción
  const termMap: Record<string, string> = {
    'pasamanos': 'projects.terms.pasamanos',
    'barandilla': 'projects.terms.barandilla',
    'escalera': 'projects.terms.escalera',
    'terraza': 'projects.terms.terraza',
    'orgánica': 'projects.terms.organica',
    'madera': 'projects.terms.madera',
    'piedras': 'projects.terms.piedras',
    'interior': 'projects.terms.interior',
    'barbacoa': 'projects.terms.barbacoa',
    'rústica': 'projects.terms.rustica',
    'rustica': 'projects.terms.rustica',
    'hierro negro': 'projects.terms.hierro negro',
    'acero inoxidable': 'projects.terms.acero inoxidable',
    'campana': 'projects.terms.campana',
    'mueble incorporado': 'projects.terms.mueble incorporado',
    'empotrada': 'projects.terms.empotrada',
    'cartel': 'projects.terms.cartel',
    'ventana': 'projects.terms.ventana',
    'cristalera': 'projects.terms.cristalera',
    'cristaleras': 'projects.terms.cristalera',
    'cerramiento': 'projects.terms.cerramiento',
    'cerramientos': 'projects.terms.cerramiento',
    'reparación': 'projects.terms.reparacion',
    'reparacion': 'projects.terms.reparacion',
    'divisoria': 'projects.terms.divisoria',
    'medio punto': 'projects.terms.medio punto',
    'silla': 'projects.terms.silla',
    'minimalista': 'projects.terms.minimalista'
  };
  
  // Intentar traducir palabra por palabra
  let translatedName = name;
  
  // Ordenar por longitud descendente para que las frases largas se traduzcan primero
  const sortedTerms = Object.keys(termMap).sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    const regex = new RegExp(term, 'gi');
    if (lowerName.includes(term)) {
      const translation = t(termMap[term]);
      translatedName = translatedName.replace(regex, (match) => {
        // Preservar mayúsculas
        if (match[0] === match[0].toUpperCase()) {
          return translation.charAt(0).toUpperCase() + translation.slice(1);
        }
        return translation;
      });
    }
  }
  
  return translatedName;
}
