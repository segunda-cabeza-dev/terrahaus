import { useState } from 'react';
import { supabase, galleryService } from '@beltrame/shared';
import { Button } from '@beltrame/shared/ui/button';
import { Input } from '@beltrame/shared/ui/input';
import { Label } from '@beltrame/shared/ui/label';
import { useToast } from '@beltrame/shared';
import { ArrowLeft, Loader2, Image as ImageIcon, X } from 'lucide-react';

interface CategoriaNuevaProps {
  onBack: () => void;
}

export function CategoriaNueva({ onBack }: CategoriaNuevaProps) {
  const [saving, setSaving] = useState(false);
  const [activeLanguageTab, setActiveLanguageTab] = useState<'ES' | 'EN' | 'IT'>('ES');
  const [showImageSourceDialog, setShowImageSourceDialog] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ id: string | number; url: string; name: string }[]>([]);
  const [loadingGalleryImages, setLoadingGalleryImages] = useState(false);
  const [gallerySearchTerm, setGallerySearchTerm] = useState('');
  
  const [form, setForm] = useState({
    nombre: '',
    nombre_en: '',
    nombre_it: '',
    imagen_portada: '',
  });

  const { toast } = useToast();

  const handleTranslateCategory = async () => {
    if (!form.nombre.trim()) {
      toast({
        title: 'Error',
        description: 'Escribe primero el nombre en español',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    toast({
      title: '🔄 Traduciendo...',
      description: 'Usando IA para traducción',
      duration: 2000,
    });

    try {
      const translateText = async (text: string, targetLang: string): Promise<string> => {
        try {
          const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(
              text
            )}`
          );

          if (!response.ok) {
            console.error(`Translation API error for ${targetLang}:`, response.status);
            return text;
          }

          const data = await response.json();

          if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
          }

          return text;
        } catch (error) {
          console.error(`Translation error for ${targetLang}:`, error);
          return text;
        }
      };

      const [nombreEN, nombreIT] = await Promise.all([
        translateText(form.nombre, 'en'),
        translateText(form.nombre, 'it'),
      ]);

      setForm((prev) => ({
        ...prev,
        nombre_en: nombreEN,
        nombre_it: nombreIT,
      }));

      toast({
        title: '✨ Traducción completada',
        description: 'Revisa las traducciones antes de guardar',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error translating:', error);
      toast({
        title: 'Error al traducir',
        description: 'Intenta nuevamente',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!form.nombre.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre en español es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Crear slug desde el nombre en español
      const slug = form.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Crear categoría
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .insert({
          slug,
          cover_image_url: form.imagen_portada || null,
          display_order: 999,
          is_active: true,
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Crear traducciones
      const translations = [
        { language_code: 'es', field_name: 'name', value: form.nombre },
        { language_code: 'en', field_name: 'name', value: form.nombre_en || '' },
        { language_code: 'it', field_name: 'name', value: form.nombre_it || '' },
      ];

      for (const translation of translations) {
        const { error } = await supabase
          .from('translations')
          .insert({
            entity_type: 'category',
            entity_id: categoryData.id,
            language_code: translation.language_code,
            field_name: translation.field_name,
            value: translation.value,
          });

        if (error) throw error;
      }

      toast({
        title: '✅ Categoría creada',
        description: 'La nueva categoría se creó correctamente',
      });

      setTimeout(() => {
        onBack();
      }, 500);
    } catch (error) {
      console.error('Error creando categoría:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la categoría',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddImageFromComputer = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setSaving(true);
        const uploadedImage = await galleryService.uploadImage(file);
        setForm(prev => ({ ...prev, imagen_portada: uploadedImage.url }));
        setShowImageSourceDialog(false);
        toast({
          title: '✅ Imagen subida',
          description: 'La imagen se subió correctamente',
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error',
          description: 'No se pudo subir la imagen',
          variant: 'destructive',
        });
      } finally {
        setSaving(false);
      }
    };
    input.click();
  };

  const handleAddImageFromGallery = () => {
    setShowImageSourceDialog(false);
    setShowGalleryModal(true);
    loadGalleryImages();
  };

  const loadGalleryImages = async () => {
    if (galleryImages.length > 0) return;
    setLoadingGalleryImages(true);
    try {
      const result = await galleryService.listAllImages();
      setGalleryImages(result.map(img => ({
        id: img.id,
        url: img.url,
        name: img.name.replace(/\.[^/.]+$/, '')
      })));
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setLoadingGalleryImages(false);
    }
  };

  const filteredGalleryImages = galleryImages.filter(img =>
    img.name.toLowerCase().includes(gallerySearchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Cancelar</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>
        <p className="text-sm text-gray-600 mt-1">Completa la información para crear una nueva categoría</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
        {/* Foto de Portada */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Foto de Portada</h3>
            
            {form.imagen_portada ? (
              <div className="relative group border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={form.imagen_portada}
                  alt="Portada"
                  className="w-full aspect-video object-cover"
                />
                <button
                  onClick={() => setForm(prev => ({ ...prev, imagen_portada: '' }))}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm mb-4">Sin foto de portada</p>
                <Button
                  onClick={() => setShowImageSourceDialog(true)}
                  variant="outline"
                  size="sm"
                >
                  Seleccionar Foto
                </Button>
              </div>
            )}
            
            <p className="text-xs text-gray-500 italic mt-2">
              💡 Esta imagen se mostrará como portada de la categoría
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {/* Botón de traducción */}
          {form.nombre && activeLanguageTab !== 'ES' && (
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleTranslateCategory}
                disabled={saving || !form.nombre}
                size="sm"
                className={`text-white ${
                  saving
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                {saving ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1.5 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Traduciendo...
                  </>
                ) : (
                  <>✨ Traducir con IA</>
                )}
              </Button>
            </div>
          )}

          {/* Tabs de idiomas */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveLanguageTab('ES')}
              className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${
                activeLanguageTab === 'ES'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">🇪🇸</span>
              <span>ES</span>
            </button>
            <button
              onClick={() => setActiveLanguageTab('EN')}
              className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${
                activeLanguageTab === 'EN'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">🇬🇧</span>
              <span>EN</span>
            </button>
            <button
              onClick={() => setActiveLanguageTab('IT')}
              className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${
                activeLanguageTab === 'IT'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">🇮🇹</span>
              <span>IT</span>
            </button>
          </div>

          <div>
            <Label htmlFor={`nombre-${activeLanguageTab}`} className="text-sm">
              Nombre {activeLanguageTab === 'ES' && '*'}
            </Label>
            <Input
              id={`nombre-${activeLanguageTab}`}
              value={
                activeLanguageTab === 'ES'
                  ? form.nombre
                  : activeLanguageTab === 'EN'
                  ? form.nombre_en
                  : form.nombre_it
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [activeLanguageTab === 'ES'
                    ? 'nombre'
                    : activeLanguageTab === 'EN'
                    ? 'nombre_en'
                    : 'nombre_it']: e.target.value,
                }))
              }
              placeholder={`Nombre de la categoría`}
              className="text-base"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreate}
              disabled={saving || !form.nombre.trim()}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                '+ Crear Categoría'
              )}
            </Button>
            <Button
              onClick={onBack}
              disabled={saving}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de selección de fuente de imagen */}
      {showImageSourceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageSourceDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Agregar Imagen</h2>
            <p className="text-gray-600 mb-6">¿Desde dónde quieres agregar la imagen?</p>
            
            <div className="space-y-3">
              <button
                onClick={handleAddImageFromComputer}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Subir desde mi computadora</p>
                  <p className="text-sm text-gray-500">Seleccionar archivos locales</p>
                </div>
              </button>
              
              <button
                onClick={handleAddImageFromGallery}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Galería del Admin</p>
                  <p className="text-sm text-gray-500">Usar imágenes ya subidas</p>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowImageSourceDialog(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de galería */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Seleccionar imagen de portada</h2>
                <button
                  onClick={() => setShowGalleryModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <Input
                placeholder="Buscar imágenes..."
                value={gallerySearchTerm}
                onChange={(e) => setGallerySearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingGalleryImages ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGalleryImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setForm(prev => ({ ...prev, imagen_portada: img.url }));
                        setShowGalleryModal(false);
                      }}
                      className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
                    >
                      <img src={img.url} alt={img.name} className="w-full aspect-video object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <Button onClick={() => setShowGalleryModal(false)} variant="outline" className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
