import { useState } from 'react'
import { ProductImageManager } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { useToast } from '@beltrame/shared'

interface ProductFormData {
  nombre: string
  descripcion: string
  precio: number
  images: string[]
}

export function ProductFormExample() {
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: '',
    descripcion: '',
    precio: 0,
    images: []
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!formData.nombre.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre es obligatorio',
        variant: 'destructive'
      })
      return
    }

    if (formData.images.length === 0) {
      toast({
        title: 'Advertencia',
        description: 'El producto no tiene imágenes',
        variant: 'destructive'
      })
      return
    }

    // Aquí guardarías en Supabase
    console.log('Producto a guardar:', formData)
    
    toast({
      title: 'Producto guardado',
      description: `${formData.nombre} ha sido guardado correctamente`
    })

    // Reset del formulario
    setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      images: []
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Información Básica</h2>
          
          <div>
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Barandilla de hierro forjado"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el producto..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <Label htmlFor="precio">Precio (€)</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Imágenes del producto */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Imágenes del Producto</h2>
          <p className="text-sm text-gray-600">
            La primera imagen será la imagen principal del producto
          </p>
          
          <ProductImageManager
            images={formData.images}
            onChange={(newImages) => setFormData({ ...formData, images: newImages })}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">
            Guardar Producto
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setFormData({ nombre: '', descripcion: '', precio: 0, images: [] })}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Preview de datos */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Preview de datos:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}
