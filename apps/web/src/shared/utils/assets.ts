/**
 * Utilidades para manejar URLs de assets desde Cloudflare R2 o localmente
 */

// URL base del bucket (configurar en .env.local)
const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_URL || '';

/**
 * Obtiene la URL completa de una imagen
 * @param path - Ruta relativa ej: "/images/Hero-Glamping.webp" o "images/Hero-Glamping.webp"
 * @param preferWebP - Si true, intenta usar versión WebP
 */
export function getImageUrl(path: string, preferWebP = true): string {
  // Limpiar la ruta
  let cleanPath = path.startsWith('/assets/') 
    ? path.replace('/assets/', '') 
    : path.startsWith('/')
      ? path.slice(1)
      : path;

  // Convertir a WebP si se prefiere
  if (preferWebP && !cleanPath.endsWith('.webp')) {
    cleanPath = cleanPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  // Si hay URL base configurada, usar el bucket
  if (ASSETS_BASE_URL) {
    return `${ASSETS_BASE_URL}/${cleanPath}`;
  }

  // Fallback a ruta local
  return `/assets/${cleanPath}`;
}

/**
 * Obtiene las URLs de un video optimizado
 * @param path - Ruta del video original ej: "/assets/videos/Rendervideo.mp4"
 */
export function getVideoUrls(path: string): {
  mp4: string;
  webm: string;
  mobile: string;
  poster: string;
  original: string;
} {
  // Obtener nombre base
  const baseName = path
    .replace('/assets/', '')
    .replace(/\.(mp4|webm)$/i, '')
    .replace('videos/', 'videos/');

  const optimizedBase = baseName.includes('optimized') 
    ? baseName 
    : baseName.replace('videos/', 'videos/');

  if (ASSETS_BASE_URL) {
    // URLs del bucket
    return {
      mp4: `${ASSETS_BASE_URL}/${optimizedBase}-optimized.mp4`,
      webm: `${ASSETS_BASE_URL}/${optimizedBase}-optimized.webm`,
      mobile: `${ASSETS_BASE_URL}/${optimizedBase}-mobile.mp4`,
      poster: `${ASSETS_BASE_URL}/${optimizedBase}-poster.webp`,
      original: `${ASSETS_BASE_URL}/${baseName}.mp4`,
    };
  }

  // URLs locales
  const localOptimized = `/assets/${optimizedBase}`;
  return {
    mp4: `${localOptimized.replace('/videos/', '/videos/optimized/')}-optimized.mp4`,
    webm: `${localOptimized.replace('/videos/', '/videos/optimized/')}-optimized.webm`,
    mobile: `${localOptimized.replace('/videos/', '/videos/optimized/')}-mobile.mp4`,
    poster: `${localOptimized.replace('/videos/', '/videos/optimized/')}-poster.webp`,
    original: `/assets/${baseName}.mp4`,
  };
}

/**
 * Detecta si el dispositivo es móvil
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Obtiene la URL del video apropiada según el dispositivo
 */
export function getResponsiveVideoUrl(path: string): string {
  const urls = getVideoUrls(path);
  return isMobileDevice() ? urls.mobile : urls.mp4;
}
