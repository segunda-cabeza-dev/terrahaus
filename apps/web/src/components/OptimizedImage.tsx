import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // Para imágenes above the fold
  sizes?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Componente de imagen optimizada con:
 * - Lazy loading nativo
 * - Soporte para WebP con fallback
 * - Blur placeholder mientras carga
 * - Intersection Observer para carga diferida
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  style,
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Convertir extensión a webp si es jpg/png
  const getWebPSrc = (originalSrc: string): string => {
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);
  const isWebPAvailable = webpSrc !== src;

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
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const commonStyles: React.CSSProperties = {
    ...style,
    transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.5,
    filter: isLoaded ? 'none' : 'blur(10px)',
  };

  return (
    <picture ref={imgRef as any}>
      {isInView && isWebPAvailable && (
        <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      )}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        data-src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onClick={onClick}
        style={commonStyles}
      />
    </picture>
  );
}

/**
 * Componente de imagen de fondo optimizada
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  className = '',
  children,
  priority = false,
  overlayClassName = '',
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
  overlayClassName?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  const getWebPSrc = (originalSrc: string): string => {
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    
    // Intentar cargar WebP primero
    const testWebP = new Image();
    testWebP.onload = () => {
      img.src = webpSrc;
    };
    testWebP.onerror = () => {
      img.src = src;
    };
    testWebP.src = webpSrc;
  }, [isInView, src, webpSrc]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {isInView && (
        <img
          src={webpSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          onError={(e) => {
            // Fallback to original format
            (e.target as HTMLImageElement).src = src;
          }}
        />
      )}
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
