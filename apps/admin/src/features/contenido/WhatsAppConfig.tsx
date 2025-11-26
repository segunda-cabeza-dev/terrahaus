import { useEffect, useState } from 'react'
import { supabase, USE_MOCK_DATA, mockData, type SiteContent } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { useToast } from '@beltrame/shared'
import { PageHeader } from '../../shared'


export default function WhatsAppConfig() {
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappId, setWhatsappId] = useState<number|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWhatsapp();
  }, []);

  const loadWhatsapp = async () => {
    try {
      let allContent: SiteContent[] = [];
      if (USE_MOCK_DATA) {
        allContent = mockData.siteContent;
      } else {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .order('seccion')
          .order('clave');
        if (error) throw error;
        allContent = data || [];
      }
      let whatsappContent = allContent.find(c => c.seccion === 'config' && c.clave === 'whatsapp');
      if (!whatsappContent && !USE_MOCK_DATA) {
        // Si no existe, lo creamos con el número por defecto
        const defaultWhatsapp = '+34 688 860 838';
        const { data, error } = await supabase
          .from('site_content')
          .insert([{ seccion: 'config', clave: 'whatsapp', valor: defaultWhatsapp, tipo: 'texto' }])
          .select();
        if (!error && data && data[0]) {
          whatsappContent = data[0];
        }
      }
      if (whatsappContent) {
        setWhatsapp(whatsappContent.valor);
        setWhatsappId(whatsappContent.id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el número de WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!whatsappId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ valor: whatsapp, updated_at: new Date().toISOString() })
        .eq('id', whatsappId);
      if (error) throw error;
      toast({ 
        title: 'Configuración guardada',
        description: 'El número de WhatsApp ha sido actualizado',
        className: 'bg-green-600 text-white border-green-600',
      });
      await loadWhatsapp();
    } catch (error) {
      toast({ 
        title: 'Error al guardar', 
        description: 'No se pudo actualizar el número', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
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
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: +34 688 860 838"
                className="mt-1"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Incluye el código de país (ej: +34 para España)
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || !whatsapp.trim() || !whatsappId}
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
