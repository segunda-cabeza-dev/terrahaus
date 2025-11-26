import { useState } from 'react'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { useToast } from '@beltrame/shared'
import { PageHeader } from '../../shared'

export default function WhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState('+34 688 860 838')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 500))
      toast({
        title: 'Configuración guardada',
        description: 'El número de WhatsApp ha sido actualizado',
        className: 'bg-green-600 text-white border-green-600',
      })
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudo actualizar el número',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración de WhatsApp"
        description="Configura el número de contacto que aparecerá como botón flotante en tu sitio web"
      />
      
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Número de teléfono
              </Label>
              <Input
                id="phone"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ej: +34 688 860 838"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Incluye el código de país (ej: +34 para España)
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || !phoneNumber.trim()}
                className="bg-black hover:bg-gray-800 text-white px-6"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Vista previa:</span> Los visitantes verán un botón flotante verde en la esquina inferior derecha con este número.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
