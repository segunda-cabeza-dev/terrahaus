/**
 * URL base para assets desde Cloudflare R2
 * En producción siempre usa R2
 */
export const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || 'https://pub-e9476d34c83b42cebbbfe7469a26b77a.r2.dev';

/**
 * Obtiene la URL de una imagen
 * @param path - Ruta de la imagen (ej: "HeroFondo.webp" o "/assets/images/HeroFondo.jpg")
 */
export function img(path: string): string {
  // Limpiar la ruta
  let cleanPath = path
    .replace('/assets/images/', '')
    .replace('/assets/', '')
    .replace(/^\//, '');
  
  // Convertir a WebP si es jpg/png
  cleanPath = cleanPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  if (ASSETS_URL) {
    return `${ASSETS_URL}/images/${cleanPath}`;
  }
  
  return `/assets/images/${cleanPath}`;
}

/**
 * Obtiene la URL de un video
 * @param filename - Nombre del video (ej: "Rendervideo")
 * @param variant - Variante: 'optimized' | 'mobile' | 'poster'
 */
export function video(filename: string, variant: 'optimized' | 'mobile' | 'poster' = 'optimized'): string {
  const baseName = filename.replace(/\.(mp4|webm)$/i, '').replace('/assets/videos/', '');
  
  let file: string;
  switch (variant) {
    case 'mobile':
      file = `${baseName}-mobile.mp4`;
      break;
    case 'poster':
      file = `${baseName}-poster.webp`;
      break;
    default:
      file = `${baseName}-optimized.mp4`;
  }
  
  if (ASSETS_URL) {
    return `${ASSETS_URL}/videos/${file}`;
  }
  
  return `/assets/videos/optimized/${file}`;
}

/**
 * Obtiene URLs del video para diferentes formatos
 */
export function videoSources(filename: string) {
  const baseName = filename.replace(/\.(mp4|webm)$/i, '').replace('/assets/videos/', '');
  
  if (ASSETS_URL) {
    return {
      mp4: `${ASSETS_URL}/videos/${baseName}-optimized.mp4`,
      webm: `${ASSETS_URL}/videos/${baseName}-optimized.webm`,
      mobile: `${ASSETS_URL}/videos/${baseName}-mobile.mp4`,
      poster: `${ASSETS_URL}/videos/${baseName}-poster.webp`,
    };
  }
  
  return {
    mp4: `/assets/videos/optimized/${baseName}-optimized.mp4`,
    webm: `/assets/videos/optimized/${baseName}-optimized.webm`,
    mobile: `/assets/videos/optimized/${baseName}-mobile.mp4`,
    poster: `/assets/videos/optimized/${baseName}-poster.webp`,
  };
}
