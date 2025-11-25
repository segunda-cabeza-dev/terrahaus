import { useEffect, useState } from 'react'
import { USE_MOCK_DATA, mockData, type Category, type Project } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { useToast } from '@beltrame/shared'
import { Plus, Trash2, Edit, Image as ImageIcon, ArrowLeft } from 'lucide-react'

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
        const categoriesWithProjects: CategoryWithProjects[] = mockData.categories.map(cat => ({
          ...cat,
          projects: mockData.projects.filter(p => p.categoria_id === cat.id)
        }))
        setCategories(categoriesWithProjects)
      }
    } catch (error) {
      console.error('Error loading data:', error)
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
    setSaving(true)
    setSaved(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast({
        title: editingCategory ? 'Categoría actualizada' : 'Categoría creada',
        className: 'bg-green-600 text-white border-green-600',
      })
      await loadData()
      setSaved(true)
      // No cambiar de vista, quedarse en category-detail
    } catch (error) {
      toast({
        title: 'Error al guardar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Eliminar categoría
  const handleDeleteCategory = (categoryName: string) => {
    if (confirm(`¿Eliminar la categoría "${categoryName}" y todos sus proyectos?`)) {
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
    setEditingProject(project)
    setProjectForm({
      categoria_id: project.categoria_id,
      nombre: project.nombre,
      nombre_en: project.nombre_en || '',
      nombre_it: project.nombre_it || '',
      descripcion: project.descripcion || '',
      descripcion_en: project.descripcion_en || '',
      descripcion_it: project.descripcion_it || '',
      imagenes: project.imagenes || [],
    })
    setCurrentView('edit-project')
  }

  // Guardar proyecto
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast({
        title: editingProject ? 'Proyecto actualizado' : 'Proyecto creado',
        className: 'bg-green-600 text-white border-green-600',
      })
      await loadData()
      setSaved(true)
      setTimeout(() => {
        setCurrentView('category-detail')
      }, 1000)
    } catch (error) {
      toast({
        title: 'Error al guardar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Eliminar proyecto
  const handleDeleteProject = (projectName: string) => {
    if (confirm(`¿Eliminar el proyecto "${projectName}"?`)) {
      toast({ title: 'Proyecto eliminado' })
      loadData()
    }
  }

  // Agregar imagen a proyecto desde archivo
  const handleAddImage = () => {
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
  }

  // Agregar imagen de portada para categoría
  const handleAddCategoryImage = () => {
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
  }

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    setProjectForm({
      ...projectForm,
      imagenes: projectForm.imagenes.filter((_, i) => i !== index)
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
        'pasamanos': 'handrail',
        'barandilla': 'railing',
        'barbacoa': 'bbq',
        'cartel': 'sign',
        'puerta': 'door',
        'mesa': 'table',
        'silla': 'chair',
        'espejo': 'mirror',
        'pérgola': 'pergola',
        'tarima': 'platform',
        'mueble': 'furniture',
        'mampara': 'shower screen',
        'escalera': 'staircase',
        'en': 'on',
        'de': 'of',
        'con': 'with',
        'para': 'for',
        'moderna': 'modern',
        'rustica': 'rustic',
        'hierro': 'iron',
        'madera': 'wood',
        'cristal': 'glass',
        'terraza': 'terrace'
      }

      // Traducciones básicas IT
      const translationsIT: { [key: string]: string } = {
        'pasamanos': 'corrimano',
        'barandilla': 'ringhiera',
        'barbacoa': 'barbecue',
        'cartel': 'insegna',
        'puerta': 'porta',
        'mesa': 'tavolo',
        'silla': 'sedia',
        'espejo': 'specchio',
        'pérgola': 'pergola',
        'tarima': 'pedana',
        'mueble': 'mobile',
        'mampara': 'paravento doccia',
        'escalera': 'scala',
        'en': 'in',
        'de': 'di',
        'con': 'con',
        'para': 'per',
        'moderna': 'moderna',
        'rustica': 'rustica',
        'hierro': 'ferro',
        'madera': 'legno',
        'cristal': 'vetro',
        'terraza': 'terrazza'
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

  // VISTA: Lista de Categorías
  if (currentView === 'categories') {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        {USE_MOCK_DATA && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800">🎮 Modo DEMO</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Categorías de Proyectos</h1>
          <Button onClick={handleNewCategory} className="bg-black hover:bg-gray-800 text-white whitespace-nowrap px-6 py-2 min-w-[180px]">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

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
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => setCurrentView('categories')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a categorías
        </button>

        <form onSubmit={handleSaveCategory} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Foto de Portada */}
            <div className="w-48 flex-shrink-0">
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
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  🇪🇸 Nombre
                </Label>
                <Input
                  placeholder="Nombre de la categoría"
                  value={categoryForm.nombre}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nombre: e.target.value })}
                  required
                  className="text-2xl font-bold py-2 px-3"
                />
              </div>

              <div>
                {/* ...otros campos y botones... */}
                      </div>
                    )
            </div>
          </div>
        </form>

        <div className="flex justify-between items-center mb-6">
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
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
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
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex-1 py-1.5 px-2 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="w-3 h-3 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.nombre)}
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
    )
  }

  // VISTA: Formulario de Categoría
  if (currentView === 'edit-category') {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentView('categories')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h1>

          <form onSubmit={handleSaveCategory} className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">🇪🇸 Español</Label>
              <Input
                placeholder="Nombre de la categoría"
                value={categoryForm.nombre}
                onChange={(e) => setCategoryForm({ ...categoryForm, nombre: e.target.value })}
                required
                className="text-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">🇬🇧 English</Label>
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
                className="text-lg"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Foto de Portada</Label>
              <Button
                type="button"
                onClick={handleAddCategoryImage}
                variant="outline"
                className="w-full mb-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                {categoryForm.imagen_portada ? 'Cambiar Foto' : 'Seleccionar Foto'}
              </Button>
              {categoryForm.imagen_portada && (
                <div className="mt-4">
                  <img
                    src={categoryForm.imagen_portada}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Esta imagen se mostrará como portada de la categoría
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1 py-3 text-base">
                {saving ? 'Guardando...' : editingCategory ? 'Guardar' : 'Crear Categoría'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentView('categories')}
                className="px-6"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // VISTA: Formulario de Proyecto
  if (currentView === 'edit-project') {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => setCurrentView('category-detail')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a proyectos
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">
              {editingProject ? `Editar Proyecto: ${editingProject.nombre}` : 'Nuevo Proyecto'}
            </h1>
          </div>

          <form onSubmit={handleSaveProject} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda: Fotos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Fotos del Proyecto</Label>
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
                  <div className="space-y-3">
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
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      🇪🇸 Español
                    </Label>
                    <Input
                      placeholder="Nombre del proyecto"
                      value={projectForm.nombre}
                      onChange={(e) => setProjectForm({ ...projectForm, nombre: e.target.value })}
                      required
                      className="text-lg font-semibold mb-3"
                    />
                    <textarea
                      placeholder="Descripción del proyecto (opcional)"
                      value={projectForm.descripcion}
                      onChange={(e) => setProjectForm({ ...projectForm, descripcion: e.target.value })}
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        🇬🇧 English
                      </Label>
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
                    <Input
                      placeholder="Project name"
                      value={projectForm.nombre_en}
                      onChange={(e) => setProjectForm({ ...projectForm, nombre_en: e.target.value })}
                      className="text-lg mb-3"
                    />
                    <textarea
                      placeholder="Project description (optional)"
                      value={projectForm.descripcion_en}
                      onChange={(e) => setProjectForm({ ...projectForm, descripcion_en: e.target.value })}
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      🇮🇹 Italiano
                    </Label>
                    <Input
                      placeholder="Nome del progetto"
                      value={projectForm.nombre_it}
                      onChange={(e) => setProjectForm({ ...projectForm, nombre_it: e.target.value })}
                      className="text-lg mb-3"
                    />
                    <textarea
                      placeholder="Descrizione del progetto (opzionale)"
                      value={projectForm.descripcion_it}
                      onChange={(e) => setProjectForm({ ...projectForm, descripcion_it: e.target.value })}
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    className={`flex-1 py-3 text-base font-semibold transition-all ${
                      saved || saving
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {saving ? '✓ Guardado!' : saved ? '✓ Guardado!' : editingProject ? 'Guardar' : '+ Crear Proyecto'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentView('category-detail')}
                    className="px-8 py-3 border-2"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return null
}
