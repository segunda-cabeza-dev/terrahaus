import { useState, useRef, useEffect } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  priority?: boolean;
}

/**
 * Componente de video optimizado con:
 * - Lazy loading con Intersection Observer
 * - Soporte para WebM con fallback a MP4
 * - Poster mientras carga
 * - Responsive: carga versión móvil en pantallas pequeñas
 */
export default function OptimizedVideo({
  src,
  poster,
  className = '',
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  preload = 'none',
  priority = false,
}: OptimizedVideoProps) {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generar URLs para diferentes formatos
  const getVideoSources = () => {
    const baseName = src.replace(/\.(mp4|webm)$/i, '');
    const optimizedPath = baseName.includes('/optimized/')
      ? baseName
      : baseName.replace('/videos/', '/videos/optimized/');

    if (isMobile) {
      return {
        webm: `${optimizedPath}-mobile.webm`,
        mp4: `${optimizedPath}-mobile.mp4`,
        fallback: src,
      };
    }

    return {
      webm: `${optimizedPath}-optimized.webm`,
      mp4: `${optimizedPath}-optimized.mp4`,
      fallback: src,
    };
  };

  // Generar poster URL
  const getPosterUrl = () => {
    if (poster) return poster;
    const baseName = src.replace(/\.(mp4|webm)$/i, '');
    const optimizedPath = baseName.includes('/optimized/')
      ? baseName
      : baseName.replace('/videos/', '/videos/optimized/');
    return `${optimizedPath}-poster.webp`;
  };

  const sources = getVideoSources();
  const posterUrl = getPosterUrl();

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLSourceElement>) => {
    // Si falla WebM, el navegador intentará MP4
    // Si falla MP4 optimizado, usar el fallback
    const target = e.target as HTMLSourceElement;
    if (target.src.includes('-optimized') || target.src.includes('-mobile')) {
      // Intentar con el archivo original
      if (videoRef.current) {
        videoRef.current.src = sources.fallback;
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Poster como placeholder */}
      {!isLoaded && posterUrl && (
        <img
          src={posterUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {isInView && (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          preload={preload}
          poster={posterUrl}
          onLoadedData={handleLoadedData}
        >
          {/* WebM primero (mejor compresión) */}
          <source src={sources.webm} type="video/webm" onError={handleError} />
          {/* MP4 como fallback (mejor compatibilidad) */}
          <source src={sources.mp4} type="video/mp4" onError={handleError} />
          {/* Fallback final */}
          Tu navegador no soporta video HTML5.
        </video>
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * Componente de video de fondo (hero)
 */
export function BackgroundVideo({
  src,
  poster,
  className = '',
  overlayClassName = 'bg-black/40',
  children,
}: {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <OptimizedVideo
        src={src}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        priority
      />
      {overlayClassName && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
