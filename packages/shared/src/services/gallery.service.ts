/**
 * Gallery Service
 * Lista y gestiona imágenes de los buckets de Supabase Storage
 */

import { supabase } from '../lib/supabase'

export interface GalleryImage {
  id: string
  name: string
  url: string
  path: string
  bucket: string
  size: number
  type: string
  created_at: string
  updated_at: string
}

export interface GalleryCategory {
  id: number
  slug: string
  name: string
  cover_image_url: string | null
}

export interface GalleryProject {
  id: number
  slug: string
  name: string
  category_id: number
  category_slug: string
  image_urls: string[]
}

export interface GalleryFilters {
  search?: string
  bucket?: string
  categoryId?: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

// Buckets disponibles
const BUCKETS = ['categories', 'projects', 'media'] as const
type BucketName = typeof BUCKETS[number]

// Cache para evitar múltiples llamadas a la BD
let categoriesCache: GalleryCategory[] | null = null
let projectsCache: GalleryProject[] | null = null
let allImagesCache: GalleryImage[] | null = null
let imagesCacheTimestamp = 0
let cacheTimestamp = 0
const CACHE_TTL = 30000 // 30 segundos
const IMAGES_CACHE_TTL = 60000 // 1 minuto para imágenes

export const galleryService = {
  /**
   * Limpia el cache
   */
  clearCache() {
    categoriesCache = null
    projectsCache = null
    cacheTimestamp = 0
  },
  /**
   * Lista todas las imágenes de un bucket específico
   * Optimizado: procesa subcarpetas en paralelo
   */
  async listBucketImages(bucket: BucketName, folder: string = ''): Promise<GalleryImage[]> {
    try {
      const logPrefix = folder ? `${bucket}/${folder}` : bucket
      console.log(`[Gallery] Listando: ${logPrefix}`)
      
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        console.error(`[Gallery] Error listing ${logPrefix}:`, error)
        return []
      }

      if (!files || files.length === 0) {
        return []
      }

      const images: GalleryImage[] = []
      const subfolders: string[] = []

      // Separar archivos de carpetas
      for (const file of files) {
        if (!file.id) {
          // Es una carpeta
          subfolders.push(folder ? `${folder}/${file.name}` : file.name)
          continue
        }

        // Solo incluir archivos de imagen
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
        if (!isImage) continue

        const path = folder ? `${folder}/${file.name}` : file.name
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(path)

        images.push({
          id: file.id || `${bucket}-${path}`,
          name: file.name,
          url: publicUrl,
          path,
          bucket,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'image/jpeg',
          created_at: file.created_at || new Date().toISOString(),
          updated_at: file.updated_at || file.created_at || new Date().toISOString()
        })
      }

      // Procesar subcarpetas en paralelo (batches de 10 para no saturar)
      if (subfolders.length > 0) {
        console.log(`[Gallery] Procesando ${subfolders.length} subcarpetas en paralelo...`)
        const BATCH_SIZE = 10
        for (let i = 0; i < subfolders.length; i += BATCH_SIZE) {
          const batch = subfolders.slice(i, i + BATCH_SIZE)
          const results = await Promise.all(
            batch.map(subfolder => this.listBucketImages(bucket, subfolder))
          )
          results.forEach(subImages => images.push(...subImages))
        }
      }

      if (!folder) {
        console.log(`[Gallery] Total imágenes en ${bucket}: ${images.length}`)
      }
      return images
    } catch (error) {
      console.error(`[Gallery] Error in listBucketImages (${bucket}):`, error)
      return []
    }
  },

