import { useState, useEffect } from 'react'
import { PageHeader } from '../../shared'
import { ProductImageManager, USE_MOCK_DATA, mockData, type MediaFile, type Category, findImageUsage } from '@beltrame/shared'
import { Trash2, FileImage, Calendar, Search } from 'lucide-react'
import { useToast } from '@beltrame/shared'
import { Switch } from '@beltrame/shared/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'

export function Galeria() {
  const [images, setImages] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [imageUsageMap, setImageUsageMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const { toast } = useToast()

  // Obtener categorías del mock data
  const categories = USE_MOCK_DATA ? mockData.categories : []

  useEffect(() => {
    loadImages()
  }, [])

  async function loadImages() {
    if (USE_MOCK_DATA) {
      // Usar datos mock
      const mockImages: MediaFile[] = mockData.images.map(img => ({
        id: Math.random(),
        name: img.name,
        url: img.url,
        size: img.size,
        type: 'image/jpeg',
        active: true,
        created_at: img.created_at,
        updated_at: img.created_at
      }))
      setMediaFiles(mockImages)
      setImages(mockImages.map(img => img.url))
      
      // Cargar uso de cada imagen
      const usageMap: Record<string, number> = {}
      for (const img of mockImages) {
        const usage = await findImageUsage(img.url)
        usageMap[img.url] = usage.length
      }
      setImageUsageMap(usageMap)
    }
    setLoading(false)
  }

  function handleImagesChange(newImages: string[]) {
    setImages(newImages)
    
    // Agregar solo las imágenes nuevas que no existen
    const newMediaFiles: MediaFile[] = [...mediaFiles]
    
    newImages.forEach((url, index) => {
      const exists = mediaFiles.find(f => f.url === url)
      if (!exists) {
        // Nueva imagen - agregarla
        newMediaFiles.push({
          id: Date.now() + index,
          name: url.split('/').pop() || `image-${Date.now()}.jpg`,
          url,
          size: 0,
          type: 'image/jpeg',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    })
    
    setMediaFiles(newMediaFiles)
    
    // Si se agregaron imágenes nuevas, mostrar toast
    if (newMediaFiles.length > mediaFiles.length) {
      const addedCount = newMediaFiles.length - mediaFiles.length
      toast({
        title: 'Imágenes agregadas',
        description: `Se ${addedCount === 1 ? 'agregó 1 imagen' : `agregaron ${addedCount} imágenes`} a la galería`
      })
    }
  }

  function toggleImageActive(imageUrl: string) {
    setMediaFiles(mediaFiles.map(f => 
      f.url === imageUrl ? { ...f, active: !f.active } : f
    ))
    
    const file = mediaFiles.find(f => f.url === imageUrl)
    toast({
      title: file?.active ? 'Imagen desactivada' : 'Imagen activada',
      description: file?.name
    })
  }

  function handleDeleteImage(imageUrl: string) {
    const usageCount = imageUsageMap[imageUrl] || 0
    const file = mediaFiles.find(f => f.url === imageUrl)
    
    if (usageCount > 0) {
      toast({
        title: 'No se puede eliminar',
        description: `Esta imagen está siendo usada en ${usageCount} lugar${usageCount > 1 ? 'es' : ''}`,
        variant: 'destructive'
      })
      return
    }
    
    // Pedir confirmación
    if (!confirm(`¿Estás seguro que deseas eliminar "${file?.name}"?`)) {
      return
    }
    
    const newImages = images.filter(img => img !== imageUrl)
    setImages(newImages)
    setMediaFiles(mediaFiles.filter(f => f.url !== imageUrl))
    
    toast({
      title: 'Imagen eliminada',
      description: 'La imagen ha sido eliminada de la galería'
    })
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Filtrar imágenes
  const filteredFiles = mediaFiles.filter(file => {
    // Filtro de búsqueda por nombre de proyecto
    let matchesSearch = true
    if (searchTerm.trim() !== '') {
      const projectsUsingImage = mockData.projects.filter(p => 
        p.imagenes?.includes(file.url)
      )
      matchesSearch = projectsUsingImage.some(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre_en.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filtro de estado
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? file.active :
      !file.active
    
    // Filtro de categoría (basado en uso en proyectos)
    let matchesCategory = true
    if (categoryFilter !== 'all') {
      const categoryId = parseInt(categoryFilter)
      const usedInProjects = mockData.projects.filter(p => 
        p.imagenes?.includes(file.url)
      )
      matchesCategory = usedInProjects.some(p => p.categoria_id === categoryId)
    }
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const displayedFiles = filteredFiles

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Galería de Imágenes"
        description="Gestiona las imágenes del sitio web. Arrastra y suelta o haz clic para subir."
      />

      {/* Tabla con información detallada */}
      {mediaFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Información Detallada ({filteredFiles.length})</h2>
          
          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre de proyecto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            
            {/* Filtro de Categoría */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 h-[42px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-white p-2 max-h-[300px] overflow-y-auto">
                <SelectItem value="all" className="pl-3">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()} className="pl-3">
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro de Estado */}
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 h-[42px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-white p-2">
                <SelectItem value="all" className="pl-3">Todas</SelectItem>
                <SelectItem value="active" className="pl-3">Activadas</SelectItem>
                <SelectItem value="inactive" className="pl-3">Desactivadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            {/* Vista de tabla para desktop */}
            <table className="min-w-full hidden md:table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vista Previa</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Usado en</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tamaño</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedFiles.map((file) => {
                  const usageCount = imageUsageMap[file.url] || 0
                  return (
                    <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={file.active}
                            onCheckedChange={() => toggleImageActive(file.url)}
                          />
                          <span className={`text-sm ${file.active ? 'text-green-600' : 'text-gray-400'}`}>
                            {file.active ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {usageCount > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {usageCount} {usageCount === 1 ? 'lugar' : 'lugares'}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Sin usar</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatBytes(file.size)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(file.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteImage(file.url)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                          title={usageCount > 0 ? 'No se puede eliminar (en uso)' : 'Eliminar imagen'}
                          disabled={usageCount > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Vista de tarjetas para móvil */}
            <div className="md:hidden space-y-3 px-4">
              {displayedFiles.map((file) => {
                const usageCount = imageUsageMap[file.url] || 0
                return (
                  <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Información */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{file.name}</h3>
                          <button
                            onClick={() => handleDeleteImage(file.url)}
                            className="text-red-600 hover:text-red-700 p-1.5 rounded flex-shrink-0"
                            title={usageCount > 0 ? 'No se puede eliminar (en uso)' : 'Eliminar imagen'}
                            disabled={usageCount > 0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(file.created_at).toLocaleDateString()}
                            </span>
                            <span>{formatBytes(file.size)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={file.active}
                                onCheckedChange={() => toggleImageActive(file.url)}
                                className="scale-75"
                              />
                              <span className={`text-xs ${file.active ? 'text-green-600' : 'text-gray-400'}`}>
                                {file.active ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                            
                            {usageCount > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {usageCount} {usageCount === 1 ? 'lugar' : 'lugares'}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Sin usar</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Mensaje sin resultados */}
          {filteredFiles.length === 0 && mediaFiles.length > 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron imágenes con los filtros aplicados</p>
            </div>
          )}
        </div>
      )}

      {/* Estado vacío */}
      {mediaFiles.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay imágenes en la galería
          </h3>
          <p className="text-gray-600">
            Sube tu primera imagen usando el gestor de arriba
          </p>
        </div>
      )}
    </div>
  )
}

