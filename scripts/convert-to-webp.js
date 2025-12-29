#!/usr/bin/env node

/**
 * Script para convertir imágenes JPG/PNG a WebP
 * 
 * Uso:
 *   node scripts/convert-to-webp.js
 * 
 * Requisitos:
 *   npm install sharp
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const ASSETS_DIR = './apps/web/public/assets/images';
const QUALITY = 80; // Calidad WebP (0-100)

async function getImageFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await getImageFiles(fullPath);
        files.push(...subFiles);
      } else {
        const ext = extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    console.log(`Directorio no encontrado: ${dir}`);
  }
  
  return files;
}

async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    const inputStats = await stat(inputPath);
    
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    
    const outputStats = await stat(outputPath);
    
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)} (${savings}% menor)`);
    
    return {
      input: inputPath,
      output: outputPath,
      inputSize: inputStats.size,
      outputSize: outputStats.size,
    };
  } catch (err) {
    console.error(`✗ Error convirtiendo ${inputPath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Convirtiendo imágenes a WebP...\n');
  
  const imageFiles = await getImageFiles(ASSETS_DIR);
  
  if (imageFiles.length === 0) {
    console.log('No se encontraron imágenes para convertir.');
    console.log(`Asegúrate de que existan imágenes en: ${ASSETS_DIR}`);
    return;
  }
  
  console.log(`Encontradas ${imageFiles.length} imágenes\n`);
  
  const results = [];
  
  for (const file of imageFiles) {
    const result = await convertToWebP(file);
    if (result) results.push(result);
  }
  
  // Resumen
  console.log('\n📊 Resumen:');
  console.log(`   Convertidas: ${results.length}/${imageFiles.length}`);
  
  const totalInputSize = results.reduce((acc, r) => acc + r.inputSize, 0);
  const totalOutputSize = results.reduce((acc, r) => acc + r.outputSize, 0);
  const totalSavings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);
  
  console.log(`   Tamaño original: ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Tamaño WebP: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Ahorro total: ${totalSavings}%`);
}

main().catch(console.error);
