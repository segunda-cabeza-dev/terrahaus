import { supabase } from '../lib/supabase'
import imageCompression from 'browser-image-compression'

const BUCKET_NAME = 'media'

export interface UploadResult {
  url: string
  path: string
  error?: string
  sizes?: {
    thumbnail: string
    medium: string
    large: string
    original: string
  }
}

/**
 * Redimensiona y comprime una imagen a un tamaño específico
 */
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  const options = {
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Error resizing image:', error)
    return file
  }
}

export const mediaService = {
  /**
   * Sube un archivo al bucket de Supabase Storage
   * Genera automáticamente 3 tamaños: thumbnail (200px), medium (800px), large (1920px)
   * @param file - Archivo a subir
   * @param folder - Carpeta opcional dentro del bucket
   * @returns URLs de todos los tamaños generados
   */
  async uploadFile(file: File, folder: string = 'images'): Promise<UploadResult> {
    try {
      // Generar nombre base único con timestamp
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const baseName = `${timestamp}-${Math.random().toString(36).substring(7)}`

      const sizes = {
        thumbnail: '',
        medium: '',
        large: '',
        original: ''
      }

      // 1. Thumbnail (200x200)
      const thumbnailFile = await resizeImage(file, 200, 200)
      const thumbnailPath = `${folder}/${baseName}-thumb.${fileExt}`
      const { data: thumbData, error: thumbError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(thumbnailPath, thumbnailFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (!thumbError && thumbData) {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(thumbData.path)
        sizes.thumbnail = publicUrl
      }

      // 2. Medium (800x800)
      const mediumFile = await resizeImage(file, 800, 800)
      const mediumPath = `${folder}/${baseName}-medium.${fileExt}`
      const { data: mediumData, error: mediumError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(mediumPath, mediumFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (!mediumError && mediumData) {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(mediumData.path)
        sizes.medium = publicUrl
      }

      // 3. Large (1920x1920)
      const largeFile = await resizeImage(file, 1920, 1920)
      const largePath = `${folder}/${baseName}-large.${fileExt}`
      const { data: largeData, error: largeError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(largePath, largeFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (!largeError && largeData) {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(largeData.path)
        sizes.large = publicUrl
      }

      // 4. Original comprimido (máximo 2MB)
      const originalCompressed = await imageCompression(file, {
        maxSizeMB: 2,
        useWebWorker: true,
      })
      const originalPath = `${folder}/${baseName}.${fileExt}`
      const { data: originalData, error: originalError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(originalPath, originalCompressed, {
          cacheControl: '3600',
          upsert: false
        })

      if (originalError) {
        console.error('Error uploading original:', originalError)
        return { url: '', path: '', error: originalError.message }
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(originalData.path)

      sizes.original = publicUrl

      return {
        url: sizes.medium, // Por defecto usamos el medium
        path: originalData.path,
        sizes
      }
    } catch (error) {
      console.error('Upload error:', error)
      return {
        url: '',
        path: '',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  },

  /**
   * Elimina un archivo del bucket de Supabase Storage
   * @param path - Path del archivo en el bucket (obtenido del uploadFile)
   * @returns true si se eliminó correctamente
   */
  async deleteFile(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path])

      if (error) {
        console.error('Error deleting file:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  },

  /**
   * Obtiene la URL pública de un archivo
   * @param path - Path del archivo en el bucket
   * @returns URL pública del archivo
   */
  getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path)

    return publicUrl
  },

  /**
   * Elimina un archivo por su URL
   * @param url - URL del archivo
   * @returns true si se eliminó correctamente
   */
  async deleteFileByUrl(url: string): Promise<boolean> {
    try {
      // Extraer el path de la URL
      // Formato esperado: https://api.segundacabeza.net/storage/v1/object/public/media/images/filename.jpg
      const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`)
      if (urlParts.length !== 2) {
        console.error('Invalid URL format')
        return false
      }

      const path = urlParts[1]
      return await this.deleteFile(path)
    } catch (error) {
      console.error('Delete by URL error:', error)
      return false
    }
  }
}
