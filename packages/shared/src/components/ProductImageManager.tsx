import { useState, useRef } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { mediaService } from '../services/media.service'
import { useToast } from '../hooks/use-toast'

interface ProductImageManagerProps {
  images: string[]
  onChange: (newImages: string[]) => void
}

export function ProductImageManager({ images, onChange }: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Error',
            description: `${file.name} no es una imagen válida`,
            variant: 'destructive'
          })
          continue
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Error',
            description: `${file.name} es demasiado grande (máx. 5MB)`,
            variant: 'destructive'
          })
          continue
        }

        const result = await mediaService.uploadFile(file, 'images')
        
        if (result.error) {
          toast({
            title: 'Error al subir imagen',
            description: result.error,
            variant: 'destructive'
          })
        } else {
          newImages.push(result.url)
        }
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages])
        toast({
          title: 'Imágenes subidas',
          description: `Se ${newImages.length === 1 ? 'ha subido' : 'han subido'} ${newImages.length} imagen${newImages.length === 1 ? '' : 'es'} correctamente`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al subir las imágenes',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index]
    
    // Intentar eliminar del storage
    try {
      await mediaService.deleteFileByUrl(imageUrl)
    } catch (error) {
      console.error('Error deleting image:', error)
    }

    // Actualizar estado
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
    
    toast({
      title: 'Imagen eliminada',
      description: 'La imagen ha sido eliminada correctamente'
    })
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {images.length === 0 ? (
        // Sin imágenes - Mostrar solo el botón de agregar
        <button
          type="button"
          onClick={handleAddClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={uploading}
          className={`
            w-full h-64 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-3
            transition-colors
            ${dragActive ? 'border-black bg-gray-50' : 'border-gray-300'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-black hover:bg-gray-50 cursor-pointer'}
          `}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : (
            <>
              <Plus className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Arrastra imágenes aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP hasta 5MB
                </p>
              </div>
            </>
          )}
        </button>
      ) : (
        // Con imágenes - Grid compacto estilo WordPress Media Library
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {/* Todas las imágenes en grid uniforme pequeño */}
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square w-full rounded overflow-hidden border border-gray-200 group cursor-pointer hover:border-blue-500 transition-colors">
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}

          {/* Botón para añadir más imágenes */}
          <button
            type="button"
            onClick={handleAddClick}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={uploading}
            className={`
              aspect-square w-full border-2 border-dashed rounded
              flex flex-col items-center justify-center
              transition-colors
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50 cursor-pointer'}
            `}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
