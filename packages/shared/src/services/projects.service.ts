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
let categoriesCache: ProjectCategory[] | null = null
let projectsCache: Map<string, ProjectItem[]> = new Map()
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export const projectsService = {
  /**
   * Obtiene todas las categorías activas con sus traducciones
   */
  async getCategories(lang: string = 'es'): Promise<ProjectCategory[]> {
    const now = Date.now()
    if (categoriesCache && (now - cacheTimestamp) < CACHE_TTL) {
      return categoriesCache
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, slug, cover_image_url, display_order, is_active')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.error('Error fetching categories:', error)
      return categoriesCache || []
    }

    if (!categories || categories.length === 0) {
      return []
    }

    // Obtener traducciones
    const categoryIds = categories.map(c => c.id)
    const { data: translations } = await supabase
      .from('translations')
      .select('entity_id, field_name, value')
      .eq('entity_type', 'category')
      .eq('language_code', lang)
      .in('entity_id', categoryIds)
      .in('field_name', ['name', 'description'])

    // Contar proyectos por categoría
    const { data: projectCounts } = await supabase
      .from('projects')
      .select('category_id')
      .eq('is_active', true)

    const countMap = new Map<number, number>()
    projectCounts?.forEach(p => {
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

    categoriesCache = result
    cacheTimestamp = now
    return result
  },

  /**
   * Obtiene los proyectos de una categoría por slug
   */
  async getProjectsByCategory(categorySlug: string, lang: string = 'es'): Promise<ProjectItem[]> {
    const cacheKey = `${categorySlug}-${lang}`
    const now = Date.now()
    
    if (projectsCache.has(cacheKey) && (now - cacheTimestamp) < CACHE_TTL) {
      return projectsCache.get(cacheKey)!
    }

    // Primero obtener la categoría
    const { data: category } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', categorySlug)
      .single()

    if (!category) {
      return []
    }

    // Obtener traducciones de la categoría
    const { data: catTranslations } = await supabase
      .from('translations')
      .select('field_name, value')
      .eq('entity_type', 'category')
      .eq('entity_id', category.id)
      .eq('language_code', lang)
      .eq('field_name', 'name')

    const categoryName = catTranslations?.[0]?.value || categorySlug

    // Obtener proyectos de esa categoría
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, slug, category_id, image_urls, display_order, is_active')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    if (!projects || projects.length === 0) {
      return []
    }

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

    projectsCache.set(cacheKey, result)
    return result
  },

  /**
   * Obtiene un proyecto por slug
   */
  async getProject(projectSlug: string, lang: string = 'es'): Promise<ProjectItem | null> {
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

    // Obtener traducciones
    const { data: translations } = await supabase
      .from('translations')
      .select('field_name, value')
      .eq('entity_type', 'project')
      .eq('entity_id', project.id)
      .eq('language_code', lang)
      .in('field_name', ['name', 'description'])

    const translationsMap = new Map<string, string>()
    translations?.forEach(t => {
      translationsMap.set(t.field_name, t.value)
    })

    // Obtener nombre de categoría
    const categorySlug = (project.categories as unknown as { slug: string }).slug
    const { data: catTranslation } = await supabase
      .from('translations')
      .select('value')
      .eq('entity_type', 'category')
      .eq('entity_id', project.category_id)
      .eq('language_code', lang)
      .eq('field_name', 'name')
      .single()

    return {
      id: project.id,
      slug: project.slug,
      name: translationsMap.get('name') || project.slug,
      description: translationsMap.get('description') || '',
      category_id: project.category_id,
      category_slug: categorySlug,
      category_name: catTranslation?.value || categorySlug,
      image_urls: project.image_urls || [],
      display_order: project.display_order,
      is_active: project.is_active
    }
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
   * Limpia el cache
   */
  clearCache() {
    categoriesCache = null
    projectsCache.clear()
    cacheTimestamp = 0
  }
}
