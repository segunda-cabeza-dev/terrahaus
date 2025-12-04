import { useState } from 'react';
import { supabase, useToast } from '@beltrame/shared';
import { Button } from '@beltrame/shared/ui/button';
import { Loader2, Languages, CheckCircle, AlertCircle } from 'lucide-react';

interface TraduccionEstado {
  tipo: 'categoria' | 'proyecto';
  id: number;
  nombre: string;
  estado: 'pendiente' | 'traduciendo' | 'completado' | 'error';
  mensaje?: string;
}

export function TraduccionMasiva() {
  const { toast } = useToast();
  const [traduciendo, setTraduciendo] = useState(false);
  const [progreso, setProgreso] = useState<TraduccionEstado[]>([]);
  const [resumen, setResumen] = useState({ total: 0, exitosos: 0, errores: 0 });

  // Función para traducir texto
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (!text || !text.trim()) return text;
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      if (!response.ok) return text;
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

  // Función para esperar un tiempo (para no saturar la API)
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const iniciarTraduccionMasiva = async () => {
    if (!confirm('⚠️ ATENCIÓN: Esto traducirá TODAS las categorías y proyectos que tengan texto en español. ¿Deseas continuar?')) {
      return;
    }

    setTraduciendo(true);
    setProgreso([]);
    setResumen({ total: 0, exitosos: 0, errores: 0 });

    try {
      // 1. Obtener todas las categorías
      const { data: categorias, error: catError } = await supabase
        .from('categories')
        .select('id, slug');

      if (catError) throw catError;

      // 2. Obtener todos los proyectos
      const { data: proyectos, error: projError } = await supabase
        .from('projects')
        .select('id, slug');

      if (projError) throw projError;

      // 3. Obtener todas las traducciones existentes
      const { data: traduccionesExistentes, error: transError } = await supabase
        .from('translations')
        .select('*');

      if (transError) throw transError;

      const totalItems = (categorias?.length || 0) + (proyectos?.length || 0);
      setResumen(prev => ({ ...prev, total: totalItems }));

      toast({
        title: '🚀 Iniciando traducción masiva',
        description: `${totalItems} elementos para procesar`,
        duration: 3000,
      });

      let exitosos = 0;
      let errores = 0;

      // ==================== TRADUCIR CATEGORÍAS ====================
      for (const categoria of categorias || []) {
        const estadoInicial: TraduccionEstado = {
          tipo: 'categoria',
          id: categoria.id,
          nombre: categoria.slug,
          estado: 'traduciendo',
        };
        setProgreso(prev => [...prev, estadoInicial]);

        try {
          // Obtener traducciones de esta categoría
          const catTranslations = traduccionesExistentes?.filter(
            t => t.entity_type === 'category' && t.entity_id === categoria.id
          ) || [];

          const nombreES = catTranslations.find(t => t.language_code === 'es' && t.field_name === 'name')?.value || '';

          if (!nombreES || !nombreES.trim()) {
            setProgreso(prev => prev.map(p => 
              p.tipo === 'categoria' && p.id === categoria.id
                ? { ...p, estado: 'error', mensaje: 'Sin nombre en español' }
                : p
            ));
            errores++;
            continue;
          }

          // Verificar qué traducciones faltan
          const nombreEN = catTranslations.find(t => t.language_code === 'en' && t.field_name === 'name')?.value || '';
          const nombreIT = catTranslations.find(t => t.language_code === 'it' && t.field_name === 'name')?.value || '';

          const translations = [];

          // Traducir a inglés si falta
          if (!nombreEN || nombreEN.trim() === '') {
            await wait(100); // Pequeña pausa para no saturar la API
            const traducidoEN = await translateText(nombreES, 'en');
            translations.push({
              entity_type: 'category',
              entity_id: categoria.id,
              language_code: 'en',
              field_name: 'name',
              value: traducidoEN,
            });
          }

          // Traducir a italiano si falta
          if (!nombreIT || nombreIT.trim() === '') {
            await wait(100);
            const traducidoIT = await translateText(nombreES, 'it');
            translations.push({
              entity_type: 'category',
              entity_id: categoria.id,
              language_code: 'it',
              field_name: 'name',
              value: traducidoIT,
            });
          }

          // Guardar traducciones si hay algo que guardar
          if (translations.length > 0) {
            const { error: upsertError } = await supabase
              .from('translations')
              .upsert(translations, {
                onConflict: 'entity_type,entity_id,language_code,field_name'
              });

            if (upsertError) throw upsertError;
          }

          setProgreso(prev => prev.map(p => 
            p.tipo === 'categoria' && p.id === categoria.id
              ? { ...p, estado: 'completado', mensaje: `${translations.length} traducciones` }
              : p
          ));
          exitosos++;

        } catch (error) {
          console.error(`Error traduciendo categoría ${categoria.id}:`, error);
          setProgreso(prev => prev.map(p => 
            p.tipo === 'categoria' && p.id === categoria.id
              ? { ...p, estado: 'error', mensaje: 'Error al traducir' }
              : p
          ));
          errores++;
        }
      }

      // ==================== TRADUCIR PROYECTOS ====================
      for (const proyecto of proyectos || []) {
        const estadoInicial: TraduccionEstado = {
          tipo: 'proyecto',
          id: proyecto.id,
          nombre: proyecto.slug,
          estado: 'traduciendo',
        };
        setProgreso(prev => [...prev, estadoInicial]);

        try {
          // Obtener traducciones de este proyecto
          const projTranslations = traduccionesExistentes?.filter(
            t => t.entity_type === 'project' && t.entity_id === proyecto.id
          ) || [];

          const nombreES = projTranslations.find(t => t.language_code === 'es' && t.field_name === 'name')?.value || '';
          const descripcionES = projTranslations.find(t => t.language_code === 'es' && t.field_name === 'description')?.value || '';

          if (!nombreES || !nombreES.trim()) {
            setProgreso(prev => prev.map(p => 
              p.tipo === 'proyecto' && p.id === proyecto.id
                ? { ...p, estado: 'error', mensaje: 'Sin nombre en español' }
                : p
            ));
            errores++;
            continue;
          }

          // Verificar qué traducciones faltan
          const nombreEN = projTranslations.find(t => t.language_code === 'en' && t.field_name === 'name')?.value || '';
          const nombreIT = projTranslations.find(t => t.language_code === 'it' && t.field_name === 'name')?.value || '';
          const descripcionEN = projTranslations.find(t => t.language_code === 'en' && t.field_name === 'description')?.value || '';
          const descripcionIT = projTranslations.find(t => t.language_code === 'it' && t.field_name === 'description')?.value || '';

          const translations = [];

          // Traducir nombre
          if (!nombreEN || nombreEN.trim() === '') {
            await wait(100);
            const traducidoEN = await translateText(nombreES, 'en');
            translations.push({
              entity_type: 'project',
              entity_id: proyecto.id,
              language_code: 'en',
              field_name: 'name',
              value: traducidoEN,
            });
          }

          if (!nombreIT || nombreIT.trim() === '') {
            await wait(100);
            const traducidoIT = await translateText(nombreES, 'it');
            translations.push({
              entity_type: 'project',
              entity_id: proyecto.id,
              language_code: 'it',
              field_name: 'name',
              value: traducidoIT,
            });
          }

          // Traducir descripción (si existe)
          if (descripcionES && descripcionES.trim()) {
            if (!descripcionEN || descripcionEN.trim() === '') {
              await wait(100);
              const traducidoEN = await translateText(descripcionES, 'en');
              translations.push({
                entity_type: 'project',
                entity_id: proyecto.id,
                language_code: 'en',
                field_name: 'description',
                value: traducidoEN,
              });
            }

            if (!descripcionIT || descripcionIT.trim() === '') {
              await wait(100);
              const traducidoIT = await translateText(descripcionES, 'it');
              translations.push({
                entity_type: 'project',
                entity_id: proyecto.id,
                language_code: 'it',
                field_name: 'description',
                value: traducidoIT,
              });
            }
          }

          // Guardar traducciones si hay algo que guardar
          if (translations.length > 0) {
            const { error: upsertError } = await supabase
              .from('translations')
              .upsert(translations, {
                onConflict: 'entity_type,entity_id,language_code,field_name'
              });

            if (upsertError) throw upsertError;
          }

          setProgreso(prev => prev.map(p => 
            p.tipo === 'proyecto' && p.id === proyecto.id
              ? { ...p, estado: 'completado', mensaje: `${translations.length} traducciones` }
              : p
          ));
          exitosos++;

        } catch (error) {
          console.error(`Error traduciendo proyecto ${proyecto.id}:`, error);
          setProgreso(prev => prev.map(p => 
            p.tipo === 'proyecto' && p.id === proyecto.id
              ? { ...p, estado: 'error', mensaje: 'Error al traducir' }
              : p
          ));
          errores++;
        }
      }

      setResumen({ total: totalItems, exitosos, errores });

      toast({
        title: '✅ Traducción masiva completada',
        description: `${exitosos} exitosos, ${errores} con errores`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Error en traducción masiva:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error durante la traducción masiva',
        variant: 'destructive',
      });
    } finally {
      setTraduciendo(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <Languages className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Traducción Masiva</h1>
            <p className="text-gray-600 mt-1">
              Traduce automáticamente todas las categorías y proyectos a inglés e italiano
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">⚠️ Importante</p>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                <li>Este proceso traducirá TODOS los elementos que tengan texto en español</li>
                <li>Solo se traducirán los campos que estén vacíos en inglés o italiano</li>
                <li>Las traducciones existentes NO se sobrescribirán</li>
                <li>El proceso puede tardar varios minutos dependiendo de la cantidad de datos</li>
              </ul>
            </div>
          </div>
        </div>

        {resumen.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{resumen.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{resumen.exitosos}</p>
              <p className="text-sm text-gray-600">Exitosos</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{resumen.errores}</p>
              <p className="text-sm text-gray-600">Errores</p>
            </div>
          </div>
        )}

        <Button
          onClick={iniciarTraduccionMasiva}
          disabled={traduciendo}
          className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {traduciendo ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Traduciendo... {resumen.exitosos + resumen.errores} / {resumen.total}
            </>
          ) : (
            <>
              <Languages className="w-5 h-5 mr-2" />
              Iniciar Traducción Masiva
            </>
          )}
        </Button>

        {/* Log de progreso */}
        {progreso.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Progreso de traducción:</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {progreso.map((item, index) => (
                <div
                  key={`${item.tipo}-${item.id}-${index}`}
                  className={`flex items-center justify-between py-2 px-3 rounded mb-2 ${
                    item.estado === 'completado'
                      ? 'bg-green-50 border border-green-200'
                      : item.estado === 'error'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.estado === 'completado' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {item.estado === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    {item.estado === 'traduciendo' && (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.tipo === 'categoria' ? '📁' : '📄'} {item.nombre}
                      </p>
                      {item.mensaje && (
                        <p className="text-xs text-gray-600">{item.mensaje}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    item.estado === 'completado'
                      ? 'bg-green-100 text-green-700'
                      : item.estado === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
