import { useEffect, useState } from 'react'
import { USE_MOCK_DATA, mockData, type Category, type Project, supabase } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { useToast } from '@beltrame/shared'
import { Plus, Trash2, Edit, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../../shared'

interface CategoryWithProjects extends Category {
  projects: Project[]
}

type View = 'categories' | 'category-detail' | 'edit-category' | 'edit-project'

export default function ProductosSimple() {
  const [categories, setCategories] = useState<CategoryWithProjects[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentView, setCurrentView] = useState<View>('categories')
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
  
  // Imágenes de ejemplo para la galería (en producción vendrían de Supabase)
  const galleryImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', name: 'Casa Moderna 1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400', name: 'Casa Moderna 2' },
    { id: 3, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', name: 'Escalera Metal' },
    { id: 4, url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400', name: 'Barandilla' },
    { id: 5, url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400', name: 'Puerta de Hierro' },
    { id: 6, url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400', name: 'Pérgola' },
    { id: 7, url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400', name: 'Mueble Metal' },
    { id: 8, url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400', name: 'Detalle Cobre' },
    { id: 9, url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', name: 'Escalera Exterior' },
    { id: 10, url: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400', name: 'Cristalera' },
    { id: 11, url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400', name: 'Barbacoa' },
    { id: 12, url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400', name: 'Mampara' },
  ]
  
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
        const processedCategories: any[] = categoriesData.map((cat: any) => {
          const catTranslations = translationsData.filter((t: any) => t.entity_type === 'category' && t.entity_id === cat.id)
          
          const nombre = catTranslations.find((t: any) => t.language_code === 'es' && t.field_name === 'name')?.value || ''
          const nombre_en = catTranslations.find((t: any) => t.language_code === 'en' && t.field_name === 'name')?.value || ''
          const nombre_it = catTranslations.find((t: any) => t.language_code === 'it' && t.field_name === 'name')?.value || ''
          
          // Filter projects for this category
          const catProjects = projectsData.filter((p: any) => p.category_id === cat.id).map((p: any) => {
            const projTranslations = translationsData.filter((t: any) => t.entity_type === 'project' && t.entity_id === p.id)
            
            const pNombre = projTranslations.find((t: any) => t.language_code === 'es' && t.field_name === 'name')?.value || ''
            const pNombre_en = projTranslations.find((t: any) => t.language_code === 'en' && t.field_name === 'name')?.value || ''
            const pNombre_it = projTranslations.find((t: any) => t.language_code === 'it' && t.field_name === 'name')?.value || ''
            
            const pDesc = projTranslations.find((t: any) => t.language_code === 'es' && t.field_name === 'description')?.value || ''
            const pDesc_en = projTranslations.find((t: any) => t.language_code === 'en' && t.field_name === 'description')?.value || ''
            const pDesc_it = projTranslations.find((t: any) => t.language_code === 'it' && t.field_name === 'description')?.value || ''

            return {
              id: p.id,
              categoria_id: p.category_id,
              nombre: pNombre,
              nombre_en: pNombre_en,
              nombre_it: pNombre_it,
              descripcion: pDesc,
              descripcion_en: pDesc_en,
              descripcion_it: pDesc_it,
              imagenes: p.image_urls || [],
              orden: p.display_order,
              activo: p.is_active,
              created_at: p.created_at,
              updated_at: p.updated_at
            }
          })

          return {
            id: cat.id,
            nombre: nombre,
            nombre_en: nombre_en,
            nombre_it: nombre_it,
            descripcion: '',
            descripcion_en: '',
            descripcion_it: '',
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

  // Ver detalle de categoría y sus proyectos
  const handleViewCategory = (category: CategoryWithProjects) => {
    setSelectedCategory(category)
    setSaved(false) // Reset saved state when viewing a category
    setCurrentView('category-detail')
  }

  // Nueva categoría
  const handleNewCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ nombre: '', nombre_en: '', nombre_it: '', imagen_portada: '' })
    setCurrentView('edit-category')
  }

  // Guardar categoría
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== handleSaveCategory called ===')
    console.log('categoryForm:', categoryForm)
    console.log('USE_MOCK_DATA:', USE_MOCK_DATA)
    
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
        }
      }
      
      toast({
        title: editingCategory ? '✓ Categoría actualizada' : '✓ Categoría creada',
        description: `"${categoryForm.nombre}" se guardó correctamente`,
        className: 'bg-green-600 text-white border-green-600',
      })
      setSaved(true)
      // Volver a la vista de categorías
      setTimeout(() => {
        setCurrentView('categories')
        setEditingCategory(null)
      }, 500)
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
        const category = categories.find(c => c.nombre === categoryName)
        if (category) {
           const { error } = await supabase.from('categories').delete().eq('id', category.id)
           if (error) {
             console.error(error)
             toast({ title: 'Error al eliminar', variant: 'destructive' })
             return
           }
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
    setCurrentView('edit-project')
  }

  // Editar proyecto
  const handleEditProject = (project: Project) => {
    setSaved(false) // Reset saved state
    
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
    setCurrentView('edit-project')
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
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.id === projectForm.categoria_id
                ? { ...cat, projects: [...cat.projects, newProject] }
                : cat
            )
          )
          
          // Actualizar selectedCategory si existe
          if (selectedCategory && selectedCategory.id === projectForm.categoria_id) {
            setSelectedCategory({
              ...selectedCategory,
              projects: [...selectedCategory.projects, newProject]
            })
          }
          
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
      
      toast({
        title: editingProject ? '✓ Proyecto actualizado' : '✓ Proyecto creado',
        description: `"${projectForm.nombre}" se guardó correctamente`,
        className: 'bg-green-600 text-white border-green-600',
      })
      setSaved(true)
      // Volver a la vista de detalle de categoría
      setTimeout(() => {
        setCurrentView('category-detail')
        setEditingProject(null)
      }, 500)
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
         const { data, error } = await supabase
           .from('projects')
           .delete()
           .eq('id', projectId)
           .select()
         
         console.log('Delete result:', { data, error })
         
         if (error) {
           console.error(error)
           toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' })
           return
         }
         
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
         
         console.log('Project deleted successfully from UI')
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
      }
      toast({ title: 'Proyecto eliminado' })
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
      // Simulación de traducción con IA (aquí conectarías con OpenAI/Claude)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Traducciones básicas de ejemplo
      const translationsEN: { [key: string]: string } = {
        'barandillas': 'railings',
        'barbacoas': 'bbq',
        'carteles': 'signs',
        'cobre': 'copper',
        'corte láser': 'laser cutting',
        'cristaleras': 'glass walls',
        'escaleras': 'stairs',
        'espejos': 'mirrors',
        'fogoneros': 'fire pits',
        'latón': 'brass',
        'mamparas': 'shower screens',
        'muebles': 'furniture',
        'pérgolas': 'pergolas',
        'puertas': 'doors',
        'tarimas': 'platforms'
      }

      const translationsIT: { [key: string]: string } = {
        'barandillas': 'ringhiere',
        'barbacoas': 'barbecue',
        'carteles': 'insegne',
        'cobre': 'rame',
        'corte láser': 'taglio laser',
        'cristaleras': 'vetrate',
        'escaleras': 'scale',
        'espejos': 'specchi',
        'fogoneros': 'bracieri',
        'latón': 'ottone',
        'mamparas': 'paraventi doccia',
        'muebles': 'mobili',
        'pérgolas': 'pergole',
        'puertas': 'porte',
        'tarimas': 'pedane'
      }
      
      const nombreLower = categoryForm.nombre.toLowerCase()
      const traduccionEN = translationsEN[nombreLower] || categoryForm.nombre
      const traduccionIT = translationsIT[nombreLower] || categoryForm.nombre
      
      setCategoryForm({
        ...categoryForm,
        nombre_en: traduccionEN.charAt(0).toUpperCase() + traduccionEN.slice(1),
        nombre_it: traduccionIT.charAt(0).toUpperCase() + traduccionIT.slice(1)
      })
      
      toast({ title: '✨ Traducción completada (ES → EN → IT)' })
    } catch (error) {
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
      // Simulación de traducción con IA
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Traducciones básicas EN
      const translationsEN: { [key: string]: string } = {
        'casa': 'house',
        'prueba': 'test',
        'pasamanos': 'handrail',
        'barandilla': 'railing',
        'barbacoa': 'bbq',
        'cartel': 'sign',
        'puerta': 'door',
        'mesa': 'table',
        'silla': 'chair',
        'espejo': 'mirror',
        'pérgola': 'pergola',
        'pergola': 'pergola',
        'tarima': 'platform',
        'mueble': 'furniture',
        'mampara': 'shower screen',
        'escalera': 'staircase',
        'ventana': 'window',
        'cocina': 'kitchen',
        'baño': 'bathroom',
        'dormitorio': 'bedroom',
        'salon': 'living room',
        'salón': 'living room',
        'jardin': 'garden',
        'jardín': 'garden',
        'piscina': 'pool',
        'garaje': 'garage',
        'balcon': 'balcony',
        'balcón': 'balcony',
        'techo': 'roof',
        'pared': 'wall',
        'suelo': 'floor',
        'cobre': 'copper',
        'acero': 'steel',
        'aluminio': 'aluminum',
        'bronce': 'bronze',
        'laton': 'brass',
        'latón': 'brass',
        'en': 'in',
        'de': 'of',
        'con': 'with',
        'para': 'for',
        'y': 'and',
        'el': 'the',
        'la': 'the',
        'los': 'the',
        'las': 'the',
        'un': 'a',
        'una': 'a',
        'moderna': 'modern',
        'moderno': 'modern',
        'rustica': 'rustic',
        'rustico': 'rustic',
        'rústica': 'rustic',
        'rústico': 'rustic',
        'hierro': 'iron',
        'madera': 'wood',
        'cristal': 'glass',
        'terraza': 'terrace',
        'exterior': 'outdoor',
        'interior': 'indoor'
      }

      // Traducciones básicas IT
      const translationsIT: { [key: string]: string } = {
        'casa': 'casa',
        'prueba': 'prova',
        'pasamanos': 'corrimano',
        'barandilla': 'ringhiera',
        'barbacoa': 'barbecue',
        'cartel': 'insegna',
        'puerta': 'porta',
        'mesa': 'tavolo',
        'silla': 'sedia',
        'espejo': 'specchio',
        'pérgola': 'pergola',
        'pergola': 'pergola',
        'tarima': 'pedana',
        'mueble': 'mobile',
        'mampara': 'paravento doccia',
        'escalera': 'scala',
        'ventana': 'finestra',
        'cocina': 'cucina',
        'baño': 'bagno',
        'dormitorio': 'camera da letto',
        'salon': 'soggiorno',
        'salón': 'soggiorno',
        'jardin': 'giardino',
        'jardín': 'giardino',
        'piscina': 'piscina',
        'garaje': 'garage',
        'balcon': 'balcone',
        'balcón': 'balcone',
        'techo': 'tetto',
        'pared': 'parete',
        'suelo': 'pavimento',
        'cobre': 'rame',
        'acero': 'acciaio',
        'aluminio': 'alluminio',
        'bronce': 'bronzo',
        'laton': 'ottone',
        'latón': 'ottone',
        'en': 'in',
        'de': 'di',
        'con': 'con',
        'para': 'per',
        'y': 'e',
        'el': 'il',
        'la': 'la',
        'los': 'i',
        'las': 'le',
        'un': 'un',
        'una': 'una',
        'moderna': 'moderna',
        'moderno': 'moderno',
        'rustica': 'rustica',
        'rustico': 'rustico',
        'rústica': 'rustica',
        'rústico': 'rustico',
        'hierro': 'ferro',
        'madera': 'legno',
        'cristal': 'vetro',
        'terraza': 'terrazza',
        'exterior': 'esterno',
        'interior': 'interno'
      }
      
      // Traducción palabra por palabra (simulado)
      const palabras = projectForm.nombre.toLowerCase().split(' ')
      const traducidasEN = palabras.map(p => translationsEN[p] || p)
      const traducidasIT = palabras.map(p => translationsIT[p] || p)
      const nombreTraducidoEN = traducidasEN.join(' ')
      const nombreTraducidoIT = traducidasIT.join(' ')
      
      // Traducir descripción
      let descripcionTraducidaEN = ''
      let descripcionTraducidaIT = ''
      if (projectForm.descripcion) {
        const palabrasDesc = projectForm.descripcion.toLowerCase().split(' ')
        const traducidasDescEN = palabrasDesc.map(p => translationsEN[p] || p)
        const traducidasDescIT = palabrasDesc.map(p => translationsIT[p] || p)
        descripcionTraducidaEN = traducidasDescEN.join(' ')
        descripcionTraducidaIT = traducidasDescIT.join(' ')
      }
      
      setProjectForm({
        ...projectForm,
        nombre_en: nombreTraducidoEN.charAt(0).toUpperCase() + nombreTraducidoEN.slice(1),
        nombre_it: nombreTraducidoIT.charAt(0).toUpperCase() + nombreTraducidoIT.slice(1),
        descripcion_en: descripcionTraducidaEN ? descripcionTraducidaEN.charAt(0).toUpperCase() + descripcionTraducidaEN.slice(1) : '',
        descripcion_it: descripcionTraducidaIT ? descripcionTraducidaIT.charAt(0).toUpperCase() + descripcionTraducidaIT.slice(1) : ''
      })
      
      toast({ title: '✨ Traducción completada (ES → EN → IT)' })
    } catch (error) {
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredImages.map((image) => {
                const isSelected = selectedGalleryImages.includes(image.url)
                return (
                  <button
                    key={image.id}
                    onClick={() => isMultiSelect ? handleToggleImageSelection(image.url) : handleSelectGalleryImage(image.url)}
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
            
            {filteredImages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No se encontraron imágenes</p>
                <p className="text-sm">Intenta con otro término de búsqueda</p>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category) => (
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
                <h3 className="text-base font-semibold mb-1 truncate">{category.nombre}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{category.nombre_en}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">
                    {category.projects.length} proyecto{category.projects.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleViewCategory(category)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.nombre)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
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
    // Inicializar formulario con datos de la categoría si no está ya inicializado
    if (categoryForm.nombre !== selectedCategory.nombre) {
      setCategoryForm({
        nombre: selectedCategory.nombre,
        nombre_en: selectedCategory.nombre_en || '',
        nombre_it: selectedCategory.nombre_it || '',
        imagen_portada: selectedCategory.imagen_portada || '',
      })
    }

    return (
      <>
        <ImageSourceDialog />
        <GalleryModal />
        <div className="space-y-6">
        <button
          onClick={() => setCurrentView('categories')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a categorías
        </button>

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
                <Button
                  type="button"
                  onClick={handleAddCategoryImage}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs whitespace-nowrap"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {categoryForm.imagen_portada ? 'Cambiar Foto' : 'Agregar Foto'}
                </Button>
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
          onClick={() => setCurrentView('categories')}
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
                        >
                          ✨ Traducir con IA
                        </Button>
                      </div>
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
                        >
                          ✨ Traducir con IA
                        </Button>
                      </div>
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
                    onClick={() => setCurrentView('categories')}
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
    return (
      <>
        <ImageSourceDialog />
        <GalleryModal />
        <div className="space-y-6">
        <button
          onClick={() => setCurrentView('category-detail')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a proyectos
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              {editingProject ? editingProject.nombre : 'Nuevo Proyecto'}
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
