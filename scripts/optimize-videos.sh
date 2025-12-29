#!/bin/bash

# Script para optimizar videos para web
# Requiere FFmpeg instalado: brew install ffmpeg

VIDEO_DIR="./apps/web/public/assets/videos"
OUTPUT_DIR="./apps/web/public/assets/videos/optimized"

# Crear directorio de salida
mkdir -p "$OUTPUT_DIR"

echo "🎬 Optimizando videos para web..."
echo ""

# Función para convertir video
convert_video() {
    local input="$1"
    local filename=$(basename "$input" .mp4)
    
    echo "📹 Procesando: $filename"
    
    # MP4 optimizado (H.264, buena compatibilidad)
    echo "   → Creando MP4 optimizado..."
    ffmpeg -i "$input" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -vf "scale=1920:-2" \
        -y \
        "$OUTPUT_DIR/${filename}-optimized.mp4" \
        2>/dev/null
    
    # WebM (VP9, mejor compresión, no todos los navegadores)
    echo "   → Creando WebM..."
    ffmpeg -i "$input" \
        -c:v libvpx-vp9 \
        -crf 35 \
        -b:v 0 \
        -c:a libopus \
        -b:a 96k \
        -vf "scale=1920:-2" \
        -y \
        "$OUTPUT_DIR/${filename}-optimized.webm" \
        2>/dev/null
    
    # Versión móvil (720p)
    echo "   → Creando versión móvil (720p)..."
    ffmpeg -i "$input" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -c:a aac \
        -b:a 96k \
        -movflags +faststart \
        -vf "scale=1280:-2" \
        -y \
        "$OUTPUT_DIR/${filename}-mobile.mp4" \
        2>/dev/null
    
    # Poster/thumbnail
    echo "   → Creando poster..."
    ffmpeg -i "$input" \
        -ss 00:00:02 \
        -vframes 1 \
        -vf "scale=1920:-2" \
        -y \
        "$OUTPUT_DIR/${filename}-poster.jpg" \
        2>/dev/null
    
    # Convertir poster a WebP
    ffmpeg -i "$OUTPUT_DIR/${filename}-poster.jpg" \
        -y \
        "$OUTPUT_DIR/${filename}-poster.webp" \
        2>/dev/null
    
    echo "   ✓ Completado"
    echo ""
}

# Verificar si FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg no está instalado."
    echo ""
    echo "Instálalo con:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Ubuntu:  sudo apt install ffmpeg"
    echo "  Windows: choco install ffmpeg"
    exit 1
fi

# Procesar todos los videos MP4
for video in "$VIDEO_DIR"/*.mp4; do
    if [ -f "$video" ]; then
        convert_video "$video"
    fi
done

# Mostrar resultados
echo "📊 Resultados:"
echo ""
echo "Archivos originales:"
ls -lh "$VIDEO_DIR"/*.mp4 2>/dev/null | awk '{print "   " $9 ": " $5}'
echo ""
echo "Archivos optimizados:"
ls -lh "$OUTPUT_DIR"/* 2>/dev/null | awk '{print "   " $9 ": " $5}'
echo ""
echo "✅ Optimización completada!"
echo ""
echo "Usa los archivos de '$OUTPUT_DIR' en tu web."
