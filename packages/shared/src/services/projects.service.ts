import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ProjectCategory {
  id: number
  slug: string
  name: string
  description: string
  cover_image_url: string | null
  display_order: number
  is_active: boolean
  project_count?: number
}

export interface ProjectItem {
  id: number
  slug: string
  name: string
  description: string
  category_id: number
  category_slug: string
  category_name: string
  image_urls: string[]
  display_order: number
  is_active: boolean
}

// ==========================================
// UTILIDADES
// ==========================================
/**
 * Función de debounce para evitar múltiples ejecuciones en rápida sucesión
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }
    
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// ==========================================
// SISTEMA DE DATOS EN TIEMPO REAL
// ==========================================
// Caché mínimo (2 segundos) solo para evitar requests duplicados
// Realtime invalida el caché instantáneamente cuando hay cambios
// Comportamiento WordPress: desactivar proyecto = ocultar al instante

const CACHE_TTL = 2 * 1000 // 2 segundos - solo anti-duplicados
const STORAGE_KEY_PREFIX = 'beltrame_projects_'
const CACHE_VERSION = 'v3' // Incrementado para limpiar cachés antiguos

interface CacheEntry<T> {
  data: T
  timestamp: number
  version: string
}

// Cache en memoria (más rápido, se pierde al recargar)
const memoryCache = {
  categories: new Map<string, CacheEntry<ProjectCategory[]>>(),
  projects: new Map<string, CacheEntry<ProjectItem[]>>(),
  projectDetail: new Map<string, CacheEntry<ProjectItem>>()
}

// Helpers para localStorage con versionado
const getFromStorage = <T>(key: string): CacheEntry<T> | null => {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key)
    if (item) {
      const parsed = JSON.parse(item) as CacheEntry<T>
      // Validar versión del caché
      if (parsed.version === CACHE_VERSION) {
        return parsed
      }
      // Caché antiguo, eliminarlo
      localStorage.removeItem(STORAGE_KEY_PREFIX + key)
    }
  } catch {
    // localStorage no disponible o error de parsing
  }
  return null
}

const setToStorage = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(entry))
  } catch {
    // localStorage no disponible o quota exceeded
  }
}

// Validar si un caché es válido (sin type guard estricto para evitar problemas de inferencia)
const isCacheValid = <T>(entry: CacheEntry<T> | null | undefined): boolean => {
  if (!entry) return false
  if (entry.version !== CACHE_VERSION) return false
  const now = Date.now()
  return (now - entry.timestamp) < CACHE_TTL
}

// ==========================================
// SUPABASE REALTIME - Invalidación automática
// ==========================================
let realtimeChannel: RealtimeChannel | null = null
let isRealtimeInitialized = false

/**
 * Versión debounced de clearCache para evitar múltiples limpiezas
 * Espera 1000ms después del último cambio antes de limpiar el caché
 */
const debouncedClearCache = debounce(() => {
  projectsService.clearCache()
}, 1000)

/**
 * Inicializa las suscripciones de Realtime para invalidar caché automáticamente
 */
const initializeRealtime = () => {
  if (isRealtimeInitialized) return
  
  try {
    // Crear un canal para escuchar cambios en projects y categories
    realtimeChannel = supabase
      .channel('projects_cache_invalidation')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('🔄 Cambio detectado en projects:', payload.eventType)
          debouncedClearCache()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('🔄 Cambio detectado en categories:', payload.eventType)
          debouncedClearCache()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations'
        },
        (payload) => {
          console.log('🔄 Cambio detectado en translations:', payload.eventType)
          debouncedClearCache()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime activo - Caché se actualizará automáticamente')
          isRealtimeInitialized = true
        }
      })
  } catch (error) {
    console.warn('⚠️ No se pudo inicializar Realtime:', error)
  }
}

// Inicializar Realtime automáticamente cuando se importa el módulo
if (typeof window !== 'undefined') {
  // Solo en el navegador
  setTimeout(initializeRealtime, 1000) // Pequeño delay para evitar problemas de inicialización
}

