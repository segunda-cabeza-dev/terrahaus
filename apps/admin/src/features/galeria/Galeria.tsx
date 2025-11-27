import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '../../shared'
import { galleryService, type GalleryImage, type GalleryCategory, type GalleryFilters } from '@beltrame/shared'
import { Trash2, FileImage, Calendar, Search, RefreshCw, FolderOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useToast } from '@beltrame/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'
import { Button } from '@beltrame/shared/ui/button'

const PAGE_SIZE = 20

export function Galeria() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<GalleryFilters>({})
  const [searchInput, setSearchInput] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery<GalleryCategory[]>({
    queryKey: ['gallery-categories'],
    queryFn: () => galleryService.getCategories(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: result, isLoading, isFetching } = useQuery({
    queryKey: ['gallery-images', page, filters],
    queryFn: () => galleryService.listImagesPaginated(page, PAGE_SIZE, filters),
    placeholderData: (previousData) => previousData,
  })

  const { data: imageUsageMap = {} } = useQuery({
    queryKey: ['gallery-usage', result?.data?.map(i => i.url)],
    queryFn: async () => {
      if (!result?.data?.length) return {}
      const urls = result.data.map(img => img.url)
      return galleryService.calculateAllImageUsage(urls)
    },
    enabled: !!result?.data?.length,
  })

  const images = result?.data || []
  const pagination = result?.pagination || { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0, hasMore: false }

  function handleSearch() {
    setFilters(prev => ({ ...prev, search: searchInput }))
    setPage(1)
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  function handleBucketChange(value: string) {
    setFilters(prev => ({ ...prev, bucket: value === 'all' ? undefined : value }))
    setPage(1)
  }

  function handleCategoryChange(value: string) {
    setFilters(prev => ({ ...prev, categoryId: value === 'all' ? undefined : parseInt(value) }))
    setPage(1)
  }

  async function handleRefresh() {
    galleryService.invalidateImagesCache()
    galleryService.clearCache()
    await queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
    await queryClient.invalidateQueries({ queryKey: ['gallery-usage'] })
    toast({ title: 'Actualizado', description: 'La galeria se ha actualizado' })
  }

  async function handleDeleteImage(image: GalleryImage) {
    const usageCount = imageUsageMap[image.url] || 0
    if (usageCount > 0) {
      toast({ title: 'No se puede eliminar', description: 'Esta imagen esta en uso', variant: 'destructive' })
      return
    }
    if (!confirm('Eliminar ' + image.name + '?')) return
    const success = await galleryService.deleteImage(image.bucket as 'categories' | 'projects' | 'media', image.path)
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
      toast({ title: 'Imagen eliminada', description: 'La imagen ha sido eliminada' })
    } else {
      toast({ title: 'Error', description: 'No se pudo eliminar la imagen', variant: 'destructive' })
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  function getBucketLabel(bucket: string): string {
    switch (bucket) {
      case 'categories': return 'Categorias'
      case 'projects': return 'Proyectos'
      case 'media': return 'Media'
      default: return bucket
    }
  }

  function getBucketColor(bucket: string): string {
    switch (bucket) {
      case 'categories': return 'bg-blue-100 text-blue-800'
      case 'projects': return 'bg-green-100 text-green-800'
      case 'media': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function PaginationControls() {
    const { page: currentPage, totalPages, total } = pagination
    const startItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
    const endItem = Math.min(currentPage * PAGE_SIZE, total)
    if (totalPages <= 1) return null

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> de <span className="font-medium">{total}</span> imagenes
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={currentPage === 1 || isFetching} title="Primera pagina">
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isFetching}>
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Anterior</span>
          </Button>
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm text-gray-600">Pagina</span>
            <select value={currentPage} onChange={(e) => setPage(Number(e.target.value))} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" disabled={isFetching}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">de {totalPages}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isFetching}>
            <span className="hidden sm:inline mr-1">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages || isFetching} title="Ultima pagina">
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Cargando galeria...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Galeria de Imagenes" description="Visualiza y gestiona las imagenes almacenadas en el sistema." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold">{pagination.total}</div>
          <div className="text-sm text-gray-500">Total imagenes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{images.filter(i => i.bucket === 'categories').length}</div>
          <div className="text-sm text-gray-500">En esta pagina (Categorias)</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{images.filter(i => i.bucket === 'projects').length}</div>
          <div className="text-sm text-gray-500">En esta pagina (Proyectos)</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">{images.filter(i => i.bucket === 'media').length}</div>
          <div className="text-sm text-gray-500">En esta pagina (Media)</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Imagenes
            {isFetching && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
          </h2>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={'w-4 h-4 mr-2 ' + (isFetching ? 'animate-spin' : '')} />
            Actualizar
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Buscar por nombre... (Enter para buscar)" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyPress} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
          </div>
          <Button variant="default" onClick={handleSearch} disabled={isFetching}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
          <Select value={filters.bucket || 'all'} onValueChange={handleBucketChange}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 h-[42px]">
              <SelectValue placeholder="Bucket" />
            </SelectTrigger>
            <SelectContent className="bg-white p-2">
              <SelectItem value="all" className="pl-3">Todos</SelectItem>
              <SelectItem value="categories" className="pl-3">Categorias</SelectItem>
              <SelectItem value="projects" className="pl-3">Proyectos</SelectItem>
              <SelectItem value="media" className="pl-3">Media</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.categoryId?.toString() || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 h-[42px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-white p-2 max-h-[300px] overflow-y-auto">
              <SelectItem value="all" className="pl-3">Todas las categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()} className="pl-3">{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {images.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full hidden md:table">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vista Previa</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Bucket</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Usado en</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tamano</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => {
                    const usageCount = imageUsageMap[image.url] || 0
                    return (
                      <tr key={image.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                            <img src={image.url} alt={image.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileImage className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-900 truncate max-w-[200px]" title={image.name}>{image.name}</div>
                              <div className="text-xs text-gray-400 truncate max-w-[200px]" title={image.path}>{image.path}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getBucketColor(image.bucket)}>
                            <FolderOpen className="w-3 h-3 mr-1" />
                            {getBucketLabel(image.bucket)}
                          </span>
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
                          <span className="text-sm text-gray-600">{formatBytes(image.size)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteImage(image)} className={'p-2 rounded transition-colors ' + (usageCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-700 hover:bg-red-50')} title={usageCount > 0 ? 'No se puede eliminar (en uso)' : 'Eliminar imagen'} disabled={usageCount > 0}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="md:hidden space-y-3">
                {images.map((image) => {
                  const usageCount = imageUsageMap[image.url] || 0
                  return (
                    <div key={image.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shadow-sm flex-shrink-0 bg-gray-100">
                          <img src={image.url} alt={image.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">{image.name}</h3>
                            <button onClick={() => handleDeleteImage(image)} className={'p-1.5 rounded flex-shrink-0 ' + (usageCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-700')} disabled={usageCount > 0}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600">
                            <span className={'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + getBucketColor(image.bucket)}>{getBucketLabel(image.bucket)}</span>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(image.created_at).toLocaleDateString()}
                              </span>
                              <span>{formatBytes(image.size)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <PaginationControls />
          </>
        ) : (
          <div className="text-center py-12">
            {pagination.total === 0 ? (
              <>
                <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay imagenes en la galeria</h3>
                <p className="text-gray-600">Importa categorias o proyectos para ver las imagenes aqui</p>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron imagenes con los filtros aplicados</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