  /**
   * Lista todas las imágenes de todos los buckets
   * Si no hay archivos en storage, intenta obtener URLs de la base de datos
   * Optimizado: procesa buckets en paralelo
   */
  async listAllImages(): Promise<GalleryImage[]> {
    console.log('[Gallery] Iniciando carga de todas las imágenes...')
    
    // Cargar todos los buckets en paralelo
    const startTime = Date.now()
    const results = await Promise.all(
      BUCKETS.map(async bucket => {
        try {
          return await this.listBucketImages(bucket)
        } catch (error) {
          console.error(`[Gallery] Error cargando bucket ${bucket}:`, error)
          return []
        }
      })
    )
    
    const allImages = results.flat()
    console.log(`[Gallery] Buckets cargados en ${Date.now() - startTime}ms`)

    // Si no hay imágenes en storage, obtener URLs de la base de datos
    if (allImages.length === 0) {
      console.log('[Gallery] No hay imágenes en storage, obteniendo de base de datos...')
      
      // Obtener imágenes de categorías
      const categories = await this.getCategories()
      categories.forEach((cat) => {
        if (cat.cover_image_url) {
          allImages.push({
            id: `cat-${cat.id}`,
            name: `${cat.slug}.jpg`,
            url: cat.cover_image_url,
            path: cat.slug,
            bucket: 'categories',
            size: 0,
            type: 'image/jpeg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }
      })

      // Obtener imágenes de proyectos
      const projects = await this.getProjects()
      projects.forEach((proj) => {
        proj.image_urls.forEach((url, imgIndex) => {
          allImages.push({
            id: `proj-${proj.id}-${imgIndex}`,
            name: `${proj.slug}-${imgIndex}.jpg`,
            url: url,
            path: `${proj.slug}/${imgIndex}`,
            bucket: 'projects',
            size: 0,
            type: 'image/jpeg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        })
      })
    }

    // Ordenar por fecha de creación descendente
    allImages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    console.log(`[Gallery] Total de imágenes cargadas: ${allImages.length}`)
    return allImages
  },

  /**
   * Obtiene todas las categorías con sus traducciones (con cache)
   */
  async getCategories(): Promise<GalleryCategory[]> {
    // Usar cache si está disponible y no ha expirado
    const now = Date.now()
    if (categoriesCache && (now - cacheTimestamp) < CACHE_TTL) {
      return categoriesCache
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, slug, cover_image_url')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.error('Error fetching categories:', error)
      return categoriesCache || []
    }

    if (!categories || categories.length === 0) {
      return []
    }

    // Obtener traducciones para los nombres
    const categoryIds = categories.map(c => c.id)
    const { data: translations } = await supabase
      .from('translations')
      .select('entity_id, field_name, value')
      .eq('entity_type', 'category')
      .eq('field_name', 'name')
      .eq('language_code', 'es')
      .in('entity_id', categoryIds)

    const translationMap = new Map<number, string>()
    translations?.forEach(t => {
      translationMap.set(t.entity_id, t.value)
    })

    const result = categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: translationMap.get(cat.id) || cat.slug,
      cover_image_url: cat.cover_image_url
    }))

    // Guardar en cache
    categoriesCache = result
    cacheTimestamp = now

    return result
  },

  /**
   * Obtiene todos los proyectos con sus imágenes (con cache)
   */
  async getProjects(): Promise<GalleryProject[]> {
    // Usar cache si está disponible y no ha expirado
    const now = Date.now()
    if (projectsCache && (now - cacheTimestamp) < CACHE_TTL) {
      return projectsCache
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id, 
        slug, 
        category_id,
        image_urls,
        categories!inner(slug)
      `)
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.error('Error fetching projects:', error)
      return projectsCache || []
    }

    if (!projects || projects.length === 0) {
      return []
    }

    // Obtener traducciones para los nombres
    const projectIds = projects.map(p => p.id)
    const { data: translations } = await supabase
      .from('translations')
      .select('entity_id, field_name, value')
      .eq('entity_type', 'project')
      .eq('field_name', 'name')
      .eq('language_code', 'es')
      .in('entity_id', projectIds)

    const translationMap = new Map<number, string>()
    translations?.forEach(t => {
      translationMap.set(t.entity_id, t.value)
    })

    const result = projects.map(proj => ({
      id: proj.id,
      slug: proj.slug,
      name: translationMap.get(proj.id) || proj.slug,
      category_id: proj.category_id,
      category_slug: (proj.categories as any)?.slug || '',
      image_urls: proj.image_urls || []
    }))

    // Guardar en cache
    projectsCache = result
    cacheTimestamp = now

    return result
  },

  /**
   * Encuentra dónde se usa una imagen (en categorías o proyectos)
   * Versión optimizada que usa cache
   */
  async findImageUsage(imageUrl: string): Promise<{ type: 'category' | 'project'; id: number; name: string }[]> {
    const usages: { type: 'category' | 'project'; id: number; name: string }[] = []

    // Buscar en categorías (usa cache interno)
    const categories = await this.getCategories()
    categories.forEach(cat => {
      if (cat.cover_image_url === imageUrl) {
        usages.push({ type: 'category', id: cat.id, name: cat.name })
      }
    })

    // Buscar en proyectos (usa cache interno)
    const projects = await this.getProjects()
    projects.forEach(proj => {
      if (proj.image_urls.includes(imageUrl)) {
        usages.push({ type: 'project', id: proj.id, name: proj.name })
      }
    })

    return usages
  },

  /**
   * Calcula el uso de todas las imágenes en una sola operación
   * Mucho más eficiente que llamar findImageUsage para cada imagen
   */
  async calculateAllImageUsage(imageUrls: string[]): Promise<Record<string, number>> {
    const usageMap: Record<string, number> = {}
    
    // Inicializar todas con 0
    imageUrls.forEach(url => {
      usageMap[url] = 0
    })

    // Obtener datos una sola vez
    const [categories, projects] = await Promise.all([
      this.getCategories(),
      this.getProjects()
    ])

    // Contar uso en categorías
    categories.forEach(cat => {
      if (cat.cover_image_url && usageMap[cat.cover_image_url] !== undefined) {
        usageMap[cat.cover_image_url]++
      }
    })

    // Contar uso en proyectos
    projects.forEach(proj => {
      proj.image_urls.forEach(url => {
        if (usageMap[url] !== undefined) {
          usageMap[url]++
        }
      })
    })

    return usageMap
  },

  /**
   * Elimina una imagen del storage
   */
  async deleteImage(bucket: BucketName, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error('Error deleting image:', error)
        return false
      }

      // Invalidar cache de imágenes
      allImagesCache = null
      imagesCacheTimestamp = 0

      return true
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  },

  /**
   * Lista imágenes con paginación backend y filtros
   */
  async listImagesPaginated(
    page: number = 1,
    pageSize: number = 20,
    filters: GalleryFilters = {}
  ): Promise<PaginatedResult<GalleryImage>> {
    const now = Date.now()

    // Usar cache si está disponible y no ha expirado
    if (!allImagesCache || (now - imagesCacheTimestamp) > IMAGES_CACHE_TTL) {
      console.log('[Gallery] Recargando cache de imágenes...')
      allImagesCache = await this.listAllImages()
      imagesCacheTimestamp = now
    }

    // Aplicar filtros
    let filteredImages = [...allImagesCache]

    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase()
      filteredImages = filteredImages.filter(img =>
        img.name.toLowerCase().includes(searchLower) ||
        img.path.toLowerCase().includes(searchLower)
      )
    }

    if (filters.bucket && filters.bucket !== 'all') {
      filteredImages = filteredImages.filter(img => img.bucket === filters.bucket)
    }

    if (filters.categoryId) {
      const categories = await this.getCategories()
      const category = categories.find(c => c.id === filters.categoryId)
      if (category) {
        filteredImages = filteredImages.filter(img =>
          img.bucket === 'projects' && img.path.includes(category.slug)
        )
      }
    }

    // Calcular paginación
    const total = filteredImages.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredImages.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }
  },

  /**
   * Invalida el cache de imágenes (útil después de subir nuevas)
   */
  invalidateImagesCache() {
    allImagesCache = null
    imagesCacheTimestamp = 0
  }
}