export const projectsService = {
  /**
   * Obtiene todas las categorías activas con sus traducciones
   * Sistema de caché unificado: memoria + localStorage con validación
   */
  async getCategories(lang: string = 'es'): Promise<ProjectCategory[]> {
    const cacheKey = `categories_${lang}`
    
    // 1. Revisar caché en memoria (más rápido)
    const memCache = memoryCache.categories.get(cacheKey)
    if (memCache && isCacheValid(memCache)) {
      return memCache.data
    }

    // 2. Revisar localStorage como fallback
    const storageCache = getFromStorage<ProjectCategory[]>(cacheKey)
    if (storageCache && isCacheValid(storageCache)) {
      // Guardar en memoria para próximas llamadas
      memoryCache.categories.set(cacheKey, storageCache)
      return storageCache.data
    }

    // 3. Fetch desde Supabase (datos no en caché o expirados)
    const fetchFreshData = async (): Promise<ProjectCategory[]> => {
      const [categoriesResult, projectCountsResult] = await Promise.all([
        supabase
          .from('categories')
          .select('id, slug, cover_image_url, display_order, is_active')
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('projects')
          .select('category_id')
          .eq('is_active', true)
      ])

      if (categoriesResult.error || !categoriesResult.data || categoriesResult.data.length === 0) {
        console.error('Error fetching categories:', categoriesResult.error)
        // Devolver datos viejos si existen
        return []
      }

      const categories = categoriesResult.data
      const categoryIds = categories.map(c => c.id)

      // Obtener traducciones
      const { data: translations } = await supabase
        .from('translations')
        .select('entity_id, field_name, value')
        .eq('entity_type', 'category')
        .eq('language_code', lang)
        .in('entity_id', categoryIds)
        .in('field_name', ['name', 'description'])

      // Contar proyectos por categoría
      const countMap = new Map<number, number>()
      projectCountsResult.data?.forEach(p => {
        countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1)
      })

      // Mapear traducciones
      const translationsMap = new Map<string, string>()
      translations?.forEach(t => {
        translationsMap.set(`${t.entity_id}-${t.field_name}`, t.value)
      })

      const result: ProjectCategory[] = categories.map(cat => ({
        id: cat.id,
        slug: cat.slug,
        name: translationsMap.get(`${cat.id}-name`) || cat.slug,
        description: translationsMap.get(`${cat.id}-description`) || '',
        cover_image_url: cat.cover_image_url,
        display_order: cat.display_order,
        is_active: cat.is_active,
        project_count: countMap.get(cat.id) || 0
      }))

      // Guardar en ambos cachés con timestamp actual
      const entry: CacheEntry<ProjectCategory[]> = {
        data: result,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }
      memoryCache.categories.set(cacheKey, entry)
      setToStorage(cacheKey, result)
      
      return result
    }

    // Si hay datos viejos en storage (aunque expirados), devolverlos mientras se refresca
    // esto asegura que el usuario vea algo inmediatamente
    if (storageCache && storageCache.data && storageCache.data.length > 0) {
      // Stale-while-revalidate: devolver datos viejos y actualizar en background
      memoryCache.categories.set(cacheKey, storageCache)
      fetchFreshData().catch(console.error)
      return storageCache.data
    }

    // No hay datos cacheados, esperar el fetch
    return fetchFreshData()
  },

  /**
   * Obtiene los proyectos de una categoría por slug
   * Sistema de caché unificado
   */
  async getProjectsByCategory(categorySlug: string, lang: string = 'es'): Promise<ProjectItem[]> {
    const cacheKey = `projects_${categorySlug}_${lang}`
    
    // 1. Revisar caché en memoria
    const memCache = memoryCache.projects.get(cacheKey)
    if (memCache && isCacheValid(memCache)) {
      return memCache.data
    }

    // 2. Revisar localStorage
    const storageCache = getFromStorage<ProjectItem[]>(cacheKey)
    if (storageCache && isCacheValid(storageCache)) {
      memoryCache.projects.set(cacheKey, storageCache)
      return storageCache.data
    }

    // 3. Fetch desde Supabase
    const fetchFreshData = async (): Promise<ProjectItem[]> => {
      // Primero obtener la categoría
      const { data: category } = await supabase
        .from('categories')
        .select('id, slug')
        .eq('slug', categorySlug)
        .single()

      if (!category) {
        return []
      }

      // Obtener proyectos y traducción de categoría en paralelo
      const [projectsResult, catTranslationsResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id, slug, category_id, image_urls, display_order, is_active')
          .eq('category_id', category.id)
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('translations')
          .select('field_name, value')
          .eq('entity_type', 'category')
          .eq('entity_id', category.id)
          .eq('language_code', lang)
          .eq('field_name', 'name')
      ])

      const categoryName = catTranslationsResult.data?.[0]?.value || categorySlug

      if (projectsResult.error || !projectsResult.data || projectsResult.data.length === 0) {
        return []
      }

      const projects = projectsResult.data

      // Obtener traducciones de proyectos
      const projectIds = projects.map(p => p.id)
      const { data: translations } = await supabase
        .from('translations')
        .select('entity_id, field_name, value')
        .eq('entity_type', 'project')
        .eq('language_code', lang)
        .in('entity_id', projectIds)
        .in('field_name', ['name', 'description'])

      const translationsMap = new Map<string, string>()
      translations?.forEach(t => {
        translationsMap.set(`${t.entity_id}-${t.field_name}`, t.value)
      })

      const result: ProjectItem[] = projects.map(proj => ({
        id: proj.id,
        slug: proj.slug,
        name: translationsMap.get(`${proj.id}-name`) || proj.slug,
        description: translationsMap.get(`${proj.id}-description`) || '',
        category_id: proj.category_id,
        category_slug: categorySlug,
        category_name: categoryName,
        image_urls: proj.image_urls || [],
        display_order: proj.display_order,
        is_active: proj.is_active
      }))

      // Guardar en ambos cachés
      const entry: CacheEntry<ProjectItem[]> = {
        data: result,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }
      memoryCache.projects.set(cacheKey, entry)
      setToStorage(cacheKey, result)

      return result
    }

    // Stale-while-revalidate: si hay datos viejos, devolverlos y actualizar
    if (storageCache && storageCache.data) {
      memoryCache.projects.set(cacheKey, storageCache)
      fetchFreshData().catch(console.error)
      return storageCache.data
    }

    return fetchFreshData()
  },

  /**
   * Obtiene un proyecto por slug con cache
   * Sistema de caché unificado
   */
  async getProject(projectSlug: string, lang: string = 'es'): Promise<ProjectItem | null> {
    const cacheKey = `project_${projectSlug}_${lang}`
    
    // 1. Revisar caché en memoria
    const memCache = memoryCache.projectDetail.get(cacheKey)
    if (memCache && isCacheValid(memCache)) {
      return memCache.data
    }

    // 2. Revisar localStorage
    const storageCache = getFromStorage<ProjectItem>(cacheKey)
    if (storageCache && isCacheValid(storageCache)) {
      memoryCache.projectDetail.set(cacheKey, storageCache)
      return storageCache.data
    }

    // 3. Fetch desde Supabase
    const fetchFreshData = async (): Promise<ProjectItem | null> => {
      // Obtener proyecto con categoría en una sola query
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          id, slug, category_id, image_urls, display_order, is_active,
          categories!inner(slug)
        `)
        .eq('slug', projectSlug)
        .eq('is_active', true)
        .single()

      if (error || !project) {
        return null
      }

      const categorySlug = (project.categories as unknown as { slug: string }).slug

      // Obtener traducciones del proyecto y categoría en paralelo
      const [projectTranslations, catTranslation] = await Promise.all([
        supabase
          .from('translations')
          .select('field_name, value')
          .eq('entity_type', 'project')
          .eq('entity_id', project.id)
          .eq('language_code', lang)
          .in('field_name', ['name', 'description']),
        supabase
          .from('translations')
          .select('value')
          .eq('entity_type', 'category')
          .eq('entity_id', project.category_id)
          .eq('language_code', lang)
          .eq('field_name', 'name')
          .single()
      ])

      const translationsMap = new Map<string, string>()
      projectTranslations.data?.forEach(t => {
        translationsMap.set(t.field_name, t.value)
      })

      const result: ProjectItem = {
        id: project.id,
        slug: project.slug,
        name: translationsMap.get('name') || project.slug,
        description: translationsMap.get('description') || '',
        category_id: project.category_id,
        category_slug: categorySlug,
        category_name: catTranslation.data?.value || categorySlug,
        image_urls: project.image_urls || [],
        display_order: project.display_order,
        is_active: project.is_active
      }

      // Guardar en ambos cachés
      const entry: CacheEntry<ProjectItem> = {
        data: result,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }
      memoryCache.projectDetail.set(cacheKey, entry)
      setToStorage(cacheKey, result)

      return result
    }

    // Stale-while-revalidate
    if (storageCache && storageCache.data) {
      memoryCache.projectDetail.set(cacheKey, storageCache)
      fetchFreshData().catch(console.error)
      return storageCache.data
    }

    return fetchFreshData()
  },

  /**
   * Busca proyectos y categorías
   */
  async search(query: string, lang: string = 'es'): Promise<{ categories: ProjectCategory[], projects: ProjectItem[] }> {
    if (!query || query.length < 2) {
      return { categories: [], projects: [] }
    }

    const normalizedQuery = query.toLowerCase()

    // Buscar en traducciones
    const { data: translationMatches } = await supabase
      .from('translations')
      .select('entity_type, entity_id, value')
      .eq('language_code', lang)
      .eq('field_name', 'name')
      .ilike('value', `%${normalizedQuery}%`)

    const categoryIds = new Set<number>()
    const projectIds = new Set<number>()

    translationMatches?.forEach(t => {
      if (t.entity_type === 'category') categoryIds.add(t.entity_id)
      if (t.entity_type === 'project') projectIds.add(t.entity_id)
    })

    // Obtener categorías
    let categories: ProjectCategory[] = []
    if (categoryIds.size > 0) {
      const allCategories = await this.getCategories(lang)
      categories = allCategories.filter(c => categoryIds.has(c.id))
    }

    // Obtener proyectos
    let projects: ProjectItem[] = []
    if (projectIds.size > 0) {
      const { data: projectData } = await supabase
        .from('projects')
        .select(`
          id, slug, category_id, image_urls, display_order, is_active,
          categories!inner(slug)
        `)
        .in('id', Array.from(projectIds))
        .eq('is_active', true)
        .limit(10)

      if (projectData) {
        const { data: projTranslations } = await supabase
          .from('translations')
          .select('entity_id, field_name, value')
          .eq('entity_type', 'project')
          .eq('language_code', lang)
          .in('entity_id', projectData.map(p => p.id))
          .in('field_name', ['name', 'description'])

        const translationsMap = new Map<string, string>()
        projTranslations?.forEach(t => {
          translationsMap.set(`${t.entity_id}-${t.field_name}`, t.value)
        })

        projects = projectData.map(proj => ({
          id: proj.id,
          slug: proj.slug,
          name: translationsMap.get(`${proj.id}-name`) || proj.slug,
          description: translationsMap.get(`${proj.id}-description`) || '',
          category_id: proj.category_id,
          category_slug: (proj.categories as unknown as { slug: string }).slug,
          category_name: '',
          image_urls: proj.image_urls || [],
          display_order: proj.display_order,
          is_active: proj.is_active
        }))
      }
    }

    return { categories, projects }
  },

  /**
   * Obtiene los proyectos más recientes
   */
  async getRecentProjects(lang: string = 'es', limit: number = 6): Promise<ProjectItem[]> {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id, slug, category_id, image_urls, display_order, is_active, created_at,
        categories!inner(slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !projects || projects.length === 0) {
      console.error('Error fetching recent projects:', error)
      return []
    }

    // Obtener IDs únicos de categorías
    const categoryIds = [...new Set(projects.map(p => p.category_id))]

    // Obtener traducciones de categorías
    const { data: catTranslations } = await supabase
      .from('translations')
      .select('entity_id, value')
      .eq('entity_type', 'category')
      .eq('language_code', lang)
      .eq('field_name', 'name')
      .in('entity_id', categoryIds)

    const catNamesMap = new Map<number, string>()
    catTranslations?.forEach(t => {
      catNamesMap.set(t.entity_id, t.value)
    })

    // Obtener traducciones de proyectos
    const projectIds = projects.map(p => p.id)
    const { data: translations } = await supabase
      .from('translations')
      .select('entity_id, field_name, value')
      .eq('entity_type', 'project')
      .eq('language_code', lang)
      .in('entity_id', projectIds)
      .in('field_name', ['name', 'description'])

    const translationsMap = new Map<string, string>()
    translations?.forEach(t => {
      translationsMap.set(`${t.entity_id}-${t.field_name}`, t.value)
    })

    return projects.map(proj => ({
      id: proj.id,
      slug: proj.slug,
      name: translationsMap.get(`${proj.id}-name`) || proj.slug,
      description: translationsMap.get(`${proj.id}-description`) || '',
      category_id: proj.category_id,
      category_slug: (proj.categories as unknown as { slug: string }).slug,
      category_name: catNamesMap.get(proj.category_id) || '',
      image_urls: proj.image_urls || [],
      display_order: proj.display_order,
      is_active: proj.is_active
    }))
  },

  /**
   * Limpia todo el caché (memoria y localStorage)
   * Se llama automáticamente vía Realtime o manualmente desde el admin
   */
  clearCache() {
    // Limpiar caché en memoria
    memoryCache.categories.clear()
    memoryCache.projects.clear()
    memoryCache.projectDetail.clear()
    
    // Limpiar localStorage
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch {
      // localStorage no disponible
    }
    
    console.log('✅ Caché de proyectos limpiado completamente')
  },

  /**
   * Desuscribirse de Realtime (útil para cleanup)
   */
  unsubscribeRealtime() {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
      isRealtimeInitialized = false
      console.log('🔌 Realtime desconectado')
    }
  },

  /**
   * Forzar inicialización de Realtime (por si no se inicializó automáticamente)
   */
  initializeRealtime() {
    initializeRealtime()
  }
}
