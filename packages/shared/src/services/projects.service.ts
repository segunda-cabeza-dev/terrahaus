import { supabase } from '../lib/supabase'

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

// Cache para categorías y proyectos
let categoriesCache: Map<string, ProjectCategory[]> = new Map() // por idioma
let projectsCache: Map<string, ProjectItem[]> = new Map()
let cacheTimestamp: Map<string, number> = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const STORAGE_KEY_PREFIX = 'beltrame_projects_'

// Helpers para localStorage (con try-catch por si está deshabilitado)
const getFromStorage = <T>(key: string): { data: T | null; timestamp: number } => {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key)
    if (item) {
      return JSON.parse(item)
    }
  } catch {
    // localStorage no disponible o error de parsing
  }
  return { data: null, timestamp: 0 }
}

const setToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch {
    // localStorage no disponible o quota exceeded
  }
}

export const projectsService = {
  /**
   * Obtiene todas las categorías activas con sus traducciones
   * Usa cache en memoria + localStorage para cargas instantáneas
   */
  async getCategories(lang: string = 'es'): Promise<ProjectCategory[]> {
    const cacheKey = `categories_${lang}`
    const now = Date.now()
    
    // 1. Primero revisar memoria cache
    const memoryCacheTime = cacheTimestamp.get(cacheKey) || 0
    if (categoriesCache.has(cacheKey) && (now - memoryCacheTime) < CACHE_TTL) {
      return categoriesCache.get(cacheKey)!
    }

    // 2. Si no hay en memoria, revisar localStorage (carga instantánea)
    const stored = getFromStorage<ProjectCategory[]>(cacheKey)
    const hasValidStoredData = stored.data && stored.data.length > 0
    
    // Si tenemos datos en storage y son recientes, usarlos
    if (hasValidStoredData && (now - stored.timestamp) < CACHE_TTL) {
      categoriesCache.set(cacheKey, stored.data!)
      cacheTimestamp.set(cacheKey, stored.timestamp)
      return stored.data!
    }

    // 3. Fetch desde Supabase (en paralelo las 3 queries)
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
        return stored.data || []
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

      // Guardar en ambos caches
      categoriesCache.set(cacheKey, result)
      cacheTimestamp.set(cacheKey, Date.now())
      setToStorage(cacheKey, result)
      
      return result
    }

    // Si hay datos en storage (aunque estén viejos), devolverlos inmediatamente
    // y refrescar en background
    if (hasValidStoredData) {
      // Guardar en memoria los datos de storage
      categoriesCache.set(cacheKey, stored.data!)
      cacheTimestamp.set(cacheKey, stored.timestamp)
      
      // Refrescar en background (stale-while-revalidate)
      fetchFreshData().catch(console.error)
      
      return stored.data!
    }

    // No hay datos cacheados, esperar el fetch
    return fetchFreshData()
  },

  /**
   * Obtiene los proyectos de una categoría por slug
   */
  async getProjectsByCategory(categorySlug: string, lang: string = 'es'): Promise<ProjectItem[]> {
    const cacheKey = `projects_${categorySlug}_${lang}`
    const now = Date.now()
    
    // Revisar memoria cache
    const memoryCacheTime = cacheTimestamp.get(cacheKey) || 0
    if (projectsCache.has(cacheKey) && (now - memoryCacheTime) < CACHE_TTL) {
      return projectsCache.get(cacheKey)!
    }

    // Revisar localStorage
    const stored = getFromStorage<ProjectItem[]>(cacheKey)
    const hasValidStoredData = stored.data && stored.data.length > 0

    if (hasValidStoredData && (now - stored.timestamp) < CACHE_TTL) {
      projectsCache.set(cacheKey, stored.data!)
      cacheTimestamp.set(cacheKey, stored.timestamp)
      return stored.data!
    }

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
        return stored.data || []
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

      // Guardar en caches
      projectsCache.set(cacheKey, result)
      cacheTimestamp.set(cacheKey, Date.now())
      setToStorage(cacheKey, result)

      return result
    }

    // Stale-while-revalidate
    if (hasValidStoredData) {
      projectsCache.set(cacheKey, stored.data!)
      cacheTimestamp.set(cacheKey, stored.timestamp)
      fetchFreshData().catch(console.error)
      return stored.data!
    }

    return fetchFreshData()
  },

  /**
   * Obtiene un proyecto por slug con cache
   */
  async getProject(projectSlug: string, lang: string = 'es'): Promise<ProjectItem | null> {
    const cacheKey = `project_${projectSlug}_${lang}`
    const now = Date.now()
    
    // Revisar memoria cache
    const memoryCacheTime = cacheTimestamp.get(cacheKey) || 0
    if (projectsCache.has(cacheKey) && (now - memoryCacheTime) < CACHE_TTL) {
      const cached = projectsCache.get(cacheKey)
      return cached && cached.length > 0 ? cached[0] : null
    }

    // Revisar localStorage
    const stored = getFromStorage<ProjectItem[]>(cacheKey)
    const hasValidStoredData = stored.data && stored.data.length > 0

    if (hasValidStoredData && (now - stored.timestamp) < CACHE_TTL) {
      projectsCache.set(cacheKey, stored.data!)
      cacheTimestamp.set(cacheKey, stored.timestamp)
      return stored.data![0]
    }

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
        return stored.data?.[0] || null
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

      // Guardar en caches (como array para consistencia con el tipo)
      projectsCache.set(cacheKey, [result])
      cacheTimestamp.set(cacheKey, Date.now())
      setToStorage(cacheKey, [result])

      return result
    }

    // Stale-while-revalidate
    if (hasValidStoredData) {
      projectsCache.set(cacheKey, stored.data!)
      cacheTimestamp.set(cacheKey, stored.timestamp)
      fetchFreshData().catch(console.error)
      return stored.data![0]
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
   * Limpia el cache (memoria y localStorage)
   */
  clearCache() {
    categoriesCache.clear()
    projectsCache.clear()
    cacheTimestamp.clear()
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
  }
}
