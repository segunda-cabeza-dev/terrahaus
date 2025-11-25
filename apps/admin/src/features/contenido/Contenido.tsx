import { useEffect, useState } from 'react'
import { supabase, USE_MOCK_DATA, mockData, type SiteContent } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beltrame/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@beltrame/shared/ui/tabs'
import { useToast } from '@beltrame/shared'
import { Save, Plus } from 'lucide-react'

export default function Contenido() {
  // ...existing code...
  const [contents, setContents] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    seccion: '',
    clave: '',
    valor: '',
    tipo: 'texto' as 'texto' | 'imagen' | 'html',
  })
  const { toast } = useToast()

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    try {
      let allContent: SiteContent[] = [];
      if (USE_MOCK_DATA) {
        allContent = mockData.siteContent;
      } else {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .order('seccion')
          .order('clave')
        if (error) throw error;
        allContent = data || [];
      }
      setContents(allContent);
      // Buscar whatsapp config
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
          if (whatsappContent) {
            allContent = [...allContent, whatsappContent];
            setContents(allContent);
          }
        }
      }
    } catch (error) {
      console.error('Error loading contents:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el contenido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (content: SiteContent) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          valor: content.valor,
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id)

      if (error) throw error

      // Eliminado setWhatsapp, ya no es necesario

      toast({
        title: 'Guardado',
        description: 'Los cambios se han guardado correctamente',
      })
      await loadContents()
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el contenido',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_content')
        .insert([{
          seccion: formData.seccion,
          clave: formData.clave,
          valor: formData.valor,
          tipo: formData.tipo,
        }])

      if (error) throw error

      toast({
        title: 'Creado',
        description: 'El contenido se ha creado correctamente',
      })
      setShowForm(false)
      setFormData({ seccion: '', clave: '', valor: '', tipo: 'texto' })
      await loadContents()
    } catch (error) {
      console.error('Error creating content:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el contenido',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const updateContentValue = (id: number, newValue: string) => {
    setContents(contents.map(c => 
      c.id === id ? { ...c, valor: newValue } : c
    ))
  }

  // Agrupar contenidos por sección
  const sections = Array.from(new Set(contents.map(c => c.seccion)))

  // Estados y lógica para los campos de INICIO (después de contents)
  const titulo = contents.find(c => c.seccion === 'inicio' && c.clave === 'titulo-principal');
  const subtitulo = contents.find(c => c.seccion === 'inicio' && c.clave === 'subtitulo');
  const servicios = contents.find(c => c.seccion === 'inicio' && c.clave === 'servicios');
  const materiales = contents.find(c => c.seccion === 'inicio' && c.clave === 'materiales');

  const [tituloValor, setTituloValor] = useState('');
  const [subtituloValor, setSubtituloValor] = useState('');
  const [serviciosValor, setServiciosValor] = useState('');
  const [materialesValor, setMaterialesValor] = useState('');

  useEffect(() => { if (titulo) setTituloValor(titulo.valor); }, [titulo && titulo.valor]);
  useEffect(() => { if (subtitulo) setSubtituloValor(subtitulo.valor); }, [subtitulo && subtitulo.valor]);
  useEffect(() => { if (servicios) setServiciosValor(servicios.valor); }, [servicios && servicios.valor]);
  useEffect(() => { if (materiales) setMaterialesValor(materiales.valor); }, [materiales && materiales.valor]);

  const guardarTituloSubtitulo = async () => {
    if (titulo && titulo.valor !== tituloValor) await handleSave({ ...titulo, valor: tituloValor });
    if (subtitulo && subtitulo.valor !== subtituloValor) await handleSave({ ...subtitulo, valor: subtituloValor });
  };
  const guardarServicios = async () => {
    if (servicios && servicios.valor !== serviciosValor) await handleSave({ ...servicios, valor: serviciosValor });
  };
  const guardarMateriales = async () => {
    if (materiales && materiales.valor !== materialesValor) await handleSave({ ...materiales, valor: materialesValor });
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
  <div className="space-y-6">
      {USE_MOCK_DATA && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800">
            🎮 Modo DEMO - Mostrando contenido de ejemplo
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Los cambios no se guardarán permanentemente en modo demo
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Contenido</h1>
          <p className="text-gray-600 mt-2">Edita los textos del sitio web</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-black text-white hover:bg-gray-900">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contenido
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Nuevo Contenido</CardTitle>
            <CardDescription>
              Crea un nuevo elemento de contenido editable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seccion">Sección</Label>
                  <Input
                    id="seccion"
                    placeholder="ej: inicio, quienes-somos"
                    value={formData.seccion}
                    onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clave">Clave</Label>
                  <Input
                    id="clave"
                    placeholder="ej: titulo-principal, descripcion"
                    value={formData.clave}
                    onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  placeholder="El texto que se mostrará"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={saving} className="bg-black text-white hover:bg-gray-900">
                  {saving ? 'Creando...' : 'Crear'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-black text-white hover:bg-gray-900"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={sections[0] || 'all'}>
        <TabsList className="border-b border-gray-200">
          <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-bold data-[state=active]:text-black px-4 py-2 transition-colors">
            Todos
          </TabsTrigger>
          {sections.map(section => (
            <TabsTrigger
              key={section}
              value={section}
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-bold data-[state=active]:text-black px-4 py-2 transition-colors"
            >
              {section}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {contents.map((content) => (
            <Card key={content.id} className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {content.seccion} / {content.clave}
                    </CardTitle>
                    <CardDescription>
                      Tipo: {content.tipo} • Última actualización:{' '}
                      {new Date(content.updated_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contenido</Label>
                  {content.tipo === 'html' ? (
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      value={content.valor}
                      onChange={(e) => updateContentValue(content.id, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={content.valor}
                      onChange={(e) => updateContentValue(content.id, e.target.value)}
                    />
                  )}
                </div>
                <Button
                  onClick={() => handleSave(content)}
                  disabled={saving}
                  size="sm"
                  className="bg-black text-white hover:bg-gray-900"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* INICIO: Subtítulo, Título, Servicios, Materiales */}
        <TabsContent value="inicio" className="space-y-4">
          {/* Card: Título y Subtítulo */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Título y Subtítulo</CardTitle>
              {(titulo || subtitulo) && (
                <CardDescription>
                </CardDescription>
              )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título principal</Label>
                  {titulo ? (
                    <Input value={tituloValor} onChange={e => setTituloValor(e.target.value)} />
                  ) : (
                    <span className="text-gray-400">No hay título.</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  {subtitulo ? (
                    <Input value={subtituloValor} onChange={e => setSubtituloValor(e.target.value)} />
                  ) : (
                    <span className="text-gray-400">No hay subtítulo.</span>
                  )}
                </div>
                <Button onClick={guardarTituloSubtitulo} disabled={saving} size="sm" className="bg-black text-white hover:bg-gray-900">
                  Guardar cambios
                </Button>
              </CardContent>
            </Card>

          {/* Card: Servicios */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                {servicios ? (
                  <Input
                    value={serviciosValor}
                    onChange={e => setServiciosValor(e.target.value)}
                    placeholder="Ejemplo: Corte láser, herrería, diseño personalizado..."
                  />
                ) : (
                  <span className="text-gray-400">No hay servicios.</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Texto</Label>
                {servicios ? (
                  <textarea
                    className="w-full min-h-[80px] p-2 border rounded-md"
                    value={serviciosValor}
                    onChange={e => setServiciosValor(e.target.value)}
                    placeholder="Ejemplo: Descripción de los servicios que ofrece la empresa."
                  />
                ) : (
                  <span className="text-gray-400">No hay servicios.</span>
                )}
              </div>
              <Button onClick={guardarServicios} disabled={saving} size="sm" className="bg-black text-white hover:bg-gray-900">
                Guardar cambios
              </Button>
            </CardContent>
          </Card>

          {/* Card: Materiales */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Materiales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                {materiales ? (
                  <Input
                    value={materialesValor}
                    onChange={e => setMaterialesValor(e.target.value)}
                    placeholder="Ejemplo: Acero, aluminio, madera, acrílico..."
                  />
                ) : (
                  <span className="text-gray-400">No hay materiales.</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Texto</Label>
                {materiales ? (
                  <textarea
                    className="w-full min-h-[80px] p-2 border rounded-md"
                    value={materialesValor}
                    onChange={e => setMaterialesValor(e.target.value)}
                    placeholder="Ejemplo: Descripción de los materiales que utiliza la empresa."
                  />
                ) : (
                  <span className="text-gray-400">No hay materiales.</span>
                )}
              </div>
              <Button onClick={guardarMateriales} disabled={saving} size="sm" className="bg-black text-white hover:bg-gray-900">
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROYECTOS: solo título */}
        <TabsContent value="proyectos" className="space-y-4">
          {(() => {
            const content = contents.find(c => c.seccion === 'proyectos' && c.clave === 'titulo');
            return (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Título de Proyectos</CardTitle>
                  {content && (
                    <CardDescription>
                      Última actualización: {new Date(content.updated_at).toLocaleDateString()}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    {content ? (
                      <Input
                        value={content.valor}
                        onChange={e => updateContentValue(content.id, e.target.value)}
                      />
                    ) : (
                      <span className="text-gray-400">No hay contenido para este campo.</span>
                    )}
                  </div>
                  {content && (
                    <Button
                      onClick={() => handleSave(content)}
                      disabled={saving}
                      size="sm"
                      className="bg-black text-white hover:bg-gray-900"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>

        {/* RESTO DE SECCIONES (igual que antes) */}
        {sections.filter(section => section !== 'inicio' && section !== 'proyectos').map(section => (
          <TabsContent key={section} value={section} className="space-y-4">
            {contents
              .filter(c => c.seccion === section)
              .map((content) => (
                <Card key={content.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{content.clave}</CardTitle>
                    <CardDescription>
                      Última actualización:{' '}
                      {new Date(content.updated_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Contenido</Label>
                      {content.tipo === 'html' ? (
                        <textarea
                          className="w-full min-h-[100px] p-2 border rounded-md"
                          value={content.valor}
                          onChange={(e) => updateContentValue(content.id, e.target.value)}
                        />
                      ) : (
                        <Input
                          value={content.valor}
                          onChange={(e) => updateContentValue(content.id, e.target.value)}
                        />
                      )}
                    </div>
                    <Button
                      onClick={() => handleSave(content)}
                      disabled={saving}
                      size="sm"
                      className="bg-black text-white hover:bg-gray-900"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {contents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">
              No hay contenido creado. Haz clic en "Nuevo Contenido" para comenzar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
