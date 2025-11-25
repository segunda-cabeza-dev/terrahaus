import { useEffect, useState } from 'react'
import { supabase, USE_MOCK_DATA, mockData } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beltrame/shared/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@beltrame/shared/ui/alert-dialog'
import { useToast } from '@beltrame/shared'
import { Upload, Trash2, Copy, ExternalLink } from 'lucide-react'

interface ImageFile {
  name: string
  url: string
  size: number
  created_at: string
}

export default function Imagenes() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Usar datos mock
        setImages(mockData.images)
      } else {
        // Lista archivos del bucket de imágenes
        const { data, error } = await supabase
          .storage
          .from('images')
          .list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
          })

        if (error) throw error

        // Obtener URLs públicas para cada imagen
        const imagesWithUrls = await Promise.all(
          (data || []).map(async (file) => {
            const { data: urlData } = supabase
              .storage
              .from('images')
              .getPublicUrl(file.name)

            return {
              name: file.name,
              url: urlData.publicUrl,
              size: file.metadata?.size || 0,
              created_at: file.created_at || new Date().toISOString(),
            }
          })
        )

        setImages(imagesWithUrls)
      }
    } catch (error) {
      console.error('Error loading images:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las imágenes',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Por favor selecciona un archivo de imagen',
          variant: 'destructive',
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      // Crear un nombre único para el archivo
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error } = await supabase
        .storage
        .from('images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha subido correctamente',
      })
      setSelectedFile(null)
      // Limpiar el input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      await loadImages()
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase
        .storage
        .from('images')
        .remove([fileName])

      if (error) throw error

      toast({
        title: 'Imagen eliminada',
        description: 'La imagen se ha eliminado correctamente',
      })
      await loadImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la imagen',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copiado',
      description: 'URL copiada al portapapeles',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      {USE_MOCK_DATA && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800">
            🎮 Modo DEMO - Mostrando imágenes de ejemplo
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Las funciones de subir/eliminar están deshabilitadas en modo demo
          </p>
        </div>
      )}
      
      <div>
        <h1 className="text-3xl font-bold">Gestión de Imágenes</h1>
        <p className="text-gray-600 mt-2">Sube y administra las imágenes del sitio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir Nueva Imagen</CardTitle>
          <CardDescription>
            Selecciona una imagen para subir al servidor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Seleccionar archivo</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Archivo seleccionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.name} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(image.size)} •{' '}
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(image.url)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. La imagen se eliminará
                        permanentemente del servidor.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(image.name)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">
              No hay imágenes. Sube tu primera imagen para comenzar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
