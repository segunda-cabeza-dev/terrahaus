import { useEffect, useState } from 'react'
import { supabase, USE_MOCK_DATA, mockData, type SiteContent } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@beltrame/shared/ui/card'
import { useToast } from '@beltrame/shared'


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
      toast({ title: 'WhatsApp actualizado', description: 'El número de WhatsApp se ha guardado correctamente.' });
      await loadWhatsapp();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar el número de WhatsApp', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-start justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-xl bg-white border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-12 h-12" />
          <div>
            <CardTitle className="text-left">WhatsApp de contacto en la web</CardTitle>
            <CardDescription className="text-left">Este número aparecerá como botón flotante en la web</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col sm:flex-row gap-2 items-center sm:items-end justify-start w-full"
            onSubmit={e => { e.preventDefault(); handleSave(); }}
          >
            <Input
              type="text"
              className="border rounded px-2 py-2 w-full max-w-xs text-lg bg-white"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="Ej: +34 688 860 838"
              disabled={saving}
            />
            <Button
              size="lg"
              disabled={saving || !whatsappId}
              type="submit"
              className="ml-0 sm:ml-2 w-full sm:w-auto bg-black text-white hover:bg-neutral-800"
              style={{minWidth: 130, paddingLeft: 28, paddingRight: 28, paddingTop: 12, paddingBottom: 12}}
            >
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
