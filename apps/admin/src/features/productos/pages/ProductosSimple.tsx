import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { USE_MOCK_DATA, mockData, type Category, type Project, supabase, galleryService, projectsService } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { useToast } from '@beltrame/shared'
import { Plus, Trash2, Edit, Image as ImageIcon, ArrowLeft, Search, X, Loader2, Eye } from 'lucide-react'
import { PageHeader } from '../../../shared'

interface CategoryWithProjects extends Category {
  projects: Project[]
}

type View = 'categories' | 'category-detail' | 'edit-category' | 'edit-project'

export default function ProductosSimple() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<CategoryWithProjects[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Leer estado inicial desde URL
  const [currentView, setCurrentView] = useState<View>(() => {
    const view = searchParams.get('view')
    return (view as View) || 'categories'
  })
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithProjects | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [activeLanguageTab, setActiveLanguageTab] = useState<'ES' | 'EN' | 'IT'>('ES')
  const [activeCategoryLanguageTab, setActiveCategoryLanguageTab] = useState<'ES' | 'EN' | 'IT'>('ES')
  const [activeProjectLanguageTab, setActiveProjectLanguageTab] = useState<'ES' | 'EN' | 'IT'>('ES')
  const [showImageSourceDialog, setShowImageSourceDialog] = useState(false)
  const [imageSourceType, setImageSourceType] = useState<'project' | 'category' | null>(null)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [gallerySearchTerm, setGallerySearchTerm] = useState('')
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<string[]>([])
  const [categorySearchTerm, setCategorySearchTerm] = useState('')
  
  // Imágenes de la galería de Supabase
  const [galleryImages, setGalleryImages] = useState<{id: string | number, url: string, name: string}[]>([])
  const [loadingGalleryImages, setLoadingGalleryImages] = useState(false)
  
  // Cargar imágenes de la galería cuando se abre el modal
  const loadGalleryImages = async () => {
    if (galleryImages.length > 0) return // Ya cargadas
    setLoadingGalleryImages(true)
    try {
      const result = await galleryService.listAllImages()
      setGalleryImages(result.map(img => ({
        id: img.id,
        url: img.url,
        name: img.name.replace(/\.[^/.]+$/, '') // Quitar extensión
      })))
    } catch (error) {
      console.error('Error loading gallery images:', error)
    } finally {
      setLoadingGalleryImages(false)
    }
  }
  
  const [categoryForm, setCategoryForm] = useState({
    nombre: '',
    nombre_en: '',
    nombre_it: '',
    imagen_portada: '',
  })
  
  const [projectForm, setProjectForm] = useState({
    categoria_id: 0,
    nombre: '',
    nombre_en: '',
    nombre_it: '',
    descripcion: '',
    descripcion_en: '',
    descripcion_it: '',
    imagenes: [] as string[],
  })
  
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  // Scroll to top cuando cambia la vista
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  // Restaurar estado desde URL
  useEffect(() => {
    if (categories.length === 0) return

    const view = searchParams.get('view') as View
    const categoryId = searchParams.get('categoryId')
    const projectId = searchParams.get('projectId')

    if (view && view !== 'categories') {
      setCurrentView(view)
      
      if (categoryId) {
        const category = categories.find(cat => cat.id === parseInt(categoryId))
        if (category) {
          setSelectedCategory(category)
          
          if (view === 'edit-project' && projectId) {
            setActiveProjectLanguageTab('ES') // Reset to Spanish for projects
            const project = category.projects.find(p => p.id === parseInt(projectId))
            if (project) {
              setEditingProject(project)
              setProjectForm({
                categoria_id: category.id,
                nombre: project.nombre,
                nombre_en: project.nombre_en || '',
                nombre_it: project.nombre_it || '',
                descripcion: project.descripcion || '',
                descripcion_en: project.descripcion_en || '',
                descripcion_it: project.descripcion_it || '',
                imagenes: project.imagenes || [],
              })
            }
          } else if (view === 'edit-category') {
            setActiveCategoryLanguageTab('ES') // Reset to Spanish for categories
            setEditingCategory(category)
            setCategoryForm({
              nombre: category.nombre,
              nombre_en: category.nombre_en || '',
              nombre_it: category.nombre_it || '',
              imagen_portada: category.imagen_portada || '',
            })
          } else if (view === 'category-detail') {
            setActiveLanguageTab('ES') // Reset to Spanish for category detail
          }
        }
      }
    }
  }, [categories, searchParams])

  const loadData = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Crear una copia profunda del mockData para poder modificarlo
        const categoriesWithProjects: CategoryWithProjects[] = mockData.categories.map(cat => ({
          ...cat,
          projects: mockData.projects.filter(p => p.categoria_id === cat.id)
        }))
        setCategories(categoriesWithProjects)
      } else {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true })
        
        if (categoriesError) throw categoriesError

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })

        if (projectsError) throw projectsError

        // Fetch translations
        const { data: translationsData, error: translationsError } = await supabase
          .from('translations')
          .select('*')
          .in('entity_type', ['category', 'project'])
        
        if (translationsError) throw translationsError

        // Process categories
        const normalizeLanguageCode = (code: string | null | undefined) => (code ?? '').toLowerCase()
        const getTranslationValue = (items: any[], lang: string, field: string) =>
          items.find((t: any) => normalizeLanguageCode(t.language_code) === lang && t.field_name === field)?.value?.trim() ?? ''
        const slugToTitle = (value: string) =>
          value ? value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : ''

        const processedCategories: any[] = categoriesData.map((cat: any) => {
          const catTranslations = translationsData.filter((t: any) => t.entity_type === 'category' && t.entity_id === cat.id)

          const nombreEs = getTranslationValue(catTranslations, 'es', 'name') || slugToTitle(cat.slug)
          const nombreEn = getTranslationValue(catTranslations, 'en', 'name') || nombreEs
          const nombreIt = getTranslationValue(catTranslations, 'it', 'name') || nombreEs

          const descripcionEs = getTranslationValue(catTranslations, 'es', 'description')
          const descripcionEn = getTranslationValue(catTranslations, 'en', 'description') || descripcionEs
          const descripcionIt = getTranslationValue(catTranslations, 'it', 'description') || descripcionEs

          // Filter projects for this category
          const catProjects = projectsData.filter((p: any) => p.category_id === cat.id).map((p: any) => {
            const projTranslations = translationsData.filter((t: any) => t.entity_type === 'project' && t.entity_id === p.id)

            const pNombreEs = getTranslationValue(projTranslations, 'es', 'name') || slugToTitle(p.slug)
            const pNombreEn = getTranslationValue(projTranslations, 'en', 'name') || pNombreEs
            const pNombreIt = getTranslationValue(projTranslations, 'it', 'name') || pNombreEs

            const pDescEs = getTranslationValue(projTranslations, 'es', 'description')
            const pDescEn = getTranslationValue(projTranslations, 'en', 'description') || pDescEs
            const pDescIt = getTranslationValue(projTranslations, 'it', 'description') || pDescEs

            return {
              id: p.id,
              categoria_id: p.category_id,
              slug: p.slug,
              nombre: pNombreEs,
              nombre_en: pNombreEn,
              nombre_it: pNombreIt,
              descripcion: pDescEs,
              descripcion_en: pDescEn,
              descripcion_it: pDescIt,
              imagenes: p.image_urls || [],
              orden: p.display_order,
              activo: p.is_active,
              created_at: p.created_at,
              updated_at: p.updated_at
            }
          })

          return {
            id: cat.id,
            nombre: nombreEs,
            nombre_en: nombreEn,
            nombre_it: nombreIt,
            descripcion: descripcionEs,
            descripcion_en: descripcionEn,
            descripcion_it: descripcionIt,
            imagen_portada: cat.cover_image_url || '',
            slug: cat.slug,
            orden: cat.display_order,
            activa: cat.is_active,
            created_at: cat.created_at,
            updated_at: cat.updated_at,
            projects: catProjects
          }
        })

        setCategories(processedCategories)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error al cargar datos',
        description: 'No se pudieron cargar las categorías y proyectos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Funciones helper para navegación con URL
  const navigateToCategories = () => {
    setCurrentView('categories')
    setSearchParams({})
  }

  const navigateToCategoryDetail = (category: CategoryWithProjects) => {
    setCurrentView('category-detail')
    setSearchParams({ view: 'category-detail', categoryId: category.id.toString() })
  }

  const navigateToEditCategory = (category: CategoryWithProjects | null) => {
    setCurrentView('edit-category')
    if (category) {
      setSearchParams({ view: 'edit-category', categoryId: category.id.toString() })
    } else {
      setSearchParams({ view: 'edit-category' })
    }
  }

  const navigateToEditProject = (category: CategoryWithProjects, project: Project) => {
    setCurrentView('edit-project')
    setSearchParams({ 
      view: 'edit-project', 
      categoryId: category.id.toString(),
      projectId: project.id.toString()
    })
  }

  // Ver detalle de categoría y sus proyectos
  const handleViewCategory = (category: CategoryWithProjects) => {
    setSelectedCategory(category)
    // Inicializar formulario con datos de la categoría
    setCategoryForm({
      nombre: (category as any).nombre || category.name || '',
      nombre_en: (category as any).nombre_en || '',
      nombre_it: (category as any).nombre_it || '',
      imagen_portada: (category as any).imagen_portada || category.cover_image_url || '',
    })
    setActiveLanguageTab('ES') // Reset tab to Spanish
    setSaved(false) // Reset saved state when viewing a category
    navigateToCategoryDetail(category)
  }

  // Nueva categoría
  const handleNewCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ nombre: '', nombre_en: '', nombre_it: '', imagen_portada: '' })
    setActiveCategoryLanguageTab('ES') // Reset tab to Spanish for new category
    navigateToEditCategory(null)
  }

  // Guardar categoría
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== handleSaveCategory called ===')
    console.log('categoryForm:', categoryForm)
    console.log('USE_MOCK_DATA:', USE_MOCK_DATA)
    
    // Variable para guardar la nueva categoría creada
    let createdCategoryRef: CategoryWithProjects | null = null
    
    // Solo validar que el nombre en español esté completo
    if (!categoryForm.nombre.trim()) {
      toast({
        title: '⚠️ Nombre requerido',
        description: 'Por favor ingresa el nombre de la categoría en español.',
        variant: 'destructive',
      })
      return
    }
    
    setSaving(true)
    setSaved(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (USE_MOCK_DATA) {
        if (editingCategory) {
          // Actualizar categoría existente en el estado
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.id === editingCategory.id
                ? {
                    ...cat,
                    nombre: categoryForm.nombre,
                    nombre_en: categoryForm.nombre_en,
                    nombre_it: categoryForm.nombre_it,
                    imagen_portada: categoryForm.imagen_portada,
                    updated_at: new Date().toISOString(),
                  }
                : cat
            )
          )
          
          // También actualizar en mockData para persistencia durante la sesión
          const categoryIndex = mockData.categories.findIndex(c => c.id === editingCategory.id)
          if (categoryIndex !== -1) {
            (mockData.categories[categoryIndex] as any).nombre = categoryForm.nombre;
            (mockData.categories[categoryIndex] as any).nombre_en = categoryForm.nombre_en;
            (mockData.categories[categoryIndex] as any).nombre_it = categoryForm.nombre_it;
            (mockData.categories[categoryIndex] as any).imagen_portada = categoryForm.imagen_portada;
            (mockData.categories[categoryIndex] as any).updated_at = new Date().toISOString()
          }
        } else {
          // Crear nueva categoría
          const newCategory: CategoryWithProjects = {
            id: Math.max(...mockData.categories.map(c => c.id), 0) + 1,
            nombre: categoryForm.nombre,
            nombre_en: categoryForm.nombre_en,
            nombre_it: categoryForm.nombre_it,
            descripcion: '',
            descripcion_en: '',
            imagen_portada: categoryForm.imagen_portada,
            slug: categoryForm.nombre.toLowerCase().replace(/\s+/g, '-'),
            orden: mockData.categories.length + 1,
            activa: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            projects: []
          }
          
          // Agregar al estado
          setCategories(prevCategories => [...prevCategories, newCategory])
          
          // Agregar a mockData para persistencia durante la sesión
          const newCategoryData = {
            id: newCategory.id,
            nombre: newCategory.nombre,
            nombre_en: newCategory.nombre_en || '',
            nombre_it: newCategory.nombre_it || '',
            descripcion: newCategory.descripcion || '',
            descripcion_en: newCategory.descripcion_en || '',
            descripcion_it: newCategory.descripcion_it || '',
            imagen_portada: newCategory.imagen_portada || '',
            slug: newCategory.slug,
            orden: newCategory.orden,
            activa: newCategory.activa,
            created_at: newCategory.created_at,
            updated_at: newCategory.updated_at
          }
          mockData.categories.push(newCategoryData as any)
          
          // Guardar referencia para navegar después
          createdCategoryRef = newCategory
        }
      } else {
        // Supabase logic
        if (editingCategory) {
          // Update category
          const { error: updateError } = await supabase
            .from('categories')
            .update({
              cover_image_url: categoryForm.imagen_portada,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingCategory.id)
          
          if (updateError) throw updateError

          // Update translations
          const translations = [
            { lang: 'es', field: 'name', value: categoryForm.nombre },
            { lang: 'en', field: 'name', value: categoryForm.nombre_en },
            { lang: 'it', field: 'name', value: categoryForm.nombre_it },
          ]

          for (const t of translations) {
             await supabase.from('translations').upsert({
                entity_type: 'category',
                entity_id: editingCategory.id,
                field_name: t.field,
                language_code: t.lang,
                value: t.value
             }, { onConflict: 'entity_type,entity_id,field_name,language_code' })
          }

          // Update local state
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.id === editingCategory.id
                ? {
                    ...cat,
                    nombre: categoryForm.nombre,
                    nombre_en: categoryForm.nombre_en,
                    nombre_it: categoryForm.nombre_it,
                    imagen_portada: categoryForm.imagen_portada,
                    updated_at: new Date().toISOString(),
                  }
                : cat
            )
          )

        } else {
          // Create category
          console.log('Creating category in Supabase...')
          const { data: newCatData, error: createError } = await supabase
            .from('categories')
            .insert({
              slug: categoryForm.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              cover_image_url: categoryForm.imagen_portada,
              display_order: categories.length + 1,
              is_active: true
            })
            .select()
            .single()
          
          console.log('Category insert result:', { newCatData, createError })
          if (createError) throw createError

          const newId = newCatData.id

          // Insert translations - usar español como fallback para EN/IT vacíos
          const nombreEN = categoryForm.nombre_en || categoryForm.nombre
          const nombreIT = categoryForm.nombre_it || categoryForm.nombre
          
          const translations = [
            { lang: 'es', field: 'name', value: categoryForm.nombre },
            { lang: 'en', field: 'name', value: nombreEN },
            { lang: 'it', field: 'name', value: nombreIT },
          ]

          for (const t of translations) {
            if (t.value) {
              await supabase.from('translations').insert({
                entity_type: 'category',
                entity_id: newId,
                field_name: t.field,
                language_code: t.lang,
                value: t.value
              })
            }
          }

          // Update local state
          const newCategory: any = {
            id: newId,
            nombre: categoryForm.nombre,
            nombre_en: categoryForm.nombre_en,
            nombre_it: categoryForm.nombre_it,
            descripcion: '',
            descripcion_en: '',
            descripcion_it: '',
            imagen_portada: categoryForm.imagen_portada,
            slug: newCatData.slug,
            orden: newCatData.display_order,
            activa: newCatData.is_active,
            created_at: newCatData.created_at,
            updated_at: newCatData.updated_at,
            projects: []
          }
          
          setCategories(prevCategories => [...prevCategories, newCategory])
          
          // Guardar referencia para navegar después
          createdCategoryRef = newCategory
        }
      }
      
      // Limpiar cache del servicio de proyectos para que la web vea los cambios
      projectsService.clearCache()
      console.log('Projects cache cleared after category save')
      
      toast({
        title: editingCategory ? '✓ Categoría actualizada' : '✓ Categoría creada',
        description: `"${categoryForm.nombre}" se guardó correctamente`,
        className: 'bg-green-600 text-white border-green-600',
      })
      setSaved(true)
      
      // Si es nueva categoría, ir directamente a ella para agregar proyectos
      if (!editingCategory && createdCategoryRef) {
        setSelectedCategory(createdCategoryRef)
        navigateToCategoryDetail(createdCategoryRef)
        setEditingCategory(null)
      } else {
        // Si es edición, volver a la vista de categorías
        navigateToCategories()
        setEditingCategory(null)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error al guardar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Eliminar categoría
  const handleDeleteCategory = async (categoryName: string) => {
    if (confirm(`¿Eliminar la categoría "${categoryName}" y todos sus proyectos?`)) {
      if (!USE_MOCK_DATA) {
        const category = categories.find(c => (c as any).nombre === categoryName || (c as any).name === categoryName)
        if (category) {
           console.log('=== Deleting category ===', { categoryId: category.id, categoryName })
           
           const { error } = await supabase.from('categories').delete().eq('id', category.id)
           
           if (error) {
             console.error('Error deleting category:', error)
             toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' })
             return
           }
           
           // Verificar que realmente se eliminó
           const { data: checkData } = await supabase
             .from('categories')
             .select('id')
             .eq('id', category.id)
             .single()
           
           if (checkData) {
             console.error('Category still exists after delete! RLS policy may be blocking deletion.')
             toast({ 
               title: 'Error de permisos', 
               description: 'No tienes permisos para eliminar categorías. Contacta al owner.', 
               variant: 'destructive' 
             })
             return
           }
           
           console.log('Category deleted successfully')
           
           // Limpiar cache del servicio de proyectos para que la web vea los cambios
           projectsService.clearCache()
           console.log('Projects cache cleared after category deletion')
        }
      }
      toast({ title: 'Categoría eliminada' })
      loadData()
    }
  }

  // Nuevo proyecto
  const handleNewProject = () => {
    if (!selectedCategory) return
    setEditingProject(null)
    setActiveProjectLanguageTab('ES') // Reset tab to Spanish for projects
    const newProject: Project = {
      id: 0, // Temporal
      nombre: '',
      nombre_en: '',
      nombre_it: '',
      descripcion: '',
      descripcion_en: '',
      descripcion_it: '',
      imagenes: [],
      categoria_id: selectedCategory.id,
      slug: '',
      orden: 0,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProjectForm({
      categoria_id: selectedCategory.id,
      nombre: '',
      nombre_en: '',
      nombre_it: '',
      descripcion: '',
      descripcion_en: '',
      descripcion_it: '',
      imagenes: [],
    })
    navigateToEditProject(selectedCategory, newProject)
  }

  // Editar proyecto
  const handleEditProject = (project: Project) => {
    setSaved(false) // Reset saved state
    setActiveProjectLanguageTab('ES') // Reset tab to Spanish for projects
    
    // Si está en modo mock, buscar los datos más recientes
    let currentProject = project
    if (USE_MOCK_DATA) {
      const updatedProject = mockData.projects.find(p => p.id === project.id)
      if (updatedProject) {
        currentProject = updatedProject
      }
    }
    
    setEditingProject(currentProject)
    setProjectForm({
      categoria_id: currentProject.categoria_id,
      nombre: currentProject.nombre,
      nombre_en: currentProject.nombre_en || '',
      nombre_it: currentProject.nombre_it || '',
      descripcion: currentProject.descripcion || '',
      descripcion_en: currentProject.descripcion_en || '',
      descripcion_it: currentProject.descripcion_it || '',
      imagenes: currentProject.imagenes || [],
    })
    // Usar la función helper para navegar
    if (selectedCategory) {
      navigateToEditProject(selectedCategory, currentProject)
    }
  }

  // Guardar proyecto
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Solo validar que el nombre en español esté completo
    if (!projectForm.nombre.trim()) {
      toast({
        title: '⚠️ Nombre requerido',
        description: 'Por favor ingresa el nombre del proyecto en español.',
        variant: 'destructive',
      })
      return
    }
    
    setSaving(true)
    setSaved(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (USE_MOCK_DATA) {
        if (editingProject) {
          // Actualizar proyecto existente en el estado
          setCategories(prevCategories => {
            const updated = prevCategories.map(cat => 
              cat.id === projectForm.categoria_id
                ? {
                    ...cat,
                    projects: cat.projects.map(proj =>
                      proj.id === editingProject.id
                        ? {
                            ...proj,
                            nombre: projectForm.nombre,
                            nombre_en: projectForm.nombre_en,
                            nombre_it: projectForm.nombre_it,
                            descripcion: projectForm.descripcion,
                            descripcion_en: projectForm.descripcion_en,
                            descripcion_it: projectForm.descripcion_it,
                            imagenes: projectForm.imagenes,
                            updated_at: new Date().toISOString(),
                          }
                        : proj
                    )
                  }
                : cat
            )
            
            // Actualizar selectedCategory inmediatamente
            const updatedCategory = updated.find(cat => cat.id === projectForm.categoria_id)
            if (updatedCategory && selectedCategory?.id === projectForm.categoria_id) {
              setSelectedCategory(updatedCategory)
            }
            
            return updated
          })
          
          // También actualizar en mockData
          const projectIndex = mockData.projects.findIndex(p => p.id === editingProject.id)
          if (projectIndex !== -1) {
            (mockData.projects[projectIndex] as any).nombre = projectForm.nombre;
            (mockData.projects[projectIndex] as any).nombre_en = projectForm.nombre_en;
            (mockData.projects[projectIndex] as any).nombre_it = projectForm.nombre_it;
            (mockData.projects[projectIndex] as any).descripcion = projectForm.descripcion;
            (mockData.projects[projectIndex] as any).descripcion_en = projectForm.descripcion_en;
            (mockData.projects[projectIndex] as any).descripcion_it = projectForm.descripcion_it;
            (mockData.projects[projectIndex] as any).imagenes = projectForm.imagenes;
            (mockData.projects[projectIndex] as any).updated_at = new Date().toISOString()
          }
        } else {
          // Crear nuevo proyecto
          const newProject: Project = {
            id: Math.max(...mockData.projects.map(p => p.id), 0) + 1,
            categoria_id: projectForm.categoria_id,
            nombre: projectForm.nombre,
            nombre_en: projectForm.nombre_en,
            nombre_it: projectForm.nombre_it,
            descripcion: projectForm.descripcion,
            descripcion_en: projectForm.descripcion_en,
            descripcion_it: projectForm.descripcion_it,
            imagenes: projectForm.imagenes,
            orden: mockData.projects.length + 1,
            activo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          
          // Actualizar el estado
          setCategories(prevCategories => {
            const updated = prevCategories.map(cat =>
              cat.id === projectForm.categoria_id
                ? { ...cat, projects: [...cat.projects, newProject] }
                : cat
            )
            
            // Actualizar selectedCategory inmediatamente
            const updatedCategory = updated.find(cat => cat.id === projectForm.categoria_id)
            if (updatedCategory && selectedCategory?.id === projectForm.categoria_id) {
              setSelectedCategory(updatedCategory)
            }
            
            return updated
          })
          
          // Agregar a mockData
          mockData.projects.push(newProject as any)
        }
      } else {
        // Supabase logic
        if (editingProject) {
          // Update project
          const { error: updateError } = await supabase
            .from('projects')
            .update({
              image_urls: projectForm.imagenes,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingProject.id)
          
          if (updateError) throw updateError

          // Update translations
          const translations = [
            { lang: 'es', field: 'name', value: projectForm.nombre },
            { lang: 'en', field: 'name', value: projectForm.nombre_en },
            { lang: 'it', field: 'name', value: projectForm.nombre_it },
            { lang: 'es', field: 'description', value: projectForm.descripcion },
            { lang: 'en', field: 'description', value: projectForm.descripcion_en },
            { lang: 'it', field: 'description', value: projectForm.descripcion_it },
          ]

          for (const t of translations) {
             await supabase.from('translations').upsert({
                entity_type: 'project',
                entity_id: editingProject.id,
                field_name: t.field,
                language_code: t.lang,
                value: t.value
             }, { onConflict: 'entity_type,entity_id,field_name,language_code' })
          }

          // Update local state
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.id === projectForm.categoria_id
                ? {
                    ...cat,
                    projects: cat.projects.map(proj =>
                      proj.id === editingProject.id
                        ? {
                            ...proj,
                            nombre: projectForm.nombre,
                            nombre_en: projectForm.nombre_en,
                            nombre_it: projectForm.nombre_it,
                            descripcion: projectForm.descripcion,
                            descripcion_en: projectForm.descripcion_en,
                            descripcion_it: projectForm.descripcion_it,
                            imagenes: projectForm.imagenes,
                            updated_at: new Date().toISOString(),
                          }
                        : proj
                    )
                  }
                : cat
            )
          )

        } else {
          // Create project
          const { data: newProjData, error: createError } = await supabase
            .from('projects')
            .insert({
              category_id: projectForm.categoria_id,
              slug: projectForm.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              image_urls: projectForm.imagenes,
              display_order: selectedCategory ? selectedCategory.projects.length + 1 : 1,
              is_active: true
            })
            .select()
            .single()
          
          if (createError) throw createError

          const newId = newProjData.id

          // Insert translations - usar el nombre español como fallback si no hay traducción
          const nombreEN = projectForm.nombre_en || projectForm.nombre
          const nombreIT = projectForm.nombre_it || projectForm.nombre
          const descEN = projectForm.descripcion_en || projectForm.descripcion
          const descIT = projectForm.descripcion_it || projectForm.descripcion
          
          const translations = [
            { lang: 'es', field: 'name', value: projectForm.nombre },
            { lang: 'en', field: 'name', value: nombreEN },
            { lang: 'it', field: 'name', value: nombreIT },
            { lang: 'es', field: 'description', value: projectForm.descripcion || '' },
            { lang: 'en', field: 'description', value: descEN || '' },
            { lang: 'it', field: 'description', value: descIT || '' },
          ]

          for (const t of translations) {
            if (t.value) { // Solo insertar si tiene valor
              await supabase.from('translations').insert({
                entity_type: 'project',
                entity_id: newId,
                field_name: t.field,
                language_code: t.lang,
                value: t.value
              })
            }
          }

          // Update local state
          const newProject: any = {
            id: newId,
            categoria_id: projectForm.categoria_id,
            nombre: projectForm.nombre,
            nombre_en: projectForm.nombre_en,
            nombre_it: projectForm.nombre_it,
            descripcion: projectForm.descripcion,
            descripcion_en: projectForm.descripcion_en,
            descripcion_it: projectForm.descripcion_it,
            imagenes: projectForm.imagenes,
            orden: newProjData.display_order,
            activo: newProjData.is_active,
            created_at: newProjData.created_at,
            updated_at: newProjData.updated_at,
          }
          
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.id === projectForm.categoria_id
                ? { ...cat, projects: [...cat.projects, newProject] }
                : cat
            )
          )
          
          if (selectedCategory && selectedCategory.id === projectForm.categoria_id) {
            setSelectedCategory({
              ...selectedCategory,
              projects: [...selectedCategory.projects, newProject]
            })
          }
        }
      }
      
      // Limpiar cache del servicio de proyectos para que la web vea los cambios
      projectsService.clearCache()
      console.log('Projects cache cleared after save')
      
      toast({
        title: editingProject ? '✓ Proyecto actualizado' : '✓ Proyecto creado',
        description: `"${projectForm.nombre}" se guardó correctamente`,
        className: 'bg-green-600 text-white border-green-600',
      })
      setSaved(true)
      
      // Volver a la vista de detalle de categoría inmediatamente
      if (selectedCategory) {
        navigateToCategoryDetail(selectedCategory)
      }
      setEditingProject(null)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error al guardar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Eliminar proyecto
  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (confirm(`¿Eliminar el proyecto "${projectName}"?`)) {
      console.log('=== Deleting project ===', { projectId, projectName })
      
      if (!USE_MOCK_DATA) {
         // Primero eliminar las traducciones asociadas
         console.log('Deleting translations for project', projectId)
         const { error: transError } = await supabase
           .from('translations')
           .delete()
           .eq('entity_type', 'project')
           .eq('entity_id', projectId)
         
         if (transError) {
           console.error('Error eliminando traducciones:', transError)
         } else {
           console.log('Translations deleted successfully')
         }
         
         // Luego eliminar el proyecto
         console.log('Deleting project from database', projectId)
         const { error } = await supabase
           .from('projects')
           .delete()
           .eq('id', projectId)
         
         if (error) {
           console.error('Error deleting project:', error)
           toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' })
           return
         }
         
         // Verificar que realmente se eliminó
         const { data: checkData } = await supabase
           .from('projects')
           .select('id')
           .eq('id', projectId)
           .single()
         
         if (checkData) {
           console.error('Project still exists after delete! RLS policy may be blocking deletion.')
           toast({ 
             title: 'Error de permisos', 
             description: 'No tienes permisos para eliminar proyectos. Contacta al owner.', 
             variant: 'destructive' 
           })
           return
         }
         
         console.log('Project deleted successfully from database')
         
         // Limpiar cache del servicio de proyectos para que la web vea los cambios
         projectsService.clearCache()
         console.log('Projects cache cleared')
         
         // Actualizar estado local
         setCategories(prevCategories =>
           prevCategories.map(cat => ({
             ...cat,
             projects: cat.projects.filter(p => p.id !== projectId)
           }))
         )
         
         // Actualizar selectedCategory si existe
         if (selectedCategory) {
           setSelectedCategory({
             ...selectedCategory,
             projects: selectedCategory.projects.filter(p => p.id !== projectId)
           })
         }
         
         toast({ title: 'Proyecto eliminado' })
      } else {
         // Modo mock - solo actualizar estado
         setCategories(prevCategories =>
           prevCategories.map(cat => ({
             ...cat,
             projects: cat.projects.filter(p => p.id !== projectId)
           }))
         )
         
         if (selectedCategory) {
           setSelectedCategory({
             ...selectedCategory,
             projects: selectedCategory.projects.filter(p => p.id !== projectId)
           })
         }
         toast({ title: 'Proyecto eliminado' })
      }
    }
  }

  // Agregar imagen a proyecto desde archivo
  const handleAddImage = () => {
    setImageSourceType('project')
    setShowImageSourceDialog(true)
  }

  const handleAddImageFromComputer = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader()
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            setProjectForm(prev => ({
              ...prev,
              imagenes: [...prev.imagenes, dataUrl]
            }))
          }
          reader.readAsDataURL(file)
        })
      }
    }
    
    input.click()
    setShowImageSourceDialog(false)
  }

  const handleAddImageFromGallery = () => {
    setShowImageSourceDialog(false)
    loadGalleryImages() // Cargar imágenes de la galería
    setShowGalleryModal(true)
  }

  // Agregar imagen de portada para categoría
  const handleAddCategoryImage = () => {
    setImageSourceType('category')
    setShowImageSourceDialog(true)
  }

  const handleAddCategoryImageFromComputer = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          setCategoryForm(prev => ({
            ...prev,
            imagen_portada: dataUrl
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    
    input.click()
    setShowImageSourceDialog(false)
  }

  const handleAddCategoryImageFromGallery = () => {
    setShowImageSourceDialog(false)
    loadGalleryImages() // Cargar imágenes de la galería
    setShowGalleryModal(true)
  }

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    setProjectForm({
      ...projectForm,
      imagenes: projectForm.imagenes.filter((_, i) => i !== index)
    })
  }

  // Seleccionar imagen de la galería
  const handleSelectGalleryImage = (imageUrl: string) => {
    if (imageSourceType === 'project') {
      // Para proyectos, agregar a la lista de imágenes
      setProjectForm(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, imageUrl]
      }))
    } else if (imageSourceType === 'category') {
      // Para categorías, establecer como imagen de portada
      setCategoryForm(prev => ({
        ...prev,
        imagen_portada: imageUrl
      }))
    }
    setShowGalleryModal(false)
    setGallerySearchTerm('')
    setSelectedGalleryImages([])
    toast({ title: 'Imagen agregada desde la galería' })
  }

  // Agregar múltiples imágenes seleccionadas
  const handleAddSelectedImages = () => {
    if (selectedGalleryImages.length === 0) {
      toast({ title: 'Selecciona al menos una imagen', variant: 'destructive' })
      return
    }

    if (imageSourceType === 'project') {
      // Para proyectos, agregar todas las imágenes seleccionadas
      setProjectForm(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...selectedGalleryImages]
      }))
      toast({ title: `${selectedGalleryImages.length} imagen${selectedGalleryImages.length > 1 ? 'es agregadas' : ' agregada'}` })
    } else if (imageSourceType === 'category') {
      // Para categorías, solo tomar la primera
      setCategoryForm(prev => ({
        ...prev,
        imagen_portada: selectedGalleryImages[0]
      }))
      toast({ title: 'Imagen de portada establecida' })
    }
    
    setShowGalleryModal(false)
    setGallerySearchTerm('')
    setSelectedGalleryImages([])
  }

  // Toggle selección de imagen
  const handleToggleImageSelection = (imageUrl: string) => {
    setSelectedGalleryImages(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl)
      } else {
        // Para categorías, solo permitir una selección
        if (imageSourceType === 'category') {
          return [imageUrl]
        }
        return [...prev, imageUrl]
      }
    })
  }

  // Traducir automáticamente con IA
  const handleTranslateCategory = async () => {
    if (!categoryForm.nombre) {
      toast({ title: 'Escribe primero el texto en español', variant: 'destructive' })
      return
    }
    
    setSaving(true)
    try {
      const textToTranslate = categoryForm.nombre.trim()
      
      // Función para traducir usando MyMemory API (gratuita)
      const translateText = async (text: string, targetLang: string): Promise<string> => {
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`
          )
          const data = await response.json()
          if (data.responseStatus === 200 && data.responseData?.translatedText) {
            // Capitalizar primera letra
            const translated = data.responseData.translatedText
            return translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase()
          }
          return text // Fallback al original si falla
        } catch {
          return text
        }
      }
      
      // Traducir a inglés e italiano en paralelo
      const [translatedEN, translatedIT] = await Promise.all([
        translateText(textToTranslate, 'en'),
        translateText(textToTranslate, 'it')
      ])
      
      setCategoryForm({
        ...categoryForm,
        nombre_en: translatedEN,
        nombre_it: translatedIT
      })
      
      toast({ title: '✨ Traducción completada' })
    } catch (error) {
      console.error('Error translating:', error)
      toast({ title: 'Error al traducir', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleTranslateProject = async () => {
    if (!projectForm.nombre) {
      toast({ title: 'Escribe primero el texto en español', variant: 'destructive' })
      return
    }
    
    setSaving(true)
    try {
      // Función para traducir usando MyMemory API (gratuita)
      const translateText = async (text: string, targetLang: string): Promise<string> => {
        if (!text.trim()) return ''
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`
          )
          const data = await response.json()
          if (data.responseStatus === 200 && data.responseData?.translatedText) {
            const translated = data.responseData.translatedText
            return translated.charAt(0).toUpperCase() + translated.slice(1)
          }
          return text
        } catch {
          return text
        }
      }
      
      // Traducir nombre y descripción en paralelo
      const [nombreEN, nombreIT, descripcionEN, descripcionIT] = await Promise.all([
        translateText(projectForm.nombre, 'en'),
        translateText(projectForm.nombre, 'it'),
        translateText(projectForm.descripcion || '', 'en'),
        translateText(projectForm.descripcion || '', 'it')
      ])
      
      setProjectForm({
        ...projectForm,
        nombre_en: nombreEN,
        nombre_it: nombreIT,
        descripcion_en: descripcionEN,
        descripcion_it: descripcionIT
      })
      
      toast({ title: '✨ Traducción completada' })
    } catch (error) {
      console.error('Error translating:', error)
      toast({ title: 'Error al traducir', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  // Componente de diálogo de selección de imagen
  const ImageSourceDialog = () => (
    <>
      {showImageSourceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageSourceDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Agregar Imagen</h2>
            <p className="text-gray-600 mb-6">¿Desde dónde quieres agregar la imagen?</p>
            
            <div className="space-y-3">
              <button
                onClick={imageSourceType === 'project' ? handleAddImageFromComputer : handleAddCategoryImageFromComputer}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Subir desde mi computadora</p>
                  <p className="text-sm text-gray-500">Seleccionar archivos locales</p>
                </div>
              </button>
              
              <button
                onClick={imageSourceType === 'project' ? handleAddImageFromGallery : handleAddCategoryImageFromGallery}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Galería del Admin</p>
                  <p className="text-sm text-gray-500">Usar imágenes ya subidas</p>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowImageSourceDialog(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  )

  // Componente de modal de galería
  const GalleryModal = () => {
    if (!showGalleryModal) return null
    
    const filteredImages = galleryImages.filter(img => 
      img.name.toLowerCase().includes(gallerySearchTerm.toLowerCase())
    )
    
    const isMultiSelect = imageSourceType === 'project'
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => {
        setShowGalleryModal(false)
        setSelectedGalleryImages([])
      }}>
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Galería de Imágenes</h2>
                {isMultiSelect && selectedGalleryImages.length > 0 && (
                  <p className="text-sm text-blue-600 mt-1">{selectedGalleryImages.length} imagen{selectedGalleryImages.length > 1 ? 'es' : ''} seleccionada{selectedGalleryImages.length > 1 ? 's' : ''}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowGalleryModal(false)
                  setSelectedGalleryImages([])
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar imágenes..."
                value={gallerySearchTerm}
                onChange={(e) => setGallerySearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Grid de imágenes */}
          <div className="p-6 overflow-y-auto flex-1">
            {loadingGalleryImages ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">Cargando imágenes de la galería...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                <p>{gallerySearchTerm ? 'No se encontraron imágenes' : 'No hay imágenes en la galería'}</p>
              </div>
            ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredImages.map((image) => {
                const isSelected = selectedGalleryImages.includes(image.url)
                return (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🔍 CLICKED IMAGE:', { url: image.url, name: image.name });
                      isMultiSelect ? handleToggleImageSelection(image.url) : handleSelectGalleryImage(image.url);
                    }}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:shadow-lg ${
                      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    
                    {/* Checkbox para selección múltiple */}
                    {isMultiSelect && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover:border-blue-400'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 bg-black transition-opacity flex items-end ${
                      isSelected ? 'bg-opacity-30' : 'bg-opacity-0 group-hover:bg-opacity-40'
                    }`}>
                      <div className={`p-2 text-white transition-opacity w-full ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <p className="text-sm font-medium truncate">{image.name}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            {isMultiSelect ? (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowGalleryModal(false)
                    setSelectedGalleryImages([])
                  }}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddSelectedImages}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedGalleryImages.length === 0}
                >
                  Agregar {selectedGalleryImages.length > 0 && `(${selectedGalleryImages.length})`}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowGalleryModal(false)
                  setSelectedGalleryImages([])
                }}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // VISTA: Lista de Categorías
  if (currentView === 'categories') {
    // Calcular total de proyectos
    const totalProjects = categories.reduce((acc, cat) => acc + cat.projects.length, 0)
    
    // Filtrar categorías según búsqueda
    const filteredCategories = categorySearchTerm.trim() 
      ? categories.filter(cat => {
          const search = categorySearchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          const nombre = (cat.nombre || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          const nombreEn = (cat.nombre_en || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          return nombre.includes(search) || nombreEn.includes(search)
        })
      : categories

    return (
      <>
        <ImageSourceDialog />
        <GalleryModal />
        <div className="space-y-6">
        <PageHeader
          title="Categorías de Proyectos"
          description="Organiza y administra las categorías y proyectos del portfolio"
          actions={
            <Button onClick={handleNewCategory} className="bg-black hover:bg-gray-800 text-white whitespace-nowrap px-6 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          }
        />

        {/* Buscador y contador */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {categorySearchTerm && (
              <button
                onClick={() => setCategorySearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-gray-500">Categorías:</span>{' '}
              <span className="font-semibold text-black">{categories.length}</span>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-blue-600">Proyectos totales:</span>{' '}
              <span className="font-semibold text-blue-700">{totalProjects}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => handleViewCategory(category)}
            >
              <div className="h-32 bg-gray-200 relative">
                {category.imagen_portada ? (
                  <img
                    src={category.imagen_portada}
                    alt={category.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-base font-semibold mb-0.5 truncate">{category.nombre}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{category.projects.length} proyecto{category.projects.length !== 1 ? 's' : ''}</p>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleViewCategory(category)}
                    className="flex-1 py-1.5 px-2 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="w-3 h-3 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.nombre)}
                    className="py-1.5 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No hay categorías. Crea la primera.</p>
          </div>
        )}
        </div>
      </>
    )
  }

  // VISTA: Detalle de Categoría con sus Proyectos
  if (currentView === 'category-detail' && selectedCategory) {
    // Guardar la imagen original para poder deshacer
    const originalImage = (selectedCategory as any).imagen_portada || selectedCategory.cover_image_url || ''
    const imageChanged = categoryForm.imagen_portada !== originalImage
    
    return (
      <>
        <ImageSourceDialog />
        <GalleryModal />
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToCategories}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a categorías
          </button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(`http://localhost:5173/es/proyectos/${selectedCategory.slug}`, '_blank')}
            className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
            Vista previa
          </Button>
        </div>

        <form onSubmit={handleSaveCategory} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Foto de Portada */}
            <div className="w-full md:w-48 flex-shrink-0">
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">Foto de Portada</Label>
              <div className="relative group">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden border border-gray-300">
                  {categoryForm.imagen_portada ? (
                    <img
                      src={categoryForm.imagen_portada}
                      alt={categoryForm.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-1" />
                      <span className="text-xs">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 mt-2">
                  <Button
                    type="button"
                    onClick={handleAddCategoryImage}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {categoryForm.imagen_portada ? 'Cambiar' : 'Agregar'}
                  </Button>
                  {imageChanged && (
                    <Button
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, imagen_portada: originalImage })}
                      variant="outline"
                      size="sm"
                      className="text-xs text-orange-600 border-orange-300 hover:bg-orange-50"
                      title="Deshacer cambio de imagen"
                    >
                      ↩️
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Información de la Categoría */}
            <div className="flex-1 space-y-4">
              {/* Tabs de idiomas */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveLanguageTab('ES')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                    activeLanguageTab === 'ES'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-base">🇪🇸</span> ES
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguageTab('EN')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                    activeLanguageTab === 'EN'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-base">🇬🇧</span> EN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguageTab('IT')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                    activeLanguageTab === 'IT'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-base">🇮🇹</span> IT
                </button>
              </div>

              {/* Contenido según tab activo */}
              <div className="pt-2">
                {activeLanguageTab === 'ES' && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre</Label>
                    <Input
                      placeholder="Nombre de la categoría"
                      value={categoryForm.nombre}
                      onChange={(e) => setCategoryForm({ ...categoryForm, nombre: e.target.value })}
                      required
                      className="text-xl font-bold py-2 px-3"
                    />
                  </div>
                )}

                {activeLanguageTab === 'EN' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">Name</Label>
                      <Button
                        type="button"
                        onClick={handleTranslateCategory}
                        disabled={saving || !categoryForm.nombre}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        ✨ Traducir con IA
                      </Button>
                    </div>
                    <Input
                      placeholder="Category name"
                      value={categoryForm.nombre_en}
                      onChange={(e) => setCategoryForm({ ...categoryForm, nombre_en: e.target.value })}
                      className="text-xl font-bold py-2 px-3"
                    />
                  </div>
                )}

                {activeLanguageTab === 'IT' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">Nome</Label>
                      <Button
                        type="button"
                        onClick={handleTranslateCategory}
                        disabled={saving || !categoryForm.nombre}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        ✨ Traducir con IA
                      </Button>
                    </div>
                    <Input
                      placeholder="Nome della categoria"
                      value={categoryForm.nombre_it}
                      onChange={(e) => setCategoryForm({ ...categoryForm, nombre_it: e.target.value })}
                      className="text-xl font-bold py-2 px-3"
                    />
                  </div>
                )}
              </div>

              {/* Alerta de traducciones faltantes */}
              {categoryForm.nombre && (!categoryForm.nombre_en || !categoryForm.nombre_it) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">Traducciones pendientes</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Faltan traducciones: {!categoryForm.nombre_en && '🇬🇧 Inglés'} {!categoryForm.nombre_en && !categoryForm.nombre_it && 'y'} {!categoryForm.nombre_it && '🇮🇹 Italiano'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={saving} 
                  size="sm"
                  className={`${
                    saved || saving
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar'}
                </Button>
              </div>
            
            </div>
          </div>
        </form>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Proyectos ({selectedCategory.projects.length})
          </h2>
          <Button onClick={handleNewProject} className="bg-black hover:bg-gray-800 text-white whitespace-nowrap px-8 py-2">
            <Plus className="w-4 h-4 mr-2" />
            NuevoProyecto
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {selectedCategory.projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleEditProject(project)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
            >
              <div className="h-32 bg-gray-200 relative">
                {project.imagenes && project.imagenes.length > 0 ? (
                  <>
                    <img
                      src={project.imagenes[0]}
                      alt={project.nombre}
                      className="w-full h-full object-cover"
                    />
                    {project.imagenes.length > 1 && (
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1.5 py-0.5 rounded text-xs">
                        +{project.imagenes.length - 1}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-0.5 truncate">{project.nombre}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{project.nombre_en}</p>
                {project.descripcion && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {project.descripcion}
                  </p>
                )}
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex-1 py-1.5 px-2 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="w-3 h-3 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.nombre)}
                    className="py-1.5 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCategory.projects.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-white rounded-lg">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No hay proyectos en esta categoría.</p>
            <Button onClick={handleNewProject} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Crear el primero
            </Button>
          </div>
        )}
        </div>
      </>
    )
  }

  // VISTA: Formulario de Categoría
  if (currentView === 'edit-category') {
    return (
      <>
        <ImageSourceDialog />
        <GalleryModal />
        <div className="space-y-6">
        <button
          onClick={navigateToCategories}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {editingCategory ? 'Edita el nombre y la imagen de portada' : 'Completa la información para crear una nueva categoría'}
            </p>
          </div>

          <form onSubmit={handleSaveCategory}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Columna Izquierda: Foto */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Foto de Portada</Label>
                
                {categoryForm.imagen_portada ? (
                  <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={categoryForm.imagen_portada}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddCategoryImage}
                        className="opacity-0 group-hover:opacity-100 bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg transition-all transform scale-90 group-hover:scale-100"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, imagen_portada: '' })}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all transform scale-90 group-hover:scale-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-3">Sin foto de portada</p>
                    <Button type="button" onClick={handleAddCategoryImage} variant="outline" size="sm">
                      Seleccionar Foto
                    </Button>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 italic">
                  💡 Esta imagen se mostrará como portada de la categoría
                </p>
              </div>

              {/* Columna Derecha: Información */}
              <div className="space-y-6">
                {/* Tabs de idiomas */}
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveCategoryLanguageTab('ES')}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeCategoryLanguageTab === 'ES'
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base">🇪🇸</span> ES
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategoryLanguageTab('EN')}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeCategoryLanguageTab === 'EN'
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base">🇬🇧</span> EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategoryLanguageTab('IT')}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeCategoryLanguageTab === 'IT'
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base">🇮🇹</span> IT
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  {activeCategoryLanguageTab === 'ES' && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Nombre</Label>
                      <Input
                        placeholder="Nombre de la categoría"
                        value={categoryForm.nombre}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nombre: e.target.value })}
                        required
                        className="text-lg font-semibold"
                      />
                    </div>
                  )}

                  {activeCategoryLanguageTab === 'EN' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-gray-700">Name</Label>
                        <Button
                          type="button"
                          onClick={handleTranslateCategory}
                          disabled={saving || !categoryForm.nombre}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          title={!categoryForm.nombre ? 'Primero escribe el nombre en español (ES)' : 'Traducir automáticamente'}
                        >
                          ✨ Traducir con IA
                        </Button>
                      </div>
                      {!categoryForm.nombre && (
                        <p className="text-xs text-amber-600 mb-2">⚠️ Primero escribe el nombre en español (tab ES)</p>
                      )}
                      <Input
                        placeholder="Category name"
                        value={categoryForm.nombre_en}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nombre_en: e.target.value })}
                        className="text-lg font-semibold"
                      />
                    </div>
                  )}

                  {activeCategoryLanguageTab === 'IT' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-gray-700">Nome</Label>
                        <Button
                          type="button"
                          onClick={handleTranslateCategory}
                          disabled={saving || !categoryForm.nombre}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          title={!categoryForm.nombre ? 'Primero escribe el nombre en español (ES)' : 'Traducir automáticamente'}
                        >
                          ✨ Traducir con IA
                        </Button>
                      </div>
                      {!categoryForm.nombre && (
                        <p className="text-xs text-amber-600 mb-2">⚠️ Primero escribe el nombre en español (tab ES)</p>
                      )}
                      <Input
                        placeholder="Nome della categoria"
                        value={categoryForm.nombre_it}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nombre_it: e.target.value })}
                        className="text-lg font-semibold"
                      />
                    </div>
                  )}
                </div>

                {/* Alerta de traducciones faltantes */}
                {categoryForm.nombre && (!categoryForm.nombre_en || !categoryForm.nombre_it) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">Traducciones pendientes</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Faltan traducciones: {!categoryForm.nombre_en && '🇬🇧 Inglés'} {!categoryForm.nombre_en && !categoryForm.nombre_it && 'y'} {!categoryForm.nombre_it && '🇮🇹 Italiano'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    size="sm"
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {saving ? 'Guardando...' : editingCategory ? 'Guardar' : '+ Crear Categoría'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={navigateToCategories}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
        </div>
      </>
    )
  }

  // VISTA: Formulario de Proyecto
  if (currentView === 'edit-project') {
    const projectSlug = editingProject?.slug || ''
    const categorySlug = selectedCategory?.slug || ''
    
    return (
      <>
        <ImageSourceDialog />
        <GalleryModal />
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => selectedCategory && navigateToCategoryDetail(selectedCategory)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a proyectos
          </button>
          {editingProject && projectSlug && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(`http://localhost:5173/es/proyectos/${categorySlug}/${projectSlug}`, '_blank')}
              className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
              Vista previa
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              {editingProject ? (editingProject as any).nombre : 'Nuevo Proyecto'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {editingProject ? 'Edita la información y fotos del proyecto' : 'Completa la información para crear un nuevo proyecto'}
            </p>
          </div>

          <form onSubmit={handleSaveProject}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Columna Izquierda: Fotos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Fotografías</Label>
                  <Button type="button" onClick={handleAddImage} size="sm" className="bg-black hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Foto
                  </Button>
                </div>

                {projectForm.imagenes.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-3">No hay fotos</p>
                    <Button type="button" onClick={handleAddImage} variant="outline" size="sm">
                      Agregar la primera foto
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(() => {
                      // Debug: Log para ver qué contiene imagenes
                      console.log('🖼️ PROJECT IMAGES DEBUG:', {
                        imagenes: projectForm.imagenes,
                        length: projectForm.imagenes.length,
                        types: projectForm.imagenes.map(img => typeof img),
                        first3: projectForm.imagenes.slice(0, 3)
                      });
                      return null;
                    })()}
                    {projectForm.imagenes.map((img, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all">
                        <img
                          src={img}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all transform scale-90 group-hover:scale-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {index === 0 ? '⭐ Principal' : `Foto ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 italic">
                  💡 La primera foto será la imagen principal
                </p>
              </div>

              {/* Columna Derecha: Información */}
              <div className="space-y-6">
                {/* Tabs de idiomas */}
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveProjectLanguageTab('ES')}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeProjectLanguageTab === 'ES'
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base">🇪🇸</span> ES
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProjectLanguageTab('EN')}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeProjectLanguageTab === 'EN'
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base">🇬🇧</span> EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProjectLanguageTab('IT')}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeProjectLanguageTab === 'IT'
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base">🇮🇹</span> IT
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  {activeProjectLanguageTab === 'ES' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Nombre</Label>
                        <Input
                          placeholder="Nombre del proyecto"
                          value={projectForm.nombre}
                          onChange={(e) => setProjectForm({ ...projectForm, nombre: e.target.value })}
                          required
                          className="text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Descripción (opcional)</Label>
                        <textarea
                          placeholder="Descripción del proyecto"
                          value={projectForm.descripcion}
                          onChange={(e) => setProjectForm({ ...projectForm, descripcion: e.target.value })}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {activeProjectLanguageTab === 'EN' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-gray-700">Name</Label>
                        <Button
                          type="button"
                          onClick={handleTranslateProject}
                          disabled={saving || !projectForm.nombre}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          ✨ Traducir con IA
                        </Button>
                      </div>
                      <div>
                        <Input
                          placeholder="Project name"
                          value={projectForm.nombre_en}
                          onChange={(e) => setProjectForm({ ...projectForm, nombre_en: e.target.value })}
                          className="text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Description (optional)</Label>
                        <textarea
                          placeholder="Project description"
                          value={projectForm.descripcion_en}
                          onChange={(e) => setProjectForm({ ...projectForm, descripcion_en: e.target.value })}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {activeProjectLanguageTab === 'IT' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-gray-700">Nome</Label>
                        <Button
                          type="button"
                          onClick={handleTranslateProject}
                          disabled={saving || !projectForm.nombre}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          ✨ Traducir con IA
                        </Button>
                      </div>
                      <div>
                        <Input
                          placeholder="Nome del progetto"
                          value={projectForm.nombre_it}
                          onChange={(e) => setProjectForm({ ...projectForm, nombre_it: e.target.value })}
                          className="text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Descrizione (opzionale)</Label>
                        <textarea
                          placeholder="Descrizione del progetto"
                          value={projectForm.descripcion_it}
                          onChange={(e) => setProjectForm({ ...projectForm, descripcion_it: e.target.value })}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Alerta de traducciones faltantes */}
                {projectForm.nombre && (!projectForm.nombre_en || !projectForm.nombre_it) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">Traducciones pendientes</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Faltan traducciones: {!projectForm.nombre_en && '🇬🇧 Inglés'} {!projectForm.nombre_en && !projectForm.nombre_it && 'y'} {!projectForm.nombre_it && '🇮🇹 Italiano'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    size="sm"
                    className={`transition-all ${
                      saved || saving
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {saving ? '✓ Guardado!' : saved ? '✓ Guardado!' : editingProject ? 'Guardar' : '+ Crear Proyecto'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
        </div>
      </>
    )
  }

  return null
}
